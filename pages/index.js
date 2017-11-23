import React from 'react';
import withData from '../lib/withData';
import checkLoggedIn from '../lib/checkLoggedIn';
import FacebookLogin from '../components/FacebookLogin';
import redirect from '../lib/redirect';

/*
* landing/login page
*
*/

class Index extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (loggedInUser) {
      redirect(context, '/home');
    }

    return { loggedInUser };
  }

  render() {
    return <FacebookLogin loggedInUser={this.props.loggedInUser} />;
  }
}

export default withData(Index);
