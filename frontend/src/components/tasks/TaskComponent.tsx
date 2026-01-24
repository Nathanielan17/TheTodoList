import {ActionIcon, Checkbox, Group, Menu, Paper, Modal, TextInput, Button} from '@mantine/core';
import {IconDotsVertical, IconTrash} from '@tabler/icons-react'
import type { UseFormReturnType } from '@mantine/form';
import * as taskRepo from "../../repositories/tasks/taskRepository";
import * as endpoints from "../../config/endpoints";

interface TaskFormModalProps {
    ModalForm: UseFormReturnType<{taskDesc: string, taskStatus: boolean}>,
    opened: boolean,
    open: () => void,
    close: () => void,
    TaskInfo: taskType,
    editTask: (task: taskType) => void,
    deleteTask: (taskId: bigint) => void
}



export function TaskEditModal (props: TaskFormModalProps) {
    const form = props.ModalForm;
    return <>
            <Modal opened={props.opened} onClose={props.close} title={"Edit Modal"} centered>
                <form onSubmit={form.onSubmit((values) =>
                {
                    props.editTask({...props.TaskInfo, taskDesc: values.taskDesc, taskStatus: values.taskStatus})
                    props.close();
                })}>
                    <TextInput
                        label={"Task"}
                        key={form.key("taskDesc")}
                        {...form.getInputProps("taskDesc")}

                    />
                    <Checkbox
                        mt={"md"}
                        label={"Status"}
                        key={form.key("taskStatus")}
                        {...form.getInputProps("taskStatus", {type: 'checkbox'})}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Modal>
        </>
}

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
                <ActionIcon size="sm">
                    <IconDotsVertical/>
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => {
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
                    Edit
                </Menu.Item>
                <Menu.Item
                    color={"red"}
                    leftSection={<IconTrash size={14}/>}
                    onClick={() => {
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
                    Delete
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

export function TaskComponent(props : TaskComponentProps){
    // const taskInfo = props.taskInfo;
    return <>
        <Paper
            key={props.taskInfo.taskId}
            p={"sm"}
            withBorder
        >
            <Group justify={"space-between"}>
                <Group>
                    <Checkbox
                        checked={props.taskInfo.taskStatus}
                        onClick={() => {
                            handleTaskEdit(
                                {
                                    ...props.taskInfo,
                                    taskStatus: !props.taskInfo.taskStatus
                                },
                                props.editTask).then()
                        }}
                    />
                    {props.taskInfo.taskDesc}
                </Group>
                <TaskMenu
                    task={props.taskInfo}
                    taskEditForm={props.taskEditForm}
                    open={props.open}
                    deleteTask={props.deleteTask}
                />
            </Group>
        </Paper>
    </>
}

