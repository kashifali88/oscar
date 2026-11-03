import React from 'react'
import TopBar from '../Layout/TopBar';
import Navbar from './Navbar';

const Header = () => {
  return (
    <div className='border-b shadow:lg border-gray-200'>
      {/* Top bar */}
      <TopBar />
      {/* Navbar */}
      <Navbar  />
    </div>
  )
}

export default Header;
