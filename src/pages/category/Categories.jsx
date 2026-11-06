import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, API_URLS, getImageUrl } from '../../utils/config'
import Loader from '../../components/Loader'
const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const baseUrl = API_URLS || API_URL
      if (!baseUrl) {
        setError('API_URL is not configured')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${baseUrl}/api/categories`)
        if (!response.ok) {
          throw new Error(`Failed to load categories (${response.status})`)
        }

        const data = await response.json()
        const list = Array.isArray(data)
          ? data
          : data.categories || data.data?.categories || data.data || data.items || data.result || []

        setCategories(list)
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load categories.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getImageSrc = getImageUrl

  return (
    <>
      <section className="py-9 sm:py-12 lg:py-16">

        <div className="container mx-auto px-3 sm:px-6">

          <div className="mb-8 text-center sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#4254bf]">Shop by category</p>
            {/* <h2 className="text-5xl font-light tracking-wide uppercase">
                            Product Categories
                        </h2> */}
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111a3a] sm:text-4xl md:text-5xl lg:text-[52px]">
              Explore Our
              <b className="ml-2 bg-gradient-to-r from-[#3048d8] via-[#4059ee] to-[#1f35c8] bg-clip-text text-transparent">
                Collections
              </b>
            </h2>

            <p className="mt-3 text-base leading-relaxed text-[#5d4e3f] sm:text-xl">
              — Everything You Need, All in One Place —
            </p>

          </div>
          <div className="grid grid-cols-2 gap-3 max-[414px]:grid-cols-1 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {loading ? (

              <Loader loading={loading} />

            ) : error ? (
              <div className="col-span-full text-center text-red-600">
                {error}
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center text-[#5d4e3f]">
                No categories available.
              </div>
            ) : (
              categories.map((category, index) => {
                const categoryName =
                  category.name || category.title || category.category || `Category ${index + 1}`
                const imageSrc = getImageSrc(category.image || category.imageUrl || category.image_url || '')

                return (
                  <article key={category._id || category.id || category.slug || index}

                    className="group relative overflow-hidden rounded-2xl border border-[#e9e2d9] bg-white shadow-sm"
                  >
                    <div className="relative overflow-hidden p-2 sm:p-3">
                      <Link
                        key={category._id || category.id || category.slug || index}
                        to={`/category/${category._id || category.id || category.slug || index}`}
                        className="group text-center"
                      >

                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={categoryName}
                            loading="lazy"
                            decoding="async"
                            className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg bg-[#f9f5f0] text-sm text-[#5d4e3f]">
                            No image
                          </div>
                        )}

                        <h3 className="mt-2 overflow-hidden bg-[#4254bf] px-2 py-2 text-sm leading-tight tracking-wide text-[#ffffff] sm:mt-3 sm:px-4 sm:text-lg">
                          {categoryName}
                        </h3>
                      </Link>
                    </div>
                  </article>
                )
              })
            )}
          </div>

        </div>

      </section>
    </>

  )
}

export default Categories;