import React, { useEffect, useMemo, useState } from "react";
import { uploadImageToCloudinary } from "../../utils/config.js";

const initialVariants = [];
const initialAttributes = [];

const colorMap = {
    Red: "bg-red-500",
    Blue: "bg-blue-600",
    Black: "bg-black",
    Green: "bg-emerald-500",
    White: "bg-white border border-slate-300",
    Yellow: "bg-yellow-400",
};

const emptyForm = {
    attributes: {
        Color: "",
        Size: "",
    },
    sku: "",
    price: "",
    stock: "",
    image: "",
    images: [],
    status: "active",
};

const cleanVariantImages = (variant) => {
    const images = (variant.images || []).filter(
        (image) => typeof image === "string" && image.trim()
    );
    const image = typeof variant.image === "string" && variant.image.trim() ? variant.image : undefined;
    return {
        ...variant,
        ...(image ? { image } : {}),
        ...(images.length ? { images } : {}),
        ...(!image ? { image: undefined } : {}),
        ...(!images.length ? { images: undefined } : {}),
    };
};

const getVariantIdentity = (variant = {}) => variant._id || variant.id || variant.sku || "";

const getAttributeCombinationKey = (attributes = {}) =>
    Object.entries(attributes)
        .filter(([, value]) => value)
        .map(([name, value]) => `${name.trim().toLowerCase()}:${String(value).trim().toLowerCase()}`)
        .sort()
        .join("|");

const buildAttributeCombinations = (attributes) =>
    attributes.reduce(
        (combinations, attribute) =>
            combinations.flatMap((combination) =>
                attribute.values.map((value) => ({
                    ...combination,
                    [attribute.name]: value,
                }))
            ),
        [{}]
    );

export default function Variants({ value = initialVariants, onChange }) {
    const variants = Array.isArray(value) ? value : initialVariants;
    const [attributes, setAttributes] = useState(
        initialAttributes
    );
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showDrawer, setShowDrawer] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [selected, setSelected] = useState([]);
    const [showAddValue, setShowAddValue] = useState(null);
    const [newValue, setNewValue] = useState("");

    useEffect(() => {
        if (!variants.length) return;
        const attributeValues = new Map();
        variants.forEach((variant) => {
            Object.entries(variant.attributes || {}).forEach(([name, value]) => {
                if (!value) return;
                const normalizedName =
                    name.charAt(0).toUpperCase() + name.slice(1);
                const values = attributeValues.get(normalizedName) || new Set();
                values.add(value);
                attributeValues.set(normalizedName, values);
            });
        });

        if (!attributeValues.size) return;

        setAttributes((current) => {
            const next = current.map((attribute) => ({ ...attribute, values: [...attribute.values] }));
            attributeValues.forEach((values, name) => {
                const currentAttribute = next.find(
                    (attribute) => attribute.name.toLowerCase() === name.toLowerCase()
                );
                if (currentAttribute) {
                    currentAttribute.values = Array.from(new Set([...currentAttribute.values, ...values]));
                } else {
                    next.push({ name, values: Array.from(values) });
                }
            });

            const unchanged = next.length === current.length && next.every((attribute, index) =>
                attribute.name === current[index].name &&
                attribute.values.length === current[index].values.length &&
                attribute.values.every((value, valueIndex) => value === current[index].values[valueIndex])
            );
            return unchanged ? current : next;
        });
    }, [variants]);

    const commitVariants = (update) => {
        const next = typeof update === "function" ? update(variants) : update;
        onChange?.(next);
    };

    const generateVariantCombinations = () => {
        const attributesWithValues = attributes.filter((attribute) => attribute.values.length > 0);
        if (!attributesWithValues.length) return;

        const combinations = buildAttributeCombinations(attributesWithValues);
        const existingCombinations = new Set(
            variants.map((variant) => getAttributeCombinationKey(variant.attributes))
        );
        if (combinations.every((combination) => existingCombinations.has(getAttributeCombinationKey(combination)))) {
            return;
        }

        commitVariants((currentVariants) => {
            const currentCombinations = new Set(
                currentVariants.map((variant) => getAttributeCombinationKey(variant.attributes))
            );
            const missingVariants = combinations
                .filter((combination) => !currentCombinations.has(getAttributeCombinationKey(combination)))
                .map((combination, index) => ({
                    id: `${Date.now()}-${index}`,
                    attributes: combination,
                    sku: "",
                    price: "",
                    stock: "",
                    image: "",
                    images: [],
                    status: "draft",
                }));

            return missingVariants.length
                ? [...currentVariants, ...missingVariants]
                : currentVariants;
        });
    };

    useEffect(() => {
        generateVariantCombinations();
    }, [attributes]);

    const totalStock = variants.reduce(
        (sum, variant) => sum + Number(variant.stock || 0),
        0
    );

    const activeVariants = variants.filter(
        (variant) => variant.status === "active"
    ).length;

    const draftVariants = variants.filter(
        (variant) => variant.status === "draft"
    ).length;

    const filteredVariants = useMemo(() => {
        return variants.filter((variant) => {
            const text = [variant.sku, ...Object.values(variant.attributes || {}),]
                .join(" ").toLowerCase();
            const searchMatch = text.includes(search.toLowerCase());
            const statusMatch =
                statusFilter === "all" ||
                variant.status === statusFilter;
            return searchMatch && statusMatch;
        });
    }, [variants, search, statusFilter]);

    const handleAddAttribute = () => {
        const name = window.prompt(
            "Enter attribute name e.g. Material"
        );

        if (!name?.trim()) return;
        const attributeName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
        setAttributes((prev) => [...prev, { name: attributeName, values: [], },
        ]);

        setForm((prev) => ({
            ...prev, attributes: { ...prev.attributes, [attributeName]: "", },
        }));
    };

    const handleAddValue = (attributeName) => {
        if (!newValue.trim()) return;
        setAttributes((prev) =>
            prev.map((attribute) =>
                attribute.name === attributeName
                    ? { ...attribute, values: [...attribute.values, newValue.trim(),], } : attribute
            )
        );

        setNewValue("");
        setShowAddValue(null);
    };

    const handleEditValue = (attributeName, value) => {
        const nextValue = window.prompt(`Enter ${attributeName} value`, value)?.trim();
        if (!nextValue || nextValue.toLowerCase() === value.toLowerCase()) return;

        const attribute = attributes.find((item) => item.name === attributeName);
        if (attribute?.values.some((item) => item.toLowerCase() === nextValue.toLowerCase())) {
            alert("This value already exists for the attribute.");
            return;
        }

        setAttributes((current) => current.map((item) =>
            item.name === attributeName
                ? { ...item, values: item.values.map((itemValue) => itemValue === value ? nextValue : itemValue) }
                : item
        ));
        commitVariants((currentVariants) => currentVariants.map((variant) => {
            const attributeEntry = Object.entries(variant.attributes || {}).find(
                ([name]) => name.toLowerCase() === attributeName.toLowerCase()
            );
            if (!attributeEntry || String(attributeEntry[1]).toLowerCase() !== value.toLowerCase()) {
                return variant;
            }

            const [currentName] = attributeEntry;
            return {
                ...variant,
                attributes: { ...variant.attributes, [currentName]: nextValue },
            };
        }));
    };

    const handleDeleteAttribute = (attributeName) => {
        if (attributes.length <= 0) return;

        const confirmed = window.confirm(
            `Remove ${attributeName} attribute?`
        );

        if (!confirmed) return;

        setAttributes((prev) =>
            prev.filter(
                (item) => item.name !== attributeName
            )
        );
    };

    const handleEditAttribute = (attributeName) => {
        const nextName = window.prompt("Enter attribute name", attributeName)?.trim();
        if (!nextName || nextName.toLowerCase() === attributeName.toLowerCase()) return;

        const duplicate = attributes.some(
            (attribute) => attribute.name.toLowerCase() === nextName.toLowerCase()
        );
        if (duplicate) {
            alert("An attribute with this name already exists.");
            return;
        }

        setAttributes((current) => current.map((attribute) =>
            attribute.name === attributeName ? { ...attribute, name: nextName } : attribute
        ));
        commitVariants((currentVariants) => currentVariants.map((variant) => {
            const attributeEntry = Object.entries(variant.attributes || {}).find(
                ([name]) => name.toLowerCase() === attributeName.toLowerCase()
            );
            if (!attributeEntry) return variant;

            const [currentName, attributeValue] = attributeEntry;
            const { [currentName]: ignoredValue, ...otherAttributes } = variant.attributes;
            return {
                ...variant,
                attributes: { ...otherAttributes, [nextName]: attributeValue },
            };
        }));
    };

    const openAddDrawer = () => {
        const attributesObject = {};
        attributes.forEach((attribute) => {
            attributesObject[attribute.name] = "";
        });

        setEditingId(null);
        setForm({
            ...emptyForm,
            attributes: attributesObject,
        });

        setShowDrawer(true);
    };

    const openEditDrawer = (variant) => {
        setEditingId(getVariantIdentity(variant));
        setForm({
            ...variant,
            attributes: {
                ...variant.attributes,
            },
            images: [...(variant.images || [])],
        });

        setShowDrawer(true);
    };
    const updateForm = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateAttribute = (name, value) => {
        setForm((prev) => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [name]: value,
            },
        }));
    };

    const handleSave = () => {
        if (!form.sku.trim()) {
            alert("SKU is required");
            return;
        }

        if (form.price === "") {
            alert("Price is required");
            return;
        }

        if (form.stock === "") {
            alert("Stock is required");
            return;
        }

        const payload = cleanVariantImages({
            ...form,

            price: Number(form.price),

            stock: Number(form.stock),

            sku: form.sku
                .trim()
                .toUpperCase(),

            attributes: Object.fromEntries(
                Object.entries(form.attributes).filter(
                    ([, value]) => value
                )
            ),
        });

        if (editingId) {
            commitVariants((prev) =>
                prev.map((variant) =>
                    getVariantIdentity(variant) === editingId
                        ? {
                            ...variant,
                            ...payload,
                        }
                        : variant
                )
            );
        }

        else {
            commitVariants((prev) => [
                ...prev,
                {
                    ...payload,
                    id: Date.now(),
                },
            ]);
        }

        setShowDrawer(false);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Delete this variant?"
        );

        if (!confirmed) return;

        commitVariants((prev) =>
            prev.filter((variant) => getVariantIdentity(variant) !== id)
        );
    };

    const handleDuplicate = (variant) => {
        const { id: ignoredId, _id: ignoredDatabaseId, ...variantCopy } = variant;
        const duplicate = {
            ...variantCopy,
            id: Date.now(),
            sku: `${variant.sku}-COPY`,
            attributes: {
                ...variant.attributes,
            },
            images: [...(variant.images || [])],
        };

        commitVariants((prev) => [
            ...prev,
            duplicate,
        ]);
    };

    const uploadVariantImages = async (files, field) => {
        if (!files.length) return;

        try {
            const uploadedUrls = await Promise.all(
                files.map((file) => uploadImageToCloudinary(file))
            );

            updateForm(
                field,
                field === "image"
                    ? uploadedUrls[0]
                    : [...(form.images || []), ...uploadedUrls]
            );
        } catch (uploadError) {
            alert(uploadError.message || "Failed to upload variant image.");
        }
    };
    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (
            selected.length ===
            filteredVariants.length
        ) {
            setSelected([]);
        } else {
            setSelected(
                filteredVariants.map(
                        (variant) => getVariantIdentity(variant)
                )
            );
        }
    };

    const bulkDelete = () => {
        if (!selected.length) return;
        const confirmed = window.confirm(
            `Delete ${selected.length} variants?`
        );
        if (!confirmed) return;
        commitVariants((prev) =>
            prev.filter(
                (variant) =>
                    !selected.includes(getVariantIdentity(variant))
            )
        );

        setSelected([]);
    };

    return (
        <div
            className=" text-slate-800"
            onClick={(event) => {
                if (event.target.closest("button")) event.preventDefault();
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter") event.preventDefault();
            }}
        >

            <div>
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Variants
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage all variants for this product.
                            You can add, edit, delete or duplicate
                            variants.
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <button
                            onClick={openAddDrawer}
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                        >
                            + Add Custom Variant
                        </button>

                    </div>

                </div>
                <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-3">

                    {/* ATTRIBUTES */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">

                        <div className="mb-4">
                            <h2 className="text-sm font-bold text-slate-800">
                                Variant Attributes
                                <span className="ml-1 font-normal text-slate-400">
                                    (For Auto Generation)
                                </span>
                            </h2>
                        </div>

                        <div className="space-y-2">

                            {attributes.map((attribute) => (

                                <div
                                    key={attribute.name}
                                    className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3"
                                >

                                    {/* ICON */}

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                                        {attribute.name
                                            .toLowerCase()
                                            .includes("color")
                                            ? "●"
                                            : "⌁"}
                                    </div>

                                    {/* NAME */}

                                    <div className="w-20 shrink-0 text-sm font-semibold text-slate-700">
                                        {attribute.name}
                                    </div>

                                    {/* VALUES */}

                                    <div className="flex flex-1 flex-wrap gap-2">

                                        {attribute.values.map((value) => (
                                            <div
                                                key={value}
                                                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white pl-3 pr-1 py-1 text-xs font-medium text-slate-700 hover:border-indigo-300"
                                            >
                                                {attribute.name
                                                    .toLowerCase()
                                                    .includes("color") && (
                                                        <span
                                                            className={`h-2.5 w-2.5 rounded-full ${colorMap[value] || "bg-indigo-500"}`}
                                                        />
                                                    )}
                                                {value}
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditValue(attribute.name, value)}
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                                                    title={`Edit ${value}`}
                                                >
                                                    ✎
                                                </button>
                                            </div>
                                        ))}

                                        {showAddValue ===
                                            attribute.name ? (
                                            <div className="flex gap-1">

                                                <input
                                                    autoFocus
                                                    value={newValue}
                                                    onChange={(e) =>
                                                        setNewValue(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter"
                                                        ) {
                                                            handleAddValue(
                                                                attribute.name
                                                            );
                                                        }
                                                    }}
                                                    placeholder="Value"
                                                    className="w-24 rounded-lg border border-indigo-300 px-2 py-1.5 text-xs outline-none"
                                                />

                                                <button
                                                    onClick={() =>
                                                        handleAddValue(
                                                            attribute.name
                                                        )
                                                    }
                                                    className="rounded-lg bg-indigo-600 px-2 text-xs text-white"
                                                >
                                                    ✓
                                                </button>

                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setShowAddValue(
                                                        attribute.name
                                                    );
                                                    setNewValue("");
                                                }}
                                                className="rounded-lg border border-dashed border-indigo-300 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                                            >
                                                + Add Value
                                            </button>
                                        )}

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="flex gap-1">

                                        <button
                                            type="button"
                                            onClick={() => handleEditAttribute(attribute.name)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-indigo-600"
                                            title="Edit"
                                        >
                                            ✎
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteAttribute(
                                                    attribute.name
                                                )
                                            }
                                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                            title="Delete"
                                        >
                                            🗑
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                        <button
                            onClick={handleAddAttribute}
                            className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
                        >
                            + Add Another Attribute
                        </button>

                    </div>

                    {/* AUTO GENERATION */}

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">



                        <div className="mb-5 text-center">

                            <div className="text-2xl font-bold text-slate-900">
                                <div className="mb-5 flex items-center gap-3">
                                    {attributes.reduce(
                                        (total, attribute) =>
                                            total *
                                            Math.max(
                                                attribute.values.length,
                                                1
                                            ),
                                        1
                                    )}{" "}
                                    Variants
                                </div>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                                {attributes
                                    .map(
                                        (attribute) =>
                                            `${attribute.values.length} ${attribute.name}`
                                    )
                                    .join(" × ")}
                            </p>

                            <button
                                type="button"
                                onClick={generateVariantCombinations}
                                disabled={!attributes.some((attribute) => attribute.values.length > 0)}
                                className="mt-4 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                Generate combinations
                            </button>

                        </div>





                    </div>

                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    {/* TOOLBAR */}

                    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">

                        <div className="relative flex-1">

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                ⌕
                            </span>

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search variants by SKU, color, size..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-indigo-400 focus:bg-white"
                            />

                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-indigo-400"
                        >
                            <option value="all">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="draft">
                                Draft
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>

                        {selected.length > 0 && (
                            <button
                                onClick={bulkDelete}
                                className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600"
                            >
                                Delete ({selected.length})
                            </button>
                        )}

                        <button className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs">
                            Bulk Actions ▾
                        </button>

                        <label className="flex items-center gap-2 whitespace-nowrap text-xs text-slate-500">

                            <input
                                type="checkbox"
                                checked={
                                    filteredVariants.length > 0 &&
                                    selected.length ===
                                    filteredVariants.length
                                }
                                onChange={toggleAll}
                                className="accent-indigo-600"
                            />

                            Select All

                        </label>

                    </div>

                    {/* TABLE */}

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px] text-left">

                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-[8px]">

                                    <th className="w-10 px-4 py-3">
                                        #
                                    </th>

                                    <th className="px-4 py-3">
                                        Variant
                                    </th>

                                    <th className="px-4 py-3">
                                        Attributes
                                    </th>

                                    <th className="px-4 py-3">
                                        SKU
                                    </th>

                                    <th className="px-4 py-3">
                                        Price
                                    </th>

                                    <th className="px-4 py-3">
                                        Stock
                                    </th>

                                    <th className="px-4 py-3">
                                        Status
                                    </th>

                                    <th className="px-4 py-3">
                                        Images
                                    </th>

                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {filteredVariants.map(
                                    (variant) => (

                                        <tr
                                            key={getVariantIdentity(variant)}
                                            className="group hover:bg-slate-50/60"
                                        >

                                            {/* CHECKBOX */}

                                            <td className="px-4 py-3">

                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(
                                                        getVariantIdentity(variant)
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(
                                                            getVariantIdentity(variant)
                                                        )
                                                    }
                                                    className="accent-indigo-600"
                                                />

                                            </td>

                                            {/* PRODUCT */}

                                            <td className="px-4 py-3">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-slate-100">

                                                        {variant.image ? (
                                                            <img
                                                                src={variant.image}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-lg">
                                                                👕
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                            </td>

                                            {/* ATTRIBUTES */}

                                            <td className="px-4 py-3">

                                                <div className="flex flex-wrap gap-1.5">

                                                    {Object.entries(
                                                        variant.attributes
                                                    ).map(
                                                        ([key, value]) => (

                                                            <span
                                                                key={key}
                                                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600"
                                                            >

                                                                {key
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        "color"
                                                                    ) && (
                                                                        <span
                                                                            className={`h-2 w-2 rounded-full ${colorMap[
                                                                                value
                                                                            ] ||
                                                                                "bg-indigo-500"
                                                                                }`}
                                                                        />
                                                                    )}

                                                                {key}: {value}

                                                            </span>

                                                        )
                                                    )}

                                                </div>

                                            </td>

                                            {/* SKU */}

                                            <td className="px-4 py-3">

                                                <span className="font-mono text-xs font-semibold text-slate-600">
                                                    {variant.sku}
                                                </span>

                                            </td>

                                            {/* PRICE */}

                                            <td className="px-4 py-3">

                                                <span className="text-xs font-semibold text-slate-800">
                                                    ₹
                                                    {Number(
                                                        variant.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>

                                            </td>

                                            {/* STOCK */}

                                            <td className="px-4 py-3">

                                                <span
                                                    className={`text-xs font-semibold ${variant.stock === 0
                                                        ? "text-red-500"
                                                        : variant.stock <= 5
                                                            ? "text-orange-500"
                                                            : "text-emerald-500"
                                                        }`}
                                                >
                                                    {variant.stock}
                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-4 py-3">

                                                <StatusBadge
                                                    status={
                                                        variant.status
                                                    }
                                                />

                                            </td>

                                            {/* IMAGES */}

                                            <td className="px-4 py-3">

                                                <div className="flex items-center gap-1">

                                                    {variant.image ? (
                                                        <img
                                                            src={
                                                                variant.image
                                                            }
                                                            alt=""
                                                            className="h-8 w-8 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-xs">
                                                            👕
                                                        </div>
                                                    )}

                                                    <span className="rounded-md bg-slate-100 px-1.5 py-1 text-[10px] text-slate-500">
                                                        +{variant.images?.length || 0}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* ACTIONS */}

                                            <td className="px-4 py-3">

                                                <div className="flex justify-end gap-1">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditDrawer(
                                                                variant
                                                            )
                                                        }
                                                        className="rounded-md p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                                                        title="Edit"
                                                    >
                                                        ✎
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDuplicate(
                                                                variant
                                                            )
                                                        }
                                                        className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                        title="Duplicate"
                                                    >
                                                        ⧉
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                getVariantIdentity(variant)
                                                            )
                                                        }
                                                        className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                        title="Delete"
                                                    >
                                                        🗑
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* FOOTER */}

                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-400">

                        <span>
                            Showing {filteredVariants.length} of{" "}
                            {variants.length} variants
                        </span>

                        <div className="flex items-center gap-1">

                            <button className="rounded-md border border-slate-200 px-2.5 py-1.5">
                                ‹
                            </button>

                            <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-white">
                                1
                            </button>

                            <button className="rounded-md border border-slate-200 px-2.5 py-1.5">
                                ›
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {showDrawer && (
                <div className="fixed inset-0 z-50">
                    <div
                        onClick={() =>
                            setShowDrawer(false)
                        }
                        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px]"
                    />
                    <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    {editingId
                                        ? "Edit Variant"
                                        : "Add Custom Variant"}
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Add values for this variant
                                </p>

                            </div>
                            <button
                                onClick={() =>
                                    setShowDrawer(false)
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >
                                ✕
                            </button>

                        </div>
                        <div className="space-y-6 p-5">
                            <section>
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Attributes
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Select values for this variant
                                        </p>
                                    </div>

                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(
                                        form.attributes
                                    ).map(([key, value]) => {

                                        const currentAttribute =
                                            attributes.find(
                                                (item) =>
                                                    item.name.toLowerCase() ===
                                                    key.toLowerCase()
                                            );
                                        const attributeValues = Array.from(
                                            new Set([
                                                ...(currentAttribute?.values || []),
                                                ...(value ? [value] : []),
                                            ])
                                        );
                                        return (
                                            <div key={key}>
                                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                                    {key}
                                                </label>
                                                <select
                                                    value={value}
                                                    onChange={(e) =>
                                                        updateAttribute(
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                >
                                                    <option value="">
                                                        Select {key}
                                                    </option>
                                                    {attributeValues.map(
                                                        (option) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        );
                                    })}

                                </div>
                                <button
                                    onClick={handleAddAttribute}
                                    className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    + Add Another Attribute
                                </button>
                            </section>

                            <section>

                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    SKU <span className="text-red-500">*</span>
                                </label>

                                <input
                                    value={form.sku}
                                    onChange={(e) =>
                                        updateForm(
                                            "sku",
                                            e.target.value
                                        )
                                    }
                                    placeholder="NTS-GRN-L"
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-xs uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                            </section>
                            <section>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                            Price (₹){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.price}
                                            onChange={(e) =>
                                                updateForm(
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="1099"
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                            Stock{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.stock}
                                            onChange={(e) =>
                                                updateForm(
                                                    "stock",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="20"
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h3 className="mb-2 text-sm font-semibold">
                                    Images
                                </h3>
                                <p className="mb-3 text-xs text-slate-400">
                                    Upload main image and additional
                                    images
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-medium text-slate-500">
                                            Main Image
                                        </label>
                                        <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50">
                                            {form.image ? (
                                                <img
                                                    src={form.image}
                                                    alt=""
                                                    className="h-full w-full rounded-lg object-cover"
                                                />
                                            ) : (
                                                <>
                                                    <span className="text-xl text-slate-400">
                                                        ⇧
                                                    </span>

                                                    <span className="mt-1 text-[10px] text-slate-400">
                                                        Upload main image
                                                    </span>
                                                </>
                                            )}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];

                                                    if (!file) return;
                                                    uploadVariantImages([file], "image");
                                                }}
                                            />

                                        </label>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-medium text-slate-500">
                                            Additional Images
                                        </label>
                                        <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50">
                                            <span className="text-xl text-indigo-400">
                                                +
                                            </span>
                                            <span className="mt-1 text-[10px] text-slate-400">
                                                Upload more
                                            </span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = Array.from(
                                                        e.target.files || []
                                                    );
                                                    uploadVariantImages(files, "images");
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                {form.images?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">

                                        {form.images.map(
                                            (image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative h-14 w-14 overflow-hidden rounded-lg border border-slate-200"
                                                >

                                                    <img
                                                        src={image}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            updateForm(
                                                                "images",
                                                                form.images.filter(
                                                                    (_, i) =>
                                                                        i !== index
                                                                )
                                                            )
                                                        }
                                                        className="absolute right-0.5 top-0.5 rounded-full bg-red-500 px-1 text-[9px] text-white"
                                                    >
                                                        ×
                                                    </button>

                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </section>
                            <section>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    Status
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        updateForm(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                                >

                                    <option value="draft">
                                        Draft
                                    </option>
                                    <option value="active">
                                        Active
                                    </option>
                                    <option value="inactive">
                                        Inactive
                                    </option>
                                    <option value="archived">
                                        Archived
                                    </option>
                                </select>
                            </section>
                        </div>
                        <div className="sticky bottom-0 flex gap-3 border-t border-slate-100 bg-white p-4">
                            <button
                                onClick={() =>
                                    setShowDrawer(false)
                                }
                                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
                            >
                                {editingId
                                    ? "Update Variant"
                                    : "Save Variant"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function StatusBadge({ status }) {
    const styles = {
        active:
            "bg-emerald-50 text-emerald-600 border-emerald-100",

        draft:
            "bg-amber-50 text-amber-600 border-amber-100",

        inactive:
            "bg-red-50 text-red-500 border-red-100",

        archived:
            "bg-slate-100 text-slate-500 border-slate-200",
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${styles[status] ||
                styles.inactive
                }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            {status}
        </span>
    );
}