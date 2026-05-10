import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'

const Banner = () => {
  return (
    <div className='mt-14'>
        <div className='relative flex justify-between items-center bg-[#E6E9F2] rounded-lg'>
            <div>
                <Image
                    className='max-w-56'
                    src={assets.jbl_soundbox_image}
                    alt='jbl'
                />
            </div>

            <div className='flex flex-1 flex-col items-center text-center px-4 space-y-4'>
                <h2 className='text-2xl md:text-3xl max-w-72.5 font-semibold'>Level Up Your Gaming Experience</h2>
                <p className='max-w-85.75 font-medium text-gray-600'>From immersive sound to precise controls—everything you need to win</p>
                <button className='px-8 py-2 flex items-center gap-2 text-white font-medium rounded-sm bg-orange-500 cursor-pointer'>Buy now
                    <Image
                        src={assets.arrow_icon_white}
                        alt='arrow-icon'
                    />
                </button>
            </div>
            <div>
                 <Image
                    className='max-w-80'
                    src={assets.md_controller_image}
                    alt='md-controller'
                />
            </div>
        </div>
    </div>
  )
}

export default Banner