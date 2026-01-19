import { useContext, useEffect, useState } from 'react';
import { number, object, string } from 'yup';
import { CandidateProfileContext } from '../../context/CandidateProfileContext';
import { toast } from 'react-toastify';

const basicInfoSchema = object({
    name: string().trim().required('Please enter name'),
    age: number().required('Please enter age'),
    gender: string()
        .trim()
        .required('Please select gender')
        .oneOf(['male', 'female', 'other'], 'Invalid gender selected'),
    married: string()
        .trim()
        .required('Please select marriage status')
        .oneOf(['married', 'unmarried'], 'Invalid marriage status selected'),
});

const DEFAULT_BASIC_INFO = {
    name: '',
    age: '',
    gender: '',
    married: '',
};

function BasicInfo() {
    const [open, setOpen] = useState(false);

    const { personalDetails } = useContext(CandidateProfileContext);
    console.log(personalDetails);
    //prevent reload chrash
    const basicInfo = personalDetails.basicInfo ?? DEFAULT_BASIC_INFO;
    return (
        <div>
            <h2>Basic details</h2>
            <div>
                <label>name:</label>
                <span>{basicInfo.name}</span>
            </div>
            <div>
                <label htmlFor="">Age:</label>
                <span>{basicInfo.age}</span>
            </div>
            <div>
                <label htmlFor="">Gender:</label>
                <span>{basicInfo.gender}</span>
            </div>
            <div>
                <label htmlFor="">Married/Unmarried:</label>
                <span>{basicInfo.married}</span>
            </div>

            <button onClick={() => setOpen(true)}>Edit</button>
            {open ? <BasicInfoModel onClose={() => setOpen(false)} /> : null}
        </div>
    );
}

function BasicInfoModel({ onClose }) {
    const [formData, setFormData] = useState(DEFAULT_BASIC_INFO);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const { personalDetails, updateBasicDetails } = useContext(CandidateProfileContext);
    const basicDetails = personalDetails?.basicInfo;
    useEffect(() => {
        if (basicDetails) {
            setFormData({ ...DEFAULT_BASIC_INFO, ...basicDetails });
        }
    }, [basicDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);
        try {
            const payload = { ...formData, age: formData.age ? Number(formData.age) : null };
            await basicInfoSchema.validate(formData, { abortEarly: false });
            const res = await updateBasicDetails(payload);
            if (res.success) {
                toast.success(res.message);
            }
            onClose();
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach((e) => {
                    validationErrors[e.path] = e.message;
                });
                setError(validationErrors);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center ">
            <div className="bg-white">
                <h1>Basic info</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="border-2"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="name"
                    />{' '}
                    <br />
                    {error.name && <p className="text-red-500">{error.name}</p>}
                    <input
                        className="border-2"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="age"
                    />{' '}
                    <br />
                    {error.age && <p className="text-red-500">{error.age}</p>}
                    <div>
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                        />
                        Male
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                        />
                        Female
                        <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={formData.gender === 'other'}
                            onChange={handleChange}
                        />
                        Other
                    </div>
                    <br />
                    {error.gender && <p className="text-red-500">{error.gender}</p>}
                    <label htmlFor="married">Married : </label>
                    <input
                        type="radio"
                        name="married"
                        value="married"
                        checked={formData.married === 'married'}
                        onChange={handleChange}
                    />
                    Yes
                    <input
                        type="radio"
                        name="married"
                        value="unmarried"
                        checked={formData.married === 'unmarried'}
                        onChange={handleChange}
                    />
                    No
                    <br />
                    {error.married && <p className="text-red-500">{error.married}</p>}
                    <button onClick={onClose} className="border-2" type="button">
                        Cancel
                    </button>
                    <button type="submit" className="border-2">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BasicInfo;
