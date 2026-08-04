const CouponForm = ({ couponInput, setCouponInput, onApply, couponMessage, couponApplied }) => {
  return (
    <div className="rounded-[10px] border border-[#e9e2d9] bg-[#fffdfa] p-5 shadow-sm mb-3">
      <p className="text-sm font-semibold text-[#1c1c1c]">Have a promo code?</p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onApply()
        }}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={couponInput}
          onChange={(event) => setCouponInput(event.target.value)}
          placeholder="Enter code"
          className="flex-1 rounded-3xl border border-[#e9e2d9] bg-white px-4 py-3 text-sm text-[#1c1c1c] outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-[#1aa184] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#168864]"
        >
          Apply
        </button>
      </form>
      {couponMessage && (
        <p className={`mt-3 text-sm ${couponApplied ? 'text-emerald-600' : 'text-red-600'}`}>
          {couponMessage}
        </p>
      )}
    </div>
  )
}

export default CouponForm
