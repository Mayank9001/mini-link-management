import React, { useEffect, useState } from 'react'
import Navbar from '../componenets/Navbar';
import SideBar from '../componenets/SideBar';
import { getAllLinks } from '../services/link.services'
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { RxCopy } from "react-icons/rx";
import styles from './Links.module.css'
import EditModal from '../modals/EditModal';
import DeleteModal from '../modals/DeleteModal';
import { toast } from 'react-toastify';
const url = import.meta.env.VITE_BACKEND_URL+"/visit/";

const Links = () => {
  const isActive = {
    dashboard :false,
    links :true,
    analytics : false,
    settings : false,
  };
  const [allLinks, setAllLinks] = useState([]);
  const [linkId, setLinkId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const getLinks = async ()=>{
    const res = await getAllLinks();
    const data = await res.json();
    setAllLinks(data.links);
  };
  useEffect(()=>{
    getLinks();
  }, [isEditModalOpen, isDeleteModalOpen]);
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
  const handleCopyLink = (index) => {
    if (!allLinks || !allLinks[index]) {
        console.error("Invalid link ID:", index);
        return;
    }
    
    navigator.clipboard.writeText(url+allLinks[index].shortLink)
      .then(() => {
        console.log(`Copied: ${allLinks[index].shortLink}`);
        toast('Link Copied', {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
          });
      })
      .catch(err => console.error("Failed to copy:", err));
    
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = allLinks.slice(startIndex, startIndex + itemsPerPage);
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
  // console.log(allLinks);
  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      <div className={styles.content}>
        <div className={styles.tablecontainer}>
          <table className={styles.linkstable} style={{borderRight:"none"}}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>Remarks</th>
                <th>Clicks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLinks.length > 0 ? (paginatedLinks.map((link, index) => (
                <tr key={link._id} className={styles.tablerow}>
                  <td style={{
                        width:"10vw",
                        maxWidth: "10vw", // Fixed width
                        whiteSpace: "nowrap", // Prevents text from wrapping
                        overflow: "hidden", // Hides overflowing text
                        textOverflow: "ellipsis",
                      }}>{formatDate(link.createdAt)}</td>
                    <td style={{
                      width:"8vw",
                      }}>
                      <span style={{display: "block", 
                        overflow: "hidden", 
                        whiteSpace: "nowrap",  // Prevents text from wrapping
                        textOverflow: "clip",  // Cuts off overflowing text
                        maxWidth: "10vw",
                        }}>
                        {link.originalLink}
                      </span>
                    </td>
                    <td style={{ 
                      position: "relative", 
                      display: "flex", 
                      alignItems: "center", 
                      widht:"10vw", 
                      paddingRight:"0", 
                      // height:"2rem",
                    }}>
                    <span
                      style={{
                        width:"10vw",
                        maxWidth: "8vw", // Fixed width
                        whiteSpace: "nowrap", // Prevents text from wrapping
                        overflow: "hidden", // Hides overflowing text
                        textOverflow: "ellipsis",
                      }}
                    >{url}{link.shortLink}
                    </span>
                    <span
                      style={{
                        width: "30px", // Fixed width for the copy button
                        height: "30px",
                        backgroundColor: "rgba(255, 255, 255, 0.5)", 
                        marginRight:"0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                        overflow: "hidden", // Hides anything outside the box
                        position: "relative",
                        cursor:"pointer",
                      }}
                    >
                      <RxCopy size={20} onClick={()=> handleCopyLink(startIndex + index)}/>
                    </span>
                  </td>
                  <td>{link.remarks}</td>
                  <td style={{textAlign:"center"}}>{link.clicks}</td>
                  <td style={{
                      color: link.status === "Active" ? "#1EB036" : "#B0901E",
                    }}>
                    {link.status}
                  </td>
                  <td className={styles.actions} style={{borderBottom:"none", borderRight:"none"}}>
                    <MdEdit className={styles.editicon} size={20} onClick={() =>{
                      setLinkId(link._id)
                      setIsEditModalOpen(true)}
                      } />
                    <RiDeleteBin6Line className={styles.deleteicon} size={20} onClick={() => {
                      setLinkId(link._id)
                      setIsDeleteModalOpen(true)}
                      } />
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
      {isDeleteModalOpen && <DeleteModal id={linkId} onClose={()=>setIsDeleteModalOpen(false)} />}
      {isEditModalOpen && <EditModal id={linkId} onClose={()=>setIsEditModalOpen(false)}/>}
    </>
  )
}

export default Links