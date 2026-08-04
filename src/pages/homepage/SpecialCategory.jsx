import React, { useEffect, useState } from 'react'
import { API_URL, getImageUrl } from '../../utils/config'

const SpecialCategory = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBrands = async () => {
      if (!API_URL) {
        setError('API_URL is not configured')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/brands`)
        if (!response.ok) {
          throw new Error(`Failed to load brands (${response.status})`)
        }

        const data = await response.json()
        const list = Array.isArray(data)
          ? data
          : data.brands || data.data || data.items || data.result || []

        setBrands(list)
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load brands.')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const getImageSrc = getImageUrl

  return (
    <>
    <section className="py-16 bg-[#fffdfa]">
    <div className="max-w-7xl mx-auto px-4">


        <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-light uppercase tracking-wide text-[#2c2c2c] leading-tight">
                Show Someone They Are Special
                <br/>
                Through Personalized Products
            </h2>

            <p className="mt-4 text-[#5d4e3f] text-lg">
                Our products come with lots of different options to make your product extra special
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-2 text-center text-[#5d4e3f]">Loading brands...</div>
          ) : error ? (
            <div className="col-span-2 text-center text-red-600">{error}</div>
          ) : brands.length === 0 ? (
            <div className="col-span-2 text-center text-[#5d4e3f]">No brands available.</div>
          ) : (
            brands.map((brand, index) => {
              const brandName = brand.name || brand.title || brand.brand || `Brand ${index + 1}`
              const imageSrc = getImageSrc(brand.image || brand.imageUrl || brand.image_url || '')
              return (
                <a key={brand._id || brand.id || index} href="#" className="group relative overflow-hidden shadow-md">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={brandName}
                      className="w-full h-56 object-cover group-hover:scale-110 duration-500"
                    />
                  ) : (
                    <div className="w-full h-56 flex items-center justify-center bg-[#f9f5f0] text-[#5d4e3f]">
                      No image
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                      {brandName}
                    </h3>
                  </div>
                </a>
              )
            })
          )}
        </div>

    </div>
</section>
    
    </>
  )
}

export default SpecialCategory
