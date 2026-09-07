import React, { useState } from "react";
import { Link } from "react-router-dom";

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const categories = [
    {
      icon: "📦",
      title: "Orders & Delivery",
      description: "Track orders, delivery times and order status.",
      link: "#orders",
    },
    {
      icon: "↩",
      title: "Returns & Refunds",
      description: "Learn about returns, refunds and replacements.",
      link: "#returns",
    },
    {
      icon: "💳",
      title: "Payments",
      description: "Payment methods, failed payments and billing.",
      link: "#payments",
    },
    {
      icon: "👤",
      title: "Account",
      description: "Manage your account, password and profile.",
      link: "#account",
    },
    {
      icon: "🚚",
      title: "Shipping",
      description: "Shipping charges, delivery areas and tracking.",
      link: "#shipping",
    },
    {
      icon: "🔒",
      title: "Security",
      description: "Information about account and payment security.",
      link: "#security",
    },
  ];

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "You can track your order from your account. Go to Dashboard → Orders and select the order you want to track. If tracking information is available, you will see the current delivery status there.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery time depends on your location and the product. You can view the estimated delivery date during checkout and track the order after it has been shipped.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Orders can be cancelled while they are still being processed. Once an order has been shipped, cancellation may no longer be available.",
    },
    {
      question: "How do I request a return?",
      answer:
        "Go to Dashboard → Orders, open the relevant order and select the return option if the product is eligible for return.",
    },
    {
      question: "How long does a refund take?",
      answer:
        "After your return has been approved and processed, the refund will be initiated to your original payment method. Processing time may vary depending on the payment provider.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We support multiple payment options including online payments through our secure payment gateway and other methods available during checkout.",
    },
  ];

  const popularQuestions = [
    "Where is my order?",
    "How can I return an item?",
    "When will I receive my refund?",
    "How do I change my address?",
    "My payment failed",
    "How do I reset my password?",
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-white text-[#172231]">


      <section className="relative overflow-hidden bg-[#172231]">

        {/* Decorative shapes */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-20 text-center sm:px-10 lg:py-28">

          <div className="mx-auto max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
              Help Center
            </p>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              How can we
              <span className="block text-blue-300">
                help you today?
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              Find answers, manage your orders, learn about returns,
              or get in touch with our support team.
            </p>

            {/* Search */}
            <div className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row">

              <div className="relative flex-1">

                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="h-14 w-full rounded-xl border border-white/10 bg-white px-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                />

              </div>

              <button
                type="button"
                className="h-14 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Search
              </button>

            </div>

            <p className="mt-5 text-xs text-gray-400">
              Popular:
              <span className="ml-2 text-gray-300">
                Order tracking · Returns · Payments · Delivery
              </span>
            </p>

          </div>

        </div>
      </section>


      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-20">

        <div className="mx-auto max-w-[1200px]">

          <div className="mb-10">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
              Browse Topics
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#172231] sm:text-4xl">
              What can we help with?
            </h2>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category) => (
              <a
                key={category.title}
                href={category.link}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    {category.icon}
                  </div>

                  <span className="text-xl text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>

                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#172231]">
                  {category.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {category.description}
                </p>

              </a>
            ))}

          </div>

        </div>
      </section>

      
      <section className="bg-[#fafafa] px-6 py-16 sm:px-10 lg:px-16">

        <div className="mx-auto max-w-[1200px]">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Left */}
            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                Quick Answers
              </p>

              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#172231] sm:text-4xl">
                Popular questions
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
                Looking for something specific? These are some of the
                questions our customers ask most often.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">

                {popularQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {question}
                  </button>
                ))}

              </div>

            </div>

            {/* Right */}
            <div className="space-y-3">

              {faqs.slice(0, 4).map((faq, index) => (

                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >

                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left"
                  >

                    <span className="text-sm font-semibold text-[#172231]">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform ${
                        openFaq === index ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>

                  </button>

                  {openFaq === index && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                      <p className="text-sm leading-6 text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  )}

                </div>

              ))}

            </div>

          </div>

        </div>
      </section>


      <section
        id="orders"
        className="px-6 py-16 sm:px-10 lg:px-16 lg:py-20"
      >

        <div className="mx-auto max-w-[1200px]">

          <div className="overflow-hidden rounded-3xl bg-[#172231]">

            <div className="grid lg:grid-cols-2">

              {/* Content */}
              <div className="px-7 py-12 sm:px-10 lg:px-14 lg:py-16">

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
                  Order Tracking
                </p>

                <h2 className="mt-4 font-serif text-3xl font-semibold text-white sm:text-4xl">
                  Wondering where your order is?
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-6 text-gray-300">
                  Track your order status, shipment updates and delivery
                  information directly from your account.
                </p>

                <Link
                  to="/dashboard/orders"
                  className="mt-7 inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#172231] transition hover:bg-gray-100"
                >
                  View My Orders
                  <span>→</span>
                </Link>

              </div>

              {/* Visual */}
              <div className="relative flex min-h-[300px] items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-8">

                <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        Order
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-800">
                        #ORD-20260825
                      </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                      On the way
                    </span>

                  </div>

                  <div className="mt-7">

                    <div className="relative">

                      <div className="absolute left-3 right-3 top-3 h-0.5 bg-gray-200" />

                      <div className="relative flex justify-between">

                        <div className="text-center">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                            ✓
                          </div>
                          <p className="mt-2 text-[10px] text-gray-500">
                            Ordered
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                            ✓
                          </div>
                          <p className="mt-2 text-[10px] text-gray-500">
                            Shipped
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                            •
                          </div>
                          <p className="mt-2 text-[10px] font-medium text-blue-600">
                            Delivery
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}
      <section className="px-6 py-16 sm:px-10 lg:px-16 lg:py-20">

        <div className="mx-auto max-w-[900px]">

          <div className="text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
              FAQ
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold text-[#172231] sm:text-4xl">
              Frequently asked questions
            </h2>

          </div>

          <div className="mt-10 space-y-3">

            {faqs.map((faq, index) => (

              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >

                <button
                  type="button"
                  onClick={() => toggleFaq(index + 10)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >

                  <span className="text-sm font-semibold text-[#172231] sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform ${
                      openFaq === index + 10 ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>

                </button>

                {openFaq === index + 10 && (
                  <div className="border-t border-gray-100 px-6 pb-6 pt-4">
                    <p className="text-sm leading-7 text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                )}

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT SUPPORT
      ====================================================== */}
      <section className="px-6 pb-20 sm:px-10 lg:px-16">

        <div className="mx-auto max-w-[1200px]">

          <div className="rounded-3xl bg-[#f5f8fc] px-6 py-12 text-center sm:px-10 lg:py-16">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
              💬
            </div>

            <h2 className="mt-6 font-serif text-3xl font-semibold text-[#172231] sm:text-4xl">
              Still need help?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500">
              Our support team is ready to help. Send us your question
              and we'll get back to you as soon as possible.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/contact"
                className="rounded-lg bg-[#172231] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#27384b]"
              >
                Contact Support
              </Link>

              <a
                href="mailto:support@example.com"
                className="rounded-lg border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Email Us
              </a>

            </div>

            <p className="mt-5 text-xs text-gray-400">
              Typically replies within 24 hours
            </p>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Help;