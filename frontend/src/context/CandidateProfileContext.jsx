import { createContext, useEffect, useRef, useState } from 'react';
import api from '../api/axios';

export const CandidateProfileContext = createContext();

const CandidateProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [personalDetails, setPersonalDetails] = useState({
        basicInfo: null,
        contactInfo: null,
        identityInfo: null,
    });
    const [educationDetails, setEducationDetails] = useState(null);

    const ranOnce = useRef(false);

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

        console.log(data);
        setPersonalDetails(data);
        return data;
    };

    useEffect(() => {
        if (ranOnce.current) return;
        ranOnce.current = true;

        const init = async () => {
            try {
                await getProfileData();
                await getPersonalDetails();
            } catch (err) {
                console.error(err);
            }
        };

        init();
    }, []);

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
            setPersonalDetails((prev) => ({ ...prev, basicInfo: res.data.data }));
            return res.data;
        } catch (error) {
            throw new Error(error.response.data.message);
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
            }}
        >
            {children}
        </CandidateProfileContext.Provider>
    );
};

export default CandidateProfileProvider;
