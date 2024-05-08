import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";
// Aszinkron thunk a konferencia létrehozásához
export const createConference = createAsyncThunk(
  "conference/createConference",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/conferences/createConference`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Szerverhiba történt"
      );
    }
  }
);

export const fetchConferenceFiltered = createAsyncThunk(
  "conferences/fetchConfFiltered",
  async (
    { country, topic, subTopic, date, title, city, page = 1, limit = 6 },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        country,
        topic,
        subTopic,
        date,
        title,
        city,
        page,
        limit,
      };

      const response = await axios.get(
        `${BASE_URL}/api/conferences/getallconferencefiltered`,
        { params }
      );
      return {
        confItemsFiltered: response.data.conferences,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchConference = createAsyncThunk(
  "conferences/fetchConf",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/conferences/getallconference`
      );
      return {
        confItems: response.data.data.conference,
        confCount: response.data.data.conference.length,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteConf = createAsyncThunk(
  "admin/deleteConf",
  async (conferenceId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/conferences/deleteConference/${conferenceId}`
      );
      dispatch(removeConferenceFromList(conferenceId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const removeConferenceFromList = (conferenceId) => (dispatch, getState) => {
  const { confItems } = getState().conference;
  dispatch(
    setConfList(
      confItems.filter((conference) => conference._id !== conferenceId)
    )
  );
};

export const confSlice = createSlice({
  name: "conference",
  initialState: {
    loading: false,
    error: null,
    conferences: [],
    confItemsFiltered: [],
    confItems: [],
    confCountFiltered: 0,
    confCount: 0,
  },
  reducers: {
    setConfList: (state, action) => {
      state.confItemsFiltered = action.payload;
      state.confItems = action.payload;
    },
  },
  extraReducers: {
    [createConference.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [createConference.fulfilled]: (state, action) => {
      state.loading = false;
      state.conferences.push(action.payload);
    },
    [createConference.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchConferenceFiltered.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchConferenceFiltered.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.confItemsFiltered = action.payload.confItemsFiltered;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
    },
    [fetchConferenceFiltered.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [fetchConference.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchConference.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.confItems = action.payload.confItems;
      state.confCount = action.payload.confCount;
    },
    [fetchConference.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setConfList } = confSlice.actions;
export default confSlice.reducer;
