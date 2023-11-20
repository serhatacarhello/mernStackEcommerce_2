import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

let baseUrl = `http://localhost:5000`;

export const register = createAsyncThunk("auth/register", async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${baseUrl}/register`, requestOptions);
    const jsonResponse = await response.json();

    if (jsonResponse?.token !== undefined) {
      localStorage.setItem("token", jsonResponse?.token);
    }

    return jsonResponse;
  } catch (error) {
    console.log("error.message", error.message);
    throw error;
  }
});

export const login = createAsyncThunk("auth/login", async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${baseUrl}/login`, requestOptions);
    const jsonResponse = await response.json();

    const token = localStorage.getItem("token");
    if (jsonResponse?.token !== undefined && token !== jsonResponse?.token) {
      localStorage.setItem("token", jsonResponse?.token);
    }

    return jsonResponse;
  } catch (error) {
    throw error;
  }
});

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email) => {
    console.log("🚀 ~ file: authSlice.jsx:84 ~ email:", email);
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      };
      const response = await fetch(`${baseUrl}/forgotPassword`, requestOptions);

      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (params) => {
    console.log("🚀 ~ file: authSlice.jsx:113 ~ params:", params);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: params.password }),
    };

    try {
      console.log(
        "🚀 ~ file: authSlice.jsx:126 ~ requestOptions:",
        requestOptions
      );
      const response = await fetch(
        `${baseUrl}/reset/${params.token}`,
        requestOptions
      );

      const jsonResponse = await response.json();

      return jsonResponse;
    } catch (error) {
      throw error;
    }
  }
);
export const profile = createAsyncThunk("auth/profile", async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${baseUrl}/me`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    throw error;
  }
});

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isPending(login, register, forgotPassword, resetPassword, profile),
        (state) => {
          state.loading = true;
          state.error = null;
          state.user = null;
          state.isLoggedIn = false;
        }
      )
      .addMatcher(
        isFulfilled(login, register, forgotPassword, resetPassword, profile),
        (state, action) => {
          if (action.payload?.user) {
            state.user = action.payload.user;
            state.isLoggedIn = true;
            state.error = null;
          }
          if (action.payload?.message) {
            state.error = action.payload.message;
            state.isLoggedIn = false;
            state.user = null;
          }
          state.loading = false;
        }
      )
      .addMatcher(
        isRejected(login, register, forgotPassword, resetPassword, profile),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
          state.isLoggedIn = false;
          state.user = null;
        }
      );
  },
});

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;

// Action creators are generated for each case reducer function
export const { logout } = authSlice.actions;

export default authSlice.reducer;
