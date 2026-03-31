import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id: propId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = propId || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-lg border bg-surface-raised px-3 py-2 text-sm text-text
              placeholder:text-text-muted/60
              transition-all duration-200 ease-out
              focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${
                error
                  ? 'border-danger focus:border-danger focus:ring-danger/40'
                  : 'border-border hover:border-border-focus/50'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-danger flex items-center gap-1 animate-fade-in">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
