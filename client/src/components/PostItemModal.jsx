import React, { useState } from 'react';
import { X, AlertCircle, Sparkles, Check, MapPin, Tag, Calendar, PhoneCall, FileText } from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '../services/mockData';

export const PostItemModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Lost',
    category: 'Electronics',
    location: LOCATIONS[0],
    customLocation: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    contactInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Item title is required';
    if (!formData.description.trim()) newErrors.description = 'Please provide a brief description';
    if (!formData.contactInfo.trim()) newErrors.contactInfo = 'Contact info (Email/Phone) is required';
    if (formData.location === 'Other' && !formData.customLocation.trim()) {
      newErrors.customLocation = 'Please specify campus location';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const finalLocation =
        formData.location === 'Other' ? formData.customLocation : formData.location;

      const payload = {
        title: formData.title.trim(),
        type: formData.type,
        category: formData.category,
        location: finalLocation,
        description: formData.description.trim(),
        date: formData.date,
        contactInfo: formData.contactInfo.trim()
      };

      await onSubmitSuccess(payload);
      onClose();
      // Reset form
      setFormData({
        title: '',
        type: 'Lost',
        category: 'Electronics',
        location: LOCATIONS[0],
        customLocation: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        contactInfo: ''
      });
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fadeIn">
      <div
        className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-vercel-lg transform transition-all duration-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-700" />
              Report Campus Item
            </h3>
            <p className="text-xs text-zinc-500">
              Submit a report to alert fellow students and initiate auto-matching
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Report Type Switcher (Lost vs Found) */}
          <div>
            <label className="block text-xs font-mono-cap uppercase text-zinc-500 mb-2 font-medium">
              Report Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Lost' })}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formData.type === 'Lost'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${formData.type === 'Lost' ? 'bg-rose-600' : 'bg-zinc-400'}`}></span>
                I Lost Something
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Found' })}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  formData.type === 'Found'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${formData.type === 'Found' ? 'bg-emerald-600' : 'bg-zinc-400'}`}></span>
                I Found Something
              </button>
            </div>
          </div>

          {/* Item Title */}
          <div>
            <label className="block text-xs font-mono-cap uppercase text-zinc-500 mb-1 font-medium">
              Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={formData.type === 'Lost' ? 'e.g. Black Leather Wallet with ID Card' : 'e.g. Found Boat Wireless Earbuds Case'}
              className={`w-full px-3.5 py-2 text-sm bg-zinc-50 border rounded-lg focus:outline-none focus:border-zinc-900 focus:bg-white transition-all text-zinc-900 ${
                errors.title ? 'border-rose-400 bg-rose-50/40' : 'border-zinc-200'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.title}</p>}
          </div>

          {/* Category & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-mono-cap uppercase text-zinc-500 mb-1 font-medium flex items-center gap-1">
                <Tag className="w-3 h-3" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-zinc-800 transition-all font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-mono-cap uppercase text-zinc-500 mb-1 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date {formData.type}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-zinc-800 transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-mono-cap uppercase text-zinc-500 mb-1 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Campus Location <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-900 text-zinc-800 transition-all font-medium mb-2"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
              <option value="Other">Other Specific Location...</option>
            </select>

            {formData.location === 'Other' && (
              <input
                type="text"
                value={formData.customLocation}
                onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                placeholder="Specify precise building, floor or landmark..."
                className={`w-full px-3 py-2 text-sm bg-zinc-50 border rounded-lg focus:outline-none focus:border-zinc-900 text-zinc-900 ${
                  errors.customLocation ? 'border-rose-400' : 'border-zinc-200'
                }`}
              />
            )}
            {errors.customLocation && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.customLocation}</p>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-xs font-mono-cap uppercase text-zinc-500 mb-1 font-medium flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> Contact Info (Email / Phone) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              placeholder="student@campus.edu or +91-9876543210"
              className={`w-full px-3.5 py-2 text-sm bg-zinc-50 border rounded-lg focus:outline-none focus:border-zinc-900 focus:bg-white transition-all text-zinc-900 ${
                errors.contactInfo ? 'border-rose-400 bg-rose-50/40' : 'border-zinc-200'
              }`}
            />
            {errors.contactInfo && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.contactInfo}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono-cap uppercase text-zinc-500 mb-1 font-medium flex items-center gap-1">
              <FileText className="w-3 h-3" /> Description & Key Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide distinctive features, color, brand, markings, or exact spot item was found/lost..."
              className={`w-full px-3.5 py-2 text-sm bg-zinc-50 border rounded-lg focus:outline-none focus:border-zinc-900 focus:bg-white transition-all text-zinc-900 ${
                errors.description ? 'border-rose-400 bg-rose-50/40' : 'border-zinc-200'
              }`}
            ></textarea>
            {errors.description && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-vercel-sm hover:shadow-vercel-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
