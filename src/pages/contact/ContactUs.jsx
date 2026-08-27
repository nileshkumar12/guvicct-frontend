
import React, { useState } from 'react'
import { API_URL } from '../../utils/config'
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [successMessage , setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const formData = new FormData(e.target);

        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

      const response = await fetch(
        `${API_URL}/api/email/contactemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to send message"
        );
      }
      setSuccessMessage("Your message has been sent successfully. we will get back to you soon.");
      console.log("Contact email sent:", result);

    } catch (error) {
      console.error("Error sending contact email:", error)
      setErrorMessage("Failed to send message. Please try again later.");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Contact Us
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            We'd Love to Hear From You
          </h1>

          <p className="mt-4 text-gray-600">
            Have a question about our products, your order, or anything else?
            Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">

          {/* Contact Information */}
          <div className="lg:col-span-4">
            <div className="h-full rounded-2xl bg-blue-600 p-8 text-white shadow-lg">

              <h2 className="text-2xl font-bold">
                Get in Touch
              </h2>

              <p className="mt-3 text-blue-100">
                We're here to help. Contact us through any of the options
                below.
              </p>

              <div className="mt-10 space-y-7">

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl">
                    📍
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Address
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-blue-100">
                      Nilesh Kumar, 123 Main Street
                      <br />
                      Gurgaon, Haryana, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl">
                    📞
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Phone
                    </h3>

                    <a
                      href="tel:+919999999999"
                      className="mt-1 block text-sm text-blue-100 hover:text-white"
                    >
                      +91 9560640433
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl">
                    ✉️
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Email
                    </h3>

                    <a
                      href="mailto:support@example.com"
                      className="mt-1 block text-sm text-blue-100 hover:text-white"
                    >
                      nilesh.kumar12@gmail.com
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl">
                    🕒
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Working Hours
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-blue-100">
                      Monday - Friday
                      <br />
                      9:30 AM - 6:30 PM
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

              <h2 className="text-2xl font-bold text-gray-900">
                Send Us a Message
              </h2>

              <p className="mt-2 text-gray-500">
                Fill out the form below and we'll get back to you shortly.
              </p>

              {submitted && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  Thank you! Your message has been submitted successfully.
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >

                {/* Name + Email */}
                <div className="grid gap-6 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                </div>

                {/* Phone + Subject */}
                <div className="grid gap-6 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10)

                        setFormData((prev) => ({
                          ...prev,
                          phone: value,
                        }))
                      }}
                      placeholder="10 digit phone number"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Send Message
                  </button>
                </div>

              </form>
                    {successMessage && (
                      <p className="mt-4 text-sm text-green-600">
                        {successMessage}
                      </p>
                    )}
                    {errorMessage && (
                      <p className="mt-4 text-sm text-red-600">
                        {errorMessage}
                      </p>
                    )}

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ContactUs

