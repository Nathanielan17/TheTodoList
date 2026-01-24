import {useNavigate} from "react-router-dom";
import {useState, useContext} from "react";
import {UserContext, type UserContextType} from "../UserContext";

function SignUpPage (){
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {updateUser} : UserContextType= useContext(UserContext)

    const registerEndpoint = 'http://localhost:8080/users/register';

    const register = async (credentials: {username: string, password: string}) => {
        const response = await fetch(registerEndpoint,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(credentials)
            }
        );

        if (!(response.status === 201)){
            alert(response.body)
        }
        else{
            const userResponseDto = await response.json()
            updateUser(userResponseDto)
            return true;
        }
        return false;
    }

    const handleSumbit = async (e :  React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();

        try {
            let authenticated = await register({username, password})
            if (authenticated){
                navigate('/home')
            }
        } catch (error) {
            alert(error)
        }
    }



    return (
        <div>
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="userName" onChange={(e) => setUsername(e.target.value)}/><br/><br/>
                <label htmlFor="password">Password:</label>
                <input type="text" id="password" onChange={(e) => setPassword(e.target.value)}/><br/><br/>
                <input type="submit" value="Submit" onClick={(e) => handleSumbit(e)}/>
            </form>
            <button onClick={() => navigate('/')}>Login</button>
        </div>
    )
}

export default SignUpPage;