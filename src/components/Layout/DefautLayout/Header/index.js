import React from 'react';
import { useDispatch } from 'react-redux';
// import { signOut } from '~/actions/authAction';
import { signOut } from '~/reducers/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faAdd } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css'; // Import your CSS file
import classNames from 'classnames/bind';
import { toggleIsOpen } from '~/reducers/homeSlice';

const cx = classNames.bind(styles);

function Header() {
    // const [user, setUser] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const isOpen = useSelector((state) => state.isOpen.isOpen);
    // const user1 = useSelector((state) => state.auth);
    // console.log('IsOpen:', isOpen);
    // console.log('User:', user1);

    // useEffect(() => {
    //     const userData = localStorage.getItem('user');
    //     // if (userData) {
    //     //     setUser(JSON.parse(userData));
    //     // }
    // }, []);

    const handleSignOut = () => {
        dispatch(signOut());
        localStorage.removeItem('user');
        // setUser(null);
        navigate('/');
    };

    const handleOpen = () => {
        dispatch(toggleIsOpen());
    };

    return (
        <header className={cx('header-container')}>
            <h2>My Money</h2>

            <div className={cx('group-actions')}>
                <button className={cx('button-action')} onClick={handleOpen} data-testid="add-button">
                    <p className={cx('icon-action')}>
                        <FontAwesomeIcon icon={faAdd} size="1x" />
                    </p>
                    <p>Add transaction</p>
                </button>
                <button onClick={handleSignOut} data-testid="signout-button">
                    <FontAwesomeIcon icon={faRightFromBracket} size="2x" />
                </button>
            </div>
            {/* <span>Not signed in</span> */}
        </header>
    );
}

export default Header;
