import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileText } from 'lucide-react';
import { Activity } from '../../types';
import toast from 'react-hot-toast';

interface ActivityFormProps {
  onSubmit: (activity: Omit<Activity, 'id' | 'submittedAt'>) => void;
  onClose: () => void;
  studentId: string;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, onClose, studentId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic' as Activity['category'],
    semester: 1,
    credits: 1,
    documentName: '',
    documentUrl: ''
  });

  const categories = [
    { value: 'academic', label: 'Academic Achievement' },
    { value: 'extracurricular', label: 'Extracurricular Activity' },
    { value: 'internship', label: 'Internship' },
    { value: 'workshop', label: 'Workshop/Training' },
    { value: 'volunteering', label: 'Volunteering' },
    { value: 'certificate', label: 'Certification' },
    { value: 'project', label: 'Project' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.category === 'project' && !formData.documentUrl) {
      toast.error('Please provide the project URL');
      return;
    }
    onSubmit({
      studentId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      semester: formData.semester,
      credits: formData.credits,
      status: 'pending',
      documentName: formData.category === 'project' ? undefined : (formData.documentName || undefined),
      documentUrl: formData.category === 'project' ? formData.documentUrl : undefined
    });
    toast.success('Activity submitted successfully!');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, documentName: file.name });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Submit New Activity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Activity Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter activity title"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Activity['category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                Semester *
              </label>
              <select
                id="semester"
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
                Credits *
              </label>
              <input
                type="number"
                id="credits"
                min="1"
                max="10"
                required
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="1-10 credits"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Describe your activity, achievements, and skills gained..."
            />
          </div>

          {formData.category === 'project' ? (
            <div>
              <label htmlFor="project-url" className="block text-sm font-medium text-gray-700 mb-2">
                Project URL *
              </label>
              <input
                type="url"
                id="project-url"
                required
                value={formData.documentUrl}
                onChange={e => setFormData({ ...formData, documentUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://github.com/your-project or live demo URL"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Document (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">Upload a file</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC up to 10MB</p>
                  {formData.documentName && (
                    <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                      <FileText className="h-4 w-4 mr-1" />
                      {formData.documentName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Submit Activity
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};