import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTaskById } from './tasksApiSlice'
import { useDeleteTaskMutation } from './tasksApiSlice'
import { useEffect } from 'react'
import BoardWithId from "../../components/BoardWithId"
import BoardWithOutId from "../../components/BoardWithOutId"

const DeleteTask = () => {
    const { sidebarOpen, dark } = useOutletContext();

    const { id, taskid, columnid } = useParams()
    const navigate = useNavigate()

    // Get individual task data with id
    const task = useSelector(state => selectTaskById(state, taskid))

    const [deleteTask, {
        isSuccess,
        isError,
        error
    }] = useDeleteTaskMutation()

        // Delete the task
    const onDeleteTaskClicked = async () => {
        await deleteTask({ id: task.id, columnId: columnid })
    }

        // Go to the board page after deleting the task
    useEffect(() => {
        if (isSuccess) {
            navigate(`/${id}`)
        }
    }, [isSuccess, navigate, id])

    const errContent = (error?.data?.message) ?? ''

    const content = task ?
        (<>
            {id ? <BoardWithId /> : <BoardWithOutId />}
            <div className="overlay" onClick={() => navigate(`/${id}`)}></div>
            <div
                className={`delete-task ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'dark-background' : 'light-background'}`}
            >
                <p style={{ display: (isError) ? "inline" : "none" }}>{errContent}</p>
                <h3>Delete this task?</h3>
                <p>Are you sure you want to delete the '{task.title}'
                    task? This action cannot be reversed.</p>
                <div className='delete-task__buttons'>
                    <button onClick={onDeleteTaskClicked} className="red-button">Delete</button>
                    <button onClick={() => navigate(`/${id}`)} className="cancel-button">Cancel</button>
                </div>
            </div>
        </>) : null

    return content
}

export default DeleteTask