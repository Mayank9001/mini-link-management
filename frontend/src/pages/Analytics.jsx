import React from 'react'
import Navbar from '../componenets/Navbar';
import SideBar from '../componenets/SideBar';

const Analytics = () => {
  const isActive = {
    dashboard :false,
    links :false,
    analytics : true,
    settings : false,
  };
  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      <div>Analytics</div>
    </>
  )
}

export default Analytics