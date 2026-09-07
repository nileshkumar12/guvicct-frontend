import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
import { createRazorpayOrder, resetPayment, verifyRazorpayPayment } from '../../store/paymentSlice';
import { loadRazorpay } from '../../utils/loadRazorpay';
import { selectCheckedCartItems, selectCartSubtotal, selectCartDiscount, selectShipping, selectCartTotal, selectCartCoupon, removeSelectedItems} from '../../store/cartSlice';
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

const normalizeText = (value) => `${value || ''}`.trim()

const normalizeEmail = (value) => normalizeText(value).toLowerCase()

const buildCheckoutItems = (items = []) =>
    items.map((item) => {
        const productId = item.id || item._id || item.productId || item.product || item.key
        const quantity = Number(item.quantity || 1)
        const price = Number(item.price || 0)
        return {
            product: productId,
            productId,
            key: item.key,
            name: item.name || item.title || '',
            title: item.title || item.name || '',
            price,
            quantity,
            qty: quantity,
            amount: quantity,
            image: item.image || '',
            variantId: item.variantId || '',
            variant: item.variantId || '',
            variantSku: item.variantSku || '',
            sku: item.variantSku || item.sku || '',
            attributes: item.variantAttributes || {},
            variantAttributes: item.variantAttributes || {},
            addons: item.addons || [],
        }
    })

const parseOrderResponseJson = async (response) => {
    try {
        const text = await response.text()
        if (!text) return null

        try {
            return JSON.parse(text)
        } catch (error) {
            return { message: text }
        }
    } catch (error) {
        return null
    }
}

const getFirstText = (...values) => {
    for (const value of values) {
        if (value === null || value === undefined) continue
        const text = `${value}`.trim()
        if (text) return text
    }
    return ''
}

const getObjectCandidates = (value = {}) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return []
    return [
        value.order,
        value.razorpayOrder,
        value.paymentOrder,
        value.data?.order,
        value.data?.razorpayOrder,
        value.data?.paymentOrder,
        value.data,
        value.result?.order,
        value.result?.razorpayOrder,
        value.result?.paymentOrder,
        value.result,
        value.payload?.order,
        value.payload,
        value,
    ].filter((candidate) => candidate && typeof candidate === 'object' && !Array.isArray(candidate))
}

const getCreatedOrderId = (data, response) => {
    const candidates = getObjectCandidates(data)
    for (const candidate of candidates) {
        const id = getFirstText(candidate._id, candidate.id, candidate.orderId, candidate.order_id)
        if (id) return id
    }
    const location = response?.headers?.get?.('Location') || response?.headers?.get?.('location') || ''
    return location.split('/').filter(Boolean).pop() || ''
}

const getCreatedOrderNumber = (data, fallbackId = '') => {
    const candidates = getObjectCandidates(data)
    for (const candidate of candidates) {
        const orderNumber = getFirstText(
            candidate.orderNumber,
            candidate.orderNo,
            candidate.order_number,
            candidate.publicOrderId,
            candidate.displayOrderNumber,
        )
        if (orderNumber) return orderNumber
    }
    return fallbackId
}

const getRazorpayCheckoutConfig = (paymentResponse, fallbackAmount) => {
    const candidates = getObjectCandidates(paymentResponse)
    const keyCandidate = candidates.find((candidate) =>
        getFirstText(candidate.keyId, candidate.key_id, candidate.key, candidate.razorpayKeyId)
    )
    const orderCandidate =
        candidates.find((candidate) =>
            getFirstText(candidate.id, candidate.orderId, candidate.razorpayOrderId, candidate.razorpay_order_id)
        ) || {}

    const key = getFirstText(
        paymentResponse?.keyId,
        paymentResponse?.key_id,
        paymentResponse?.key,
        paymentResponse?.razorpayKeyId,
        keyCandidate?.keyId,
        keyCandidate?.key_id,
        keyCandidate?.key,
        keyCandidate?.razorpayKeyId,
        import.meta.env.VITE_RAZORPAY_KEY_ID,
    )
    const orderId = getFirstText(
        orderCandidate.id,
        orderCandidate.orderId,
        orderCandidate.razorpayOrderId,
        orderCandidate.razorpay_order_id,
    )
    const amount = Number(
        getFirstText(
            orderCandidate.amount,
            paymentResponse?.amount,
            paymentResponse?.data?.amount,
            paymentResponse?.result?.amount,
        )
    ) || Math.round(Number(fallbackAmount || 0) * 100)
    const currency = getFirstText(
        orderCandidate.currency,
        paymentResponse?.currency,
        paymentResponse?.data?.currency,
        paymentResponse?.result?.currency,
        'INR',
    )

    return {key, orderId, amount, currency,}
}

