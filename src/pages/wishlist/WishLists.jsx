import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'

import { getImageUrl } from '../../utils/config'
import { removeFromWishlist } from '../../store/wishlistSlice'

const WishLists = () => {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state) => state.wishlist.items)

  const handleRemove = (key) => {
    dispatch(removeFromWishlist(key))
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Wishlist
            </p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">Your saved products</h1>
            <p className="mt-2 text-gray-500">
              Products you marked as favorite are shown here and stay tied to your account.
            </p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            {wishlistItems.length} item{wishlistItems.length === 1 ? '' : 's'} saved
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Heart size={28} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-gray-900">Your wishlist is empty</h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-500">
              Save products from the category page and they will appear here for quick access.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlistItems.map((item) => {
              const imageUrl = getImageUrl(item.image || '')
              return (
                <article key={item.key} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <Link to={`/product/${item.id}`} className="block">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.name} className="h-64 w-full object-cover" />
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-500">
                        No image available
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/product/${item.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.price != null ? `₹${item.price}` : 'Price not available'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.key)}
                        className="rounded-full bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                        aria-label={`Remove ${item.name} from wishlist`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <Link
                        to={`/product/${item.id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        <ShoppingCart size={16} />
                        View product
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default WishLists