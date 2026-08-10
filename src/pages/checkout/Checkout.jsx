import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from "react-hook-form";
import { API_URLS } from '../../utils/config';

import ContactInfo from './ContactInfo';
import ShippingAddress from './ShippingAddress';
import DeliveryMethods from './DeliveryMethods';
import PaymentMethods from './PaymentMethods';
import BillingAddress from "./BillingAddress";
import OrderNotes from './OrderNotes';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import { useToast } from '../../components/ToastProvider';
import LoginRequiredCard from '../../components/LoginRequiredCard';
import {
    selectCheckedCartItems,
    selectCartSubtotal,
    selectCartDiscount,
    selectShipping,
    selectCartTotal,
    selectCartCoupon,
} from '../../store/cartSlice';

const normalizeAuthToken = (value) => {
    if (!value) return ''
    if (typeof value === 'string') return value.trim().replace(/^Bearer\s+/i, '')
    return ''
}

const getStoredAuthToken = () => {
    if (typeof window === 'undefined') return ''

    const candidates = [
        window.localStorage.getItem('token'),
        window.localStorage.getItem('accessToken'),
        window.localStorage.getItem('authToken'),
        window.localStorage.getItem('jwt'),
    ]

    for (const candidate of candidates) {
        const normalized = normalizeAuthToken(candidate)
        if (normalized) return normalized
    }

    try {
        const rawUser = window.localStorage.getItem('user')
        if (!rawUser) return ''
        const parsedUser = JSON.parse(rawUser)
        return normalizeAuthToken(parsedUser?.token || parsedUser?.accessToken || parsedUser?.authToken || parsedUser?.jwt || parsedUser?.data?.token || parsedUser?.data?.accessToken || parsedUser?.data?.authToken || parsedUser?.data?.jwt || '')
    } catch (error) {
        return ''
    }
}

const getStoredUser = () => {
    try {
        const raw = window.localStorage.getItem('user')
        if (!raw) return null

        const parsed = JSON.parse(raw)
        return parsed?.user || parsed?.userData || parsed?.data?.user || parsed?.data || parsed
    } catch (error) {
        return null
    }
}

const getJwtPayload = (token) => {
    if (!token) return null

    try {
        const payloadPart = token.split('.')[1]
        if (!payloadPart) return null
        const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(window.atob(normalizedPayload))
    } catch (error) {
        return null
    }
}

const getAuthenticatedUserContext = () => {
    const token = getStoredAuthToken()
    const storedUser = getStoredUser()
    const tokenPayload = getJwtPayload(token)

    return {
        token,
        storedUser,
        email: storedUser?.email || tokenPayload?.email || tokenPayload?.userEmail || '',
        apiUserIdentifier:
            storedUser?.id ||
            storedUser?._id ||
            storedUser?.userId ||
            storedUser?.sub ||
            tokenPayload?.sub ||
            tokenPayload?.userId ||
            tokenPayload?.id ||
            tokenPayload?._id ||
            '',
    }
}

const parseOrderErrorText = async (response) => {
    try {
        const text = await response.text()
        return text || ''
    } catch (error) {
        return ''
    }
}

const isOrderFallbackError = (text = '') => {
    if (!text) return false
    return /next is not a function|Cannot read properties of undefined|middleware|Unexpected token|invalid|Internal Server Error|ECONNRESET/i.test(text)
}

