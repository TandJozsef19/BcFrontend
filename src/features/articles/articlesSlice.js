import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://bcbackend-pn9e.onrender.com";
// Aszinkron thunk a hír létrehozására
export const createArticle = createAsyncThunk(
  "article/createArticle",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/articles`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// deleteArticle thunk definiálása
export const deleteArticle = createAsyncThunk(
  "admin/deleteArticle",
  async (articleId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/articles/deleteArticle/${articleId}`
      );
      dispatch(removeArticleFromList(articleId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const removeArticleFromList = (articleId) => (dispatch, getState) => {
  const { articleItems } = getState().articles;
  dispatch(
    setArticleList(articleItems.filter((article) => article._id !== articleId))
  );
};

export const fetchArticle = createAsyncThunk(
  "article/fetchArticle",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/articles/getallarticle`
      );
      return {
        articleItems: response.data.data.articles,
        articleCount: response.data.data.articles.length,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchArticleFiltered = createAsyncThunk(
  "article/fetchArticleFiltered",
  async (
    { searchTerm, topic, subTopic, sortOption, page = 1, limit = 6 },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        searchTerm,
        topic,
        subTopic,
        sortOption,
        page,
        limit,
      };

      const response = await axios.get(
        `${BASE_URL}/api/articles/getallarticlefiltered`,
        { params }
      );
      return {
        articleItemsFiltered: response.data.articles,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const articleSlice = createSlice({
  name: "article",
  initialState: {
    articleItems: [],
    articleItemsFiltered: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setArticleList: (state, action) => {
      state.articleItemsFiltered = action.payload;
      state.articleItems = action.payload;
    },
  },
  extraReducers: {
    [createArticle.pending]: (state) => {
      state.isLoading = true;
    },
    [createArticle.fulfilled]: (state, action) => {
      state.isLoading = false;
      if (action.payload && Array.isArray(state.articleItems)) {
        state.articleItems.push(action.payload);
      }
    },
    [createArticle.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [fetchArticle.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchArticle.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.articleItems = action.payload.articleItems;
      state.articleCount = action.payload.articleCount;
    },
    [fetchArticle.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [fetchArticleFiltered.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchArticleFiltered.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.articleItemsFiltered = action.payload.articleItemsFiltered;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
    },
    [fetchArticleFiltered.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteArticle.fulfilled]: (state, action) => {
      state.articleItems = state.articleItems.filter(
        (article) => article._id !== action.meta.arg
      );
    },
  },
});

export const { setArticleList } = articleSlice.actions;
export default articleSlice.reducer;
