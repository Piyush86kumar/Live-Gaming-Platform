import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (value: string | number) => void;
  className?: string;
}

export function Dropdown({ value, options, onChange, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`dropdown ${className || ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-trigger ${isOpen ? 'dropdown-trigger--open' : ''}`}
      >
        <span className="dropdown-trigger__label">{selected?.label || value}</span>
        <ChevronDown className={`dropdown-trigger__arrow ${isOpen ? 'dropdown-trigger__arrow--open' : ''}`} />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`dropdown-option ${option.value === value ? 'dropdown-option--selected' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}