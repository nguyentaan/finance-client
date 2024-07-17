import styles from './home.module.css';
import classNames from 'classnames/bind';
import LineChart from '~/components/charts/LineChart';
import DoughnutChart from '~/components/charts/DoughnutChart';
import Calendar from '~/components/calendar/Calendar';
// import { toggleIsOpen } from '~/reducers/homeSlice';
import { useSelector, useDispatch } from 'react-redux';
import TabContent from '~/components/tabContent/tabContent';
import { fetchTransactionsByEmail } from '~/reducers/transSlice';
import { useEffect, useState } from 'react';
import TransactionSummary from '~/components/transactionSumary';

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
    const transactions = useSelector((state) => state.transactions.transactions);
    const [selectedFilter, setSelectedFilter] = useState('Both');
    // const { loading, error } = useSelector((state) => state.transactions);
    // const userEmail = user.user.email;
    const userEmail = 'tanhero2002@gmail.com';

    // console.log('transactions:', transactions);

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        console.log('selectedFilter:', selectedFilter);
    };

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

    const lineChartData = {
        labels: Object.keys(transactionsByDate),
        datasets: [
            {
                label: 'Income',
                data: Object.keys(transactionsByDate).map((date) => transactionsByDate[date].income),
                borderColor: '#20C997',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
            },
            {
                label: 'Expense',
                data: Object.keys(transactionsByDate).map((date) => transactionsByDate[date].expense),
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
            <TabContent />
            <div className={cx('title-content')}>
                <h1>Welcome, {user.user.email} </h1>
            </div>
            <div className={cx('container-box')}>
                <div className={cx('left-side')}>
                    <div className={cx('left-side-content')}>
                        <LineChart data={lineChartData} options={lineChartOptions} />
                    </div>
                    <div className={cx('left-side-content')}>
                        <div className={cx('transaction-content')}>
                            <h1>Transaction</h1>
                            {transactions.length === 0 ? (
                                <p>No transactions available</p>
                            ) : (
                                <div className={cx('transaction-list')}>
                                    {transactions.map((transaction) => (
                                        <div key={transaction.id} className={cx('transaction-item')}>
                                            <div className={cx('transaction-item-content')}>
                                                <h2>{transaction.name}</h2>
                                                <p>{transaction.type}</p>
                                                <p>{formatDate(transaction.date)}</p>
                                            </div>
                                            <p style={{ color: transaction.type === 'Income' ? '#20C997' : '#E74C3C' }}>
                                                {transaction.amount.toLocaleString()} VND
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={cx('right-side')}>
                    <div className={cx('right-side-content')}>
                        <Calendar />
                    </div>
                    <div className={cx('right-side-content')}>
                        <div className={cx('chart-filter')}>
                            <div className={cx('filter-item')}>
                                <button
                                    className={cx('value', { selected: selectedFilter === 'Both' })}
                                    onClick={() => handleFilterSelect('Both')}
                                >
                                    Both
                                </button>
                                <button
                                    className={cx('value', { selected: selectedFilter === 'Income' })}
                                    onClick={() => handleFilterSelect('Income')}
                                >
                                    Income
                                </button>
                                <button
                                    className={cx('value', { selected: selectedFilter === 'Expense' })}
                                    onClick={() => handleFilterSelect('Expense')}
                                >
                                    Expense
                                </button>
                            </div>
                        </div>
                        <div className={cx('chart-contain')}>
                            <DoughnutChart data={doughnutChartData} options={doughnutChartOptions} />
                        </div>
                    </div>
                    <div className={cx('right-side-content')}>
                        <div className={cx('total-amount')}>
                            <TransactionSummary transactions={transactions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
