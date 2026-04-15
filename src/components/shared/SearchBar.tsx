import './SearchBar.css';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ placeholder = 'Search shipments, vessels, ports...', value, onChange, onFocus, onBlur, onKeyDown }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <Search className="search-icon" size={14} strokeWidth={1.5} />
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        aria-label="Search shipments, vessels, and ports"
        role="searchbox"
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange?.('')}
          aria-label="Clear search"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
