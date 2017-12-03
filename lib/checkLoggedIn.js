import gql from 'graphql-tag';

export default (context, apolloClient) =>
  apolloClient
    .query({
      query: gql`
        query LoggedInUser {
          loggedInUser {
            id
            username
            facebookUserId
          }
        }
      `,
    })
    .then(({ data }) => {
      if (data && data.loggedInUser) {
        return { loggedInUser: data.loggedInUser };
      }
      return { loggedInUser: null };
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: null };
    });
