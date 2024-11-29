import React, { useState } from 'react';

interface SearchInputProps {
  searchInput: string;
  minLength?: number;
  onSearchInputChange: (value: string) => void;
  onSearchKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchInput,
  minLength,
  onSearchInputChange,
  onSearchKeyPress,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < (minLength ?? 3) && value.length > 0) {
      setError('Enter at least 3 characters');
    } else {
      setError(null);
    }
    onSearchInputChange(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onSearchKeyPress) {
      onSearchKeyPress(e);
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search"
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'
          }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SearchInput;
