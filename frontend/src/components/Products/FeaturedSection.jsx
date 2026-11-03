import { HiOutlineCreditCard, HiShoppingBag} from 'react-icons/hi';
import { HiRefresh } from "react-icons/hi";

const FeaturedSection = () => {
  return (
    <section className='px-4 py-16 bg-white'>
        <div className="container mx-auto grid grid-cols-3 text-center gap-8">
        {/* feature 1 */}
        <div className='flex flex-col items-center'>
        <div className=" rounded-full mb-4">
            <HiShoppingBag size={24} />
        </div>
        <h4 className='tracking-tighter mb-2 font-semibold text-sm md:text-lg'>FREE SHIPPING</h4>
        <p className='text-gray-600 text-sm tracking-tighter'>On all orders over 10K</p>
        </div>
        {/* feature 2 */}
        <div className='flex flex-col items-center'>
        <div className=" rounded-full mb-4">
            <HiRefresh size={24} />
        </div>
        <h4 className='tracking-tighter mb-2 font-semibold text-sm md:text-lg'>45 DAYS RETURN</h4>
        <p className='text-gray-600 text-sm tracking-tighter'>Money back guarantee</p>
        </div>
        {/* feature 3 */}
        <div className='flex flex-col items-center'>
        <div className="rounded-full mb-4">
            <HiOutlineCreditCard size={24} />
        </div>
        <h4 className='tracking-tighter mb-2 font-semibold text-sm md:text-lg'>SECURE CHECKOUT</h4>
        <p className='text-gray-600 text-sm tracking-tighter'>100% secure checkout process</p>
        </div>
        </div>
    </section>
  )
}

export default FeaturedSection;