import { ReactNode, FormHTMLAttributes } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export function Form({ children, ...props }: FormProps) {
  return (
    <form {...props}>
      {children}
    </form>
  );
}

interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export function FormField({ children, className = "mb-3" }: FormFieldProps) {
  return <div className={className}>{children}</div>;
}