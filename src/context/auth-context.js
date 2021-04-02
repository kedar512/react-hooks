import React, { useState } from 'react';

export const AuthContext = React.createContext({
    authenticated: false,
    login: () => {}
});

const AuthContextProvider = (props) => {

    const [isAuthenticated, setAuthenticated] = useState(false);

    const loginHandler = () => {
        setAuthenticated(true);
    }

    return (
        <AuthContext.Provider
            value={{authenticated: isAuthenticated, login: loginHandler}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;