import React from 'react'

const Footer=()=> {
  return (
    <>
    <footer className="bg-[#141414] px-4 py-10 text-[#d4c5a4] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold text-white">ShopKart</h2>
            <p className="mt-3 text-sm">
              Mon-Fri 9:30am - 4:30pm
              <br />
              Calgary, AB
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Gifts by Type</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>All Gifts</li>
              <li>New Arrivals</li>
              <li>Wine Baskets</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Gifts by Occasion</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>For Her</li>
              <li>For Him</li>
              <li>Corporate</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Newsletter</h3>
            <form className="mt-3 flex gap-2" onSubmit={(event) => event.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="min-w-0 flex-1 rounded-md border border-[#d5bea8] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#b68a3b]"
              />
              <button className="rounded-md bg-[#b68a3b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#906e30]">
                Submit
              </button>
            </form>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer;