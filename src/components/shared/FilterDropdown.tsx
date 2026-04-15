import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './FilterDropdown.css';

export interface FilterDropdownProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  countFor?: (v: T) => number;
  activeClass?: string;
  displayValue?: (v: T) => string;
}

function FilterDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  countFor,
  activeClass,
  displayValue,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const isDefault = value === options[0];
  const display = displayValue ? displayValue(value) : value;

  return (
    <div className="fd-dropdown" ref={ref}>
      <button
        className={[
          'fd-dropdown-btn',
          open ? 'fd-dropdown-btn--open' : '',
          !isDefault && activeClass ? activeClass : '',
        ].filter(Boolean).join(' ')}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="fd-dropdown-label">{label}</span>
        <span className="fd-dropdown-value">{display}</span>
        <ChevronDown size={10} className="fd-dropdown-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="fd-dropdown-list" role="listbox">
          {options.map(opt => (
            <button
              key={opt}
              role="option"
              aria-selected={value === opt}
              className={`fd-dropdown-option${value === opt ? ' fd-dropdown-option--active' : ''}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              <span>{displayValue ? displayValue(opt) : opt}</span>
              {countFor && opt !== options[0] && (
                <span className="fd-dropdown-count">{countFor(opt)}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
