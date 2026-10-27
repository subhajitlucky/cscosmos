export interface Step {
  step: number;
  title: string;
  path: string;
  masteryGoal: string;
  estimatedTime: string;
}

export interface Progress {
  completedSteps: number[];
}
