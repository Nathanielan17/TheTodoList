import {useNavigate} from 'react-router-dom'

function Login (){
    const navigate = useNavigate();

    return (
        <div>
            <form action="" method="get">
                <label htmlFor="username">Username:</label>
                <input type="text" id="userName"/><br/><br/>
                <label htmlFor="password">Password:</label>
                <input type="text" id="password"/><br/><br/>
                <input type="submit" value="Submit"/>
            </form>
            <button onClick={() => navigate('/sign-up')}> Sign Up</button>
        </div>
    );
}

export default Login;