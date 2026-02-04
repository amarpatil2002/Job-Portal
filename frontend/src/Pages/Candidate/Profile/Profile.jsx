import { useContext, useEffect, useState } from 'react';
import { CircleUserRound, Form, Pencil } from 'lucide-react';
import { CandidateProfileContext } from '../../../context/CandidateProfileContext';
import images from '../../../assets/allImages';
import { toast } from 'react-toastify';

const DEFAULT_IMAGE = images.defaultUserImage;

function Profile() {
    const [open, setOpen] = useState(false);

    const { profile } = useContext(CandidateProfileContext);

    return (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">Profile</h3>

                <button
                    onClick={() => setOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    title="Edit profile"
                >
                    <Pencil size={18} className="text-gray-600" />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* LEFT */}
                <div className="flex flex-col items-center w-full sm:w-36 shrink-0 text-center">
                    <img
                        src={
                            profile?.profileImage?.imageURL.trim()
                                ? profile?.profileImage?.imageURL
                                : DEFAULT_IMAGE
                        }
                        alt="Profile"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border"
                    />

                    <h4 className="mt-3 text-sm font-semibold text-gray-900">
                        {profile?.fullName || null}
                    </h4>

                    <p className="text-xs text-gray-500">{profile?.jobRole || null}</p>
                </div>

                {/* RIGHT */}
                <div className="flex-1 w-full">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Summary</h4>

                    <p className="text-sm text-gray-600 leading-relaxed">
                        {profile?.summary ||
                            'Add a short professional summary to highlight your skills and experience.'}
                    </p>
                </div>
            </div>

            {open && <ProfileModal onClose={() => setOpen(false)} />}
        </div>
    );
}

const ProfileModal = ({ onClose }) => {
    const [summary, setSummary] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    const ALLOWED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

    const { profile, profileDetails } = useContext(CandidateProfileContext);

    useEffect(() => {
        if (profile) {
            setSummary(profile.summary || null);
            setPreview(
                profile?.profileImage?.imageURL?.trim()
                    ? profile.profileImage?.imageURL
                    : DEFAULT_IMAGE
            );
        }
    }, [profile]);

    const handleImageChange = (e) => {
        let file = e.target.files[0];
        if (!file) return null;

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setError('Only JPG and PNG images are allowed');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError('File size must be less than 2MB');
            return;
        }
        setError('');
        setProfileImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append('summary', summary);
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            const res = await profileDetails(formData);
            onClose();
            if (res.success) {
                toast.success(res.message);
            }
        } catch (error) {
            setError('Something went wrong');
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-5 text-gray-800">Edit Profile</h2>

                {/* Image */}
                <div className="flex justify-center mb-5">
                    <div className="relative">
                        <img
                            src={preview.trim() ? preview : DEFAULT_IMAGE}
                            alt="Profile"
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border"
                        />

                        <label className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full cursor-pointer shadow hover:bg-indigo-700 transition">
                            <Pencil size={14} className="text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>

                    <textarea
                        className="border w-full p-2.5 rounded-lg mb-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        rows={4}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        maxLength={1000}
                    />

                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
