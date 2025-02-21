import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_BLOG_BY_ID } from "../graphQl/blog";
import RenderContent from "../components/renderContent";
import { ScaleLoader } from "react-spinners";

const BlogDetail = () => {
  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_BLOG_BY_ID, {
    variables: { id },
  });

  console.log("GraphQL Response:", data);

  if (loading) return <div className="flex justify-center items-center h-screen">
    <ScaleLoader color="#C0C2C9" aria-label="loading" />
  </div>;

  if (error) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;

  const blog = data?.blog;

  console.log("Blog Object:", blog);

  if (!blog?.content) {
    console.log("Blog content is missing or undefined.");
    return <div className="text-center text-gray-500">No content available.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl lg:text-4xl font-bold mb-4">{blog.title}</h1>

      {blog.location && (
        <p className="text-gray-500 mb-2">📍 {blog.location}</p>
      )}

      <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />

      <div className="flex items-center mb-6">
        {blog.author.image ? (
          <img
            src={blog.author.image}
            alt={blog.author.username}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full mr-3 bg-indigo-500 flex items-center justify-center text-white font-semibold">
            {blog.author.username?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-gray-600 font-semibold">{blog.author.username}</p>
          <p className="text-gray-500 text-sm">
            Published on: {new Date(blog.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <hr className="border-t border-gray-200 mb-6" />

      {/* Blog Content */}
      <RenderContent content={blog.content} />

      <hr className="border-t border-gray-200 mt-6" />
    </div>
  );
};  

export default BlogDetail;
