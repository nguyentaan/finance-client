import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './../pages/Home/home.module.css';

const cx = classNames.bind(styles);

const TransactionSummary = ({ transactions }) => {
    // Calculate total income and total expense
    const { totalIncome, totalExpense } = useMemo(() => {
        const incomeTotal = transactions
            .filter((transaction) => transaction.type === 'Income')
            .reduce((total, transaction) => total + transaction.amount, 0);

        const expenseTotal = transactions
            .filter((transaction) => transaction.type === 'Expense')
            .reduce((total, transaction) => total + transaction.amount, 0);

        return { totalIncome: incomeTotal, totalExpense: expenseTotal };
    }, [transactions]);

    // Calculate percent change
    const percentChange = useMemo(() => {
        const total = totalIncome - totalExpense;
        if (totalExpense === 0) {
            return '+100%'; // To handle division by zero, consider this as 100% increase
        }
        const change = ((total / totalExpense) * 100).toFixed(2);
        return total >= 0 ? `+${change}%` : `${change}%`;
    }, [totalIncome, totalExpense]);

    return (
        <div className={cx('total-amount')}>
            <h3>Total Balance:</h3>
            <p className={cx('amount')}>{(totalIncome - totalExpense).toLocaleString()} VND</p>
            <p>{percentChange}</p>
        </div>
    );
};

export default TransactionSummary;
