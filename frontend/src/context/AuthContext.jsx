import {createContext } from "react";


export const AuthContext = createContext()

const AuthContextProvider = ({children}) => {

    const register = (formData) => {
            console.log(formData);
    }
    const login = (credintial) => {
        console.log(credintial);
    }

    const forgotPassword = (credential) => {
        console.log(credential);
    }

    const setNewPassword = (newData) => {
        console.log(newData);
    }

    return (<AuthContext.Provider value={{register,login,forgotPassword,setNewPassword}}>
        {children}
    </AuthContext.Provider>)
}

export default AuthContextProvider;

