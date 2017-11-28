import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import cookie from 'cookie';

import withData from '../lib/withData';
import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

class FacebookLogin extends React.Component {
  componentDidMount() {
    this._initializeFacebookSDK();
  }

  _initializeFacebookSDK() {
    window.fbAsyncInit = function() {
      FB.init({
        appId: '312908249186717',
        cookie: true, // enable cookies to allow the server to access the session
        version: 'v2.11', // use Facebook API version 2.10
      });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  _handleFBLogin = () => {
    FB.login(
      response => {
        this._facebookCallback(response);
      },
      { scope: 'public_profile,email' },
    );
  };

  _facebookCallback = async facebookResponse => {
    if (facebookResponse.status === 'connected') {
      const facebookToken = facebookResponse.authResponse.accessToken;
      const graphcoolResponse = await this.props.authenticateUserMutation({
        variables: { facebookToken },
      });
      const graphcoolToken = graphcoolResponse.data.authenticateUser.token;
      document.cookie = cookie.serialize('token', graphcoolToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      // Force a reload of all the current queries now that the user is
      // logged in
      redirect({}, '/home');

      this.props.client.resetStore().then(() => {
        // Redirect to a more useful page when signed in
        redirect({}, '/home');
      });
    } else {
      console.warn(`User did not authorize the Facebook application.`);
    }
  };

  _logout = () => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1, // Expire the cookie immediately
    });
    redirect({}, '/');

    this.props.client.resetStore().then(() => {
      // Redirect to a more useful page when signed out
      redirect({}, '/');
    });
  };

  render() {
    if (!this.props.loggedInUser) {
      return (
        <a href="#" onClick={this._handleFBLogin}>
          <img
            src="https://scontent-ort2-2.xx.fbcdn.net/v/t39.2365-6/17639236_1785253958471956_282550797298827264_n.png?oh=499251858fbeca5f9770531c16da6e89&amp;oe=5A89FFEA"
            width="200"
            alt=""
          />
        </a>
      );
    }

    if (this.props.showLogout) {
      return (
        <div>
          <a href="#" onClick={this._logout}>
            Logout
          </a>
          <style jsx>{`
            a {
              color: #e6e6e6;
              underline: none;
              text-decoration: none;
              transition: all 0.3s ease;
            }

            a:hover {
              color: #666;
            }
          `}</style>
        </div>
      );
    }

    return null;
  }
}

const AUTHENTICATE_FACEBOOK_USER = gql`
  mutation AuthenticateUserMutation($facebookToken: String!) {
    authenticateUser(facebookToken: $facebookToken) {
      token
    }
  }
`;

export default compose(
  graphql(AUTHENTICATE_FACEBOOK_USER, {
    name: 'authenticateUserMutation',
  }),
  withApollo,
)(FacebookLogin);
