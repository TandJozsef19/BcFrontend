import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";
// Aszinkron thunk a felhasználók lekérésére
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (
    {
      searchTerm = "",
      searchField = "name",
      sortOption = "default",
      page = 1,
      limit = 6,
    },
    { rejectWithValue }
  ) => {
    const params = {
      searchTerm,
      searchField,
      sortOption,
      page,
      limit,
    };
    try {
      console.log(params);
      const response = await axios.get(`${BASE_URL}/api/users/getallusers`, {
        params,
      });
      console.log(response.data.totalPages);
      return {
        users: response.data.users,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// deleteUser thunk definiálása
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/users/deleteUser/${userId}`
      );
      dispatch(removeUserFromList(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const removeUserFromList = (userId) => (dispatch, getState) => {
  const { userList } = getState().adminUser;
  dispatch(setUserList(userList.filter((user) => user._id !== userId)));
};

// Aszinkron thunk a jelentkezők teljes számának lekérésére
export const fetchTotalApplicationsCount = createAsyncThunk(
  "admin/fetchTotalApplicationsCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/applications/totalApplicationsCount`
      );
      return response.data.data.applicationsCount;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// approveApplication thunk definiálása
export const approveApplication = createAsyncThunk(
  "admin/approveApplication",
  async ({ applicationId, decision }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/applications/approve/${applicationId}`,
        { decision }
      );
      return { applicationId, decision: response.data.decision };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSpeakerApplications = createAsyncThunk(
  "admin/fetchSpeakerApplications",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const params = {
        page,
        limit,
      };
      const response = await axios.get(
        `${BASE_URL}/api/applications/speakers`,
        { params }
      );
      console.log(response.data.speakerApplications);
      return {
        speakerApplications: response.data.speakerApplications,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  userList: [],
  isLoading: false,
  fetchError: null,
  speakerApplications: [],
};

const userAdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
  },
  extraReducers: {
    [fetchUsers.pending]: (state) => {
      state.isLoading = true;
      state.fetchError = null;
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.userList = action.payload.users;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.isLoading = false;
    },
    [fetchUsers.rejected]: (state, action) => {
      state.isLoading = false;
      state.fetchError = action.payload || "Hiba a felhasználók lekérésénél";
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.userList = state.userList.filter(
        (user) => user._id !== action.meta.arg
      );
    },
    [fetchTotalApplicationsCount.pending]: (state) => {
      state.isLoading = true;
      state.fetchError = null;
    },
    [fetchTotalApplicationsCount.fulfilled]: (state, action) => {
      state.totalApplicationsCount = action.payload;
      state.isLoading = false;
    },
    [fetchTotalApplicationsCount.rejected]: (state, action) => {
      state.isLoading = false;
      state.fetchError =
        action.payload || "Hiba a jelentkezők számának lekérésénél";
    },
    [approveApplication.pending]: (state) => {
      state.isLoading = true;
      state.fetchError = null;
    },
    [approveApplication.fulfilled]: (state, action) => {
      const { applicationId, decision } = action.payload;
      state.isLoading = false;
      const index = state.userList.findIndex(
        (app) => app._id === applicationId
      );
      if (index !== -1) {
        state.userList[index].approvalStatus = decision;
      }
    },
    [approveApplication.rejected]: (state, action) => {
      state.isLoading = false;
      state.fetchError =
        action.payload || "Hiba a jelentkezés jóváhagyása során";
    },
    [fetchSpeakerApplications.pending]: (state) => {
      state.isLoading = true;
      state.fetchError = null;
    },
    [fetchSpeakerApplications.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.speakerApplications = action.payload.speakerApplications;
      state.totalPages = action.payload.totalPages;
      state.totalItems = action.payload.totalItems;
      state.currentPage = action.payload.currentPage;
    },
    [fetchSpeakerApplications.rejected]: (state, action) => {
      state.isLoading = false;
      state.fetchError =
        action.payload || "Hiba a 'speaker' jelentkezések lekérésénél";
    },
  },
});

export const { setUserList } = userAdminSlice.actions;
export default userAdminSlice.reducer;
