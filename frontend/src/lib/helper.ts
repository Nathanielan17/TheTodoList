import token from "./token";

export const authFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
    let response = await fetch(url, init);
    if (response.status !== 401){
        return response;
    }
    console.log("Access Token Expired !!!!")
    const refreshResponse = await fetch("http://localhost:8080/auth/refresh",
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    if (!refreshResponse.ok) {
        return response
    }

    const accessToken = await refreshResponse.json();
    token.setToken("accessToken", accessToken)

    return fetch(url, init);
}