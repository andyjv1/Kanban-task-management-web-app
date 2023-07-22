import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from './boardsApiSlice'
import iconBoard from "../assets/icon-board.svg";

const Board = ({ boardId, width, setSidebarOpen, sidebarOpen, id }) => {

    // Get individual board data with id
    const board = useSelector(state => selectBoardById(state, boardId))
    const navigate = useNavigate()

    let boardClass

    // Make the current selected id component highlighted
    if (id === boardId) {
        boardClass = "boards-individual__highlighted"
    } else {
        boardClass = "boards-individual"
    }

    // Go to the selected board page
    if (board) {
        const pickBoard = () => {
            if (width <= 546) {
                setSidebarOpen(!sidebarOpen)
                navigate(`/${boardId}`)
            } else {
                navigate(`/${boardId}`)
            }

        }
        return (
            <div className={boardClass}
                onClick={pickBoard}>
                <img src={iconBoard} alt="" />
                <p>{board.name}</p>
            </div>
        )

    } else return null
}

export default Board