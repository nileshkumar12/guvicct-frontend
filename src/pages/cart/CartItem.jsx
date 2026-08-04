import { Minus, Plus, Trash2 } from 'lucide-react'
import { useSelector } from "react-redux";


const CartItem = ({ item, onQuantityChange, onRemove }) => {
   
 const itemTotal = item.price * item.quantity

  return (
    <>
    <div className="rounded-[10px] border border-[#e9e2d9] bg-white p-5 shadow-sm mb-3">
      <div className="grid gap-4 md:grid-cols-[120px_1fr_auto]">
        <div className="overflow-hidden rounded-[10px] ">
          <img
            src={item.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={item.title}
            className="h-32 w-full object-cover"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-[#1c1c1c]">{item.title}</h3>
            <p className="text-sm text-[#5d4e3f]">{item.brand || 'ShopKart'}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-[#5d4e3f]">
            {item.selectedSize && (
              <span className="rounded-full border border-[#e9e2d9] bg-[#f8f5ef] px-3 py-1">
                {item.selectedSize}
              </span>
            )}
            {item.selectedFinish && (
              <span className="rounded-full border border-[#e9e2d9] bg-[#f8f5ef] px-3 py-1">
                {item.selectedFinish}
              </span>
            )}
          </div>

          <p className="text-sm text-[#5d4e3f]">{item.stock && item.stock !== Infinity ? `${item.stock} available` : 'In stock'}</p>
        </div>

        <div className="flex flex-col items-start justify-between gap-4">
          <div className="flex items-center overflow-hidden rounded-full border border-[#e9e2d9] bg-[#fcfbf8]">
            <button
              type="button"
               onClick={() => onQuantityChange(item.key, item.quantity - 1)}
              className="px-4 py-3 text-[#5d4e3f] transition hover:bg-[#f4f4f1]"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-sm font-semibold text-[#1c1c1c]">{item.quantity}</span>
            <button
              type="button"
               onClick={() => onQuantityChange(item.key, item.quantity + 1)}
              className="px-4 py-3 text-[#5d4e3f] transition hover:bg-[#f4f4f1]"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-2 text-right">
            <p className="text-lg font-semibold text-[#1c1c1c]">₹{item.price.toFixed(2)}</p>
            <p className="text-sm text-[#5d4e3f]">₹{itemTotal.toFixed(2)} total</p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.key)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#c24747] transition hover:bg-[#feeaea]"
          >
            <Trash2 size={16} /> Remove
          </button>
        </div>
      </div>
    </div>

    </>

  )
}

export default CartItem
