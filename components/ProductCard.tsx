import { Product } from '@/types/product'
import { Star } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'

const ProductCard = ({product} : {product: Product}) => {
    useEffect(() => {
        console.log(product);
    } , [product])
  return (
    <div className='relative max-w-50'>
        <div className='bg-gray-500/10 rounded-md group'>
            <Image
                className='cover group-hover:scale-110 transition-transform duration-300'
                src={product.image[0]}
                alt={product.name}
                width={800}
                height={800}
            />
        </div>
        <div>
            <h5 className='text-[0.9rem] font-medium text-gray-900 leading-loose'>{product.name}</h5>
            <div>
                <p className='truncate text-gray-500 text-xs'>{product.description}</p>
                <div className=''>
                    <span className='text-[0.85rem] text-gray-500'>
                        5
                    </span>
                    <div className='inline-flex ml-2 items-center gap-1'>
                        {[...new Array(5)].map((_ , i) => (<span key={i}>
                            <Star className='w-3 h-3 text-orange-600'/>
                        </span>))}
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-between mt-4'>
                <h5 className='font-medium text-[0.9rem]'>${product.price}</h5>
                <button className='text-xs rounded-lg px-3 text-gray-900 py-1 border border-gray-300 hover:bg-gray-100 cursor-pointer'>
                    Buy now
                </button>
            </div>
        </div>
    </div>
  )
}

export default ProductCard