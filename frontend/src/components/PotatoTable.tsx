import { useState } from 'react';
import {
    PotatoItem,
    updatePotatoItem,
    deletePotatoItem,
} from '../services/potatoService';
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, TextField, Select, MenuItem, RadioGroup, FormControlLabel, Radio,
    Stack, Paper, Collapse, Typography,
} from '@mui/material';
import { Edit, Delete, Save, Close, ExpandMore, ExpandLess } from '@mui/icons-material';
import { costItems } from '../constants/costItems'; // <-- adjust if exporting default

type TableProps = {
    items: PotatoItem[];
    onSave: (updated: PotatoItem) => void;
    onDelete: (id: number) => void;
    monthlyExpenses: number;
    recommendedMap: Record<number, number>;
};

const POTATO_PRICE_FALLBACK = 1.10;

export default function PotatoTable({ items, onSave, onDelete, monthlyExpenses, recommendedMap }: TableProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draft, setDraft] = useState<PotatoItem | null>(null);
    const [openStats, setOpenStats] = useState<Record<number, boolean>>({});

    if (!items.length) return <Paper sx={{ p: 3 }}>No data yet.</Paper>;

    const potatoesPerHour = (p: PotatoItem) => p.hourlyPay / (p.potatoPriceAtConversion || POTATO_PRICE_FALLBACK);
    const hrsToYears = (hrs: number, hpw: number) => (hrs / hpw / 52).toFixed(1);
    const buildStats = (p: PotatoItem) => {
        const monthlyIncome = p.hourlyPay * p.hoursPerWeek * 4.33;
        const monthlyExpendable = Math.max(0, monthlyIncome - monthlyExpenses);
        const savingsRate = monthlyIncome ? monthlyExpendable / monthlyIncome : 0;
        return { monthlyIncome, monthlyExpendable, savingsRate };
    };

    return (
        <Table component={Paper} elevation={3}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">$ / hr</TableCell>
                    <TableCell align="right">🥔 / hr</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Exp.</TableCell>
                    <TableCell width={180} />
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map(p => (
                    editingId === p.id ? (
                        // EDIT ROW
                        <TableRow key={p.id}>
                            <TableCell><TextField size="small" value={draft!.name} onChange={e => setDraft({ ...draft!, name: e.target.value })} /></TableCell>
                            <TableCell align="right"><TextField size="small" type="number" value={draft!.hourlyPay} onChange={e => setDraft({ ...draft!, hourlyPay: +e.target.value })} /></TableCell>
                            <TableCell align="right">{potatoesPerHour(draft!).toFixed(1)}</TableCell>
                            <TableCell>
                                <RadioGroup row value={draft!.employmentType} onChange={e => setDraft({ ...draft!, employmentType: e.target.value as any })}>
                                    <FormControlLabel value="Hourly" control={<Radio size="small" />} label="H" />
                                    <FormControlLabel value="Salary" control={<Radio size="small" />} label="S" />
                                </RadioGroup>
                            </TableCell>
                            <TableCell>
                                <Select size="small" value={draft!.experienceLevel} onChange={e => setDraft({ ...draft!, experienceLevel: e.target.value as any })}>
                                    <MenuItem value="Junior">Junior</MenuItem>
                                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                                    <MenuItem value="Senior">Senior</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Stack direction="row">
                                    <IconButton color="primary" onClick={async () => { const saved = await updatePotatoItem(p.id!, draft!); onSave(saved); setEditingId(null); }}><Save /></IconButton>
                                    <IconButton onClick={() => setEditingId(null)}><Close /></IconButton>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ) : (
                        // READ ROW
                        <>
                            <TableRow key={p.id}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell align="right">{p.hourlyPay.toFixed(2)}</TableCell>
                                <TableCell align="right">{potatoesPerHour(p).toFixed(1)}</TableCell>
                                <TableCell>{p.employmentType}</TableCell>
                                <TableCell>{p.experienceLevel}</TableCell>
                                <TableCell>
                                    <Stack direction="row">
                                        <IconButton color="primary" onClick={() => { setEditingId(p.id!); setDraft({ ...p }); }}><Edit /></IconButton>
                                        <IconButton color="error"   onClick={async () => { await deletePotatoItem(p.id!); onDelete(p.id!); }}><Delete /></IconButton>
                                        <IconButton onClick={() => setOpenStats(o => ({ ...o, [p.id!]: !o[p.id!] }))}>{openStats[p.id!] ? <ExpandLess /> : <ExpandMore />}</IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            {/* details */}
                            <TableRow key={`${p.id}-details`}>
                                <TableCell colSpan={6} sx={{ p: 0 }}>
                                    <Collapse in={openStats[p.id!]} timeout="auto" unmountOnExit>
                                        <Stack spacing={2} sx={{ p: 2, bgcolor: '#fafafa' }}>
                                            {/* quick numbers */}
                                            {(() => {
                                                const { monthlyIncome, monthlyExpendable, savingsRate } = buildStats(p);
                                                const rec = recommendedMap[p.id!] ?? null;
                                                return (
                                                    <Typography variant="body2">
                                                        <strong>Monthly income:</strong> ${monthlyIncome.toLocaleString()} |&nbsp;
                                                        <strong>Expenses:</strong> ${monthlyExpenses.toLocaleString()} |&nbsp;
                                                        <strong>Expendable:</strong> ${monthlyExpendable.toLocaleString()} |&nbsp;
                                                        <strong>Savings rate:</strong> {(savingsRate * 100).toFixed(0)}% {rec !== null && `(rec ${ (rec*100).toFixed(0) }%)`}
                                                    </Typography>
                                                );
                                            })()}
                                            {/* purchase list */}
                                            <Stack direction="row" spacing={4} flexWrap="wrap">
                                                {costItems.map(ci => {
                                                    const potatoesNeeded = ci.cost / (p.potatoPriceAtConversion || POTATO_PRICE_FALLBACK);
                                                    const hrsNeeded      = potatoesNeeded / potatoesPerHour(p);
                                                    return (
                                                        <Paper key={ci.label} sx={{ p: 1.5, minWidth: 140 }} elevation={1}>
                                                            <Typography variant="subtitle2"><strong>{ci.label}</strong></Typography>
                                                            <Typography variant="body2">{potatoesNeeded.toFixed(0)} 🥔</Typography>
                                                            <Typography variant="body2">{hrsNeeded.toFixed(0)} h (~{hrsToYears(+hrsNeeded, p.hoursPerWeek)} yr)</Typography>
                                                        </Paper>
                                                    );
                                                })}
                                            </Stack>
                                        </Stack>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </>
                    )
                ))}
            </TableBody>
        </Table>
    );
}