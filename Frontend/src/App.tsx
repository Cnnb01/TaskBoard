import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import ProjectTasks from './pages/projectTasks'
import CreateProject from './pages/createProject'
import CreateTask from './pages/createTask'
import EditProject from './pages/editProject'
import EditTask from './pages/editTask'

function App() {
  return (
    <>
      <section id="center">
        HELLLO
        <h1>WELCOME TO TASKBOARD</h1>
        <h2>TRACK YOUR TASKS</h2>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/projects/:id/tasks" element={<ProjectTasks/>}/>
          <Route path="/create-project" element={<CreateProject/>}/>
          <Route path="/projects/:id/create-task" element={<CreateTask/>}/>
          <Route path="/projects/:id/edit-project" element={<EditProject/>}/>
          <Route path="/projects/:id/tasks/:taskId/edit-task" element={<EditTask/>}/>
        </Routes>
        </BrowserRouter>
      </section>
    </>
  )
}

export default App
