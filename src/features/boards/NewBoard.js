import { useState, useEffect } from "react"
import { useAddNewBoardMutation, selectBoardById } from "./boardsApiSlice"
import { useAddNewColumnMutation } from "../columns/columnsApiSlice"
import { useNavigate, useParams, 
    useOutletContext 
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconcross from "../assets/icon-cross.svg";
import BoardWithId from "../../components/BoardWithId"
import BoardWithOutId from "../../components/BoardWithOutId"

const NewBoard = () => {
    const { sidebarOpen, dark } = useOutletContext();
    const { id } = useParams()
    const navigate = useNavigate()
            // Get individual board data with id
    const board = useSelector(state => selectBoardById(state, id))
    let disabled

    const [addNewBoard, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewBoardMutation()

    const [addNewColumn, {
        isLoading: isLoading2,
        isSuccess: isSuccess2,
        isError: isError2,
        error: error2
    }] = useAddNewColumnMutation()

    const [name, setName] = useState('')
    const [columnNames, setColumnNames] = useState([{ name: '' }])

        // If create board is successfull, it empties the states
    useEffect(() => {
        if (isSuccess || isSuccess2) {
            setColumnNames([])
            setName('')
        }
    }, [isSuccess, isSuccess2])

    // Function to go back to the home page or the selected board page
    const goToBoard = () => board
        ? navigate(`/${id}`)
        : navigate(`/`)

    // Function get the input value of the board name 
    const onnameChanged = e => setName(e.target.value)

    // Function get the input value of the column name 
    const onColumnNameChanged = (index, event) => {
        let data = [...columnNames];
        data[index][event.target.name] = event.target.value;
        setColumnNames(data);
    }

    // Function to add the column names
    const addColumns = (e) => {
        e.preventDefault()
        let newColumn = { name: '' }
        setColumnNames([...columnNames, newColumn])
    }

    // Function to remove the column names
    const removeColumns = (index) => {
        let data = [...columnNames];
        data.splice(index, 1)
        setColumnNames(data)
    }

        // Make a button disabled when no columns
    if (columnNames.find(o => o.name === '')) {
        disabled = true
    } else {
        disabled = false
    }

        // Make Create new board and columns
    const onSaveBoardClicked = async (e) => {
        e.preventDefault()

        if (canSaveBoard & canSaveColumn) {
            const newBoard = await addNewBoard({ name })
            const boardId = newBoard.data.board._id

            await columnNames.forEach(col => {
                addNewColumn({ name: col.name, boardId })
            })
            navigate(`/${boardId}`)
        }
    }



    const canSaveBoard = [name].every(Boolean) && !isLoading
    const canSaveColumn = !isLoading2
    const errContent = (error?.data?.message || error2?.data?.message) ?? ''

    const content = (
        <>
            {id ? <BoardWithId /> : <BoardWithOutId />}
            <div className="overlay" onClick={goToBoard}></div>
            <form
                className={`new-board ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'dark-background' : 'light-background'}`}

                onSubmit={onSaveBoardClicked}
            >
                <h3
            className={` ${dark ? 'light-text' : 'dark-text'}`}
                >Add New Board</h3>
                <p className="error-message" style={{ display: (isError || isError2) ? "inline" : "none" }}>{errContent}</p>

                <label htmlFor="name"
                    className={` ${dark ? 'light-text' : 'grey-text'}`}
                >Board Name</label>
                <div className="input-container"
                    style={name === '' ? { borderColor: "rgb(234, 85, 85)" } : null}>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        value={name}
                        onChange={onnameChanged}
                        placeholder="e.g. Web Design"
                        className={` ${dark ? 'light-text' : 'dark-text'}`}
                    />
                    <span
                        style={name === '' ? { display: "inline" } : { display: "none" }}
                    >Can’t be empty</span>
                </div>
                <label htmlFor="column"
                    className={` ${dark ? 'light-text' : 'grey-text'}`}
                >Board Columns</label>

                {columnNames.map((input, index) => {
                    return (
                        <div className="new-board-columns" key={index}>
                            <div className="input-container"
                                style={input.name === '' ? { borderColor: "rgb(234, 85, 85)" } : null}>
                                <input
                                    id="column"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    value={input.name}
                                    onChange={event => onColumnNameChanged(index, event)}
                                    placeholder='Todo'
                                    className={` ${dark ? 'light-text' : 'dark-text'}`}
                                />
                                <span
                                    style={input.name === '' ? { display: "inline" } : { display: "none" }}
                                >Can’t be empty</span>
                            </div>
                            <button
                                onClick={() => removeColumns(index)}>
                                <img src={iconcross} alt=""/>
                            </button>
                        </div>
                    )
                })}
                <button className="light-button" onClick={addColumns}>+ Add New Column</button>
                <button className="dark-button" disabled={!canSaveBoard || !canSaveColumn || disabled}
                >Create New Board</button>
            </form>
        </>
    )

    return content

}

export default NewBoard

