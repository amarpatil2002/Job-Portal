import React, { useContext, useEffect, useState } from 'react';
import { CandidateProfileContext } from '../../../context/candidate/CandidateProfileContext';
import { toast } from 'react-toastify';
import { Pencil, Trash2 } from 'lucide-react';
import { INPUT_CLASS, INPUT_ERROR, ERROR_TEXT } from '../../../css/uiClasses';
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
        .min(2, 'College name must be at least 2 characters')
        .max(10, 'College name must not exceed 10 characters')
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
        .min(1, 'College name must be at least 1 characters')
        .max(5, 'College name must not exceed 5 characters')
        .required('Grade is required'),
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
    const [open, setOpen] = useState(false);
    const { educationDetails, deleteEducation } = useContext(CandidateProfileContext);
    const qualifications = educationDetails?.qualifications?.qualifications || [];
    const certificate = educationDetails.certificates || [];

    console.log(certificate);

    // handle education
    const handleDeleteEducation = async (educationId) => {
        try {
            const res = await deleteEducation(educationId);
            console.log(res);
            if (res.success) {
                toast.success(res.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleEditEducation = (education) => {
        setEditData(education);
        setOpen(true);
    };

    //handle certificate
    const handleCertificateDelete = () => {};

    const handleCertificateEdit = () => {};

    return (
        <div className="space-y-6">
            <div>
                <div>
                    {open ? (
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Higher Education
                            </label>
                            <input
                                type="text"
                                name="highestEducation"
                                value={formData.highestEducation}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    ) : (
                        <p>{certificate.highestEducation}</p>
                    )}
                </div>
                {certificate.certificates.map((certificate) => (
                    <ul key={certificate._id}>
                        <li>{certificate.certificateName}</li>
                    </ul>
                ))}
            </div>
            <button onClick={() => setModalType('certificate')}>Edit Higher</button>
            {modalType === 'certificate' && <CertificateModal onClose={() => setModalType(null)} />}

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
                            setOpen(true);
                        }}
                        className="mt-3 text-sm text-indigo-600 hover:underline"
                    >
                        Add your first education
                    </button>
                </div>
            ) : (
                <div className="w-full grid grid-cols-2 gap-4">
                    {qualifications.map((q) => (
                        <div key={q._id} className="relative border rounded-lg px-4 py-3 bg-white">
                            {/* Actions */}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => handleEditEducation(q)}>
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDeleteEducation(q._id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {/* Content with Labels */}
                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="font-medium text-gray-700">College:</span>{' '}
                                    {q.collegeName || 'N/A'}
                                </p>

                                <p>
                                    <span className="font-medium text-gray-700">Degree:</span>{' '}
                                    {q.degree || 'N/A'}
                                </p>

                                <p>
                                    <span className="font-medium text-gray-700">
                                        Field of Study:
                                    </span>{' '}
                                    {q.fieldStudy || 'N/A'}
                                </p>

                                <p className="text-xs text-gray-500">
                                    <span className="font-medium text-gray-600">Duration:</span>{' '}
                                    {q.startYear} – {q.endYear}
                                </p>

                                <p className="text-xs text-gray-500">
                                    <span className="font-medium text-gray-600">Grade:</span>{' '}
                                    {q.grade || 'N/A'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ================= MODAL ================= */}
            {modalType === 'education' && (
                <EducationModal updateEducationData={editData} onClose={() => setModalType(null)} />
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

        try {
            if (updateEducationData) {
                await educationSchema.validate(formData, { abortEarly: false });
                const res = await updateEducation(updateEducationData._id, formData);
                if (res.success) {
                    toast.success(res.message);
                    onClose();
                }
            } else {
                await educationSchema.validate(formData, { abortEarly: false });
                const res = await addEducation(formData);
                if (res.success) {
                    toast.success(res.message);
                    onClose();
                }
            }
        } catch (err) {
            const fieldErrors = {};
            if (err?.name === 'ValidationError') {
                err.inner.forEach((e) => (fieldErrors[e.path] = e.message));
                setErrors(fieldErrors);
                return;
            }

            if (err.status === 400 && err.data?.errors) {
                err.data.errors.forEach((msg) => {
                    const field = msg.split(' ')[0];
                    fieldErrors[field] = msg;
                });
                setErrors(fieldErrors);
                return;
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
                    <h3 className="text-lg font-semibold text-white">Add Education</h3>
                    <button onClick={onClose} className="text-indigo-200 hover:text-white">
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* College */}
                    <div>
                        <label className="block text-sm mb-1">College / University</label>
                        <input
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            className={`${INPUT_CLASS} ${errors.collegeName ? INPUT_ERROR : ''}`}
                        />
                        {errors.collegeName && <p className={ERROR_TEXT}>{errors.collegeName}</p>}
                    </div>

                    {/* Degree + Field */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Degree</label>
                            <input
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className={`${INPUT_CLASS} ${errors.degree ? INPUT_ERROR : ''}`}
                            />
                            {errors.degree && <p className={ERROR_TEXT}>{errors.degree}</p>}
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Field of Study</label>
                            <input
                                name="fieldStudy"
                                value={formData.fieldStudy}
                                onChange={handleChange}
                                className={`${INPUT_CLASS} ${errors.fieldStudy ? INPUT_ERROR : ''}`}
                            />
                            {errors.fieldStudy && <p className={ERROR_TEXT}>{errors.fieldStudy}</p>}
                        </div>
                    </div>

                    {/* Years */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Start Year</label>
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
                            <label className="block text-sm mb-1">End Year</label>
                            <select
                                name="endYear"
                                value={formData.endYear}
                                onChange={handleChange}
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
                        <label className="block text-sm mb-1">Grade / Percentage</label>
                        <input
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
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
                        className="px-4 py-2 text-sm border rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 text-sm rounded-md bg-indigo-600 text-white disabled:opacity-50"
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
        certificate: null,
    });

    const { updadateCertificate } = useContext(CandidateProfileContext);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updadateCertificate(formData);
            console.log(res);
        } catch (error) {
            toast.error(error.data.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Add Certificate</h3>

                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Certificate Name</label>
                        <input
                            type="text"
                            name="certificateName"
                            value={formData.certificateName}
                            onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Upload Certificate</label>
                        <input
                            type="file"
                            name="certificate"
                            onChange={handleChange}
                            className="w-full text-sm"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationInfo;
