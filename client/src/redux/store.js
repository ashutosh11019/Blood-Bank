import usersReducer from "./usersSlice"
import { configureStore } from "@reduxjs/toolkit"
import loadersSlice from "./loadersSlice"

const store = configureStore({
    reducer: {
        users: usersReducer,
        loaders: loadersSlice
    }
})

export default store