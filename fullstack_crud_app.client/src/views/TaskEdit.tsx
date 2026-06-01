import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { useNavigate, useParams } from "react-router-dom";

type FormState = {
    who: string;
    what: string;
    where: string;
    when: string;
    why: string;
    done: boolean;
}

export default function TaskEdit() {
    const { tasksId } = useParams<{ tasksId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<FormState>({
        who: "",
        what: "",
        where: "",
        when: "",
        why: "",
        done: false
    });

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

                const response = await fetch(`/api/tasks/${(encodeURIComponent(tasksId))}`);
                if (!response.ok) throw new Error(`Failed to fetch task (${response.status})`);
                const data: Task = await response.json();
                setForm({
                    who: data.who,
                    what: data.what,
                    where: data.where,
                    when: data.when,
                    why: data.why,
                    done: data.done
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load task");
            } finally {
                setLoading(false);
            }
        };
        load()
    }, [tasksId]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tasksId) {
            setError("No task ID provided");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const payload = {
                who: form.who,
                what: form.what,
                where: form.where || "TBD",
                when: form.when,
                why: form.why,
                done: form.done || false
            }

            const res = await fetch(`/api/tasks/${encodeURIComponent(tasksId)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error(`Failed to update task (${res.status}`);
            }
            navigate(`/${encodeURIComponent(tasksId)}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update task");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: "20px" }}>Loading...</div>

    return (
        <div style={{ margin: "auto", maxWidth: 520 }}>
            <h1>Edit Task</h1>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
                <div>
                    <label>Who</label>
                    <input name="who" value={form.who} onChange={onChange} required style={{ width: "100%", padding: 8 }} />
                </div>

                <div>
                    <label>What</label>
                    <textarea name="what" value={form.what} onChange={onChange} rows={3} required style={{ width: "100%", padding: 8 }} />
                </div>

                <div>
                    <label>Where</label>
                    <input name="where" value={form.where} onChange={onChange} style={{ width: "100%", padding: 8 }} />
                </div>

                <div>
                    <label>When</label>
                    <input name="when" type="datetime-local" value={form.when} onChange={onChange} required style={{ width: "100%", padding: 8 }} />
                </div>

                <div>
                    <label>Why</label>
                    <textarea name="why" value={form.why} onChange={onChange} rows={3} required style={{ width: "100%", padding: 8 }} />
                </div>

                <div>
                    <input name="done" type="checkbox" id="done" checked={form.done}
                        onChange={(e) => { setForm((prev) => ({ ...prev, done: e.target.checked })) }}
                    />
                    <label htmlFor="done" style={{ margin: 0 }}>{form.done ? "Task is Completed" : "Task is Not Done"}</label>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button className="create" type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="return" type="button" onClick={() => navigate(-1)} disabled={saving}>
                        Return
                    </button>
                </div>
            </form>
        </div>
    );
}