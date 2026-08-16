import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class SimulationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Simulation crash:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-50 dark:bg-rose-950/20 rounded-3xl border-2 border-dashed border-rose-200 dark:border-rose-900/50">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={32} />
          </div>
          <h4 className="text-xl font-black text-rose-900 dark:text-rose-100 mb-2">Simulation Encountered an Issue</h4>
          <p className="text-rose-600/70 dark:text-rose-400/60 text-sm max-w-xs mx-auto mb-8 font-medium">
            This interactive module crashed due to a state logic error. We've logged the issue.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 active:scale-95"
          >
            <RefreshCcw size={16} />
            Reset Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SimulationErrorBoundary;