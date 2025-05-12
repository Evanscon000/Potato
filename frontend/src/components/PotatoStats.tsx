// src/components/PotatoStats.tsx
import { Paper, Stack, Typography, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { PotatoItem } from '../services/potatoService';

type Props = {
    item: PotatoItem;
    potatoPrice: number;
    recommendedPercent: number;
};

// rough targets
const BIG_PURCHASES = [
    { label: 'Starter car',   costUSD: 15000 },
    { label: 'Down-payment', costUSD: 60000 },
    { label: 'Average home', costUSD: 300000 },
];

export default function PotatoStats({ item, potatoPrice, recommendedPercent }: Props) {
    const potatoesPerHr   = item.hourlyPay / potatoPrice;
    const potatoesPerYear = potatoesPerHr * item.hoursPerWeek * 52;
    const investPotatoes  = potatoesPerYear * recommendedPercent;

    // helper
    function hoursToWords(hours: number) {
        const days   = hours / 24;
        const years  = days / 365;
        if (years > 1)   return `${years.toFixed(1)} years`;
        if (days  > 1)   return `${days.toFixed(0)} days`;
        return `${hours.toFixed(0)} h`;
    }

    return (
        <Paper sx={{ p: 3, mt: 2 }} elevation={2}>
            <Stack spacing={1}>
                <Typography variant="h6">
                    Your Potato Breakdown
                </Typography>

                <Typography>
                    Potatoes earned <strong>per hour:</strong> {potatoesPerHr.toFixed(1)}
                </Typography>
                <Typography>
                    Potatoes you could invest yearly at <strong>{(recommendedPercent*100).toFixed(0)} %</strong>:
                    {' '}
                    <strong>{investPotatoes.toLocaleString()}</strong>
                </Typography>

                <Table size="small" sx={{ mt: 1 }}>
                    <TableBody>
                        {BIG_PURCHASES.map(({ label, costUSD }) => {
                            const potatoesNeeded = costUSD / potatoPrice;
                            const hrsNeeded      = potatoesNeeded / potatoesPerHr;

                            return (
                                <TableRow key={label}>
                                    <TableCell>{label}</TableCell>
                                    <TableCell align="right">
                                        {potatoesNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })} 🥔
                                    </TableCell>
                                    <TableCell align="right">
                                        ≈ {hoursToWords(hrsNeeded)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Stack>
        </Paper>
    );
}
