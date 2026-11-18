import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Gift,
  LayoutGrid,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Send,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import { addItem } from '../../store/cartSlice'
import { useToast } from '../ToastProvider.jsx'
import { getImageUrl } from '../../utils/config'
import {deleteChatConversation,getChatConversations,getChatCategories,getChatHistory,getChatOrderStatus,getProductCatalog,getChatRecommendations,sendChatMessage,} from '../../services/chatbotService'
import './ChatbotWidget.css'

const quickActions = [
  { label: 'Find Products', prompt: 'Help me find products', icon: ShoppingBag, kind: 'categories' },
  { label: 'Best Deals', prompt: 'Show me the best deals', icon: Tag, kind: 'recommendation' },
  // { label: 'Track My Order', prompt: 'Track my order', icon: PackageCheck, kind: 'order' },
  // { label: 'Budget Shopping', prompt: 'Help me shop within my budget', icon: CircleHelp, kind: 'recommendation' },
  { label: 'Gift Recommendations', prompt: 'Recommend a gift for me', icon: Gift, kind: 'recommendation' },
]

const getArray = (...values) => values.find(Array.isArray) || []

const getPayload = (result) => {
  if (result?.data && typeof result.data === 'object') return result.data
  return result || {}
}

const getMessageText = (result, fallback = '') => {
  if (typeof result === 'string') return result
  const payload = getPayload(result)
  const message = payload.reply || payload.response || payload.answer || payload.text
  if (typeof message === 'string') return message
  if (typeof payload.message === 'string') return payload.message
  if (typeof payload.message?.content === 'string') return payload.message.content
  return fallback
}

const getProducts = (result) => {
  const payload = getPayload(result)
  const products = getArray(
    payload.recommendations,
    payload.products,
    payload.items,
    payload.productRecommendations,
    payload.comparison?.products,
    payload.comparison,
  )
  return products.filter((product) => product && typeof product === 'object')
}

const getCatalogArray = (result) => {
  return getArray(
    result,
    result?.products,
    result?.items,
    result?.result,
    result?.results,
    result?.data,
    result?.data?.products,
    result?.data?.items,
    result?.data?.data,
    result?.data?.result,
  )
    .filter((product) => product && typeof product === 'object')
}

const getCategoryArray = (result) => getArray(
  result,
  result?.categories,
  result?.items,
  result?.data,
  result?.data?.categories,
  result?.data?.items,
  result?.data?.data,
  result?.result,
)
  .filter((category) => category && typeof category === 'object')

const isCatalogFallbackMessage = (text) =>
  /temporarily unavailable|couldn't find matching products|could not find matching products|no matching products|unable to find products/i
    .test(text)

const isGreetingQuery = (text) =>
  /^(hi|hello|hey|namaste|namaskar|good morning|good afternoon|good evening|thanks|thank you|धन्यवाद)[!.?\s]*$/i
    .test(text.trim())

const getProductSearchText = (product) => {
  const brand = typeof product.brand === 'object' ? product.brand.name : product.brand
  const category = typeof product.category === 'object'
    ? `${product.category.name || ''} ${product.category.title || ''}`
    : product.category || ''
  const tags = Array.isArray(product.tags) ? product.tags.join(' ') : product.tags || ''
  const description = product.description || product.shortDescription || ''
  return `${product.name || ''} ${product.title || ''} ${brand || ''} ${category} ${tags} ${description}`
    .toLowerCase()
}

