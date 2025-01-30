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
const url = 'http://localhost:3000/visit/';

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
      .then(() => console.log(`Copied: ${allLinks[index].shortLink}`))
      .catch(err => console.error("Failed to copy:", err));
    console.log("Link ID:", index);
    console.log("Original Link:", allLinks[index].originalLink);
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
w              {allLinks.length > 0 ? (allLinks.map((link, index) => (
                <tr key={link._id} className={styles.tablerow}>
                  <td>{formatDate(link.createdAt)}</td>
                  <td style={{width:"8vw"}}>
                    <span style={{display: "block", 
                      overflow: "hidden", 
                      whiteSpace: "nowrap",  // Prevents text from wrapping
                      textOverflow: "clip",  // Cuts off overflowing text
                      width: "100%", 
                      maxWidth: "8vw",
                      }}>
                      {link.originalLink}
                    </span>
                  </td>
                  <td style={{ position: "relative", display: "flex", alignItems: "center", widht:"10vw", paddingRight:"0" }}>
                    <span
                      style={{
                        width:"10vw",
                        maxWidth: "8vw", // Fixed width
                        whiteSpace: "nowrap", // Prevents text from wrapping
                        overflow: "hidden", // Hides overflowing text
                        textOverflow: "ellipsis",
                      }}
                    >https://onrender.com/visit/{link.shortLink}
                    </span>
                    <span
                      style={{
                        width: "30px", // Fixed width for the copy button
                        height: "25px",
                        backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent turquoise
                        // marginLeft: "5px",
                        marginRight:"0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                        overflow: "hidden", // Hides anything outside the box
                        position: "relative",
                      }}
                    >
                      <RxCopy size={20} onClick={()=> handleCopyLink(index)}/>
                    </span>
                  </td>
                  <td>{link.remarks}</td>
                  <td>{link.clicks}</td>
                  <td style={{
                      color: link.status === "Active" ? "green" : "red",
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
      </div>
      {isDeleteModalOpen && <DeleteModal id={linkId} onClose={()=>setIsDeleteModalOpen(false)} />}
      {isEditModalOpen && <EditModal id={linkId} onClose={()=>setIsEditModalOpen(false)}/>}
    </>
  )
}

export default Links