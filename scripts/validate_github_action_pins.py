#!/usr/bin/env python3
"""Fail CI when a third-party GitHub Action is not pinned to a full commit SHA."""
from pathlib import Path
import re
import sys

WORKFLOWS_DIR = Path(".github/workflows")
USES_PATTERN = re.compile(r"^\s*uses:\s*([^\s#]+)", re.MULTILINE)
SHA_PATTERN = re.compile(r"^[0-9a-fA-F]{40}$")


def main() -> int:
    workflow_files = sorted(WORKFLOWS_DIR.glob("*.yml")) + sorted(WORKFLOWS_DIR.glob("*.yaml"))
    if not workflow_files:
        print("No GitHub Actions workflow files found.", file=sys.stderr)
        return 1

    failures = []
    checked = 0
    for workflow in workflow_files:
        content = workflow.read_text(encoding="utf-8")
        for match in USES_PATTERN.finditer(content):
            reference = match.group(1).strip("\\\"'")
            line_number = content.count("\n", 0, match.start()) + 1
            if reference.startswith("./") or reference.startswith("docker://"):
                continue
            checked += 1
            if "@" not in reference:
                failures.append(f"{workflow}:{line_number}: missing immutable SHA ({reference})")
                continue
            action_ref = reference.rsplit("@", 1)[1]
            if not SHA_PATTERN.fullmatch(action_ref):
                failures.append(f"{workflow}:{line_number}: expected a full 40-character SHA ({reference})")

    print(f"Checked {checked} external action reference(s) across {len(workflow_files)} workflow file(s).")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print("All external GitHub Actions are pinned to immutable full commit SHAs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
