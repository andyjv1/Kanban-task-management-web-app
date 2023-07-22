import { useSelector } from 'react-redux'
import { selectSubtaskById } from './subtasksApiSlice'

const Subtask = ({ subtaskId, inputId }) => {
        // Get individual subtask data with id
    const subtask = useSelector(state => selectSubtaskById(state, subtaskId))

    return (
        <div className='Subtask'>
            <input className='toggle-subtask' type="checkbox" id={inputId} name="subtask" />
            <label htmlFor="subtask">{subtask.title}</label>
        </div>
    )
}

export default Subtask
