import { useState, useEffect } from "react";
import React from "react";
import {API_URL} from "../../utils/config";

const ReviewForm = ({ productId,  onReviewCreated,  onCancel,}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        title: "",
        comment: "",
    });

    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [canReview, setCanReview] = useState(false);
    const [checkingReviewAccess, setCheckingReviewAccess] = useState(false);

  
    const getStoredUser = () => {
        try {
            const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed?.user || parsed?.userData || parsed || null;
        } catch (error) {
            return null;
        }
    };

    const getAuthToken = () => {
        const candidates = [
            localStorage.getItem("token"),
            localStorage.getItem("accessToken"),
            localStorage.getItem("authToken"),
            localStorage.getItem("jwt"),
            sessionStorage.getItem("token"),
            sessionStorage.getItem("accessToken"),
            sessionStorage.getItem("authToken"),
            sessionStorage.getItem("jwt"),
        ];

        for (const candidate of candidates) {
            if (typeof candidate === "string" && candidate.trim()) {
                return candidate.trim().replace(/^Bearer\s+/i, "");
            }
        }

        const user = getStoredUser();
        const token = user?.token || user?.accessToken || user?.authToken || user?.jwt;
        if (typeof token === "string" && token.trim()) {
            return token.trim().replace(/^Bearer\s+/i, "");
        }

        return "";
    };

    const getOrderArrays = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return [value];
        if (typeof value !== "object") return [];

        const result = [];
        const keys = ["orders", "items", "data", "result", "payload"];

        keys.forEach((key) => {
            const next = value[key];
            if (Array.isArray(next)) {
                result.push(next);
                return;
            }
            if (next && typeof next === "object") {
                result.push(...getOrderArrays(next));
            }
        });

        return result;
    };

    const checkProductReviewEligibility = async () => {
        const token = getAuthToken();
        const user = getStoredUser() || {};
        const userId = user?.id || user?._id || user?.userId || user?.sub || "";

        if (!token) {
            setCanReview(false);
            setError("Please login to write a review.");
            return false;
        }

        if (!productId) {
            setCanReview(false);
            setError("Product is missing for this review.");
            return false;
        }

        setCheckingReviewAccess(true);

        try {
            const query = userId ? `?user=${encodeURIComponent(userId)}` : "";
            const response = await fetch(`${API_URL}/api/orders${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "x-auth-token": token,
                    "x-access-token": token,
                },
            });

            const allowedStatuses = new Set([
                "delivered",
                "completed",
                "received",
                "success",
                "confirmed",
                "shipped",
                "processing",
                "paid",
            ]);
            const blockedStatuses = new Set([
                "cancelled",
                "canceled",
                "failed",
                "refunded",
                "returned",
                "rejected",
            ]);

            const payload = response.ok ? await response.json() : null;
            const orderArrays = getOrderArrays(payload);

            const eligible = orderArrays.some((orderList) =>
                Array.isArray(orderList) && orderList.some((order) => {
                    const status = `${order?.status || order?.orderStatus || order?.order_state || ""}`.trim().toLowerCase();
                    if (blockedStatuses.has(status)) return false;

                    if (!allowedStatuses.has(status) && status) {
                        const legacyStatus = status.replace(/[_\s-]+/g, "").toLowerCase();
                        if (legacyStatus.includes("cancel") || legacyStatus.includes("refund") || legacyStatus.includes("return")) {
                            return false;
                        }
                    }

                    const items = Array.isArray(order?.items)
                        ? order.items
                        : Array.isArray(order?.orderItems)
                            ? order.orderItems
                            : Array.isArray(order?.products)
                                ? order.products
                                : [];

                    return items.some((item) => {
                        const candidates = [
                            item?.product?._id,
                            item?.productId,
                            item?._id,
                            item?.id,
                            item?.product,
                            item?.productId?._id,
                            item?.productId?.id,
                        ];
                        return candidates.some((value) => String(value || "") === String(productId));
                    });
                })
            );

            if (response.ok && !eligible) {
                setCanReview(false);
                setError("You can review this product only after receiving it.");
                return false;
            }

            if (!response.ok && !payload) {
                setCanReview(true);
                setError("");
                return true;
            }

            setCanReview(Boolean(eligible) || response.ok);
            if (!eligible && response.ok) {
                setError("You can review this product only after receiving it.");
            } else {
                setError("");
            }
            return Boolean(eligible) || response.ok;
        } catch (fetchError) {
            setCanReview(true);
            setError("");
            return true;
        } finally {
            setCheckingReviewAccess(false);
        }
    };
    useEffect(() => {
        let active = true;

        const validateAccess = async () => {
            const eligible = await checkProductReviewEligibility();
            if (!active) return;
            if (!eligible) {
                setSuccess("");
            }
        };

        if (productId) {
            void validateAccess();
        } else {
            setCanReview(false);
            setError("Product is missing for this review.");
        }

        return () => {
            active = false;
        };
    }, [productId]);

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);

        // Limit to 5 images
        const selectedFiles = files.slice(0, 5);

        setImages(selectedFiles);
    };

    // Remove selected image
    const removeImage = (index) => {
        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // Submit review
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!rating) {
            setError("Please select a rating.");
            return;
        }

        if (!formData.title.trim()) {
            setError("Please enter a review title.");
            return;
        }

        if (!formData.comment.trim()) {
            setError("Please write your review.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            const token = getAuthToken();

            if (!token) {
                setError("Please login to write a review.");
                return;
            }

            const eligible = await checkProductReviewEligibility();
            if (!eligible) {
                setError("You can review this product only after receiving it.");
                return;
            }

            const user = getStoredUser() || {};
            const userId = user?.id || user?._id || user?.userId || user?.sub || "";

            const response = await fetch(
                `${API_URL}/api/products/${productId}/reviews`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "x-auth-token": token,
                        "x-access-token": token,
                    },

                    body: JSON.stringify({
                        product: productId,
                        productId,
                        user: userId,
                        userId,
                        rating,
                        title: formData.title.trim(),
                        comment: formData.comment.trim(),
                        name: user?.name || user?.fullName || user?.username || "Customer",
                        images: [],
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to submit review."
                );
            }

            setSuccess(
                "Your review has been submitted successfully."
            );

            // Reset form
            setRating(0);
            setHoverRating(0);

            setFormData({
                title: "",
                comment: "",
            });

            setImages([]);

            // Notify parent
            if (onReviewCreated) {
                onReviewCreated(data.review);
            }
        } catch (error) {
            console.error(
                "Submit review error:",
                error
            );

            setError(
                error.message ||
                "Unable to submit review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between gap-4">

                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Write a Review
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Share your experience with this product.
                        </p>
                    </div>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-700
                         text-2xl leading-none"
                        >
                            ×
                        </button>
                    )}

                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6"
            >

                {/* Error */}
                {error && (
                    <div
                        className="rounded-lg border border-red-200
                       bg-red-50 px-4 py-3
                       text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div
                        className="rounded-lg border border-green-200
                       bg-green-50 px-4 py-3
                       text-sm text-green-700"
                    >
                        {success}
                    </div>
                )}

                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                        Your Rating
                    </label>

                    <div className="flex items-center gap-2">

                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() =>
                                    setHoverRating(star)
                                }
                                onMouseLeave={() =>
                                    setHoverRating(0)
                                }
                                className="text-3xl transition-transform
                           hover:scale-110 focus:outline-none"
                                aria-label={`Rate ${star} out of 5`}
                            >
                                <span
                                    className={
                                        star <=
                                            (hoverRating || rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }
                                >
                                    ★
                                </span>
                            </button>
                        ))}

                        {rating > 0 && (
                            <span className="ml-2 text-sm text-gray-600">
                                {rating}/5
                            </span>
                        )}

                    </div>
                </div>

                {/* Review Title */}
                <div>
                    <label
                        htmlFor="review-title"
                        className="block text-sm font-medium
                       text-gray-900 mb-2"
                    >
                        Review Title
                    </label>

                    <input
                        id="review-title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={150}
                        placeholder="Example: Excellent product quality"
                        className="w-full rounded-lg border
                       border-gray-300 px-4 py-3
                       text-sm outline-none
                       transition
                       focus:border-black
                       focus:ring-2
                       focus:ring-gray-200"
                    />

                    <div className="flex justify-end mt-1">
                        <span className="text-xs text-gray-400">
                            {formData.title.length}/150
                        </span>
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label
                        htmlFor="review-comment"
                        className="block text-sm font-medium
                       text-gray-900 mb-2"
                    >
                        Your Review
                    </label>

                    <textarea
                        id="review-comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        rows={5}
                        maxLength={2000}
                        placeholder="Tell other customers about your experience..."
                        className="w-full rounded-lg border
                       border-gray-300 px-4 py-3
                       text-sm outline-none resize-none
                       transition
                       focus:border-black
                       focus:ring-2
                       focus:ring-gray-200"
                    />

                    <div className="flex justify-end mt-1">
                        <span className="text-xs text-gray-400">
                            {formData.comment.length}/2000
                        </span>
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label
                        htmlFor="review-images"
                        className="block text-sm font-medium
                       text-gray-900 mb-2"
                    >
                        Add Photos
                        <span className="font-normal text-gray-500">
                            {" "}
                            (Optional)
                        </span>
                    </label>

                    <label
                        htmlFor="review-images"
                        className="flex items-center justify-center
                       w-full h-28 border-2
                       border-dashed border-gray-300
                       rounded-xl cursor-pointer
                       hover:border-gray-500
                       hover:bg-gray-50 transition"
                    >
                        <div className="text-center">
                            <div className="text-2xl mb-1">
                                📷
                            </div>

                            <p className="text-sm text-gray-600">
                                Click to upload photos
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Maximum 5 images
                            </p>
                        </div>

                        <input
                            id="review-images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>

                    {/* Selected images */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5
                            gap-3 mt-4">

                            {images.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="relative group"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Review ${index + 1}`}
                                        className="w-full h-20 object-cover
                               rounded-lg border"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeImage(index)
                                        }
                                        className="absolute top-1 right-1
                               w-6 h-6 rounded-full
                               bg-black/70 text-white
                               text-sm opacity-0
                               group-hover:opacity-100
                               transition"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                {/* Verified purchase note */}
                <div
                    className="flex gap-3 p-4 rounded-lg
                     bg-gray-50 border border-gray-200"
                >
                    <span className="text-green-600">
                        ✓
                    </span>

                    <div>
                        <p className="text-sm font-medium text-gray-800">
                            Verified Purchase
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            Reviews are available to customers
                            who have purchased and received this
                            product.
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row
                        gap-3 pt-2">

                    <button
                        type="submit"
                        disabled={submitting || checkingReviewAccess || !canReview}
                        className="w-full sm:w-auto
                       px-6 py-3 rounded-lg
                       bg-black text-white
                       font-medium
                       hover:bg-gray-800
                       disabled:opacity-50
                       disabled:cursor-not-allowed
                       transition"
                    >
                        {checkingReviewAccess
                            ? "Checking eligibility..."
                            : submitting
                                ? "Submitting..."
                                : "Submit Review"}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting || checkingReviewAccess}
                            className="w-full sm:w-auto
                         px-6 py-3 rounded-lg
                         border border-gray-300
                         text-gray-700 font-medium
                         hover:bg-gray-50
                         disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}

                </div>

                {!canReview && !checkingReviewAccess && (
                    <p className="text-sm text-red-600">
                        You can review this product only after receiving it.
                    </p>
                )}

            </form>
        </div>
    );
};

export default ReviewForm;