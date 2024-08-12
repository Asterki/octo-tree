import { createSlice } from '@reduxjs/toolkit'

export const pagesSlice = createSlice({
	name: 'pages',
	initialState: {
		user: null,
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload
		},
	},
})

// Action creators are generated for each case reducer function
export const { setUser } = pagesSlice.actions

export default pagesSlice.reducer
