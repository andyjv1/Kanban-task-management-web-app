import { useOutletContext } from 'react-router-dom'
import SidebarClosedButton from './SidebarClosedButton';

const BoardWithOutId = () => {
    const { setSidebarOpen, sidebarOpen, dark } = useOutletContext();
    return (
        <div
            className={`main-container__no-id ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'light-text' : 'dark-text'}`}
        >
            <h1
                className={`no-id__text ${sidebarOpen ? 'active' : 'inactive'}`}
            >Choose a Board</h1>
            <SidebarClosedButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>)
}

export default BoardWithOutId