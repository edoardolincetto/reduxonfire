import React from 'react';

const NotificationsItem = ({ className, notification }) => {
    return (
        <div className={className}>
        <strong>{notification.title}</strong>
        <div>{notification.message}</div>
        </div>
    )
}

export default NotificationsItem;
