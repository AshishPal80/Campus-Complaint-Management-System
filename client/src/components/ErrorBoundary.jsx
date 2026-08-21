import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.removeItem('campus_lost_found_items_v1');
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-zinc-900 font-sans">
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 max-w-lg w-full shadow-vercel-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Something went wrong
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed">
              An unexpected error occurred while rendering the application. 
            </p>

            {this.state.error && (
              <div className="bg-zinc-900 text-rose-300 text-xs font-mono p-3 rounded-lg text-left overflow-x-auto max-h-32 border border-zinc-800">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-4 py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium rounded-lg hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Reset Local Data & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
