import { useSelector } from 'react-redux'
import { selectColumnById } from './columnsApiSlice'

const Column2 = ({ columnid }) => {
        // Get individual Column data with id
    const column = useSelector(state => selectColumnById(state, columnid))

    if (column) {
        return (
            < >
                <option
                    value={column.name}
                >{column.name}</option>
            </>
        )

    } else return null
}

export default Column2