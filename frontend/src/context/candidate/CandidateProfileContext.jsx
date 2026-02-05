import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../AuthContext';

export const CandidateProfileContext = createContext();

const CandidateProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [personalDetails, setPersonalDetails] = useState({
        basicInfo: null,
        contactInfo: null,
        identityInfo: null,
    });
    const [educationDetails, setEducationDetails] = useState(null);

    const { user } = useContext(AuthContext);

    const getProfileData = async () => {
        const res = await api.get('/get-profile');
        setProfile(res.data.profile);
    };

    const getPersonalDetails = async () => {
        const results = await Promise.allSettled([
            api.get('/personal-details/basic'),
            api.get('/personal-details/contact'),
            api.get('/personal-details/identity'),
        ]);

        const data = {
            basicInfo: results[0].status === 'fulfilled' ? results[0].value.data.data : null,
            contactInfo: results[1].status === 'fulfilled' ? results[1].value.data.data : null,
            identityInfo: results[2].status === 'fulfilled' ? results[2].value.data.data : null,
        };
        setPersonalDetails(data);
        return data;
    };

    const getEducationDetails = async () => {
        const results = await Promise.allSettled([
            api.get('/education-details/certificate'),
            api.get('/education-details/qualification'),
        ]);

        const data = {
            certificates: results[0].status === 'fulfilled' ? results[0].value.data.data : null,
            qualifications: results[1].status === 'fulfilled' ? results[1].value.data.data : null,
        };
        // console.log(data);
        setEducationDetails(data);
        return data;
    };

    const resetCandidateProfile = () => {
        setProfile(null);
        setPersonalDetails({
            basicInfo: null,
            contactInfo: null,
            identityInfo: null,
        });
        setEducationDetails(null);
    };

    useEffect(() => {
        if (!user) {
            // user is logged out → clear state
            resetCandidateProfile();
            return;
        }

        const init = async () => {
            try {
                await getProfileData();
                await getPersonalDetails();
                await getEducationDetails();
            } catch (err) {
                console.error('Profile init failed:', err);
            }
        };

        init();
    }, [user]);

    const profileDetails = async (profileData) => {
        try {
            const res = await api.put('/update-profile', profileData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await getProfileData();
            return res.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('Newtwork error');
            }
            console.log(error);
            throw new Error(error?.response?.data?.message || 'Profile updation error');
        }
    };

    const updateBasicDetails = async (basicInfoData) => {
        try {
            const res = await api.patch('/personal-details/basic', basicInfoData, {
                headers: { 'Content-Type': 'application/json' },
            });
            await getPersonalDetails();
            return res.data;
        } catch (error) {
            throw new Error(error.response.data.message);
        }
    };

    const updateContactDetails = async (contactInfoData) => {
        try {
            const res = await api.patch('/personal-details/contact', contactInfoData, {
                headers: { 'Content-Type': 'application/json' },
            });

            await getPersonalDetails();
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.message);
        }
    };

    const updateIdentityDetails = async (identityInfoData) => {
        console.log(identityInfoData);
        try {
            const res = await api.patch('/personal-details/identity', identityInfoData, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(res);
            await getPersonalDetails();
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.message);
        }
    };

    //Education

    const addEducation = async (educationData) => {
        try {
            console.log(educationData);
            const res = await api.post('/education-details/qualification', educationData, {
                headers: { 'Content-Type': 'application/json' },
            });
            getEducationDetails();
            return res;
        } catch (error) {
            // console.log(error);
            throw new Error(error.response?.data?.message);
        }
    };

    const updateEducation = async (qualificationId, educationData) => {
        try {
            const res = await api.patch(
                `/education-details/qualification/${qualificationId}`,
                educationData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            getEducationDetails();
            return res;
        } catch (error) {
            throw new Error(error.response?.data?.message);
        }
    };

    const deleteEducation = async (qualificationId, educationData) => {
        try {
            const res = await api.delete(
                `/education-details/qualification/${qualificationId}`,
                educationData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            getEducationDetails();
            return res;
        } catch (error) {
            throw new Error(error.response?.data?.message);
        }
    };

    return (
        <CandidateProfileContext.Provider
            value={{
                profile,
                personalDetails,
                educationDetails,
                profileDetails,
                setPersonalDetails,
                setEducationDetails,
                updateBasicDetails,
                updateContactDetails,
                updateIdentityDetails,
                resetCandidateProfile,
                addEducation,
                updateEducation,
                deleteEducation,
            }}
        >
            {children}
        </CandidateProfileContext.Provider>
    );
};

export default CandidateProfileProvider;
