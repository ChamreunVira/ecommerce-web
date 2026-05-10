"use client";
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { useAppContext } from '@/context/AppContext'
import { Product } from '@/types/product'
import React from 'react'

const AllProduct = () => {

  const {products} = useAppContext();

  return (
    <>
      <Navbar/>
      <div className='px-6 md:px-16 lg:px-32 flex flex-col items-start'>
        <div className='flex flex-col items-end pt-12'>
          <h5 className='text-2xl font-medium'>All products</h5>
          <div className='w-16 h-0.5 bg-orange-600 rounded-full'></div>
        </div>
        <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14'>
            {products?.map((product: Product , i: number) => (<ProductCard key={i} product={product}/>))}
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default AllProduct