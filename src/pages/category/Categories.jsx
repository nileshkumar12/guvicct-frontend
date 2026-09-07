import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, API_URLS, getImageUrl } from '../../utils/config'

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
      <section className="py-16">

                <div className="mx-auto px-6">



                    <div className="text-center mb-14">

                        <h2 className="text-5xl font-light tracking-wide uppercase">
                            Product Categories
                        </h2>

                        <p className="mt-3 text-[#5d4e3f] text-xl">
                            — Everything You Need, All in One Place —
                        </p>

                    </div>



                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {loading ? (
                        <div className="col-span-1 text-center text-[#5d4e3f]">
                          Loading categories...
                        </div>
                      ) : error ? (
                        <div className="col-span-1 text-center text-red-600">
                          {error}
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="col-span-1 text-center text-[#5d4e3f]">
                          No categories available.
                        </div>
                      ) : (
                        categories.map((category, index) => {
                          const categoryName =
                            category.name || category.title || category.category || `Category ${index + 1}`
                          const imageSrc = getImageSrc(category.image || category.imageUrl || category.image_url || '')

                          return (
                             <article
                               
                                className="group relative overflow-hidden rounded-2xl border border-[#e9e2d9] bg-white shadow-sm"
                            >
                               <div className="relative overflow-hidden pt-3">
                            <Link
                              key={category._id || category.id || category.slug || index}
                              to={`/category/${category._id || category.id || category.slug || index}`}
                              className="group text-center"
                            >
                             
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt={categoryName}
                                    className="mx-auto h-72  group-hover:scale-105 duration-300"
                                  />
                                ) : (
                                  <div className="mx-auto flex h-72 w-full items-center justify-center rounded-lg bg-[#f9f5f0] text-sm text-[#5d4e3f]">
                                    No image
                                  </div>
                                )}
                             
                              <h3 className="px-4 py-2 overflow-hidden tracking-wide mt-5 text-lg text-[#ffffff] bg-[#b68a3b]">
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