// src/components/PotatoStats.tsx – modern card with progress bar
import { Card, CardContent, Typography, Stack, LinearProgress, Box } from '@mui/material';
import { PotatoItem } from '../services/potatoService';
import FinanceCoach from './FinanceCoach';

interface Props {
    item: PotatoItem;
    potatoPrice: number;
    recommendedPercent: number; // 0–1
    monthlyExpenses: number;    // USD
}

export default function PotatoStats({ item, potatoPrice, recommendedPercent, monthlyExpenses }: Props) {
    const potatoesPerHour   = item.hourlyPay / potatoPrice;
    const monthlyIncome     = item.hourlyPay * item.hoursPerWeek * 4.33;
    const monthlyExpendable = Math.max(0, monthlyIncome - monthlyExpenses);
    const annualExpendable  = monthlyExpendable * 12;
    const savingsRate       = monthlyIncome ? monthlyExpendable / monthlyIncome : 0; // 0-1

    return (
        <Card elevation={4} sx={{ mt: 3, }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Your Potato Stats
                </Typography>

                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Potatoes earned per hour:</strong> {potatoesPerHour.toFixed(1)} 🥔
                    </Typography>
                    <Typography variant="body2">
                        <strong>Monthly income:</strong> ${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Monthly expenses:</strong> ${monthlyExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Expendable income (monthly):</strong> ${monthlyExpendable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                </Stack>

                {/* Progress bar visualising savings rate vs recommended */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Savings rate vs recommendation ({(recommendedPercent*100).toFixed(0)}%)
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(savingsRate * 100, 100)}
                        sx={{ height: 10, borderRadius: 5, backgroundColor: 'grey.300',
                            '& .MuiLinearProgress-bar': { backgroundColor: savingsRate >= recommendedPercent ? 'success.main' : 'warning.main' } }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Current: {(savingsRate * 100).toFixed(0)}%
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Potential annual investment:</strong> ${annualExpendable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>

                {/* Coaching component */}
                <FinanceCoach
                    savingsRate={savingsRate}
                    recommended={recommendedPercent}
                    monthlyExpendable={monthlyExpendable}
                />
            </CardContent>
        </Card>
    );
}