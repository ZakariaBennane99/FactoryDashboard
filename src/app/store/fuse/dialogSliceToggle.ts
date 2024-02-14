// dialogSliceToggle.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DialogToggle { 
  open: boolean;
  userId: string | null;
}

const initialState: DialogToggle = {
  open: false,
  userId: null,
};

export const dialogToggle = createSlice({
  name: 'userDialog',
  initialState,
  reducers: {
    openToggleDialog: (state, action: PayloadAction<string>) => {
      state.open = true;
      state.userId = action.payload;
    },
    closeToggleDialog: (state) => {
      state.open = false;
      state.userId = null;
    },
  },
});

export const { openToggleDialog, closeToggleDialog } = dialogToggle.actions;

export default dialogToggle.reducer;
