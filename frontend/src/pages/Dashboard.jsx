import React, { useEffect, useState } from 'react'
import Navbar from '../componenets/Navbar'
import SideBar from '../componenets/SideBar'
import { jwtDecode } from 'jwt-decode';
import { userDashboard } from '../services/user.services'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const [user, setUser] = useState();
  const [totalClicks, setTotalClicls] = useState();
  const [deviceTypeClicks, setDeviceTypeClicks] = useState();
  const [dateWiseClicks, setDateWiseClicks] = useState();
  const isActive = {
    dashboard :true,
    links :false,
    analytics : false,
    settings : false,
  };
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
      // console.log("temp", temp.data.dateWiseClicks);
      setTotalClicls(temp.data.totalClicks);
      setDeviceTypeClicks(temp.data.deviceTypeClicks);
      setDateWiseClicks(temp.data.dateWiseClicks);
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
  // console.log("TC", totalClicks);
  // console.log("Date", dateWiseClicks);
  // console.log("Device", deviceTypeClicks);
  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      <div className={styles.main}>
        <div>
          <span>Total clicks : {totalClicks? totalClicks : "0"}</span>
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