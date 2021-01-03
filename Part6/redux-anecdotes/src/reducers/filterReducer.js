const initialState = ''

const reducer = (state = initialState, action) => {
    console.log(state)
    console.log(action)
    switch(action.type) {
        case 'FILTER':
            return action.filter
        default: return state
    }
}

export const changeFilter = (filter) => {
    return {
        type: 'FILTER',
        filter
    }
}

export default reducer