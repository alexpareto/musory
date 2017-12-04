import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Waypoint from 'react-waypoint';
import Head from 'next/head';
import Link from 'next/link';

import redirect from '../lib/redirect';
import withData from '../lib/withData';
import checkLoggedIn from './../lib/checkLoggedIn';

import Layout from './../components/Layout';
import Post from './../components/Post';
import CreatePost from './../components/CreatePost';
import Header from './../components/Header';
import Description from './../components/Description';
import MainContent from './../components/MainContent';
import FollowButton from './../components/FollowButton';
import Loading from './../components/Loading';
import FacebookLogin from './../components/FacebookLogin';

/*
* Individual post page
*
*/

class Notifications extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (!loggedInUser) {
      redirect(context, '/');
    } else if (!loggedInUser.username) {
      redirect(context, '/username');
    }

    return { loggedInUser };
  }

  renderNotification = notification => {
    const className = !notification.viewed
      ? 'notification-container notification-new'
      : 'notification-container';

    if (!notification.viewed) {
      this.props
        .viewNotification({ variables: { id: notification.id } })
        .then(resp => console.log(resp));
    }
    return (
      <Link key={notification.id} href={notification.url}>
        <div key={notification.id} className={className}>
          <div>
            <div>{notification.content}</div>
          </div>
          <style jsx>{`
            .notification-container {
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
              cursor: pointer;
            }

            .notification-new {
              border: 1px solid #e5625e;
            }

            a {
              color: inherit;
              underline: none;
              text-decoration: none;
            }
          `}</style>
        </div>
      </Link>
    );
  };

  renderNoNotifications = () => {
    if (this.props.notifications.allNotifications.length === 0) {
      return (
        <div>
          <p>Looks like you have no notifications here!</p>
          <style jsx>{`
            div {
              text-align: center;
            }
          `}</style>
        </div>
      );
    }
    return null;
  };

  render() {
    if (this.props.notifications.loading) {
      return <Loading />;
    }
    return (
      <Layout>
        <Header loggedInUser={this.props.loggedInUser} url={this.props.url} />
        <MainContent />
        <div className="container page">
          {this.props.notifications.allNotifications.map(
            this.renderNotification,
          )}
          {this.renderNoNotifications()}
        </div>
        <style jsx>{``}</style>
      </Layout>
    );
  }
}

const GET_NOTIFICATIONS = gql`
  query GetNotifications($id: ID!) {
    allNotifications(
      filter: { targetUser: { id: $id } }
      orderBy: createdAt_DESC
    ) {
      id
      content
      url
      viewed
    }
  }
`;

const VIEW_NOTIFICATION = gql`
  mutation ViewNotifications($id: ID!) {
    updateNotification(id: $id, viewed: true) {
      id
    }
  }
`;

export default withData(
  compose(
    graphql(VIEW_NOTIFICATION, { name: 'viewNotification' }),
    graphql(GET_NOTIFICATIONS, {
      options: props => ({
        variables: { id: props.loggedInUser.id },
      }),
      name: 'notifications',
    }),
  )(Notifications),
);
