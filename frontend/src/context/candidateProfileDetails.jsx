import { createContext, useState } from 'react';

const candidateProfileContext = createContext();

const candidateProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [personalDetails, setPersonalDetails] = useState(null);
    const [educationDetails, setEducationDetails] = useState(null);

    return (
        <candidateProfileContext.Provider value={{}}>{children}</candidateProfileContext.Provider>
    );
};
