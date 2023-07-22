import logodark from "../features/assets/logo-dark.svg";
import logolight from "../features/assets/logo-light.svg"
import iconVerticalEllipsis from "../features/assets/icon-vertical-ellipsis.svg";
import logoMobile from "../features/assets/logo-mobile.svg"
import addMobile from "../features/assets/icon-add-task-mobile.svg"
import chevronUp from "../features/assets/icon-chevron-up.svg"
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from 'react'

const Header = ({ width, id, setSidebarOpen, sidebarOpen, disabled, dark }) => {
    const navigate = useNavigate()
    let menuRef = useRef();
    let menuRef2 = useRef();

    const [isOpen, setIsOpen] = useState(false)

    // when you cleck ouside the editBoardBox, the editBoardBox goes away
    useEffect(() => {
        let handler = (e) => {
            if (width > 546 && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
            if (width <= 546 && !menuRef2.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }

    });

    const editBoardBox = (
        <>
            <button onClick={() => { setIsOpen(!isOpen) }} id='iconVerticalEllipsisButton'
                disabled={!id}
            >
                <img className='iconVerticalEllipsis'
                    src={iconVerticalEllipsis} alt="" />
            </button>
            <div
                className={`editBoardBox ${isOpen ? 'active' : 'inactive'} ${dark ? 'dark-background' : 'light-background'}`}
            >
                <p className='grey-text' onClick={() => {
                    navigate(`/${id}/editboard`)
                    setIsOpen(!isOpen)
                }}>Edit Board</p>
                <p className='red-text' onClick={() => {
                    navigate(`/${id}/deleteboard`)
                    setIsOpen(!isOpen)
                }}>Delete Board</p>
            </div>
        </>
    )

    return (
        <header className={`${dark ? 'dark-background' : 'light-background'}`}>
            <div className={`header-big-logo`}
                style={{
                    borderBottom: sidebarOpen ? "none" : dark ? "1px solid rgba(62, 63, 78, 1)" : "1px solid rgb(228, 235, 250)",
                }}
            >
                <img src={logodark} alt="" style={{ display: dark ? "none" : "inline" }} />
                <img src={logolight} alt="" style={{ display: dark ? "inline" : "none" }} />
            </div>
            <div className={`header-big-actions`}
                style={{
                    borderBottom: dark ? "1px solid rgba(62, 63, 78, 1)" : "1px solid rgb(228, 235, 250)",
                    borderLeft: dark ? "1px solid rgba(62, 63, 78, 1)" : "1px solid rgb(228, 235, 250)",
                }}>
                <h1
                    className={`${dark ? 'light-text' : 'dark-text'}`}>
                    Platform Launch</h1>
                <div className='header-big-actions__button'
                >
                    <button
                        onClick={() => { navigate(`/${id}/createtask`) }} disabled={disabled}>+ Add New Task</button>
                    <div
                        className="button-ellipsis"
                        ref={menuRef}
                    >
                        {editBoardBox}
                    </div>
                </div>
            </div>


            <div className='header-small-logo' >
                <img className='header-small-logo__image' src={logoMobile} alt="" />
                <h1
                    className={`${dark ? 'light-text' : 'dark-text'}`}>
                    Platform Launch</h1>
                <button className='header-small-logo__button'
                    onClick={() => { setSidebarOpen(!sidebarOpen) }}

                >
                    <img className={`button-chevron ${sidebarOpen ? 'active' : 'inactive'}`} src={chevronUp} alt="" />
                </button>
            </div>

            <div className='header-small-actions' >
                <button
                    onClick={() => { navigate(`/${id}/createtask`) }}
                    disabled={disabled}
                >
                    <img src={addMobile} alt="" /></button>
                <div
                    className="button-ellipsis__small"
                    ref={menuRef2}
                >
                    {editBoardBox}
                </div>
            </div>
        </header>)
}

export default Header