import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/utils/axios"; // Import axios config

// Thunk: Lấy danh sách thành phố
export const fetchCities = createAsyncThunk(
  "cities/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/locations/cities/list");
      console.log("Cities API Response:", response.data); // Log dữ liệu từ API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Thêm thành phố mới
export const addCity = createAsyncThunk(
  "cities/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/locations/cities/add", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Sửa thành phố
export const updateCity = createAsyncThunk(
  "cities/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/locations/cities/update/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Xóa thành phố
export const deleteCity = createAsyncThunk(
  "cities/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/locations/cities/delete/${id}`);
      return id; // Trả về ID của thành phố đã xóa
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const citiesSlice = createSlice({
  name: "cities",
  initialState: {
    cities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        console.log("Fetched cities successfully:", action.payload);
        state.loading = false;
        state.cities = action.payload.cities; // Đảm bảo lấy đúng key 'cities'
      })
      .addCase(fetchCities.rejected, (state, action) => {
        console.error("Error fetching cities:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.cities.push(action.payload);
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        const index = state.cities.findIndex((city) => city.id === action.payload.id);
        if (index !== -1) state.cities[index] = action.payload;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.cities = state.cities.filter((city) => city.id !== action.payload);
      });
  },
});

export default citiesSlice.reducer;
