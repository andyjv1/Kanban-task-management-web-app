import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from "./boardsApiSlice"
import { useDeleteBoardMutation } from "./boardsApiSlice"
import BoardWithId from "../../components/BoardWithId"
import BoardWithOutId from "../../components/BoardWithOutId"
import { useEffect } from 'react'

const DeleteBoard = () => {
    const { sidebarOpen, dark } = useOutletContext();

    const { id } = useParams()
    const navigate = useNavigate()
        // Get individual board data with id
    const board = useSelector(state => selectBoardById(state, id))

        const [deleteBoard, {
                    isSuccess,
        isError,
        error
    }] = useDeleteBoardMutation()
    
    // Delete the board
        const onDeleteBoardClicked = async () => {
            await deleteBoard({ id: board.id })
        }
    
    // Go to the board page after deleting the board
    useEffect(() => {
        if (isSuccess) {
            navigate(`/`)
        }
    }, [isSuccess, navigate])
    const errContent = (error?.data?.message) ?? ''
 
    const content = board ?
        (<>
            {id ? <BoardWithId /> : <BoardWithOutId />}
            <div className="overlay" onClick={() => navigate(`/${id}`)}></div>
            <div 
                className={`delete-board ${sidebarOpen ? 'active' : 'inactive'}  ${dark ? 'dark-background' : 'light-background'}`}
            >
                <p style={{ display: (isError) ? "inline" : "none" }}>{errContent}</p>
                <h3>Delete this board?</h3>
                <p>Are you sure you want to delete the '{board.name}'
                    board? This action will remove all columns and tasks and cannot be reversed.</p>
                <div className='delete-board__buttons'>
                <button onClick={onDeleteBoardClicked} className="red-button">Delete</button>
                <button onClick={() => navigate(`/${id}`)} className="cancel-button">Cancel</button>   
                </div>
            </div>
        </>) : null

    return content
}

export default DeleteBoard



