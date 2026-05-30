import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Task } from "../types/task";
import { formDTG } from "../helpers/formDTG";

export default function TaskDelete() {
    const { tasksId } = useParams<{ tasksId: string }>();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!tasksId) {
                setError("No task ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/tasks/${encodeURIComponent(tasksId)}`);
                if (!res.ok) throw new Error(`Failed to load task (${res.status})`);

                const data: Task = await res.json();
                setTask(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load task");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [tasksId]);

    const onDelete = async () => {
        if (!tasksId) return;

        try {
            setDeleting(true);
            setError(null);

            const res = await fetch(`/api/tasks/${encodeURIComponent(tasksId)}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`Delete failed (${res.status})`);

            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete");
        } finally {
            setDeleting(false);
        };
    }

    if (loading) return <div style={{ padding: "20px" }}>Loading...</div>
    if (error) {
        return (
            <div style={{ padding: 20 }}>
                <h1>Task Deletel</h1>
                <p style={{ color: 'crimson' }}>Error: {error}</p>
                <div style={{ display: "flex", gap: 12 }}>
                    <Link to="/">Return to list</Link>
                </div>
            </div>
        )
    }
    return (
        <div>
            <h1>Delete Task</h1>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {!task ? (
                <p>Task not found</p>
            ) : (
                    <>
                        <p>Confirm if you want ot delete:</p>
                        <div>
                            <b>{task.what}</b><br />
                            {/* 1. where, kontrollib kas on sisu ja sisi 2. where wõrdleb kas väärtus on "TBD" */}
                            {task.where && task.where !== "TBD" && `${task.where} `}{formDTG(task.when)}<br />
                            {task.why}
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button type="button" className="delete" onClick={onDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Yes, delete"}
                            </button>

                            <button type="button" className="return" onClick={() => navigate("/")} disabled={deleting}>
                                Return
                            </button>
                        </div>
                    </>
            )}
        </div>
    );
}