import React from 'react';

interface WhatsAppFloatingChatProps {
  whatsappNumber?: string;
  contextLabel?: string;
}

export const WhatsAppFloatingChat: React.FC<WhatsAppFloatingChatProps> = ({
  whatsappNumber = '+923214800265',
  contextLabel,
}) => {
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const prefix = contextLabel ? `[${contextLabel}] ` : '';
  const defaultText = encodeURIComponent(
    `Assalam-o-Alaikum SZGH Pakistan (KH Enterprises),\n${prefix}I would like to inquire about your CNC products and services.`
  );
  const whatsappHref = `https://wa.me/${cleanPhone}?text=${defaultText}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with SZGH Pakistan (+92 321 4800265)"
      title="Chat on WhatsApp (+92 321 4800265)"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl transition-transform duration-150 hover:scale-110 cursor-pointer"
    >
      {/* Official WhatsApp Vector Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-current"
        aria-hidden="true"
      >
        <path d="M16.004 3.2c-7.072 0-12.8 5.728-12.8 12.8 0 2.256.592 4.464 1.712 6.416L3.2 28.8l6.56-1.712c1.888 1.024 4.016 1.568 6.24 1.568h.004c7.072 0 12.8-5.728 12.8-12.8 0-3.424-1.328-6.64-3.744-9.056C22.644 4.528 19.428 3.2 16.004 3.2zm0 23.296c-1.92 0-3.808-.512-5.456-1.488l-.384-.224-4.048 1.056 1.072-3.952-.256-.4c-1.072-1.712-1.648-3.68-1.648-5.712 0-5.904 4.816-10.72 10.724-10.72 2.864 0 5.552 1.12 7.584 3.136 2.016 2.032 3.136 4.72 3.136 7.584 0 5.904-4.816 10.72-10.724 10.72zm5.872-8.016c-.32-.16-1.904-.944-2.192-1.04-.288-.112-.512-.16-.72.16-.208.32-.832 1.04-1.024 1.264-.192.208-.368.24-.688.08-.32-.16-1.36-.5-2.592-1.6-.96-.848-1.6-1.888-1.792-2.208-.192-.32-.016-.496.144-.656.144-.144.32-.368.48-.56.16-.192.208-.32.32-.528.112-.208.048-.4-.032-.56-.08-.16-.72-1.744-.992-2.384-.256-.624-.528-.544-.72-.544-.192-.016-.4-.016-.608-.016-.208 0-.56.08-.848.4-.288.32-1.12 1.088-1.12 2.656s1.152 3.088 1.312 3.296c.16.208 2.256 3.44 5.472 4.832.768.336 1.36.528 1.824.672.768.24 1.472.208 2.032.128.624-.096 1.904-.784 2.176-1.536.272-.752.272-1.392.192-1.536-.08-.144-.288-.224-.608-.384z" />
      </svg>
    </a>
  );
};
