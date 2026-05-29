import { } from 'react';
import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import TaskList from './views/TaskList';
import TaskCreate from './views/TaskCreate';
import TaskDetail from './views/TaskDetail';

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<TaskList />} />
                <Route path="/create" element={<TaskCreate />} />
                <Route path="/:tasksId" element={<TaskDetail />} />
            </Routes>
        </HashRouter>
    );
}
