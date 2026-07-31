import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const ToastContext = createContext(null)

const getToastStyle = (type) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-500 text-white'
    case 'error':
      return 'bg-red-500 text-white'
    default:
      return 'bg-slate-700 text-white'
  }
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  const value = useMemo(() => ({ addToast }), [addToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-80 rounded-2xl px-4 py-3 shadow-xl ring-1 ring-black/10 ${getToastStyle(toast.type)}`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
