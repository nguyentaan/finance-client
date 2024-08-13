import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './tabContent.module.css';
import { toggleIsOpen, setIsUpdate } from '~/reducers/homeSlice';
import { createTransaction, fetchTransactionsByEmail, updateTransaction } from '~/reducers/transSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Loading from '~/components/Layout/DefautLayout/loading/loading';

const cx = classNames.bind(styles);

const TabContent = ({ edit, transactionToEdit }) => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.isOpen.isOpen);
    const user = useSelector((state) => state.auth);
    const userEmail = user.user.email;
    const [selectedOption, setSelectedOption] = useState('...');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        userEmail: userEmail,
        amount: 0,
        dateTime: '',
    });

    useEffect(() => {
        if (edit && transactionToEdit) {
            setFormData({
                name: transactionToEdit.name,
                description: transactionToEdit.description,
                type: transactionToEdit.type,
                userEmail: transactionToEdit.userEmail,
                amount: transactionToEdit.amount,
                dateTime: new Date(transactionToEdit.date).toISOString().split('T')[0], // Format for input type="date"
            });
            setSelectedOption(transactionToEdit.type);
        } else {
            // Reset formData when not in edit mode
            setFormData({
                name: '',
                description: '',
                type: '',
                userEmail: userEmail,
                amount: 0,
                dateTime: '',
            });
            setSelectedOption('...');
        }
    }, [edit, transactionToEdit, userEmail]);

    const handleSelect = (option) => {
        setSelectedOption(option);
        setFormData({
            ...formData,
            type: option,
        });
    };

    const handleCloseTab = () => {
        dispatch(toggleIsOpen());
        dispatch(setIsUpdate(false));
    };

    const { loading } = useSelector((state) => state.transactions);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.amount < 1000) {
            alert('Amount must be at least 1000 VND.');
            return;
        }
        if (edit && transactionToEdit) {
            console.log('Updating transaction:', { ...formData, id: transactionToEdit.id });
            const res = await dispatch(updateTransaction({ ...formData, id: transactionToEdit.id }));
            if (res.meta.requestStatus === 'fulfilled') {
                console.log('Transaction updated successfully:', res.payload);
                await dispatch(fetchTransactionsByEmail(userEmail));
                handleCloseTab();
            } else {
                console.log('Error updating transaction:', res.error.message);
            }
        } else {
            const res = await dispatch(createTransaction(formData));
            if (res.meta.requestStatus === 'fulfilled') {
                console.log('Transaction created successfully:', res.payload);
                await dispatch(fetchTransactionsByEmail(userEmail));
                handleCloseTab();
            } else {
                console.log('Error creating transaction:', res.error.message);
            }
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
                                <div className={cx('selected')} data-one="Income" data-two="Expense">
                                    {selectedOption}
                                    <div className={cx('arrow')}>
                                        <FontAwesomeIcon icon={faChevronDown} size="1x" />
                                    </div>
                                </div>
                                <div className={cx('options')}>
                                    {['Income', 'Expense'].map((option) => (
                                        <div key={option} title={option}>
                                            <input
                                                id={option}
                                                name="option"
                                                type="radio"
                                                checked={selectedOption === option}
                                                onChange={() => handleSelect(option)}
                                            />
                                            <label className={cx('option')} htmlFor={option} data-txt={option}>
                                                {/* {option} */}
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
                                placeholder="1,0000 VND"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="1000"
                                step="0.01"
                            />
                            {formData.amount < 1000 && formData.amount.length > 0 && (
                                <p className={cx('validation-message')}>Amount must be at least 1000 VND.</p>
                            )}
                        </div>
                    </div>
                    <button className={cx('submit-button')} type="submit">
                        {loading ? <Loading /> : edit ? 'Update transaction' : 'Add transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TabContent;
