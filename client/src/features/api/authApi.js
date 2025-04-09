import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
const url=import.meta.env.VITE_BASE_URL

const USER_API = `${url}/api/v1/user/`

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        prepareHeaders: (headers) => {
          const token = localStorage.getItem("token");
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
        },
      }),
      
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url:"register",
                method:"POST",
                body:inputData
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url:"login",
                method:"POST",
                body:inputData
            }),
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                  const result = await queryFulfilled;
                  const token = result.data.token;
                  if (token) {
                    localStorage.setItem("token", token); // <-- Add this
                  }
                  dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                  console.log(error);
                }
              }
              
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url:"logout",
                method:"GET"
            }),
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                  await queryFulfilled;
                  localStorage.removeItem("token"); // <-- Clear token
                  dispatch(userLoggedOut());
                } catch (error) {
                  console.log(error);
                }
              }
              
        }),
        loadUser: builder.query({
            query: () => ({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url:"profile/update",
                method:"PUT",
                body:formData,
                credentials:"include"
            })
        })
    })
});
export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation
} = authApi;
