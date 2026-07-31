const Testimonials = () => {
    const testimonials = [
      {
        name: 'Sheri Bruneau',
        text: 'Beautifully packed products, quick support, and every recipient has been delighted.',
        rating: 5,
      },
      {
        name: 'Sandeep Singh',
        text: 'Excellent customer service and a polished producting experience from start to finish.',
        rating: 5,
      },
      {
        name: 'Janard Stanton',
        text: 'Fast turnaround and thoughtful custom options for our corporate producting needs.',
        rating: 5,
      },
    ]
  return (
    <>
         <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#b68a3b]">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-bold">Customers love producting with us</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-lg border border-[#d5bea8] bg-[#fffdfa] p-6"
              >
                <div className="text-amber-500" aria-label={`${testimonial.rating} stars`}>
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="mt-4 text-sm text-[#5d4e3f]">{testimonial.text}</p>
                <h3 className="mt-5 font-semibold">{testimonial.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
    
  )
}

export default Testimonials
