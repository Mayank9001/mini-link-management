import React from 'react'
import Navbar from '../componenets/Navbar';
import SideBar from '../componenets/SideBar';

const Links = () => {
  const isActive = {
    dashboard :false,
    links :true,
    analytics : false,
    settings : false,
  };
  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      <div>Links</div>
    </>
  )
}

export default Links