import withData from '../lib/withData';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import checkLoggedIn from '../lib/checkLoggedIn';
import FacebookLogin from '../components/FacebookLogin';

/*
* Feed/home page
*
*/

class Index extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (!loggedInUser) {
      // If not signed in, we can redirect them here
    }

    return { loggedInUser };
  }

  render() {
    console.log(this.props.loggedInUser);
    return <FacebookLogin loggedInUser={this.props.loggedInUser} />;
  }
}

const AUTHENTICATE_FACEBOOK_USER = gql`
  mutation AuthenticateUserMutation($facebookToken: String!) {
    authenticateUser(facebookToken: $facebookToken) {
      token
    }
  }
`;

export default withData(Index);
