import { configureStore } from "@reduxjs/toolkit"
import filterSlice from "./filter/filterSlice"
import jobSlice from "./job/jobSlice"
import authSlice from "./auth/authSlice"
import countriesSlice from "./location/countriesSlice"
import citiesSlice from "./location/citiesSlice"
import districtsSlice from "./location/districtsSlice"
import profileSlice from "./profile/profileSlice"
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER, PURGE, persistCombineReducers } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    stateReconciler: autoMergeLevel2,
    blacklist: []
};

// interface IRootState {
//     home: IHomeState;
//     demo: IDemoState;
// }


const persistedReducer = persistCombineReducers(persistConfig, {
    profile: profileSlice,
    auth: authSlice,
    job: jobSlice,
    filter: filterSlice,
    countries: countriesSlice,
    cities: citiesSlice,
    districts: districtsSlice
});

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
              // Ignore these action types
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
              // Ignore these field paths in all actions
            //   ignoredActionPaths: ['socket.socket', 'register'],
              // Ignore these paths in the state
            //   ignoredPaths: ['socket.socket'],
            },
        }),
        // getDefaultMiddleware({
        //     serializableCheck: {
        //         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        //     },
        // })
    // middleware: [thunk],
});

// export const store = configureStore({
//     reducer: {
//         profile: profileSlice,
//         auth: authSlice,
//         job: jobSlice,
//         filter: filterSlice,
//         countries: countriesSlice,
//         cities: citiesSlice,
//         districts: districtsSlice,
//     },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
// })