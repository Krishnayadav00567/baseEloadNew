import _ from 'lodash';

import { SET_HEADER, ADD_TO_NOTIFICATION, REMOVE_FROM_NOTIFICATION ,CLEAR_ALL_NOTIFICATION} from '../util/ActionConstants';

export default function (state = {}, action) {
    switch (action.type) {
        case SET_HEADER:
            return { ...state, name: action.payload&&action.payload.name?action.payload.name:''};
        case ADD_TO_NOTIFICATION: 
            const notificationItems = state.notificationItems ? state.notificationItems : [];
            notificationItems.push(action.payload);
            return { ...state, notificationItems };
        case REMOVE_FROM_NOTIFICATION: 
            const notificationItem = state.notificationItems ? state.notificationItems : [];
            const removed = _.filter(notificationItem, (o) => o.id != action.payload);
            return { ...state, notificationItems: removed };
        case CLEAR_ALL_NOTIFICATION: 
            return { ...state, notificationItems: action.payload };    

        default:
            return state;
    }
}
