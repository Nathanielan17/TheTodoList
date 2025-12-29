import {createContext, type ReactNode, useContext, useState} from "react";



interface AuthContextType {
    user: never | null,
    login: (credentials: {username: string, password: string}) => Promise<any>,
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider(
    {children } : {children : ReactNode}
) {
    const [user, setUser] = useState(null);

    const login = async (credentials: {username: string, password: string}) => {
        const response = await fetch('api/login',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(credentials)
            }
        );
        console.log("HeYOO")
        const userData = await response.text();
        console.log(response)
        // setUser(userData);
        return userData;
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

