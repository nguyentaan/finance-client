import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './tabContent.module.css';
import { toggleIsOpen } from '~/reducers/homeSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const TabContent = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.isOpen.isOpen);

    const handleCloseTab = () => {
        dispatch(toggleIsOpen());
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
                <div className={cx('item-container')}>
                    <div className={cx('list-item')}>
                        <div className={cx('item-content')}>
                            <h3>Type</h3>
                            <select className={cx('selection-type')}>
                                <option value="">Select...</option>
                                <option value="income">Income</option>
                                <option value="expenses">Expenses</option>
                            </select>
                        </div>
                        <div className={cx('item-content')}>
                            <h3>Name of transaction</h3>
                            <input
                                type="text"
                                className={cx('input')}
                                placeholder="Enter the name of the transaction"
                            />
                        </div>
                        <div className={cx('item-content')}>
                            <h3>Description (optional)</h3>
                            <input type="text" className={cx('input')} placeholder="Enter the description" />
                        </div>
                        <div className={cx('item-content')}>
                            <h3>Date</h3>
                            <input type="date" className={cx('input')} placeholder="" />
                        </div>
                        <div className={cx('item-content')}>
                            <h3>Amount</h3>
                            <input type="number" className={cx('input')} placeholder="0.00 VND" />
                        </div>
                    </div>
                    <button className={cx('submit-button')}>Add transaction</button>
                </div>
            </div>
        </div>
    );
};

export default TabContent;
