import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { X, Plus } from "lucide-react"

interface ProductFormData {
  name: { en: string; ar: string }
  description: { en: string; ar: string }
  category: string
  price: number
  originalPrice?: number
  stock: number
  images: string[]
  features: { en: string; ar: string }[]
  benefits: { en: string; ar: string }[]
  isNew: boolean
  isFeatured: boolean
  isPopular: boolean
  discount: number
}

interface AddProductFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  product?: ProductFormData | null
}

export function AddProductForm({ onSubmit, onCancel, product }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    category: "supplements",
    price: 0,
    originalPrice: 0,
    stock: 0,
    images: [""],
    features: [{ en: "", ar: "" }],
    benefits: [{ en: "", ar: "" }],
    isNew: false,
    isFeatured: false,
    isPopular: false,
    discount: 0,
  })

  useEffect(() => {
    if (product) {
      const filteredImages = product.images?.filter((img: string) => img && img.trim() !== "") || []
      const images = filteredImages.length > 0 ? filteredImages : [""]

      setFormData({
        name: { en: product.name?.en || "", ar: product.name?.ar || "" },
        description: { en: product.description?.en || "", ar: product.description?.ar || "" },
        category: product.category || "supplements",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        stock: product.stock || 0,
        images: images,
        features: product.features || [{ en: "", ar: "" }],
        benefits: product.benefits || [{ en: "", ar: "" }],
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
        isPopular: product.isPopular || false,
        discount: product.discount || 0,
      })
    }
  }, [product])

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (field: keyof ProductFormData, subField: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as any), [subField]: value },
    }))
  }

  const handleArrayChange = (
    field: "images" | "features" | "benefits",
    index: number,
    value: any,
    subField?: string,
  ) => {
    const newArray = [...(formData[field] as any)]
    if (subField) {
      newArray[index] = { ...newArray[index], [subField]: value }
    } else {
      newArray[index] = value
    }
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: "images" | "features" | "benefits") => {
    const newArray = [...(formData[field] as any)]
    if (field === "images") {
      newArray.push("")
    } else {
      newArray.push({ en: "", ar: "" })
    }
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const removeArrayItem = (field: "images" | "features" | "benefits", index: number) => {
    const newArray = [...(formData[field] as any)]
    newArray.splice(index, 1)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.en || !formData.name.ar) {
      toast.error("Please fill in both English and Arabic product names")
      return
    }

    if (!formData.description.en || !formData.description.ar) {
      toast.error("Please fill in both English and Arabic descriptions")
      return
    }

    if (formData.price <= 0) {
      toast.error("Price must be greater than 0")
      return
    }

    const filteredImages = formData.images.filter((img) => img && img.trim() !== "")
    onSubmit({ ...formData, images: filteredImages })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "900px", maxHeight: "90vh" }}>
        <div className="modal-header">
          <h3 className="modal-title">{product ? "Edit Product" : "Add New Product"}</h3>
          <button className="modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ overflowY: "auto", maxHeight: "calc(90vh - 140px)" }}>
            {/* Product Name */}
            <div className="product-form-grid">
              <div className="form-group">
                <label className="form-label">Product Name (English) *</label>
                <input
                  type="text"
                  value={formData.name.en}
                  onChange={(e) => handleNestedChange("name", "en", e.target.value)}
                  className="form-control"
                  placeholder="Product name in English"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Product Name (Arabic) *</label>
                <input
                  type="text"
                  value={formData.name.ar}
                  onChange={(e) => handleNestedChange("name", "ar", e.target.value)}
                  className="form-control"
                  placeholder="اسم المنتج بالعربية"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Description */}
            <div className="product-form-grid">
              <div className="form-group">
                <label className="form-label">Description (English) *</label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => handleNestedChange("description", "en", e.target.value)}
                  className="form-control"
                  rows={3}
                  placeholder="Product description in English"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description (Arabic) *</label>
                <textarea
                  value={formData.description.ar}
                  onChange={(e) => handleNestedChange("description", "ar", e.target.value)}
                  className="form-control"
                  rows={3}
                  placeholder="وصف المنتج بالعربية"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="product-form-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="form-select"
                >
                  <option value="supplements">Supplements</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="herbal">Herbal Products</option>
                  <option value="medical">Medical Equipment</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price (AED) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Original Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => handleChange("originalPrice", Number.parseFloat(e.target.value))}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange("stock", Number.parseInt(e.target.value))}
                  className="form-control"
                />
              </div>
            </div>

            {/* Images */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" style={{ margin: 0 }}>
                  Product Images
                </label>
                <button type="button" onClick={() => addArrayItem("images")} className="btn btn-light btn-sm">
                  <Plus size={14} />
                  <span>Add Image</span>
                </button>
              </div>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleArrayChange("images", index, e.target.value)}
                    className="form-control"
                    placeholder="Image URL"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("images", index)}
                    className="btn-icon badge-danger"
                    style={{ flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" style={{ margin: 0 }}>
                  Features
                </label>
                <button type="button" onClick={() => addArrayItem("features")} className="btn btn-light btn-sm">
                  <Plus size={14} />
                  <span>Add Feature</span>
                </button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature.en}
                    onChange={(e) => handleArrayChange("features", index, e.target.value, "en")}
                    className="form-control"
                    placeholder="Feature in English"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    value={feature.ar}
                    onChange={(e) => handleArrayChange("features", index, e.target.value, "ar")}
                    className="form-control"
                    placeholder="الميزة بالعربية"
                    dir="rtl"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("features", index)}
                    className="btn-icon badge-danger"
                    style={{ flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" style={{ margin: 0 }}>
                  Benefits
                </label>
                <button type="button" onClick={() => addArrayItem("benefits")} className="btn btn-light btn-sm">
                  <Plus size={14} />
                  <span>Add Benefit</span>
                </button>
              </div>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={benefit.en}
                    onChange={(e) => handleArrayChange("benefits", index, e.target.value, "en")}
                    className="form-control"
                    placeholder="Benefit in English"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    value={benefit.ar}
                    onChange={(e) => handleArrayChange("benefits", index, e.target.value, "ar")}
                    className="form-control"
                    placeholder="الفائدة بالعربية"
                    dir="rtl"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("benefits", index)}
                    className="btn-icon badge-danger"
                    style={{ flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Options */}
            <div className="product-form-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => handleChange("isNew", e.target.checked)}
                  />
                  New Product
                </label>
              </div>
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleChange("isFeatured", e.target.checked)}
                  />
                  Featured
                </label>
              </div>
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => handleChange("isPopular", e.target.checked)}
                  />
                  Popular
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => handleChange("discount", Number.parseInt(e.target.value))}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-light">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Admin Form
interface AdminFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
}

interface AddAdminFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  admin?: any
}

export function AddAdminForm({ onSubmit, onCancel, admin }: AddAdminFormProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: admin?.firstName || "",
    lastName: admin?.lastName || "",
    email: admin?.email || "",
    password: "",
    phone: admin?.phone || "",
  })

  const handleChange = (field: keyof AdminFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!admin && !formData.password) {
      toast.error("Password is required for new admin")
      return
    }

    onSubmit({ ...formData, role: "admin" })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <div className="modal-header">
          <h3 className="modal-title">{admin ? "Edit Admin" : "Add New Admin"}</h3>
          <button className="modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="product-form-grid">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password {admin ? "(leave empty to keep current)" : "*"}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="form-control"
                placeholder={admin ? "Leave empty to keep current password" : "Enter password"}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-light">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {admin ? "Update Admin" : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
