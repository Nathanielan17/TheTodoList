import {useNavigate} from 'react-router-dom'
import { AppShell, Avatar, Group, Title, Grid} from '@mantine/core';
import { TaskManager } from '../components/tasks/TaskManager.tsx'


function HomePage(){

    const navigate = useNavigate();

    return (
        <AppShell
            padding="md"
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                // collapsed: { mobile: !opened },
            }}
        >
            <AppShell.Header>
                <Group justify={"space-between"}>
                    <Title>Basic</Title>
                    <Avatar component="a" radius="xl" src={null} alt="Profile" size="lg" color="orange" onClick={() => navigate('/profile')}/>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>Navbar</AppShell.Navbar>
            <AppShell.Main
            bg={"white"}
            >
                <Grid style={{ flex: 1, margin: 0 }}>
                    <Grid.Col span={1}>1</Grid.Col>
                    <Grid.Col span={8}
                              style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <TaskManager/>
                    </Grid.Col>
                    <Grid.Col span={3}>3</Grid.Col>
                </Grid>
            </AppShell.Main>
        </AppShell>
    );

}

export default HomePage;