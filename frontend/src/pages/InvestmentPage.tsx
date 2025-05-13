// src/pages/InvestmentPage.tsx
import { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Grid, TextField,
    Select, MenuItem, Button, Box, Alert, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAllPotatoes, PotatoItem } from '../services/potatoService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// helper
const fvWithAdds = (P: number, C: number, r: number, n: number) =>
    r === 0 ? P + C * n : P * Math.pow(1 + r, n) + C * ((Math.pow(1 + r, n) - 1) / r);

export default function InvestmentPage() {
    // saved wages
    const [profiles, setProfiles] = useState<PotatoItem[]>([]);
    const [choice, setChoice] = useState<'custom' | number>('custom');

    // inputs
    const [principal, setPrincipal] = useState(5000);
    const [annualAdd, setAnnualAdd] = useState(3000);
    const [ratePct, setRatePct]     = useState(7);
    const [years, setYears]         = useState(30);

    // outputs
    const [future, setFuture] = useState<number | null>(null);
    const [series, setSeries] = useState<{ year: number; value: number }[]>([]);

    const monthlyExpenses = Number(localStorage.getItem('monthlyExpenses')) || 0;
    useEffect(() => { getAllPotatoes().then(setProfiles); }, []);

    useEffect(() => {
        if (choice === 'custom') return;
        const row = profiles.find(r => r.id === choice);
        if (!row) return;
        const annualInc  = row.hourlyPay * row.hoursPerWeek * 52;
        const expendable = Math.max(0, annualInc - monthlyExpenses * 12);
        setPrincipal(Math.round(expendable * 0.25));
        setAnnualAdd(Math.round(expendable));
    }, [choice, profiles, monthlyExpenses]);

    const calculate = () => {
        const r = ratePct / 100;
        const pts = Array.from({ length: years + 1 }, (_, i) => ({
            year: i,
            value: fvWithAdds(principal, annualAdd, r, i),
        }));
        setSeries(pts);
        setFuture(pts.at(-1)!.value);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Compounding Interest Simulator
            </Typography>

            {/* quick primer */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Money you invest can earn returns, and those returns earn their own
                returns — a snowball effect called <strong>compounding</strong>.
                Explore how different amounts and time horizons change the outcome.
            </Alert>

            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                <Grid container columns={12} spacing={2}>
                    <Grid xs={12}>
                        <Select fullWidth size="small" value={choice} onChange={(e) => setChoice(e.target.value as any)}>
                            <MenuItem value="custom">⬤  Custom inputs</MenuItem>
                            {profiles.map((p) => (
                                <MenuItem key={p.id} value={p.id!}>
                                    Use {p.name} – {p.employmentType} ${p.hourlyPay}/hr
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid xs={12} md={6}>
                        <TextField label="Principal ($)" type="number" fullWidth
                                   value={principal} onChange={(e) => setPrincipal(+e.target.value)} />
                    </Grid>

                    <Grid xs={12} md={6}>
                        <TextField label="Annual Contribution ($)" type="number" fullWidth
                                   value={annualAdd} onChange={(e) => setAnnualAdd(+e.target.value)} />
                    </Grid>

                    <Grid xs={12} md={6}>
                        <TextField label="Annual % Return" type="number" fullWidth
                                   value={ratePct} onChange={(e) => setRatePct(+e.target.value)} />
                    </Grid>

                    <Grid xs={12} md={6}>
                        <TextField label="Years" type="number" fullWidth
                                   value={years} onChange={(e) => setYears(+e.target.value)} />
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

                    <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
                        <Typography variant="subtitle1" gutterBottom>
                            Growth over time
                        </Typography>
                        <Box sx={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={series}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        formatter={(v: number) =>
                                            `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                        }
                                        labelFormatter={(l) => `Year ${l}`}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>

                    {/* beginner FAQ */}
                    <Accordion elevation={2}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>What do these numbers mean?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph>
                                • <strong>Principal</strong> is the starting amount you invest.<br/>
                                • <strong>Annual contribution</strong> is how much you add each year.<br/>
                                • <strong>Annual % return</strong> is your average growth rate (historically ~7% after inflation for diversified index funds).<br/>
                                • Over time, returns are reinvested — causing the curve to bend upward.
                            </Typography>
                            <Typography variant="body2">
                                Notice how the curve gets steeper near the end? That’s compounding:
                                returns on returns. The earlier you start, the more time your money
                                has to snowball.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </>
            )}
        </Container>
    );
}
