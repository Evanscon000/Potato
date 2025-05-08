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
            <h1>Potato App</h1>
            <PotatoForm onCreate={item => setItems(prev => [...prev, item])} />
            <PotatoTable
                items={items}
                onSave={(u) => setItems((prev) => prev.map(p => p.id === u.id ? u : p))}
                onDelete={(id) => setItems((prev) => prev.filter(p => p.id !== id))}
            />


            <Link to="/invest">Click here to learn how anyone can buy their time back </Link>
        </>
    );
}

