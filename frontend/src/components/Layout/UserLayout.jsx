import React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <>
    <Header />
    {/* main content */}
    <main className='min-h-screen'>
      <Outlet />
    </main>
    <Footer />
    </>
  )
}

export default UserLayout