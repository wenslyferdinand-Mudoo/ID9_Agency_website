import { handleMobileMenuKeyDown } from "./mobileMenuKeyboard";

describe("handleMobileMenuKeyDown", () => {
  let panel;
  let first;
  let last;

  beforeEach(() => {
    document.body.innerHTML = "";
    panel = document.createElement("div");
    first = document.createElement("button");
    last = document.createElement("a");
    last.href = "#contact";
    panel.append(first, last);
    document.body.append(panel);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  const keyEvent = (key, shiftKey = false) => ({
    key,
    shiftKey,
    preventDefault: jest.fn(),
  });

  it("closes the menu on Escape", () => {
    const event = keyEvent("Escape");
    const onClose = jest.fn();
    handleMobileMenuKeyDown(event, panel, onClose);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("wraps forward Tab from the last item to the first", () => {
    last.focus();
    const event = keyEvent("Tab");
    handleMobileMenuKeyDown(event, panel, jest.fn());
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(first);
  });

  it("wraps backward Shift+Tab from the first item to the last", () => {
    first.focus();
    const event = keyEvent("Tab", true);
    handleMobileMenuKeyDown(event, panel, jest.fn());
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(last);
  });

  it("returns focus to the first or last item when focus escapes the dialog", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();

    const forward = keyEvent("Tab");
    handleMobileMenuKeyDown(forward, panel, jest.fn());
    expect(document.activeElement).toBe(first);

    outside.focus();
    const backward = keyEvent("Tab", true);
    handleMobileMenuKeyDown(backward, panel, jest.fn());
    expect(document.activeElement).toBe(last);
  });

  it("ignores hidden, inert, aria-hidden and disabled controls", () => {
    const hidden = document.createElement("button");
    hidden.hidden = true;
    const disabled = document.createElement("button");
    disabled.disabled = true;
    const inertParent = document.createElement("div");
    inertParent.setAttribute("inert", "");
    const inertButton = document.createElement("button");
    inertParent.append(inertButton);
    panel.append(hidden, disabled, inertParent);

    first.focus();
    const event = keyEvent("Tab", true);
    handleMobileMenuKeyDown(event, panel, jest.fn());

    expect(document.activeElement).toBe(last);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("prevents Tab when the dialog has no focusable controls", () => {
    panel.innerHTML = "";
    const event = keyEvent("Tab");
    handleMobileMenuKeyDown(event, panel, jest.fn());
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
});
