import { ReactNode, LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ children, style, ...props }: LabelProps) {
  return (
    <label 
      className="form-label" 
      style={{ fontWeight: "500", color: "#4A5568", ...style }}
      {...props}
    >
      {children}
    </label>
  );
}