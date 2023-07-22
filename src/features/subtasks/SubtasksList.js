import { useGetSubtasksQuery } from './subtasksApiSlice';
import Subtask from './Subtask'
import { useSelector } from 'react-redux'
import { selectTaskById } from '../tasks/tasksApiSlice';

const SubtasksList = ({ taskid, inputId }) => {

      // Get individual task data with id
  const task = useSelector(state => selectTaskById(state, taskid))

  const {
    data: subtasks,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSubtasksQuery()


  let content

  if (isLoading) content = <p>Loading Subtasks...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = subtasks
    
        // Get all the subtask in this task
    const subtasksInTask = task.subtasks.filter(i => ids.includes(i))

    const subtaskLength = subtasksInTask.length

    const subtasksContent = subtasksInTask?.length
      ? subtasksInTask.map(subtaskId =>
        <Subtask inputId={ inputId} key={subtaskId} subtaskId={subtaskId} subtaskLength={subtaskLength} subtasksInTask={subtasksInTask} />
      )
      : null

    content = (
      <> {subtasksContent}
      </>
    )
  }

  return content


}

export default SubtasksList