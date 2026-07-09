import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import ProjectTasks from './pages/projectTasks'
import ProjectForm from './components/project_form'
import TaskForm from './components/task_form'

function App() {
  return (
    <>
      <section id="center">
        <h1>WELCOME TO TASKBOARD</h1>
        <h2>TRACK YOUR TASKS</h2>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/projects/:id/tasks" element={<ProjectTasks/>}/>
          <Route path="/create-project" element={<ProjectForm mode="create"/>}/>
          <Route path="/projects/:id/create-task" element={<TaskForm mode='create'/>}/>
          <Route path="/projects/:id/edit-project" element={<ProjectForm mode="edit"/>}/>
          <Route path="/projects/:id/tasks/:taskId/edit-task" element={<TaskForm mode="edit"/>}/>
        </Routes>
        </BrowserRouter>
      </section>
    </>
  )
}

export default App
