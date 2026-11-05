import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import ProjectTasks from './pages/projectTasks'
import ProjectForm from './components/project_form'
import TaskForm from './components/task_form'
import Summary from './pages/summary'

function App() {
  return (
    <>
      <section id="center">
        <header className="px-6 py-6 border-b border-stone-200">
          <h1 className="text-2xl font-bold tracking-tight text-stone-500">TaskBoard</h1>
          <p className="text-stone-400 text-sm mt-0.5">Keep your work in order</p>
        </header>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/projects/:id/tasks" element={<ProjectTasks/>}/>
          <Route path="/create-project" element={<ProjectForm mode="create"/>}/>
          <Route path="/projects/:id/create-task" element={<TaskForm mode='create'/>}/>
          <Route path="/projects/:id/edit-project" element={<ProjectForm mode="edit"/>}/>
          <Route path="/projects/:id/tasks/:taskId/edit-task" element={<TaskForm mode="edit"/>}/>
          <Route path="/projects/:id/summary" element={<Summary/>} />
        </Routes>
        </BrowserRouter>
      </section>
    </>
  )
}

export default App
