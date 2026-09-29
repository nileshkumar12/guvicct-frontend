import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Heart,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  Zap,
} from "lucide-react";

const AboutUs = () => {
  const stats = [
    {
      value: "10K+",
      label: "Products",
    },
    {
      value: "1K+",
      label: "Trusted Sellers",
    },
    {
      value: "25K+",
      label: "Happy Customers",
    },
    {
      value: "100%",
      label: "Shopping Focus",
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Trust First",
      description:
        "We focus on creating a secure and transparent shopping experience where customers can shop with confidence.",
    },
    {
      icon: Sparkles,
      title: "Quality & Value",
      description:
        "We bring together products that offer a balance of quality, useful features and competitive pricing.",
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description:
        "Every experience matters. We continuously work to make discovering, buying and receiving products easier.",
    },
    {
      icon: Zap,
      title: "Simple Shopping",
      description:
        "From product discovery to checkout, our goal is to keep online shopping simple, fast and convenient.",
    },
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: "Wide Product Selection",
      text: "Discover products across multiple categories in one convenient marketplace.",
    },
    {
      icon: Users,
      title: "Growing Seller Community",
      text: "We provide sellers with a platform to showcase their products and reach more customers.",
    },
    {
      icon: Truck,
      title: "Convenient Delivery",
      text: "We aim to make the journey from checkout to doorstep smooth and reliable.",
    },
    {
      icon: Globe2,
      title: "Built for Everyone",
      text: "Vyason is designed to bring a modern shopping experience to customers across India.",
    },
  ];

  return (
    <main className="bg-white text-gray-900">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#0f172a]">
        {/* Background decoration */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Left */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur">
                <Sparkles size={16} className="text-indigo-400" />
                <span>Welcome to Vyason</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Shopping made
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  simpler & smarter.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-300 sm:text-lg">
                Vyason is a modern online marketplace built to bring
                customers and sellers together through a simple,
                convenient and trusted shopping experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/shop"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Explore Products
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative mx-auto max-w-lg">
                {/* Main card */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">
                          The Vyason Marketplace
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-white">
                          Discover More.
                        </h3>
                      </div>

                      <div className="rounded-2xl bg-white/10 p-3">
                        <ShoppingBag
                          className="text-indigo-300"
                          size={28}
                        />
                      </div>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-3">
                      {[
                        "Fashion",
                        "Electronics",
                        "Home & Living",
                        "Gifts & Toys",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-gray-200"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-white p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-green-50 p-2.5">
                      <CheckCircle2
                        size={22}
                        className="text-green-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Trusted Shopping
                      </p>
                      <p className="text-xs text-gray-500">
                        Built around customers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-100 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-10 text-center"
            >
              <div className="text-3xl font-bold tracking-tight text-gray-900">
                {stat.value}
              </div>

              <div className="mt-1 text-sm text-gray-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Visual */}
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-1">
                <div className="rounded-[1.8rem] bg-gray-950 p-10 sm:p-14">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                    Our Story
                  </p>

                  <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
                    More than a marketplace.
                    <span className="block text-gray-400">
                      A better way to shop.
                    </span>
                  </h2>

                  <div className="mt-10 space-y-6">
                    <div className="flex gap-4">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                      <p className="text-sm leading-7 text-gray-400">
                        Vyason was created with a simple idea: online
                        shopping should feel convenient, transparent and
                        enjoyable.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-purple-400" />
                      <p className="text-sm leading-7 text-gray-400">
                        Our marketplace connects customers with a growing
                        range of products and sellers through one seamless
                        platform.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-pink-400" />
                      <p className="text-sm leading-7 text-gray-400">
                        We continue to build Vyason around the things that
                        matter most — choice, value, trust and customer
                        experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                Who We Are
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                A marketplace designed around people.
              </h2>

              <p className="mt-6 text-base leading-8 text-gray-600">
                Vyason brings together customers, brands and sellers in
                one modern shopping destination. Our goal is to make it
                easier to discover useful products, compare options and
                complete purchases with confidence.
              </p>

              <p className="mt-5 text-base leading-8 text-gray-600">
                From everyday essentials to products that add something
                special to your life, we are building an experience that
                puts convenience and choice at the centre of online
                shopping.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Easy product discovery",
                  "Transparent shopping experience",
                  "Growing seller ecosystem",
                  "Customer-focused experience",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-indigo-600"
                    />

                    <span className="font-medium text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              What We Believe
            </p>

           
            <h2 class="text-3xl font-extrabold tracking-tight text-[#111a3a] sm:text-4xl md:text-5xl lg:text-[52px]"> Built on simple <b class="ml-2 bg-gradient-to-r from-[#3048d8] via-[#4059ee] to-[#1f35c8] bg-clip-text text-transparent">principles</b></h2>

            <p className="mt-5 text-gray-600">
              Everything we build at Vyason is guided by a few simple
              principles that help us create a better marketplace.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 ">
                    <Icon size={23} className="group-hover:text-white" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-gray-950 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">
                Why Vyason
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything you need for a better shopping journey.
              </h2>

              <p className="mt-6 leading-8 text-gray-400">
                We are creating a marketplace where discovery,
                convenience and customer experience come together.
              </p>

              <a
                href="/shop"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-white"
              >
                Start Shopping
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.07]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-5 font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Heart size={25} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Our Mission
          </p>
    
          <h2 class="text-3xl font-extrabold tracking-tight text-[#111a3a] sm:text-4xl md:text-5xl lg:text-[52px]"> Making everyday shopping <br/><b class="ml-2 bg-gradient-to-r from-[#3048d8] via-[#4059ee] to-[#1f35c8] bg-clip-text text-transparent"> easier for everyone.</b></h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            Our mission is to create a marketplace where customers can
            discover products they love, sellers can grow their businesses,
            and every shopping journey feels simple and reliable.
          </p>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-16 text-center shadow-2xl sm:px-12 lg:py-20">

          <Sparkles
            className="mx-auto text-white/80"
            size={28}
          />

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Ready to discover something new?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Explore products, discover great deals and experience
            shopping with Vyason.
          </p>

          <a
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Explore Vyason
            <ArrowRight size={18} />
          </a>

        </div>
      </section>

    </main>
  );
};

export default AboutUs;