import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const boardsAdapter = createEntityAdapter({})

const initialState = boardsAdapter.getInitialState()

export const boardsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBoards: builder.query({
            query: () => '/board',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedBoards = responseData.map(board => {
                    board.id = board._id
                    return board
                });
                return boardsAdapter.setAll(initialState, loadedBoards)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Board', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Board', id }))
                    ]
                } else return [{ type: 'Board', id: 'LIST' }]
            }
        }),
        addNewBoard: builder.mutation({
            query: initialBoardData => ({
                url: '/board',
                method: 'POST',
                body: {
                    ...initialBoardData,
                }
            }),
            invalidatesTags: [
                { type: 'Board', id: "LIST" }
            ]
        }),
        updateBoard: builder.mutation({
            query: initialBoardData => ({
                url: '/board',
                method: 'PATCH',
                body: {
                    ...initialBoardData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Board', id: arg.id }
            ]
        }),
        deleteBoard: builder.mutation({
            query: ({ id }) => ({
                url: `/board`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Board', id: arg.id }
            ]
        }),
    }),
})
export const {
    useGetBoardsQuery,
    useAddNewBoardMutation,
    useUpdateBoardMutation,
    useDeleteBoardMutation,
} = boardsApiSlice

// returns the query result object
export const selectBoardsResult = boardsApiSlice.endpoints.getBoards.select()


// creates memoized selector
const selectBoardsData = createSelector(
    selectBoardsResult,
    boardsResult => boardsResult.data // normalized state object with ids & entities
)


//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllBoards,
    selectById: selectBoardById,
    selectIds: selectBoardIds
    // Pass in a selector that returns the boards slice of state
} = boardsAdapter.getSelectors(state => selectBoardsData(state) ?? initialState)