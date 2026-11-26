import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import Navigation from "./Navigation";

jest.mock("react-router-dom", () => {
  const React = require("react");
  const Link = ({ to, children, ...props }) =>
    React.createElement("a", { href: to, ...props }, children);
  const NavLink = ({ to, children, ...props }) =>
    React.createElement(
      "a",
      { href: to, ...props },
      typeof children === "function"
        ? children({ isActive: globalThis.window.location.pathname === to })
        : children
    );

  return {
    Link,
    NavLink,
    MemoryRouter: ({ children }) => React.createElement(React.Fragment, null, children),
    useLocation: () => ({ pathname: globalThis.window.location.pathname || "/" }),
  };
});

jest.mock("framer-motion", () => {
  const React = require("react");
  const MotionElement = ({
    children,
    initial,
    animate,
    exit,
    transition,
    whileHover,
    layoutId,
    ...props
  }) => React.createElement("div", props, children);

  return {
    motion: {
      div: MotionElement,
      span: MotionElement,
      li: MotionElement,
    },
    AnimatePresence: ({ children }) => children,
    useScroll: () => ({ scrollY: { getPrevious: () => 0 } }),
    useMotionValueEvent: jest.fn(),
  };
});

jest.mock("lucide-react", () => {
  const React = require("react");
  const Icon = (props) => React.createElement("svg", props);
  return {
    ArrowUpRight: Icon,
    Languages: Icon,
    Instagram: Icon,
    Facebook: Icon,
    Mail: Icon,
    MessageCircle: Icon,
  };
});

jest.mock("@/components/site/Logo", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: () => React.createElement("span", { "data-testid": "site-logo" }),
  };
});

jest.mock("@/components/site/AnimatedHamburger", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ onClick, label, testId }) =>
      React.createElement(
        "button",
        { type: "button", onClick, "aria-label": label, "data-testid": testId },
        label
      ),
  };
});

jest.mock("@/lib/i18n", () => ({
  useI18n: () => ({
    t: (key) => key,
    lang: "en",
    toggle: jest.fn(),
  }),
}));

jest.mock("@/lib/brand", () => ({
  BRAND: {
    email: "contact@example.test",
    instagramUrl: "https://instagram.com/example",
    facebookUrl: "https://facebook.com/example",
  },
  whatsappLink: () => "https://wa.me/10000000000",
}));

describe("Navigation mobile menu", () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    window.scrollTo = jest.fn();
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.clearAllMocks();
  });

  test("opens and closes the mobile navigation without leaving the page locked", () => {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/"]}>
          <Navigation />
        </MemoryRouter>
      );
    });

    const openButton = container.querySelector('[data-testid="nav-mobile-toggle"]');
    expect(openButton).not.toBeNull();

    act(() => {
      openButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.querySelector('[data-testid="nav-mobile-panel"]')).not.toBeNull();
    expect(document.body.style.position).toBe("fixed");

    const closeButton = container.querySelector('[data-testid="nav-mobile-close"]');
    act(() => {
      closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.querySelector('[data-testid="nav-mobile-panel"]')).toBeNull();
    expect(document.body.style.position).toBe("");
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
