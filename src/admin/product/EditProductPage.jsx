import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { API_URL, getImageUrl, uploadImageToCloudinary } from "../../utils/config.js"
import { useToast } from "../../components/ToastProvider.jsx"
import { fetchProductOptions, getOptionValue, getProductEntityValue } from "./productOptions.js"
import Variants from "./Variants.jsx"
import Specifications from "./Specifications.jsx"
import Addons from "./Addons.jsx"

const EditProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitStatus, setSubmitStatus] = useState("")
  const [imageError, setImageError] = useState("")
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsError, setOptionsError] = useState("")
  const [specifications, setSpecifications] = useState([]);
  const [addons, setAddons] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    rating: "",
    stock: "",
    variants: [],
    image: "",
    imageFile: null,
    imagePreview: "",
    gallery: [],
    seller: "",
    hsnCode: "",
    gstRate: "",
    priceIncludesGST: false,
  })
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!API_URL) throw new Error("API_URL is not configured")
        const token = localStorage.getItem("token")
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!response.ok) throw new Error(`Failed to fetch product (${response.status})`)
        const data = await response.json()
        const item =
          data.product ||
          data.data?.product ||
          data.data ||
          data.result ||
          data ||
          {}
        setProduct(item)
        setFormData({
          name: item.name || "",
          description: item.description || "",
          category: getProductEntityValue(item.category),
          subcategory: getProductEntityValue(item.subcategory),
          brand: getProductEntityValue(item.brand),
          price: item.price ?? "",
          rating: item.rating ?? "",
          stock: item.stock ?? "",
          status: item.status || "active",
          variants: Array.isArray(item.variants) ? item.variants : [],
          image: item.image || "",
          imageFile: null,
          imagePreview: item.image || "",
          gallery: [...new Set([...(Array.isArray(item.gallery) ? item.gallery : []), ...(Array.isArray(item.images) ? item.images : [])])],
          seller:
            typeof item.seller === "string"
              ? item.seller
              : item.seller?._id || item.seller?.id || item.seller?.sellerId || "",
          hsnCode: item.hsnCode || "",
          gstRate: item.gstRate ?? "",
          priceIncludesGST: item.priceIncludesGST === true,
        })
              setSpecifications(Array.isArray(item.specifications) ? item.specifications : [])
              setAddons(Array.isArray(item.addons) ? item.addons : [])
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    const loadOptions = async () => {
      setOptionsLoading(true)
      setOptionsError("")

      try {
        const options = await fetchProductOptions()
        setBrands(options.brands)
        setCategories(options.categories)
      } catch (optionError) {
        const message = optionError.message || "Failed to load brands and categories."
        setOptionsError(message)
        addToast(message, "error")
      } finally {
        setOptionsLoading(false)
      }
    }

    loadOptions()
  }, [addToast])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setFormData((prev) => ({ ...prev, imageFile: null, imagePreview: prev.image || "" }))
      setImageError("")
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setImageError("Image file is too large. Please choose a file under 3MB.")
      setFormData((prev) => ({ ...prev, imageFile: null, imagePreview: prev.image || "" }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }))
    setImageError("")
  }

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (files.some((file) => file.size > 3 * 1024 * 1024)) {
      setImageError("Each image file must be under 3MB.")
      e.target.value = ""
      return
    }

    try {
      const gallery = await Promise.all(files.map((file) => uploadImageToCloudinary(file)))
      setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...gallery] }))
      setImageError("")
    } catch (uploadError) {
      setImageError(uploadError.message || "Failed to upload product images.")
    } finally {
      e.target.value = ""
    }
  }

  const removeGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, index) => index !== indexToRemove) }))
  }

  const getVariantsPayload = () =>
    formData.variants.map((variant) => {
      const { image, images, ...variantData } = variant
      const mainImage = typeof image === "string" && image.trim() ? image.trim() : ""
      const additionalImages = [...new Set((images || []).filter((item) => typeof item === "string" && item.trim()))]
        .filter((item) => item !== mainImage)

      return {
        ...variantData,
        ...(mainImage ? { image: mainImage } : {}),
        ...(additionalImages.length ? { images: additionalImages } : {}),
        attributes: Object.fromEntries(
          Object.entries(variant.attributes || {}).map(([key, value]) => [
            key.trim(),
            value,
          ]),
        ),
      }
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus("loading")
    try {
      if (!API_URL) throw new Error("API_URL is not configured")
      const token = localStorage.getItem("token")
      const formPayload = new FormData()
      formPayload.append("name", formData.name)
      formPayload.append("description", formData.description)
      formPayload.append("category", formData.category)
      formPayload.append("subcategory", formData.subcategory)
      formPayload.append("brand", formData.brand)
      formPayload.append("price", Number(formData.price))
      formPayload.append("rating", Number(formData.rating))
      formPayload.append("stock", Number(formData.stock))
      formPayload.append("status", formData.status)
      formPayload.append("variants", JSON.stringify(getVariantsPayload()))
      formPayload.append("images", JSON.stringify(formData.gallery))
      formPayload.append("gallery", JSON.stringify(formData.gallery))
      formPayload.append("seller", formData.seller)
      formPayload.append("specifications", JSON.stringify(specifications))
      formPayload.append("addons", JSON.stringify(addons))  
      formPayload.append("hsnCode", formData.hsnCode)
      formPayload.append("gstRate", Number(formData.gstRate) || 0)
      formPayload.append("priceIncludesGST", formData.priceIncludesGST)
      if (formData.imageFile) {
        const uploadedImageUrl = await uploadImageToCloudinary(formData.imageFile)
        formPayload.append("image", uploadedImageUrl)
      } else {
        formPayload.append("image", formData.image)
      }

      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formPayload,
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to update product (${response.status}): ${text}`)
      }
      setSubmitStatus("success")
      addToast("Product updated successfully.", "success")
      setTimeout(() => navigate("/admin/products"), 700)
    } catch (submitError) {
      const message = submitError.message || "Failed to update product."
      setSubmitStatus(message)
      addToast(message, "error")
    }
  }

  if (loading) {
    return <div className="text-[#5d4e3f]">Loading product...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  const imageSrc = getImageUrl(formData.imagePreview || formData.image)

  return (
    <div>
      <div className="bg-gradient-to-r from-[#4254bf] to-[#3546ae] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        Edit Product
      </div>
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden mb-8">
        <div className="p-6 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1c1c1c]">Edit product details</h2>
            <p className="text-sm text-[#5d4e3f]">Update product information and save changes.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-full bg-[#f4e5d4] px-5 py-2 text-[#1c1c1c] hover:bg-[#e7d7b8] transition"
          >
            Back to Products
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 p-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Brand</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
              required
              disabled={optionsLoading}
            >
              <option value="">{optionsLoading ? "Loading brands..." : "Select brand"}</option>
              {brands.map((brand) => {
                const value = getOptionValue(brand)
                return (
                  <option key={brand._id || brand.id || value} value={value}>
                    {brand.name || brand.title || value}
                  </option>
                )
              })}
            </select>
            {optionsError && <p className="mt-2 text-sm text-red-600">{optionsError}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#5d4e3f]">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
              disabled={optionsLoading}
              required
            >
              <option value="">{optionsLoading ? "Loading categories..." : "Select category"}</option>
              {categories.map((category) => {
                const value = getOptionValue(category)
                return (
                  <option key={category._id || category.id || value} value={value}>
                    {category.name || category.title || value}
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Subcategory</label>
            <input
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
              required
            />
          </div>



          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">HSN Code</label>
            <input
              name="hsnCode"
              value={formData.hsnCode}
              onChange={handleChange}
              placeholder="e.g. 8517"
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">GST Rate (%)</label>
            <input
              type="number"
              name="gstRate"
              min="0"
              max="100"
              step="0.01"
              value={formData.gstRate}
              onChange={handleChange}
              placeholder="e.g. 18"
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
            />
          </div>

          <div className="flex items-center gap-2 self-end pb-3">
            <input
              type="checkbox"
              id="priceIncludesGST"
              name="priceIncludesGST"
              checked={formData.priceIncludesGST}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="priceIncludesGST" className="text-sm font-medium text-[#5d4e3f]">
              Price includes GST
            </label>
          </div>



          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4254bf]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8]  px-4 py-3  outline-none"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Seller ID</label>
            <input
              name="seller"
              value={formData.seller}
              readOnly
              className="mt-2 w-full rounded-lg border border-[#d5bea8] bg-[#f4e9d7] px-4 py-3 text-[#5d4e3f] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#4254bf]"
            />
            {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
            {imageSrc && (
              <div className="mt-3 flex flex-wrap gap-3">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#d5bea8]">
                  <img
                    src={imageSrc}
                    alt="Product"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Additional Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#4254bf]"
            />
            {formData.gallery.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {formData.gallery.map((image, index) => (
                  <div key={`${getImageUrl(image)}-${index}`} className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#d5bea8]">
                    <img src={getImageUrl(image)} alt="Product gallery" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeGalleryImage(index)} className="absolute right-1 top-1 rounded-full bg-red-600 px-1.5 text-xs text-white" aria-label="Remove image">x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <hr className="md:col-span-2 my-2 border-t border-[#d5bea8]" />
          <div className="block md:col-span-2">
            <Variants
              value={formData.variants}
              onChange={(variants) => setFormData((prev) => ({ ...prev, variants }))}
            />
          </div>
          <hr className="md:col-span-2 my-2 border-t border-[#d5bea8]" />
          <div className="block md:col-span-2">
            <Specifications value={specifications} onChange={setSpecifications} />
          </div>
          <hr className="md:col-span-2 my-2 border-t border-[#d5bea8]" />
          <div className="block md:col-span-2">
            <Addons value={addons} onChange={setAddons} />
          </div>
          <hr className="md:col-span-2 my-2 border-t border-[#d5bea8]" />
          <div className="md:col-span-2 flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="rounded-full bg-[#4254bf] px-6 py-3 text-white hover:bg-[#3546ae] transition"
            >
              Save Changes
            </button>

          </div>
        </form>

      </div>
    </div>
  )
}

export default EditProductPage
