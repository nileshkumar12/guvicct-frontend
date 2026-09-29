import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "919560640433"; // Country code + number, no + or spaces
  const message = "Hello! How can I help you with your VYASON order today?"; // Default message to send

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-5 right-5 z-50
        flex h-14 w-14 items-center justify-center
        rounded-full bg-[#25D366]
        text-white shadow-lg
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        md:h-16 md:w-16
      "
    >
      <FaWhatsapp className="text-3xl md:text-4xl" />
    </a>
  );
};

export default WhatsAppButton;