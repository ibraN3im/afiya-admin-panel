import { useState } from 'react';
import { toast } from 'sonner';

interface TeamMemberFormData {
    name: {
        en: string;
        ar: string;
    };
    position: {
        en: string;
        ar: string;
    };
    bio: {
        en: string;
        ar: string;
    };
    image: string;
    email: string;
    phone: number;
    department: string;
    order: number;
    isActive: boolean;
}

interface TeamMemberFormProps {
    onSubmit: (data: TeamMemberFormData) => void;
    onCancel: () => void;
    initialData?: TeamMemberFormData;
}

export function TeamMemberForm({ onSubmit, onCancel, initialData }: TeamMemberFormProps) {
    const [formData, setFormData] = useState<TeamMemberFormData>(
        initialData || {
            name: { en: '', ar: '' },
            position: { en: '', ar: '' },
            bio: { en: '', ar: '' },
            image: '',
            email: '',
            phone: 0,
            department: 'management',
            order: 0,
            isActive: true
        }
    );

    const handleChange = (field: string, value: any) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof TeamMemberFormData] as Record<string, any>),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.en || !formData.name.ar) {
            toast.error('Please fill in both English and Arabic names');
            return;
        }

        if (!formData.position.en || !formData.position.ar) {
            toast.error('Please fill in both English and Arabic positions');
            return;
        }

        if (!formData.bio.en || !formData.bio.ar) {
            toast.error('Please fill in both English and Arabic bios');
            return;
        }

        if (!formData.image) {
            toast.error('Please enter an image URL');
            return;
        }

        onSubmit(formData);
    };

    return (
        <>
            <div className="modal-backdrop show"></div>
            <div className="modal show d-block" tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document" style={{ marginTop: '30px' }}>
                    <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h2 className="modal-title fs-4">
                                {initialData ? 'Edit Team Member' : 'Add New Team Member'}
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
                                            Name (English) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name.en}
                                            onChange={(e) => handleChange('name.en', e.target.value)}
                                            className="form-control"

                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Name (Arabic) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name.ar}
                                            onChange={(e) => handleChange('name.ar', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                {/* Position */}
                                <div className="row-add mb-4">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Position (English) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.position.en}
                                            onChange={(e) => handleChange('position.en', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Position (Arabic) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.position.ar}
                                            onChange={(e) => handleChange('position.ar', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="row-add mb-4">
                                    <div className="col-12 mb-3">
                                        <label className="form-label">
                                            Bio (English) *
                                        </label>
                                        <textarea
                                            value={formData.bio.en}
                                            onChange={(e) => handleChange('bio.en', e.target.value)}
                                            className="form-control"
                                            rows={3}
                                            placeholder="Brief biography in English..."
                                        />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label">
                                            Bio (Arabic) *
                                        </label>
                                        <textarea
                                            value={formData.bio.ar}
                                            onChange={(e) => handleChange('bio.ar', e.target.value)}
                                            className="form-control"
                                            rows={3}
                                            placeholder="سيرة ذاتية موجزة باللغة العربية..."
                                        />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="row-add mb-4">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                {/* Image and Department */}
                                <div className="row-add mb-4">
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label">
                                            Image URL *
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => handleChange('image', e.target.value)}
                                            className="form-control"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">
                                            Department *
                                        </label>
                                        <select
                                            value={formData.department}
                                            onChange={(e) => handleChange('department', e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="management">Management</option>
                                            <option value="medical">Medical</option>
                                            <option value="support">Support</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="technical">Technical</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Order and Status */}
                                <div className="row-add mb-4">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="form-check mt-4">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={formData.isActive}
                                                onChange={(e) => handleChange('isActive', e.target.checked)}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="isActive" className="form-check-label ms-2">
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {initialData ? 'Update Team Member' : 'Add Team Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
