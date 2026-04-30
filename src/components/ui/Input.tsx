import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLocation } from "react-router-dom";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  className = "",
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const togglePassword = () => setShowPassword(!showPassword);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-text-muted">{label}</label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={`
            w-full border border-surface-border ${isLoginPage ? "" : "dark:border-dark-border"} rounded-input px-3 py-2 text-sm 
            bg-surface ${isLoginPage ? "" : "dark:bg-dark-card"} text-text focus:outline-none focus:ring-2 focus:ring-primary 
            transition-all placeholder:text-text-muted/50
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
