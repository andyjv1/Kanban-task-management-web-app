import { useState, useEffect } from "react"
import { useAddNewTaskMutation } from "./tasksApiSlice"
import { useAddNewSubtaskMutation } from "../subtasks/subtasksApiSlice"
import { selectBoardById } from "../boards/boardsApiSlice"
import { useGetColumnsQuery } from "../columns/columnsApiSlice"
import {
  useNavigate, useParams,
  useOutletContext
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconcross from "../assets/icon-cross.svg";
import BoardWithId from "../../components/BoardWithId"
import BoardWithOutId from "../../components/BoardWithOutId"
import { subcomponents } from '../../utils/subcomponents';
import { columnIds } from '../../utils/columnIds';

const NewTask = () => {
  const { sidebarOpen, dark } = useOutletContext();
  const { id } = useParams()
  const navigate = useNavigate()
  // Get individual board data with id
  const board = useSelector(state => selectBoardById(state, id))

  let content
  let disabled

  const {
    data: columns,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetColumnsQuery()

  const [addNewSubtask, {
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    isError: isError2,
    error: error2
  }] = useAddNewSubtaskMutation()

  const [addNewTask, {
    isLoading: isLoading3,
    isSuccess: isSuccess3,
    isError: isError3,
    error: error3
  }] = useAddNewTaskMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [columnId, setColumnId] = useState('')
  const [columnsForMenu, setColumnsForMenu] = useState('')
  const [subtaskTitles, setSubtaskTitles] = useState([{ title: '' }])

  // Empty the task states after creating the task and going to the board page
  useEffect(() => {
    if (isSuccess3) {
      setTitle('')
      setDescription('')
      setColumnId('')
      navigate(`/${id}`)
    }
  }, [isSuccess3, navigate, id, subtaskTitles])

  // Empty the subtask states after creating the subtask 
  useEffect(() => {
    if (isSuccess2) {
      setSubtaskTitles('')
    }
  }, [isSuccess2, subtaskTitles])

  const onTitleCreated = e => setTitle(e.target.value)
  const onDescriptionCreated = e => setDescription(e.target.value)
  const onColumnChosen = e => setColumnId(e.target.value)

  // Function get the input value of the subtask name 
  const onSubtaskTitlesCreated = (index, event) => {
    let data = [...subtaskTitles];
    data[index][event.target.name] = event.target.value;
    setSubtaskTitles(data);
  }

  // Function to add the subtask names
  const addSubtitles = (e) => {
    e.preventDefault()
    let newSubtitle = { title: '' }
    setSubtaskTitles([...subtaskTitles, newSubtitle])

  }
  // Function to remove the subtask names
  const removeSubtitles = (index) => {
    let data = [...subtaskTitles];
    data.splice(index, 1)
    setSubtaskTitles(data)

  }

  // Make a button disabled when no subtasks
  if (subtaskTitles.find(o => o.title === '')) {
    disabled = true
  } else {
    disabled = false
  }

  // Make Create new task and subtasks
  const onformSubmited = async (e) => {
    e.preventDefault()

    if (canSaveTask & canSaveSubtask) {
      const newtask = await addNewTask({ title, description, columnId })
      const taskId = newtask.data.task._id

      await subtaskTitles.forEach(subtaskTitle => {
        addNewSubtask({ title: subtaskTitle.title, taskId })
      })
    }
    navigate(`/${id}`)
  }

  if (isLoading) content = <p>Loading Boards...</p>

  if (isError) {
    content = <p className="error-message">{error?.data?.message}</p>
  }

  // Preparing the columns for the select input
  useEffect(() => {
    let fullColumnInBoard = []
    if (board) {
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
        setColumnId(fullColumnInBoard[0].id)
      }
    }

  }, [board, columns, isSuccess]);

  const canSaveTask = [title, columnId].every(Boolean) && !isLoading3
  const canSaveSubtask = !isLoading2

  const errContent = (error3?.data?.message || error2?.data?.message) ?? ''

  content = (
    <>
      {id ? <BoardWithId /> : <BoardWithOutId />}
      <div className="overlay" onClick={() => navigate(`/${id}`)}></div>
      <form
        className={`new-task ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'dark-background' : 'light-background'}`}
        onSubmit={onformSubmited}
      >
        <p style={{ display: (isError3 || isError2) ? "inline" : "none" }}>{errContent}</p>
        <h3
          className={` ${dark ? 'light-text' : 'dark-text'}`}
        >Add New Task
        </h3>
        <label htmlFor="title"
          className={` ${dark ? 'light-text' : 'grey-text'}`}
        >Title</label>
        <div className="input-container"
          style={title === '' ? { borderColor: "rgb(234, 85, 85)" } : null}
        >
          <input
            id="title"
            name="title"
            type="text"
            autoComplete="off"
            className={` ${dark ? 'light-text' : 'dark-text'}`}
            value={title}
            onChange={onTitleCreated}
            placeholder="e.g. Take coffee break"
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
          className={` ${dark ? 'light-text' : 'dark-text'}`}
          placeholder="e.g. It’s always good to take a break. 
          This 15 minute break will recharge the batteries a little."
        />
        <label htmlFor="subtask"
          className={` ${dark ? 'light-text' : 'grey-text'}`}
        >Subtasks</label>
        {subtaskTitles.map((input, index) => {
          return (
            <div className="new-task__subtasks"
              key={index}>
              <div className="input-container"
                style={input.title === '' ? { borderColor: "rgb(234, 85, 85)" } : null}
              >
                <input
                  id="subtask"
                  name="title"
                  type="text"
                  autoComplete="off"
                  value={input.title}
                  className={` ${dark ? 'light-text' : 'dark-text'}`}
                  onChange={event => onSubtaskTitlesCreated(index, event)}
                  placeholder='e.g. Make coffee'
                />
                <span
                  style={input.title === '' ? { display: "inline" } : { display: "none" }}
                >Can’t be empty</span>
              </div>

              <button
                onClick={() => removeSubtitles(index)}
              ><img src={iconcross} alt=""
                /></button>
            </div>
          )
        })}
        <button className="light-button" onClick={addSubtitles}>+ Add New Subtitle</button>
        <label htmlFor="columns"
          className={`columns-label ${dark ? 'light-text' : 'grey-text'}`}
        >Status</label>
        <select id='columns' onChange={onColumnChosen}
          value={columnId}
          className={`columns-select ${dark ? 'light-text' : 'dark-text'}`}
        >
          {columnsForMenu}
        </select>
        <button type="submit" className="dark-button" disabled={!canSaveTask || disabled
          || !canSaveSubtask
        }>Create Task</button>
      </form>
    </>
  )

  return content

}

export default NewTask
