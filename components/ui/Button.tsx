import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "link";
  fullWidth?: boolean;
}

export function Button({ children, variant = "primary", fullWidth, style, ...props }: ButtonProps) {
  if (variant === "link") {
    return (
      <button
        type="button"
        className="link-secondary"
        style={{ background: 'none', border: 'none', padding: 0, ...style }}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`btn ${fullWidth ? "w-100" : ""}`}
      style={{ backgroundColor: "#032B88", color: "#fff", fontWeight: "500", ...style }}
      {...props}
    >
      {children}
    </button>
  );
}