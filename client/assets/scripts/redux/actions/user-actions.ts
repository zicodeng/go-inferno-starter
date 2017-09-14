// This file exports functions that can manipulate user's state.
// user actions will be dispatched to user reducer.

export function setName(name = "Anonymous") {
    return {
        type: "SET_NAME",
        payload: name
    }
}

export function setAge(age = 21) {
    return {
        type: "SET_AGE",
        payload: age
    }
}