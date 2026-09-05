import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3d2b1f] text-white w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-10 py-16 max-w-7xl mx-auto">
        {/* Brand & Description */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-11 h-11 shrink-0 bg-white/10 rounded-xl p-1 backdrop-blur-xs flex items-center justify-center border border-white/10">
              <Image
                src="/Logo.png"
                alt="Logo Bambil Shoes"
                width={44}
                height={44}
                className="object-contain w-full h-full"
              />
            </div>
            <h4 className="font-display text-2xl font-bold text-white">
              Bambil Shoes By Dario
            </h4>
          </div>
          <p className="font-sans text-sm text-[#e5e2db] opacity-80 mb-6 max-w-md leading-relaxed">
            © 2026 Bambil Shoes By Dario. Handmade Excellence. Elevando la artesanía tradicional a través de diseños contemporáneos.
          </p>
        </div>

        {/* Contact Links */}
        <div className="col-span-1">
          <h5 className="font-sans text-xs font-bold text-[#ac9181] mb-4 uppercase tracking-widest">Contacto</h5>
          <ul className="space-y-3 font-sans text-sm text-[#e5e2db]/90">
            <li>Santa Elena, Parroquia Colonche - Comuna Bambil Collao</li>
            <li>Lunes a Sábado: 9am - 7pm</li>
            <li>
              <Link
                href="https://maps.app.goo.gl/euKWMGExSx19FbjD6"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-opacity flex items-center gap-1.5 underline">
                <span className="material-symbols-outlined text-sm">map</span> Ver Mapa
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="col-span-1">
          <h5 className="font-sans text-xs font-bold text-[#ac9181] mb-4 uppercase tracking-widest">Social</h5>
          <ul className="space-y-3 font-sans text-sm text-[#e5e2db]/90">
            <li>
              <Link
                href={process.env.NEXT_PUBLIC_ENTERPRISE_FACEBOOK || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline transition-opacity">
                Facebook
              </Link>
            </li>
            <li>
              <Link
                href={process.env.NEXT_PUBLIC_ENTERPRISE_INSTAGRAM || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline transition-opacity">
                Instagram
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Developer Credits & Copyright Sub-footer */}
      <div className="border-t border-[#543d2c] py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#e5e2db]/80">
          <p>© 2026 Bambil Shoes By Dario. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            <span>Desarrollado por:</span>
            <a
              href="https://github.com/StevenRosalesC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D2B48C] hover:text-white font-medium underline underline-offset-4 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Steven Rosales</span>
              <svg
                className="w-4 h-4 fill-current inline-block"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
