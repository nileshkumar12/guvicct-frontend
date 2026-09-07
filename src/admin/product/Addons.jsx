import React from "react";
const Addons = ({ value = [], onChange }) => {
  const addAddon = () => {
    onChange([
      ...value,
      {
        name: "",
        description: "",
        price: "",
        image: "",
        isRequired: false,
        maxQuantity: 1,
        status: "active",
      },
    ]);
  };

  const updateAddon = (index, field, newValue) => {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      [field]: newValue,
    };

    onChange(updated);
  };

  const removeAddon = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Product Add-ons
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Add optional extras that customers can purchase with this product.
          </p>
        </div>

        <button
          type="button"
          onClick={addAddon}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          Add Add-on
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        {/* Empty State */}
        {value.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-xl font-medium text-indigo-600">
              +
            </div>

            <h4 className="text-sm font-semibold text-gray-800">
              No add-ons added
            </h4>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-gray-500">
              Add extras such as gift wrapping, greeting cards, candles,
              premium packaging or accessories.
            </p>

            <button
              type="button"
              onClick={addAddon}
              className="mt-4 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
            >
              Add your first add-on
            </button>
          </div>
        ) : (
          value.map((addon, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-gray-50/60 p-4"
            >
              {/* Card Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                    {index + 1}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Add-on {index + 1}
                    </p>

                    <p className="text-[11px] text-gray-500">
                      Optional product extra
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeAddon(index)}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Add-on Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) =>
                      updateAddon(index, "name", e.target.value)
                    }
                    placeholder="e.g. Gift Wrap"
                    className={inputClass}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={addon.price}
                      onChange={(e) =>
                        updateAddon(index, "price", e.target.value)
                      }
                      placeholder="49"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    rows={2}
                    value={addon.description}
                    onChange={(e) =>
                      updateAddon(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Short description shown to customers"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                   {/* Required */}
                <div className="flex items-end">
                  <label className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Required add-on
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-500">
                        Customer must select this add-on.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={addon.isRequired}
                      onChange={(e) =>
                        updateAddon(
                          index,
                          "isRequired",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>

                {/* Max Quantity */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Maximum Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={addon.maxQuantity}
                    onChange={(e) =>
                      updateAddon(
                        index,
                        "maxQuantity",
                        Math.max(
                          1,
                          Number(e.target.value) || 1
                        )
                      )
                    }
                    className={inputClass}
                  />

                  <p className="mt-1 text-[11px] text-gray-500">
                    Maximum quantity a customer can select.
                  </p>
                </div>

             

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Status
                  </label>

                  <select
                    value={addon.status}
                    onChange={(e) =>
                      updateAddon(
                        index,
                        "status",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Addons;

