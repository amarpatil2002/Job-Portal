import { ToastContainer } from 'react-toastify';
import AppRouter from './routes/AppRouter';
import AuthContextProvider from './context/AuthContext';
import CandidateProfileProvider from './context/CandidateProfileContext';

function App() {
    return (
        <AuthContextProvider>
            <CandidateProfileProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="light" // or "light"
                />
                <AppRouter />
            </CandidateProfileProvider>
        </AuthContextProvider>
    );
}

export default App;