const findCatalogProducts = async (query, selectedCategory = null) => {
  const products = getCatalogArray(await getProductCatalog())
    .filter((product) =>
      `${product.status || 'active'}`.trim().toLowerCase() !== 'inactive' &&
      (product.stock == null || Number(product.stock) > 0),
    )
  const terms = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []
  const ignoredTerms = new Set([
    'a', 'an', 'and', 'for', 'find', 'get', 'help', 'i', 'me', 'my', 'of', 'please',
    'product', 'products', 'recommend', 'show', 'some', 'the', 'to', 'want', 'with',
    'best', 'deals', 'deal', 'shop', 'shopping', 'buy', 'under', 'below', 'within',
    'rupee', 'rupees', 'rupaye', 'rs', 'mujhe', 'chahiye', 'dikhao', 'karo', 'ke',
    'andar', 'mein', 'liye', 'kuch',
  ])
  const keywords = terms.filter((term) => !ignoredTerms.has(term) && !/^\d+$/.test(term))
  const budgetMatch = query.match(
    /(?:under|below|less than|within|up to|upto|under rs\.?|under ₹)\s*₹?\s*(\d+)|₹\s*(\d+)|(\d+)\s*(?:rupees?|rs\.?|rupaye?)|(\d+)\s*(?:rupaye?\s*)?(?:ke andar|tak)/i,
  )
  const maxPrice = budgetMatch
    ? Number(budgetMatch.slice(1).find((value) => value != null))
    : null
  const categoryId = selectedCategory?._id || selectedCategory?.id || selectedCategory?.slug
  const categoryName = `${selectedCategory?.name || selectedCategory?.title || selectedCategory?.category || ''}`.toLowerCase()
  const matchingProducts = products
    .map((product, index) => {
      const searchText = getProductSearchText(product)
      const matches = keywords.filter((keyword) => searchText.includes(keyword)).length
      const productCategory = product.category
      const productCategoryId = typeof productCategory === 'object'
        ? productCategory?._id || productCategory?.id || productCategory?.slug
        : productCategory
      const productCategoryName = typeof productCategory === 'object'
        ? `${productCategory?.name || productCategory?.title || productCategory?.category || ''}`.toLowerCase()
        : `${productCategory || ''}`.toLowerCase()
      const matchesCategory = !selectedCategory ||
        `${productCategoryId || ''}` === `${categoryId || ''}` ||
        productCategoryName === categoryName ||
        searchText.includes(categoryName)
      return { product, index, matches, matchesCategory }
    })
    .filter(({ product, matches, matchesCategory }) => {
      const price = Number(product.price ?? product.salePrice ?? product.currentPrice)
      return matchesCategory &&
        (selectedCategory || keywords.length === 0 || matches > 0) &&
        (maxPrice == null || (Number.isFinite(price) && price <= maxPrice))
    })
    .sort((left, right) => right.matches - left.matches || left.index - right.index)
    .slice(0, 4)

  return matchingProducts.map(({ product }) => product)
}

const getHistoryMessages = (result) => {
  const payload = getPayload(result)
  return getArray(payload.messages, payload.history, payload.data?.messages)
}

const getErrorMessage = (error) => {
  const serverMessage = error?.response?.data?.message || error?.response?.data?.error
  if (serverMessage) return serverMessage
  if (error?.response?.status === 404) return 'Shopping assistant service is not available right now.'
  if (error?.response?.status >= 500) return 'We’re having a little trouble connecting. Please try again.'
  if (error?.message && !/network error/i.test(error.message)) return error.message
  return 'Could not connect. Please check your connection and try again.'
}

const getProductId = (product) => product?._id || product?.id || product?.productId || product?.sku

const getProductImage = (product) => getImageUrl(
  product?.image || product?.imageUrl || product?.image_url || product?.images?.[0],
)

const formatPrice = (value) => {
  const price = Number(value)
  return Number.isFinite(price)
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
    : null
}

const messageFromHistory = (message, index) => {
  const role = `${message.role || message.sender || message.type || ''}`.toLowerCase()
  const text = message.content || message.text || message.message || message.response || ''
  return {
    id: message._id || message.id || `history-${index}`,
    role: ['user', 'customer', 'human'].includes(role) ? 'user' : 'assistant',
    text: typeof text === 'string' ? text : '',
    products: getProducts(message),
    suggestions: getArray(message.suggestedQuestions, message.followUpQuestions),
    timestamp: message.createdAt || message.timestamp || message.sentAt,
  }
}

const getConversationId = (result) => {
  const payload = getPayload(result)
  return payload.conversationId || payload.conversation?._id || payload.conversation?.id || null
}

const getSessionId = (result) => {
  const payload = getPayload(result)
  return payload.sessionId || payload.session_id || null
}

function Avatar({ isUser = false }) {
  const Icon = isUser ? UserRound : Bot
  return (
    <span className={`vy-chat-avatar ${isUser ? 'vy-chat-avatar-user' : ''}`} aria-hidden="true">
      <Icon size={15} strokeWidth={2.2} />
    </span>
  )
}

