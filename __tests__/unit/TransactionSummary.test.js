import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionSummary from '../../src/components/transactionSumary';
import '@testing-library/jest-dom';

describe('TransactionSummary - percentChange calculation', () => {
    const scenarios = [
        {
            description: 'only income transactions results in "+100%"',
            transactions: [{ type: 'Income', amount: 1000 }],
            expected: '+100%',
        },
        {
            description: 'only expense transactions results in a negative percentage',
            transactions: [{ type: 'Expense', amount: 500 }],
            expected: '-100.00%',
        },
        {
            description: 'income higher than expense results in a positive percentage',
            transactions: [
                { type: 'Income', amount: 1500 },
                { type: 'Expense', amount: 500 },
            ],
            expected: '+200.00%',
        },
        {
            description: 'expense higher than income results in a negative percentage',
            transactions: [
                { type: 'Income', amount: 500 },
                { type: 'Expense', amount: 1500 },
            ],
            expected: '-66.67%',
        },
        {
            description: 'no transactions results in "+100%"',
            transactions: [],
            expected: '+100%',
        },
    ];

    scenarios.forEach(({ description, transactions, expected }) => {
        it(description, () => {
            render(<TransactionSummary transactions={transactions} />);
            const percentChangeElement = screen.getByText(expected);
            expect(percentChangeElement).toBeInTheDocument();
        });
    });
});
