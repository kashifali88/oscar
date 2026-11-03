import React from 'react'
import { Link } from 'react-router-dom';
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'

const TopBar = () => {
  return (
    <div className='bg-[#ea2e0e] text-white'>
        <div className='container mx-auto px-2 flex items-center justify-between'>
            <div className='flex gap-2 p-2'>
                <Link className='hover:text-gray-300' to=""><TbBrandMeta size={24} /></Link>
                <Link className='hover:text-gray-300' to=""><IoLogoInstagram size={24} /></Link>
                <Link className='hover:text-gray-300' to=""><RiTwitterXLine size={24} /></Link>
            </div>
            <div className='text-sm grow text-center'>
              <span className='hidden md:block'>We ship worldwide - Fast and reliable shipping!</span>
              <span className=' md:hidden'>Shop Smatter</span>
            </div>
            <div className=''>
              <Link to="+923195378220" className='hover:text-gray-300'>+923195378220</Link>
            </div>
        </div>
        
    </div>
  )
}

export default TopBar