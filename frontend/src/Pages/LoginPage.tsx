import {useNavigate} from 'react-router-dom'
import {useState, useContext} from "react";
import { UserContext, type UserContextType} from '../UserContext'

function LoginPage (){
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {setupUser} : UserContextType= useContext(UserContext)

    const loginEndpoint = 'http://localhost:8080/auth/login';




    const login = async (credentials: {username: string, password: string}) => {
        const response = await fetch(loginEndpoint,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            }
        );

        if (!response.ok){

            alert(response.body)
            console.log(response)
        }
        else{
            const userResponseDto = await response.json()
            console.log(userResponseDto)
            setupUser(userResponseDto)
            return true;
        }
        return false;
    }





    const handleSumbit = async (e :  React.MouseEvent<HTMLInputElement, MouseEvent>) => {

        e.preventDefault();

        try {
            let authenticated = await login({username, password})
            if (authenticated){
                navigate('/home')
            }
        } catch (error) {
            // @ts-ignore
            alert("ERROR MESSAGE:" + error.message)
            // @ts-ignore
            console.log(error.message)
        }
    }


    return (
        <div>
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="userName" onChange={(e) => setUsername(e.target.value)}/><br/><br/>
                <label htmlFor="password">Password:</label>
                <input type="text" id="password" onChange={(e) => setPassword(e.target.value)}/><br/><br/>
                <input type="submit" value="Submit" onClick={(e) =>
                    handleSumbit(e)}/>
            </form>
            <button onClick={() => navigate('/sign-up')}> Sign Up</button>
        </div>
    );
}

export default LoginPage;