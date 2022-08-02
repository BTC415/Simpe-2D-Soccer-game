import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice'
import counterReducer from './counterSlice'

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		auth: authReducer,
	},
})
