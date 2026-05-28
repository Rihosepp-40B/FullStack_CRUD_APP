import { } from 'react';
import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import TaskList from './views/TaskList';
import TaskCreate from './views/TaskCreate';

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<TaskList />} />
                <Route path="/create" element={<TaskCreate />} />
            </Routes>
        </HashRouter>
    );
}
