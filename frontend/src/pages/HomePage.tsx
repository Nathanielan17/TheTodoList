import {useNavigate} from 'react-router-dom'
import { AppShell, Avatar, Group, Title, Grid} from '@mantine/core';
import { TaskManager } from '../components/tasks/TaskManager.tsx'


function HomePage(){

    const navigate = useNavigate();

    return (
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
                <Grid>
                    <Grid.Col span={2}>1</Grid.Col>
                    <Grid.Col span={8}
                    >
                        <TaskManager/>

                    </Grid.Col>
                    <Grid.Col span={2}>3</Grid.Col>
                </Grid>
            </AppShell.Main>
        </AppShell>
    );

}

export default HomePage;