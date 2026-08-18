import React from "react";

/**
 * Guards the Three.js canvases so a WebGL/GLTF failure degrades to a static
 * placeholder instead of blanking the page.
 *
 * This is a class component, so it cannot call `useLanguage()`. Any
 * user-visible copy must therefore arrive already translated: the parent
 * builds the `fallback` node (see the canvas wrappers, which label theirs with
 * `t.common.sceneUnavailable`). Without a `fallback` the boundary renders
 * nothing, which is the right outcome for purely decorative scenes such as the
 * star field.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.fallback] Pre-translated node to render after a crash.
 * @param {React.ReactNode} props.children
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Developer-facing diagnostic only — never surfaced in the UI, so it stays
    // untranslated on purpose.
    console.warn("[ErrorBoundary] Three.js error caught:", error.message);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return null;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
