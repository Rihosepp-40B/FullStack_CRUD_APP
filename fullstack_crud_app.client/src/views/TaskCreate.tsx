import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormState = {
    who: string;
    what: string;
    where: string;
    when: string;
    why: string;
    done: boolean;
}
export default function TaskCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({
        who: "TBD",
        what: "",
        where: "",
        when: "",
        why: "",
        done: false
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError(null);

            const payload = {
                who: form.who,
                what: form.what || null,
                where: form.where || null,
                when: form.when || null,
                why: form.why || null,
                done: false
            }

            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error("Failed to add task");
            }

            const result = await res.json();
            console.log("Task added:", result);
            navigate("/");

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error adding task");
        } finally {
            setSaving(false);
        }
    };
    
    return (
        <div>
            <h1>Add Task</h1>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
                <div>
                    <label>Who</label>
                    <input name="who" value={form.who} onChange={onChange} required style={{ width: "100%", padding: 8 }} />
                </div>
                <div>
                    <label>What</label>
                    <input name="what" value={form.what} onChange={onChange} required style={{ width: "100%", padding: 8 }} />
                </div>
                <div>
                    <label>Where</label>
                    <input name="where" value={form.where} onChange={onChange} style={{ width: "100%", padding: 8 }} />
                </div>
                <div>
                    <label>When</label>
                    <input name="when" type="datetime-local" value={form.when} onChange={onChange} style={{ width: "100%", padding: 8 }} />
                </div>
                <div>
                    <label>Why</label>
                    <input name="why" value={form.why} onChange={onChange} required style={{ width: "100%", padding: 8 }} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="create" type="submit" disabled={saving}>
                        {saving ? "Adding..." : "Add task"}
                    </button>
                    <button className="return" type="button" onClick={() => navigate("/")}>
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}