import { Routes, Route } from 'react-router-dom'
import BoardLayout from './components/BoardLayout';
import ViewTaskPage from './features/tasks/ViewTaskPage';
import NewBoard from './features/boards/NewBoard';
import EditBoard from './features/boards/EditBoard';
import DeleteBoard from './features/boards/DeleteBoard';
import EditTask from './features/tasks/EditTask';
import NewTask from './features/tasks/NewTask';
import DeleteTask from './features/tasks/DeleteTask';
import BoardWithId from './components/BoardWithId';
import BoardWithOutId from './components/BoardWithOutId';
import NotFound from './components/NotFound';
import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Routes>
      <Route path="/" element={<BoardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
        <Route index element={<BoardWithOutId />} />
        <Route path='*' element={<NotFound />} />
        <Route path="createboard" element={<NewBoard />} />
        <Route path=":id">
          <Route index element={<BoardWithId />} />
          <Route path="editboard" element={<EditBoard />} />
          <Route path="createboard" element={<NewBoard />} />
          <Route path="deleteboard" element={<DeleteBoard />} />
          <Route path="createtask" element={<NewTask />} />
          <Route path=":columnid/:taskid" >
            <Route index element={<ViewTaskPage />} />
            <Route path="edittask" element={<EditTask />} />
            <Route path="deletetask" element={<DeleteTask />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
