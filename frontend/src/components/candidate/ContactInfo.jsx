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
import { AuthContext } from '../../context/AuthContext';

const contactInfoSchema = yup.object({
    contactNumber: yup
        .string()
        .required('Phone number is required')
        .matches(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
    address: yup.string().required('address is required'),
    city: yup.string().required('city is required'),
    state: yup.string().required('state is required'),
    country: yup.string().required('country is required'),
});

const DEFAULT_CONTACT_INFO = {
    contactNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
};

const DIGIT_ONLY_FIELDS = ['contactNumber'];

function ContactInfo() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_CONTACT_INFO);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);
    const { updateContactDetails, personalDetails } = useContext(CandidateProfileContext);
    const contactInfo = personalDetails.contactInfo ?? DEFAULT_CONTACT_INFO;

    useEffect(() => {
        setFormData((prev) => ({ ...prev, ...contactInfo }));
    }, [contactInfo]);

    const handleChange = (e) => {
        const { value, name } = e.target;

        if (DIGIT_ONLY_FIELDS.includes(name)) {
            if (!/^\d*$/.test(value)) return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);
        console.log(formData);
        try {
            await contactInfoSchema.validate(formData, { abortEarly: false });
            const res = await updateContactDetails(formData);
            console.log(res);
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
            <form onSubmit={handleSubmit} className=" space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className={HEADER_CLASS}>Contact Information</h2>

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
                    {/* Contact Number */}
                    <div>
                        <label className={LABEL_CLASS}>Contact Number</label>
                        {open ? (
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="Enter mobile number"
                                className={INPUT_CLASS}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{contactInfo.contactNumber || '-'}</div>
                        )}
                        {error.contactNumber && (
                            <p className="text-red-600 text-sm mt-1">{error.contactNumber}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className={LABEL_CLASS}>Email</label>
                        <div className={READ_BOX_CLASS}>{user.email || '-'}</div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className={LABEL_CLASS}>Address</label>
                        {open ? (
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{contactInfo.address || '-'}</div>
                        )}
                        {error.address && (
                            <p className="text-red-600 text-sm mt-1">{error.address}</p>
                        )}
                    </div>

                    {/* City */}
                    <div>
                        <label className={LABEL_CLASS}>City</label>
                        {open ? (
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{contactInfo.city || '-'}</div>
                        )}
                        {error.city && <p className="text-red-600 text-sm mt-1">{error.city}</p>}
                    </div>

                    {/* State */}
                    <div>
                        <label className={LABEL_CLASS}>State</label>
                        {open ? (
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{contactInfo.state || '-'}</div>
                        )}
                        {error.state && <p className="text-red-600 text-sm mt-1">{error.state}</p>}
                    </div>

                    {/* Country */}
                    <div>
                        <label className={LABEL_CLASS}>Country</label>
                        {open ? (
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={INPUT_CLASS}
                            />
                        ) : (
                            <div className={READ_BOX_CLASS}>{contactInfo.country || '-'}</div>
                        )}
                        {error.country && (
                            <p className="text-red-600 text-sm mt-1">{error.country}</p>
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

export default ContactInfo;
