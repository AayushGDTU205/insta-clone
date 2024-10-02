const initialstate = [];

function feedReducer(state = { initialstate }, action) {
    switch (action.type) {
        case 'SET_FEED':
            return action.payload;
        case 'GET_FEED':
            return state;
        default:
            return state;
            
    }
}
export default feedReducer
