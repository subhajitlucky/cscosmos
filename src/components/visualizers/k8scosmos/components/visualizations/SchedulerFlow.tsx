import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Filter, Calculator, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SchedulerFlowProps {
  currentStep: 'idle' | 'filtering' | 'scoring' | 'binding' | 'complete' | 'failed';
  nodeName?: string;
  filteredCount?: number;
}

export function SchedulerFlow({ currentStep, nodeName, filteredCount = 0 }: SchedulerFlowProps) {
  const steps = [
    { key: 'filtering', icon: Filter, label: 'Filter Nodes', description: 'Check resource constraints, taints, and affinity' },
    { key: 'scoring', icon: Calculator, label: 'Score Nodes', description: 'Rank eligible nodes based on preferences' },
    { key: 'binding', icon: CheckCircle, label: 'Bind Pod', description: 'Final assignment to selected node' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Scheduling Lifecycle</h3>

        <div className="flex items-center space-x-2">
          {steps.map((step, index) => {
            const isActive = currentStep === step.key;
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
            const isPending = steps.findIndex(s => s.key === currentStep) < index;

            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive
                      ? 'border-primary bg-primary/10'
                      : isCompleted
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border bg-muted'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </motion.div>

                <div className="ml-2 flex-1">
                  <div className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </div>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-muted-foreground"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <ArrowRight className={`w-5 h-5 mx-2 ${isPending ? 'text-muted-foreground/30' : 'text-muted-foreground'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {currentStep !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {currentStep === 'filtering' && (
              <div className="flex items-center space-x-2 text-sm bg-accent/50 p-3 rounded-md">
                <Filter className="w-4 h-4 text-blue-500" />
                <span>Filtering {filteredCount} eligible nodes...</span>
              </div>
            )}

            {currentStep === 'scoring' && (
              <div className="flex items-center space-x-2 text-sm bg-accent/50 p-3 rounded-md">
                <Calculator className="w-4 h-4 text-purple-500" />
                <span>Calculating scores for candidate nodes...</span>
              </div>
            )}

            {currentStep === 'binding' && nodeName && (
              <div className="flex items-center space-x-2 text-sm bg-green-500/10 p-3 rounded-md border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Binding to <strong>{nodeName}</strong></span>
              </div>
            )}

            {currentStep === 'complete' && nodeName && (
              <div className="flex items-center space-x-2 text-sm bg-green-500/10 p-3 rounded-md border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Successfully scheduled on <strong>{nodeName}</strong></span>
              </div>
            )}

            {currentStep === 'failed' && (
              <div className="flex items-center space-x-2 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Scheduling failed - no suitable nodes available</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Pod Status</h4>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {currentStep === 'idle' ? 'Ready to schedule' : 'In progress...'}
          </span>
        </div>
      </div>
    </div>
  );
}
