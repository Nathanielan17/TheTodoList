import {type UserType} from '../UserContext'
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ActionIcon, AppShell, Avatar, Checkbox, Group, Input, Menu, Paper, Stack, Title, Modal, TextInput, Button} from '@mantine/core';
import {IconDotsVertical, IconTrash} from '@tabler/icons-react'
import { useForm } from '@mantine/form';



import { useDisclosure } from '@mantine/hooks';


interface todoType {
    id: bigint,
    task: string,
    completed: boolean
}


function HomePage(){

    const navigate = useNavigate();
    // const {user} : UserContextType= useContext(UserContext)
    const storedUser = sessionStorage.getItem('user')
    const user : UserType | null = storedUser ? JSON.parse(storedUser) : null;

    if (user === null) {
        navigate("/");
        return;
    }


    const [todos, setTodos] = useState<Array<todoType>>([]);
    const [opened, { open, close }] = useDisclosure(false);

    // const [isOpen, setOpen] = useState(false);
    const [newTask, setNewTask] = useState<string>("");
    const [editingTodo, setEditingTodo] = useState<todoType | null>(null)
    // const [opened, { toggle }] = useDisclosure();

    const todosEndpoint = `http://localhost:8080/todos/${user.id}`;

    const getTodos = async () => {
        const response = await fetch(todosEndpoint,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok){
            alert("Error Occurred")
        }

        return await response.json();

    }

    useEffect(() => {
        // Get all todos related to user
        try {
            (async () => {
                const data = await getTodos();
                setTodos(data);
            })();
        } catch (error) {
            alert(error)
        }
    }, []);

    const createTodoEndpoint = `http://localhost:8080/todos/${user.id}/create`;

    const createNewTodo = async (taskDesc: string) => {
        const response = await fetch(createTodoEndpoint,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({task : taskDesc})
            }
        );
        if (!(response.status === 201)){
            alert(response.body)
        }
        const res: Promise<todoType> = response.json()
        return res;
    }
    //
    const handleCreateTodo =  async () => {
        try {
            const  todoResponse = await createNewTodo(newTask)

            const newTodo: todoType = {
                id: todoResponse.id,
                task : todoResponse.task,
                completed: false
            }
            setTodos([
                ...todos,
                newTodo
            ]);
        } catch (error) {
            // @ts-ignore
            alert("ERROR:" + error.message)
        }
    }

    const deleteTodo = async (todoId: bigint) => {
        const endpoint = `http://localhost:8080/todos/${todoId}`;
        const response = await fetch (endpoint,
            {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (!response.ok) {
            alert(response)
            return false;
        }

        return true;
    }

    const deleteTask = async (todoId: bigint) => {
        try {
            const success = await deleteTodo(todoId);
            if (success){
                setTodos(
                    todos.filter(t =>
                        t.id !== todoId
                    )
                )
            }
            else{
                alert("Failed To delete")
            }

        } catch (e){
            alert("Error: " + e)
        }
    }

    const updateTodo = async (todo: todoType) => {
        const updateTodoEndpoint = `http://localhost:8080/todos/${todo.id}`;
        const response = await fetch(updateTodoEndpoint,
            {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newTask: todo.task,
                    completed: todo.completed
                })
            }
        );
        if(!response.ok){
            alert(response)
        } else{
            return;
        }
    }

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            task: "",
            completed: false
        }
    });

    const handleEditingTodo = async (values : {task: string, completed: boolean}) => {
        if (editingTodo !== null){

            setTodos(todos.map(t =>
                (t.id === editingTodo.id && (t.task !== values.task || t.completed !== values.completed)) ? {...t, task: values.task, completed: values.completed} : t
            ))

            const editedTodo = {...editingTodo, task:values.task, completed: values.completed};
            await  updateTodo(editedTodo)

        }
    }

    const todoEditModal = () => {



        return <>
                    <Modal opened={opened} onClose={close} title={"Edit Modal"} centered>
                        <form onSubmit={form.onSubmit((values) =>
                            {
                                handleEditingTodo(values);
                                close();
                            })}>
                            <TextInput
                                label={"Task"}
                                key={form.key("task")}
                                {...form.getInputProps("task")}
                                // value={editingTask}
                            />
                            <Checkbox
                                mt={"md"}
                                label={"Completed"}
                                key={form.key("completed")}
                                {...form.getInputProps("completed", {type: 'checkbox'})}
                                // checked={editingStatus}
                            />
                            <Group justify="flex-end" mt="md">
                                <Button type="submit">Submit</Button>
                            </Group>
                        </form>
                    </Modal>
                </>
    }

    // useEffect(() => {
    //     todos.map(todo => {
    //         form.setValues(
    //             {
    //                 task: todo.task,
    //                 completed: todo.completed
    //             }
    //         );
    //     })
    // }, [todos]);
    const todoMenu = (todo:todoType) => {

        return <>
                <Menu>
                    <Menu.Target>
                        <ActionIcon size="sm">
                            <IconDotsVertical/>
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            onClick={() => {
                                console.log(todo.task, todo.completed)
                                form.setValues(
                                    {
                                        task: todo.task,
                                        completed: todo.completed
                                    }
                                );
                                form.setFieldValue('completed', todo.completed);
                                setEditingTodo(todo);
                                open();
                            }}
                        >
                            Edit
                        </Menu.Item>
                        <Menu.Item
                            color={"red"}
                            leftSection={<IconTrash size={14}/>}
                            onClick={() => {
                                deleteTask(todo.id)
                            }}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </>
    }





    const handleChecked = async (todo: todoType) => {

        await updateTodo({...todo, completed: !todo.completed});

        setTodos(todos.map(t =>
            t.id === todo.id ? {...t, completed: !t.completed}
                :t
        ))


    }

    const tempTodoComponent = (todo: todoType) =>
         (
                    <Paper
                        key={todo.id.toString()}
                        p={"sm"}
                        withBorder
                    >
                    <Group justify={"space-between"}>
                        <Group>
                        <Checkbox
                            checked={todo.completed}
                            onClick={() => handleChecked(todo)}
                        />
                        {todo.task}
                        </Group>
                        {todoMenu(todo)}
                    </Group>
                    </Paper>
        );

    // Handle hitting Enter when adding a Task
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter"){
            event.preventDefault();
            if (newTask.length > 0) {
                handleCreateTodo();
                setNewTask("");
            }
            console.log("Pressed Enter")
        }
    }





    const revisedHome = (
        <AppShell
            padding="md"
            navbar={{
                width: 300,
                breakpoint: 'sm',
                // collapsed: { mobile: !opened },
            }}
        >
            <AppShell.Navbar>Navbar</AppShell.Navbar>

            <AppShell.Main>
                <Group justify={"space-between"}>
                    <Title>Tasks:</Title>
                    <Avatar component="a" radius="xl" src={null} alt="Profile" size="lg" color="orange" onClick={() => navigate('/profile')}/>
                </Group>
                <Stack
                    align={"stretch"}
                    justify={"space-between"}
                >
                    {todoEditModal()}
                <Stack
                    h={500}
                    bg="var(--mantine-color-body)"
                    align="stretch"
                    justify="flex-start"
                    gap={1}
                >
                        {todos.map(t =>
                            tempTodoComponent(t))}

                </Stack>
                    <Input
                        placeholder={"Add a Task"}
                        value={newTask} onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}

                    />
                </Stack>
            </AppShell.Main>
        </AppShell>
    );

    return revisedHome;

    // return (
    //     <div>
    //         Welcome {user.username} ! <br/>
    //         <div>Todo List</div>
    //         <div>
    //             {todos.map(t =>
    //                 <ul>{t.task}</ul>)}
    //         </div>
    //         <br/>
    //         <button onClick={() => navigate('/profile')}>Go To Your Profile</button>
    //         <button onClick={() => navigate("/")}>Logout</button>
    //         <br/>
    //         <button onClick={() => setOpen(true)}>Add A Todo!</button>
    //         <br/>
    //         {
    //             isOpen && (
    //                 addTodoModule
    //             )
    //         }
    //     </div>
    // );
}

export default HomePage;