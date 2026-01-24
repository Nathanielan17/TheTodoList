import React from "react";
import type {taskType} from '../components/tasks/TaskComponent.tsx';

export function useTasks(initalTasks: taskType[]  = []) {
    const [state, setState] = React.useState(initalTasks);

    const handlers = React.useMemo(
        () => ({
            editTaskState: (updatedTask: taskType) => {
                setState((s) => s.map((current) => {
                    return current.taskId === updatedTask.taskId ? updatedTask : current;
                }));
            },
            setTaskState: (tasks: taskType[]) => {
                setState(tasks);
            },
            addTaskState: (tasks: taskType[]) => {
                setState((s) => [...s, ...tasks]);
            },
            deleteTaskState: (taskId: bigint) => {
                setState((s) => s.filter(t => t.taskId !== taskId))
            }
        }),
        [],
    );
    return [state, handlers] as const;


}

