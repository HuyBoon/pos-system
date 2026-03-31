import type { ReactNode, HTMLAttributes } from 'react';

/* ─── Card Root ─── */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

function Card({ children, hover = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-border bg-surface-raised
        shadow-sm overflow-hidden
        ${hover ? 'transition-all duration-300 ease-out hover:shadow-glow hover:border-primary/30 hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Sub-components ─── */
interface SubComponentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardHeader({ children, className = '', ...props }: SubComponentProps) {
  return (
    <div
      className={`px-5 py-4 border-b border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardBody({ children, className = '', ...props }: SubComponentProps) {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '', ...props }: SubComponentProps) {
  return (
    <div
      className={`px-5 py-3 border-t border-border bg-surface/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Attach sub-components ─── */
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
