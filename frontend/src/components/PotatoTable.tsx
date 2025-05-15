// src/components/PotatoTable.tsx
import { Fragment, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    IconButton,
    TextField,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Collapse,
    Box,
    Grid,
} from '@mui/material';
import {
    Edit,
    Delete,
    Save,
    Close,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';
import {
    PotatoItem,
    updatePotatoItem,
    deletePotatoItem,
} from '../services/potatoService';
import { costItems } from '../constants/costItems';

type Props = {
    items: PotatoItem[];
    onSave: (updated: PotatoItem) => void;
    onDelete: (id: number) => void;
    monthlyExpenses: number;
    recommendedMap: Record<number, number>;
};

const POTATO_PRICE = 1.10;

export default function PotatoTable({
                                        items,
                                        onSave,
                                        onDelete,
                                        monthlyExpenses,
                                        recommendedMap,
                                    }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draft, setDraft] = useState<PotatoItem | null>(null);
    const [openRows, setOpenRows] = useState<Record<number, boolean>>({});

    // If no rows, show placeholder card
    if (!items.length) {
        return (
            <Card
                elevation={4}
                sx={{ mt: 3, mb: 4, width: '100%', maxWidth: 700, mx: 'auto' }}
            >
                <CardContent>
                    <Typography>No data yet.</Typography>
                </CardContent>
            </Card>
        );
    }

    // HOW MANY 🥔 per hour?
    const potatoesPerHour = (p: PotatoItem) =>
        p.hourlyPay / (p.potatoPriceAtConversion || POTATO_PRICE);

    // GUARD against zero hours/week so we never get Infinity
    const hrsToYears = (hrs: number, hpw: number) =>
        hpw > 0 ? (hrs / hpw / 52).toFixed(1) : '—';

    // Build the monthly stats
    const buildStats = (p: PotatoItem) => {
        const monthlyIncome = p.hourlyPay * p.hoursPerWeek * 4.33;
        const monthlyExpendable = Math.max(
            0,
            monthlyIncome - monthlyExpenses
        );
        const savingsRate = monthlyIncome
            ? monthlyExpendable / monthlyIncome
            : 0;
        return { monthlyIncome, monthlyExpendable, savingsRate };
    };

    return (
        <Card
            elevation={4}
            sx={{
                mt: 3,
                mb: 4,
                width: '100%',
                maxWidth: 700,
                mx: 'auto',
            }}
        >
            <CardContent sx={{ p: 0 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">$ / hr</TableCell>
                                <TableCell align="right">🥔 / hr</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Exp.</TableCell>
                                <TableCell width={48} />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((p) => (
                                <Fragment key={p.id}>
                                    {/* ─── Edit vs. View Row ─── */}
                                    {editingId === p.id ? (
                                        <TableRow hover>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    value={draft!.name}
                                                    onChange={(e) =>
                                                        setDraft({ ...draft!, name: e.target.value })
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={draft!.hourlyPay}
                                                    onChange={(e) =>
                                                        setDraft({
                                                            ...draft!,
                                                            hourlyPay: +e.target.value,
                                                        })
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {potatoesPerHour(draft!).toFixed(1)}
                                            </TableCell>
                                            <TableCell>
                                                <RadioGroup
                                                    row
                                                    value={draft!.employmentType}
                                                    onChange={(e) =>
                                                        setDraft({
                                                            ...draft!,
                                                            employmentType: e.target.value as any,
                                                        })
                                                    }
                                                >
                                                    <FormControlLabel
                                                        value="Hourly"
                                                        control={<Radio size="small" />}
                                                        label="H"
                                                    />
                                                    <FormControlLabel
                                                        value="Salary"
                                                        control={<Radio size="small" />}
                                                        label="S"
                                                    />
                                                </RadioGroup>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    size="small"
                                                    value={draft!.experienceLevel}
                                                    onChange={(e) =>
                                                        setDraft({
                                                            ...draft!,
                                                            experienceLevel: e.target.value as any,
                                                        })
                                                    }
                                                >
                                                    <MenuItem value="Junior">Junior</MenuItem>
                                                    <MenuItem value="Intermediate">
                                                        Intermediate
                                                    </MenuItem>
                                                    <MenuItem value="Senior">Senior</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={async () => {
                                                        const saved = await updatePotatoItem(
                                                            p.id!,
                                                            draft!
                                                        );
                                                        onSave(saved);
                                                        setEditingId(null);
                                                    }}
                                                >
                                                    <Save />
                                                </IconButton>
                                                <IconButton onClick={() => setEditingId(null)}>
                                                    <Close />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow hover>
                                            <TableCell>{p.name}</TableCell>
                                            <TableCell align="right">
                                                {p.hourlyPay.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {potatoesPerHour(p).toFixed(1)}
                                            </TableCell>
                                            <TableCell>{p.employmentType}</TableCell>
                                            <TableCell>{p.experienceLevel}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        setEditingId(p.id!);
                                                        setDraft({ ...p });
                                                    }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={async () => {
                                                        await deletePotatoItem(p.id!);
                                                        onDelete(p.id!);
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() =>
                                                        setOpenRows((o) => ({
                                                            ...o,
                                                            [p.id!]: !o[p.id!],
                                                        }))
                                                    }
                                                >
                                                    {openRows[p.id!] ? (
                                                        <ExpandLess />
                                                    ) : (
                                                        <ExpandMore />
                                                    )}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {/* ─── Collapsed Detail Row ─── */}
                                    <TableRow>
                                        <TableCell
                                            style={{ paddingBottom: 0, paddingTop: 0 }}
                                            colSpan={6}
                                        >
                                            <Collapse
                                                in={openRows[p.id!]}
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                <Box margin={2} sx={{ bgcolor: '#fafafa', borderRadius: 1 }}>
                                                    {/* Summary line */}
                                                    {(() => {
                                                        const {
                                                            monthlyIncome,
                                                            monthlyExpendable,
                                                            savingsRate,
                                                        } = buildStats(p);
                                                        const rec = recommendedMap[p.id!] ?? 0;
                                                        return (
                                                            <Typography
                                                                variant="body2"
                                                                gutterBottom
                                                            >
                                                                <strong>Monthly income:</strong> $
                                                                {monthlyIncome.toLocaleString()} |{' '}
                                                                <strong>Expenses:</strong> $
                                                                {monthlyExpenses.toLocaleString()} |{' '}
                                                                <strong>Expendable:</strong> $
                                                                {monthlyExpendable.toLocaleString()} |{' '}
                                                                <strong>Savings rate:</strong>{' '}
                                                                {(savingsRate * 100).toFixed(0)}%{' '}
                                                                {rec
                                                                    ? `(rec ${(rec * 100).toFixed(0)}%)`
                                                                    : ''}
                                                            </Typography>
                                                        );
                                                    })()}

                                                    {/* Cost breakdown cards in a responsive grid */}
                                                    <Grid container spacing={2}>
                                                        {costItems.map((ci) => {
                                                            const potatoesNeeded =
                                                                ci.cost /
                                                                (p.potatoPriceAtConversion ||
                                                                    POTATO_PRICE);
                                                            const hrsNeeded =
                                                                potatoesNeeded / potatoesPerHour(p);
                                                            const yrs = hrsToYears(
                                                                hrsNeeded,
                                                                p.hoursPerWeek
                                                            );
                                                            return (
                                                                <Grid key={ci.label}>
                                                                    <Card elevation={1} sx={{ p: 2 }}>
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            gutterBottom
                                                                        >
                                                                            {ci.label}
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {potatoesNeeded.toFixed(0)} 🥔
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {yrs} yr
                                                                        </Typography>
                                                                    </Card>
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
