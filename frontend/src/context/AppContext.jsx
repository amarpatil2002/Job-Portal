import { Children, createContext } from "react";


export const AppContext = createContext()

const value = {}

const AppContextProvider = ({Children}) => {
    return (<AppContext.Provider value={value}>
        {Children}
    </AppContext.Provider>)
}

export default AppContextProvider;

