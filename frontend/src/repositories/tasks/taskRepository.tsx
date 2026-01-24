import token from "../../lib/token";
// import {authFetch} from "../../lib/helper"

export const getTasks = async (url: string) => {
    const jwtToken: string =  token.getToken("accessToken") ?? ""
        const res = await fetch(
            url,
            {
                method: 'GET',
                credentials: 'include',
                headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + jwtToken
                    }

            }
        );
        if (!res.ok){
            alert("Failed to login");
            return null;
        }
        return await res.json();
}

export const createTask = async (url: string, createdTask: string) => {
    const jwtToken: string | null =  token.getToken("accessToken")
    if (jwtToken) {
        const response = await fetch(
            url,
            {
                method: 'POST',
                headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + jwtToken
                    },
                body: JSON.stringify({task : createdTask})


            }
        );

        if (response.status !== 201) {
            alert("Failed to create task");
            return null;
        }
        else {
            return await response.json();
        }
    }
}

export const deleteTask = async (url: string, taskId: bigint) => {
    const jwtToken: string | null = token.getToken("accessToken")
    const success = true;
    if (jwtToken) {
        const response = await fetch(
            url,
            {
                method: 'DELETE',
                headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + jwtToken
                    },
                body: JSON.stringify({taskId : taskId})


            }
        );

        if(!response.ok){
            alert("Failed to delete task")
            return !success;
        }

        return success;
    }
    return !success;
}

export const updateTask = async (url: string, values : {task: string, completed: boolean})=> {
    const jwtToken: string | null = token.getToken("accessToken")
    const success = true;
    if (jwtToken) {
        const response = await fetch(
            url,
            {
                method: 'PATCH',
                headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + jwtToken
                    },
                body: JSON.stringify(
                    {
                        newTask: values.task,
                        completed: values.completed
                    }
                )
            }
        );

        if(!response.ok){
            alert("Failed to update task")
            return !success;
        }

        return success;
    }
    return !success;
}







