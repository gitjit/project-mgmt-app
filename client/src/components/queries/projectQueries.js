import { gql } from "@apollo/client";

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      name
      description
      client {
        name
      }
    }
  }
`;

export { GET_PROJECTS };
