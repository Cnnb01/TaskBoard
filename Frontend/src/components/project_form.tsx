import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
    const [formData, setFormData] = useState({
        name:'',
        description:''
    })
    const navigate = useNavigate()
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        // console.log(formData)
        try {
            const res = await api.post(`/projects/`, formData)
            console.log("DATA BEING SENT=>",res)
            navigate("/")
        } catch (error) {
            console.error("ERROR=>",error)
        }
        setFormData({
            name:'',
            description:''
        })
    }
    
    return(
    <div>
        <form onSubmit={handleSubmit}>
            <input name="name" onChange={handleChange}/>
            <textarea name="description" onChange={handleChange}/>
            <button type="submit">Submit</button>
        </form>
    </div>
    )
}

export default ProjectForm;