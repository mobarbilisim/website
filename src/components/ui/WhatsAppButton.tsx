export default function WhatsAppButton() {
  const phone = "905330407227"; // 0533 040 72 27
  const message = encodeURIComponent("Merhaba, Mobar Bilişim hakkında bilgi almak istiyorum.");
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 group"
    >
      {/* Tooltip */}
      <span className="absolute left-16 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
        WhatsApp&apos;tan Yaz
      </span>

      {/* Button */}
      <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-400/40 hover:scale-110 transition-transform duration-200">
        <svg width="30" height="30" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.002 3C8.822 3 3 8.822 3 16.002c0 2.304.617 4.566 1.789 6.543L3 29l6.624-1.738A13.02 13.02 0 0 0 16.002 29C23.178 29 29 23.178 29 16.002 29 8.822 23.178 3 16.002 3zm0 23.84a10.863 10.863 0 0 1-5.531-1.513l-.397-.235-4.11 1.078 1.096-4.003-.26-.413A10.853 10.853 0 0 1 5.16 16.002c0-5.98 4.864-10.84 10.842-10.84s10.84 4.86 10.84 10.84-4.862 10.838-10.84 10.838zm5.946-8.12c-.325-.163-1.924-.95-2.222-1.058-.299-.108-.516-.163-.733.163-.217.325-.84 1.058-.03 1.058l.626.163c.326.108.734-.054 1.004-.217.27-.163.624-.108.083.433-.217.217-.454.38-.675.543-.22.163-.453.217-.734.054-.307-.163-1.3-.479-2.477-1.528-.915-.815-1.533-1.82-1.713-2.13-.18-.31-.019-.478.135-.632.138-.138.307-.362.46-.543.156-.18.207-.307.31-.516.104-.208.052-.39-.026-.543-.078-.163-.733-1.763-1.004-2.414-.264-.635-.533-.548-.733-.558l-.624-.01c-.217 0-.57.08-.868.39-.299.309-1.138 1.112-1.138 2.712 0 1.6 1.165 3.143 1.328 3.36.163.217 2.29 3.497 5.547 4.906.776.334 1.381.534 1.853.683.779.247 1.489.212 2.049.128.625-.093 1.924-.787 2.196-1.547.271-.76.271-1.412.19-1.547-.08-.135-.298-.217-.624-.38z"/>
        </svg>
      </div>

      {/* Pulse animation */}
      <span className="absolute w-14 h-14 bg-[#25D366] rounded-full animate-ping opacity-20 pointer-events-none" />
    </a>
  );
}
