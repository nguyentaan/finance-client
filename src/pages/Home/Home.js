import styles from './home.module.css';
import classNames from 'classnames/bind';
import LineChart from '~/components/charts/LineChart';
import DoughnutChart from '~/components/charts/DoughnutChart';
import Calendar from '~/components/calendar/Calendar';
// import { toggleIsOpen } from '~/reducers/homeSlice';
import { useSelector } from 'react-redux';
import TabContent from '~/components/tabContent/tabContent';

const cx = classNames.bind(styles);
const transactionData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Income',
            data: [4000, 4500, 5000, 5500, 6000, 6500, 7000],
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
            tension: 0.1,
        },
        {
            label: 'Expenses',
            data: [3000, 3200, 2800, 3400, 3000, 3100, 3200],
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            fill: true,
            tension: 0.1,
        },
    ],
};

const doughnutChartData = {
    labels: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Savings'],
    datasets: [
        {
            data: [1000, 500, 300, 200, 1500],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

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

const sampleTransactions = [
    { id: 1, name: 'Salary', type: 'Income', date: '2023-01-01', amount: '1,000,000 VND' },
    { id: 2, name: 'Groceries', type: 'Expense', date: '2023-01-02', amount: '200,000 VND' },
    { id: 3, name: 'Freelance Work', type: 'Income', date: '2023-01-03', amount: '500,000 VND' },
    { id: 4, name: 'Transportation', type: 'Expense', date: '2023-01-04', amount: '100,000 VND' },
    { id: 5, name: 'Bonus', type: 'Income', date: '2023-01-05', amount: '700,000 VND' },
    { id: 6, name: 'Shopping', type: 'Expense', date: '2023-01-06', amount: '300,000 VND' },
    { id: 7, name: 'Consulting Fee', type: 'Income', date: '2023-01-07', amount: '400,000 VND' },
    { id: 8, name: 'Dining Out', type: 'Expense', date: '2023-01-08', amount: '150,000 VND' },
    { id: 9, name: 'Investment Dividend', type: 'Income', date: '2023-01-09', amount: '600,000 VND' },
    { id: 10, name: 'Utilities', type: 'Expense', date: '2023-01-10', amount: '250,000 VND' },
];

function Home() {
    // const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    // console.log('User:', user.user.email);
    return (
        <div className={cx('container-body')}>
            <TabContent />
            <div className={cx('title-content')}>
                <h1>Welcome, {user.user.email} </h1>
            </div>
            <div className={cx('container-box')}>
                <div className={cx('left-side')}>
                    <div className={cx('left-side-content')}>
                        <LineChart data={transactionData} options={lineChartOptions} />
                    </div>
                    <div className={cx('left-side-content')}>
                        <div className={cx('transaction-content')}>
                            <h1>Transaction</h1>
                            {sampleTransactions.length === 0 ? (
                                <p>No transactions available</p>
                            ) : (
                                <div className={cx('transaction-list')}>
                                    {sampleTransactions.map((transaction) => (
                                        <div key={transaction.id} className={cx('transaction-item')}>
                                            <div className={cx('transaction-item-content')}>
                                                <h2>{transaction.name}</h2>
                                                <p>{transaction.type}</p>
                                                <p>{transaction.date}</p>
                                            </div>
                                            <p>{transaction.amount}</p>
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
                        <DoughnutChart data={doughnutChartData} options={doughnutChartOptions} />
                    </div>
                    <div className={cx('right-side-content')}>
                        <div className={cx('total-amount')}>
                            <h1>Total:</h1>
                            <p>100.000 VND</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
