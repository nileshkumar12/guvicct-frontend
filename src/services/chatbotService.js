import axios from 'axios'
import { API_URL } from '../utils/config'

const chatbotPath = '/api/chatbot'

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {}

  const token = ['token', 'accessToken', 'authToken', 'jwt']
    .map((key) => window.localStorage.getItem(key))
    .find(Boolean)

  return token ? { Authorization: `Bearer ${token}` } : {}
}

const requestConfig = (config = {}) => ({
  ...config,
  headers: {
    ...getAuthHeaders(),
    ...config.headers,
  },
})

const ensureApiConfigured = () => {
  if (!API_URL) {
    throw new Error('The shopping assistant is temporarily unavailable.')
  }
}

export const sendChatMessage = async (payload) => {
  ensureApiConfigured()
  const response = await axios.post(
    `${API_URL}${chatbotPath}/message`,
    payload,
    requestConfig(),
  )
  return response.data
}

export const getChatHistory = async (params = {}) => {
  ensureApiConfigured()
  const response = await axios.get(
    `${API_URL}${chatbotPath}/history`,
    requestConfig({ params }),
  )
  return response.data
}

export const getChatConversations = async () => {
  ensureApiConfigured()
  const response = await axios.get(
    `${API_URL}${chatbotPath}/conversations`,
    requestConfig(),
  )
  return response.data
}

export const deleteChatConversation = async (conversationId) => {
  ensureApiConfigured()
  const response = await axios.delete(
    `${API_URL}${chatbotPath}/conversation/${encodeURIComponent(conversationId)}`,
    requestConfig(),
  )
  return response.data
}

export const getChatRecommendations = async (payload) => {
  ensureApiConfigured()
  const response = await axios.post(
    `${API_URL}${chatbotPath}/recommendations`,
    payload,
    requestConfig(),
  )
  return response.data
}

export const getProductCatalog = async () => {
  ensureApiConfigured()
  const response = await axios.get(
    `${API_URL}/api/products`,
    requestConfig(),
  )
  return response.data
}

export const getChatCategories = async () => {
  ensureApiConfigured()
  const response = await axios.get(
    `${API_URL}/api/categories`,
    requestConfig(),
  )
  return response.data
}

export const getChatOrderStatus = async (payload) => {
  ensureApiConfigured()
  const response = await axios.post(
    `${API_URL}${chatbotPath}/order-status`,
    payload,
    requestConfig(),
  )
  return response.data
}
