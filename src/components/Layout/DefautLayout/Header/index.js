import React from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from '~/reducers/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faAdd } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css'; // Import your CSS file
import classNames from 'classnames/bind';
import { toggleIsOpen } from '~/reducers/homeSlice';
import CurrencySelector from '~/components/currencySelector/CurrencySelector';

const cx = classNames.bind(styles);

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSignOut = () => {
        dispatch(signOut());
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleOpen = () => {
        dispatch(toggleIsOpen());
    };

    return (
        <header className={cx('header-container')}>
            <h2>My Money</h2>

            <div className={cx('group-actions')}>
                <div className={cx('currency')}>
                    <CurrencySelector />
                </div>
                <button className={cx('button-action')} onClick={handleOpen} data-testid="add-button">
                    <p className={cx('icon-action')}>
                        <FontAwesomeIcon icon={faAdd} size="1x" />
                    </p>
                    <p className={cx('title-button')}>Add transaction</p>
                </button>
                <button onClick={handleSignOut} data-testid="signout-button">
                    <FontAwesomeIcon icon={faRightFromBracket} size="2x" />
                </button>
            </div>
        </header>
    );
}

export default Header;
