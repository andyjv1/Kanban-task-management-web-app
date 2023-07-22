import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTaskById, useGetTasksQuery } from './tasksApiSlice'
import { useGetSubtasksQuery } from '../subtasks/subtasksApiSlice'

const Task = ({ taskid, boardId, columnid, dark }) => {
    const task = useSelector(state => selectTaskById(state, taskid))
    const navigate = useNavigate()
    const pickTask = () => navigate(`/${boardId}/${columnid}/${taskid}`)

    const {
        data: tasks,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTasksQuery()

    const {
        data: substasks,
        isLoading: isLoading2,
        isSuccess: isSuccess2,
        isError: isError2,
        error: error2
    } = useGetSubtasksQuery()


    let content

    if (isLoading || isLoading2) content = <p>Loading Columns...</p>

    const errContent = (error?.data?.message || error2?.data?.message) ?? ''

    // Preparing the subtask dats for the task component
    if (isSuccess2 && isSuccess) {
        let fullsubtaskInTask = []
        const { entities } = substasks

        // Get the subtask that are in this task and put in an array
        const subtasksInTask = Object.values(tasks.entities).find(obj => obj.id === taskid).subtasks

        subtasksInTask.forEach(sub => {
            Object.values(entities).find(obj => obj.id === sub)
            if (Object.values(entities).find(obj => obj.id === sub)) {
                fullsubtaskInTask.push(Object.values(entities).find(obj => obj.id === sub))

            }
        })

        let subcheckedlegnth = 0

        // Get the number of subtasks completed
        fullsubtaskInTask.forEach(sub => {
            if (sub.isCompleted === true) {
                subcheckedlegnth++
            }
        })
        content = (
            <div className={`task-container ${dark ? 'dark-background' : 'light-background'}`} 
                onClick={pickTask}
            >
                <p style={{ display: (isError || isError2) ? "inline" : "none" }}>{errContent}</p>
                <h4
                    className={`${dark ? 'light-text' : 'dark-text'}`}>
                    {task.title}</h4>
                <p>{subcheckedlegnth} of {task.subtasks.length} subtasks</p>
            </div>
        )
    }

    return content
}

export default Task