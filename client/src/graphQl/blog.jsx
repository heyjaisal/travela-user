import { gql } from "@apollo/client";

export const GET_BLOG_BY_ID = gql`
  query GetBlogById($id: ID!) {
    blog(id: $id) {
      id
      title
      thumbnail
      date
      content
      location
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
