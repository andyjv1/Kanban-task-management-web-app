import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const tasksAdapter = createEntityAdapter({})

const initialState = tasksAdapter.getInitialState()

export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTasks: builder.query({
            query: () => '/task',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedTasks = responseData.map(task => {
                    task.id = task._id
                    return task
                });
                return tasksAdapter.setAll(initialState, loadedTasks)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Task', id }))
                    ]
                } else return [{ type: 'Task', id: 'LIST' }]
            }
        }),
        addNewTask: builder.mutation({
            query: initialTaskData => ({
                url: '/task',
                method: 'POST',
                body: {
                    ...initialTaskData,
                }
            }),
            invalidatesTags: (result, error, arg) => {
                return [
                    { type: 'Task', id: 'LIST' },
                    { type: 'Column', id: arg.columnId }
                ]
            }
        }),
        updateTask: builder.mutation({
            query: initialTaskData => ({
                url: '/task',
                method: 'PATCH',
                body: {
                    ...initialTaskData,
                }
            }),
            invalidatesTags: (result, error, arg) => {
                return [
                   { type: 'Task', id: 'LIST' },
                    { type: 'Column', id: arg.columnId }                ]
            }
        }),
        deleteTask: builder.mutation({
            query: ({ id, columnId }) => ({
                url: `/task`,
                method: 'DELETE',
                body: { id, columnId }
            }),
            invalidatesTags: (result, error, arg) => {
                return [
                    { type: 'Column', id: arg.columnId }
                ]
            }
        }),
    }),
})
export const {
    useGetTasksQuery,
    useAddNewTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = tasksApiSlice

export const selectTasksResult = tasksApiSlice.endpoints.getTasks.select()


const selectTasksData = createSelector(
    selectTasksResult,
    tasksResult => tasksResult.data 
)


export const {
    selectAll: selectAllTasks,
    selectById: selectTaskById,
    selectIds: selectTaskIds
} = tasksAdapter.getSelectors(state => selectTasksData(state) ?? initialState)