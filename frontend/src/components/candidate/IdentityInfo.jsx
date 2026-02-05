import React, { useContext, useEffect, useState } from 'react';
import { CandidateProfileContext } from '../../context/candidate/CandidateProfileContext';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Pencil } from 'lucide-react';
import {
    INPUT_CLASS,
    SELECT_CLASS,
    READ_BOX_CLASS,
    LABEL_CLASS,
    HEADER_CLASS,
    ACTION_PRIMARY,
    ACTION_SECONDARY,
} from '../../../src/css/uiClasses';

const identityInfoSchema = yup.object({
    fatherName: yup.string().required('Father name is required'),
    motherName: yup.string().required('Mother name is required'),
    addharNumber: yup
        .string()
        .required('Aadhar number is required')
        .matches(/^\d{12}$/, 'Aadhar number must be 12 digits'),
    panNumber: yup
        .string()
        .required('PAN number is required')
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN number'),
    disability: yup.string().oneOf(['yes', 'no']),
    disabilityName: yup.string().when('disability', {
        is: 'yes',
        then: (schema) => schema.required('Please enter disability type'),
        otherwise: (schema) => schema.notRequired().strip(),
    }),
});

const DEFAULT_IDENTITY_INFO = {
    fatherName: '',
    motherName: '',
    addharNumber: '',
    panNumber: '',
    disability: 'no',
    disabilityName: '',
};

const DIGIT_ONLY_FIELDS = ['addharNumber'];

function IdentityInfo() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_IDENTITY_INFO);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const { updateIdentityDetails, personalDetails } = useContext(CandidateProfileContext);
    const identityInfo = personalDetails.identityInfo ?? DEFAULT_IDENTITY_INFO;

    useEffect(() => {
        setFormData((prev) => ({ ...prev, ...identityInfo }));
    }, [identityInfo]);

    const handleChange = (e) => {
        const { value, name } = e.target;

        if (DIGIT_ONLY_FIELDS.includes(name)) {
            if (!/^\d*$/.test(value)) return;
        }

        setFormData((prev) => {
            if (name == 'disability' && value === 'no') {
                return { ...prev, disability: value, disabilityName: '' };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);
        try {
            await identityInfoSchema.validate(formData, { abortEarly: false });
            const res = await updateIdentityDetails(formData);
            if (res.success) {
                toast.success(res.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const errors = {};
                error.inner.forEach((e) => (errors[e.path] = e.message));
                setError(errors);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 w-full bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className={HEADER_CLASS}>Identity Information</h2>

                    {!open && (
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="p-2 rounded hover:bg-gray-100"
                        >
                            <Pencil className="w-5 h-4" />
                        </button>
                    )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Father Name */}
                    <div>
                        <label className={LABEL_CLASS}>Father Name</label>
                        {open ? (
                            <input
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{identityInfo.fatherName || '-'}</div>
                        )}
                        {error.fatherName && (
                            <p className="text-red-600 text-sm">{error.fatherName}</p>
                        )}
                    </div>

                    {/* Mother Name */}
                    <div>
                        <label className={LABEL_CLASS}>Mother Name</label>
                        {open ? (
                            <input
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{identityInfo.motherName || '-'}</div>
                        )}
                        {error.motherName && (
                            <p className="text-red-600 text-sm">{error.motherName}</p>
                        )}
                    </div>

                    {/* Aadhar */}
                    <div>
                        <label className={LABEL_CLASS}>Aadhar Number</label>
                        {open ? (
                            <input
                                name="addharNumber"
                                value={formData.addharNumber}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                                maxLength={12}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{identityInfo.addharNumber || '-'}</div>
                        )}
                        {error.addharNumber && (
                            <p className="text-red-600 text-sm">{error.addharNumber}</p>
                        )}
                    </div>

                    {/* PAN */}
                    <div>
                        <label className={LABEL_CLASS}>PAN Number</label>
                        {open ? (
                            <input
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                                maxLength={10}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{identityInfo.panNumber || '-'}</div>
                        )}
                        {error.panNumber && (
                            <p className="text-red-600 text-sm">{error.panNumber}</p>
                        )}
                    </div>

                    {/* Disability */}
                    <div>
                        <label className={LABEL_CLASS}>Disability</label>
                        {open ? (
                            <select
                                name="disability"
                                value={formData.disability}
                                onChange={handleChange}
                                className={SELECT_CLASS}
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        ) : (
                            <div className={`${READ_BOX_CLASS} capitalize`}>
                                {identityInfo.disability || '—'}
                            </div>
                        )}
                    </div>

                    {/* Disability Name */}
                    <div>
                        <label className={LABEL_CLASS}>Disability Type</label>
                        {open ? (
                            <input
                                name="disabilityName"
                                value={formData.disabilityName}
                                onChange={handleChange}
                                disabled={formData.disability !== 'yes'}
                                placeholder={
                                    formData.disability === 'yes'
                                        ? 'Enter disability type'
                                        : 'Not applicable'
                                }
                                className={`${INPUT_CLASS} ${
                                    formData.disability !== 'yes'
                                        ? 'bg-gray-100 cursor-not-allowed'
                                        : ''
                                }`}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>
                                {identityInfo.disability === 'yes'
                                    ? identityInfo.disabilityName || '-'
                                    : 'Not applicable'}
                            </div>
                        )}
                        {error.disabilityName && (
                            <p className="text-red-600 text-sm">{error.disabilityName}</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {open && (
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className={ACTION_SECONDARY}
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className={ACTION_PRIMARY}>
                            Save
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default IdentityInfo;
