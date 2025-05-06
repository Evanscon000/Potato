import { useState } from "react";
import { createPotatoItem, PotatoItem } from "../services/potatoService";

type Props = { onCreate: (item: PotatoItem) => void };

export default function PotatoForm({ onCreate }: Props) {
    const [name, setName] = useState("");
    const [hourlyPay, setHourlyPay] = useState(0);
    const [hoursPerWeek, setHoursPerWeek] = useState(0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const newItem = await createPotatoItem({
            name,
            hourlyPay,
            hoursPerWeek,
            potatoPriceAtConversion: 0, // placeholder – you’ll compute on backend
        });
        onCreate(newItem);          // let parent refresh UI
        setName("");
        setHourlyPay(0);
        setHoursPerWeek(0);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input value={name}        onChange={e => setName(e.target.value)}        placeholder="Name" />
            <input value={hourlyPay}   onChange={e => setHourlyPay(+e.target.value)}  placeholder="Hourly Pay" type="number" />
            <input value={hoursPerWeek}onChange={e => setHoursPerWeek(+e.target.value)}placeholder="Hours / Week" type="number" />
            <button type="submit">Convert to Potatoes 🥔</button>
        </form>
    );
}
