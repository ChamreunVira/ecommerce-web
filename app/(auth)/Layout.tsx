import { AppContextProvider } from '@/context/AppContext'
import React from 'react'
import { ToastProvider } from '../ToastProvider'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppContextProvider>
            <html lang="en">
                <body
                    className={`min-h-full antialiased text-gray-700 font-inter`}
                >
                    {children}
                    <ToastProvider />
                </body>
            </html>
        </AppContextProvider>
    )
}

export default Layout