import React, {useState,useEffect} from 'react'
import Dashboard from './Dashboard'
import styles from './Settings.module.css'
import { jwtDecode } from 'jwt-decode'
import { userUpdate, userDelete } from '../services/user.services'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [newData, setNewData] = useState({
    newEmail:"",
    newName:"",
    newMobileNo:"",
  })
  const getuser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = jwtDecode(token);
          // console.log("Decoded Token Data:", data);
          setUser(data);
          if(data){
            setNewData({
              newEmail:data?data.email:"",
              newName:data?data.name:"",
              newMobileNo:data?data.mobileNo:"",
            });
          }
        } catch (error) {
          console.log("Failed to decode token:", error);
        }
      }
    };
    
    const handleSaveChange = async () =>{
      // console.log(newData);
      try {
        const res = await userUpdate(newData);
        const data = await res.json();
        if(res.status===200)
        {
          console.log(data.message);
        }
        else{
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const handleDelete = async () =>{
      try{
        const res = await userDelete();
        const data = await res.json();
        if(res.status===200)
        {
          console.log(data.message);
          navigate('/');
        }
        else{
          console.log(data.message);
        }
      }catch(error){
        console.log(error);
      }
    };
    useEffect(() => {
      getuser();
    }, []);
    // console.log(newData);
    return (
    <>
      <Dashboard />
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.ipt}>
            <h3>Name</h3>
            <input type='text' defaultValue={user?user.name:""} onChange={(e)=>setNewData({...newData, newName:e.target.value})}/>
          </div>
          <div className={`${styles.ipt}`}>
            <h3>Email id</h3>
            <input type='text' defaultValue={user?user.email:""} onChange={(e)=>setNewData({...newData, newEmail:e.target.value})}/>
          </div>
          <div className={`${styles.ipt} ${styles.mno}`}>
            <h3>Mobile no.</h3>
            <input type='text' defaultValue={user?user.mobileNo:""} onChange={(e)=>setNewData({...newData, newMobileNo:e.target.value})}/>
          </div>
          <div className={styles.save}>
            <button onClick={handleSaveChange}>Save Changes</button>
          </div>
          <div className={styles.delete}>
            <button onClick={handleDelete}>Delete Account</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings