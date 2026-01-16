import React, { useState } from 'react';
import EducationInfo from './EducationInfo';
import Profile from './Profile';
import MyDetails from './MyDetails';
import ExperienceInfo from './ExperienceInfo';

function CandidateProfileDetails() {
    const [active, setActive] = useState('personal');

    return (
        <div className="bg-gray-100 p-6 rounded-xl">
            {/* Header */}
            <Profile />

            {/* Tabs */}
            <div className="flex gap-8 mt-6 border-b">
                <TabButton
                    label="Personal Details"
                    isActive={active === 'personal'}
                    onClick={() => setActive('personal')}
                />
                <TabButton
                    label="Education"
                    isActive={active === 'education'}
                    onClick={() => setActive('education')}
                />
                <TabButton
                    label="Experience"
                    isActive={active === 'experience'}
                    onClick={() => setActive('experience')}
                />
                <TabButton
                    label="Resume"
                    isActive={active === 'resume'}
                    onClick={() => setActive('resume')}
                />
            </div>

            {/* Content */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow">
                {active === 'personal' && <MyDetails />}
                {active === 'education' && <EducationInfo />}
                {active === 'experience' && <ExperienceInfo />}
                {active === 'resume' && <EducationInfo />}
            </div>
        </div>
    );
}

const TabButton = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
      px-4 py-2 text-sm font-medium rounded-t-lg transition
      ${isActive ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'}
    `}
    >
        {label}
    </button>
);

export default CandidateProfileDetails;
