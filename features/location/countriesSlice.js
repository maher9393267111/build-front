import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/utils/axios"; // Import axios config

// Thunk: Lấy danh sách quốc gia
export const fetchCountries = createAsyncThunk(
  "countries/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/locations/countries/list");
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Thêm quốc gia mới
export const addCountry = createAsyncThunk(
  'countries/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/locations/countries/add', data);
      return response.data.country;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Sửa quốc gia
export const updateCountry = createAsyncThunk(
  'countries/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/locations/countries/update/${id}`, data);
      return response.data.country;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk: Xóa quốc gia
export const deleteCountry = createAsyncThunk(
  'countries/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/locations/countries/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const countriesSlice = createSlice({
  name: "countries",
  initialState: {
    countries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
      .addCase(fetchCountries.pending, (state) => {
        console.log("Fetching countries...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        console.log("Fetched countries successfully:", action.payload);
        state.loading = false;
        state.countries = action.payload.countries; // Chỉ định đúng key
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        console.error("Error fetching countries:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCountry.fulfilled, (state, action) => {
        state.countries.push(action.payload);
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        const index = state.countries.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.countries[index] = action.payload;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.countries = state.countries.filter((c) => c.id !== action.payload);
      });
  },
});

export default countriesSlice.reducer;
