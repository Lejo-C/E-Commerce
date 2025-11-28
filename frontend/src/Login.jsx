import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () =>{
const [formData, setFormData] = useState({email:"", password:""})
const Navigate = useNavigate();

const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
        const response = await axios.post("http://localhost:5000/api/users/login", formData, {withCredentials:true});

        if(response.data.role==="merchant"){
            Navigate("/merchant-dashboard")
        }else{
            Navigate("/home")
        }
        console.log(response.data);
    }
    catch(error){
        console.log(error);
    }
}


    return(
        <form onSubmit={handleSubmit}>
            <input placeholder="Email" type="text" value={formData.email} onChange= {(e)=>setFormData({...formData, email:e.target.value})}/>
            <input placeholder="Password" type="password" value={formData.password} onChange= {(e)=>setFormData({...formData, password:e.target.value})}/>
            <button type="submit">Login</button>
        </form>
    )
}

export default Login