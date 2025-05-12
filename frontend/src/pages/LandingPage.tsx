// src/pages/LandingPage.tsx
import { useEffect, useState }   from 'react';
import { Link }                  from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Alert,
    Divider,
    Box,
    Button,
} from '@mui/material';

import PotatoForm   from '../components/PotatoForm';
import PotatoTable  from '../components/PotatoTable';
import PotatoStats  from '../components/PotatoStats';

import { getAllPotatoes, PotatoItem } from '../services/potatoService';

export default function LandingPage() {
    const [items,  setItems]  = useState<PotatoItem[]>([]);
    const [latest, setLatest] = useState<PotatoItem | null>(null);
    const [rec,    setRec]    = useState<number | null>(null);

    // average russet price (May 2025)
    const POTATO_PRICE = 1.10;

    // initial fetch
    useEffect(() => { getAllPotatoes().then(setItems); }, []);

    return (

        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h3" gutterBottom>
                Potato Wage Converter
            </Typography>

            <Alert severity="info" sx={{ mb:3 }}>Every dollar you earn is time spent. Converting your wages into potatoes helps you see the true cost of your dreams in hours, not just money. Live with intention.</Alert>

            <Divider sx={{ mb: 4 }} />

            {/* grid layout */}
            <Grid container spacing={4}>
                {/* left column (form + stats) */}
                <Grid item xs={12} md={5} {...({} as any)}>
                    <PotatoForm
                        onCreate={item => setItems(p => [...p, item])}
                        onRecommendation={(percent, item) => {
                            setRec(percent);
                            setLatest(item);
                        }}
                    />

                    {latest && rec !== null && (
                        <PotatoStats
                            item={latest}
                            potatoPrice={POTATO_PRICE}
                            recommendedPercent={rec}
                        />
                    )}
                </Grid>

                {/* right column (table) */}
                <Grid item xs={12} md={7} {...({} as any)}>
                    <PotatoTable
                        items={items}
                        onSave={u => setItems(p => p.map(t => t.id === u.id ? u : t))}
                        onDelete={id => setItems(p => p.filter(t => t.id !== id))}
                    />
                </Grid>
            </Grid>

            {/* navigation footer */}
            <Box textAlign="center" sx={{ mt: 6 }}>
                <Button
                    component={Link}
                    to="/invest"
                    variant="outlined"
                    size="large"
                >
                    See the power of compounding
                </Button>
            </Box>
        </Container>
    );
}
