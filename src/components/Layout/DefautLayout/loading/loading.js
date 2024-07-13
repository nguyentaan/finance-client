import React from 'react';
import styles from './loading.module.css'; 
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
const Loading = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('circle')}></div>
            <div className={cx('circle')}></div>
            <div className={cx('circle')}></div>
            <div className={cx('shadow')}></div>
            <div className={cx('shadow')}></div>
            <div className={cx('shadow')}></div>
        </div>
    );
};

export default Loading;
