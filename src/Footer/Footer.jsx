import React from 'react'

const Footer=()=> {
  return (
    <>
    <footer className="bg-slate-950 px-4 py-10 text-slate-300 sm:px-6 lg:px-8">
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
                className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
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