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
    <div className='relative w-full max-w-sm'>
        <Search className='absolute top-1/2 left-2 -translate-y-1/2 text-gray-400' />
        <input type="text" className={`${props.className} px-10 py-2 rounded-md outline-1 -outline-offset-2 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500`} placeholder='Search...' value={inputValue} onChange={handleSearch}/>
    </div>
  )
}

export default SearchInput