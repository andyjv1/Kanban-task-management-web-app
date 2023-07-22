import { useOutletContext } from 'react-router-dom'
import ColumnsList from '../features/columns/ColumnsList'
import { useNavigate } from "react-router-dom";
import SidebarClosedButton from './SidebarClosedButton';

const BoardWithId = () => {
  const navigate = useNavigate()

  const { board, id, setSidebarOpen, sidebarOpen, dark } = useOutletContext();

  let boardContent

  if (board?.columns.length) {

    boardContent = (
      <>
        <ColumnsList
          dark={dark} 
        />
        <div className="columns-container__button">
          <div className="columns-container__empty-space">
            <span ></span>
            <p >DONE (6)</p>
          </div>
          <div className={`columns-container__text ${dark ? 'dark-background' : 'light-background'}`}
            onClick={() => { navigate(`/${id}/editboard`) }}
          >
            <h4>+ New Column</h4>
          </div>
        </div>
      </>
    )
  } else {

    boardContent = (
      <>
        <p>This board is empty. Create a new column to get started.</p>
        <button onClick={() => { navigate(`/board/${id}/editboard`) }}>+ Add New Column</button>
      </>
    );
  }

  const content = board ? (
    <div className={board?.columns.length ? `columns-container` : `no-columns-container ${sidebarOpen ? 'active' : 'inactive'}`} >
      {boardContent}
      <SidebarClosedButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </div>
  ) : <p>Loading...</p>

  return (
    content
  )
}

export default BoardWithId