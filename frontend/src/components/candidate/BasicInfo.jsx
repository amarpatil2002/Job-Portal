import { useContext, useEffect, useState } from 'react';
import { number, object, string } from 'yup';
import { CandidateProfileContext } from '../../context/candidate/CandidateProfileContext';
import { toast } from 'react-toastify';
import { Pencil, X } from 'lucide-react';
import {} from '../../../src/css/uiClasses';
import {
    INPUT_CLASS,
    SELECT_CLASS,
    READ_BOX_CLASS,
    LABEL_CLASS,
    HEADER_CLASS,
    ACTION_PRIMARY,
    ACTION_SECONDARY,
} from '../../../src/css/uiClasses';

const basicInfoSchema = object({
    name: string().trim().required('Please enter name'),
    age: number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .nullable()
        .notRequired(),
    gender: string().required('Please select gender'),
    married: string().required('Please select marriage status'),
});

const DEFAULT_BASIC_INFO = {
    name: '',
    age: '',
    gender: '',
    married: '',
};

function BasicInfo() {
    const { personalDetails, updateBasicDetails } = useContext(CandidateProfileContext);

    const basicInfo = personalDetails?.basicInfo ?? DEFAULT_BASIC_INFO;

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_BASIC_INFO);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    // Sync context data into editable state
    useEffect(() => {
        setFormData({ ...DEFAULT_BASIC_INFO, ...basicInfo });
    }, [basicInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSave = async () => {
        setError({});
        setLoading(true);

        try {
            await basicInfoSchema.validate(formData, { abortEarly: false });
            await updateBasicDetails({ ...formData, age: Number(formData.age) });
            toast.success('Basic details updated');
            setOpen(false);
        } catch (err) {
            if (err.name === 'ValidationError') {
                const errs = {};
                err.inner.forEach((e) => (errs[e.path] = e.message));
                setError(errs);
            } else {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className={HEADER_CLASS}>Basic Details</h2>

                {!open && (
                    <button onClick={() => setOpen(true)} className="p-2 rounded hover:bg-gray-100">
                        <Pencil className="w-5 h-4" />
                    </button>
                )}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* NAME */}
                <div>
                    <p className={LABEL_CLASS}>Name</p>
                    {open ? (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className={INPUT_CLASS}
                        />
                    ) : (
                        <div className={READ_BOX_CLASS}>{basicInfo.name || '-'}</div>
                    )}
                    {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
                </div>

                {/* AGE */}
                <div>
                    <p className={LABEL_CLASS}>Age</p>
                    {open ? (
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter age"
                            className={INPUT_CLASS}
                        />
                    ) : (
                        <div className={READ_BOX_CLASS}>{basicInfo.age ?? '-'}</div>
                    )}
                    {error.age && <p className="text-red-500 text-sm mt-1">{error.age}</p>}
                </div>

                {/* GENDER */}
                <div>
                    <p className={LABEL_CLASS}>Gender</p>
                    {open ? (
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={SELECT_CLASS}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    ) : (
                        <div className={`${READ_BOX_CLASS} capitalize`}>
                            {basicInfo.gender || '-'}
                        </div>
                    )}
                    {error.gender && <p className="text-red-500 text-sm mt-1">{error.gender}</p>}
                </div>

                {/* MARITAL */}
                <div>
                    <p className={LABEL_CLASS}>Marital Status</p>
                    {open ? (
                        <select
                            name="married"
                            value={formData.married}
                            onChange={handleChange}
                            className={SELECT_CLASS}
                        >
                            <option value="">Select marital status</option>
                            <option value="married">Married</option>
                            <option value="unmarried">Unmarried</option>
                        </select>
                    ) : (
                        <div className={`${READ_BOX_CLASS} capitalize`}>
                            {basicInfo.married || '-'}
                        </div>
                    )}
                    {error.married && <p className="text-red-500 text-sm mt-1">{error.married}</p>}
                </div>
            </div>

            {/* Actions */}
            {open && (
                <div className="mt-4 flex justify-end gap-3">
                    <button onClick={() => setOpen(false)} className={ACTION_SECONDARY}>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={loading} className={ACTION_PRIMARY}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}

export default BasicInfo;
