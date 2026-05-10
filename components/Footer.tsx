import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type FooterItems = {
    category: string;
    items: {label: string, path: string}[]
}

const Footer = () => {

    const footer: FooterItems[] = [
        {
            category: "Company",
            items: [
                {
                    label: "Home",
                    path: "/"
                },
                {
                    label: "About us",
                    path: "/"
                },
                {
                    label: "Contact us",
                    path: "/"
                },
                {
                    label: "Privacy policy",
                    path: "/"
                }
            ]
        },
        {
            category: "Get in touch",
            items: [
                {
                    label: "(097) 3056 7474",
                    path: ""
                },
                {
                    label: "virachamreun@gmail.com",
                    path: ""
                }
            ]
        }
    ]

  return (
    <div className='relative w-full pb-14 lg:px-32 md:px-16 px-6'>
        {/* logo and description */}
        <div className='flex items-center justify-between space-x-8'>
            <div className='w-1/2 flex flex-col items-start justify-center'>
                <Image
                className='w-50'
                src={assets.brand}
                alt='brand'
                />
                <p className='text-gray-600 text-sm'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            <div className='flex-1 flex justify-between'>
                {footer.flatMap((item ,i) => (
                    <ul key={i}>
                        <p className='font-semibold pb-4'>{item.category}</p>
                        {item.items.map((l , i) => (
                            <Link key={i} href={l.path}>
                                <li className='text-sm mb-2 text-gray-600'>{l.label}</li>
                            </Link>
                        ))}
                    </ul>
                ))}
            </div>
            
        </div>
    </div>
  )
}

export default Footer