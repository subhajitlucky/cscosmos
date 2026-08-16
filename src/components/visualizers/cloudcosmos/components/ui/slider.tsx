import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (val: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, defaultValue = [0], onValueChange, min = 0, max = 100, step = 1, disabled }, ref) => {
    const currentVal = value ? value[0] : defaultValue[0];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseFloat(e.target.value);
      if (onValueChange) {
        onValueChange([num]);
      }
    };

    return (
      <div ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentVal}
          disabled={disabled}
          onChange={handleChange}
          className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none disabled:opacity-50"
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
