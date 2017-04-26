export default function notificationsReducer(state = [], action) {

    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return state.concat(action.notification);

        case 'REMOVE_NOTIFICATION':
            return state.filter(notification =>
                notification.id !== action.id
            );

        case 'CLEAR_NOTIFICATIONS':
            return []

        default:
            return state;
    }
}
