import { gql } from "@apollo/client";

const ADD_PROJECT = gql`
  mutation AddProject(
    $name: String!
    $description: String!
    $clientId: String!
  ) {
    addProject(name: $name, description: $description, clientId: $clientId) {
      id
      name
      description
      client {
        id
        name
      }
    }
  }
`;

export { ADD_PROJECT };
