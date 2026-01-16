import React from 'react';
import BasicInfo from '../../../components/candidate/BasicInfo';
import ContactInfo from '../../../components/candidate/ContactInfo';
import IdentityInfo from '../../../components/candidate/IdentityInfo';

function MyDetails() {
    return (
        <div>
            <BasicInfo />
            <ContactInfo />
            <IdentityInfo />
        </div>
    );
}

export default MyDetails;
