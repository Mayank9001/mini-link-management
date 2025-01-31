import React, { useEffect, useState } from 'react'
import Navbar from '../componenets/Navbar'
import SideBar from '../componenets/SideBar'
import styles from './Analytics.module.css'
import { PiCaretUpDown } from 'react-icons/pi'
import { jwtDecode } from 'jwt-decode'
import { getlogs } from '../services/logs.services'
const url = import.meta.env.VITE_BACKEND_URL+"/visit/";

const Analytics = () => {
  const [sortIndex, setSortIndex] = useState(-1);
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
  const handleDateSorting = () => {
    setAllLogs(sortIndex===1 ? [...allLogs].sort((a,b)=>{
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateA - dateB;
    }): [...allLogs].sort((a,b)=>{
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA;
    }))
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = allLogs.slice(startIndex, startIndex + itemsPerPage);
  const getPaginationNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [1, "...", currentPage, "...", totalPages];
      }
    }
  };
  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      <div className={styles.content}>
        <div className={styles.tablecontainer}>
          <table className={styles.linkstable} style={{borderRight:"none"}}>
            <thead>
              <tr>
                <th style={{}}>Timestamp
                  <PiCaretUpDown style={{marginLeft:"1vw"}} onClick={()=>{setSortIndex(prev =>-1*prev);handleDateSorting();}}/>
                </th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>ip address</th>
                <th>User Device</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (paginatedLogs.map((log) => (
                <tr key={log._id} className={styles.tablerow}>
                  <td style={{
                        width:"10vw",
                        maxWidth: "10vw", 
                        whiteSpace: "nowrap", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis",
                      }}>{formatDate(log.timestamp)}</td>
                  <td style={{width:"12vw"}}>
                    <span style={{display: "block", 
                      overflow: "hidden", 
                      whiteSpace: "nowrap",  
                      textOverflow: "clip",  
                      maxWidth: "13vw",
                      }}>
                      {log.originalLink}
                    </span>
                  </td>
                  <td style={{ maxWidth: "11vw",
                      wordWrap: "break-word",  
                      overflowWrap: "break-word", 
                      whiteSpace: "normal",
                    }}>
                    <span>{url}{log.shortLink}
                    </span>
                  </td>
                  <td style={{textAlign:"left", width:"6vw"}}>{log.ipAddress}</td>
                  <td style={{width:"5vw",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {log.platform}  {log.deviceType}
                  </td>
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
        {totalPages > 1 ? (
          <div className={styles.footer}>
            <div className={styles.pagination}>
              <button 
                className={styles.pageButton} 
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
              >
                {"<"}
              </button>
              {getPaginationNumbers().map((num, index) => (
                  <button
                    key={index}
                    className={`${styles.pageButton} ${num === currentPage ? styles.activePage : ""}`}
                    onClick={() => typeof num === "number" && setCurrentPage(num)}
                    disabled={num === "..."}
                  >
                    {num}
                  </button>
                ))}
                <button
                  className={styles.pageButton}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </button>
            </div>
          </div>
        )
      :(
        <div className={styles.footer}>
          <div className={styles.pagination}>
            <button 
              className={styles.pageButton} 
              disabled
            >
              {"<"}
            </button>
                <button
                  className={`${styles.pageButton} ${styles.activePage}`}
                >
                  {1}
                </button>
              <button
                className={styles.pageButton}
                disabled
              >
                {">"}
              </button>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default Analytics