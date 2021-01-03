const initialState = null

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CHANGE':
            return action.data.message
        case 'CLEAR':
            return null
        default: return state
    }
}

export const setNotification = (message, secs) => {
    return dispatch => {
        dispatch ({
            type: 'CHANGE',
            data: {message}
          })
        setTimeout(() => dispatch ({
            type: 'CLEAR'
        }), secs*1000)
    }
}

export default reducer