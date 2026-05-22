import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className, 
  children, 
  icon: Icon,
  ...props 
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-text-[15px]";
  
  const variants = {
    primary: "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary",
    secondary: "bg-white border-2 border-secondary text-secondary hover:bg-blue-50 focus:ring-secondary",
    danger: "bg-danger text-white hover:bg-red-600 focus:ring-danger",
    ghost: "bg-transparent text-muted hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-[15px]",
    lg: "px-6 py-3 text-lg"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-60 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="mr-2" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
