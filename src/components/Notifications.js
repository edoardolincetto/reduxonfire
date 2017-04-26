import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotificationsItem from './Notifications.Item';

class Notifications extends Component {
    renderNotificationsItem() {
        return this.props.notifications.map((notification, index) => {
            return (
                <NotificationsItem
                    key={'notification-' + index}
                    className={this.props.notificationsItemClassName}
                    notification={notification}/>
            )
        });
    }

    render() {
        const notificationsWrapperStyle = {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100000,
            boxSizing: 'border-box',
            pointerEvents: 'none'
        }

        return (
            <div style={notificationsWrapperStyle}>
                <div className={this.props.notificationsClassName}>
                    {this.renderNotificationsItem()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        notifications: state.notificationsReducer
    }
}

export default connect(mapStateToProps)(Notifications);
