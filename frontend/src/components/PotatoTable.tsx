// src/components/PotatoTable.tsx
import { useState } from "react";
import {
    PotatoItem,
    updatePotatoItem,
    deletePotatoItem,
} from "../services/potatoService";

/** props from LandingPage */
type Props = {
    items: PotatoItem[];
    onSave: (updated: PotatoItem) => void;
    onDelete: (id: number) => void;
};

export default function PotatoTable({ items, onSave, onDelete }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draft, setDraft] = useState<PotatoItem | null>(null);

    if (!items.length) return <p>No potato stats yet…</p>;

    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>$ / hr</th>
                <th>Potato's / hr</th>
                <th>Type</th>
                <th>Experience</th>
                <th style={{ width: 90 }} />
            </tr>
            </thead>

            <tbody>
            {items.map((p) =>
                editingId === p.id ? (
                    // EDIT ROW
                    <tr key={`edit-${p.id}`}>
                        <td>
                            <input
                                value={draft!.name}
                                onChange={(e) =>
                                    setDraft({ ...draft!, name: e.target.value })
                                }
                            />
                        </td>

                        <td>
                            <input
                                type="number"
                                value={draft!.hourlyPay}
                                onChange={(e) =>
                                    setDraft({ ...draft!, hourlyPay: +e.target.value })
                                }
                            />
                        </td>

                        <td>
                            {(draft!.hourlyPay / draft!.potatoPriceAtConversion).toFixed(1)}
                        </td>

                         {/*radio buttons employment type (rubric) */}
                        <td>
                            <label>
                                <input
                                    type="radio"
                                    name={`employmentType-${p.id}`}
                                    value="Hourly"
                                    checked={draft!.employmentType === "Hourly"}
                                    onChange={() =>
                                        setDraft({ ...draft!, employmentType: "Hourly" })
                                    }
                                />
                                H
                            </label>
                            <label style={{ marginLeft: "0.5rem" }}>
                                <input
                                    type="radio"
                                    name={`employmentType-${p.id}`}
                                    value="Salary"
                                    checked={draft!.employmentType === "Salary"}
                                    onChange={() =>
                                        setDraft({ ...draft!, employmentType: "Salary" })
                                    }
                                />
                                S
                            </label>
                        </td>

                         {/*select experience level drop down (rubric)*/}
                        <td>
                            <select
                                value={draft!.experienceLevel}
                                onChange={(e) =>
                                    setDraft({ ...draft!, experienceLevel: e.target.value })
                                }
                            >
                                <option value="Junior">Junior</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Senior">Senior</option>
                            </select>
                        </td>

                        <td>
                            <button
                                onClick={async () => {
                                    // send update → backend, bubble result up
                                    const saved = await updatePotatoItem(p.id!, draft!);
                                    onSave(saved);
                                    setEditingId(null);
                                }}
                                title="Save"
                            >
                                SAVE
                            </button>
                            <button onClick={() => setEditingId(null)} title="Cancel">
                                CANCEL
                            </button>
                        </td>
                    </tr>
                ) : (
                    // READ-ONLY ROW
                    <tr
                        key={`${p.id}-${p.employmentType}-${p.experienceLevel}-${p.hourlyPay}`}
                    >
                        <td>{p.name}</td>
                        <td>{p.hourlyPay.toFixed(2)}</td>
                        <td>{(p.hourlyPay / p.potatoPriceAtConversion).toFixed(1)}</td>
                        <td>{p.employmentType}</td>
                        <td>{p.experienceLevel}</td>

                        <td>
                            <button
                                onClick={() => {
                                    setEditingId(p.id!);
                                    setDraft({ ...p }); //
                                }}
                                title="Edit"
                            >
                                EDIT
                            </button>
                            <button
                                onClick={async () => {
                                    await deletePotatoItem(p.id!);
                                    onDelete(p.id!);
                                }}
                                title="Delete"
                            >
                                DELETE
                            </button>
                        </td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
}
