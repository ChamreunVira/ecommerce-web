"use client";
import { useParams } from 'next/navigation';
import React from 'react'

const ProductDetail = () => {

    const {id} = useParams();

  return (
    <div>ProductDetail: {id}</div>
  )
}

export default ProductDetail