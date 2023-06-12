// Posts.js
import React, { useEffect, useState } from "react";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./features/api/apiSlice.js";

const App = () => {
  const { data: posts, isFetching, isError, error } = useGetPostsQuery();
  const [createPost, createPostResult] = useCreatePostMutation();
  const [updatePost, updatePostResult] = useUpdatePostMutation();
  const [deletePost, deletePostResult] = useDeletePostMutation();
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  const handleCreatePost = () => {
    createPost({ ...newPost });
    setNewPost({ title: "", body: "" });
  };

  const handleUpdatePost = (id, updatedPost) => {
    updatePost({ id, ...updatedPost });
  };

  const handleDeletePost = (id) => {
    deletePost(id);
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const handleDisable = () => !(newPost.title && newPost.body);

  return (
    <div className="container">
      <h3>Create a new post</h3>
      <div className="row g-3">
        <div className="col-md-4">
          <label htmlFor="validationDefault01" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            id="validationDefault01"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="validationDefault02" className="form-label">
            Body
          </label>
          <textarea
            type="text"
            placeholder="Body"
            className="form-control"
            id="validationDefault02"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
        </div>

        <div className="col-12">
          <button
            className="btn btn-primary"
            onClick={handleCreatePost}
            disabled={handleDisable()}
          >
            Create
          </button>
        </div>
      </div>

      <h2>Posts</h2>
      {posts &&
        posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button
              className="btn btn-primary"
              onClick={() =>
                handleUpdatePost(post.id, {
                  title: "Updated Title",
                  body: "Updated Body",
                })
              }
            >
              Update
            </button>
            <button
              className="btn btn-danger mx-2"
              onClick={() => handleDeletePost(post.id)}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
};

export default App;
