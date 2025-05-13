import { Alert, Link } from '@mui/material';

type Props = {
    savingsRate: number;
    recommended: number;
    monthlyExpendable: number;  // USD
};

export default function FinanceCoach({ savingsRate, recommended, monthlyExpendable }: Props) {
    const pct   = (savingsRate * 100).toFixed(0);
    const rec   = (recommended * 100).toFixed(0);
    const delta = savingsRate - recommended;

    let title: string;
    let message: string;
    let severity: 'success' | 'info' | 'warning';

    if (delta >= 0.05) {
        // 5%+ above recommendation
        title = 'Fantastic!';
        message = `You’re saving about ${pct}% of income — well above the recommended ${rec}%. Consider directing part of your $${monthlyExpendable.toLocaleString()} monthly surplus toward low‑cost index funds or paying off high‑interest debt.`;
        severity = 'success';
    } else if (delta >= 0) {
        // meeting recommendation
        title = 'On track';
        message = `You’re meeting the guideline of ${rec}% savings. Nice! Even an extra $50‑100 a month can compound into thousands later.`;
        severity = 'info';
    } else {
        // below recommendation
        title = 'Room to improve';
        message = `You’re saving roughly ${pct}% of income but the guideline is ${rec}%. Trimming $${((-delta) * monthlyExpendable + 50).toFixed(0)} in monthly expenses or boosting income can close the gap.`;
        severity = 'warning';
    }

    return (
        <Alert severity={severity} sx={{ mt: 2 }}>
            <strong>{title}</strong> — {message}{' '}
            <Link
                href="https://www.ramseysolutions.com/retirement/how-much-to-save-for-retirement"
                target="_blank"
                rel="noopener"
            >
                Learn more&nbsp;›
            </Link>
        </Alert>
    );
}
