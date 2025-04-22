import React from 'react'

const Footer = () => {
    return (
        <footer className='bg-background py-12 text-[14px]'>
            <div className='h-[1px] w-full bg-subtext'></div>
            <div className='container mx-auto px-4 flex flex-row gap-2 justify-between text-subtext mt-8 mb-0'>
                <p>&copy; 2025 FinSync | All rights reserved.</p>
                <p>FinSync: Smarter tracking | Better decisions | Expense control </p>
                <div>
                    <span>Developer: </span>
                    <a href="https://www.mit4sheth.dev" target='_blank' rel='no-referrer' className='text-main/80 hover:underline hover:decoration-subtext'>Mit</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer