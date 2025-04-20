import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isEmailVerified: false
};

const isEmailVerifiedSlice = createSlice({
  name: 'isEmailVerified',
  initialState,
  reducers: {
    setIsEmailVerified: (state, action) => {
      state.isEmailVerified = action.payload;
    }
  }
});

export const { setIsEmailVerified } = isEmailVerifiedSlice.actions;
export default isEmailVerifiedSlice.reducer;