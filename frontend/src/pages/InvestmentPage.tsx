// export default function InvestmentPage() {
//     return <h2>Coming soon: compounding‑interest calculator</h2>;
// }


// src/pages/InvestmentPage.tsx
import { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Stack, TextField,
    Select, MenuItem, Button, Grid
} from '@mui/material';

import { getAllPotatoes, PotatoItem } from '../services/potatoService';

export default function InvestmentPage() {
    // pick existing entry or "Custom"
    const [saved, setSaved]   = useState<PotatoItem[]>([]);
    const [choice, setChoice] = useState<'custom'|number>('custom');

    // calculator state
    const [initial, setInitial] = useState(1000);   // USD
    const [yearlyPct,setPct]    = useState(0.07);   // 7 %
    const [years,   setYears]   = useState(30);
    const [future,  setFuture]  = useState<number|null>(null);

    // load saved rows once
    useEffect(() => { getAllPotatoes().then(setSaved); }, []);

    // when user selects an existing entry → pre-fill principal
    useEffect(() => {
        if (choice === 'custom') return;
        const row = saved.find(r => r.id === choice);
        if (row) setInitial(row.hourlyPay * row.hoursPerWeek * 52); // 1 yr income
    }, [choice, saved]);

    // compound-interest
    function calcFV() {
        // annual compounding = A = P*(1+r)^n
        const fv = initial * Math.pow(1 + yearlyPct, years);
        setFuture(fv);
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Compounding Interest Simulator
            </Typography>

            {/* input panel */}
            <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                <Grid container spacing={2}>
                    {/* choose row */}
                    <Grid item xs={12}>
                        <Select
                            size="small"
                            fullWidth
                            value={choice}
                            onChange={e => setChoice(e.target.value as any)}
                        >
                            <MenuItem value="custom">⬤  Custom inputs</MenuItem>
                            {saved.map(r => (
                                <MenuItem key={r.id} value={r.id!}>
                                    Use {r.name} ({r.employmentType} ${r.hourlyPay}/hr)
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* principal */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Initial Amount ($)"
                            type="number"
                            fullWidth
                            value={initial}
                            onChange={e => setInitial(+e.target.value)}
                        />
                    </Grid>

                    {/* rate */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Annual % Return"
                            type="number"
                            fullWidth
                            value={yearlyPct*100}
                            onChange={e => setPct(+e.target.value/100)}
                        />
                    </Grid>

                    {/* years */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Years"
                            type="number"
                            fullWidth
                            value={years}
                            onChange={e => setYears(+e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" onClick={calcFV}>
                            Calculate
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* result */}
            {future !== null && (
                <Paper sx={{ p: 3 }} elevation={2}>
                    <Typography variant="h6">
                        Future value after {years} years:
                    </Typography>
                    <Typography variant="h4">
                        ${future.toLocaleString(undefined,{maximumFractionDigits:0})}
                    </Typography>
                </Paper>
            )}
        </Container>
    );
}
