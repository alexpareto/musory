/* global var FB */
import React from 'react';
import { compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Waypoint from 'react-waypoint';
import Link from 'next/link';
import Router from 'next/router';

import withData from '../lib/withData';
import redirect from './../lib/redirect';
import checkLoggedIn from './../lib/checkLoggedIn';

import Layout from './../components/Layout';
import MainContent from './../components/MainContent';
import Header from './../components/Header';
import Loading from './../components/Loading';
import FollowButton from './../components/FollowButton';
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

  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      loading: true,
      name: '',
    };
  }

  componentDidMount() {
    console.log('mounted!');
    this._initializeFacebookSDK();
  }

  _initializeFacebookSDK = () => {
    window.fbAsyncInit = () => {
      this._runFbQuery();
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

    if (typeof FB != 'undefined' && FB != null) {
      this._runFbQuery();
    }
  };

  _runFbQuery = () => {
    FB.init({
      appId: '312908249186717',
      cookie: true, // enable cookies to allow the server to access the session
      version: 'v2.11', // use Facebook API version 2.10
    });

    FB.getLoginStatus(response => {
      const access_token = response.authResponse.accessToken;
      FB.api(
        `/${this.props.loggedInUser.facebookUserId}/friends`,
        { access_token, limit: '5000' },
        async resp => {
          if (resp && !resp.error) {
            const idToNameMap = {};
            const userIds = resp.data.map(user => {
              idToNameMap[user.id] = user.name;
              return user.id;
            });
            const result = await this.props.client.query({
              query: GET_FRIENDS,
              variables: { ids: userIds },
            });
            const friendArray = result.data.allUsers.map(user => {
              return {
                id: user.id,
                username: user.username,
                name: idToNameMap[user.facebookUserId],
              };
            });
            this.setState({
              friends: friendArray,
              loading: false,
            });
          }
        },
      );
    });
  };

  renderFriend = friend => {
    return (
      <div key={friend.id} className="friend-container">
        <div>
          <div>{friend.name}</div>
          <Link
            as={`/story/${friend.username}`}
            href={`/story?username=${friend.username}`}
          >
            <a>
              <div className="friend-username">{friend.username}</div>
            </a>
          </Link>
          <div>{friend.description}</div>
        </div>
        <div className="friend-follow">
          <FollowButton
            loggedInUser={this.props.loggedInUser}
            followedUser={friend}
          />
        </div>
        <style jsx>{`
          .friend-container {
            box-sizing: border-box;
            max-width: 500px;
            text-align: left;
            margin: 0 auto;
            margin-bottom: 20px;
            border: 1px solid rgba(0, 0, 0, 0);
            background-color: #fff;
            border-radius: 3px;
            border: 1px solid #e6e6e6;
            padding: 10px 16px;
            display: flex;
            justify-content: space-around;
            align-items: center;
          }

          .friend-username {
            font-weight: bold;
          }

          a {
            color: inherit;
            underline: none;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  };

  _handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  _handleKeyPress = e => {
    if (e.key === 'Enter') {
      Router.push(
        `/story?username=${this.state.name}`,
        `/story/${this.state.name}`,
      );
    }
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Layout showFooter={true}>
        <Header loggedInUser={this.props.loggedInUser} url={this.props.url} />
        <MainContent>
          <div className="container page">
            <h4>Find a user by username</h4>
            <div className="username-holder">
              <input
                name="name"
                placeholder="Type a username..."
                className="find-username"
                onChange={this._handleInputChange}
                onKeyPress={this._handleKeyPress}
                value={this.state.name}
                autocomplete="off"
              />
            </div>
            <h4>Your Facebook friends on Musory</h4>
            {this.state.friends.map(this.renderFriend)}
          </div>
        </MainContent>
        <style jsx>{`
          h4 {
            text-align: center;
            margin-bottom: 20px;
          }

          .username-holder {
            text-align: center;
            margin-bottom: 40px;
          }

          .find-username {
            text-align: center;
            margin: 0 auto;
            display: inline-block;
            box-sizing: border-box;
            height: 30px;
          }
        `}</style>
      </Layout>
    );
  }
}

const GET_FRIENDS = gql`
  query AllUsersQuery($ids: [String!]!) {
    allUsers(filter: { facebookUserId_in: $ids }) {
      id
      username
      facebookUserId
      description
    }
  }
`;

export default compose(withData, withApollo)(Friends);
