"use client";
import { useAppContext } from '@/context/AppContext'
import { Search, User } from 'lucide-react'
import Link from 'next/link';

const navItems: Array<{path: string, label: string}> = [
    {  
        path: "/",
        label: "Home"
    },
    {
        path: "/all-product",
        label: "Shop"
    },
    {
        path: "/",
        label: "About Us"
    },
    {
        path: "/",
        label: "Contact"
    }
]

const Navbar = () => {
    const {router} = useAppContext();
  return (
    <header className="app-container bg-white py-3 sticky top-0 left-0 z-50 flex justify-between items-center border-b border-slate-300">
        {/* logo */}
        <div>
            <label htmlFor="" onClick={() => {router.push("/")}}>Vira</label>
        </div>

        {/* nav items */}
        <nav className='max-w-lg flex items-center gap-4'>
            {navItems.map((item , i) => (
                <Link key={i} href={item.path} className='text-[0.85rem] font-medium px-2.5 py-0.5 hover:text-gray-900 transition-colors'>{item.label}</Link>
            ))}
        </nav>

        {/* option */}
        <div className='flex items-center gap-2'>
            <span className='p-1.5 hover:bg-gray-100 rounded-full group'>
                <Search className='w-5 h-5 text-gray-600 group-hover:text-gray-800'/>
            </span>
            <div className='flex items-center space-x-1.5'>
                <span className='p-1.5 hover:bg-gray-100 rounded-full group'>
                    <User className='w-5 h-5 text-gray-600 group-hover:text-gray-800'/>
                </span>
                <p className='hover:text-gray-800 cursor-pointer'>Account</p>
            </div>
        </div>
    </header>
  )
}

export default Navbar