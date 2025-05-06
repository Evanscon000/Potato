import { PotatoItem } from "../services/potatoService";

export default function PotatoTable({ items }: { items: PotatoItem[] }) {
    if (!items.length) return <p>No potato stats yet…</p>;

    return (
        <table>
            <thead>
            <tr>
                <th>Name</th><th>Hourly $</th><th>#Potatoes/hr</th>
            </tr>
            </thead>
            <tbody>
            {items.map(p => (
                <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.hourlyPay.toFixed(2)}</td>
                    <td>{(p.hourlyPay / p.potatoPriceAtConversion).toFixed(1)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
