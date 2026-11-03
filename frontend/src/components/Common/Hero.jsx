import React, { useEffect, useState } from 'react'
import hero from '../../assets/banner/hero.png'
import hero2 from '../../assets/banner/hero2.png'
import { Link } from 'react-router-dom';

const slides = [
  {
    image: hero,
    title: "Vacation Ready",
    description:
      "Explore our vacation-ready outfits with fast worldwide shipping.",
  },
  {
    image: hero2,
    title: "New Season",
    description:
      "Discover premium styles for every occasion.",
  },
];
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
     setCurrentSlide((prev) =>
    prev === slides.length -1 ? 0 : prev + 1
    )
    },3000);
    return () => clearInterval(interval)
  },[])


  return (
    <section className='relative'>
        <img className='w-full h-100 md:h-122  lg:h-150 object-cover' src={slides[currentSlide].image} alt="hero_img" />
        <div className='absolute inset-0 bg-black/30   flex items-center justify-center'>
            <div className="text-center text-white p-6">
             <h1 className='text-2xl md:text-4xl font-semibold tracking-tighter mb-4 uppercase '>{slides[currentSlide].title}</h1>
             <p className='text-sm tracking-tighter md:text-lg mb-6'>{slides[currentSlide].description}</p>
             <Link className='bg-white text-gray-950 px-6 py-2 rounded-sm text-lg' to="#" >Shop Now</Link>
            </div>

        </div>
    </section>
  )
}

export default Hero;