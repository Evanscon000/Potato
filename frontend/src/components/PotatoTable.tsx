// src/components/PotatoTable.tsx
import { useState } from "react";
import {
    PotatoItem,
    updatePotatoItem,
    deletePotatoItem,
} from "../services/potatoService";

type Props = {
    items: PotatoItem[];
    onSave: (updated: PotatoItem) => void;   // LandingPage replaces row
    onDelete: (id: number) => void;          // LandingPage filters row out
};

export default function PotatoTable({ items, onSave, onDelete }: Props) {
    // local edit
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draft, setDraft] = useState<PotatoItem | null>(null);

    if (!items.length) return <p>No potato stats yet…</p>;

    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>$/hr</th>
                <th>Potatoes/hr</th>
                <th style={{ width: "90px" }} />
            </tr>
            </thead>

            <tbody>
            {items.map((p) =>
                editingId === p.id ? (

                    // EDIT
                    <tr key={p.id}>
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
                        <td>
                            <button
                                onClick={async () => {
                                    const saved = await updatePotatoItem(p.id!, draft!);
                                    onSave(saved);            // update parent state
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
                    //READ-ONLY ROW
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.hourlyPay.toFixed(2)}</td>
                        <td>
                            {(p.hourlyPay / p.potatoPriceAtConversion).toFixed(1)}
                        </td>
                        <td>
                            <button
                                onClick={() => {
                                    setEditingId(p.id!);
                                    setDraft(p);
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
