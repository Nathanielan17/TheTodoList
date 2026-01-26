import type {taskType} from './TaskComponent';
import {Checkbox, Group, Modal, TextInput, Button, Drawer} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import * as endpoints from "../../config/endpoints";
import * as taskRepo from "../../repositories/tasks/taskRepository";

interface editDrawerProps {
    form: UseFormReturnType<{taskId: bigint, taskDesc: string, taskStatus: boolean}>
    opened: boolean,
    close: () => void,
    editTask: (task: taskType) => void
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


export function TaskEditDrawer(props: editDrawerProps){

    const form = props.form;


    return (
        <>
            <Drawer offset={0} radius={"md"} opened={props.opened} onClose={props.close} title={"EditForm"} position={"right"}>
                <form onSubmit={form.onSubmit((values) =>
                {
                    handleTaskEdit({
                        taskId: values.taskId,
                        taskDesc: values.taskDesc,
                        taskStatus: values.taskStatus
                    }, props.editTask).then()
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
            </Drawer>
        </>
    );

}