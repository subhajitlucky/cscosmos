export interface Step {
  step: number;
  title: string;
  path: string;
  masteryGoal: string;
  estimatedTime: string;
}

export interface Topic {
  name: string;
  path: string;
  stepNumber: number;
  covers: string[];
  visualsRequired: string[];
}

export interface Progress {
  completedSteps: number[];
  currentStep: number;
}
