// api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "posts",
      providesTags: ["Posts"],
    }),
    getPostById: builder.query({
      query: (id) => `posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...updatedPost }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: updatedPost,
      }),
      // invalidatesTags: (result, error, { id }) => [
      //   { type: "Posts" },
      //   { type: "Posts", id },
      // ],
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getPosts", undefined, (posts) => {
            const prevPosts = posts.filter((post) => {
              return post.id !== id;
            });
            return [...prevPosts, { id, ...patch }];
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();

          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
      },
      // onMutate: async ({ postId, ...updatedPost }) => {
      //   // Get the current state from the cache
      //   const previousState = apiSlice.endpoints.getPosts.select();
      //   console.log("previousState:", previousState);

      //   // Optimistically update the cache
      //   apiSlice.endpoints.getPosts.updateQuery((data) => {
      //     const updatedPosts = data.posts.map((post) =>
      //       post.id === postId ? updatedPost : post
      //     );
      //     console.log("updatedPosts:", updatedPosts);
      //     return {
      //       ...data,
      //       posts: updatedPosts,
      //     };
      //   });
      //   console.log("previousState:", previousState);
      //   // Return the previous state to rollback in case of an error
      //   return { previousState };
      // },
      // onError: (error, variables, context) => {
      //   if (context?.previousState) {
      //     // Rollback to the previous state in case of an error
      //     apiSlice.endpoints.getPosts.updateQuery(context.previousState);
      //   }
      // },
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: (result, error, id) => [
      //   { type: "Posts" },
      //   { type: "Posts", id },
      // ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        console.log("id:", id);
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getPosts", undefined, (posts) => {
            return posts.filter((post) => {
              return post.id !== id;
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();

          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = apiSlice;
