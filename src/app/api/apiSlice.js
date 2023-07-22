import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3600' }),
    tagTypes: ['Board', 'Task', 'Subtask', 'Column'],
    endpoints: builder => ({})
})