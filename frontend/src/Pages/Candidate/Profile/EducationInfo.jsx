import React, { useContext, useEffect, useState } from 'react';
import { CandidateProfileContext } from '../../../context/candidate/CandidateProfileContext';
import { toast } from 'react-toastify';
import { Pencil, Trash2 } from 'lucide-react';
import {
    INPUT_CLASS,
    INPUT_ERROR,
    ERROR_TEXT,
    ACTION_PRIMARY,
    READ_BOX_CLASS,
    LABEL_CLASS,
} from '../../../css/uiClasses';
import * as yup from 'yup';

const educationSchema = yup.object({
    collegeName: yup
        .string()
        .trim()
        .min(3, 'College name must be at least 3 characters')
        .max(50, 'College name must not exceed 50 characters')
        .required('College name is required'),
    degree: yup
        .string()
        .trim()
        .min(2, 'Degree must be at least 2 characters')
        .max(10, 'Degree must not exceed 10 characters')
        .required('Degree is required'),
    fieldStudy: yup.string().trim().required('Field of study is required'),
    startYear: yup
        .number()
        .typeError('Start year must be a number')
        .required('Start year is required')
        .min(1950, 'Invalid start year')
        .max(new Date().getFullYear(), 'Start year cannot be in future'),
    endYear: yup
        .number()
        .typeError('End year must be a number')
        .required('End year is required')
        .min(yup.ref('startYear'), 'End year must be after start year'),
    grade: yup
        .string()
        .trim()
        .min(1, 'Grade must be at least 1 character')
        .max(5, 'Grade must not exceed 5 characters')
        .required('Grade is required'),
});

const certificateSchema = yup.object({
    certificateName: yup
        .string()
        .trim()
        .max(15, 'Max 15 characters allowed')
        .required('Certificate name is required'),
    certificates: yup.mixed().required('Certificate file is required'),
});

const DEFAULT_EDUCATION_DATA = {
    collegeName: '',
    degree: '',
    fieldStudy: '',
    startYear: '',
    endYear: '',
    grade: '',
};

