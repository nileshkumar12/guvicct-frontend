import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect,useState } from 'react'
import { API_URL } from '../utils/config'


const Footer=()=> {
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
    <footer className="bg-[#141414] px-4 py-10 text-[#d4c5a4] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold text-white"><Link to="/"><img style={{maxWidth:"50px", borderRadius:"5px"}} src="https://nileshdesigner.co.in/assets/images/logo.png"/></Link></h2>
            <p className="mt-3 text-sm">
              Mon-Fri 9:30 AM - 6:30 PM
              <br />
              Gurgaon, Haryana, India
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Product by Category</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/category/${category.id}`} className="hover:text-[#b68a3b]">
                    {category.name}
                  </Link>
                </li>
              ))}
              
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#b68a3b]">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#b68a3b]">About</Link></li>
              <li><Link to="/contact" className="hover:text-[#b68a3b]">Contact</Link></li>
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