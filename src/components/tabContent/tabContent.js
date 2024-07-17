import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './tabContent.module.css';
import { toggleIsOpen } from '~/reducers/homeSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { createTransaction } from '~/reducers/transSlice';
import { useState } from 'react';
import Loading from '~/components/Layout/DefautLayout/loading/loading';

const cx = classNames.bind(styles);

const TabContent = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.isOpen.isOpen);
    const user = useSelector((state) => state.auth);
    const [selectedOption, setSelectedOption] = React.useState('...');

    const handleSelect = (option) => {
        setSelectedOption(option);
        setFormData({
            ...formData,
            type: option,
        });
    };

    const handleCloseTab = () => {
        dispatch(toggleIsOpen());
    };

    // console.log('User:', user.user.email);
    const { loading, error } = useSelector((state) => state.transactions);
    // const loading = true;
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        userEmail: user.user.email,
        amount: 0,
        dateTime: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(createTransaction(formData));
        if (res.meta.requestStatus === 'fulfilled') {
            console.log('Transaction created successfully:', res.payload);
            handleCloseTab();
        } else {
            console.log('Error creating transaction:', res.error.message);
        }
    };

    return (
        <div className={cx('tab-overlay', { 'tab-open': isOpen })}>
            <div className={cx('tab-content')}>
                <div className={cx('button-close')}>
                    <button className={cx('close-button')} onClick={handleCloseTab}>
                        <FontAwesomeIcon icon={faTimes} size="1x" />
                        <p>Close</p>
                    </button>
                </div>
                <form className={cx('item-container')} onSubmit={handleSubmit}>
                    <div className={cx('list-item')}>
                        <div className={cx('item-content')}>
                            <h3>Type</h3>
                            <div className={cx('select')}>
                                <div className={cx('selected')} data-default="..." data-one="Income" data-two="Expense">
                                    {selectedOption}
                                    <div className={cx('arrow')}>
                                        <FontAwesomeIcon icon={faChevronDown} size="1x" />
                                    </div>
                                </div>
                                <div className={cx('options')}>
                                    {['...', 'Income', 'Expense'].map((option, index) => (
                                        <div key={option} title={option}>
                                            <input
                                                id={option}
                                                name="option"
                                                type="radio"
                                                checked={selectedOption === option}
                                                onChange={() => handleSelect(option)}
                                            />
                                            <label className={cx('option')} htmlFor={option} data-txt={option}>
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={cx('item-content')}>
                            <h3>Name of transaction</h3>
                            <input
                                type="text"
                                className={cx('input')}
                                placeholder="Enter the name of the transaction"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={cx('item-content')}>
                            <h3>Description (optional)</h3>
                            <input
                                type="text"
                                className={cx('input')}
                                placeholder="Enter the description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('item-content')}>
                            <h3>Date</h3>
                            <input
                                type="date"
                                className={cx('input')}
                                placeholder=""
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={cx('item-content')}>
                            <h3>Amount</h3>
                            <input
                                type="number"
                                className={cx('input')}
                                placeholder="0.00 VND"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button className={cx('submit-button')} type="submit">
                        {loading ? <Loading /> : 'Add transaction'}
                    </button>
                    {error && <p className={cx('error')}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default TabContent;
