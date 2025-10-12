// frontend/src/components/ui/Input.tsx
import React from 'react';

// Use React.ComponentProps to get all the standard input props like 'type', 'value', etc.
type InputProps = React.ComponentProps<'input'> & {
  label: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', name, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          {...props}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    );
  }
);

Input.displayName = 'Input'; // for React DevTools

export default Input;