export type Status = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'
export interface Project {
    id: number,
    name: string,
    description: string,
    created_at: string,
    tasks:Task
}
 
export interface Task {
    id: number,
    title: string,
    description: string,
    due_date: string,
    created_at: string,
    status: Status,
    priority:Priority, 
    project_id: number
}