import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InvestmentPage from './pages/InvestmentPage';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function App() {
    return (
        <BrowserRouter>
            <AppBar position="static" color="primary" enableColorOnDark>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Potato Planner
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/invest">
                        Invest
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/invest" element={<InvestmentPage />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
}
