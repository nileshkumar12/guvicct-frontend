import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { API_URL } from "../utils/config"
import { useToast } from "../components/ToastProvider.jsx"

const getEntityList = (data, config) => {
  if (Array.isArray(data)) return data

  const keys = [
    config.listKey,
    config.labelPlural,
    config.labelPluralLower,
    config.label,
    config.labelLower,
    config.singularKey,
  ].filter(Boolean)

  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key]
    if (Array.isArray(data.data?.[key])) return data.data[key]
  }

  return data.data || data.items || data.result || []
}

const getEntityItem = (data, config) => {
  const keys = [
    config.singularKey,
    config.label,
    config.labelLower,
    config.listKey,
    config.labelPlural,
    config.labelPluralLower,
  ].filter(Boolean)

  for (const key of keys) {
    if (data[key] && !Array.isArray(data[key])) return data[key]
    if (data.data?.[key] && !Array.isArray(data.data[key])) return data.data[key]
  }

  return data.data || data.result || data || {}
}

const getEntityId = (item) => item?._id || item?.id || ""

const authHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const multipartHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getImageSrc = (image) => {
  if (!image) return ""
  if (/^(https?:|data:|blob:)/i.test(image)) return image
  if (!API_URL) return image

  const base = API_URL.replace(/\/$/, "")
  return `${base}/${image.replace(/^\/+/, "")}`
}

export const SimpleEntityListPage = ({ config }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToast } = useToast()

  const handleDelete = async (itemId) => {
    if (!window.confirm(`Delete this ${config.labelLower}?`)) return

    try {
      const response = await fetch(`${API_URL}${config.apiPath}/${itemId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to delete ${config.labelLower} (${response.status}): ${text}`)
      }

      setItems((current) => current.filter((item) => (item._id || item.id) !== itemId))
      addToast(`${config.label} deleted successfully.`, "success")
    } catch (deleteError) {
      const message = deleteError.message || `Failed to delete ${config.labelLower}.`
      setError(message)
      addToast(message, "error")
    }
  }

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!API_URL) throw new Error("API_URL is not configured")

        const response = await fetch(`${API_URL}${config.apiPath}`, {
          headers: authHeaders(),
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch ${config.labelPluralLower} (${response.status})`)
        }

        const data = await response.json()
        setItems(getEntityList(data, config))
      } catch (fetchError) {
        const message = fetchError.message || `Failed to load ${config.labelPluralLower}.`
        setError(message)
        addToast(message, "error")
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [addToast, config])

  return (
    <div>
      <div className="bg-gradient-to-r from-[#b68a3b] to-[#906e30] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        {config.labelPlural}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1c1c1c]">{config.labelPlural}</h2>
          <p className="text-sm text-[#5d4e3f]">Create, update and remove product {config.labelPluralLower}.</p>
        </div>
        <Link
          to={`/admin/${config.route}/add`}
          className="inline-flex items-center justify-center rounded-full bg-[#b68a3b] px-6 py-3 text-white hover:bg-[#906e30] transition"
        >
          Add {config.label}
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-[#1c1c1c]">{config.label} List</h2>
            <p className="text-sm text-[#5d4e3f]">Manage values used when creating products.</p>
          </div>
        </div>
        <div className="overflow-x-auto p-6">
          {loading ? (
            <div className="text-sm text-[#5d4e3f]">Loading {config.labelPluralLower}...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-[#5d4e3f]">No {config.labelPluralLower} found.</div>
          ) : (
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b bg-[#fffdfa]">
                  <th className="px-4 py-3">S.No</th>
                  {config.hasImage && <th className="px-4 py-3">Image</th>}
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const itemId = getEntityId(item)
                  return (
                    <tr key={itemId || index} className="border-b">
                      <td className="px-4 py-4">{index + 1}</td>
                      {config.hasImage && (
                        <td className="px-4 py-4">
                          {getImageSrc(item.image) ? (
                            <img
                              src={getImageSrc(item.image)}
                              alt={item.name || config.label}
                              className="h-14 w-20 rounded-lg border border-[#d5bea8] object-cover"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                      )}
                      <td className="px-4 py-4">{item.name || item.title || "-"}</td>
                      <td className="px-4 py-4">{item.description || "-"}</td>
                      <td className="px-4 py-4 space-x-2">
                        <Link
                          to={`/admin/${config.route}/${itemId}/edit`}
                          className="rounded-full bg-[#f4e5d4] px-3 py-1 text-sm text-[#1c1c1c] hover:bg-[#e7d7b8]"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(itemId)}
                          className="rounded-full bg-[#f87171] px-3 py-1 text-sm text-white hover:bg-[#ef4444]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export const SimpleEntityFormPage = ({ config, mode }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(mode === "edit")
  const [error, setError] = useState(null)
  const [submitStatus, setSubmitStatus] = useState("")
  const [imageError, setImageError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    imageFile: null,
    imagePreview: "",
  })

  useEffect(() => {
    if (mode !== "edit") return

    const fetchItem = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!API_URL) throw new Error("API_URL is not configured")

        const response = await fetch(`${API_URL}${config.apiPath}/${id}`, {
          headers: authHeaders(),
        })

        if (!response.ok) {
          if (response.status === 404) {
            const listResponse = await fetch(`${API_URL}${config.apiPath}`, {
              headers: authHeaders(),
            })

            if (!listResponse.ok) {
              throw new Error(`Failed to fetch ${config.labelLower} (${response.status})`)
            }

            const listData = await listResponse.json()
            const items = getEntityList(listData, config)
            const listItem = items.find((item) => getEntityId(item)?.toString() === id?.toString())

            if (!listItem) {
              throw new Error(`${config.label} not found.`)
            }

            setFormData({
              name: listItem.name || listItem.title || "",
              description: listItem.description || "",
              image: listItem.image || "",
              imageFile: null,
              imagePreview: listItem.image || "",
            })
            return
          }

          throw new Error(`Failed to fetch ${config.labelLower} (${response.status})`)
        }

        const data = await response.json()
        const item = getEntityItem(data, config)
        setFormData({
          name: item.name || item.title || "",
          description: item.description || "",
          image: item.image || "",
          imageFile: null,
          imagePreview: item.image || "",
        })
      } catch (fetchError) {
        setError(fetchError.message || `Failed to load ${config.labelLower}.`)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [config, id, mode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus("loading")

    if (config.hasImage && mode === "add" && !formData.imageFile) {
      setImageError(`${config.label} image is required.`)
      setSubmitStatus("error")
      return
    }

    try {
      if (!API_URL) throw new Error("API_URL is not configured")

      const body = config.hasImage ? new FormData() : JSON.stringify({
        name: formData.name,
        description: formData.description,
      })

      if (config.hasImage) {
        body.append("name", formData.name)
        body.append("description", formData.description)
        if (formData.imageFile) {
          body.append("image", formData.imageFile)
        } else if (mode === "edit") {
          body.append("image", formData.image)
        }
      }

      const response = await fetch(`${API_URL}${config.apiPath}${mode === "edit" ? `/${id}` : ""}`, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: config.hasImage ? multipartHeaders() : authHeaders(),
        body,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to ${mode === "edit" ? "update" : "create"} ${config.labelLower} (${response.status}): ${text}`)
      }

      setSubmitStatus("success")
      addToast(`${config.label} ${mode === "edit" ? "updated" : "created"} successfully.`, "success")
      setTimeout(() => navigate(`/admin/${config.route}`), 700)
    } catch (submitError) {
      const message = submitError.message || `Failed to ${mode === "edit" ? "update" : "create"} ${config.labelLower}.`
      setSubmitStatus(message)
      addToast(message, "error")
    }
  }

  if (loading) {
    return <div className="text-[#5d4e3f]">Loading {config.labelLower}...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  const title = `${mode === "edit" ? "Edit" : "Add"} ${config.label}`
  const actionLabel = mode === "edit" ? "Save Changes" : `Add ${config.label}`
  const imageSrc = getImageSrc(formData.imagePreview || formData.image)

  return (
    <div>
      <div className="bg-gradient-to-r from-[#b68a3b] to-[#906e30] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        {title}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden mb-8">
        <div className="p-6 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1c1c1c]">{mode === "edit" ? `Edit ${config.labelLower}` : `New ${config.labelLower}`}</h2>
            <p className="text-sm text-[#5d4e3f]">{mode === "edit" ? "Update this value and save changes." : `Create a new product ${config.labelLower}.`}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/admin/${config.route}`)}
            className="rounded-full bg-[#f4e5d4] px-5 py-2 text-[#1c1c1c] hover:bg-[#e7d7b8] transition"
          >
            Back to {config.labelPlural}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#5d4e3f]">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
            />
          </div>

          {config.hasImage && (
            <div>
              <label className="block text-sm font-medium text-[#5d4e3f]">{config.label} Image</label>
              <input
                type="file"
                accept="image/*"
                required={mode === "add"}
                onChange={handleImageChange}
                className="mt-2 w-full rounded-lg border border-[#d5bea8] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              />
              {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={config.label}
                  className="mt-3 h-28 w-full max-w-xs rounded-lg border border-[#d5bea8] object-cover"
                />
              )}
            </div>
          )}

          <div className="md:col-span-2 flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="rounded-full bg-[#b68a3b] px-6 py-3 text-white hover:bg-[#906e30] transition"
            >
              {actionLabel}
            </button>
           
          </div>
        </form>
      </div>
    </div>
  )
}
