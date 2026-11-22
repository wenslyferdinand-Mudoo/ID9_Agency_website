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

  test("closes the menu on Escape", () => {
    const event = keyEvent("Escape");
    const onClose = jest.fn();

    handleMobileMenuKeyDown(event, panel, onClose);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("wraps forward Tab from the last item to the first", () => {
    last.focus();
    const event = keyEvent("Tab");

    handleMobileMenuKeyDown(event, panel, jest.fn());

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(first);
  });

  test("wraps backward Shift+Tab from the first item to the last", () => {
    first.focus();
    const event = keyEvent("Tab", true);

    handleMobileMenuKeyDown(event, panel, jest.fn());

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(last);
  });

  test("returns focus to the first item if focus escapes the dialog", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    const event = keyEvent("Tab");

    handleMobileMenuKeyDown(event, panel, jest.fn());

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(first);
  });

  test("prevents Tab when the dialog has no focusable controls", () => {
    panel.innerHTML = "";
    const event = keyEvent("Tab");

    handleMobileMenuKeyDown(event, panel, jest.fn());

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
});
