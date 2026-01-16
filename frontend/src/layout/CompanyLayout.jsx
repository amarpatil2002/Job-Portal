import { Outlet } from 'react-router-dom';
import CandidateSideBar from '../components/candidate/CandidateSideBar';

function CompanyLayout() {
    return (
        <div>
            <CandidateSideBar />
            <Outlet />
        </div>
    );
}

export default CompanyLayout;
