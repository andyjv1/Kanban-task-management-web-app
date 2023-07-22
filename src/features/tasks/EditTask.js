import { useState, useEffect, } from "react"
import { useUpdateTaskMutation, selectTaskById } from "./tasksApiSlice"
import { selectBoardById } from "../boards/boardsApiSlice"
import { useGetColumnsQuery } from "../columns/columnsApiSlice"
import {
  useNavigate, useParams,
  useOutletContext
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconcross from "../assets/icon-cross.svg";
import { useGetSubtasksQuery, useDeleteSubtaskMutation, useUpdateSubtaskMutation, useAddNewSubtaskMutation } from '../subtasks/subtasksApiSlice';
import BoardWithId from "../../components/BoardWithId"
import BoardWithOutId from "../../components/BoardWithOutId"
import { subcomponents } from '../../utils/subcomponents';
import { columnIds } from '../../utils/columnIds';

const EditTask = () => {
  const { sidebarOpen, dark } = useOutletContext();
  const navigate = useNavigate()
  const { id, taskid } = useParams()
  // Get individual board data with id
  const board = useSelector(state => selectBoardById(state, id))
  // Get individual task data with id
  const task = useSelector(state => selectTaskById(state, taskid))

  const {
    data: columns,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetColumnsQuery()

  const {
    data: substasks,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    isError: isError2,
    error: error2
  } = useGetSubtasksQuery()

  const [addNewSubtask, {
    isLoading: isLoading3,
    isSuccess: isSuccess3,
    isError: isError3,
    error: error3
  }] = useAddNewSubtaskMutation()

  const [updateSubtask,
    {
      isLoading: isLoading4,
      isSuccess: isSuccess4,
      isError: isError4,
      error: error4
    }] = useUpdateSubtaskMutation()

  const [updateTask, {
    isLoading: isLoading5,
    isSuccess: isSuccess5,
    isError: isError5,
    error: error5
  }] = useUpdateTaskMutation()

  const [deleteSubtask, {
    isError: isDelError,
    error: delerror
  }] = useDeleteSubtaskMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [columnId, setColumnId] = useState('')
  const [deleteSubtasks, setDeleteSubtasks] = useState([])
  const [columnsForMenu, setColumnsForMenu] = useState('')
  const [subtask, setSubtask] = useState([])


  let disabled
  let subtaskComponent
  let content

  // Empty the task states after updating the task and going to the board page
  useEffect(() => {
    if (isSuccess5) {
      setTitle('')
      setDescription('')
      setColumnId('')
      navigate(`/${id}`)
    }
  }, [isSuccess5, navigate, id])

  // Empty the subtask states after updating the subtask 
  useEffect(() => {
    if (isSuccess3 || isSuccess4) {
      setSubtask('')
    }
  }, [isSuccess3, isSuccess4])

  // Preparing the columns for the select input
  useEffect(() => {
    let fullColumnInBoard = []
    if (board && task) {
      if (isSuccess) {
        const arrayOfColumns = Object.keys(columns.entities).map(key => columns.entities[key]);
        // Get the columns that are in this board and put in an array
        const columnInBoard = columnIds(board, columns)
        fullColumnInBoard = subcomponents(columnInBoard, arrayOfColumns, fullColumnInBoard)


        // To select the column when creating the task
        setColumnsForMenu(fullColumnInBoard.map(column => {
          return (
            <option
              key={column.id}
              value={column.id}
            >{column.name}</option>
          )
        }))

        const index = fullColumnInBoard.findIndex(x => x.id === task.status);
        setColumnId(fullColumnInBoard[index].id)
      }
    }
  }, [board, columns, isSuccess, isSuccess5, task]);

  // Preparing the subtasks for the inputs
  useEffect(() => {
    if (task) {
      if (isSuccess2) {
        let fullsubtaskInTask = []
        const { entities } = substasks
        const subtasksIds = Object.keys(entities).map((item => item))
        const subtaskInTask = task.subtasks.filter(i => subtasksIds.includes(i))

        subtaskInTask.forEach(sub => {
          if (Object.values(entities).find(obj => obj.id === sub)) {
            fullsubtaskInTask.push(Object.values(entities).find(obj => obj.id === sub))
          }
        })

        setSubtask(fullsubtaskInTask)
        setTitle(task.title)
        setDescription(task.description)
      }
    }
  }, [isSuccess2, substasks, task])


  const onTitleCreated = e => setTitle(e.target.value)
  const onDescriptionCreated = e => setDescription(e.target.value)
  const onColumnChosen = e => setColumnId(e.target.value)

  // Sets subtask name to the current input
  const onSubtaskNameChanged = (index, event) => {
    let data = []
    subtask.forEach((sub, i) => {
      data[i] = { ...sub }
    })
    data[index][event.target.title] = event.target.value
    setSubtask(data)
  }
  // Deletes subtask chosen
  const onDeleteSubtaskClicked = async (index, event) => {
    event.preventDefault()
    if (subtask[index].id) {
      let data = []
      subtask.forEach((sub, i) => {
        data[i] = { ...sub }
      })
      data.splice(index, 1)
      setSubtask(data)

      let deletesub = []
      deletesub.push(subtask[index])
      setDeleteSubtasks(deletesub)
    } else {
      let data = []
      subtask.forEach((sub, i) => {
        data[i] = { ...sub }
      })
      data.splice(index, 1)
      setSubtask(data)
    }
  }

  // Add new subtask in column array
  const addSubtasks = (e) => {
    e.preventDefault()
    let newSubtask = { title: '' }
    setSubtask([...subtask, newSubtask])
  }

  // When the form in sumbited, it updates the task and its subtasks
  const onformSubmited = async (e) => {
    e.preventDefault()

    if (canSaveTask
      & canSaveSubtask
    ) {

      await updateTask({ title, description, columnId, id: taskid })

      await subtask.forEach(sub => {
        if (sub.id) {
          updateSubtask({ taskId: task.id, id: sub.id, title: sub.title, isCompleted: sub.isCompleted })
        } else {
          addNewSubtask({ taskId: task.id, title: sub.title })

        }
      })
      await deleteSubtasks.forEach(s => {
        if (deleteSubtasks) {
          deleteSubtask({ id: s.id, taskId: task.id })

        }
      })
      navigate(`/${id}`)
    }
  }

  if (subtask) {
    if (subtask?.find(o => o.title === '')) {
      disabled = true
    } else {
      disabled = false
    }
  }


  const canSaveTask = [title, columnId].every(Boolean) && !isLoading5
  const canSaveSubtask = !isLoading3 && !isLoading4

  if (isLoading2) subtaskComponent = <p>Loading Subtasks...</p>

  if (isSuccess2 && subtask) {
    subtaskComponent = subtask?.map((input, index) => {
      return (
        <div className="edit-task__subtasks">
          <div className="input-container" style={input.title === '' ? { borderColor: " rgb(234, 85, 85)" } : null}>
            <input
              id="subtask"
              title="title"
              type="text"
              autoComplete="off"
              value={input.title}
              onChange={event => onSubtaskNameChanged(index, event)}
              key={subtask.id}
              className={` ${dark ? 'light-text' : 'dark-text'}`}
            />
            <span
              style={input.title === '' ? { display: "inline" } : { display: "none" }}
            >Can’t be empty</span>
          </div>
          <button
            onClick={event => onDeleteSubtaskClicked(index, event)}
          ><img src={iconcross} alt=""
            /></button>
        </div>
      )
    })
  }

  const errContent = (error5?.data?.message || error2?.data?.message || error3?.data?.message || error4?.data?.message || delerror?.data?.message) ?? ''

  if (isLoading || isLoading2) content = <p>Loading Tasks...</p>

  if (isError) {
    content = <p className="error-message">{`${error?.data?.message}, 
        ${error5?.data?.message}, 
        ${error2?.data?.message}`}</p>
  }

  if (isSuccess && isSuccess2) {

    content = (
      <>
        {id ? <BoardWithId /> : <BoardWithOutId />}
        <div className="overlay" onClick={() => navigate(`/${id}`)}></div>
        <form
          className={`edit-task ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'dark-background' : 'light-background'}`}
          onSubmit={onformSubmited}
        >
          <p style={{ display: (isError5 || isError2 || isError3 || isError4 || isDelError) ? "inline" : "none" }}>{errContent}</p>
          <h3
            className={` ${dark ? 'light-text' : 'dark-text'}`}
          >Edit Task</h3>
          <label htmlFor="title" className={` ${dark ? 'light-text' : 'grey-text'}`}

          >Title</label>
          <div className="input-container"
            style={title === '' ? { borderColor: " rgb(234, 85, 85)" } : null}>
            <input
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={onTitleCreated}
              placeholder="e.g. Take coffee break"
                          className={` ${dark ? 'light-text' : 'dark-text'}`}
            />
            <span
              style={title === '' ? { display: "inline" } : { display: "none" }}
            >Can’t be empty</span>
          </div>

          <label htmlFor="description"
            className={` ${dark ? 'light-text' : 'grey-text'}`}
          >Description</label>
          <textarea
            id="description"
            name="description"
            type="description"
            autoComplete="off"
            value={description}
            onChange={onDescriptionCreated}
            placeholder="e.g. It’s always good to take a break. 
          This 15 minute break will 
          recharge the batteries a little."
            className={` ${dark ? 'light-text' : 'dark-text'}`}

          />
          <label htmlFor="subtasks" 
            className={`labelSutasks ${dark ? 'light-text' : 'grey-text'}`}
          >Subtitles</label>
          {subtaskComponent}
          <button className="light-button" onClick={addSubtasks}>+ Add New Subtask</button>
          <label htmlFor="columns" 
            className={`columns-label ${dark ? 'light-text' : 'grey-text'}`}
          >Status</label>
          <select id='columns' 
            className={`columns-select ${dark ? 'light-text' : 'dark-text'}`}
          onChange={onColumnChosen} value={columnId}
          >
            {columnsForMenu}
          </select>
          <button type="submit" className="dark-button" disabled={!canSaveTask || disabled
            || !canSaveSubtask
          }
          >Save Changes</button>
        </form>
      </>
    )
  }
  return content

}

export default EditTask
