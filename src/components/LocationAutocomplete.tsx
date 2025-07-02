import  { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface LocationAutocompleteProps {
  isNotFilled: boolean,
  handleResidencyAdress: (address: string ) => void,
  formData: {
    residencyAddress: string
  },
}

function LocationAutocomplete({ isNotFilled, handleResidencyAdress, formData }: LocationAutocompleteProps) {
  const [query, setQuery] = useState(formData.residencyAddress);
  const [results, setResults] = useState([]);

  const fetchLocations = async (value: string) => {
    if (value.length < 2) return;

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
    const data = await response.json();
    setResults(data);
  };

  const debouncedFetch = useCallback(debounce(fetchLocations, 200), []);

  const handleSearch = (value: string) => {
    setQuery(value);
    debouncedFetch(value); // 👈 har yozishda chaqiriladi, lekin kechikadi
  };

  const handleSelect = (item: any) => {
    setQuery(item.display_name);
    setResults([]); // dropdownni yashir
    console.log('Tanlangan manzil:', item);
    handleResidencyAdress(item.display_name);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          handleSearch(e.target.value);
          handleResidencyAdress(e.target.value);
        }}
        className={isNotFilled && formData.residencyAddress.trim() === '' ?
          'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500' :
          'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
        } />

      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-y-auto shadow-lg mt-1 rounded">
          {results.map((item: any) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationAutocomplete;
