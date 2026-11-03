import { IoMdClose } from 'react-icons/io';
import CartContent from '../Cart/CartContent';
import { useNavigate } from 'react-router-dom'

const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
  const navigate  = useNavigate();
  const handleCheckout = () => {
    navigate("/checkout")
    toggleCartDrawer()
  }
   
  return (
    <>
    {drawerOpen && 
    <div onClick={toggleCartDrawer} className='fixed inset-0 bg-black/10 z-40' /> }
    <div className={`fixed top-0 right-0 w-3/4  sm:w-sm h-full
     bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 
     ${drawerOpen ? "translate-x-0" : "translate-x-full"} `}>
        <div className='flex justify-end p-4'>
         <button onClick={toggleCartDrawer}>
            <IoMdClose size={22} className='hover:text-black text-gray-600' />
         </button>
        </div>
        {/* Cart content with scrollable area  */}
        <div className='grow p-4 overflow-y-auto '>
        <h2 className='text-xl font-semibold mb-4'>Your Cart</h2>
        {/* component for cart content */} 
        <CartContent />
        </div>
        {/* checkout button fixed at the bottom */}
        <div className='p-4 bg-white sticky bottom-0'>
            <button
            onClick={handleCheckout}
             className='w-full rounded-md hover:bg-gray-900 bg-black text-white font-medium px-4 py-3'>Checkout</button>
            <p className='text-sm tracking-tighter text-gray-500 mt-2 text-center'>Shipping, taxes, discount codes calculated at checkout.</p>
        </div>
    </div> 
    </>                                       

  )
}

export default CartDrawer;

