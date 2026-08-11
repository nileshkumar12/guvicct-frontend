import React, { useEffect, useMemo, useState } from 'react'
import { API_URL } from '../../utils/config'
import ReviewForm from './ReviewForm'

const buildReviewEndpoints = (productId) => {
  const base = API_URL ? `${API_URL}/api` : ''
  const id = `${productId || ''}`.trim()

  if (!base || !id) return []

  return [
    `${base}/reviews?product=${encodeURIComponent(id)}`,
    `${base}/reviews?productId=${encodeURIComponent(id)}`,
    `${base}/products/${encodeURIComponent(id)}/reviews`,
    `${base}/products/${encodeURIComponent(id)}/comments`,
    `${base}/reviews/product/${encodeURIComponent(id)}`,
  ]
}

const extractReviewItems = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value !== 'object') return []

  const keys = ['reviews', 'items', 'data', 'result', 'payload', 'comments']

  for (const key of keys) {
    const next = value[key]
    if (Array.isArray(next)) return next
    if (next && typeof next === 'object') {
      const nested = extractReviewItems(next)
      if (nested.length) return nested
    }
  }

  return []
}

const normalizeReview = (review, index) => {
  const user = review?.user || review?.customer || review?.author || {}
  const ratingValue = Number(review?.rating ?? review?.stars ?? review?.score ?? 0)
  const safeRating = Number.isFinite(ratingValue) ? Math.min(5, Math.max(0, Math.round(ratingValue))) : 0

  return {
    id: review?._id || review?.id || `${review?.productId || 'review'}-${index}`,
    name: review?.name || user?.name || user?.fullName || review?.userName || review?.authorName || 'Anonymous',
    rating: safeRating,
    title: review?.title || review?.heading || '',
    comment: review?.comment || review?.message || review?.review || review?.description || '',
    createdAt: review?.createdAt || review?.date || review?.updatedAt || null,
    verified: Boolean(review?.verified || review?.isVerified || review?.verifiedPurchase),
    avatar: review?.avatar || user?.avatar || user?.image || '',
    helpful: Number(review?.helpful || review?.helpfulCount || 0),
  }
}

const formatDate = (value) => {
  if (!value) return 'Recently added'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently added'
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const ProductReviews = ({ productId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(Boolean(productId))
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    if (!productId) {
      setReviews([])
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    const endpoints = buildReviewEndpoints(productId)

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint)
        if (!response.ok) continue

        const payload = await response.json()
        const items = extractReviewItems(payload)

        if (items.length) {
          setReviews(items.map((item, index) => normalizeReview(item, index)))
          setLoading(false)
          return
        }
      } catch (fetchError) {
        continue
      }
    }

    setReviews([])
    setLoading(false)
    setError('No reviews found for this product yet.')
  }

  useEffect(() => {
    let isMounted = true

    const loadReviews = async () => {
      if (!productId) {
        if (isMounted) {
          setReviews([])
          setLoading(false)
          setError('')
        }
        return
      }

      if (isMounted) {
        setLoading(true)
        setError('')
      }

      const endpoints = buildReviewEndpoints(productId)

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          if (!response.ok) continue

          const payload = await response.json()
          const items = extractReviewItems(payload)

          if (items.length) {
            const normalized = items.map((item, index) => normalizeReview(item, index))
            if (isMounted) {
              setReviews(normalized)
              setLoading(false)
            }
            return
          }
        } catch (fetchError) {
          continue
        }
      }

      if (isMounted) {
        setReviews([])
        setLoading(false)
        setError('No reviews found for this product yet.')
      }
    }

    loadReviews()

    return () => {
      isMounted = false
    }
  }, [productId])

  const summary = useMemo(() => {
    const total = reviews.length
    if (!total) {
      return {
        average: '0.0',
        total,
        breakdown: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0 })),
      }
    }

    const average = (reviews.reduce((sum, review) => sum + review.rating, 0) / total).toFixed(1)
    const breakdown = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((review) => review.rating === star).length,
    }))

    return { average, total, breakdown }
  }, [reviews])

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0))
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < safeRating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))
  }

  const handleOpenReviewForm = () => setShowReviewForm(true)
  const handleCancelReviewForm = () => setShowReviewForm(false)

  return (
    <>
      <div className="mt-8 rounded-[10px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <p className="mt-1 text-gray-500">See what customers are saying about this product</p>
            </div>

            {!showReviewForm && (
              <button
                onClick={handleOpenReviewForm}
                className="rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm ? (
            <ReviewForm
              productId={productId}
              onCancel={handleCancelReviewForm}
              onReviewCreated={async () => {
                setShowReviewForm(false)
                await fetchReviews()
              }}
            />
          ) : (
            <div>
              <div className="mb-8 grid grid-cols-1 gap-8 rounded-2xl border p-6 md:grid-cols-3">
                <div className="flex flex-col items-center justify-center border-b pb-6 md:border-b-0 md:border-r md:pb-0">
                  <div className="text-5xl font-bold text-gray-900">{summary.average}</div>
                  <div className="mt-2 flex text-xl">{renderStars(Number(summary.average))}</div>
                  <p className="mt-2 text-gray-500">Based on {summary.total} review{summary.total === 1 ? '' : 's'}</p>
                </div>

                <div className="space-y-3 md:col-span-2">
                  {summary.breakdown.map((rating) => (
                    <div key={rating.star} className="flex items-center gap-3">
                      <span className="w-10 text-sm">{rating.star} ★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${summary.total ? (rating.count / summary.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-8 text-sm text-gray-500">{rating.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold">{summary.total} Review{summary.total === 1 ? '' : 's'}</h3>
                <select className="rounded-lg border bg-white px-4 py-2 text-sm">
                  <option>Most Recent</option>
                  <option>Highest Rating</option>
                  <option>Lowest Rating</option>
                </select>
              </div>

              {loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">Loading reviews...</div>
              ) : error ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">{error}</div>
              ) : reviews.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">No reviews available for this product yet.</div>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <article key={review.id} className="rounded-xl border p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold">
                            {review.name?.slice(0, 2).toUpperCase() || 'AN'}
                          </div>
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            <p className="text-xs text-gray-500">{review.verified ? 'Verified Purchase' : 'Customer review'}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>

                      <div className="mt-3 flex text-yellow-400">{renderStars(review.rating)}</div>

                      {review.title ? <h4 className="mt-2 font-semibold">{review.title}</h4> : null}
                      <p className="mt-2 leading-6 text-gray-600">{review.comment}</p>

                      <div className="mt-4 flex items-center gap-5">
                        <button className="text-sm text-gray-500 hover:text-black">👍 Helpful</button>
                        <button className="text-sm text-gray-500 hover:text-black">Report</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductReviews;