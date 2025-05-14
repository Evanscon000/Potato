// src/pages/SpuddyGame.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const STEP = 20;
const COIN_COUNT = 8;
const COLLIDE_DIST = 30;
const COIN_EMOJI = '💰';
const SPUDDY_EMOJI = '🥔';
const GAME_SIZE = 600;

export default function SpuddyGame() {
    const navigate = useNavigate();
    const [spuddy, setSpuddy] = useState({ x: 50, y: 50 });
    const [coins, setCoins] = useState<{ id: number; x: number; y: number }[]>([]);
    const [score, setScore] = useState(0);

    // Spawn coins once
    useEffect(() => {
        const arr = Array.from({ length: COIN_COUNT }).map((_, i) => ({
            id: i,
            x: Math.random() * (GAME_SIZE - 40),
            y: Math.random() * (GAME_SIZE - 40),
        }));
        setCoins(arr);
    }, []);

    // Handle arrow keys, movement & collisions
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            // prevent arrow keys from scrolling the page
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            setSpuddy(prev => {
                let { x, y } = prev;
                if (e.key === 'ArrowUp')    y = Math.max(0, y - STEP);
                if (e.key === 'ArrowDown')  y = Math.min(GAME_SIZE - STEP, y + STEP);
                if (e.key === 'ArrowLeft')  x = Math.max(0, x - STEP);
                if (e.key === 'ArrowRight') x = Math.min(GAME_SIZE - STEP, x + STEP);
                const newPos = { x, y };

                // collision detection
                setCoins(curr => {
                    let removed = 0;
                    const remaining = curr.filter(c => {
                        const dx = c.x - x, dy = c.y - y;
                        if (Math.hypot(dx, dy) < COLLIDE_DIST) {
                            removed++;
                            return false;
                        }
                        return true;
                    });
                    if (removed) {
                        setScore(s => s + removed);
                        confetti({
                            particleCount: 20,
                            spread: 50,
                            origin: { x: (x + 20) / GAME_SIZE, y: (y + 20) / GAME_SIZE },
                        });
                    }
                    return remaining;
                });

                return newPos;
            });
        };

        window.addEventListener('keydown', handleKey, { passive: false });
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        /* Center the game box but allow the page itself to scroll normally */
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: '#f5f1e8',
                p: 2,              // add some padding so box isn’t flush to window edge
            }}
        >
            {/* The 600×600 game area */}
            <Box
                sx={{
                    position: 'relative',
                    width: GAME_SIZE,
                    height: GAME_SIZE,
                    bgcolor: '#fffde7',
                    border: '4px solid #d7ccc8',
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: 'hidden',
                }}
            >
                {/* Exit */}
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/start')}
                    sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}
                >
                    Exit
                </Button>

                {/* Score */}
                <Typography
                    variant="subtitle1"
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
                >
                    Score: {score}
                </Typography>

                {/* Victory */}
                {coins.length === 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            🎉 You win! 🎉
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onClick={() => window.location.reload()}
                        >
                            Play Again
                        </Button>

                        {/* Prize prompt */}
                        <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                            Scan to collect your prize!
                        </Typography>
                        <Box sx={{ display: 'inline-block' }}>
                            <img
                                src="/Rickrolling_QR_code.png"
                                alt="Prize QR"
                                width={100}
                                height={100}
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                    window.open('https://youtu.be/dQw4w9WgXcQ', '_blank')
                                }
                            />
                        </Box>
                    </motion.div>
                )}

                {/* Coins */}
                <AnimatePresence>
                    {coins.map(c => (
                        <motion.span
                            key={c.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                position: 'absolute',
                                left: c.x,
                                top: c.y,
                                fontSize: 28,
                                userSelect: 'none',
                                zIndex: 1,
                            }}
                        >
                            {COIN_EMOJI}
                        </motion.span>
                    ))}
                </AnimatePresence>

                {/* Spuddy */}
                <motion.div
                    animate={{ x: spuddy.x, y: spuddy.y }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                        position: 'absolute',
                        fontSize: 36,
                        userSelect: 'none',
                        zIndex: 1,
                    }}
                >
                    {SPUDDY_EMOJI}
                </motion.div>
            </Box>
        </Box>
    );
}
