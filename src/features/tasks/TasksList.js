import { useGetTasksQuery } from './tasksApiSlice'; 
import Task from './Task';
import { useSelector } from 'react-redux'
import { selectColumnById } from '../columns/columnsApiSlice'; 

const TasksList = ({ columnid, boardId, dark }) => {

    const column = useSelector(state => selectColumnById(state, columnid))

    const {
        data: tasks,

        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTasksQuery()

    
    let content

    if (isLoading) content = <p>Loading Tasks...</p>

    if (isError) {
        content = <p className="error-message">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = tasks

        // GEt all the task in this column
        const tasksInBoard = column.tasks.filter(i => ids.includes(i))

        const tasksNewContent = tasksInBoard?.length
            ? tasksInBoard.map(taskid => <Task key={taskid} taskid={taskid} boardId={boardId} columnid={ columnid} dark={dark}/>  )
            : null

        content = (
            <> {tasksNewContent} </>
        )
    }

    return content


}

export default TasksList