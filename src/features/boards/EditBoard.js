import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useState, useEffect } from "react"
import { useUpdateBoardMutation, useGetBoardsQuery } from "./boardsApiSlice"
import {
    useUpdateColumnMutation, useDeleteColumnMutation,
    useGetColumnsQuery, useAddNewColumnMutation
} from "../columns/columnsApiSlice"
import iconcross from "../assets/icon-cross.svg";
import BoardWithId from "../../components/BoardWithId"
import BoardWithOutId from "../../components/BoardWithOutId"

const EditBoard = () => {
    const { sidebarOpen, dark } = useOutletContext();
    const { id } = useParams()
    const navigate = useNavigate()

    let content
    let disabled

    const {
        data: board,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBoardsQuery()

    const [updateBoard, {
        isLoading: isLoading2,
        isSuccess: isSuccess2,
        isError: isError2,
        error: error2
    }] = useUpdateBoardMutation()

    const {
        data: columns,
        isError: isError3,
        error: error3
    } = useGetColumnsQuery()

    const [addNewColumn, {
        isLoading: isLoading4,
        isError: isError4,
        error: error4
    }] = useAddNewColumnMutation()

    const [updateColumn,
        {
            isLoading: isLoading5,
            isError: isError5,
            error: error5
        }] = useUpdateColumnMutation()

    const [deleteColumn, {
        isError: isDelError,
        error: delerror
    }] = useDeleteColumnMutation()


    const [name, setName] = useState('')
    const [column, setColumn] = useState([])


    // If update board is successfull, got to the individual board page
    useEffect(() => {
        if (isSuccess2) {
            navigate(`/${id}`)
        }
    }, [id, isSuccess2, navigate])

    if (isLoading) content = <p>Loading Boards...</p>

    if (isError) {
        content = <p className="error-message">{error?.data?.message}</p>
    }

            // If getting the board data is successfull it creates an array of the column it contains
    useEffect(() => {
        if (isSuccess) {
            const { entities } = board;
            const boardInfo = Object.values(entities).find(obj => obj.id === id);

            if (columns) {
                const fullColumnInBoard = [];
                const { entities } = columns;
                const columnIds = Object.keys(entities).map(item => item);

                // Get the columns that are in this board and put in an array
                if (boardInfo.columns) {
                    const columnInBoard = boardInfo.columns.filter(i => columnIds.includes(i));
                    columnInBoard.forEach(sub => {
                        const columnEntity = Object.values(entities).find(obj => obj.id === sub);
                        if (columnEntity) {
                            fullColumnInBoard.push(columnEntity);
                        }
                    });
                }

                setColumn(fullColumnInBoard);
            }
            setName(boardInfo.name)

        }
    }, [isSuccess, board, columns, id]);

// Sets column name to the current input
        const onColumnNameChanged = (index, event) => {
            let data = []
            column.forEach((col, i) => {
                data[i] = { ...col }
            })
            data[index][event.target.name] = event.target.value
            setColumn(data)
        }

    // Deletes column chosen
        const onDeleteColumnClicked = async (index, event) => {
            event.preventDefault()
            if (column[index].id) {
                await deleteColumn({ boardId: id, id: column[index].id })
                let data = []
                column.forEach((col, i) => {
                    data[i] = { ...col }
                })
                data.splice(index, 1)
                setColumn(data)
            } else {
                let data = []
                column.forEach((col, i) => {
                    data[i] = { ...col }
                })
                data.splice(index, 1)
                setColumn(data)
            }
        }
    
        // Add new column in column array
        const addColumns = (e) => {
            e.preventDefault()
            let newColumn = { name: '' }
            setColumn([...column, newColumn])
        }

        // Column component with the input and delete button
        const columnComponent = column.map((input, index) => {
            return (
                <div className="edit-board-columns"
                    key={index}
                >
                    <div className="input-container"
                        style={input.name === '' ? { borderColor: "rgb(234, 85, 85)" } : null}>
                        <input
                            id="column"
                            name="name"
                            type="text"
                            autoComplete="off"
                            value={input.name}
                            onChange={event => onColumnNameChanged(index, event)}
                                                    className={` ${dark ? 'light-text' : 'dark-text'}`}
                        />
                        <span
                            style={input.name === '' ? { display: "inline" } : { display: "none" }}
                        >Can’t be empty</span>
                    </div>

                    <button
                        onClick={event => onDeleteColumnClicked(index, event)}
                    ><img src={iconcross} alt=""
                        /></button>
                </div>
            )
        })

    // if any column in the column array is emoty, disable is true
        if (column.find(o => o.name === '')) {
            disabled = true
        } else {
            disabled = false
        }

    // When the form in sumbited, it updates the board and its columns
        const onSaveBoardColumnClicked = async (e) => {
            e.preventDefault()

            await updateBoard({ id, name })
            await column.forEach(col => {
                if (col.id) {
                    updateColumn({ boardId: id, id: col.id, name: col.name })
                } else {
                    addNewColumn({ boardId: id, name: col.name })
                }
            })
        }

        const canSaveBoard = [name].every(Boolean) && !isLoading2

        const canSaveColumn = !isLoading4 && !isLoading5 && !isLoading2

        const errContent = (error5?.data?.message || error2?.data?.message || error3?.data?.message || error4?.data?.message || delerror?.data?.message) ?? ''

        content = (<>
            {id ? <BoardWithId /> : <BoardWithOutId />}
            <div className="overlay"
                onClick={() => { navigate(`/${id}`) }}
            ></div>
            <form
                className={`edit-board ${sidebarOpen ? 'active' : 'inactive'} ${dark ? 'dark-background' : 'light-background'}`}
                onSubmit={onSaveBoardColumnClicked}
            >
                <p style={{ display: (isError2 || isError3 || isError4 || isError5 || isDelError) ? "inline" : "none" }}>{errContent}</p>
                <h3
                    className={` ${dark ? 'light-text' : 'dark-text'}`}

                >Edit Board</h3>
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
                        onChange={(e) => setName(e.target.value)}
                        className={` ${dark ? 'light-text' : 'dark-text'}`}
                    />
                    <span
                        style={name === '' ? { display: "inline" } : { display: "none" }}
                    >Can’t be empty</span>
                </div>
                <label htmlFor="column"
                    className={` ${dark ? 'light-text' : 'grey-text'}`}
                >Board Columns</label>
                {columnComponent}
                <button className="light-button"
                    onClick={addColumns}
                >+ Add New Column</button>
                <button className="dark-button"
                    disabled={!canSaveBoard || disabled || !canSaveColumn ? true : false}
                >Save Changes</button>
            </form>
        </>)
    // }
    return content
}


export default EditBoard