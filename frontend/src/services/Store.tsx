import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userapi } from "./Userapi";
import Userreducer from "./Userslice";

const rootReducer = combineReducers({
  [userapi.reducerPath]: userapi.reducer,
  user: Userreducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userapi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
