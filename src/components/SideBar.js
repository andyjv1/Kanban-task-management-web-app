import React from 'react'
import iconLightTheme from "../features/assets/icon-light-theme.svg";
import iconDarkTheme from "../features/assets/icon-dark-theme.svg";
import iconHideSidebar from "../features/assets/icon-hide-sidebar.svg";
import BoardsList from '../features/boards/BoardsList';

const SideBar = ({ width, sidebarOpen, setSidebarOpen, id, dark, setDark }) => {

    return (
        <div className={`main-container__sidebar ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'dark-background' : 'light-background'}` }
            style={{
                borderRight: (dark) ? "1px solid rgba(62, 63, 78, 1)" : "1px solid  rgb(228, 235, 250)"
            }}
        >
            <BoardsList width={width} setSidebarOpen={setSidebarOpen} id={id}
                sidebarOpen={sidebarOpen} dark={dark} />
            <div className='sidebar-actions'>
                <div className={`sidebar-actions__toggle ${dark ? 'very-dark-background' : 'very-light-background'}`}>
                    <img src={iconLightTheme} alt="" />
                    <input
                        type="checkbox"
                        id="switch"
                        name="switch"
                        onChange={() => setDark(!dark)}
                    /><label id="switch" htmlFor="switch">Toggle</label>
                    <img src={iconDarkTheme} alt="" />

                </div>
                <div className='sidebar-actions__button'
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <img src={iconHideSidebar} alt="" />
                    <p>Hide SideBar</p>
                </div>
            </div>
        </div>)
}

export default SideBar