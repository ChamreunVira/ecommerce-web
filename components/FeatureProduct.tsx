import { assets } from '@/assets/assets';
import Image from 'next/image';
import React from 'react'

type FeatureProduct = {
    id: number;
    image: any;
    title: string;
    description: string
}

const FeatureProduct = () => {

    const product: FeatureProduct[] = [
        {
            id: 1,
            image: assets.girl_with_headphone_image,
            title: "Unparalledd Sound",
            description: "Experience crystal-clear audio with premium headphones."
        },
        {
            id: 2,
            image: assets.girl_with_earphone_image,
            title: "Stay Connected",
            description: "Compact and stylish earphones for every occasion."
        },
        {
            id: 3,
            image: assets.boy_with_laptop_image,
            title: "Power in Every Pixel",
            description: "Shop the latest laptops for work, gaming, and more."
        }
    ]

  return (
    <div className='mt-14'>
        <div className='flex flex-col items-center'>
            <p className='text-3xl font-medium'>Feature Products</p>
            <div className='rounded-full w-28 h-0.5 bg-orange-600 mt-2'></div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4'>
            {product.map(({image , title , description} , i) => (
                <div key={i} className='relative group'>
                    <Image
                        className='group-hover:brightness-75 transition object-cover w-full h-auto'
                        src={image}
                        alt={title}
                    />
                    <div className='group-hover:-translate-y-4 transition-transform duration-300 absolute bottom-8 left-8'>
                        <p className='text-white text-xl font-medium leading-loose'>{title}</p>
                        <p className='text-white'>{description}</p>
                        <button className='mt-2 cursor-pointer flex items-center gap-2 font-medium text-white rounded-sm bg-orange-500 px-3 py-2'>
                            Buy now
                            <Image
                            className='w-3 h-3 group-hover:-translate-y-1 transition-transform duration-300'
                            src={assets.redirect_icon}
                            alt='redirect_icon'
                            />
                        </button>
                    </div>
                </div>))}
        </div>
    </div>
  )
}

export default FeatureProduct