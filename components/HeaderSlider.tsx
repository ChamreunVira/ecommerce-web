"use client";
import React, { useEffect, useState } from 'react'
import { assets } from "@/assets/assets";
import Image from 'next/image';

type SlideItems = {
    id: number,
    title: string,
    offer: string,
    firstContentBtn: string,
    secondContentBtn: string,
    img: any
}

const HeaderSlider = () => {

    const slideItems: SlideItems[] = [
        {
            id: 1,
            title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
            offer: "Limited Time Offer 30% Off",
            firstContentBtn: "Buy now",
            secondContentBtn: "Find more",
            img: assets.header_headphone_image
        },
        {
            id: 2,
            title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
            offer: "Hurry up only few lefts!",
            firstContentBtn: "Shop Now",
            secondContentBtn: "Explore Deals",
            img: assets.header_playstation_image
        },
        {
            id: 3,
            title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
            offer: "Exclusive Deal 40% Off",
            firstContentBtn: "Order Now",
            secondContentBtn: "Learn More",
            img: assets.header_macbook_image
        }
    ]

    const [currentSlide , setCurrentSlide] = useState<number>(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrentSlide(prev => ((prev + 1) % slideItems.length))
        } , 3000);
        return () => clearInterval(id);
    } , [slideItems.length])

    const handleNextSlice = (index: number) => {
        setCurrentSlide(index);
    }

  return (
    <section className='relative overflow-x-hidden w-full'>

        {/* slice banner wrapper */}
        <div className='flex transition-transform duration-700 ease-in-out'
            style={{
                transform: `translateX(-${currentSlide * 100}%)`
            }}
        >
            {/* all slice banners */}
            {slideItems.map((slide) => (
                <div key={slide.id}
                    className='min-w-full mt-6 py-8 md:px-14 px-5 rounded-xl flex flex-col md:flex-row items-center justify-between bg-indigo-50'
                >
                    <div className='md:pl-8 mt-10 md:mt-0'>
                        <p className='md:text-base text-orange-500 pb-1'>{slide.offer}</p>
                        <h1 className='max-w-lg md:text-[40px] md:leading-12 text-2xl font-semibold'>{slide.title}</h1>
                        <div className='flex items-center mt-4 md:mt-6'>
                            <button className='md:px-10 md:py-2.5 px-7 py-2 bg-orange-500 font-medium text-white rounded-full cursor-pointer'>{slide.firstContentBtn}</button>
                            <button className='group flex items-center gap-2 px-7 py-2.5 font-medium'>
                                {slide.secondContentBtn}
                                <Image
                                    className='group-hover:translate-x-1 transition-transform'
                                    src={assets.arrow_icon}
                                    alt='arrow-icon'
                                />
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center flex-1 justify-center'>
                        <Image
                            className="w-48 md:w-72"
                            src={slide.img}
                            alt={slide.title}
                        />
                    </div>
                </div>
            ))}
        </div>

        {/* button dot click change slice */}
        <div className='mt-8 flex items-center justify-center gap-2'>
            {slideItems.map((_ , i) => (
                <button
                 key={i}
                 onClick={() => handleNextSlice(i)}
                 className={`w-2 h-2 rounded-full cursor-pointer ${currentSlide === i ? 'bg-orange-500' : 'bg-gray-300'}`}></button>
            ))}
        </div>
    </section>
  )
}

export default HeaderSlider