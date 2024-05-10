import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";
//REGISZTRACIO
export const register = createAsyncThunk(
  "user/register",
  async ({ name, email, password, confirmPassword, phoneNumber }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/signup`, {
        name,
        email,
        password,
        confirmPassword,
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
// BEJELENTKEZES
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        email,
        password,
      });
      return {
        user: response.data.user,
        role: response.data.user.role,
        status: response.data.status,
        token: response.data.token,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Jelszó frissítése
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ userId, newPassword }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/users/updatePassword`,
        {
          userId,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Telefonoszám frissítése
export const updatePhoneNumber = createAsyncThunk(
  "user/updatePhoneNumber",
  async ({ userId, phoneNumber }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/users/updatePhoneNumber`,
        {
          userId,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${thunkAPI.getState().user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const response = await axios.get(`${BASE_URL}/api/users/fetchUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// PIN Kód Megerősítése
export const confirmRegistration = createAsyncThunk(
  "user/confirmRegistration",
  async ({ email, pinCode }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/confirmRegistration`,
        { email, pinCode }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const requestNewPin = createAsyncThunk(
  "user/requestNewPin",
  async ({ email }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/requestNewPin`, {
        email,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const themes = {
  emerald: "emerald",
  dim: "dim",
};

const getUserFromLocalStorage = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  } else {
    return null;
  }
};

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token") || null;
};

const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem("theme") || themes.emerald;
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};

const initialState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
  token: getTokenFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const { emerald, dim } = themes;
      state.theme = state.theme === dim ? emerald : dim;
      document.documentElement.setAttribute("data-theme", state.theme);
      localStorage.setItem("theme", state.theme);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.user = action.payload.user;
      state.status = action.payload.status;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    [login.rejected]: (state) => {
      state.user = null;
      state.status = "failed";
    },
    [register.fulfilled]: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    [register.rejected]: (state, action) => {
      state.registrationError = action.error.message;
    },
    [fetchCurrentUser.fulfilled]: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    [updatePhoneNumber.fulfilled]: (state, action) => {
      state.user.phoneNumber = action.payload.data.user.phoneNumber;
    },
    [updatePhoneNumber.rejected]: (state, action) => {
      console.error("Telefonszám frissítése sikertelen:", action.error.message);
    },
  },
});

export const { toggleTheme, setUser, logout } = userSlice.actions;

export default userSlice.reducer;
