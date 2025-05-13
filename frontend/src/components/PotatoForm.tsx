import { useState } from 'react';
import {
    createPotatoItem,
    getRecommendedPercent,
    PotatoItem,
} from '../services/potatoService';
import {
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

type Props = {
    onCreate: (item: PotatoItem) => void;
    onRecommendation: (percent: number, item: PotatoItem) => void;
    onExpenseChange: (monthly: number) => void;
};

export default function PotatoForm({ onCreate, onRecommendation, onExpenseChange }: Props) {
    // state
    const [name, setName] = useState('');
    const [hourlyPay, setHourlyPay] = useState(0);
    const [hoursPerWeek, setHoursPerWeek] = useState(0);
    const [employmentType, setEmploymentType] = useState<'Hourly' | 'Salary'>('Hourly');
    const [experienceLevel, setExperienceLevel] = useState<'Junior' | 'Intermediate' | 'Senior'>('Junior');
    const [age, setAge] = useState(25);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);

    const [recommended, setRecommended] = useState<number | null>(null);

    // submit
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newItem = await createPotatoItem({
            name,
            hourlyPay,
            hoursPerWeek,
            potatoPriceAtConversion: 0,
            employmentType,
            experienceLevel,
        });
        onCreate(newItem);

        const percent = await getRecommendedPercent(age);
        setRecommended(percent);
        onRecommendation(percent, newItem);

        // reset core fields (keep expenses so stats remain accurate)
        setName('');
        setHourlyPay(0);
        setHoursPerWeek(0);
        setEmploymentType('Hourly');
        setExperienceLevel('Junior');
        setAge(25);
    }

    // render
    return (
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4, }} elevation={3}>
            <Stack spacing={2}>
                <Typography variant="h6">Enter your details</Typography>

                <TextField label="Name" value={name} onChange={e => setName(e.target.value)} />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        label="Hourly Pay ($)"
                        type="number"
                        value={hourlyPay}
                        onChange={e => setHourlyPay(+e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Hours / Week"
                        type="number"
                        value={hoursPerWeek}
                        onChange={e => setHoursPerWeek(+e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Age"
                        type="number"
                        value={age}
                        onChange={e => setAge(+e.target.value)}
                        fullWidth
                    />
                </Stack>

                <TextField
                    label="Monthly Living Expenses ($)"
                    type="number"
                    value={monthlyExpenses}
                    onChange={e => {
                        const val = +e.target.value;
                        setMonthlyExpenses(val);
                        onExpenseChange(val);
                    }}
                />

                <div>
                    <FormLabel>Employment Type</FormLabel>
                    <RadioGroup row value={employmentType} onChange={e => setEmploymentType(e.target.value as any)}>
                        <FormControlLabel value="Hourly" control={<Radio />} label="Hourly" />
                        <FormControlLabel value="Salary" control={<Radio />} label="Salary" />
                    </RadioGroup>
                </div>

                <div>
                    <FormLabel>Experience Level</FormLabel>
                    <Select size="small" value={experienceLevel} onChange={e => setExperienceLevel(e.target.value as any)} sx={{ ml: 2, minWidth: 140 }}>
                        <MenuItem value="Junior">Junior</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Senior">Senior</MenuItem>
                    </Select>
                </div>

                <Button type="submit" variant="contained">Convert to Potatoes</Button>

                {recommended !== null && (
                    <Typography sx={{ mt: 1 }}>
                        Recommended investment rate: <strong>{(recommended * 100).toFixed(0)}%</strong>
                    </Typography>
                )}
            </Stack>
        </Paper>
    );
}