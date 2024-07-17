import { gql } from "@apollo/client";

const DELETE_CLIENT = gql`
  mutation DeleteClient {
    deleteClient(id: $id) {
      id
      name
      email
      phone
    }
  }
`;

const ADD_CLIENT = gql`
  mutation AddClient($name: String!, $email: String!, $phone: String!) {
    addClient(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

export { ADD_CLIENT, DELETE_CLIENT };
