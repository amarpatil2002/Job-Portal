import { createContext, useEffect, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }
        // Restore session on refresh - whenever page refresh then userdata removing (email or username on navbar) but still token is available in localstorage
        const fetchUser = async () => {
            try {
                const res = await api.get('/user', {
                    headers: { 'Content-Type': 'application/json' },
                });
                // console.log(res);
                setUser(res.data.user);
            } catch (error) {
                // console.log(error);
                localStorage.removeItem('accessToken');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const register = async (formData) => {
        try {
            const res = await api.post('/auth/register', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data;
        } catch (error) {
            //for newtwork error
            if (!error.response) {
                throw new Error('Network error. Please try again.');
            }
            // this for backend error
            throw new Error(error.response.data?.message || 'Registration failed');
        }
    };

    const verifyUser = async (verifyUserData) => {
        // console.log(verifyUserData);
        try {
            const res = await api.post('/auth/verify-user', verifyUserData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('Network error. Please try again.');
            }
            throw new Error(error.response?.data?.message || 'Verification failed');
        }
    };

    const login = async (credintial) => {
        try {
            const res = await api.post('/auth/login', credintial, {
                headers: { 'Content-Type': 'application/json' },
            });
            localStorage.setItem('accessToken', res.data.accessToken);
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            if (!error.response) {
                throw new Error('Netwrok error');
            }

            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const forgotPassword = (credential) => {
        console.log(credential);
    };

    const setNewPassword = (newData) => {
        console.log(newData);
    };

    const logout = async () => {
        try {
            await api.post('auth/logout');
        } catch (error) {
            // console.log(error);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                register,
                verifyUser,
                login,
                forgotPassword,
                setNewPassword,
                logout,
                user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
