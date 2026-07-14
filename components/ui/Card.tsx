import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <div 
      className="card mb-4" 
      style={{ backgroundColor: "#F0F2FA", border: "none", borderRadius: "8px", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`card-body ${className || ""}`} {...props}>
      {children}
    </div>
  );
}