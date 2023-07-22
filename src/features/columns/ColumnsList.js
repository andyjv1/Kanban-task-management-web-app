import { useGetColumnsQuery } from './columnsApiSlice';
import Column from './Column'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from '../boards/boardsApiSlice';


const ColumnList = ({dark }) => {

    const { id } = useParams()

    // Get individual board data with id
    const board = useSelector(state => selectBoardById(state, id))

    const {
        data: columns,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetColumnsQuery()

    let content

    if (isLoading) content = <p>Loading Columns...</p>

    if (isError) {
        content = <p className="error-message">{error?.data?.message}</p>
    }

    if (isSuccess) {


        const { ids } = columns

        // Get all the columns in this board
        const columnInBoard = board.columns.filter(i => ids.includes(i))

        // Map of all the column data to make individual components
        const columnsNewContent = columnInBoard?.length
            ? columnInBoard.map(columnid => <Column key={columnid} columnid={columnid} boardId={id} dark={dark} />)
            : null

        content = (
            <> {columnsNewContent} </>
        )
    }

    return content


}

export default ColumnList

