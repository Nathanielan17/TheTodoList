import {UserContext} from '../UserContext'
import {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'


function ChangePasswordPage(){
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const endpoint = `http://localhost:8080/users/${user.id}/change-password`;

    const sendPasswordRequest = async (e :  React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();

        try {
            const response = await fetch(endpoint,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            oldPassword: oldPassword,
                            newPassword: newPassword
                        }
                    )
                }


            );



            if (!response.ok){
                const responseData = await response.json();
                alert(responseData.message)
            }

            return;

        } catch (e) {
            // @ts-ignore
            alert(e.message)
        }
    }

    return (
        <div>
            <form>
                <label htmlFor="oldPassword">Old Password:</label>
                <input type="text" id="oldPassword" onChange={(e) => setOldPassword(e.target.value)}/><br/><br/>
                <label htmlFor="newPassword">New Password:</label>
                <input type="text" id="newPassword" onChange={(e) => setNewPassword(e.target.value)}/><br/><br/>
                <input type="submit" value="Submit" onClick={(e) =>
                    sendPasswordRequest(e)}/>
            </form>
            <br/>
            <button onClick={() => navigate("/profile")}>Back To Profile Page</button>
        </div>
    );
}

export default ChangePasswordPage