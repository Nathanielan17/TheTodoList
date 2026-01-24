import LoginPage from "./pages/LoginPage";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { UserContext, type UserContextType, type UserType} from './UserContext'
import { useState, useContext} from 'react'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import token from "./lib/token";


// Redefining fetch func to include refresh of credentials

const {fetch : originalFetch} = window;
window.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await originalFetch(resource, config);

    if(!response.ok && response.status === 401) {
        console.log("Refresh Attempted")
        let refreshEndpoint = 'http://localhost:8080/auth/refresh';
        let refreshResponse = await originalFetch(refreshEndpoint,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (!refreshResponse.ok){
            return response;
        }

        const retry = async () => {
            const data = await refreshResponse.json()
            if (config && config.headers){
                let headers = new Headers(config.headers);
                if (headers.has('Authorization')){
                    headers.set('Authorization', 'Bearer ' + data.token)
                }
                config.headers = headers;
            }
            console.log("refreshed access token: " + data.token)
            token.setToken("accessToken", data.token);
            console.log(config)
            return await originalFetch(resource, config);
        }

        return await retry();
    }
    return response;
}



function App() {
    const [user, setUser] = useState<UserType>(useContext(UserContext).user);



    const updateUser = (userInfo : UserType) => {
        setUser(userInfo);
        sessionStorage.setItem('user', JSON.stringify(userInfo, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    }

    const providerValue: UserContextType = {
        user: user,
        setupUser: updateUser
    }

    // useEffect(() => {
    //     sessionStorage.setItem('user', JSON.stringify(user));
    // }, [user]);



    return (
        <MantineProvider>
            <UserContext.Provider value={providerValue}>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/sign-up" element={<SignUpPage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                        <Route path="/profile/change-password" element={<ChangePasswordPage/>}/>
                    </Routes>
                </Router>
            </UserContext.Provider>
        </MantineProvider>
    );
}

export default App;
