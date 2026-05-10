import React from 'react'

const NewsLetter = () => {
  return (
    <div className='relative w-full flex flex-col justify-center items-center pt-8 pb-14'>
        <h2 className='text-2xl md:text-3xl font-semibold text-gray-900'>Subscribe now & get 20% off</h2>
        <p className='text-sm text-gray-600 leading-10 pb-8'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        <div className='max-w-2xl w-full flex items-center justify-between'>
            <input type="text" placeholder='Enter your email id' className='px-2 w-full h-full py-4 rounded-tl-md rounded-bl-md border-0 outline-1 outline-gray-300 -outline-offset-1'/>
            <button className='text-sm text-white px-12 py-4 rounded-tr-md rounded-br-md bg-orange-500'>Subcript</button>
        </div>
    </div>
  )
}

export default NewsLetter