const isRazorpayPaymentMethod = (value) => `${value || ''}`.trim().toLowerCase() === 'razorpay'

const getErrorMessage = (error, fallback = 'Unable to place order. Please try again.') => {
    if (!error) return fallback
    if (typeof error === 'string') return error
    return error.message || error.error?.description || error.error?.reason || fallback
}

const PAYMENT_STATUS_STORAGE_KEY = 'checkoutPaymentStatusByOrderId'

const createPaymentFlowError = (message, code, data = {}) => {
    const error = new Error(message)
    error.code = code
    error.paymentData = data
    return error
}

const getOrderMutationHeaders = ({ token, customerEmail } = {}) => {
    const headers = {
        'Content-Type': 'application/json',
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`
        headers['x-auth-token'] = token
        headers['x-access-token'] = token
    }
    if (customerEmail) {
        headers['x-user-email'] = customerEmail
    }
    return headers
}

const saveCheckoutPaymentStatus = (orderId, status) => {
    if (typeof window === 'undefined' || !orderId) return
    try {
        const raw = window.localStorage.getItem(PAYMENT_STATUS_STORAGE_KEY)
        const current = raw ? JSON.parse(raw) : {}

        window.localStorage.setItem(PAYMENT_STATUS_STORAGE_KEY, JSON.stringify({
            ...current,
            [orderId]: {
                ...status,
                updatedAt: new Date().toISOString(),
            },
        }))
    } catch (error) {
        console.error('Failed to save checkout payment status:', error)
    }
}

const updateOrderPaymentState = async ({ orderId, token, customerEmail, payload }) => {
    if (!API_URLS || !orderId) return false
    const encodedOrderId = encodeURIComponent(orderId)
    const headers = getOrderMutationHeaders({ token, customerEmail })
    const requests = [
        {
            method: 'PATCH',
            url: `${API_URLS}/api/orders/${encodedOrderId}`,
            body: payload,
        },
        {
            method: 'PUT',
            url: `${API_URLS}/api/orders/${encodedOrderId}`,
            body: payload,
        },
        {
            method: 'PATCH',
            url: `${API_URLS}/api/orders/${encodedOrderId}/status`,
            body: payload,
        },
        {
            method: 'PUT',
            url: `${API_URLS}/api/orders/${encodedOrderId}/status`,
            body: payload,
        },
        {
            method: 'PATCH',
            url: `${API_URLS}/api/orders/${encodedOrderId}/payment`,
            body: payload,
        },
        {
            method: 'PUT',
            url: `${API_URLS}/api/orders/${encodedOrderId}/payment`,
            body: payload,
        },
        {
            method: 'POST',
            url: `${API_URLS}/api/orders`,
            body: {
                orderId,
                action: 'updatePaymentStatus',
                ...payload,
            },
        },
    ]

    for (const request of requests) {
        try {
            const response = await fetch(request.url, {
                method: request.method,
                credentials: 'include',
                headers,
                body: JSON.stringify(request.body),
            })

            if (response.ok) return true
            if (![404, 405].includes(response.status)) continue
        } catch (error) {
            continue
        }
    }

    return false
}

const buildPaymentFailureMessage = ({ orderId, orderNumber, error }) => {
    const orderLabel = orderNumber || orderId
    const reason = getErrorMessage(error, 'Payment failed.').replace(/\.$/, '')
    return orderLabel
        ? `Payment failed for order #${orderLabel}. ${reason}.`
        : `${reason}.`
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
    const dispatch = useDispatch();
    const methods = useForm({
        mode: "onSubmit",
        defaultValues: {
            email: authContext.email || "",
            mobile: storedUser?.mobile || storedUser?.phone || "",
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


    const { handleSubmit, watch, formState: { isSubmitting } } = methods;
    const selectedPaymentMethod = watch("paymentMethod")
    const isRazorpaySelected = isRazorpayPaymentMethod(selectedPaymentMethod)

    const startRazorpayPayment = async ({
        amount,
        customer,
    }) => {
        dispatch(resetPayment())
        const isLoaded =  await loadRazorpay()
        if (
            !isLoaded ||
            !window.Razorpay
        ) {
            throw createPaymentFlowError(
                'Unable to load Razorpay checkout. Please check your connection and try again.',
                'RAZORPAY_LOAD_FAILED'
            )
        }

    const paymentResponse =   await dispatch(createRazorpayOrder({amount: Number(amount || 0),currency:'INR',})).unwrap()
    const checkoutConfig =  getRazorpayCheckoutConfig( paymentResponse, amount)
    if (
        !checkoutConfig.key ||  !checkoutConfig.orderId
    ) {
        throw createPaymentFlowError(
            'Razorpay did not return a valid payment order.',
            'RAZORPAY_ORDER_FAILED',
            {
                paymentResponse,
            }
        )
    }

    return new Promise(
        (resolve, reject) => {
            let settled = false
            const resolveOnce = (value) => {
                 if (settled) return
                    settled = true
                    resolve(value)
                }

            const rejectOnce = (error) => {
                if (settled) return
                    settled = true
                    reject(error)
                }

            const options = {
                key: checkoutConfig.key,
                amount: checkoutConfig.amount,
                currency: checkoutConfig.currency,
                name: import.meta.env .VITE_STORE_NAME || 'Nilesh Kumar',
                description: 'Order Payment',
                order_id: checkoutConfig.orderId,
                prefill: {
                        name: customer?.name || '',
                        email: customer?.email || '',
                        contact: customer?.phone || '',
                },
                theme: {
                    color:'#111827',
                },

                handler:
                    async ( razorpayResponse) => {
                        try {
                           
                            console.log( 'Razorpay response:', razorpayResponse)
                            const paymentId = razorpayResponse?.razorpay_payment_id
                            const razorpayOrderId = razorpayResponse?.razorpay_order_id
                            const signature = razorpayResponse?.razorpay_signature
                            if (!paymentId || !razorpayOrderId || !signature
                            ) {
                                throw createPaymentFlowError(
                                    'Razorpay payment information is incomplete.',
                                    'PAYMENT_RESPONSE_INCOMPLETE',
                                    {
                                        razorpayResponse,
                                    }
                                )
                            }
                            const verifyResult =
                                await dispatch(
                                    verifyRazorpayPayment({
                                        razorpay_payment_id: paymentId,
                                        razorpay_order_id: razorpayOrderId,
                                        razorpay_signature: signature,
                                    })).unwrap()
                            console.log('Razorpay verification result:', verifyResult)

                            if (
                                !verifyResult || verifyResult.success !==  true || verifyResult.verified !== true
                            ) {
                                throw createPaymentFlowError(
                                    verifyResult ?.message || 'Razorpay payment verification failed.',
                                    'PAYMENT_VERIFICATION_FAILED', {
                                        verifyResult,
                                    }
                                )
                            }

                            resolveOnce({
                                success: true,
                                verified: true,
                                razorpayPaymentId: paymentId,
                                razorpayOrderId: razorpayOrderId,
                                razorpaySignature: signature,
                                paymentProvider: verifyResult.paymentProvider,
                                paymentType: verifyResult.paymentType,
                                razorpayMethod: verifyResult.razorpayMethod,
                                cardNetwork: verifyResult.cardNetwork,
                                cardType: verifyResult.cardType,
                                cardLast4: verifyResult.cardLast4,
                                cardIssuer: verifyResult.cardIssuer,
                                bankName: verifyResult.bankName,
                                verification: verifyResult,
                            })

                        } catch (error) {
                            console.error( 'Razorpay verification error:',  error)
                            rejectOnce( error?.code ? error : createPaymentFlowError(
                                        getErrorMessage(
                                            error, 'Payment verification failed.'
                                        ),
                                        'PAYMENT_VERIFICATION_FAILED',
                                        {
                                            originalError: error,
                                        }
                                    )
                            )
                        }
                    },

                modal: {
                    ondismiss:
                        () => {
                            rejectOnce(
                                createPaymentFlowError(
                                    'Payment was cancelled. No order was created.',
                                    'PAYMENT_CANCELLED'
                                )
                            )
                        },
                },
            }

            const razorpay = new window.Razorpay( options)
            razorpay.on( 'payment.failed',
                (response) => {
                    const reason = response ?.error ?.description || response ?.error ?.reason || 'Payment failed.'
                    rejectOnce(
                        createPaymentFlowError(
                            reason, 'PAYMENT_FAILED',
                            {
                                razorpayError: response?.error,
                            }
                        )
                    )
                }
            )
            razorpay.open()
        }
    )
    }

    const onSubmit = async (data) => {

        if (!selectedItems.length) {
            addToast('Please select at least one item before placing your order.','error')
            return
        }

        if (!API_URLS) {
            addToast('Order API is not configured.','error')
            return
        }

        const user =storedUser || {}
        const apiUserIdentifier = authContext.apiUserIdentifier
        if (!isAuthenticated) {
            addToast('Login required to place your order.','error')
            navigate('/login')
            return
        }

        const isRazorpay =  isRazorpayPaymentMethod( data.paymentMethod)
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

        if (
            !shippingAddress.firstName ||
            !shippingAddress.lastName ||
            !shippingAddress.address1 ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.country ||
            !shippingAddress.pincode
        ) {
            addToast( 'Please complete shipping address before placing the order.', 'error')
            return
        }

        const shippingAddressLine =[shippingAddress.address1, shippingAddress.address2,].filter(Boolean).join(', ')
        const shippingAddressComplete =
            `${shippingAddress.firstName} ${shippingAddress.lastName}, ` +
            `${shippingAddressLine}, ` +
            `${shippingAddress.city}, ` +
            `${shippingAddress.state}, ` +
            `${shippingAddress.country} - ` +
            `${shippingAddress.pincode}`

        const customerEmail = normalizeEmail( data.email || authContext.email || user?.email || '')
        const customerMobile =normalizeText( data.mobile || user?.mobile || user?.phone || '')
        const customerName = normalizeText( `${shippingAddress.firstName} ${shippingAddress.lastName}`)
        const orderLineItems = buildCheckoutItems(selectedItems)


        const payload = {
            email: customerEmail,
            customerEmail: customerEmail,
            userEmail: customerEmail,
            billingEmail: customerEmail,
            contact: {
                email: customerEmail,
                phone: customerMobile,
                mobile: customerMobile,
            },

            customer: {
                id: apiUserIdentifier || user?.id || user?._id ||'',
                _id: apiUserIdentifier || user?._id || user?.id || '',
                name: customerName || user?.name || '',
                fullName: customerName || user?.name || '',
                email: customerEmail,
                phone: customerMobile,
                mobile: customerMobile,
            },

            buyer: {
                id: apiUserIdentifier || user?.id || user?._id || '',
                _id: apiUserIdentifier || user?._id || user?.id || '',
                name: customerName || user?.name || '',
                fullName: customerName || user?.name || '',
                email: customerEmail,
                phone: customerMobile,
                mobile: customerMobile,
            },

            shippingAddress: {
                ...shippingAddress,
                fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
                name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
                email: customerEmail,
                phone: customerMobile,
                mobile: customerMobile,
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
                fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}` .trim(),
                email: customerEmail,
                phone: customerMobile,
                mobile: customerMobile,
                addressLine1: shippingAddress.address1,
                addressLine2: shippingAddress.address2,
                zipCode: shippingAddress.pincode,
                postalCode: shippingAddress.pincode,
                address: shippingAddressLine,
                completeAddress: shippingAddressComplete,
            },

            address: {
                ...shippingAddress,
                email: customerEmail,
                phone: customerMobile,
                mobile: customerMobile,
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
            shippingFee: Number(shipping || 0),
            total: Number(total || 0),
            totalAmount: Number(total || 0),
            totalPrice: Number(total || 0),
            grandTotal: Number(total || 0),
            amount: Number(total || 0),
            items: orderLineItems,
            orderItems: orderLineItems,
            cartItems: orderLineItems,
            products: orderLineItems,
        }

        if (apiUserIdentifier) {
            payload.userId = apiUserIdentifier
            payload.user = apiUserIdentifier
        }

        try {

            const headers = {
                'Content-Type':'application/json',
            }

            if (token) {
                headers.Authorization = `Bearer ${token}`
                headers['x-auth-token'] = token
                headers['x-access-token'] = token
            }

            if (customerEmail) {
                headers['x-user-email'] = customerEmail
            }

            if (isRazorpay) {
                console.log( 'Starting Razorpay without creating ecommerce order...')
                let paymentResult
                try {

                    paymentResult = await startRazorpayPayment({
                            amount: Number(total || 0),
                            customer: {
                                name: customerName || user?.name ||'',
                                email: customerEmail,
                                phone: customerMobile,
                            },
                        })

                } catch (paymentError) {

                    console.error( 'Razorpay error:', paymentError)
                    if (paymentError?.code === 'PAYMENT_CANCELLED') {
                        addToast('Payment cancelled. No order was created.', 'error')
                        return
                    }

                    if (paymentError?.code ==='PAYMENT_FAILED') {
                        addToast( paymentError?.message || 'Payment failed. No order was created.', 'error' )
                        return
                    }

                    if (paymentError?.code === 'PAYMENT_VERIFICATION_FAILED') {
                        addToast( 'Payment could not be verified. No order was created.', 'error')
                        return
                    }

                    throw paymentError
                }


                if (!paymentResult || paymentResult.success !== true || paymentResult.verified !== true) {
                    addToast( 'Payment was not verified. No order was created.',  'error' )
                    return
                }


                const finalPayload = {
                         ...payload,
                        paymentMethod: "RAZORPAY",
                        paymentStatus: "PAID",
                        orderStatus: "CONFIRMED",
                        paymentProvider: paymentResult.paymentProvider || "Razorpay",
                        paymentType: paymentResult.paymentType || "Unknown",
                        razorpayMethod: paymentResult.razorpayMethod || null,

                        cardNetwork: paymentResult.cardNetwork || null,
                        cardType: paymentResult.cardType || null,
                        cardLast4: paymentResult.cardLast4 || null,
                        cardIssuer: paymentResult.cardIssuer || null,

                        bankName: paymentResult.bankName || null,

                        razorpayOrderId: paymentResult.razorpayOrderId,
                        razorpayPaymentId: paymentResult.razorpayPaymentId,
                        razorpaySignature: paymentResult.razorpaySignature,

                        razorpay_order_id: paymentResult.razorpayOrderId,
                        razorpay_payment_id: paymentResult.razorpayPaymentId,
                        razorpay_signature: paymentResult.razorpaySignature,

                        sendEmail: true,
                        sendConfirmationEmail: true,
                        notifyCustomer: true,
                    }

                if (!finalPayload.razorpayOrderId || !finalPayload.razorpayPaymentId || !finalPayload.razorpaySignature) {
                    throw createPaymentFlowError(
                        'Payment was verified, but Razorpay payment details are missing from the order payload.',
                        'PAYMENT_DATA_MISSING',
                        { paymentResult }
                    )
                }

                console.log('Creating MongoDB order AFTER verified payment:', finalPayload )
                const endpoint = `${API_URLS}/api/orders`
                const response = await fetch(endpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers,
                    body: JSON.stringify(finalPayload),
                })
                const text = await response.text();
                  if (!response.ok) {
                    throw new Error( text || `Payment was successful but the order could not be created (${response.status}).`)
                }

                let createdOrder = null
                try {
                    createdOrder = text ? JSON.parse(text) : null
                } catch (parseError) {
                    console.error('Unable to parse order creation response:', parseError)
                    throw new Error('Payment was successful, but the order API returned an invalid response.')
                }

                const createdOrderId = getCreatedOrderId(createdOrder, response)
                const createdOrderNumber = getCreatedOrderNumber(createdOrder, createdOrderId)
                const mongoOrderId = createdOrderId || createdOrder?.order?._id || createdOrder?.order?.id || ''

                if (!mongoOrderId) {
                    throw new Error(
                        'Payment was successful but the new order ID was not returned.'
                    )
                }

                if (!createdOrderId) {
                    throw new Error(
                        'Payment was successful but the new order ID was not returned.'
                    )
                }

                dispatch(removeSelectedItems())
                addToast('Payment successful. Order placed successfully!','success')
                navigate( `/dashboard/order/${createdOrderId}`,
                    {
                        state: {
                            orderId:mongoOrderId,
                            orderNumber: createdOrderNumber || mongoOrderId,
                            order: createdOrder,
                            paymentStatus: 'PAID',
                            orderStatus: 'CONFIRMED',
                            paymentMethod: 'RAZORPAY',
                        },
                    }
                )

                return
            }

            const normalPayload = {
                ...payload,
                paymentStatus: 'PENDING',
                orderStatus: 'PENDING',
                sendEmail: true,
                sendConfirmationEmail: true,
                notifyCustomer: true,
            }

            const endpoint = `${API_URLS}/api/orders`
            const response = await fetch( endpoint,
                    {
                        method: 'POST',
                        credentials: 'include', headers,
                        body:JSON.stringify( normalPayload),
                    }
                )
            const normalResponseText = await response.text()
            if (!response.ok) {
                throw new Error( normalResponseText ||`Order creation failed (${response.status})`)
            }

            let createdOrder = null
            try {
                createdOrder = normalResponseText ? JSON.parse(normalResponseText) : null
            } catch (parseError) {
                console.error('Unable to parse normal order response:', parseError)
                throw new Error('Order API returned an invalid response.')
            }

            const createdOrderId =getCreatedOrderId( createdOrder, response )

            if (!createdOrderId) {
                throw new Error( 'Order ID was not returned.')
            }

            dispatch(removeSelectedItems())
            addToast( 'Order placed successfully!','success')
            navigate(
                `/dashboard/order/${createdOrderId}`,
                {
                    state: {
                        orderId:createdOrderId,
                        order: createdOrder,
                        paymentStatus: 'PENDING',
                        orderStatus: 'PENDING',
                        paymentMethod: data.paymentMethod,
                    },
                }
            )

        } catch (error) {

            console.error( 'Checkout error:', error)
            addToast(getErrorMessage( error,  'Unable to place order.' ),'error' )
        }
    }

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
                    <div className="mx-auto px-6">
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

                                    <CheckoutOrderSummary
                                        hasSelectedItems={selectedItems.length > 0}
                                        isSubmitting={isSubmitting}
                                        submitLabel={isRazorpaySelected ? 'Pay with Razorpay' : 'Place Order'}
                                        submittingLabel={isRazorpaySelected ? 'Processing Payment...' : 'Placing Order...'}
                                    />
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