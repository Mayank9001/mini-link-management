import { React, useState, useEffect } from 'react'
import cuvette from '../assets/cuvette.png';
import m_image from '../assets/m_image.png';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../services/user.services';

const Login = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: "",
        password:"",
    });
    const [error, setError] = useState("");
    const validateInput = () => {
        const newError = {};
        if(!formData.email.trim()){newError.email="Email Required!"}
        if(!formData.password.trim()){newError.password="Password Required!"}
        setError(newError);
        return Object.keys(newError).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        if(!validateInput()){
            return console.log("All Fields Required!");
        }
        try {
            const res = await userLogin(formData);
            const data = await res.json();
            if(res.status === 200)
            {
                console.log(data);
                localStorage.setItem("token", data.token);
                alert(data.message);
            }
            else{
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
        <div className={styles.main}>
            <div className={styles.image}>
                <img src={cuvette} alt="cuvette" className={styles.logo}/>  
                <img src={m_image} alt="m_image" className={styles.landscape} />
            </div>
            <div className={styles.buttons}>
                <button onClick={() => navigate('/signup')} className={styles.signup}>SignUp</button>
                <button onClick={() => navigate("/")} className={styles.login}>Login</button>
            </div> 
            <p className={styles.login1}>Login</p>
            <div className={styles.form}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.email}>
                        <input type='text' value={formData.email} placeholder='Email id'
                        onChange={(e) => setFormData({...formData, email:e.target.value})} 
                        style={error.email && { border: "1px solid red" }}required/>
                        <p style={{ visibility: error.email ? "visible" : "hidden" }}>
                            {error.email || "Field Requires"}
                        </p>
                    </div>
                    <div>
                        <input 
                            type='password' value={formData.password} placeholder='Password' onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                            required/>
                    </div>
                    <div className={styles.loginbtn}>
                        <button type='submit'>Login</button>
                    </div>
                    <div className={styles.submit}>
                        <p>Don't have an account? 
                            <a onClick={()=>navigate("/signup")}>SignUp</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login