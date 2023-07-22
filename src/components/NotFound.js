import React from 'react'
import SidebarClosedButton from './SidebarClosedButton';

const NotFound = ({ setSidebarOpen, sidebarOpen, dark }) => {
    return (
        <div
            className={`main-container__error ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'light-text' : 'dark-text'}`}>
            <div
                className={`main-text__error ${sidebarOpen ? 'active' : 'inactive'}`}>
                            <h1>Oops!</h1>
            <h2>404 page not found</h2>
            <p>Board might not exist or the requested url is not found</p>
                </div>

            <SidebarClosedButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

    )
}

export default NotFound