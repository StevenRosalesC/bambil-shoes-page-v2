import React from "react";

export default function InstagramFeed() {
  const feedItems = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_dNoiXnJaWGkaO5zFoLW99yActG5gx032RgLySpxypzs3oiMQiOFy4j6EPfnhz-BOp7prPWR3rYM5px5zQuLjxOMP-3ZZ00wQTdlHLSkM83oDo1GQ3YL5sPOtrbOMCSKIgQV0N_I7EIwyYnVlMkURM6f26knM89Yp_h1dIwHpCulSoWVgBFTgEBma9FCwdTsnBylUDsa4UiDtflyhe_kySFb7iIDmoJ6Ca8BWvO4z6jEm8be0JrLhmroyjW0Y5cD_onFUquGih9pm",
      offset: false,
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS30fVcJGwUbFki4QB1AXWCFjCD2TGi0NOFloTdw2wTyE2fDAU0absEORbg2Kkx85JQDhia1kqn7x86EXrKaHw0X6RjYYdpaS77-FfqLaMFqN0hpahblxhL0fJNMLbYQaOZ5j0-_KKxu1wrFDk5NXKanFHCbrnckRd4svWVd1nOh_5ffIFqJDiT4MjaH5wGuZ2PD8WfCar8-p_4QgFUsQVvCl7CC_jCKoNz3Fc4HJZeIcrNHOj91jLQFucMlIegqYHRjuZTsKocUFg",
      offset: true,
    },
    {
      id: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZOAPmfcKFNh_YzHcjZaGNfPxBAhT-jE8SYJaIyYrBhGOuVnjPLeir0jkTam6pon8ov_pDA1MsUjmi6gcLhlHLz28PBUKmVmrm3ca2dEVOPVn4REHwmUWdjp6Ul5RnEgoAi_y_oey-hzhmqiaGK98A584uBVLgoEFLVPV_F9TOpbrxH6wHhtUfHOCQTHwajnAyjcxkWkj2tzb_YBhtZZaUucFntx0OW2i7rtm44ogIdeuqRuuvqMbSEAIVVWcf7gmmrLmDhZVttjTP",
      offset: false,
    },
    {
      id: 4,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDld1nZmZMeLJoEMfC-E4ZNnnpZZBzoU6_2uuLt4SLGV5tjsqqJbzSZtXM6uhyqDT63V-nHEF5L67CtlPBnPxpQzV1TUFcED2laNZTvmUMBXXxA1d07ddouL311cqqE_835yX-kkhz85mMrG37V5PDgT1TKYvulyZcqI2IBK088uOBZQ4u3XqRfbSloiEvPl1H7x8r6oA_lRxlPcWpQO-9_w_z4xzDJhIXm9fw3jRatVjoB6V6VNfOgYzAl0BRL2qtQYHQeefNCm2JD",
      offset: true,
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
              <img
                src={item.image}
                alt={`Instagram feed ${item.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#26170c]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">favorite</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="inline-flex items-center gap-2 font-sans text-xs md:text-sm font-semibold text-[#26170c] border-b border-[#26170c] pb-1 hover:text-[#725a39] hover:border-[#725a39] transition-colors"
            href="#"
          >
            Síguenos en @BambilShoes{" "}
            <span className="material-symbols-outlined text-sm font-bold">open_in_new</span>
          </a>
        </div>
      </div>
    </section>
  );
}