function EducationInfo() {
    const [modalType, setModalType] = useState(null);
    const [editData, setEditData] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [loading, setLoading] = useState(false);

    const { educationDetails, deleteEducation, deleteCertificate } =
        useContext(CandidateProfileContext);

    const qualifications = educationDetails?.qualifications?.qualifications || [];
    const certificate = educationDetails?.certificates || [];

    // handle education
    const handleDeleteEducation = async (educationId) => {
        try {
            const res = await deleteEducation(educationId);
            if (res.success) {
                toast.success(res.message);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to delete education');
        }
    };

    const handleEditEducation = (education) => {
        setEditData(education);
        setModalType('education');
    };

    //handle certificate
    const handleDeleteCertificate = async (certificateId) => {
        try {
            setLoading(true);
            const res = await deleteCertificate(certificateId);
            if (res.success) {
                toast.success(res.message || 'Certificate deleted');
            }
        } catch (error) {
            toast.error(error?.data?.message || 'Delete failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
        setEditData(null);
        setSelectedCertificate(null);
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
                        setModalType('education');
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
                            setModalType('education');
                        }}
                        className="mt-3 text-sm text-indigo-600 hover:underline"
                    >
                        Add your first education
                    </button>
                </div>
            ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    {qualifications.map((q) => (
                        <div
                            key={q._id}
                            className="relative border rounded-lg px-4 py-3 bg-white shadow-sm"
                        >
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleEditEducation(q)}
                                    className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                >
                                    <Pencil size={14} />
                                </button>

                                <button
                                    onClick={() => handleDeleteEducation(q._id)}
                                    className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="space-y-1 text-sm pr-16">
                                <p>
                                    <strong>College:</strong> {q.collegeName || 'N/A'}
                                </p>
                                <p>
                                    <strong>Degree:</strong> {q.degree || 'N/A'}
                                </p>
                                <p>
                                    <strong>Field:</strong> {q.fieldStudy || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {q.startYear} – {q.endYear}
                                </p>
                                <p className="text-xs text-gray-500">Grade: {q.grade || 'N/A'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ---------------- Certificates ---------------- */}
            <div className="bg-white p-5 border w-100    shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <label className={`${LABEL_CLASS} text-gray-900`}>Certificates</label>
                    <span className="text-xs text-gray-400">Max 5 allowed</span>
                </div>
                {certificate?.certificates?.length > 0 ? (
                    <div className="space-y-2">
                        {certificate.certificates.map((cert) => (
                            <div
                                key={cert._id}
                                className="flex items-center justify-between
                           bg-gray-100 rounded-md px-3 py-2
                           text-sm text-gray-600
                           max-w-md"
                            >
                                <a
                                    href={cert.certificateFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate cursor-default"
                                >
                                    {cert.certificateName}
                                </a>

                                <button
                                    disabled={loading}
                                    type="button"
                                    onClick={() => handleDeleteCertificate(cert._id)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`${READ_BOX_CLASS} rounded-md text-gray-400 text-sm py-3`}>
                        No certificates uploaded
                    </div>
                )}

                <button
                    disabled={certificate?.certificates?.length >= 5}
                    onClick={() => {
                        setSelectedCertificate(null);
                        setModalType('certificate');
                    }}
                    className={`text-sm font-medium transition ${
                        certificate?.certificates?.length >= 5
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-indigo-600 hover:text-indigo-700 hover:underline'
                    }`}
                >
                    + Add Certificate
                </button>

                {certificate?.certificates?.length >= 5 && (
                    <p className="text-xs text-red-500">Certificate limit reached (5)</p>
                )}
            </div>

            {/* ================= MODALS ================= */}
            {modalType === 'education' && (
                <EducationModal updateEducationData={editData} onClose={handleCloseModal} />
            )}

            {modalType === 'certificate' && (
                <CertificateModal
                    certificateData={selectedCertificate}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

const EducationModal = ({ updateEducationData, onClose }) => {
    const [formData, setFormData] = useState(DEFAULT_EDUCATION_DATA);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
        setErrors((prev) => ({ ...prev, [name]: undefined }));
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
        setErrors({});

        try {
            await educationSchema.validate(formData, { abortEarly: false });

            if (updateEducationData) {
                const res = await updateEducation(updateEducationData._id, formData);
                if (res.success) {
                    toast.success(res.message || 'Education updated successfully');
                    onClose();
                }
            } else {
                const res = await addEducation(formData);
                if (res.success) {
                    toast.success(res.message || 'Education added successfully');
                    onClose();
                }
            }
        } catch (err) {
            const fieldErrors = {};

            if (err?.name === 'ValidationError') {
                err.inner.forEach((e) => (fieldErrors[e.path] = e.message));
                setErrors(fieldErrors);
            } else if (err?.status === 400 && err?.data?.errors) {
                err.data.errors.forEach((msg) => {
                    const field = msg.split(' ')[0].toLowerCase();
                    fieldErrors[field] = msg;
                });
                setErrors(fieldErrors);
            } else {
                toast.error(err?.message || 'Failed to save education');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-indigo-700">
                    <h3 className="text-lg font-semibold text-white">
                        {updateEducationData ? 'Edit Education' : 'Add Education'}
                    </h3>
                    <button onClick={onClose} className="text-indigo-200 hover:text-white">
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* College */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            College / University
                        </label>
                        <input
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            placeholder="Enter college name"
                            className={`${INPUT_CLASS} ${errors.collegeName ? INPUT_ERROR : ''}`}
                        />
                        {errors.collegeName && <p className={ERROR_TEXT}>{errors.collegeName}</p>}
                    </div>

                    {/* Degree + Field */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Degree</label>
                            <input
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                placeholder="e.g., B.Tech"
                                className={`${INPUT_CLASS} ${errors.degree ? INPUT_ERROR : ''}`}
                            />
                            {errors.degree && <p className={ERROR_TEXT}>{errors.degree}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Field of Study</label>
                            <input
                                name="fieldStudy"
                                value={formData.fieldStudy}
                                onChange={handleChange}
                                placeholder="e.g., Computer Science"
                                className={`${INPUT_CLASS} ${errors.fieldStudy ? INPUT_ERROR : ''}`}
                            />
                            {errors.fieldStudy && <p className={ERROR_TEXT}>{errors.fieldStudy}</p>}
                        </div>
                    </div>

                    {/* Years */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Year</label>
                            <select
                                name="startYear"
                                value={formData.startYear}
                                onChange={handleChange}
                                className={`${INPUT_CLASS} ${errors.startYear ? INPUT_ERROR : ''}`}
                            >
                                <option value="">Select</option>
                                {startYears.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                            {errors.startYear && <p className={ERROR_TEXT}>{errors.startYear}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">End Year</label>
                            <select
                                name="endYear"
                                value={formData.endYear}
                                onChange={handleChange}
                                disabled={!formData.startYear}
                                className={`${INPUT_CLASS} ${errors.endYear ? INPUT_ERROR : ''}`}
                            >
                                <option value="">Select</option>
                                {endYears.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                            {errors.endYear && <p className={ERROR_TEXT}>{errors.endYear}</p>}
                        </div>
                    </div>

                    {/* Grade */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Grade / Percentage</label>
                        <input
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            placeholder="e.g., 8.5 or 85%"
                            className={`${INPUT_CLASS} ${errors.grade ? INPUT_ERROR : ''}`}
                        />
                        {errors.grade && <p className={ERROR_TEXT}>{errors.grade}</p>}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                        {loading ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CertificateModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        certificateName: '',
        certificates: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { addCertificate } = useContext(CandidateProfileContext);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));

        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await certificateSchema.validate(formData, { abortEarly: false });

            const payload = new FormData();
            payload.append('certificateName', formData.certificateName);
            payload.append('certificates', formData.certificates);

            const res = await addCertificate(payload);

            if (res.success) {
                toast.success(res.message || 'Certificate uploaded successfully');
                onClose();
            }
        } catch (err) {
            if (err.name === 'ValidationError') {
                const fieldErrors = {};
                err.inner.forEach((e) => (fieldErrors[e.path] = e.message));
                setErrors(fieldErrors);
            } else {
                toast.error(err?.data?.message || 'Upload failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="flex justify-between items-center px-5 py-3 bg-indigo-600">
                    <h3 className="text-white font-semibold">Add Certificate</h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Certificate Name</label>

                        <input
                            type="text"
                            name="certificateName"
                            value={formData.certificateName}
                            onChange={handleChange}
                            className={`w-full border rounded-md px-3 py-2 text-sm ${
                                errors.certificateName ? 'border-red-500' : ''
                            }`}
                        />

                        {errors.certificateName && (
                            <p className="text-xs text-red-500 mt-1">{errors.certificateName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Upload Certificate</label>

                        <input
                            type="file"
                            name="certificates"
                            onChange={handleChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />

                        {formData.certificates && (
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.certificates.name}
                            </p>
                        )}

                        {errors.certificates && (
                            <p className="text-xs text-red-500 mt-1">{errors.certificates}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            className="px-5 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                            type="submit"
                        >
                            {loading ? 'Uploading…' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationInfo;
