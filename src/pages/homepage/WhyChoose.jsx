// import React from "react";
// import {
//   Truck,
//   ShieldCheck,
//   Headphones,
//   Gift,
//   ArrowRight,
// } from "lucide-react";

// const features = [
//   {
//     icon: Truck,
//     title: "Free Shipping",
//     description: (
//       <>
//         On orders over
        
//         ₹1899
//       </>
//     ),
//   },
//   {
//     icon: ShieldCheck,
//     title: "Secure Payments",
//     description: (
//       <>
//         100% secure
      
//         transactions
//       </>
//     ),
//   },
//   {
//     icon: Headphones,
//     title: "24/7 Support",
//     description: (
//       <>
//         We're here to
       
//         help you
//       </>
//     ),
//   },
//   {
//     icon: Gift,
//     title: "Personalized Gifts",
//     description: (
//       <>
//         Make it extra
        
//         special
//       </>
//     ),
//   },
// ];

// const WhyChoose = () => {
//   return (
//     <section className="w-full bg-gradient-to-r from-[#f5f9ff] to-[#eef6ff] py-10 sm:py-12 lg:py-14">
//       <div className="mx-auto  px-5 sm:px-8">
//         <div className="">

//           {/* Left Content */}
//           <div className="text-center  w-full mb-10">
//             <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#4254bf]">
//               Why Choose Vyason
//             </p>

//             <h2 className="text-3xl md:text-5xl font-light uppercase tracking-wide text-[#2c2c2c] leading-tight">
//               Premium Products,
              
//               Thoughtful Gifting
//             </h2>

//             <p className="mb-5  text-[14px] leading-[1.55] text-[#60728c]">
//               We bring you the best quality products with
//               personalized options to make your special
//               moments even more memorable.
//             </p>

           
//           </div>

//           {/* Feature Cards */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//             {features.map((feature, index) => {
//               const Icon = feature.icon;

//               return (
//                 <div
//                   key={index}
//                   className="min-h-[164px] rounded-[9px] border border-[#e1e8f2] bg-white/90 px-6 py-6 shadow-[0_3px_12px_rgba(27,55,90,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_22px_rgba(27,55,90,0.10)]"
//                 >
//                   <Icon
//                     size={32}
//                     strokeWidth={1.8}
//                     className="mb-5 text-[#2456d8]"
//                   />

//                   <h3 className="mb-2 text-[13px] font-bold text-[#14243d]">
//                     {feature.title}
//                   </h3>

//                   <p className="text-[12px] leading-[1.45] text-[#718198]">
//                     {feature.description}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//             <div className="mt-8 text-center">
//             <a
//               href="/products"
//               className="inline-flex items-center gap-2 rounded-full bg-[#4254bf] px-5 py-2.5 text-[12px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4254bf]"
//             >
//               Explore Products
//               <ArrowRight size={15} strokeWidth={2} />
//             </a>
//             </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyChoose;



import React from "react";
import {
  BadgeCheck,
  ShieldCheck,
  Headphones,
  Gift,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Premium Quality",
    description:
      "Carefully selected products for your comfort and trust.",
    icon: BadgeCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    glow: "from-blue-50 to-white",
  },
  {
    title: "Secure Payments",
    description:
      "100% safe and secure transactions with multiple payment options.",
    icon: ShieldCheck,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    glow: "from-amber-50 to-white",
  },
  {
    title: "24/7 Support",
    description:
      "We are always here to help you with a smile.",
    icon: Headphones,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    glow: "from-emerald-50 to-white",
  },
  {
    title: "Thoughtful Gifting",
    description:
      "Make every occasion special with handpicked gifts.",
    icon: Gift,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    glow: "from-rose-50 to-white",
  },
];

const WhyChoose = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f4f8ff] via-white to-[#eef5ff] px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-120px] left-[-80px] h-64 w-64 rounded-full border-[45px] border-indigo-200/50" />

      <div className="pointer-events-none absolute bottom-8 right-10 grid grid-cols-5 gap-3 opacity-50">
        {Array.from({ length: 25 }).map((_, index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-indigo-300"
          />
        ))}
      </div>

      <div className="container relative mx-auto">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-5xl text-center">

          {/* Label */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-5 py-2 text-xs font-bold tracking-[0.25em] text-[#3155d9] shadow-sm">
            <Sparkles size={14} />
            WHY CHOOSE VYASON
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold tracking-tight text-[#111a3a] sm:text-4xl md:text-5xl lg:text-[52px]">
            Premium Products,
            <b className="ml-2 bg-gradient-to-r from-[#3048d8] via-[#4059ee] to-[#1f35c8] bg-clip-text text-transparent">
              Thoughtful Gifting
            </b>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
            We bring you the best quality products with exceptional options
            to make your special moments even more memorable.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`
                  group relative overflow-hidden rounded-3xl
                  border border-white/80
                  bg-gradient-to-br ${feature.glow}
                  p-7
                  shadow-[0_12px_40px_rgba(48,72,216,0.07)]
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:shadow-[0_20px_50px_rgba(48,72,216,0.14)]
                `}
              >

                {/* Card Decorative Circle */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/70 transition-transform duration-500 group-hover:scale-125" />

                {/* Icon */}
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">

                  <div
                    className={`
                      absolute inset-0 rounded-full
                      ${feature.iconBg}
                      opacity-60 blur-xl
                    `}
                  />

                  <div
                    className={`
                      relative flex h-16 w-16 items-center justify-center
                      rounded-2xl ${feature.iconBg}
                      shadow-sm
                      transition-all duration-500
                      group-hover:scale-110
                      group-hover:rotate-3
                    `}
                  >
                    <Icon
                      size={32}
                      strokeWidth={1.8}
                      className={feature.iconColor}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative text-center">

                  <h3 className="text-xl font-bold text-[#101a3a]">
                    {feature.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-[250px] text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className="mx-auto mt-6 h-1 w-10 rounded-full bg-gradient-to-r from-[#3048d8] to-[#6477ff] opacity-0 transition-all duration-500 group-hover:w-16 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">

          <button
            type="button"
            className="
              group inline-flex items-center gap-3
              rounded-full
              bg-gradient-to-r from-[#3048d8] to-[#4254df]
              px-8 py-4
              text-sm font-bold text-white
              shadow-[0_12px_30px_rgba(48,72,216,0.28)]
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_40px_rgba(48,72,216,0.38)]
              active:translate-y-0
            "
          >
            Explore Products

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={16} />
            </span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default WhyChoose;