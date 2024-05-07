import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import userAdminReducer from "./features/user/userAdmin";
import articlesReducer from "./features/articles/articlesSlice";
import confReducer from "./features/conferences/confSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    adminUser: userAdminReducer,
    articles: articlesReducer,
    conference: confReducer,
  },
});
