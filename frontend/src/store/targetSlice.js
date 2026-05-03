import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action to fetch targets from your Express API
export const fetchTargets = createAsyncThunk(
  "targets/fetch",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:4000/api/targets/${userId}`,
    );
    return response.data.targets;
  },
);

const targetSlice = createSlice({
  name: "targets",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // We can use this to update the list instantly when a socket message hits
    updateTargetStatus: (state, action) => {
      const { id, status } = action.payload;
      const existing = state.items.find((t) => t.id === id);
      if (existing) existing.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTargets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTargets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTargets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateTargetStatus } = targetSlice.actions;
export default targetSlice.reducer;
