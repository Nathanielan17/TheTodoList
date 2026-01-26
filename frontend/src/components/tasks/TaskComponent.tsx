import {ActionIcon, Group, Menu, Paper, Text, Radio, Divider, CheckIcon} from '@mantine/core';
import {IconDotsVertical, IconTrash} from '@tabler/icons-react'
import type { UseFormReturnType } from '@mantine/form';
import * as taskRepo from "../../repositories/tasks/taskRepository";
import * as endpoints from "../../config/endpoints";


interface taskMenuProps {
    task: taskType,
    taskEditForm: UseFormReturnType<{taskId: bigint, taskDesc: string, taskStatus: boolean}>,
    open: () => void,
    deleteTask: (taskId: bigint) => void
}

function TaskMenu(props: taskMenuProps){
    const form = props.taskEditForm;
    const task = props.task;
    const open = props.open;

    return <>
        <Menu>
            <Menu.Target>
                <ActionIcon size="sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <IconDotsVertical/>
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={(e) => {
                        e.stopPropagation()
                        form.setValues(
                            {
                                taskId: task.taskId,
                                taskDesc: task.taskDesc,
                                taskStatus: task.taskStatus
                            }
                        );
                        form.setFieldValue('taskStatus', task.taskStatus);
                        open();
                    }}
                >
                    <Text>Edit</Text>
                </Menu.Item>
                <Menu.Item
                    color={"red"}
                    rightSection={<IconTrash size={14}/>}
                    onClick={(e) => {
                        e.stopPropagation()
                        taskRepo.deleteTask(`http://localhost:8080/todos/${task.taskId}`, task.taskId).then(
                            (success) => {
                                if (success){
                                    props.deleteTask(task.taskId)
                                }
                                else{
                                    alert("Failed To Delete Task")
                                }
                            }
                        )
                    }}
                >
                    <Text>
                        Delete
                    </Text>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </>
}

export interface taskType {
    taskId: bigint,
    taskDesc: string,
    taskStatus: boolean
}


export interface TaskComponentProps {
    taskInfo: taskType,
    taskEditForm: UseFormReturnType<{taskId: bigint, taskDesc: string, taskStatus: boolean}>,
    open: () => void,
    editTask: (task: taskType) => void,
    deleteTask: (taskId: bigint) => void,
}

export const createTaskObj = (id: bigint, desc: string, status: boolean) : taskType => {
    return {
        taskId: id,
        taskDesc: desc,
        taskStatus: status
    }
}

const handleTaskEdit = async (task: taskType, editTask: (task: taskType) => void) => {
    const success = await taskRepo.updateTask(endpoints.tasks + `/${task.taskId}`,
        {
            task: task.taskDesc,
            completed: task.taskStatus
        }
    );
    success ? editTask(task) : alert("Could not edit task");
}

const handleTaskClick = (e: React.MouseEvent, props: TaskComponentProps) => {
    e.preventDefault()
    e.stopPropagation()

    if (e)
    props.taskEditForm.setValues(
        {
            taskId: props.taskInfo.taskId,
            taskDesc: props.taskInfo.taskDesc,
            taskStatus: props.taskInfo.taskStatus
        }
    );

    props.taskEditForm.setFieldValue('taskStatus', props.taskInfo.taskStatus);
    props.open();
}


export function TaskComponent(props : TaskComponentProps){
    // const taskInfo = props.taskInfo;
    return <>
        <Divider/>
        <Paper
            key={props.taskInfo.taskId}
            p={"lg"}
            // withBorder
            // onClick={(e) => console.log("Click")}
            onClick={(e) => handleTaskClick(e, props)}
        >
            <Group justify={"space-between"}>
                <Group>
                    <Radio
                        icon={CheckIcon}
                        checked={props.taskInfo.taskStatus}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleTaskEdit(
                                {
                                    ...props.taskInfo,
                                    taskStatus: !props.taskInfo.taskStatus
                                },
                                props.editTask).then()
                        }}
                    />
                    <Text
                        {...(props.taskInfo.taskStatus && {td: "line-through", c:"gray"})}
                    >
                        {props.taskInfo.taskDesc}
                    </Text>

                </Group>
                {/*<TaskMenu*/}
                {/*    task={props.taskInfo}*/}
                {/*    taskEditForm={props.taskEditForm}*/}
                {/*    open={props.open}*/}
                {/*    deleteTask={props.deleteTask}*/}

                {/*/>*/}
            </Group>
        </Paper>
        {/*<Divider/>*/}
    </>
}

