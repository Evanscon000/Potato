// src/pages/WelcomePage.tsx
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function WelcomePage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(/WelcomeToThePotatoAppPage.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            backdropFilter: 'blur(8px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            borderRadius: 4,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Welcome to The Potato Investment App
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Plant your earnings. Water your habits. Grow into financial freedom. <br />
                            This is more than a tool — it's the key to your freedom.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            component={RouterLink}
                            to="/start"
                        >
                            Start Your Journey
                        </Button>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}
