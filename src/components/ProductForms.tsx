import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface ProductFormData {
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  features: { en: string; ar: string }[];
  benefits: { en: string; ar: string }[];
  isNew: boolean;
  isFeatured: boolean;
  isPopular: boolean; // Add this line
  discount: number;
}

interface AddProductFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: ProductFormData | null;
}

export function AddProductForm({ onSubmit, onCancel, initialData }: AddProductFormProps) {

  const [formData, setFormData] = useState<ProductFormData>({
    name: {
      en: '',
      ar: ''
    },
    description: {
      en: '',
      ar: ''
    },
    category: 'supplements',
    price: 0,
    originalPrice: 0,
    stock: 0,
    images: [''],
    features: [{ en: '', ar: '' }],
    benefits: [{ en: '', ar: '' }],
    isNew: false,
    isFeatured: false,
    isPopular: false, // Add this line
    discount: 0
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      // Filter out empty images
      const filteredImages = initialData.images?.filter((img: string) => img && img.trim() !== '') || [];
      // Ensure we always have at least one empty image field
      const images = filteredImages.length > 0 ? filteredImages : [''];

      setFormData({
        name: {
          en: initialData.name?.en || '',
          ar: initialData.name?.ar || ''
        },
        description: {
          en: initialData.description?.en || '',
          ar: initialData.description?.ar || ''
        },
        category: initialData.category || 'supplements',
        price: initialData.price || 0,
        originalPrice: initialData.originalPrice || 0,
        stock: initialData.stock || 0,
        images: images,
        features: initialData.features || [{ en: '', ar: '' }],
        benefits: initialData.benefits || [{ en: '', ar: '' }],
        isNew: initialData.isNew || false,
        isFeatured: initialData.isFeatured || false,
        isPopular: initialData.isPopular || false, // Add this line
        discount: initialData.discount || 0
      });
    } else {
      // Reset to default values when initialData is null (add mode)
      setFormData({
        name: {
          en: '',
          ar: ''
        },
        description: {
          en: '',
          ar: ''
        },
        category: 'supplements',
        price: 0,
        originalPrice: 0,
        stock: 0,
        images: [''],
        features: [{ en: '', ar: '' }],
        benefits: [{ en: '', ar: '' }],
        isNew: false,
        isFeatured: false,
        isPopular: false, // Add this line
        discount: 0
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (field: keyof ProductFormData, subField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as any),
        [subField]: value
      }
    }));
  };

  const handleArrayChange = (field: 'images' | 'features' | 'benefits', index: number, value: any, subField?: string) => {
    const newArray = [...(formData[field] as any)];
    if (subField) {
      newArray[index] = { ...newArray[index], [subField]: value };
    } else {
      newArray[index] = value;
    }
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'images' | 'features' | 'benefits') => {
    const newArray = [...(formData[field] as any)];
    if (field === 'images') {
      newArray.push('');
    } else {
      newArray.push({ en: '', ar: '' });
    }
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const removeArrayItem = (field: 'images' | 'features' | 'benefits', index: number) => {
    const newArray = [...(formData[field] as any)];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.en || !formData.name.ar) {
      toast.error('Please fill in both English and Arabic product names');
      return;
    }

    if (!formData.description.en || !formData.description.ar) {
      toast.error('Please fill in both English and Arabic descriptions');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    // Filter out empty images before submitting
    const filteredImages = formData.images.filter(img => img && img.trim() !== '');

    // Create submission data
    const submissionData = {
      ...formData,
      images: filteredImages
    };

    onSubmit(submissionData);
  };

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document" style={{ marginTop: '30px' }}>
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2 className="modal-title fs-4 fw-bold">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Basic Information */}
                <div className="row-add mb-4">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Product Name (English) *
                    </label>
                    <input
                      type="text"
                      value={formData.name.en}
                      onChange={(e) => handleNestedChange('name', 'en', e.target.value)}
                      className="form-control"
                      placeholder="Product name in English"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Product Name (Arabic) *
                    </label>
                    <input
                      type="text"
                      value={formData.name.ar}
                      onChange={(e) => handleNestedChange('name', 'ar', e.target.value)}
                      className="form-control"
                      placeholder="اسم المنتج بالعربية"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="row-add mb-4">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Description (English) *
                    </label>
                    <textarea
                      value={formData.description.en}
                      onChange={(e) => handleNestedChange('description', 'en', e.target.value)}
                      rows={4}
                      className="form-control"
                      placeholder="Product description in English"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Description (Arabic) *
                    </label>
                    <textarea
                      value={formData.description.ar}
                      onChange={(e) => handleNestedChange('description', 'ar', e.target.value)}
                      rows={4}
                      className="form-control"
                      placeholder="وصف المنتج بالعربية"
                    />
                  </div>
                </div>

                {/* Pricing and Stock */}
                <div className="row-add mb-4">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="form-control"
                    >
                      <option value="supplements">Supplements</option>
                      <option value="cosmetics">Cosmetics</option>
                      <option value="herbal">Herbal Products</option>
                      <option value="medical">Medical Equipment</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      Price (AED) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      Original Price (AED)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value))}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label">
                      Product Images
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('images')}
                      className="btn btn-outline-primary btn-sm"
                    >
                      + Add Image
                    </button>
                  </div>

                  <div className="row-add g-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="col-12 d-flex gap-2">
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => handleArrayChange('images', index, e.target.value)}
                          className="form-control"
                          placeholder="Image URL"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', index)}
                          className="btn btn-outline-danger"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label">
                      Features
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('features')}
                      className="btn btn-outline-primary btn-sm"
                    >
                      + Add Feature
                    </button>
                  </div>

                  <div className="row-add g-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="col-12">
                        <div className=" g-2 mb-2">
                          <div className="col-md-6">
                            <input
                              type="text"
                              value={feature.en}
                              onChange={(e) => handleArrayChange('features', index, e.target.value, 'en')}
                              className="form-control"
                              placeholder="Feature in English"
                            />
                          </div>
                          <div className="col-md-5 d-flex gap-2">
                            <input
                              type="text"
                              value={feature.ar}
                              onChange={(e) => handleArrayChange('features', index, e.target.value, 'ar')}
                              className="form-control"
                              placeholder="الميزة بالعربية"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('features', index)}
                              className="btn btn-outline-danger"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label">
                      Benefits
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('benefits')}
                      className="btn btn-outline-primary btn-sm"
                    >
                      + Add Benefit
                    </button>
                  </div>

                  <div className="row-add g-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="col-12">
                        <div className=" g-2 mb-2">
                          <div className="col-md-6">
                            <input
                              type="text"
                              value={benefit.en}
                              onChange={(e) => handleArrayChange('benefits', index, e.target.value, 'en')}
                              className="form-control"
                              placeholder="Benefit in English"
                            />
                          </div>
                          <div className="col-md-5 d-flex gap-2">
                            <input
                              type="text"
                              value={benefit.ar}
                              onChange={(e) => handleArrayChange('benefits', index, e.target.value, 'ar')}
                              className="form-control"
                              placeholder="الفائدة بالعربية"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('benefits', index)}
                              className="btn btn-outline-danger"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="row-add mb-4">
                  <div className="col-md-4 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="isNew"
                        className="form-check-input"
                        checked={formData.isNew}
                        onChange={(e) => handleChange('isNew', e.target.checked)}
                      />
                      <label htmlFor="isNew" className="form-check-label">
                        New Product
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        className="form-check-input"
                        checked={formData.isFeatured}
                        onChange={(e) => handleChange('isFeatured', e.target.checked)}
                      />
                      <label htmlFor="isFeatured" className="form-check-label">
                        Featured Product
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="isPopular"
                        className="form-check-input"
                        checked={formData.isPopular}
                        onChange={(e) => handleChange('isPopular', e.target.checked)}
                      />
                      <label htmlFor="isPopular" className="form-check-label">
                        Popular Product
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => handleChange('discount', parseInt(e.target.value))}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="modal-footer" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
                <button
                  type="button"
                  onClick={onCancel}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ minWidth: '120px' }}
                >
                  {initialData ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface AddAdminFormProps {
  onSubmit: (data: AdminFormData) => void;
  onCancel: () => void;
  initialData?: AdminFormData | null;
}

export function AddAdminForm({ onSubmit, onCancel, initialData }: AddAdminFormProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        password: '', // Don't pre-fill password for security reasons
        phone: initialData.phone || ''
      });
    } else {
      // Reset to default values when initialData is null (add mode)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: ''
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof AdminFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please fill in both first and last names');
      return;
    }

    if (!formData.email) {
      toast.error('Please enter an email address');
      return;
    }

    // Add basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // For editing, password is optional
    if (!initialData && (!formData.password || formData.password.length < 6)) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.phone) {
      toast.error('Please enter a phone number');
      return;
    }

    onSubmit(formData);
  };

  return (
    <>
      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
      <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title fs-4">
                {initialData ? 'Edit Admin User' : 'Add New Admin User'}
              </h4>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body-admin">
                <div className="mb-1">
                  <label className="form-label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="form-control"
                    placeholder="First name"
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="form-control"
                    placeholder="Last name"
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="form-control"
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">
                    {initialData ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="form-control"
                    placeholder={initialData ? '•••••••• (optional)' : '••••••••'}
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="form-control"
                    placeholder="05 123 4567"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={onCancel}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {initialData ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
