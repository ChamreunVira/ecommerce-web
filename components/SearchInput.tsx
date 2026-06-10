import { Search } from 'lucide-react'
import { useState } from 'react';

type SearchInputType = {
  className?: string;
  onInputChange: (value: string) => void;
}

const SearchInput = (props: SearchInputType) => {
  
  const [inputValue , setInputValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    props.onInputChange(value);
  }
  return (
    <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          className={`${props.className || ""} w-full rounded-lg border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100`}
          placeholder="Search..."
          value={inputValue}
          onChange={handleSearch}
        />
    </div>
  )
}

export default SearchInput
