// src/components/PotatoPal.tsx – friendly interactive mascot with fun + finance tips
import { useState } from 'react';
import { Box, Tooltip, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

export default function PotatoPal() {
    const tips = [
        //
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

    const [showTip, setShowTip] = useState(false);
    const [tip, setTip] = useState(tips[0]);

    const handleClick = () => {
        const next = tips[Math.floor(Math.random() * tips.length)];
        setTip(next);
        setShowTip(true);
        setTimeout(() => setShowTip(false), 6000);
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}>
            <Tooltip title="Click me for a tip!" placement="left">
                <motion.div
                    onClick={handleClick}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.6 }}
                    style={{ cursor: 'pointer' }}
                >
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                        <ellipse cx="50" cy="50" rx="40" ry="50" fill="#c59d5f" />
                        <circle cx="35" cy="45" r="5" fill="#000" />
                        <circle cx="65" cy="45" r="5" fill="#000" />
                        <path d="M35 65 Q50 75 65 65" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                </motion.div>
            </Tooltip>

            <AnimatePresence>
                {showTip && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Paper sx={{ p: 1.5, mt: 1, maxWidth: 260 }} elevation={3}>
                            <Typography variant="body2">{tip}</Typography>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}
