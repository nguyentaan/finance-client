import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '~/reducers/currencySlice';
import styles from './CurrencySelector.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const CurrencySelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const selectedCurrency = useSelector((state) => state.currency.selectedCurrency);

    // List of available currencies
    const currencies = ['VND', 'USD', 'EUR'];

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleCurrencyChange = (currency) => {
        dispatch(setCurrency(currency));
        setIsOpen(false);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filter out the selected currency from the options list
    const filteredCurrencies = currencies.filter((currency) => currency !== selectedCurrency);

    return (
        <div className={cx('selector-wrapper')} ref={dropdownRef}>
            <div className={cx('selector', { open: isOpen })} onClick={handleToggle}>
                {selectedCurrency}
            </div>
            {isOpen && (
                <div className={cx('selector-items')}>
                    {filteredCurrencies.map((option) => (
                        <div key={option} className={cx('selector-item')} onClick={() => handleCurrencyChange(option)}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
