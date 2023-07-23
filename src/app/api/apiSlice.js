import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'https://kanban-task-management-web-app-backend.onrender.com' }),
    tagTypes: ['Board', 'Task', 'Subtask', 'Column'],
    endpoints: builder => ({})
})