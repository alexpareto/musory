/* global var FB */
import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Waypoint from 'react-waypoint';
import Router from 'next/router';
import cookie from 'cookie';

import withData from '../lib/withData';
import redirect from './../lib/redirect';
import checkLoggedIn from './../lib/checkLoggedIn';

import Layout from './../components/Layout';
import MainContent from './../components/MainContent';
import Post from './../components/Post';
import CreatePost from './../components/CreatePost';
import AddUsername from './../components/AddUsername';
import Header from './../components/Header';
import Loading from './../components/Loading';

/*
* Feed/home page
*
*/

class Friends extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (!loggedInUser) {
      redirect(context, '/');
    } else if (!loggedInUser.username) {
      redirect(context, '/username');
    }

    return { loggedInUser };
  }

  componentDidMount() {
    this._initializeFacebookSDK();
  }

  _initializeFacebookSDK = () => {
    window.fbAsyncInit = () => {
      FB.init({
        appId: '312908249186717',
        cookie: true, // enable cookies to allow the server to access the session
        version: 'v2.11', // use Facebook API version 2.10
        status: true,
      });

      FB.getLoginStatus(response => {
        const access_token = response.authResponse.accessToken;
        console.log(access_token);
        FB.api(
          `/${this.props.loggedInUser.facebookUserId}/friends`,
          { access_token },
          function(response) {
            if (response && !response.error) {
              console.log(response);
            }
          },
        );
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
  };

  render() {
    return <div />;
  }
}

export default withData(Friends);
