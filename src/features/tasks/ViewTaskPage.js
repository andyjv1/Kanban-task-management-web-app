import ViewTask from './ViewTask'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'

const ViewTaskPage = () => {
    const { textColor } = useOutletContext();

    const { id } = useParams()
    const navigate = useNavigate()

    return (
        <>
            <div className="overlay" onClick={() => { navigate(`/${id}`) }}></div>
            <div className="taskview" >
                <ViewTask
                    textColor={textColor}
                /> </div>
        </>
    )
}

export default ViewTaskPage