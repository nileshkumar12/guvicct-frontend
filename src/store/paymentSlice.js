import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit'

import { API_URLS } from '../utils/config'


const getToken = () => {

    if (
        typeof window ===
        'undefined'
    ) {
        return ''
    }

    return (
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken') ||
        ''
    )
}


/*
|--------------------------------------------------------------------------
| Create Razorpay order
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This does NOT create your MongoDB ecommerce order.
|
*/

export const createRazorpayOrder =
    createAsyncThunk(
        'payment/createRazorpayOrder',

        async (
            {
                amount,
                currency = 'INR',
            },
            thunkAPI
        ) => {

            try {

                const token =
                    getToken()

                const response =
                    await fetch(
                        `${API_URLS}/api/payment/create-order`,
                        {
                            method:
                                'POST',

                            credentials:
                                'include',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                ...(token
                                    ? {
                                          Authorization:
                                              `Bearer ${token}`,
                                      }
                                    : {}),
                            },

                            body:
                                JSON.stringify({
                                    amount:
                                        Number(
                                            amount
                                        ),

                                    currency,
                                }),
                        }
                    )

                const text =
                    await response.text()

                let data = null

                try {
                    data =
                        JSON.parse(text)
                } catch {
                    data = {
                        message:
                            text,
                    }
                }

                if (!response.ok) {

                    return thunkAPI.rejectWithValue(
                        data?.message ||
                        'Unable to create Razorpay order.'
                    )
                }

                return data

            } catch (error) {

                return thunkAPI.rejectWithValue(
                    error.message ||
                    'Unable to create Razorpay order.'
                )
            }
        }
    )


/*
|--------------------------------------------------------------------------
| Verify Razorpay payment
|--------------------------------------------------------------------------
*/

export const verifyRazorpayPayment =
    createAsyncThunk(
        'payment/verifyRazorpayPayment',

        async (
            {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
            },
            thunkAPI
        ) => {

            try {

                /*
                 * NEVER send null values.
                 */

                if (
                    !razorpay_payment_id ||
                    !razorpay_order_id ||
                    !razorpay_signature
                ) {

                    return thunkAPI.rejectWithValue(
                        'Razorpay payment information is incomplete.'
                    )
                }

                const token =
                    getToken()

                const response =
                    await fetch(
                        `${API_URLS}/api/payment/verify`,
                        {
                            method:
                                'POST',

                            credentials:
                                'include',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                ...(token
                                    ? {
                                          Authorization:
                                              `Bearer ${token}`,
                                      }
                                    : {}),
                            },

                            body:
                                JSON.stringify({
                                    razorpay_payment_id,

                                    razorpay_order_id,

                                    razorpay_signature,
                                }),
                        }
                    )

                const text =
                    await response.text()

                let data

                try {
                    data =
                        JSON.parse(text)
                } catch {
                    data = {
                        message:
                            text,
                    }
                }

                if (!response.ok) {

                    return thunkAPI.rejectWithValue(
                        data?.message ||
                        'Razorpay verification failed.'
                    )
                }

                if (
                    data?.success !==
                        true ||
                    data?.verified !==
                        true
                ) {

                    return thunkAPI.rejectWithValue(
                        data?.message ||
                        'Razorpay payment was not verified.'
                    )
                }

                return data

            } catch (error) {

                return thunkAPI.rejectWithValue(
                    error.message ||
                    'Razorpay verification failed.'
                )
            }
        }
    )


const initialState = {
    loading: false,
    verifying: false,
    success: false,
    verified: false,
    error: null,
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
}


const paymentSlice =
    createSlice({

        name:
            'payment',

        initialState,

        reducers: {

            resetPayment: () =>
                initialState,
        },

        extraReducers:
            (builder) => {

                builder

                    /*
                     * Create Razorpay order
                     */

                    .addCase(
                        createRazorpayOrder.pending,
                        (state) => {

                            state.loading =
                                true

                            state.error =
                                null

                            state.success =
                                false

                            state.verified =
                                false
                        }
                    )

                    .addCase(
                        createRazorpayOrder.fulfilled,
                        (state, action) => {

                            state.loading =
                                false

                            state.error =
                                null

                            const data =
                                action.payload

                            const order =
                                data?.order ||
                                data?.razorpayOrder ||
                                data?.data?.order ||
                                data?.data ||
                                data

                            state.razorpayOrderId =
                                order?.id ||
                                order?.orderId ||
                                order?.razorpayOrderId ||
                                null
                        }
                    )

                    .addCase(
                        createRazorpayOrder.rejected,
                        (state, action) => {

                            state.loading =
                                false

                            state.error =
                                action.payload ||
                                action.error
                                    ?.message ||
                                'Unable to create Razorpay order.'
                        }
                    )

                    /*
                     * Verify
                     */

                    .addCase(
                        verifyRazorpayPayment.pending,
                        (state) => {

                            state.verifying =
                                true

                            state.error =
                                null
                        }
                    )

                    .addCase(
                        verifyRazorpayPayment.fulfilled,
                        (state, action) => {

                            state.verifying =
                                false

                            state.success =
                                true

                            state.verified =
                                true

                            const data =
                                action.payload

                            state.razorpayOrderId =
                                data?.razorpay_order_id ||
                                data?.razorpayOrderId ||
                                state.razorpayOrderId

                            state.razorpayPaymentId =
                                data?.razorpay_payment_id ||
                                data?.razorpayPaymentId ||
                                null

                            state.razorpaySignature =
                                data?.razorpay_signature ||
                                data?.razorpaySignature ||
                                null
                        }
                    )

                    .addCase(
                        verifyRazorpayPayment.rejected,
                        (state, action) => {

                            state.verifying =
                                false

                            state.success =
                                false

                            state.verified =
                                false

                            state.error =
                                action.payload ||
                                action.error
                                    ?.message ||
                                'Payment verification failed.'
                        }
                    )
            },
    })


export const {
    resetPayment,
} = paymentSlice.actions


export default paymentSlice.reducer