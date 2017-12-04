import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Waypoint from 'react-waypoint';
import Head from 'next/head';

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

class Story extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    return { loggedInUser };
  }

  _refreshPosts = () => {
    this.props.GetUserPosts.refetch();
  };

  renderCreatePost = () => {
    if (
      this.props.loggedInUser &&
      this.props.loggedInUser.username == this.props.url.query.username
    ) {
      return (
        <CreatePost
          loggedInUser={this.props.loggedInUser}
          onPost={this._refreshPosts}
        />
      );
    }
    return null;
  };

  _renderFollowButton = () => {
    if (
      !this.props.loggedInUser ||
      this.props.loggedInUser.username == this.props.url.query.username
    ) {
      return null;
    }
    return (
      <div>
        <FollowButton
          loggedInUser={this.props.loggedInUser}
          followedUser={this.props.GetUser.User}
        />
        <style jsx>{`
          div {
            margin-bottom: 10px;
          }
        `}</style>
      </div>
    );
  };

  render() {
    if (this.props.GetUser.loading || this.props.GetUserPosts.loading) {
      return <Loading />;
    }

    if (!this.props.GetUser.User) {
      return (
        <Layout showFooter={true}>
          <Header loggedInUser={this.props.loggedInUser} url={this.props.url} />
          <MainContent>
            <div className="container" style={{ textAlign: 'center' }}>
              <h4>Sorry that user doesn't exist.</h4>
            </div>
          </MainContent>
        </Layout>
      );
    }

    return (
      <Layout showFooter={true}>
        <Head>
          <meta
            name="og:title"
            property="og:title"
            content={this.props.GetUser.User.username + "'s story on Musory"}
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            content={this.props.GetUser.User.description}
            key="og:description"
          />
          <meta
            name="description"
            key="description"
            content={this.props.GetUser.User.description}
          />
        </Head>

        <Header loggedInUser={this.props.loggedInUser} url={this.props.url} />
        <MainContent>
          <div className="container">
            <div className="one-third column">
              <div className="story-about">
                <div className="story-header">
                  {this.props.url.query.username}
                </div>
                <div className="story-description">
                  <Description
                    loggedInUser={this.props.loggedInUser}
                    description={this.props.GetUser.User.description}
                    canEdit={
                      this.props.loggedInUser &&
                      this.props.loggedInUser.username ==
                        this.props.url.query.username
                    }
                  />
                </div>
                <span className="story-follow-button">
                  {this._renderFollowButton()}
                </span>
                <FacebookLogin
                  loggedInUser={this.props.loggedInUser}
                  showLogout={true}
                />
              </div>
            </div>
            <div className="two-thirds column">
              {this.renderCreatePost()}
              {this.props.GetUserPosts.allPosts.map(post => (
                <Post
                  key={post.id}
                  id={post.id}
                  loggedInUser={this.props.loggedInUser}
                  onChange={this._refreshPosts}
                />
              ))}
              <div style={{ height: 10 }}>
                <Waypoint onEnter={this.props.loadMorePosts} threshold={0} />
              </div>
            </div>
          </div>
        </MainContent>

        <style jsx>{`
          .story-header {
            font-size: 40px;
            font-weight: bold;
          }

          .story-about {
            text-align: center;
          }
        `}</style>
      </Layout>
    );
  }
}

const GET_USER = gql`
  query GetUser($username: String!) {
    User(username: $username) {
      id
      description
      username
    }
  }
`;

const GET_USER_POSTS = gql`
  query GetUserPosts($username: String!, $first: Int!, $skip: Int!) {
    allPosts(
      filter: { author: { username: $username } }
      orderBy: createdAt_DESC
      first: $first
      skip: $skip
    ) {
      id
      content
      imageUrl
      views
      author {
        id
        username
        description
      }
    }
  }
`;

export default withData(
  compose(
    graphql(GET_USER, {
      options: props => ({
        variables: { username: props.url.query.username },
      }),
      name: 'GetUser',
    }),
    graphql(GET_USER_POSTS, {
      options: props => ({
        variables: {
          username: props.url.query.username,
          skip: 0,
          first: 5,
        },
      }),
      props: ({ GetUserPosts }) => ({
        GetUserPosts: GetUserPosts,
        loadMorePosts: () => {
          return GetUserPosts.fetchMore({
            variables: {
              skip: GetUserPosts.allPosts.length,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }
              return Object.assign({}, previousResult, {
                // Append the new posts results to the old one
                allPosts: [
                  ...previousResult.allPosts,
                  ...fetchMoreResult.allPosts,
                ],
              });
            },
          });
        },
      }),
      name: 'GetUserPosts',
    }),
  )(Story),
);
