import { Component } from "react";

/**
 * Global error boundary — prevents the whole app going white if any child
 * renders throws. Displays a friendly fallback and offers a retry.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep it in console so users can inspect. Never crash.
    // eslint-disable-next-line no-console
    console.error("[ID9 ErrorBoundary]", error, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          data-testid="error-boundary"
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ink-900 text-white"
        >
          <p className="text-orange_impact font-ui text-xs uppercase tracking-[0.3em] mb-6">
            Erreur inattendue · Unexpected error
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tighter leading-[0.98] max-w-3xl">
            Something went sideways. We caught it before it went dark.
          </h1>
          <p className="text-white/60 font-inter mt-6 max-w-xl">
            Try refreshing the page. If the issue persists, please contact us at{" "}
            <a
              href="mailto:Contact.id9agency@gmail.com"
              className="text-orange_impact underline"
            >
              Contact.id9agency@gmail.com
            </a>
            .
          </p>
          <div className="flex gap-3 mt-10">
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-6 py-3 rounded-full bg-orange_impact text-ink-900 font-ui text-sm hover:opacity-90 transition-opacity"
              data-testid="error-retry-button"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-6 py-3 rounded-full border border-white/20 text-white font-ui text-sm hover:border-orange_impact hover:text-orange_impact transition-colors"
              data-testid="error-home-button"
            >
              Back home
            </a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
