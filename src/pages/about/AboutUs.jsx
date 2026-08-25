import React from 'react'
import { Link } from 'react-router-dom'
const AboutUs = () => {
 const values = [
    {
      icon: "♡",
      title: "Customer First",
      description:
        "We put our customers at the heart of everything we do.",
    },
    {
      icon: "◇",
      title: "Quality First",
      description:
        "We choose quality, so you get the best every time.",
    },
    {
      icon: "▱",
      title: "Fast & Reliable",
      description:
        "Quick delivery, real-time updates, and always on time.",
    },
    {
      icon: "♧",
      title: "Trust & Transparency",
      description:
        "Secure payments, easy returns, and honest service.",
    },
  ];

  const stats = [
    {
      value: "10K+",
      label: "Happy Customers",
      icon: "♧",
    },
    {
      value: "5K+",
      label: "Products",
      icon: "◇",
    },
    {
      value: "50+",
      label: "Top Brands",
      icon: "♡",
    },
    {
      value: "24/7",
      label: "Customer Support",
      icon: "◌",
    },
  ];

  return (
    <main className="bg-white text-[#172231]">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-[1440px]">

          <div className="grid min-h-[620px] lg:grid-cols-2">

            {/* Left Content */}
            <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-20">

              <div className="max-w-[600px]">

                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#ad7a36]">
                  About Us
                </p>

                <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#172231] sm:text-6xl xl:text-[72px]">
                  More than a store.
                  <br />
                  We're your shopping
                  <br />
                  partner.
                </h1>

                <p className="mt-7 max-w-[520px] text-base leading-7 text-gray-600 sm:text-lg">
                  ShopNest was built with a simple idea — to make online
                  shopping easy, enjoyable and trustworthy for everyone.
                </p>

                <Link
                  to="/products"
                  className="mt-8 inline-flex items-center gap-4 rounded-md bg-[#172231] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#27384b]"
                >
                  Explore Our Collection

                  <span className="text-lg">→</span>
                </Link>

                {/* Trust Points */}
                <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-3">

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#eadfce] text-xl text-[#ad7a36]">
                      ♧
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#172231]">
                        Quality Products
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Carefully selected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#eadfce] text-xl text-[#ad7a36]">
                      ♢
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#172231]">
                        Secure Shopping
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        100% protected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#eadfce] text-xl text-[#ad7a36]">
                      ◌
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#172231]">
                        Customer Support
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        We're here for you
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative min-h-[450px] overflow-hidden lg:min-h-full">

              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=85"
                alt="Premium shopping collection"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/5" />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="px-5 py-10 sm:px-8 lg:py-14">

        <div className="mx-auto max-w-[1340px] rounded-3xl bg-[#faf8f5] px-5 py-8 sm:px-8 lg:px-12">

          <div className="grid grid-cols-2 lg:grid-cols-4">

            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`
                  flex flex-col items-center justify-center px-4 py-6 text-center
                  ${
                    index !== stats.length - 1
                      ? "border-r border-gray-200"
                      : ""
                  }
                  ${
                    index === 1
                      ? "lg:border-r"
                      : ""
                  }
                `}
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f1e8dc] text-xl text-[#ad7a36]">
                  {stat.icon}
                </div>

                <p className="font-serif text-3xl font-semibold text-[#172231] sm:text-4xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-sm font-medium text-gray-600">
                  {stat.label}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          OUR STORY
      ====================================================== */}
      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">

        <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Story Text */}
          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ad7a36]">
              Our Story
            </p>

            <h2 className="mt-5 max-w-xl font-serif text-4xl font-semibold leading-tight text-[#172231] sm:text-5xl">
              Built with passion,
              <br />
              driven by purpose.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600">
              We started ShopNest to bring the best products closer to
              you. From quality selection to fast delivery, every detail
              is designed around what matters most — you.
            </p>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
              Our goal is simple: create an online shopping experience
              that feels personal, reliable and effortless.
            </p>

            <div className="mt-8">
              <span className="font-serif text-2xl italic text-[#172231]">
                Team ShopNest
              </span>

              <span className="ml-3 text-2xl text-[#ad7a36]">
                ♡
              </span>
            </div>

          </div>

          {/* Story Images */}
          <div className="relative min-h-[430px]">

            {/* Main Image */}
            <div className="absolute right-0 top-0 h-[350px] w-[88%] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85"
                alt="ShopNest workspace"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Small Image */}
            <div className="absolute bottom-0 left-0 h-[190px] w-[42%] overflow-hidden rounded-xl border-8 border-white shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=85"
                alt="Products"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product Box */}
            <div className="absolute bottom-[-15px] left-[39%] h-[130px] w-[150px] overflow-hidden rounded-xl border-8 border-white shadow-lg sm:h-[145px] sm:w-[170px]">
              <img
                src="https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=600&q=85"
                alt="ShopNest package"
                className="h-full w-full object-cover"
              />
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          VALUES
      ====================================================== */}
      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-20">

        <div className="mx-auto max-w-[1280px]">

          <div className="mb-12 text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ad7a36]">
              What We Believe
            </p>

            <h2 className="mt-4 font-serif text-4xl font-semibold text-[#172231] sm:text-5xl">
              Our Values
            </h2>

          </div>

          <div className="grid border-y border-gray-200 md:grid-cols-2 lg:grid-cols-4">

            {values.map((value, index) => (
              <div
                key={value.title}
                className={`
                  px-6 py-10
                  ${
                    index !== values.length - 1
                      ? "border-b border-gray-200 lg:border-b-0 lg:border-r"
                      : ""
                  }
                  ${
                    index === 1
                      ? "md:border-r lg:border-r"
                      : ""
                  }
                `}
              >

                <div className="text-4xl font-light text-[#ad7a36]">
                  {value.icon}
                </div>

                <h3 className="mt-6 font-serif text-xl font-semibold text-[#172231]">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {value.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="px-5 py-12 sm:px-8 lg:py-16">

        <div className="mx-auto max-w-[1340px] overflow-hidden rounded-3xl bg-[#172231]">

          <div className="relative min-h-[350px]">

            {/* Background image */}
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />

            <div className="absolute inset-0 bg-[#172231]/80" />

            <div className="relative z-10 flex min-h-[350px] items-center px-7 py-12 sm:px-12 lg:px-16">

              <div className="max-w-xl">

                <h2 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Let's make shopping
                  <br />
                  simple for you.
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-6 text-gray-300 sm:text-base">
                  Join thousands who trust ShopNest for quality products,
                  great prices and an amazing shopping experience.
                </p>

                <Link
                  to="/products"
                  className="mt-7 inline-flex items-center gap-4 rounded-md bg-[#f3e7d5] px-7 py-4 text-sm font-semibold text-[#172231] transition hover:bg-white"
                >
                  Start Shopping
                  <span className="text-lg">→</span>
                </Link>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          TRUSTED BRANDS
      ====================================================== */}
      <section className="px-6 pb-16 pt-5">

        <div className="mx-auto max-w-[1100px]">

          <p className="text-center text-sm text-gray-500">
            Trusted by thousands of happy customers
          </p>

          <div className="mt-8 grid grid-cols-2 items-center gap-8 text-center text-xl font-bold text-gray-400 sm:grid-cols-3 lg:grid-cols-6">

            <span className="font-sans tracking-tight">
              PUMA
            </span>

            <span className="font-sans italic">
              adidas
            </span>

            <span className="font-serif">
              Levi's
            </span>

            <span className="font-serif tracking-wider">
              ZARA
            </span>

            <span className="text-3xl italic">
              NIKE
            </span>

            <span className="font-sans tracking-wide">
              PHILIPS
            </span>

          </div>

        </div>
      </section>

    </main>
   
   
  )
}

export default AboutUs