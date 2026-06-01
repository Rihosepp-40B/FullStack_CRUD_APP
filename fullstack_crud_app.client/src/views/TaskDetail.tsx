import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Task } from '../types/task'
import { formDTG } from "../helpers/formDTG";

export default function TaskDetail() {
    const { tasksId } = useParams<{ tasksId: string }>();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tasksId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError("No task ID provided"); // ülemine kommentaar võtab setErrorilt errori maha
            setLoading(false);
            return;
        }

        const fetchTask = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/tasks/${encodeURIComponent(tasksId)}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch task (${response.status})`);
                }
                const data: Task = await response.json();
                setTask(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [tasksId]);
    if (loading) return <div style={{ padding: 20 }}>Loading...</div>
    if (error) {
        return (
            <div style={{ padding: 20 }}>
                <h1>Task Detail</h1>
                <p style={{ color: 'crimson' }}>Error: {error}</p>
                <div style={{ display: "flex", gap: 12 }}>
                    <Link to="/">Return to list</Link>
                </div>
            </div>
        )
    }

    if (!task) {
        return (
            <div style={{ padding: 20 }}>
                <h1>Task Detail</h1>
                <p>Task not found</p>
                <Link to="/">Return to list</Link>
            </div>
        )
    }

    return (
        <div style={{ margin: "auto", maxWidth: 520 }}>
            <h1>Task Detail</h1>

            <table border={1} cellPadding={8} cellSpacing={0} style={{ width: "100%", marginTop: 10 }}>
                <tbody>
                    <tr>
                        <th style={{ textAlign: "left", width: 100 }}>ID</th>
                        <td>{task.tasksId}</td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left", width: 100 }}>Who</th>
                        <td>{task.who}</td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left", width: 100 }}>What</th>
                        <td>{task.what}</td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left", width: 100 }}>Where</th>
                        <td>{task.where}</td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left", width: 100 }}>When</th>
                        <td>{formDTG(task.when)}</td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left", width: 100 }}>Why</th>
                        <td>{task.why}</td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left", width: 100 }}>Done</th>
                        <td>{task.done ? "Completed" : "Not Done"}</td>
                    </tr>
                </tbody>
            </table>
            <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                <button type="button" className="return" onClick={() => navigate("/")}>
                    Return
                </button>
            </div>
        </div>
  );
}