import { createContext, useEffect, useState } from 'react';
import api from '../api/axios';

export const CandidateProfileContext = createContext();

const CandidateProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [personalDetails, setPersonalDetails] = useState(null);
    const [educationDetails, setEducationDetails] = useState(null);

    const getProfileData = async () => {
        try {
            const res = await api.get('/get-profile', {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile(res.data.profile);
        } catch (error) {}
    };
    useEffect(() => {
        getProfileData();
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

    return (
        <CandidateProfileContext.Provider value={{ profile, profileDetails }}>
            {children}
        </CandidateProfileContext.Provider>
    );
};

export default CandidateProfileProvider;
