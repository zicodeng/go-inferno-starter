// User reducer takes user actions and dispatchs updated data to the state.

const userInitState = {
    name: "Anonymous",
    age: "21"
}

const UserReducer = (state = userInitState, action) => {
    switch(action.type) {
        case "SET_NAME":
            state = {
                ...state,
                name: action.payload
            }
            break;

        case "SET_AGE":
            state = {
                ...state,
                age: action.payload
            }
            break;
    }

    return state;
};

export default UserReducer;