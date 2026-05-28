import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types/task";

export default function TaskList() {
    const [task, setTask] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();

    useEffect(() => {
        // ühendus controlleriga
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/tasks");
                if (response.ok) {
                    const data = await response.json();
                    setTask(data);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to load tasks");
            } finally {
                setLoading(false)
            }
        };

        fetchTasks();
    }, []);

    const openDetail = (taskId: string) => {
        navigate(`/${taskId}`);
    }

    const openCreate = () => {
        navigate("/create");
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Task Manager</h1>
                <button type="button" className="create" onClick={openCreate}>
                    add task
                </button>
            </div>

            {!loading && !error && (
                <table border={1} style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Who</th>
                            <th>What</th>
                            <th>When</th>
                            <th style={{ width: 220 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {task.length > 0 ? (
                            task.map((t) => (
                                <tr key={t.taskId}>
                                    <td>{t.who}</td>
                                    <td>{t.what}</td>
                                    <td>{t.when}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button type="button" className="detail"
                                                onClick={() => openDetail(t.taskId)}
                                            >
                                                Detail
                                            </button>

                                            <button type="button" className="edit"
                                                onClick={() => navigate(`/${t.taskId}/edit`)}>
                                                Edit
                                            </button>
                                            <button type="button" className="delete"
                                                onClick={() => navigate(`/${t.taskId}/delete`)}>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>Loading tasks or data not found...</tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
  );
}