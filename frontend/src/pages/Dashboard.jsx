import React, { useEffect, useState } from 'react'
import Navbar from '../componenets/Navbar'
import SideBar from '../componenets/SideBar'
import { jwtDecode } from 'jwt-decode';
import { userDashboard } from '../services/user.services'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const [user, setUser] = useState();
  const [totalClicks, setTotalClicls] = useState();
  const [deviceTypeClicks, setDeviceTypeClicks] = useState([]);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
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
  const sortedDateWiseClicks = dateWiseClicks.length > 0 ? [...dateWiseClicks].sort((a, b) => {
    const dateA = new Date(a._id.split("-").reverse().join("-"));
    const dateB = new Date(b._id.split("-").reverse().join("-"));
    return dateB - dateA;
  }) : [];
  const sortedDeviceClicks = deviceTypeClicks.length > 0 ? [...deviceTypeClicks].sort((a, b) => { return b.clicks - a.clicks}) : [];

  useEffect(()=>{
    getuser();
  }, []);

  useEffect(()=>{
    if(user)getdashboard();
  },[user]);
  // console.log("Data", data);
  // console.log("TC", totalClicks);
  // console.log("Date", sortedDateWiseClicks);
  // console.log("Device", sortedDeviceClicks);
  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      <div className={styles.main}>
        <div className={styles.clicks}>
          Total Clicks
          <span>{totalClicks? totalClicks : "0"}</span>
        </div>
        <div className={styles.chart}>
          <div className={styles.boxes}>
            <span className={styles.title}>
              Date-wise Clicks
            </span>
            <div className={styles.chartcontainer}>
              {sortedDateWiseClicks.map(({ _id, clicks }) => (
                <div key={_id} className={styles.chartrow}>
                  <span className={styles.datelabel}>{_id}</span>
                  <div className={styles.barcontainer}>
                    <div
                      className={styles.bar}
                      style={{ width: `${(clicks / totalClicks) * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.clickcount}>{clicks}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.boxes}>
            <span className={styles.title}>
                Click Devices
            </span>
            <div className={styles.chartcontainer}>
              {sortedDeviceClicks.map(({ _id, clicks }) => (
                <div key={_id} className={styles.chartrow}>
                  <span className={styles.devicelabel}>{_id}</span>
                  <div className={styles.barcontainer}>
                    <div
                      className={styles.bar}
                      style={{ width: `${(clicks / totalClicks) * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.clickcount}>{clicks}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard