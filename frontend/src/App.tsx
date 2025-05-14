// src/App.tsx – theme, AppBar, routing
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    GlobalStyles,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
} from '@mui/material';

import WelcomePage from './pages/WelcomePage';
import LandingPage from './pages/LandingPage';
import InvestmentPage from './pages/InvestmentPage';
import PotatoPal from "./components/PotatoPal.tsx";
import SpuddyGame from './pages/SpuddyGame';

// Custom theme
const theme = createTheme({
    palette: {
        primary: { main: '#8d6e63' },      // russet brown
        secondary: { main: '#ffc107' },    // golden potato
        background: { default: '#f5f1e8' },
    },
    typography: {
        fontFamily: '"Roboto", "Nunito", sans-serif',
        h6: { fontWeight: 700 },
    },
});

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* parchment-style radial gradient */}
            <GlobalStyles
                styles={{
                    body: {
                        background:
                            'radial-gradient(circle at top left, #fffde7 0%, #f0ead6 45%, #eadbc8 100%)',
                    },
                }}
            />

            <BrowserRouter>
                {/* Frosted AppBar */}
                <AppBar
                    position="static"
                    elevation={3}
                    sx={{ backdropFilter: 'blur(6px)' }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            The Potato App
                        </Typography>

                        {/* Nav links */}
                        <Button color="inherit" component={RouterLink} to="/">
                            Home
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/start">
                            Explore
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/invest">
                            Invest
                        </Button>
                    </Toolbar>
                </AppBar>

                {/* Main content*/}
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Routes>
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/start" element={<LandingPage />} />
                        <Route path="/invest" element={<InvestmentPage />} />
                        <Route path="/spuddy-adventure" element={<SpuddyGame />} />
                    </Routes>
                </Container>
                <PotatoPal />
            </BrowserRouter>
        </ThemeProvider>
    );
}
