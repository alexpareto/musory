import gql from 'graphql-tag';

export default (context, apolloClient) =>
  apolloClient
    .query({
      query: gql`
        query LoggedInUser {
          loggedInUser {
            id
            username
          }
        }
      `,
    })
    .then(({ data }) => {
      console.log(data);
      if (data) {
        return { loggedInUser: data.loggedInUser };
      }
      return null;
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: {} };
    });
