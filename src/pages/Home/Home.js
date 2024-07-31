import styles from './home.module.css';
import React from 'react';
import classNames from 'classnames/bind';
import LineChart from '~/components/charts/LineChart';
import DoughnutChart from '~/components/charts/DoughnutChart';
import Calendar from '~/components/calendar/Calendar';
import { useSelector, useDispatch } from 'react-redux';
import TabContent from '~/components/tabContent/tabContent';
import { fetchTransactionsByEmail, deleteTransaction } from '~/reducers/transSlice';
import { useEffect, useState } from 'react';
import TransactionSummary from '~/components/transactionSumary';
import LineChartIcon from '~/assets/line-chart.png';
import DonutChartIcon from '~/assets/donut-chart.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toggleIsOpen, setIsUpdate } from '../../reducers/homeSlice'; // Updated import

const cx = classNames.bind(styles);

const lineChartOptions = {
    responsive: true,
    scales: {
        x: {
            beginAtZero: true,
        },
        y: {
            beginAtZero: true,
        },
    },
};

const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};

function Home() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const transactions = useSelector((state) => state.transactions.transactions || []);
    const [selectedFilter, setSelectedFilter] = useState('Both');
    const userEmail = user.user.email;
    const isUpdate = useSelector((state) => state.isOpen.isUpdate); // Updated line
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    // const userEmail = 'tanhero2002@gmail.com';

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        // console.log('selectedFilter:', selectedFilter);
    };

    const handleOpen = (transaction) => {
        dispatch(toggleIsOpen());
        dispatch(setIsUpdate(true));
        setTransactionToEdit(transaction);
    };

    const handleDelete = (transaction) => {
        dispatch(deleteTransaction(transaction.id));
    }

    useEffect(() => {
        dispatch(fetchTransactionsByEmail(userEmail));
    }, [dispatch, userEmail]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const transactionsByDate = transactions.reduce((acc, transaction) => {
        const dateKey = new Date(transaction.date).toLocaleDateString();
        if (!acc[dateKey]) {
            acc[dateKey] = { income: 0, expense: 0 };
        }
        if (transaction.type === 'Income') {
            acc[dateKey].income += transaction.amount;
        } else if (transaction.type === 'Expense') {
            acc[dateKey].expense += transaction.amount;
        }
        return acc;
    }, {});

    const sortedTransactions = Object.keys(transactionsByDate).map((dateKey) => ({
        date: new Date(dateKey),
        income: transactionsByDate[dateKey].income,
        expense: transactionsByDate[dateKey].expense,
    }));

    // Sort the array by date in ascending order (oldest to newest)
    sortedTransactions.sort((a, b) => a.date - b.date);

    // Prepare lineChartData using the sorted data
    const lineChartData = {
        labels: sortedTransactions.map((item) => item.date.toLocaleDateString()),
        datasets: [
            {
                label: 'Income',
                data: sortedTransactions.map((item) => item.income),
                borderColor: '#20C997',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
            },
            {
                label: 'Expense',
                data: sortedTransactions.map((item) => item.expense),
                borderColor: '#E74C3C',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
            },
        ],
    };

    const filterByType = transactions
        .filter((transaction) => {
            if (selectedFilter === 'Income') {
                return transaction.type === 'Income';
            } else if (selectedFilter === 'Expense') {
                return transaction.type === 'Expense';
            } else {
                return true; // Include all transactions for 'Both' type
            }
        })
        .reduce((acc, transaction) => {
            if (!acc[transaction.name]) {
                acc[transaction.name] = 0;
            }
            acc[transaction.name] += transaction.amount;
            return acc;
        }, {});

    // Prepare doughnutChartData for DoughnutChart component
    const doughnutChartData = {
        labels: Object.keys(filterByType),
        datasets: [
            {
                label: selectedFilter,
                data: Object.values(filterByType),
                backgroundColor: [
                    '#FF6384', // Red
                    '#36A2EB', // Blue
                    '#FFCE56', // Yellow
                    '#4BC0C0', // Green
                    '#9966FF', // Purple
                    '#FF9F40', // Orange
                    '#5C5C5C', // Gray
                    '#F7FF33', // Yellow
                    '#4C005C', // Purple
                    '#5CC5C5', // Cyan
                    '#6699FF', // Blue
                    '#339933', // Green
                    '#999999', // Gray
                    '#B333FF', // Purple
                    '#FF8033', // Orange
                    '#CC0000', // Red
                    '#993300', // Brown
                    '#FF6600', // Orange
                    '#4C9900', // Green
                    '#3300FF', // Blue
                ],
            },
        ],
    };

    return (
        <div className={cx('container-body')}>
            <TabContent edit={isUpdate} transactionToEdit={transactionToEdit} />
            <div className={cx('title-content')}>
                <h1>Welcome, {user.user.email} </h1>
            </div>
            <div className={cx('container-box')}>
                <div className={cx('left-side')}>
                    <div className={cx('left-side-content')}>
                        {transactions.length === 0 ? (
                            <div className={cx('no-transaction')}>
                                <p className="chart-title">There is no transaction history</p>
                                <img src={LineChartIcon} alt="Line Chart" />
                            </div>
                        ) : (
                            <div data-testid="line-chart">
                                <LineChart data={lineChartData} options={lineChartOptions} />
                            </div>
                        )}
                    </div>
                    <div className={cx('left-side-content')}>
                        <div className={cx('transaction-content')}>
                            <h1>Transaction</h1>
                            {transactions.length === 0 ? (
                                <p>No transactions available</p>
                            ) : (
                                <div className={cx('transaction-list')} data-testid="transactions-list">
                                    {[...transactions] // Create a copy of transactions array
                                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
                                        .map((transaction) => (
                                            <div key={transaction.id} className={cx('transaction-item')}>
                                                <div className={cx('transaction-item-content')}>
                                                    <h2>{transaction.name}</h2>
                                                    <div className={cx('items-group')}>
                                                        <div>
                                                            <p>{transaction.type}</p>
                                                            <p>{formatDate(transaction.date)}</p>
                                                        </div>
                                                        <div className={cx('icons-group')}>
                                                            <button
                                                                className={cx('button-icons', 'pen')}
                                                                onClick={() => handleOpen(transaction)}
                                                            >
                                                                <FontAwesomeIcon icon={faPen} />
                                                            </button>
                                                            <button
                                                                className={cx('button-icons', 'trash')}
                                                                onClick={() => handleDelete(transaction)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p
                                                    style={{
                                                        color: transaction.type === 'Income' ? '#20C997' : '#E74C3C',
                                                    }}
                                                >
                                                    {transaction.amount >= 1000
                                                        ? transaction.amount.toLocaleString()
                                                        : transaction.amount}
                                                    VND
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={cx('right-side')}>
                    <div className={cx('right-side-content')} data-testid="calendar">
                        <Calendar transactions={transactions} />
                    </div>
                    <div className={cx('right-side-content')}>
                        {transactions.length === 0 ? (
                            <div className={cx('no-transaction')}>
                                <p className="chart-title">There is no transaction history</p>
                                <img src={DonutChartIcon} alt="Donut Chart" />
                            </div>
                        ) : (
                            <div>
                                <div className={cx('chart-filter')} data-testid="donut-chart">
                                    <div className={cx('filter-item')}>
                                        <button
                                            className={cx('value', { selected: selectedFilter === 'Both' })}
                                            onClick={() => handleFilterSelect('Both')}
                                            data-testid="both-button"
                                        >
                                            Both
                                        </button>
                                        <button
                                            className={cx('value', { selected: selectedFilter === 'Income' })}
                                            onClick={() => handleFilterSelect('Income')}
                                            data-testid="income-button"
                                        >
                                            Income
                                        </button>
                                        <button
                                            className={cx('value', { selected: selectedFilter === 'Expense' })}
                                            onClick={() => handleFilterSelect('Expense')}
                                            data-testid="expense-button"
                                        >
                                            Expense
                                        </button>
                                    </div>
                                </div>
                                <div className={cx('chart-contain')}>
                                    <DoughnutChart data={doughnutChartData} options={doughnutChartOptions} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={cx('right-side-content')}>
                        <div className={cx('total-amount')} data-testid="total-amount">
                            <TransactionSummary transactions={transactions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
