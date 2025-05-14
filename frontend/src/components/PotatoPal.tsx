// src/components/PotatoPal.tsx
import React, { useState } from 'react';
import {
    Box,
    Tooltip,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

export default function PotatoPal() {
    const tips = [
        'Potatoes were the first vegetable grown in space.',
        'Paying yourself first — even $50/month — builds powerful savings habits.',
        'The world’s largest potato ever weighed over 11 pounds!',
        'The earlier you invest, the more time compounding has to work its magic.',
        'There are over 4,000 varieties of potatoes worldwide.',
        'Avoid lifestyle inflation. Just because you earn more doesn’t mean you should spend more.',
        'Mr. Potato Head was the first toy advertised on TV (1952).',
        'Index funds are low-fee, diversified ways to grow wealth over time.',
        'In Peru, people once used potatoes as currency.',
        'Emergency funds = peace of mind. 3–6 months of expenses saved can change everything.',
        'You can live off potatoes and milk (not recommended, but possible).',
        'Credit card debt grows faster than potatoes — pay it off ASAP.',
        'NASA grew space potatoes in 1995.',
        'Start investing early, even small amounts — the time you give your money matters most.',
        'Thomas Jefferson served “French fried potatoes” at the White House in 1802.',
        'Money goals are like planting seeds — water them regularly with good habits.',
        'Potatoes contain more potassium than bananas.',
        'Budgeting isn’t restriction — it’s permission to spend with purpose.',
        'The average American eats ~120 lbs of potatoes per year!',
        'You don’t need to be rich to build wealth. You need time + consistency.',
    ];

    // State & animation controls
    const [showTip, setShowTip] = useState(false);
    const [tip, setTip] = useState(tips[0]);
    const controls = useAnimation();
    const navigate = useNavigate();

    // Easter-egg click tracking
    const [clickCount, setClickCount] = useState(0);
    const [openPrompt, setOpenPrompt] = useState(false);

    // Time-of-day mood
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    // Click handler
    const handleClick = () => {
        // pick a random tip
        const next = tips[Math.floor(Math.random() * tips.length)];
        setTip(next);

        // show the tip bubble
        setShowTip(true);
        setTimeout(() => setShowTip(false), 6000);

        // bounce & rotate animation
        controls.start({
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
            transition: { duration: 0.5 },
        });

        // confetti blast
        confetti({ particleCount: 30, spread: 70, origin: { x: 0.9, y: 0.7 } });

        // Easter-egg click count
        setClickCount((c) => {
            const nextCount = c + 1;
            if (nextCount >= 25) {
                setOpenPrompt(true);
                return 0; // reset
            }
            return nextCount;
        });
    };

    // Dialog handlers
    const handlePlay = () => {
        setOpenPrompt(false);
        navigate('/spuddy-adventure');
    };
    const handleClose = () => setOpenPrompt(false);

    return (
        <Box>
            {/* Draggable, animated potato dude (Spuddy) */}
            <Tooltip title="Click me for a tip!" placement="left">
                <motion.div
                    onClick={handleClick}
                    drag
                    dragMomentum={false}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9, cursor: 'grabbing' }}
                    animate={controls}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 1300,
                        cursor: 'grab',
                        filter: isNight ? 'brightness(0.7)' : 'none',
                    }}
                >
                    <svg width="80" height="80" viewBox="0 0 100 100">
                        <defs>
                            <radialGradient id="potatoGrad" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#fff1c9" />
                                <stop offset="100%" stopColor="#c59d5f" />
                            </radialGradient>
                        </defs>
                        <ellipse
                            cx="50"
                            cy="50"
                            rx="40"
                            ry="50"
                            fill="url(#potatoGrad)"
                        />
                        <circle cx="35" cy="45" r="5" fill="#000" />
                        <circle cx="65" cy="45" r="5" fill="#000" />
                        <path
                            d="M35 65 Q50 75 65 65"
                            stroke="#000"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </motion.div>
            </Tooltip>

            {/* The animated tip bubble*/}
            <AnimatePresence>
                {showTip && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            bottom: 110,
                            right: 16,
                            zIndex: 1300,
                        }}
                    >
                        <Paper
                            elevation={4}
                            sx={{
                                p: 1.5,
                                maxWidth: 260,
                                background:
                                    'linear-gradient(135deg, #fffde7 0%, #f0ead6 100%)',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body2">{tip}</Typography>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Easter-egg Prompt Dialog */}
            <Dialog open={openPrompt} onClose={handleClose}>
                <DialogTitle>Secret Unlocked!</DialogTitle>
                <DialogContent>
                    <Typography>
                        You’ve clicked Spuddy 25 times! Want to play the mini-game?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Not Now</Button>
                    <Button variant="contained" onClick={handlePlay}>
                        Let’s Play!
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
