import React, { useContext, useEffect, useState } from 'react';
import { CandidateProfileContext } from '../../../context/candidate/CandidateProfileContext';
import { toast } from 'react-toastify';
import { Pencil, Trash2 } from 'lucide-react';
import { INPUT_CLASS } from '../../../css/uiClasses';

const DEFAULT_EDUCATION_DATA = {
    collegeName: '',
    degree: '',
    fieldStudy: '',
    startYear: '',
    endYear: '',
    grade: '',
};

function EducationInfo() {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const { educationDetails, deleteEducation } = useContext(CandidateProfileContext);

    const qualifications = educationDetails?.qualifications?.qualifications || [];

    const handleDeleteEducation = async (educationId) => {
        try {
            await deleteEducation(educationId);
            toast.success('Education deleted');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleEditEducation = (education) => {
        setEditData(education);
        setOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Education Details</h2>
                    <p className="text-sm text-gray-500">Manage your academic qualifications</p>
                </div>

                <button
                    onClick={() => {
                        setEditData(null);
                        setOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2
                           px-4 py-2 rounded-md
                           bg-indigo-600 text-white text-sm font-medium
                           hover:bg-indigo-700 transition"
                >
                    + Add Education
                </button>
            </div>

            {/* ================= CONTENT ================= */}
            {qualifications.length === 0 ? (
                <div className="bg-white border border-dashed rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-500">No education details added yet.</p>
                    <button
                        onClick={() => {
                            setEditData(null);
                            setOpen(true);
                        }}
                        className="mt-3 text-sm text-indigo-600 hover:underline"
                    >
                        Add your first education
                    </button>
                </div>
            ) : (
                <div className="w-full space-y-3">
                    {qualifications.map((q) => (
                        <div
                            key={q._id}
                            className="relative bg-white border border-gray-200 rounded-md
                       px-4 py-3 hover:shadow-sm transition"
                        >
                            {/* ===== ACTION ICONS (TOP RIGHT) ===== */}
                            <div className="absolute top-3 right-3 flex items-center gap-3">
                                <button
                                    onClick={() => handleEditEducation(q)}
                                    className="text-gray-400 hover:text-indigo-600 transition"
                                    title="Edit"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() => handleDeleteEducation(q._id)}
                                    className="text-gray-400 hover:text-red-600 transition"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* ===== MAIN CONTENT ===== */}
                            <div className="pr-14">
                                {/* College */}
                                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                                    {q.collegeName || '—'}
                                </h3>

                                {/* Degree + Field */}
                                <p className="text-sm text-gray-700 mt-0.5">
                                    {q.degree}
                                    <span className="text-gray-400 mx-1">•</span>
                                    {q.fieldStudy}
                                </p>

                                {/* Years + Grade */}
                                <p className="text-xs text-gray-500 mt-1">
                                    {q.startYear} – {q.endYear}
                                    <span className="mx-1">|</span>
                                    Grade: {q.grade}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ================= MODAL ================= */}
            {open && (
                <EducationModal updateEducationData={editData} onClose={() => setOpen(false)} />
            )}
        </div>
    );
}

const EducationModal = ({ updateEducationData, onClose }) => {
    const [formData, setFormData] = useState(DEFAULT_EDUCATION_DATA);
    const [loading, setLoading] = useState(false);

    const { addEducation, updateEducation } = useContext(CandidateProfileContext);

    useEffect(() => {
        if (updateEducationData) {
            setFormData({
                collegeName: updateEducationData.collegeName || '',
                degree: updateEducationData.degree || '',
                fieldStudy: updateEducationData.fieldStudy || '',
                startYear: updateEducationData.startYear || '',
                endYear: updateEducationData.endYear || '',
                grade: updateEducationData.grade || '',
            });
        }
    }, [updateEducationData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const startYears = Array.from({ length: 100 }, (_, i) => `${new Date().getFullYear() - i}`);

    const endYears = formData.startYear
        ? Array.from(
              {
                  length: new Date().getFullYear() - Number(formData.startYear) + 1,
              },
              (_, i) => `${Number(formData.startYear) + i}`
          )
        : [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (updateEducationData) {
                const res = await updateEducation(updateEducationData._id, formData);
                if (res.success) {
                    toast.success(res.message);
                    onClose();
                }
            } else {
                const res = await addEducation(formData);
                if (res.success) {
                    toast.success(res.message);
                    onClose();
                }
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            {/* Modal Card */}
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
                {/* ===== Header ===== */}
                <div className="flex items-center justify-between px-6 py-4 bg-indigo-700">
                    <h3 className="text-lg font-semibold text-white">
                        {updateEducationData ? 'Edit Education' : 'Add Education'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-indigo-200 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                {/* ===== Body ===== */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* College */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            College / University
                        </label>
                        <input
                            type="text"
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            className={INPUT_CLASS}
                            placeholder="Enter college or university name"
                        />
                    </div>

                    {/* Degree + Field */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Degree</label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                                placeholder="e.g. BE, BSc, MBA"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                Field of Study
                            </label>
                            <input
                                type="text"
                                name="fieldStudy"
                                value={formData.fieldStudy}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                                placeholder="e.g. Computer Science"
                            />
                        </div>
                    </div>

                    {/* Years */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Start Year</label>
                            <select
                                name="startYear"
                                value={formData.startYear}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                            >
                                <option value="">Select start year</option>
                                {startYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">End Year</label>
                            <select
                                name="endYear"
                                value={formData.endYear}
                                onChange={handleChange}
                                disabled={!formData.startYear}
                                className={`${INPUT_CLASS} disabled:bg-gray-100`}
                            >
                                <option value="">Select end year</option>
                                {endYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Grade */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Grade / Percentage
                        </label>
                        <input
                            type="text"
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            className={INPUT_CLASS}
                            placeholder="e.g. A+, 8.5 CGPA, 75%"
                        />
                    </div>
                </form>

                {/* ===== Footer ===== */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-md
                               border border-gray-300 text-gray-700
                               hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-5 py-2 text-sm font-medium rounded-md
                               bg-indigo-600 text-white
                               hover:bg-indigo-700 transition
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Education'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EducationInfo;
