import React from 'react'
import iconShowSidebar from "../features/assets/icon-show-sidebar.svg";

const SidebarClosedButton = ({ sidebarOpen, setSidebarOpen }) => {
  return (
      <div
          className={`sidebar-open__button ${sidebarOpen ? 'active' : 'inactive'}`}
          onClick={() => { setSidebarOpen(!sidebarOpen) }}
      >
          <img src={iconShowSidebar} alt="" />
      </div>
  )
}

export default SidebarClosedButton
