import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#3d2b1f] text-white w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-10 py-16 max-w-7xl mx-auto">
        {/* Brand & Copyright */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-display text-2xl font-bold text-white mb-4">Bambil Shoes By Dario</h4>
          <p className="font-sans text-sm text-[#e5e2db] opacity-80 mb-6 max-w-md leading-relaxed">
            © 2026 Bambil Shoes By Dario. Handmade Excellence. Elevando la artesanía tradicional a través de de diseños contemporáneos.
          </p>
        </div>
        
        {/* Contact Links */}
        <div className="col-span-1">
          <h5 className="font-sans text-xs font-bold text-[#ac9181] mb-4 uppercase tracking-widest">Contacto</h5>
          <ul className="space-y-3 font-sans text-sm text-[#e5e2db]/90">
            <li>Calle Taller Artesanal 123</li>
            <li>Lunes a Sábado: 9am - 7pm</li>
            <li>
              <a href="#" className="hover:text-white transition-opacity flex items-center gap-1.5 underline">
                <span className="material-symbols-outlined text-sm">map</span> Ver Mapa
              </a>
            </li>
          </ul>
        </div>
        
        {/* Social Links */}
        <div className="col-span-1">
          <h5 className="font-sans text-xs font-bold text-[#ac9181] mb-4 uppercase tracking-widest">Social</h5>
          <ul className="space-y-3 font-sans text-sm text-[#e5e2db]/90">
            <li>
              <a href="#" className="hover:text-white hover:underline transition-opacity">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white hover:underline transition-opacity">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
