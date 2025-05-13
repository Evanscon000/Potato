import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container, Typography, Alert, Divider, Box,
    Button, Stepper, Step, StepLabel, Grid,
} from '@mui/material';
import PotatoForm from '../components/PotatoForm';
import PotatoTable from '../components/PotatoTable';
import PotatoStats from '../components/PotatoStats';
import { getAllPotatoes, PotatoItem } from '../services/potatoService';

export default function LandingPage() {
    const [items, setItems] = useState<PotatoItem[]>([]);
    const [latest, setLatest] = useState<PotatoItem | null>(null);
    const [expenses, setExpenses] = useState(0);
    const [recMap, setRecMap] = useState<Record<number, number>>({});
    const [step, setStep] = useState(0);

    const POTATO_PRICE = 1.10;
    const steps = ['Enter wage + expenses', 'See savings power', 'Browse purchases', 'Experiment with compounding'];

    useEffect(() => { getAllPotatoes().then(setItems); }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h3" gutterBottom>Potato Wage Converter</Typography>

            <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
            </Stepper>

            <Alert severity="info" sx={{ mb: 3 }}>
                Convert wage → 🥔 to uncover the real cost of life in time.
            </Alert>
            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4} columns={12}>
                <Grid xs={12} md={5}>
                    <PotatoForm
                        onCreate={(it) => { setItems((p) => [...p, it]); setStep(1); }}
                        onRecommendation={(pct, it) => {
                            setRecMap((m) => ({ ...m, [it.id!]: pct }));
                            setLatest(it);
                            setStep(2);
                        }}
                        onExpenseChange={setExpenses}
                    />

                    {latest && recMap[latest.id!] !== undefined && (
                        <PotatoStats
                            item={latest}
                            potatoPrice={POTATO_PRICE}
                            recommendedPercent={recMap[latest.id!]}
                            monthlyExpenses={expenses}
                        />
                    )}
                </Grid>

                <Grid xs={12} md={7}>
                    <PotatoTable
                        items={items}
                        onSave={(u) => setItems((p) => p.map((t) => (t.id === u.id ? u : t)))}
                        onDelete={(id) => setItems((p) => p.filter((t) => t.id !== id))}
                        monthlyExpenses={expenses}
                        recommendedMap={recMap}
                    />
                </Grid>
            </Grid>

            <Box textAlign="center" sx={{ mt: 6 }}>
                <Button component={Link} to="/invest" variant="outlined" size="large">
                    See the power of compounding
                </Button>
            </Box>
        </Container>
    );
}