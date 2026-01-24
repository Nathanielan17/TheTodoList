import {useNavigate} from 'react-router-dom'
import {useState} from "react";
import { Button, Checkbox, Group, TextInput, Center, Flex, Stack, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import token from "../lib/token";


function LoginPage (){
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginEndpoint = 'http://localhost:8080/auth/login';


    async function login(loginInput : {username: string, password: string}): Promise<void>{

        let username = loginInput.username;
        let password = loginInput.password;

        try {
            let response = await fetch(loginEndpoint,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            username: username,
                            password: password
                        }
                    )
                });

            if (!response.ok) {
                alert("Failed to login")
                return;
            }
            const json = await response.json();
            token.setToken("accessToken", json.token);

            navigate('/home')
        } catch (err){
            // @ts-ignore
            alert(err.message)
        }
    }

    const form = useForm({
        mode: 'controlled',
        initialValues:  {
            username: '',
            password: ''
        }
    })

    return (
        <Flex
            justify='center'
            align='center'
            style={{minHeight: '100vh'}}
        >
            <Center>
                <form onSubmit={form.onSubmit((values) => login(values))}>
                    <TextInput
                        label="Username"
                        placeholder="username"
                        size='md'
                        key={form.key('username')}
                        {...form.getInputProps('username')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="password"
                        size='md'
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />
                    <Group justify="center" mt="md">
                        <Stack>
                            <Button size="md" type="submit">Submit</Button>
                            <Button size="md">Sign Up</Button>
                        </Stack>
                    </Group>
                </form>
            </Center>
        </Flex>
    )


    return (
        <div>
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="userName" onChange={(e) => setUsername(e.target.value)}/><br/><br/>
                <label htmlFor="password">Password:</label>
                <input type="text" id="password" onChange={(e) => setPassword(e.target.value)}/><br/><br/>
                <input type="submit" value="Submit" onClick={(e) =>
                    login(e, username, password)}/>
            </form>
            <button onClick={() => navigate('/sign-up')}> Sign Up</button>
        </div>
    );
}

export default LoginPage;