const Checkout = () => {
const navigate = useNavigate()
const { addToast } = useToast()

const selectedItems = useSelector(selectCheckedCartItems)
const subtotal = useSelector(selectCartSubtotal)
const discount = useSelector(selectCartDiscount)
const shipping = useSelector(selectShipping)
const total = useSelector(selectCartTotal)
const coupon = useSelector(selectCartCoupon)
const authContext = getAuthenticatedUserContext()
const storedUser = authContext.storedUser
const token = authContext.token
const isAuthenticated = Boolean(token)

const methods = useForm({
  mode: "onSubmit",
  defaultValues: {
    email: "",
    mobile: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    deliveryMethod: "",
    paymentMethod: "",
    notes: "",
  },
});


const { handleSubmit, formState: { isSubmitting } } = methods;

const onSubmit = async (data) => {
    if (!selectedItems.length) {
        addToast('Please select at least one item before placing your order.', 'error')
        return
    }

    if (!API_URLS) {
        addToast('Order API is not configured.', 'error')
        return
    }

    const user = storedUser || {}
    const apiUserIdentifier = authContext.apiUserIdentifier

    if (!isAuthenticated) {
        addToast('Login required to place your order.', 'error')
        navigate('/login')
        return
    }

    const shippingAddress = {
        firstName: `${data.firstName || ''}`.trim(),
        lastName: `${data.lastName || ''}`.trim(),
        address1: `${data.address1 || ''}`.trim(),
        address2: `${data.address2 || ''}`.trim(),
        city: `${data.city || ''}`.trim(),
        state: `${data.state || ''}`.trim(),
        country: `${data.country || ''}`.trim(),
        pincode: `${data.pincode || ''}`.trim(),
    }

    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.country || !shippingAddress.pincode) {
        addToast('Please complete shipping address before placing the order.', 'error')
        return
    }

    const shippingAddressLine = [shippingAddress.address1, shippingAddress.address2].filter(Boolean).join(', ')
    const shippingAddressComplete = `${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddressLine}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country} - ${shippingAddress.pincode}`

    const payload = {
        email: data.email || authContext.email || user?.email || '',
        contact: {
            email: data.email || authContext.email || user?.email || '',
            mobile: data.mobile || '',
        },
        shippingAddress: {
            ...shippingAddress,
            fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
            addressLine1: shippingAddress.address1,
            addressLine2: shippingAddress.address2,
            street: shippingAddress.address1,
            area: shippingAddress.address2,
            zipCode: shippingAddress.pincode,
            postalCode: shippingAddress.pincode,
            zipcode: shippingAddress.pincode,
            address: shippingAddressLine,
            completeAddress: shippingAddressComplete,
        },
        shipping_address: {
            ...shippingAddress,
            fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
            addressLine1: shippingAddress.address1,
            addressLine2: shippingAddress.address2,
            zipCode: shippingAddress.pincode,
            postalCode: shippingAddress.pincode,
            address: shippingAddressLine,
            completeAddress: shippingAddressComplete,
        },
        address: {
            ...shippingAddress,
            line1: shippingAddress.address1,
            line2: shippingAddress.address2,
            zipCode: shippingAddress.pincode,
            postalCode: shippingAddress.pincode,
            full: shippingAddressComplete,
        },
        deliveryMethod: data.deliveryMethod || '',
        paymentMethod: data.paymentMethod || '',
        notes: data.notes || '',
        coupon: coupon || null,
        subtotal: Number(subtotal || 0),
        discount: Number(discount || 0),
        shippingCost: Number(shipping || 0),
        total: Number(total || 0),
        items: selectedItems.map((item) => ({
            product: item.id || item._id || item.productId || item.key,
            productId: item.id || item._id || item.productId || item.key,
            key: item.key,
            name: item.name || item.title || '',
            title: item.title || item.name || '',
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            image: item.image || '',
        })),
        orderItems: selectedItems.map((item) => ({
            product: item.id || item._id || item.productId || item.key,
            productId: item.id || item._id || item.productId || item.key,
            key: item.key,
            name: item.name || item.title || '',
            title: item.title || item.name || '',
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            image: item.image || '',
        })),
    }

    if (apiUserIdentifier) {
        payload.userId = apiUserIdentifier
        payload.user = apiUserIdentifier
    }

    try {
        const headers = {
            'Content-Type': 'application/json',
        }

        headers.Authorization = `Bearer ${token}`
        headers['x-auth-token'] = token
        headers['x-access-token'] = token

        const endpoint = `${API_URLS}/api/orders`

        const response = await fetch(endpoint, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(payload),
        })

        if (response.ok) {
            addToast('Order placed successfully!', 'success')
            navigate('/dashboard/order')
            return
        }

        const errorText = await parseOrderErrorText(response)
        const normalizedErrorText = `${errorText || ''}`.trim()

        if (response.status === 401 || /No token provided|Invalid token/i.test(normalizedErrorText)) {
            throw new Error('Your session is expired or the login token is invalid. Please login again and try placing the order.')
        }

        if (response.status >= 500 || isOrderFallbackError(normalizedErrorText)) {
            addToast('The order could not be created in the database. Please try again after signing in with a valid account or contact support.', 'error')
            return
        }

        throw new Error(normalizedErrorText || `Order creation failed (${response.status})`)
    } catch (error) {
        const message = `${error.message || ''}`.includes('No token provided')
            ? 'Login required to place your order.'
            : (error.message || 'Unable to place order. Please try again.')
        addToast(message, 'error')
    }

};


    if (!isAuthenticated) {
        return (
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-6">
                    <LoginRequiredCard
                        title="Checkout requires login"
                        message="Please login before placing your order."
                    />
                </div>
            </section>
        )
    }

    return (
        <>
            <div>
                <section className=" py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-10">
                            <h1 className="text-4xl font-bold text-[#1c1c1c]">Checkout</h1>
                            <p className="mt-2 text-gray-500">
                                Complete your order securely and quickly.
                            </p>
                        </div>
                        <FormProvider {...methods}>
                             <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Side */}
                            
                            
                                
                            <div className="lg:col-span-8 space-y-6">

                                {/* Contact Information */}
                                <ContactInfo />
                                {/* Shipping Address */}
                                <ShippingAddress />

                                {/* Delivery Method */}
                                <DeliveryMethods />

                                {/* Payment */}
                                <PaymentMethods />

                                {/* Billing */}
                                <BillingAddress />

                                {/* Order Notes */}
                                <OrderNotes />

                            </div>

                            {/* Right Side */}

                            <CheckoutOrderSummary hasSelectedItems={selectedItems.length > 0} isSubmitting={isSubmitting} />
                           
                           
                        </div>
                         </form>
                         </FormProvider>

                    </div>
                </section>
            </div>
        </>
    )
}

export default Checkout;


