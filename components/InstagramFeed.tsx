import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function InstagramFeed() {
  const feedItems = [
    {
      id: 1,
      image: "/images/instagramImages/01.jpg",
      offset: false,
      alt: " Una noche llena de elegancia, belleza y grandes momentos en el Miss Ecuador 2026",
      url: "https://www.instagram.com/p/DcrZSz5G5O6",
    },
    {
      id: 2,
      image: "/images/instagramImages/02.jpg",
      offset: true,
      alt: "Una noche para recordar",
      url: "https://www.instagram.com/p/DcrYf3hm5bH",
    },
    {
      id: 3,
      image: "/images/instagramImages/03.jpg",
      offset: false,
      alt: "Los mejores diseños solo en Bambil Shoes",
      url: "https://www.instagram.com/p/DZwD8c1NynY",
    },
    {
      id: 4,
      image: "/images/instagramImages/04.jpg",
      offset: true,
      alt: "Dali Model y Asesora de Reina 👸 y Bambil Shoes",
      url: "https://www.instagram.com/p/DZaQWL2yVTo",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-10 bg-[#f6f3ec]" id="instagram">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="material-symbols-outlined text-[#725a39] text-4xl mb-4">photo_camera</span>
          <h2 className="font-display text-3xl md:text-4xl text-[#26170c] mb-2 font-semibold">#PasosConHistoria</h2>
          <p className="font-sans text-sm md:text-base text-[#4f453f]">
            Nuestros diseños, tu estilo de vida. Etiquétanos para aparecer en nuestra galería.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {feedItems.map((item) => (
            <div
              key={item.id}
              className={`aspect-square bg-[#e5e2db] rounded overflow-hidden relative group cursor-pointer shadow-sm ${
                item.offset ? "mt-0 md:mt-8" : ""
              }`}
            >
              <Image
                src={item.image}
                alt={`Instagram feed ${item.id}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#26170c]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link href={item.url || "#"} target="_blank" rel="noopener noreferrer">
                  <span className="material-symbols-outlined text-white text-3xl">favorite</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            className="inline-flex items-center gap-2 font-sans text-xs md:text-sm font-semibold text-[#26170c] border-b border-[#26170c] pb-1 hover:text-[#725a39] hover:border-[#725a39] transition-colors"
            href={process.env.NEXT_PUBLIC_ENTERPRISE_INSTAGRAM || "#"}
            target="_blank"
          >
            Síguenos en @BambilShoes{" "}
            <span className="material-symbols-outlined text-sm font-bold">open_in_new</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
