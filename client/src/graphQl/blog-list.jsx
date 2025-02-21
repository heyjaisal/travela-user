import { gql } from "@apollo/client";

export const GET_BLOGS = gql`
  query GetBlogs($limit: Int, $skip: Int, $sortBy: String) {
    blogs(limit: $limit, skip: $skip, sortBy: $sortBy) {
      id
      title
      thumbnail
      date 
      author {
        username
        image
      }
      likes {
        id
      }
    }
  }
`;
