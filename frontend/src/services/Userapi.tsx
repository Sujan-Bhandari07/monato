import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const userapi = createApi({
  reducerPath: "userapi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
  }),
  // tagTypes: ["User", "own"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "api/v1/user/sign-up",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["User"],
    }),


  login:builder.mutation({
    query:(data)=>({
      url: "api/v1/user/sign-in",
        method: "POST",
        body: data,
    })
  }),

  sendresetotp:builder.mutation({
    query:(data)=>({
      url: "api/v1/user/sendresetotp",
      method: "POST",
      body: data,
    })
  }),

  checkresetotp:builder.mutation({
    query:(data)=>({
      url: "api/v1/user/checkresetotp",
      method: "POST",
      body: data,
    })
  }),


  newpass:builder.mutation({
    query:(data)=>({
      url: "api/v1/user/newpassword",
      method: "POST",
      body: data,
    })
  }),





    // another api
  }),
});

export const {

  useRegisterMutation,useLoginMutation,useNewpassMutation,useSendresetotpMutation,useCheckresetotpMutation

} = userapi;
