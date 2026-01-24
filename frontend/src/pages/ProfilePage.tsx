import {UserContext, type UserContextType} from '../UserContext'
import {useContext} from 'react'
import {useNavigate} from 'react-router-dom'


function ProfilePage() {

    const {user} : UserContextType= useContext(UserContext)

    const navigate = useNavigate();

    const deleteEndpoint = `http://localhost:8080/users/${user.id}`;

    const deleteAccount = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        try {
            const response = await fetch(deleteEndpoint,
            {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );

            if (!response.ok){
                const data = await response.json();
                alert(data.message);
            }

            navigate("/");
            return;
        } catch (e) {

            // @ts-ignore
            alert(e.message)
        }
    }

    return (
        <div>
            <div>Hello {user.username}</div>
            <br/>
            <button onClick={() => navigate("/profile/change-password")}>Change Passwords?</button>
            <br/>
            <button onClick={(e) => deleteAccount(e)}>Delete Account?</button>
            <br/>
            <button onClick={() => navigate("/home")}>Home</button>
        </div>
    );
}

export default ProfilePage;