function ProductCard({ product, dispatch, addToast }) {
  const id = getProductId(product)
  const name = product.name || product.title || 'Product'
  const price = Number(product.price ?? product.salePrice ?? product.currentPrice)
  const originalPrice = Number(product.originalPrice ?? product.mrp ?? product.compareAtPrice)
  const image = getProductImage(product)
  const stock = product.stock ?? product.quantityAvailable
  const rating = Number(product.rating ?? product.averageRating)
  const discount = Number(product.discountPercentage ?? product.discount)
  const features = getArray(product.features, product.highlights)
  const isAvailable = stock == null ? null : Number(stock) > 0

  const handleAddToCart = () => {
    if (!id || !Number.isFinite(price) || price < 0) {
      addToast('This product cannot be added to your cart right now.', 'error')
      return
    }
    if (isAvailable === false) {
      addToast('Sorry, this product is out of stock.', 'error')
      return
    }

    dispatch(addItem({
      id: String(id),
      key: String(id),
      productId: String(id),
      name,
      title: name,
      image,
      price,
      quantity: 1,
      stock: stock == null ? Infinity : Number(stock),
      brand: typeof product.brand === 'string' ? product.brand : product.brand?.name || '',
      hsnCode: product.hsnCode || '',
      gstRate: Number(product.gstRate) || 0,
      priceIncludesGST: product.priceIncludesGST === true,
    }))
    addToast(`${name} added to cart.`, 'success')
  }

  return (
    <article className="vy-chat-product">
      <div className="vy-chat-product-main">
        <div className="vy-chat-product-image">
          {image ? <img src={image} alt={name} loading="lazy" /> : <ShoppingBag size={24} aria-hidden="true" />}
        </div>
        <div className="vy-chat-product-info">
          <h4 title={name}>{name}</h4>
          <div className="vy-chat-product-price">
            {formatPrice(price)}
            {Number.isFinite(originalPrice) && originalPrice > price && (
              <del>{formatPrice(originalPrice)}</del>
            )}
            {Number.isFinite(discount) && discount > 0 && (
              <span className="vy-chat-discount">{discount}% off</span>
            )}
          </div>
          <div className="vy-chat-product-meta">
            {isAvailable !== null && (
              <span className={isAvailable ? 'vy-chat-stock' : 'vy-chat-stock vy-chat-stock-out'}>
                {isAvailable ? 'In stock' : 'Out of stock'}
              </span>
            )}
            {Number.isFinite(rating) && rating > 0 && (
              <span className="vy-chat-rating"><Star size={12} fill="currentColor" /> {rating.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
      {features.length > 0 && (
        <ul className="vy-chat-features">
          {features.slice(0, 3).map((feature, index) => (
            <li key={`${feature}-${index}`}><Check size={12} /> {typeof feature === 'string' ? feature : feature.name || feature.label}</li>
          ))}
        </ul>
      )}
      <div className="vy-chat-product-actions">
        {id ? <Link to={`/product/${encodeURIComponent(id)}`} className="vy-chat-view-button">View product</Link> : <span />}
        <button type="button" onClick={handleAddToCart} disabled={isAvailable === false} className="vy-chat-cart-button">
          <ShoppingCart size={14} /> Add to cart
        </button>
      </div>
    </article>
  )
}

function CategoryList({ categories, onSelect }) {
  return (
    <div className="vy-chat-category-list">
      {categories.map((category, index) => {
        const id = category._id || category.id || category.slug || category.name || index
        const name = category.name || category.title || category.category || `Category ${index + 1}`
        const image = getImageUrl(category.image || category.imageUrl || category.image_url || '')

        return (
          <button key={id} type="button" onClick={() => onSelect(category)}>
            <span className="vy-chat-category-image">
              {image ? <img src={image} alt="" loading="lazy" /> : <LayoutGrid size={16} />}
            </span>
            <span>{name}</span>
            <span className="vy-chat-category-arrow" aria-hidden="true">›</span>
          </button>
        )
      })}
    </div>
  )
}

function QuickActions({ onSelect, compact = false }) {
  return (
    <div className={`vy-chat-quick-actions ${compact ? 'vy-chat-quick-actions-compact' : ''}`}>
      {quickActions.map(({ label, prompt, icon: Icon, kind }) => (
        <button key={label} type="button" onClick={() => onSelect(prompt, kind)}>
          <Icon size={15} /> {label}
        </button>
      ))}
    </div>
  )
}

function WelcomeScreen({ onSelect }) {
  return (
    <div className="vy-chat-welcome">
      <span className="vy-chat-welcome-icon"><Sparkles size={22} /></span>
      <h3>Namaste! Welcome to Vyason <span aria-hidden="true">👋</span></h3>
      <p>I’m your AI Shopping Assistant. How can I help you today?</p>
      <QuickActions onSelect={onSelect} />
      <span className="vy-chat-welcome-hint">Choose a suggestion or ask me anything.</span>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="vy-chat-row">
      <Avatar />
      <div className="vy-chat-typing" role="status" aria-label="Assistant is typing">
        <span /><span /><span />
      </div>
    </div>
  )
}

function ChatMessage({ message, onRetry, onSuggestion, onCategorySelect, dispatch, addToast }) {
  const isUser = message.role === 'user'
  const date = message.timestamp ? new Date(message.timestamp) : new Date()
  const time = Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  return (
    <>
      <div className={`vy-chat-row ${isUser ? 'vy-chat-row-user' : ''}`}>
        {!isUser && <Avatar />}
        <div className={`vy-chat-message-wrap ${isUser ? 'vy-chat-message-wrap-user' : ''}`}>
          <div className={`vy-chat-bubble ${isUser ? 'vy-chat-bubble-user' : ''}`}>
            {message.text && <p>{message.text}</p>}
            {message.products?.length > 0 && (
              <div className="vy-chat-products">
                {message.products.map((product, index) => (
                  <ProductCard
                    key={getProductId(product) || `${message.id}-${index}`}
                    product={product}
                    dispatch={dispatch}
                    addToast={addToast}
                  />
                ))}
              </div>
            )}
            {message.categories?.length > 0 && (
              <CategoryList categories={message.categories} onSelect={onCategorySelect} />
            )}
          </div>
          <span className="vy-chat-time">{time}</span>
          {!isUser && message.suggestions?.length > 0 && (
            <div className="vy-chat-followups">
              {message.suggestions.slice(0, 3).map((suggestion, index) => (
                <button key={`${suggestion}-${index}`} type="button" onClick={() => onSuggestion(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        {isUser && <Avatar isUser />}
      </div>
      {message.failed && (
        <div className="vy-chat-row">
          <Avatar />
          <div className="vy-chat-message-wrap">
            <div className="vy-chat-bubble vy-chat-failed-bubble" role="alert">
              <p>{message.error || 'Your message could not be sent.'}</p>
              <button
                type="button"
                className="vy-chat-retry-button"
                onClick={() => onRetry(message.text, message.id)}
              >
                <RotateCcw size={13} /> Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ChatInput({ value, onChange, onSend, disabled }) {
  const inputRef = useRef(null)

  useEffect(() => {
    const textarea = inputRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`
  }, [value])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <form
      className="vy-chat-input-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSend()
      }}
    >
      <div className="vy-chat-input-box">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about products..."
          aria-label="Message the shopping assistant"
          rows={1}
          maxLength={2000}
          disabled={disabled}
        />
        {value && (
          <button type="button" className="vy-chat-clear-input" onClick={() => onChange('')} aria-label="Clear message">
            <X size={15} />
          </button>
        )}
        <button type="submit" className="vy-chat-send" disabled={disabled || !value.trim()} aria-label="Send message">
          <Send size={17} />
        </button>
      </div>
      <span className="vy-chat-input-hint">Enter to send · Shift + Enter for a new line</span>
    </form>
  )
}

export default function ChatbotWidget() {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(() => globalThis.crypto?.randomUUID?.() || `vyason-${Date.now()}`)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [language, setLanguage] = useState('en')
  const [error, setError] = useState('')
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const scrollRef = useRef(null)
  const requestInFlight = useRef(false)
  const historyLoaded = useRef(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const loadConversationData = useCallback(async () => {
    if (historyLoaded.current) return
    historyLoaded.current = true
    setIsLoadingHistory(true)
    setError('')
    try {
      const conversationsResult = await getChatConversations()
      const payload = getPayload(conversationsResult)
      const list = getArray(payload.conversations, payload.items, payload.data?.conversations)
      setConversations(list)

      const latest = list[0]
      const latestId = latest?._id || latest?.id || latest?.conversationId || null
      if (latestId) setConversationId(latestId)

      const historyResult = await getChatHistory({
        ...(latestId ? { conversationId: latestId } : {}),
        sessionId,
      })
      const loaded = getHistoryMessages(historyResult)
        .map(messageFromHistory)
        .filter((message) => message.text || message.products.length)
      if (loaded.length) setMessages(loaded)
      setSessionId(getSessionId(historyResult) || sessionId)
      setConversationId(getConversationId(historyResult) || latestId)
    } catch (requestError) {
      historyLoaded.current = false
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoadingHistory(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (isOpen) loadConversationData()
  }, [isOpen, loadConversationData])

  const sendMessage = useCallback(async (text = inputValue, kind = 'message', retryId = null) => {
    const messageText = text.trim()
    if (!messageText || requestInFlight.current) return

    requestInFlight.current = true
    setError('')
    setIsTyping(true)
    const userMessageId = retryId || `user-${Date.now()}`
    if (!retryId) {
      setMessages((current) => [...current, {
        id: userMessageId,
        role: 'user',
        text: messageText,
        timestamp: new Date().toISOString(),
      }])
    } else {
      setMessages((current) => current.map((message) => (
        message.id === retryId ? { ...message, failed: false, error: '' } : message
      )))
    }
    setInputValue('')

    const payload = { message: messageText, query: messageText, sessionId, conversationId, language }
    try {
      const result = kind === 'order'
        ? await getChatOrderStatus(payload)
        : kind === 'recommendation'
          ? await getChatRecommendations(payload)
          : await sendChatMessage(payload)
      const responsePayload = getPayload(result)
      let products = getProducts(result)
      let responseText = getMessageText(result, products.length ? 'Here are a few options you might like:' : '')
      if (
        products.length === 0 &&
        kind !== 'order' &&
        !isGreetingQuery(messageText) &&
        (kind === 'recommendation' || !isGreetingQuery(messageText))
      ) {
        try {
          products = await findCatalogProducts(messageText)
          if (products.length && isCatalogFallbackMessage(responseText)) {
            responseText = 'The AI assistant is temporarily unavailable, but I found these products in our catalog:'
          }
        } catch (catalogError) {
          setError(getErrorMessage(catalogError))
        }
      }
      setSessionId(getSessionId(result) || sessionId)
      const nextConversationId = getConversationId(result)
      if (nextConversationId) setConversationId(nextConversationId)
      setMessages((current) => [...current, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: responseText,
        products,
        suggestions: getArray(responsePayload.suggestedQuestions, responsePayload.followUpQuestions),
        timestamp: new Date().toISOString(),
      }])
    } catch (requestError) {
      const errorText = getErrorMessage(requestError)
      let catalogProducts = []
      if (kind !== 'order' && !isGreetingQuery(messageText)) {
        try {
          catalogProducts = await findCatalogProducts(messageText)
        } catch (catalogError) {
          setError(getErrorMessage(catalogError))
        }
      }

      if (catalogProducts.length) {
        setMessages((current) => [...current, {
          id: `catalog-fallback-${Date.now()}`,
          role: 'assistant',
          text: 'The AI assistant is temporarily unavailable, but here are matching products from our catalog:',
          products: catalogProducts,
          timestamp: new Date().toISOString(),
        }])
      } else {
        setMessages((current) => current.map((message) => (
          message.id === userMessageId
            ? { ...message, failed: true, error: errorText, requestKind: kind }
            : message
        )))
      }
    } finally {
      setIsTyping(false)
      requestInFlight.current = false
    }
  }, [conversationId, inputValue, language, sessionId])

  const browseCategories = async () => {
    if (requestInFlight.current) return
    requestInFlight.current = true
    setError('')
    setIsTyping(true)
    try {
      const categories = getCategoryArray(await getChatCategories())
        .filter((category) => `${category.status || 'active'}`.trim().toLowerCase() !== 'inactive')
      setMessages((current) => [...current, {
        id: `categories-${Date.now()}`,
        role: 'assistant',
        text: categories.length
          ? 'Browse all categories. Select one to see products:'
          : 'No product categories are available right now.',
        categories,
        timestamp: new Date().toISOString(),
      }])
    } catch (requestError) {
      const errorText = getErrorMessage(requestError)
      setError(errorText)
      setMessages((current) => [...current, {
        id: `categories-error-${Date.now()}`,
        role: 'assistant',
        text: 'I couldn’t load the product categories. Please try again.',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setIsTyping(false)
      requestInFlight.current = false
    }
  }

  const browseCategory = async (category) => {
    if (requestInFlight.current) return
    const categoryName = category.name || category.title || category.category || 'this category'
    requestInFlight.current = true
    setError('')
    setIsTyping(true)
    setMessages((current) => [...current, {
      id: `category-query-${Date.now()}`,
      role: 'user',
      text: `Show me ${categoryName} products`,
      timestamp: new Date().toISOString(),
    }])
    try {
      const products = await findCatalogProducts(categoryName, category)
      setMessages((current) => [...current, {
        id: `category-products-${Date.now()}`,
        role: 'assistant',
        text: products.length
          ? `Here are the available products in ${categoryName}:`
          : `I couldn’t find any available products in ${categoryName}. Try another category or search by product name.`,
        products,
        timestamp: new Date().toISOString(),
      }])
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsTyping(false)
      requestInFlight.current = false
    }
  }

  const handleRetry = (text, id) => {
    const failed = messages.find((message) => message.id === id)
    sendMessage(text, failed?.requestKind || 'message', id)
  }

  const startNewConversation = async () => {
    if (requestInFlight.current) return
    if (conversationId) {
      try {
        await deleteChatConversation(conversationId)
      } catch (requestError) {
        setError(getErrorMessage(requestError))
        return
      }
    }
    setMessages([])
    setConversationId(null)
    setSessionId(globalThis.crypto?.randomUUID?.() || `vyason-${Date.now()}`)
    setConversations((current) => current.filter((conversation) => (
      (conversation._id || conversation.id || conversation.conversationId) !== conversationId
    )))
    setError('')
    historyLoaded.current = true
  }

  const handleQuickAction = (prompt, kind) => {
    if (kind === 'categories') {
      browseCategories()
      return
    }
    sendMessage(prompt, kind)
  }

  return (
    <div className="vy-chat-widget">
      {isOpen && (
        <section className="vy-chat-window" aria-label="Vyason AI Shopping Assistant" aria-modal="false">
          <header className="vy-chat-header">
            <span className="vy-chat-brand-icon"><Sparkles size={20} /></span>
            <div className="vy-chat-heading">
              <h2>Vyason AI Shopping Assistant</h2>
              <span><i /> AI-powered shopping help</span>
            </div>
            <div className="vy-chat-header-actions">
              <label className="vy-chat-language">
                <span className="sr-only">Assistant language</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Assistant language">
                  <option value="en">EN</option>
                  <option value="hi">हि</option>
                  <option value="hinglish">हिंग्लिश</option>
                </select>
              </label>
              <button type="button" title="New conversation" aria-label="New conversation" onClick={startNewConversation} disabled={isTyping}>
                <Plus size={18} />
              </button>
              <button type="button" title="Minimize chat" aria-label="Minimize chat" onClick={() => setIsOpen(false)}>
                <Minus size={18} />
              </button>
              <button type="button" title="Close chat" aria-label="Close chat" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="vy-chat-history-bar">
            <span>{conversationId ? 'Conversation restored' : 'Here to help you shop'}</span>
            {conversations.length > 1 && <span>{conversations.length} saved chats</span>}
            <button type="button" onClick={startNewConversation} disabled={isTyping} title="Clear conversation">
              <Trash2 size={13} /> Clear
            </button>
          </div>

          <main className="vy-chat-messages" ref={scrollRef} aria-live="polite">
            {error && (
              <div className="vy-chat-error" role="alert">
                <span>{error}</span>
                <button type="button" aria-label="Dismiss error" onClick={() => setError('')}><X size={14} /></button>
              </div>
            )}
            {isLoadingHistory && (
              <div className="vy-chat-history-loading"><span /> Loading your conversation...</div>
            )}
            {!isLoadingHistory && messages.length === 0 && <WelcomeScreen onSelect={handleQuickAction} />}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRetry={handleRetry}
                onSuggestion={(suggestion) => sendMessage(suggestion)}
                onCategorySelect={browseCategory}
                dispatch={dispatch}
                addToast={addToast}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </main>

          <div className="vy-chat-input-area">
            {messages.length > 0 && <QuickActions onSelect={handleQuickAction} compact />}
            <ChatInput value={inputValue} onChange={setInputValue} onSend={() => sendMessage()} disabled={isTyping} />
          </div>
        </section>
      )}

      <button
        type="button"
        className={`vy-chat-launcher ${isOpen ? 'vy-chat-launcher-open' : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Minimize shopping assistant' : 'Open Vyason shopping assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronDown size={25} /> : <MessageCircle size={25} />}
        {!isOpen && <span className="vy-chat-launcher-badge"><Sparkles size={11} /></span>}
      </button>
    </div>
  )
}
