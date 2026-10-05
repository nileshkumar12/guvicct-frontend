import axios from 'axios'

const authStorageKeys = ['token', 'accessToken', 'authToken', 'jwt', 'user']
let isRedirecting = false

const handleUnauthorized = () => {
  if (typeof window === 'undefined') return

  authStorageKeys.forEach((key) => window.localStorage.removeItem(key))

  if (window.location.pathname !== '/login' && !isRedirecting) {
    isRedirecting = true
    window.location.replace('/login')
  }
}

export const installAuthHandler = () => {
  if (typeof window === 'undefined' || window.__authHandlerInstalled) return
  window.__authHandlerInstalled = true

  const originalFetch = window.fetch
  window.fetch = (...args) => originalFetch.apply(window, args).then((response) => {
    if (response.status === 401) handleUnauthorized()
    return response
  })

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) handleUnauthorized()
      return Promise.reject(error)
    },
  )
}