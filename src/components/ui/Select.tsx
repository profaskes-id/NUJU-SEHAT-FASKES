import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ icon, children, className = '', ...props }) => {
  return (
    <div className="relative min-w-[200px]">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          {icon}
        </div>
      )}
      <select
        className={`
          w-full ${icon ? 'pl-10' : 'pl-4'} pr-10 py-2 bg-surface rounded-full border-none 
          text-sm font-medium text-text focus:ring-2 focus:ring-primary appearance-none cursor-pointer 
          transition-all hover:bg-surface/80
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};

export default Select;
