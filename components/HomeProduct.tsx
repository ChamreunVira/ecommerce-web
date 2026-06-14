"use client";
import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppContext'
import { categoryService } from '@/services/category-service';
import { Product } from '@/types/product';
import React, { useEffect, useState } from 'react'

const HomeProduct = () => {

    const [filterProducts , setFilterProducts] = useState<Product[]>([]);
    const { categories, products , router } = useAppContext();
  

    // const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //   const category = e.target.value;
    //   if(category === "") {
    //     setFilterProducts(products.slice(0 , 10));
    //     return;
    //   }
    //   const filter = products.filter((product) => product.categoryName === category);
    //   setFilterProducts(filter);
    // }

    // useEffect(() => {
    //   console.log(categories , products)
    // })

  return (
    <div className='flex flex-col items-center pt-14'>
        <h1 className='2xl font-medium text-left w-full mb-4'>Popular products</h1>
        {/* <div className='flex items-center justify-start w-full space-x-4'>
          <select
          onChange={handleSelectCategory}
          className='rounded-md border border-slate-300 px-3 py-1.5 cursor-pointer'>
            <option value="">All Categories</option>
            {categories.map((category , i) => (
              <option key={i} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select className='rounded-md border border-slate-300 px-3 py-1.5 cursor-pointer'>
            <option value="">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div> */}
        <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14'>
            {filterProducts.length > 0 ? (
                filterProducts.map((product: Product , i: number) => (<ProductCard key={i} product={product}/>))
            ) : (
                products.slice(0 , 10).map((product: Product , i) => (<ProductCard key={i} product={product}/>)) 
            )}
        </div>
        <button 
        onClick={() => {router.push("/all-product")}}
        className='rounded-sm cursor-pointer border border-gray-300 px-12 py-2 text-gray-500 hover:bg-gray-50 font-medium'>See more</button>
    </div>
  )
}

export default HomeProduct