import { useGetBoardsQuery, selectBoardById } from './boardsApiSlice';
import Board from './Board'
import iconBoard from "../assets/icon-board.svg";
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const BoardsList = ({ setSidebarOpen, width, sidebarOpen, id }) => {

    // Get all board data
    const {
        data: boards,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBoardsQuery()

    let content

    const navigate = useNavigate()

    // Get individual board data with id
    const board = useSelector(state => selectBoardById(state, id))

    // Go to the create board page
    const goToCreateBoard = () => {
        if (board) {
            if (width <= 546) {
                setSidebarOpen(false)
                navigate(`/${id}/createboard`)
            } else {
                navigate(`/${id}/createboard`)

            }
        } else {
            if (width <= 546) {
                setSidebarOpen(false)
                navigate(`/createboard`)
            } else {
                navigate(`/createboard`)

            }
        }
    }

    if (isLoading) content = <p>Loading Boards...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = boards

        // Map of all the board data to make individual components
        const boardContent = ids?.length
            ? ids.map(boardId => <Board key={boardId} boardId={boardId} setSidebarOpen={setSidebarOpen} width={width} id={id}
                sidebarOpen={sidebarOpen} />)
            : null

        const numberOfBoards = ids.length

        content = (
            <div className='sidebar-boards'>
                <div className='sidebar-boards__name'>
                    <p>ALL BOARDS ({numberOfBoards})</p>
                </div>
                <div className='boards'>
                    {boardContent}
                    <div className='boards-create'>
                        <img src={iconBoard} alt="" />
                        <p onClick={goToCreateBoard}>+ Create New Board</p>
                    </div>
                </div>
            </div>
        )
    }

    return content
}

export default BoardsList