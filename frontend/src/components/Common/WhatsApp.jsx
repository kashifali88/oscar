
import { FaWhatsapp } from "react-icons/fa";

const WhatsApp = ({ product }) => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "923195378220";

    let message;

    if (product) {
      const productPrice =
        product.discountedPrice ?? product.price;

      message = `Hello Oscar! I'm interested in this product.

Product: ${product.name}
Price: Rs. ${productPrice}
Product Link: ${window.location.origin}/products/${product._id}

Please provide more details about this product.`;
    } else {
      message = `Hello Oscar! I'm interested in your products.

Please help me explore your collection.`;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={34} />
    </button>
  );
};

export default WhatsApp;
