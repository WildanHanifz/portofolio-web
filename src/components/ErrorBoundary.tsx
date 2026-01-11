import React from 'react';

interface Props {
  children: React.ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log for debugging
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-lg w-full text-center">
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm text-gray-600 mb-4">An error occurred while rendering this content.</p>
            <div className="flex justify-center gap-3">
              {this.props.onReset && (
                <button
                  onClick={() => this.props.onReset && this.props.onReset()}
                  className="px-4 py-2 bg-ebony text-white rounded-lg"
                >
                  Close
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border rounded-lg"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
