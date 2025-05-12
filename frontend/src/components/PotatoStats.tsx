import { Typography, Paper, Stack } from '@mui/material';
import { PotatoItem } from '../services/potatoService';

interface Props {
    item: PotatoItem;
    potatoPrice: number;
    recommendedPercent: number;
    monthlyExpenses: number;
}

export default function PotatoStats({ item, potatoPrice, recommendedPercent, monthlyExpenses }: Props) {
    // basic conversions
    const potatoesPerHour = item.hourlyPay / potatoPrice;
    const monthlyIncome = item.hourlyPay * item.hoursPerWeek * 4.33; // avg weeks / month
    const annualIncome = monthlyIncome * 12;

    const monthlyExpendable = Math.max(0, monthlyIncome - monthlyExpenses);
    const annualExpendable = monthlyExpendable * 12;
    const actualSavingsRate = monthlyIncome ? monthlyExpendable / monthlyIncome : 0; // 0‑1

    return (
        <Paper sx={{ p: 3, mt: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
                Your Potato Stats
            </Typography>

            <Stack spacing={1}>
                <Typography>
                    <strong>Potatoes earned per hour:</strong> {potatoesPerHour.toFixed(1)} 🥔
                </Typography>
                <Typography>
                    <strong>Monthly income:</strong> ${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
                <Typography>
                    <strong>Monthly living expenses:</strong> ${monthlyExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
                <Typography>
                    <strong>Expendable income (monthly):</strong> ${monthlyExpendable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
                <Typography>
                    <strong>Available savings rate:</strong> {(actualSavingsRate * 100).toFixed(0)}%
                    {' '}({(recommendedPercent * 100).toFixed(0)}% recommended)
                </Typography>
                <Typography>
                    <strong>Potential annual investment:</strong> ${annualExpendable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
            </Stack>
        </Paper>
    );
}