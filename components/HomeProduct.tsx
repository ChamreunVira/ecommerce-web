"use client";
import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppContext'
import { Product } from '@/types/product';
import React from 'react'

const HomeProduct = () => {

    const { products , router } = useAppContext();

  return (
    <div className='flex flex-col items-center pt-14'>
        <p className='2xl font-medium text-left w-full'>Popular products</p>
        <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14'>
            {products?.map((product: Product , i: number) => (<ProductCard key={i} product={product}/>))}
        </div>
        <button 
        onClick={() => {router.push("/all-product")}}
        className='rounded-sm cursor-pointer border border-gray-300 px-12 py-2 text-gray-500 hover:bg-gray-50 font-medium'>See more</button>
    </div>
  )
}

export default HomeProduct