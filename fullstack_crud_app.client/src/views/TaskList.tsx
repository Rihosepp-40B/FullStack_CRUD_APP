import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types/task";
import { formDTG } from "../helpers/formDTG"
import { useProcessedTasks } from "../hooks/useProcessedTasks";

export default function TaskList() {
    const [task, setTask] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();

    const {
        processedTasks,
        searchFilters,
        handleFilterChange,
        handleSort,
        getSortIndicator
    } = useProcessedTasks(task)

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

    const openDetail = (tasksId: string) => {
        navigate(`/${tasksId}`);
    }

    const openCreate = () => {
        navigate("/create");
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Task Manager</h1>
                <button type="button" className="create" onClick={openCreate}>
                    Add Task
                </button>
            </div>

            {!loading && !error && (
                <table border={1} style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("who")} style={{ cursor: "pointer", userSelect: "none", maxWidth: "10%" }}>
                                Who{getSortIndicator("who")} 
                            </th>
                            <th onClick={() => handleSort("what")} style={{ cursor: "pointer", userSelect: "none", maxWidth: "10%" }}>
                                What{getSortIndicator("what")}
                            </th>
                            <th onClick={() => handleSort("when")} style={{ cursor: "pointer", userSelect: "none", maxWidth: "10%" }}>
                                When{getSortIndicator("when")}
                            </th>
                            <th onClick={() => handleSort("done")} style={{ cursor: "pointer", userSelect: "none", maxWidth: "10%" }}>
                                {"Tasks: "}
                                <select
                                    value={searchFilters.done}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => { e.stopPropagation(); handleFilterChange("done", e.target.value); }}
                                    style={{ maxWidth: "50%", padding: "4px" }}
                                >
                                    <option value="">All</option>
                                    <option value="false">Not Done</option>
                                    <option value="true">Completed</option>
                                </select>{getSortIndicator("done")}
                            </th>
                        </tr>
                        <tr>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Filter who..."
                                    value={searchFilters.who}
                                    onChange={(e) => handleFilterChange("who", e.target.value)}
                                    style={{ width: "90%", padding: "4px"}}
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Filter what..."
                                    value={searchFilters.what}
                                    onChange={(e) => handleFilterChange("what", e.target.value)}
                                    style={{ width: "90%", padding: "4px"}}
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Filter when..."
                                    value={searchFilters.when}
                                    onChange={(e) => handleFilterChange("when", e.target.value)}
                                    style={{ width: "90%", padding: "4px"}}
                                />
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedTasks.length > 0 ? (
                            processedTasks.map((t) => {
                                // rea klassi loogika - tehtud task'id ja tegemata (üleaja ning tähtaeg kohe)
                                let rowClass = "";

                                if (t.done) {
                                    rowClass = "task-done";
                                } else {
                                    const taskDate = new Date(t.when);
                                    const now = new Date();
                                    const diffInMs = taskDate.getTime() - now.getTime();
                                    const diffInHours = diffInMs / (1000 * 60 * 60);

                                    if (diffInMs < 0) {
                                        rowClass = "task-overdue";
                                    } else if (diffInHours <= 24) {
                                        rowClass = "task-warning";
                                    }
                                }
                                return (
                                    <tr key={t.tasksId} className={rowClass}>
                                        <td className="breakable-cell" style={{ width: "20%" }}><div className="three-line-clamp">{t.who}</div></td>
                                        <td className="breakable-cell" style={{ width: "37%" }}><div className="three-line-clamp">{t.what}</div></td>
                                        <td className="breakable-cell" style={{ width: "18%" }}>{formDTG(t.when)}</td>
                                        <td className="breakable-cell" style={{ width: "25%" }}>
                                            <div className="action-buttons-container" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                <button type="button" className="detail"
                                                    onClick={() => openDetail(t.tasksId)}
                                                >
                                                    <span className="btn-icon">📖</span>
                                                    <span className="btn-text">Detail 📖</span>
                                                </button>

                                                <button type="button" className="edit"
                                                    onClick={() => navigate(`/${t.tasksId}/edit`)}>
                                                    <span className="btn-icon">✎</span>
                                                    <span className="btn-text">Edit ✎</span>
                                                </button>
                                                <button type="button" className="delete"
                                                    onClick={() => navigate(`/${t.tasksId}/delete`)}>
                                                    <span className="btn-icon">✖</span>
                                                    <span className="btn-text">Delete ✖</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                                <tr>
                                    <td colSpan={4}>Loading tasks or data not found...</td>
                                </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
  );
}