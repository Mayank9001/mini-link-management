import React, { useEffect, useState } from 'react'
import Navbar from '../componenets/Navbar'
import SideBar from '../componenets/SideBar'
import styles from './Analytics.module.css'
import { getAllLinks } from '../services/link.services'
import { jwtDecode } from 'jwt-decode'
import { getlogs } from '../services/logs.services'

const Analytics = () => {
  const isActive = {
    dashboard :false,
    links :false,
    analytics : true,
    settings : false,
  };
  const [allLogs, setAllLogs] = useState([]);
  const [user, setUser] = useState();
  const getuser = () => {
    const token = localStorage.getItem("token");
    if(token)
    {
      try {
        const data = jwtDecode(token);
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getAllLogs = async () => {
    try{
      const res = await getlogs();
      const data = await res.json();
      setAllLogs(data.logs);
    }catch(error){
      console.log(error);
    }
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  useEffect(() => {
    getAllLogs();
  }, [user]);
  useEffect(()=>{
    getuser();
  }, []);
  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      <div className={styles.content}>
        <div className={styles.tablecontainer}>
          <table className={styles.linkstable} style={{borderRight:"none"}}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>ip address</th>
                <th>User Device</th>
              </tr>
            </thead>
            <tbody>
              {allLogs.length > 0 ? (allLogs.map((log) => (
                <tr key={log._id} className={styles.tablerow}>
                  <td>{formatDate(log.timestamp)}</td>
                  <td style={{width:"8vw"}}>
                    <span style={{display: "block", 
                      overflow: "hidden", 
                      whiteSpace: "nowrap",  // Prevents text from wrapping
                      textOverflow: "clip",  // Cuts off overflowing text
                      width: "100%", 
                      maxWidth: "8vw",
                      }}>
                      {log.originalLink}
                    </span>
                  </td>
                  <td style={{ position: "relative", 
                    display: "flex", 
                    alignItems: "center", 
                    backgroundColor:"wheat",
                    widht:"10vw", 
                    paddingRight:"0" 
                    }}>
                    <span
                      style={{
                        width:"10vw",
                        maxWidth: "8vw", // Fixed width
                        whiteSpace: "nowrap", // Prevents text from wrapping
                        overflow: "hidden", // Hides overflowing text
                        textOverflow: "ellipsis",
                      }}
                    >https://onrender.com/visit/{log.shortLink}
                    </span>
                  </td>
                  <td style={{backgroundColor:"turquoise"}}>{log.ipAddress}</td>
                  <td>{log.platform}  {log.deviceType}</td>
                </tr>
              ))):
              (
                <tr className={styles.tablerow2}><td style={{
                  border:"none"
                  }}>No Data Available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Analytics