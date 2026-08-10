import { API_URL } from "../../utils/config"

const getEntityList = (data, keys) => {
  if (Array.isArray(data)) return data

  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key]
    if (Array.isArray(data.data?.[key])) return data.data[key]
  }

  return data.data || data.items || data.result || []
}

const getHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const fetchOptionList = async (path, keys, label) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${label} (${response.status})`)
  }

  const data = await response.json()
  return getEntityList(data, keys)
}

export const fetchProductOptions = async () => {
  if (!API_URL) throw new Error("API_URL is not configured")

  const [brands, categories] = await Promise.all([
    fetchOptionList("/api/brands", ["brands", "Brands", "brand", "Brand"], "brands"),
    fetchOptionList("/api/categories", ["categories", "Categories", "category", "Category"], "categories"),
  ])

  return { brands, categories }
}

export const getOptionValue = (option) => {
  if (!option) return ""
  if (typeof option === "string" || typeof option === "number") return option.toString()
  return option.name || option.title || option._id || option.id || ""
}

export const getProductEntityValue = (value) => {
  if (!value) return ""
  if (typeof value === "string" || typeof value === "number") return value.toString()
  return value.name || value.title || value._id || value.id || ""
}
