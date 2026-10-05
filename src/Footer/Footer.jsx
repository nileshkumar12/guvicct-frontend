import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_URL } from '../utils/config'
import vyasonImgfooter from "../../src/assets/vyason2.png";
import WhatsAppButton from '../components/WhatsAppButton'
const Footer = () => {
  const [categories, setCategories] = useState([])
  const [count, setCount] = useState(0)
  useEffect(() => {
    const loadCategories = async () => {
      if (!API_URL) return
      try {
        const response = await fetch(`${API_URL}/api/categories`)
        if (response.ok) {
          const data = await response.json()
          const categoryList = Array.isArray(data) ? data : data.categories || data.data || []
          setCategories(categoryList)
        }
      } catch (error) {
        console.error('Failed to load categories', error)
      }
    }
    loadCategories()
  }, [])

  return (
    <>
      <footer className="bg-[#111111] px-4 py-10 text-[#d4c5a4] sm:px-6 lg:px-8">
        <div className="container mx-auto grid  gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold text-white"><Link to="/"><img style={{ maxWidth: "175px", borderRadius: "5px" }} src={vyasonImgfooter} /></Link></h2>
            <p>Premium products, thoughtful gifting and a better shopping experience for every movement.</p>
            <h3 className="font-semibold text-white mt-10">Working Hours</h3>
            <p className="text-sm ">
              Mon-Fri 9:30 AM - 6:30 PM
              <br />
              Gurgaon, Haryana, India
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Product by Category</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category._id}>
                  <Link to={`/category/${category.id}`} className="hover:text-[#4254bf]">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Customer Services</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#4254bf]">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#4254bf]">About</Link></li>
              <li><Link to="/help" className="hover:text-[#4254bf]">Help Center</Link></li>
              <li><Link to="/help" className="hover:text-[#4254bf]">Track Order</Link></li>
              <li><Link to="/help" className="hover:text-[#4254bf]">Sustainability</Link></li>
              <li><Link to="/help" className="hover:text-[#4254bf]">Shopping Information</Link></li>
              <li><Link to="/help" className="hover:text-[#4254bf]">Site Guide</Link></li>
              <li><Link to="/help" className="hover:text-[#4254bf]">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Newsletter</h3>
            <p>Get alerted about new products and special offers!</p>
            <form className="mt-3 flex gap-2" onSubmit={(event) => event.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="min-w-0 flex-1 rounded-md border border-[#d5bea8] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#4254bf]"
              />
              <button className="rounded-md bg-[#4254bf] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3546ae]">
                Submit
              </button>
            </form>

              <WhatsAppButton/>
          </div>
        </div>
      </footer>
      <div className="w-full bg-[#111111] px-8 py-4 border-t border-[#222222] text-[#d4c5a4]">
        <div className="container mx-auto flex  flex-col items-center justify-between gap-2 text-sm text-slate-300 sm:flex-row">
          <p>© 2026 Vyason. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-500">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer;