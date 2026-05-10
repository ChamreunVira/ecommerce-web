"use client";
import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppContext'
import { Product } from '@/types/product';
import React from 'react'

const AllProduct = () => {

    const { products } = useAppContext();

  return (
    <div className='flex flex-col items-center pt-14'>
        <p className='2xl font-medium text-left w-full'>Popular products</p>
        <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14'>
            {products?.map((product: Product , i: number) => (<ProductCard key={i} product={product}/>))}
        </div>
    </div>
  )
}

export default AllProduct