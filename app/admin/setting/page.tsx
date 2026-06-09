import { Save, Settings } from 'lucide-react'
import React from 'react'

const SettingAdminPage = () => {
  return (
    <section className='relative h-full overflow-x-hidden p-12'>
      <div className="text-left">
        <h1 className="flex items-center text-2xl text-gray-800 font-medium leading-12">
          <button className="mr-2">
            <Settings />
          </button>
          Settings
        </h1>
        <p className="text-base text-gray-500/90">Setting management</p>
      </div>
      <div className='mt-4'>
        <label htmlFor="" className='text-slate-800'>Change Full Name:</label>
        <input type="text" className='block border-0 outline-1 -outline-offset-1 outline-slate-300 form-control' />
        <button className='flex items-center text-emerald-700 gap-2 mt-2 bg-emerald-100 px-2 py-1.5 font-medium border border-emerald-500 rounded-md'>
          <Save className='text-emerald-500' />
          Save</button>
      </div>
    
    </section>
  )
}

export default SettingAdminPage