import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionSummary from '../../src/components/transactionSumary';
import '@testing-library/jest-dom';

describe('TransactionSummary', () => {
    it('renders without crashing', () => {
        const transactions = [];
        render(<TransactionSummary transactions={transactions} />);
        const totalBalanceElement = screen.getByText(/Total Balance:/i);
        expect(totalBalanceElement).toBeInTheDocument();
    });

    it('calculates and displays total balance correctly', () => {
        const transactions = [
            { id: 1, type: 'Income', amount: 10000 },
            { id: 2, type: 'Expense', amount: 5000 },
            { id: 3, type: 'Expense', amount: 2000 },
        ];
        render(<TransactionSummary transactions={transactions} />);
        const totalBalanceElement = screen.getByText(/3\.000 VND/);
        expect(totalBalanceElement).toBeInTheDocument();
    });

    it('displays the correct percent change for positive change', () => {
        const transactions = [
            { id: 1, type: 'Income', amount: 12000 },
            { id: 2, type: 'Expense', amount: 2000 },
        ];
        render(<TransactionSummary transactions={transactions} />);
        const percentChangeElement = screen.getByText('+500.00%');
        expect(percentChangeElement).toBeInTheDocument();
    });

    it('displays the correct percent change for negative change', () => {
        const transactions = [
            { id: 1, type: 'Income', amount: 2000 },
            { id: 2, type: 'Expense', amount: 4000 },
        ];
        render(<TransactionSummary transactions={transactions} />);
        const percentChangeElement = screen.getByText('-50.00%');
        expect(percentChangeElement).toBeInTheDocument();
    });

    it('displays +100% percent change when initial expense is 0', () => {
        const transactions = [{ id: 1, type: 'Income', amount: 10000 }];
        render(<TransactionSummary transactions={transactions} />);
        const percentChangeElement = screen.getByText('+100%');
        expect(percentChangeElement).toBeInTheDocument();
    });
});
