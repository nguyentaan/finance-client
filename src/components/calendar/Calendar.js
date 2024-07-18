/* eslint-disable no-loop-func */
import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
} from 'date-fns';
import styles from './calendar.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Calendar = ({ transactions }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const renderHeader = () => {
        return (
            <div className={cx('calendar-header')}>
                <span className={cx('prev')} onClick={prevMonth}>
                    {'<'}
                </span>
                <span className={cx('current-date')}>{format(currentDate, 'MMMM yyyy')}</span>
                <span className={cx('next')} onClick={nextMonth}>
                    {'>'}
                </span>
            </div>
        );
    };

    const renderDays = () => {
        const dateFormat = 'E';
        const days = [];
        let startDate = startOfWeek(startOfMonth(currentDate));

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className={cx('calendar-day')} key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>,
            );
        }

        return <div className={cx('calendar-days')}>{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = 'd';
        const rows = [];

        let day = startDate;

        while (day <= endDate) {
            let days = [];

            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, dateFormat);
                const cloneDay = day;

                const transactionsOnDate = transactions.filter((transaction) =>
                    isSameDay(new Date(transaction.date), day),
                );

                const hasIncome = transactionsOnDate.some((transaction) => transaction.type === 'Income');
                const hasExpense = transactionsOnDate.some((transaction) => transaction.type === 'Expense');

                days.push(
                    <div
                        className={cx('calendar-cell', {
                            disabled: !isSameMonth(day, monthStart),
                            selected: isSameDay(day, new Date()),
                            income: hasIncome && !hasExpense,
                            expense: hasExpense && !hasIncome,
                            both: hasIncome && hasExpense,
                        })}
                        key={formattedDate}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <span className={cx('number')}>{formattedDate}</span>
                    </div>,
                );

                day = addDays(day, 1);
            }

            rows.push(
                <div className={cx('calendar-row')} key={day}>
                    {days}
                </div>,
            );
        }

        return <div className={cx('calendar-body')}>{rows}</div>;
    };

    const onDateClick = (day) => {
        console.log('Selected Date:', day);
        // Handle selecting a date, e.g., update state
    };

    return (
        <div className={cx('calendar-container')}>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default Calendar;
