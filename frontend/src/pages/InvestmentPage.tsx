import { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Grid, TextField,
    Select, MenuItem, Button, Box,
} from '@mui/material';
import { getAllPotatoes, PotatoItem } from '../services/potatoService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// helper: future value with annual additions (annual compounding)
const fvWithAdds = (P: number, C: number, r: number, n: number) => {
    if (r === 0) return P + C * n;
    return P * Math.pow(1 + r, n) + C * ((Math.pow(1 + r, n) - 1) / r);
};

export default function InvestmentPage() {
    // saved wages
    const [profiles, setProfiles] = useState<PotatoItem[]>([]);
    const [choice, setChoice] = useState<'custom' | number>('custom');

    // inputs
    const [principal, setPrincipal]   = useState(5000);
    const [annualAdd, setAnnualAdd]   = useState(3000);
    const [ratePct,   setRatePct]     = useState(7);
    const [years,     setYears]       = useState(30);

    // outputs
    const [future, setFuture] = useState<number | null>(null);
    const [series, setSeries] = useState<{ year: number; value: number }[]>([]);

    const monthlyExpenses = Number(localStorage.getItem('monthlyExpenses')) || 0;

    useEffect(() => { getAllPotatoes().then(setProfiles); }, []);

    // when profile selected, pre-fill based on expendable income
    useEffect(() => {
        if (choice === 'custom') return;
        const row = profiles.find(r => r.id === choice);
        if (!row) return;
        const annualIncome     = row.hourlyPay * row.hoursPerWeek * 52;
        const annualExpendable = Math.max(0, annualIncome - monthlyExpenses * 12);

        setPrincipal(Number((annualExpendable * 0.25).toFixed(0)));
        setAnnualAdd(Number(annualExpendable.toFixed(0)));
    }, [choice, profiles, monthlyExpenses]);

    const calculate = () => {
        const r = ratePct / 100;
        const points: { year: number; value: number }[] = [];
        for (let i = 0; i <= years; i++) {
            points.push({ year: i, value: fvWithAdds(principal, annualAdd, r, i) });
        }
        setSeries(points);
        setFuture(points.at(-1)!.value);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Compounding Interest Simulator
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                {/* Grid v2: container has columns; children specify xs / md directly */}
                <Grid container columns={12} spacing={2}>
                    <Grid xs={12}>
                        <Select
                            fullWidth
                            size="small"
                            value={choice}
                            onChange={(e) => setChoice(e.target.value as any)}
                        >
                            <MenuItem value="custom">⬤  Custom inputs</MenuItem>
                            {profiles.map((p) => (
                                <MenuItem key={p.id} value={p.id!}>
                                    Use {p.name} – {p.employmentType} ${p.hourlyPay}/hr
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid xs={12} md={6}>
                        <TextField
                            label="Principal ($)"
                            type="number"
                            fullWidth
                            value={principal}
                            onChange={(e) => setPrincipal(+e.target.value)}
                        />
                    </Grid>

                    <Grid xs={12} md={6}>
                        <TextField
                            label="Annual Contribution ($)"
                            type="number"
                            fullWidth
                            value={annualAdd}
                            onChange={(e) => setAnnualAdd(+e.target.value)}
                        />
                    </Grid>

                    <Grid xs={12} md={6}>
                        <TextField
                            label="Annual % Return"
                            type="number"
                            fullWidth
                            value={ratePct}
                            onChange={(e) => setRatePct(+e.target.value)}
                        />
                    </Grid>

                    <Grid xs={12} md={6}>
                        <TextField
                            label="Years"
                            type="number"
                            fullWidth
                            value={years}
                            onChange={(e) => setYears(+e.target.value)}
                        />
                    </Grid>

                    <Grid xs={12}>
                        <Button variant="contained" onClick={calculate}>
                            Calculate
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {future !== null && (
                <>
                    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
                        <Typography variant="h6">
                            Future value after {years} years:
                        </Typography>
                        <Typography variant="h4">
                            ${future.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 2 }} elevation={2}>
                        <Typography variant="subtitle1" gutterBottom>
                            Growth over time
                        </Typography>
                        <Box sx={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={series} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" tickFormatter={(y) => `${y}`} />
                                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        formatter={(v: number) =>
                                            `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                        }
                                        labelFormatter={(l) => `Year ${l}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#1976d2"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </>
            )}
        </Container>
    );
}
