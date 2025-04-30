import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/utils/axios"; // Import axios config

// Thunk: Lấy danh sách quận/huyện
export const fetchDistricts = createAsyncThunk(
  "districts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/locations/districts/list");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Thêm quận/huyện mới
export const addDistrict = createAsyncThunk(
  "districts/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/locations/districts/add", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Sửa quận/huyện
export const updateDistrict = createAsyncThunk(
  "districts/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/locations/districts/update/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Xóa quận/huyện
export const deleteDistrict = createAsyncThunk(
  "districts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/locations/districts/delete/${id}`);
      return id; // Trả về ID của quận/huyện đã xóa
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const districtsSlice = createSlice({
  name: "districts",
  initialState: {
    districts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        console.log("Fetched districts:", action.payload); // Log dữ liệu API
        state.loading = false;
        state.districts = action.payload.districts; // Đảm bảo key 'districts' đúng
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDistrict.fulfilled, (state, action) => {
        state.districts.push(action.payload);
      })
      .addCase(updateDistrict.fulfilled, (state, action) => {
        const index = state.districts.findIndex((district) => district.id === action.payload.id);
        if (index !== -1) state.districts[index] = action.payload;
      })
      .addCase(deleteDistrict.fulfilled, (state, action) => {
        state.districts = state.districts.filter((district) => district.id !== action.payload);
      });
  },
});

export default districtsSlice.reducer;
