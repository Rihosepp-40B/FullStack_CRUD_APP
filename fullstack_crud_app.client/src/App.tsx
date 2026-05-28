import { } from 'react';
import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import TaskList from './views/TaskList';

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<TaskList />} />
            </Routes>
        </HashRouter>
    );
}
