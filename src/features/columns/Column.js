import { useSelector } from 'react-redux'
import { selectColumnById } from './columnsApiSlice'
import TasksList from '../tasks/TasksList'
const Column = ({ columnid, boardId, dark }) => {
    // Get individual Column data with id
    const column = useSelector(state => selectColumnById(state, columnid))

    // Get a random color
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    if (column) {
        return (
            <div className="column-container">
                <div className="column-container__name">
                    <span style={{ backgroundColor: `#${randomColor}` }}></span>
                    <p>{column.name}</p>
                    <p>({column.tasks.length})</p>
                </div>
                <TasksList columnid={columnid} boardId={boardId} dark={dark} />
            </div>
        )

    } else return null
}

export default Column