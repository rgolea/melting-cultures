import gql from 'graphql-tag';

export const RegisterMutation = gql`
  mutation AdminRegisterEntity(
    $name: String!
    $email: Email!
    $location: LocationInput
    $password: String!
  ) {
    addEntity(name: $name, email: $email, location: $location, password: $password) {
      id
      email
      name
      location {
        lat
        lng
      }
    }
  }
`;
