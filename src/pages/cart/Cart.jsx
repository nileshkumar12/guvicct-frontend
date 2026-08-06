import React from "react";
import { useDispatch, useSelector } from "react-redux";

import CartItem from "./CartItem";
import CouponForm from "./CouponForm";
import OrderSummary from "./OrderSummary";

import {
  selectCartItems,
  selectCheckedCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectShipping,
  selectCartTotal,
  selectCartCoupon,
  toggleItemSelection,
  toggleAllSelections,
  updateQuantity,
  removeItem,
  clearCart,
} from "../../store/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const checkedItems = useSelector(selectCheckedCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const shipping = useSelector(selectShipping);
  const total = useSelector(selectCartTotal);
  const coupon = useSelector(selectCartCoupon);
  const allSelected = items.length > 0 && checkedItems.length === items.length;

  const handleQuantityChange = (key, quantity) => {
    if (Number(quantity) <= 0) {
      dispatch(removeItem(key));
      return;
    }

    dispatch(updateQuantity({ key, quantity }));
  };

  const handleRemove = (key) => {
    dispatch(removeItem(key));
  };

  const handleSelectionChange = (key, isSelected) => {
    dispatch(toggleItemSelection({ key, isSelected }));
  };

  const handleToggleAll = (event) => {
    dispatch(toggleAllSelections(event.target.checked));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="py-5 text-4xl font-bold">
          Cart Items
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Side */}
          <div className="lg:col-span-7 space-y-6">
            {items.length > 0 ? (
              <>
                <label className="flex items-center gap-3 rounded-xl border border-[#e9e2d9] bg-white px-4 py-3 text-sm font-medium text-[#1c1c1c] shadow-sm">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleAll}
                    className="h-4 w-4 accent-[#1aa184]"
                  />
                  Select all products for checkout
                </label>

                {items.map((item) => (
                  <CartItem
                    key={item.key}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                    onSelectionChange={handleSelectionChange}
                  />
                ))}
              </>
            ) : (
              <div className="rounded-xl border p-10 text-center">
                <h3 className="text-2xl font-semibold">
                  Your cart is empty
                </h3>
                <p className="mt-2 text-gray-500">
                  Add some products to continue shopping.
                </p>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="lg:col-span-5 space-y-6">
            <CouponForm />

            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              coupon={coupon}
              onClearCart={handleClearCart}
              hasItems={checkedItems.length > 0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;