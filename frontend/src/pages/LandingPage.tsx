import { useEffect, useState } from "react";
import PotatoForm from "../components/PotatoForm";
import PotatoTable from "../components/PotatoTable";
import { getAllPotatoes, PotatoItem } from "../services/potatoService.ts";
import { Link } from "react-router-dom";

export default function LandingPage() {
    const [items, setItems] = useState<PotatoItem[]>([]);

    useEffect(() => {
        getAllPotatoes().then(setItems);
    }, []);

    return (
        <>
            <h1>Potato Wage Converter 🥔</h1>
            <PotatoForm onCreate={item => setItems(prev => [...prev, item])} />
            <PotatoTable items={items} />

            <Link to="/invest">See how to invest your potatoes ➡️</Link>
        </>
    );
}

