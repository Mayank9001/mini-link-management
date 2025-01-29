import React, { useEffect, useState } from 'react'
import Navbar from '../componenets/Navbar'
import SideBar from '../componenets/SideBar'
import { jwtDecode } from 'jwt-decode';
import { userDashboard } from '../services/user.services'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const [user, setUser] = useState();
  const isActive = {
    dashboard :true,
    links :false,
    analytics : false,
    settings : false,
  };
  const [data, setData] = useState();
  const getuser = () => {
    const token = localStorage.getItem("token");
    if(token)
    {
      try {
        const data = jwtDecode(token);
        // console.log("Data", data);
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getdashboard = async () =>{
    try {
      const res = await userDashboard();
      const temp = await res.json();
      console.log("temp", temp.data.dateWiseClicks);
      setData(temp.data);
    }catch(error){
      console.log(error);
    }
  };

  useEffect(()=>{
    getuser();
  }, []);

  useEffect(()=>{
    if(user)getdashboard();
  },[user]);
  // console.log("Data", data);
  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      <div className={styles.main}>
        <div>
          <span>Total clicks : {data?.totalClicks ?? "0"}</span>
        </div>
        <div>
          <div>Date-wise Clicks</div>
          <div>Device Clicks</div>
        </div>
      </div>
    </>
  )
}

export default Dashboard