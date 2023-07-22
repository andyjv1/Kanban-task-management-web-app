import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const subtasksAdapter = createEntityAdapter({})

const initialState = subtasksAdapter.getInitialState()

export const subtasksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSubtasks: builder.query({
            query: () => '/subtask',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedSubtasks = responseData.map(subtask => {
                    subtask.id = subtask._id
                    return subtask
                });
                return subtasksAdapter.setAll(initialState, loadedSubtasks)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Subtask', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Subtask', id }))
                    ]
                } else return [{ type: 'Subtask', id: 'LIST' }]
            }
        }),
        addNewSubtask: builder.mutation({
            query: initialSubtaskData => ({
                url: '/subtask',
                method: 'POST',
                body: {
                    ...initialSubtaskData,
                }
            }),
            invalidatesTags: (result, error, arg) => {
                return [
                    { type: 'Subtask', id: 'LIST' },
                    { type: 'Task', id: arg.taskId }
                ]
            }
        }),
        updateSubtask: builder.mutation({
            query: initialSubtaskData => ({
                url: '/subtask',
                method: 'PATCH',
                body: {
                    ...initialSubtaskData,
                }
            }),
            invalidatesTags: (result, error, arg) => {
                return [
                    { type: 'Subtask', id: 'LIST' },
                    { type: 'Task', id: arg.taskId }
                ]
            }
        }),
        deleteSubtask: builder.mutation({
            query: ({ id, taskId }) => ({
                url: `/subtask`,
                method: 'DELETE',
                body: { id, taskId }
            }),
            invalidatesTags: (result, error, arg) => {
                return [
                    { type: 'Task', id: arg.taskId }
                ]
            }
        }),
    }),
})
export const {
    useGetSubtasksQuery,
    useAddNewSubtaskMutation,
    useUpdateSubtaskMutation,
    useDeleteSubtaskMutation,
} = subtasksApiSlice

// returns the query result object
export const selectSubtasksResult = subtasksApiSlice.endpoints.getSubtasks.select()


// creates memoized selector
const selectSubtasksData = createSelector(
    selectSubtasksResult,
    subtasksResult => subtasksResult.data // normalized state object with ids & entities
)


//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllSubtasks,
    selectById: selectSubtaskById,
    selectIds: selectSubtaskIds
    // Pass in a selector that returns the subtasks slice of state
} = subtasksAdapter.getSelectors(state => selectSubtasksData(state) ?? initialState)