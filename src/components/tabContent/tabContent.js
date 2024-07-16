import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './tabContent.module.css';
import { toggleIsOpen } from '~/reducers/homeSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const TabContent = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.isOpen.isOpen);
    const [selectedOption, setSelectedOption] = React.useState('...');

    const handleSelect = (option) => {
        setSelectedOption(option);
    };

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
