import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="text-center max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de composant</h1>
            <p className="text-gray-600 mb-4">
              Une erreur s'est produite dans l'un des composants de l'application.
            </p>

            <div className="text-left mb-4">
              <h2 className="font-semibold text-gray-800 mb-2">Message d'erreur :</h2>
              <pre className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800 overflow-auto">
                {this.state.error?.message}
              </pre>
            </div>

            <div className="text-left mb-4">
              <h2 className="font-semibold text-gray-800 mb-2">Stack trace :</h2>
              <pre className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 overflow-auto max-h-40">
                {this.state.error?.stack}
              </pre>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Recharger la page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Tenter de continuer
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;