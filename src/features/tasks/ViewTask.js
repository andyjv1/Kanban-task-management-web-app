import React, { useState, useEffect, useRef } from 'react'
import {
    useParams, useOutletContext
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconVerticalEllipsis from "../assets/icon-vertical-ellipsis.svg";
import { useGetTasksQuery, useUpdateTaskMutation, selectTaskById } from './tasksApiSlice';
import { useNavigate } from 'react-router-dom'
import { useGetColumnsQuery } from "../columns/columnsApiSlice"
import { selectBoardById } from "../boards/boardsApiSlice"
import { useGetSubtasksQuery, useUpdateSubtaskMutation } from '../subtasks/subtasksApiSlice';
import BoardWithId from "../../components/BoardWithId"
import BoardWithOutId from "../../components/BoardWithOutId"
import { subcomponents } from '../../utils/subcomponents';
import { columnIds } from '../../utils/columnIds';

const ViewTask = () => {
    const { sidebarOpen, dark } = useOutletContext();

    const ref = useRef()
    const navigate = useNavigate()
    const { id, taskid, columnid } = useParams()

    const board = useSelector(state => selectBoardById(state, id))
    const task = useSelector(state => selectTaskById(state, taskid))

    const [editTaskBox, setEditTaskBox] = useState(true)
    const [columnsForMenu, setColumnsForMenu] = useState('')
    const [columnId, setColumnId] = useState('')

    const {
        data: tasks,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTasksQuery()

    const [updateTask, {
        isLoading: isLoading2,
        isError: isError2,
        error: error2
    }] = useUpdateTaskMutation()

    const {
        data: substasks,
        isLoading: isLoading3,
        isSuccess: isSuccess3,
        isError: isError3,
        error: error3
    } = useGetSubtasksQuery()

    const [updateSubtask, {
        isLoading: isLoading4,
        isError: isError4,
        error: error4
    }] = useUpdateSubtaskMutation()

    const {
        data: columns,
        isLoading: isLoading5,
        isSuccess: isSuccess5,
        isError: isError5,
        error: error5
    } = useGetColumnsQuery()


    let subtaskComponent
    let subtaskLabel
    let fullsubtaskInTask = []


    let subcheckedlegnth = 0
    let content

    // Preparing the columns for the select input
    useEffect(() => {
        let fullColumnInBoard = []
        if (board) {
            if (isSuccess && isSuccess5) {
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


    if (isLoading3) subtaskComponent = <p>Loading Columns...</p>

    if (isError3 || isError4) {
        subtaskComponent = <p className="error-message">{`${error3?.data?.message}, ${error4?.data?.message}`}</p>
    }

    // Preparing the subtask for the checkbox input
    if (isSuccess3 && isSuccess) {
        const { entities } = substasks
        // Get the subtask that are in this task and put in an array
        const subtasksInTask = Object.values(tasks.entities).find(obj => obj.id === taskid).subtasks
        fullsubtaskInTask = subcomponents(subtasksInTask, Object.values(entities), fullsubtaskInTask)

    }


    // Individual subtasks component
    subtaskComponent = fullsubtaskInTask.map((subtask, index) => {
        return (
            <div 
                className={`view-task__subtasks ${dark ? 'very-dark-background' : 'very-light-background'}
                ${dark ? 'light-text' : 'grey-text'} `}
                onClick={event => handleActive(index, event)}
            >
                <input
                    className="toggle-subtask"
                    type="checkbox"
                    id={index}
                    name="subtask"
                    key={subtask.id}
                    value={subtask.title}
                    checked={subtask.isCompleted}
                    disabled={isLoading4}
                />
                <label htmlFor="subtask"
                    className={`${dark ? 'light-text' : 'dark-text'} `}
                    style={{ color: !subtask.isCompleted ? null : "rgb(130, 143, 163)" }}
                >{subtask.title}</label>
            </div>
        )
    })

    //  Get the number of subtasks and the subtasks selected
    const sublength = fullsubtaskInTask.length
    fullsubtaskInTask.forEach(sub => {
        if (sub.isCompleted === true) {
            subcheckedlegnth++
        }
    })
    subtaskLabel = `Subtasks (${subcheckedlegnth} of ${sublength})`

    if (isLoading || isLoading5) content = <p>Loading Tasks...</p>

    if (isError || isError2 || isError5) {
        content = <p className="error-message">{`${error?.data?.message}, 
        ${error5?.data?.message}, 
        ${error2?.data?.message}`}</p>
    }

    // When you click outside the editTaskBox div, the editTaskBox goes away
    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (!editTaskBox && ref.current && !ref.current.contains(e.target)) {
                setEditTaskBox(true)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [editTaskBox])

    // When you click the ellipse, the editTaskBox div appears
    const onVerticalIconClicked = () => { setEditTaskBox(!editTaskBox) }

    // When you use the checkbox, the subtask get completed or the not
    const handleActive = async (index, event) => {
        await updateSubtask({ isCompleted: !fullsubtaskInTask[index].isCompleted, taskId: taskid, id: fullsubtaskInTask[index].id, title: fullsubtaskInTask[index].title })
    };

    // When you use the select, the task changes column
    const onColumnChosen = async (e) => {
        setColumnId(e.target.value)
        await updateTask({ title: task.title, columnId: e.target.value, id: taskid })
    }
    if (isSuccess && isSuccess5) {

        content = (
            <>
                {id ? <BoardWithId /> : <BoardWithOutId />}
                <div className="overlay" onClick={() => navigate(`/${id}`)}></div>
                <div
                    className={`view-task ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'dark-background' : 'light-background'}`}
                >
                    <div className='view-task__actions' ref={ref}>
                        <h2
                            className={`${dark ? 'light-text' : 'dark-text'}`}
                            style={{
                                paddingBottom: task.description ? "1.7rem" : "0"
                            }}
                        >{task.title}</h2>
                        <img src={iconVerticalEllipsis} alt="" onClick={onVerticalIconClicked} />

                        <div
                            className={`view-task__actions-container ${editTaskBox ? 'inactive' : 'active'} ${dark ? 'dark-background' : 'light-background'}`}
                        >
                            <p className='grey-text' onClick={() => { navigate(`/${id}/${columnid}/${taskid}/edittask`) }}>Edit Task</p>
                            <p className='red-text' onClick={() => { navigate(`/${id}/${columnid}/${taskid}/deletetask`) }}>Delete Task</p>
                        </div>
                    </div>

                    <h3>{task.description}</h3>
                    <label htmlFor="subtasks"
                        className={`subtasks-label 
                        ${dark ? 'light-text' : 'grey-text'} 
                        `}
                    >{subtaskLabel}</label>{/* To change */}
                    {subtaskComponent}
                    <label htmlFor="columns"
                        className={`columns-label 
                        ${dark ? 'light-text' : 'grey-text'} 
                        `}                    >Current Status</label>
                    <select id='columns'
                        className={` columns-select ${dark ? 'light-text' : 'dark-text'}`}
                        value={columnId}
                        onChange={onColumnChosen}
                        disabled={isLoading2}
                    >
                        {columnsForMenu}
                    </select>
                </div>
            </>
        )
    }

    return content


}

export default ViewTask
