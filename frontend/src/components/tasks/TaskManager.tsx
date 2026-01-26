import {useEffect, useState} from 'react'
import {Input, Stack, Title, ScrollArea, Box} from '@mantine/core';
import type {taskType} from './TaskComponent';
import { useTasks } from '../../lib/useTasks'
import { useForm  } from '@mantine/form';
import { TaskComponent, createTaskObj } from './TaskComponent'
import { TaskEditModal } from './TaskEditModal'
import { TaskEditDrawer } from './TaskEditDrawer'
import { useDisclosure } from '@mantine/hooks';
import * as taskRepo from "../../repositories/tasks/taskRepository.tsx";
import * as endpoints from "../../config/endpoints";
import React from "react";

export function TaskManager(){

    const [tasks, { editTaskState, setTaskState, deleteTaskState, addTaskState }] = useTasks();
    const [opened, { open, close }] = useDisclosure(false, {});
    const [newTask, setNewTask] = useState<string>("");


    // Retrieve all tasks associated with user
    useEffect(() => {
        taskRepo.getTasks(endpoints.tasks).then(
            data => {
                if (data) {
                    const tasks: taskType[] = data.map((t: any): taskType => {
                            return {
                                taskId: t.id,
                                taskDesc: t.task,
                                taskStatus: t.completed
                            };
                        }
                    )
                    setTaskState(tasks);
                }
            }
        )
    }, []);

    // handle adding a new task
    const handleAddTask = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter"){
            event.preventDefault();
            if (newTask.length > 0) {
                taskRepo.createTask(endpoints.tasks, newTask).then((res) => {
                    if (res) {
                        const newTask = createTaskObj(res.id, res.task, res.completed);
                        addTaskState([newTask]);
                        setNewTask('');
                    }
                })
            }
        }
    }

    const taskEditForm = useForm({
        mode: 'controlled',
        initialValues: {
            taskId: 0n as bigint,
            taskDesc: "",
            taskStatus: false
        }
    });

    const { completedTasks, incompleteTasks } = tasks.reduce<{
        completedTasks: taskType[];
        incompleteTasks: taskType[];
    }>(
        (acc, task) => {
            if (task.taskStatus){
                acc.completedTasks.push(task)
            }
            else {
                acc.incompleteTasks.push(task)
            }
            return acc;
        }, { completedTasks: [], incompleteTasks: [] }
    );

    return (
        <Box

        >
            {/*<Stack*/}
            {/*    h={"90vh"}*/}
            {/*    align={"stretch"}*/}
            {/*    justify={"space-between"}*/}

            {/*    // gap={"xs"}*/}
            {/*>*/}

                <Title order={1}>List</Title>
                <Title order={4}>Tasks</Title>
                <br/>
                <TaskEditDrawer form={taskEditForm} opened={opened} close={close} editTask={editTaskState} />

                {/*{incompleteTasks.length > 0 ? (*/}
                {/*    <ScrollArea>*/}
                {/*        <Stack*/}
                {/*            gap={"1"}*/}
                {/*        >*/}
                {/*            {incompleteTasks.map((task) =>*/}

                {/*                (<TaskComponent*/}
                {/*                        taskInfo={task}*/}
                {/*                        taskEditForm={taskEditForm}*/}
                {/*                        open={open}*/}
                {/*                        deleteTask={deleteTaskState}*/}
                {/*                        editTask={editTaskState}/>*/}
                {/*                )*/}

                {/*            )}*/}
                {/*        </Stack>*/}
                {/*    </ScrollArea>*/}
                {/*)}*/}



                    <Box>
                    {incompleteTasks.length > 0 ? (
                            <Stack
                                gap={"1"}
                            >
                                {incompleteTasks.map((task) =>

                                    (<TaskComponent
                                            taskInfo={task}
                                            taskEditForm={taskEditForm}
                                            open={open}
                                            deleteTask={deleteTaskState}
                                            editTask={editTaskState}/>
                                    )

                                )}
                            </Stack>
                    ): null}
                    </Box>
                    <br/>

                    <Box>
                    {completedTasks.length > 0 ? (
                        <>
                            <Title order={5}>Completed</Title>
                            <br/>

                            <Stack
                                gap={"1"}
                            >
                                {completedTasks.map((task) =>

                                    (<TaskComponent
                                            taskInfo={task}
                                            taskEditForm={taskEditForm}
                                            open={open}
                                            deleteTask={deleteTaskState}
                                            editTask={editTaskState}/>
                                    )

                                )}
                            </Stack>

                        </>

                    ): null}
                    </Box>

                <Input
                    placeholder={"Add a Task"}
                    value={newTask} onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => handleAddTask(e)}
                    style={{
                        position: "sticky",
                        bottom: 0,
                        zIndex: 100,
                        padding: '1rem',
                        flexDirection: 'row',
                        backdropFilter: 'blur(1px)'
                    }}
                />


            {/*</Stack>*/}
        </Box>
    );
}

