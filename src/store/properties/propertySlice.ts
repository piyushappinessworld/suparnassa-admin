
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import api from '@/lib/axios';
import type { Property } from '@/pages/Properties';

interface PropertyState {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  isLoading: false,
  error: null,
};

export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/properties');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

export const createProperty = createAsyncThunk(
  'properties/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create property');
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/update',
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update property');
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/properties/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete property');
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.properties.unshift(action.payload);
        toast.success('Property created successfully');
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        const index = state.properties.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        toast.success('Property updated successfully');
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter((p) => p.id !== action.payload);
        toast.success('Property deleted successfully');
      });
  },
});

export default propertySlice.reducer;
