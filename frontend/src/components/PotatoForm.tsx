// src/components/PotatoForm.tsx

import { useState } from "react";
import { createPotatoItem, PotatoItem } from "../services/potatoService";

type Props = { onCreate: (item: PotatoItem) => void };

export default function PotatoForm({ onCreate }: Props) {
    const [name, setName] = useState("");
    const [hourlyPay, setHourlyPay] = useState(0);
    const [hoursPerWeek, setHoursPerWeek] = useState(0);
    const [employmentType, setEmploymentType] = useState("Hourly");
    const [experienceLevel, setExperienceLevel] = useState("Junior");


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const newItem = await createPotatoItem({
            name,
            hourlyPay,
            hoursPerWeek,
            potatoPriceAtConversion: 0, // placeholder – compute on backend
            employmentType,
            experienceLevel,
        });
        onCreate(newItem);          // let parent refresh UI
        setName("");
        setHourlyPay(0);
        setHoursPerWeek(0);
        setEmploymentType("Hourly"); // reset to default
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                value={hourlyPay}
                onChange={e => setHourlyPay(+e.target.value)}
                placeholder="Hourly Pay"
                type="number"
            />
            <input
                value={hoursPerWeek}
                onChange={e => setHoursPerWeek(+e.target.value)}
                placeholder="Hours / Week"
                type="number"
            />

            {/* Radio button input for employment type */}
            <div>
                <label>
                    <input
                        type="radio"
                        name="employmentType"
                        value="Hourly"
                        checked={employmentType === "Hourly"}
                        onChange={() => setEmploymentType("Hourly")}
                    />
                    Hourly
                </label>
                <label style={{ marginLeft: "1rem" }}>
                    <input
                        type="radio"
                        name="employmentType"
                        value="Salary"
                        checked={employmentType === "Salary"}
                        onChange={() => setEmploymentType("Salary")}
                    />
                    Salary
                </label>

                <label>Experience Level:</label>
                <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                    <option value="Junior">Junior</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Senior">Senior</option>
                </select>

            </div>

            <button type="submit">Convert to Potatoes</button>
        </form>
    );
}
