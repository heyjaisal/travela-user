import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { GET_BLOGS } from "../graphQl/blog-list";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

const BlogList = () => {
  const LIMIT = 10;
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, fetchMore } = useQuery(GET_BLOGS, {
    variables: { limit: LIMIT, skip: 0 },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.blogs) {
      setBlogs(data.blogs);
      setHasMore(data.blogs.length === LIMIT);
    }
  }, [data]);

  const fetchMoreBlogs = () => {
    fetchMore({
      variables: { skip: blogs.length, limit: LIMIT },
    }).then(({ data: newData }) => {
      setBlogs([...blogs, ...newData.blogs]);
      setHasMore(newData.blogs.length === LIMIT);
    });
  };

  if (loading && !blogs.length) return <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#C0C2C9" aria-label="loading" />
        </div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <InfiniteScroll
        dataLength={blogs.length}
        next={fetchMoreBlogs}
        hasMore={hasMore}
        loader={<div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#C0C2C9" aria-label="loading" />
        </div>}
        endMessage={<p className="text-center text-gray-500 mt-10">No more blogs</p>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <Link to={`/blog/${blog.id}`} key={blog.id} className="block group">
              <div className="bg-lightBg rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs font-semibold text-indigo-500 uppercase">{blog.category}</p>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{blog.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                  {blog.author.image ? (
                          <img src={blog.author.image} alt={blog.author.username} className="w-6 h-6 rounded-full mr-2" />
                        ) : (
                          <div className="w-6 h-6 rounded-full mr-2 bg-indigo-500 flex items-center justify-center text-white font-semibold">
                            {blog.author.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                    <span>{blog.author.username}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default BlogList;