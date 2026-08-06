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
  const [confirmPopup, setConfirmPopup] = useState(null)

  const addToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  const openConfirmPopup = useCallback((options = {}) => {
    const {
      title = 'Confirmation',
      message = 'Are you sure?',
      confirmText = 'Yes',
      cancelText = 'No',
    } = options

    return new Promise((resolve) => {
      setConfirmPopup({
        title,
        message,
        confirmText,
        cancelText,
        resolve,
      })
    })
  }, [])

  const closeConfirmPopup = useCallback((answer) => {
    setConfirmPopup((current) => {
      if (current?.resolve) {
        current.resolve(answer)
      }
      return null
    })
  }, [])

  const value = useMemo(() => ({ addToast, openConfirmPopup }), [addToast, openConfirmPopup])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {confirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">{confirmPopup.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{confirmPopup.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => closeConfirmPopup(false)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {confirmPopup.cancelText}
              </button>
              <button
                type="button"
                onClick={() => closeConfirmPopup(true)}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {confirmPopup.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
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
