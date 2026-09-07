
import React from "react";

const Specifications = ({ value = [], onChange }) => {
  const addSpecification = () => {
    onChange([
      ...value,
      {
        name: "",
        value: "",
        unit: "",
      },
    ]);
  };

  const updateSpecification = (index, field, newValue) => {
    const updated = [...value];

    updated[index] = {
      ...updated[index],
      [field]: newValue,
    };

    onChange(updated);
  };

  const removeSpecification = (index) => {
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
            Product Specifications
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Add product details such as material, weight, dimensions and warranty.
          </p>
        </div>

        <button
          type="button"
          onClick={addSpecification}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          Add Specification
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Empty State */}
        {value.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-xl font-medium text-indigo-600">
              +
            </div>

            <h4 className="text-sm font-semibold text-gray-800">
              No specifications added
            </h4>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-gray-500">
              Add important product information such as material, weight,
              dimensions, warranty and country of origin.
            </p>

            <button
              type="button"
              onClick={addSpecification}
              className="mt-4 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
            >
              Add your first specification
            </button>
          </div>
        ) : (
          <>
            {/* Desktop headings */}
            <div className="mb-2 hidden grid-cols-12 gap-3 px-1 md:grid">
              <div className="col-span-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Specification
                </p>
              </div>

              <div className="col-span-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Value
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Unit
                </p>
              </div>

              <div className="col-span-1" />
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {value.map((specification, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 md:grid-cols-12 md:items-center md:bg-white"
                >
                  {/* Name */}
                  <div className="md:col-span-4">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600 md:hidden">
                      Specification
                    </label>

                    <input
                      type="text"
                      value={specification.name}
                      onChange={(e) =>
                        updateSpecification(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Material"
                      className={inputClass}
                    />
                  </div>

                  {/* Value */}
                  <div className="md:col-span-5">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600 md:hidden">
                      Value
                    </label>

                    <input
                      type="text"
                      value={specification.value}
                      onChange={(e) =>
                        updateSpecification(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Stainless Steel"
                      className={inputClass}
                    />
                  </div>

                  {/* Unit */}
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600 md:hidden">
                      Unit
                    </label>

                    <input
                      type="text"
                      value={specification.unit}
                      onChange={(e) =>
                        updateSpecification(
                          index,
                          "unit",
                          e.target.value
                        )
                      }
                      placeholder="e.g. kg"
                      className={inputClass}
                    />
                  </div>

                  {/* Remove */}
                  <div className="flex justify-end md:col-span-1">
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      title="Remove specification"
                      aria-label={`Remove specification ${index + 1}`}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.8"
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 7h12M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-7 0 .7 12.1A2 2 0 0 0 10.7 21h2.6a2 2 0 0 0 2-1.9L16 7M10 11v6m4-6v6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add */}
            <button
              type="button"
              onClick={addSpecification}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <span className="text-base leading-none">+</span>
              Add another specification
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default Specifications;

