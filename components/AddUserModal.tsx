"use client";
import { X } from 'lucide-react';
import React from 'react'

type AddUserModalType = {
    handleClose: () => void;
}

const AddUserModal: React.FC<AddUserModalType> = ({handleClose}) => {

    const handleUserFieldsChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    }
    const handleCreateUser = async () => {

    }

  return (
        <div className="absolute top-0 left-0 bg-black/10 flex items-center justify-center w-full min-h-screen">
      <div className="max-w-lg w-full bg-zinc-50 rounded-md border border-gray-300 p-8 relative">
        <button className="absolute top-8 right-8 text-slate-800 cursor-pointer" onClick={handleClose}>
          <X />
        </button>
        <h2 className="text-2xl font-medium text-slate-800 pb-4">Category Form</h2>
        <form action="">
          <div className="mb-4">
            <label className="text-sm text-gray-800">Fullname</label>
            <input
              type="text"
              onChange={handleUserFieldsChange}
              placeholder="Enter full name..."
              name="fullName"
              className="w-full rounded-md px-3 py-1.5 text-gray-500/90 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500"
            />
          </div>
          <button 
            type="button"
            onClick={handleCreateUser}
            className="px-3 py-1.5 w-full rounded-md bg-orange-500 text-white"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal