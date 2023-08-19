import React from 'react'

export default function Spinner() {
    return (
        <div className='fixed inset-0 bg-black opacity-70 z-[9999] flex justify-center items-center'>
            <div className='border-4 h-10 w-10 border-white border-solid border-t-transparent rounded-full animate-spin'></div>
        </div>
    )
}
