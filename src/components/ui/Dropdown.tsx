/* ===== FILE: Dropdown.tsx ===== */
/* Summary: A custom dropdown select component with click-outside-to-close behavior. */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/* ===== PROPS INTERFACE ===== */
/* Summary: value = currently selected value; options = array of {value, label} pairs; onChange = selection handler. */
interface DropdownProps {
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (value: string | number) => void;
  className?: string;
}

/* ===== COMPONENT ===== */
export function Dropdown({ value, options, onChange, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);    /* Toggle state for dropdown menu visibility */
  const ref = useRef<HTMLDivElement>(null);        /* Ref to container for outside-click detection */

  /* ===== CLICK-OUTSIDE HANDLER ===== */
  /* Close the dropdown when user clicks outside the component boundary */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);    /* Click detected outside → close menu */
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);    /* Cleanup on unmount */
  }, []);

  /* Find the currently selected option object to display its label */
  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`dropdown ${className || ''}`}>
      {/* ===== TRIGGER BUTTON ===== */}
      <button
        onClick={() => setIsOpen(!isOpen)}    /* Toggle menu open/closed */
        className={`dropdown-trigger ${isOpen ? 'dropdown-trigger--open' : ''}`}
      >
        <span className="dropdown-trigger__label">{selected?.label || value}</span>
        <ChevronDown className={`dropdown-trigger__arrow ${isOpen ? 'dropdown-trigger__arrow--open' : ''}`} />
      </button>

      {/* ===== DROPDOWN MENU ===== */}
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);    /* Emit selection */
                setIsOpen(false);         /* Close menu after selection */
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
