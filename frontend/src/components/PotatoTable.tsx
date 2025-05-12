import { useState } from 'react';
import {
    PotatoItem,
    updatePotatoItem,
    deletePotatoItem,
} from '../services/potatoService';
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, TextField, Select, MenuItem,
    RadioGroup, FormControlLabel, Radio, Stack, Paper, Collapse
} from '@mui/material';
import { Edit, Delete, Save, Close, ExpandMore, ExpandLess } from '@mui/icons-material';

type Props = {
    items: PotatoItem[];
    onSave: (updated: PotatoItem) => void;
    onDelete: (id: number) => void;
};

const POTATO_PRICE_FALLBACK = 1.10;   // used if field is 0

export default function PotatoTable({ items, onSave, onDelete }: Props) {
    const [editingId , setEditingId ] = useState<number|null>(null);
    const [draft     , setDraft     ] = useState<PotatoItem|null>(null);
    const [openStats , setOpenStats ] = useState<Record<number, boolean>>({});   // NEW

    if (!items.length) return <Paper sx={{ p: 3 }}>No data yet.</Paper>;

    // convenience
    const potatoesPerHour = (p: PotatoItem) =>
        p.hourlyPay / (p.potatoPriceAtConversion || POTATO_PRICE_FALLBACK);

    // hrs to weeks to yrs helper
    const hrsToYears = (hrs: number, hoursPerWeek: number) =>
        (hrs / hoursPerWeek / 52).toFixed(1);

    return (
        <Table component={Paper} elevation={3}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">$ / hr</TableCell>
                    <TableCell align="right">Potatoes / hr</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Exp.</TableCell>
                    <TableCell width={180}/>
                </TableRow>
            </TableHead>

            <TableBody>
                {items.map(p =>
                    // edit mode
                    editingId === p.id ? (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        value={draft!.name}
                                        onChange={e => setDraft({ ...draft!, name: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={draft!.hourlyPay}
                                        onChange={e => setDraft({ ...draft!, hourlyPay: +e.target.value })}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {potatoesPerHour(draft!).toFixed(1)}
                                </TableCell>
                                <TableCell>
                                    <RadioGroup row value={draft!.employmentType}
                                                onChange={e => setDraft({ ...draft!, employmentType: e.target.value as any })}>
                                        <FormControlLabel value="Hourly"  control={<Radio size="small"/>} label="H"/>
                                        <FormControlLabel value="Salary"  control={<Radio size="small"/>} label="S"/>
                                    </RadioGroup>
                                </TableCell>
                                <TableCell>
                                    <Select size="small" value={draft!.experienceLevel}
                                            onChange={e => setDraft({ ...draft!, experienceLevel: e.target.value as any })}>
                                        <MenuItem value="Junior">Junior</MenuItem>
                                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                                        <MenuItem value="Senior">Senior</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row">
                                        <IconButton color="primary" onClick={async () => {
                                            const saved = await updatePotatoItem(p.id!, draft!);
                                            onSave(saved);
                                            setEditingId(null);
                                        }}>
                                            <Save/>
                                        </IconButton>
                                        <IconButton onClick={() => setEditingId(null)}>
                                            <Close/>
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )
                        // read-only mode
                        : (
                            <>
                                <TableRow key={p.id}>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell align="right">{p.hourlyPay.toFixed(2)}</TableCell>
                                    <TableCell align="right">{potatoesPerHour(p).toFixed(1)}</TableCell>
                                    <TableCell>{p.employmentType}</TableCell>
                                    <TableCell>{p.experienceLevel}</TableCell>
                                    <TableCell>
                                        <Stack direction="row">
                                            <IconButton color="primary" onClick={() => {
                                                setEditingId(p.id!);
                                                setDraft({ ...p });
                                            }}>
                                                <Edit/>
                                            </IconButton>
                                            <IconButton color="error" onClick={async () => {
                                                await deletePotatoItem(p.id!); onDelete(p.id!);
                                            }}>
                                                <Delete/>
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    setOpenStats(prev => ({ ...prev, [p.id!]: !prev[p.id!] }))
                                                }
                                            >
                                                {openStats[p.id!] ? <ExpandLess/> : <ExpandMore/>}
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>

                                {/* inline stats panel */}
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={openStats[p.id!]} timeout="auto" unmountOnExit>
                                            <Stack direction="row" spacing={4} sx={{ p: 2, bgcolor: '#fafafa' }}>
                                                {[
                                                    { label: 'House 300 k', cost: 300_000 },
                                                    { label: 'Car 40 k' ,  cost: 40_000  },
                                                    { label: 'PS5+TV 1 k', cost: 1_000   },
                                                ].map(item => {
                                                    const potatoesNeeded = item.cost / (p.potatoPriceAtConversion || POTATO_PRICE_FALLBACK);
                                                    const hrsNeeded      = potatoesNeeded / potatoesPerHour(p);
                                                    return (
                                                        <div key={item.label}>
                                                            <strong>{item.label}</strong><br/>
                                                            {potatoesNeeded.toFixed(0)} 🥔<br/>
                                                            {hrsNeeded.toFixed(0)} h&nbsp;(~{hrsToYears(+hrsNeeded, p.hoursPerWeek)} yr)
                                                        </div>
                                                    );
                                                })}
                                            </Stack>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </>
                        )
                )}
            </TableBody>
        </Table>
    );
}
