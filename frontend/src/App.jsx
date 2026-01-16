import { ToastContainer } from 'react-toastify';
import AuthContextProvider from './context/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
    return (
        <AuthContextProvider>
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
        </AuthContextProvider>
    );
}

export default App;
