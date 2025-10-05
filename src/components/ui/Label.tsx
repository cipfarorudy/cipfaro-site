import React from 'react';
import { cn } from '../../utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        className={cn(
          "text-sm font-medium leading-none text-gray-700 mb-2 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };