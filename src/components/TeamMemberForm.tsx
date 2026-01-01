import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { X } from "lucide-react"

interface TeamMemberFormData {
  name: { en: string; ar: string }
  position: { en: string; ar: string }
  bio: { en: string; ar: string }
  image: string
  email: string
  phone: number
  department: string
  order: number
  isActive: boolean
}

interface TeamMemberFormProps {
  onSubmit: (data: TeamMemberFormData) => void
  onCancel: () => void
  member?: TeamMemberFormData
}

export function TeamMemberForm({ onSubmit, onCancel, member }: TeamMemberFormProps) {
  const [formData, setFormData] = useState<TeamMemberFormData>(
    member || {
      name: { en: "", ar: "" },
      position: { en: "", ar: "" },
      bio: { en: "", ar: "" },
      image: "",
      email: "",
      phone: 0,
      department: "management",
      order: 0,
      isActive: true,
    },
  )

  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof TeamMemberFormData] as Record<string, any>),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.en || !formData.name.ar) {
      toast.error("Please fill in both English and Arabic names")
      return
    }

    if (!formData.position.en || !formData.position.ar) {
      toast.error("Please fill in both English and Arabic positions")
      return
    }

    if (!formData.bio.en || !formData.bio.ar) {
      toast.error("Please fill in both English and Arabic bios")
      return
    }

    if (!formData.image) {
      toast.error("Please enter an image URL")
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "700px", maxHeight: "90vh" }}>
        <div className="modal-header">
          <h3 className="modal-title">{member ? "Edit Team Member" : "Add New Team Member"}</h3>
          <button className="modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ overflowY: "auto", maxHeight: "calc(90vh - 140px)" }}>
            {/* Name */}
            <div className="product-form-grid">
              <div className="form-group">
                <label className="form-label">Name (English) *</label>
                <input
                  type="text"
                  value={formData.name.en}
                  onChange={(e) => handleChange("name.en", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Name (Arabic) *</label>
                <input
                  type="text"
                  value={formData.name.ar}
                  onChange={(e) => handleChange("name.ar", e.target.value)}
                  className="form-control"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Position */}
            <div className="product-form-grid">
              <div className="form-group">
                <label className="form-label">Position (English) *</label>
                <input
                  type="text"
                  value={formData.position.en}
                  onChange={(e) => handleChange("position.en", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Position (Arabic) *</label>
                <input
                  type="text"
                  value={formData.position.ar}
                  onChange={(e) => handleChange("position.ar", e.target.value)}
                  className="form-control"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label">Bio (English) *</label>
              <textarea
                value={formData.bio.en}
                onChange={(e) => handleChange("bio.en", e.target.value)}
                className="form-control"
                rows={3}
                placeholder="Brief biography in English..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bio (Arabic) *</label>
              <textarea
                value={formData.bio.ar}
                onChange={(e) => handleChange("bio.ar", e.target.value)}
                className="form-control"
                rows={3}
                placeholder="سيرة ذاتية موجزة باللغة العربية..."
                dir="rtl"
              />
            </div>

            {/* Contact */}
            <div className="product-form-grid">
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
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Image and Department */}
            <div className="product-form-grid">
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="product-form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="form-select"
                >
                  <option value="management">Management</option>
                  <option value="medical">Medical</option>
                  <option value="support">Support</option>
                  <option value="marketing">Marketing</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleChange("order", Number.parseInt(e.target.value) || 0)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    marginTop: "28px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                  />
                  Active
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {member ? "Update Team Member" : "Add Team Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
