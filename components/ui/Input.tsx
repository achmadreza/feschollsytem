import { ReactNode, InputHTMLAttributes } from "react";

interface IconActionProps {
  icon: ReactNode;
  onClick: () => void;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  rightAction?: ReactNode;
  iconAction?: IconActionProps;
}

export function Input({ icon, rightAction, iconAction, type = "text", ...props }: InputProps) {
  const effectiveRightAction = rightAction || (iconAction ? (
    <button 
      type="button" 
      className="link-secondary" 
      style={{ background: 'none', border: 'none', padding: 0 }} 
      onClick={iconAction.onClick}
    >
      {iconAction.icon}
    </button>
  ) : undefined);

  const hasWrapper = icon || effectiveRightAction;

  const inputElement = (
    <input
      type={type}
      className="form-control"
      {...props}
    />
  );

  if (!hasWrapper) return inputElement;
  
  if (icon && !effectiveRightAction) {
    return (
      <div className="input-icon">
        <span className="input-icon-addon">{icon}</span>
        {inputElement}
      </div>
    );
  }

  return (
    <div className="input-group input-group-flat">
      {icon && (
        <span className="input-group-text" style={{ paddingLeft: "0.75rem", paddingRight: "0.5rem" }}>
          {icon}
        </span>
      )}
      {inputElement}
      {effectiveRightAction && <span className="input-group-text">{effectiveRightAction}</span>}
    </div>
  );
}