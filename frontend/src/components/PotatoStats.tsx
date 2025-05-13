import { Typography, Paper, Stack } from '@mui/material';
import { PotatoItem } from '../services/potatoService';
import FinanceCoach from './FinanceCoach';

interface Props {
    item: PotatoItem;
    potatoPrice: number;
    recommendedPercent: number; // 0–1
    monthlyExpenses: number;    // USD
}

export default function PotatoStats({
    item,
    potatoPrice,
    recommendedPercent,
    monthlyExpenses,
        }: Props) {
            const potatoesPerHour   = item.hourlyPay / potatoPrice;
            const monthlyIncome     = item.hourlyPay * item.hoursPerWeek * 4.33;
            const monthlyExpendable = Math.max(0, monthlyIncome - monthlyExpenses);
            const annualExpendable  = monthlyExpendable * 12;
            const savingsRate       = monthlyIncome ? monthlyExpendable / monthlyIncome : 0;

    return (
        <Paper sx={{ p: 3, mt: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>Your Potato Stats</Typography>

            <Stack spacing={1}>
                <Typography>
                    <strong>Potatoes earned per hour:</strong> {potatoesPerHour.toFixed(1)} 🥔
                </Typography>
                <Typography>
                    <strong>Monthly income:</strong>{' '}
                    ${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
                <Typography>
                    <strong>Monthly living expenses:</strong>{' '}
                    ${monthlyExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
                <Typography>
                    <strong>Expendable income&nbsp;(monthly):</strong>{' '}
                    ${monthlyExpendable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
                <Typography>
                    <strong>Savings rate:</strong>{' '}
                    {(savingsRate * 100).toFixed(0)}% (rec&nbsp;
                    {(recommendedPercent * 100).toFixed(0)}%)
                </Typography>
                <Typography>
                    <strong>Potential annual investment:</strong>{' '}
                    ${annualExpendable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
            </Stack>

            {/* Dynamic coaching tips */}
            <FinanceCoach
                savingsRate={savingsRate}
                recommended={recommendedPercent}
                monthlyExpendable={monthlyExpendable}
            />
        </Paper>
    );
}
