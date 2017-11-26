import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/withData';
import checkLoggedIn from './../lib/checkLoggedIn';

import Layout from './../components/Layout';
import Post from './../components/Post';
import CreatePost from './../components/CreatePost';
import Header from './../components/Header';
import Description from './../components/Description';
import MainContent from './../components/MainContent';
import FollowButton from './../components/FollowButton';

/*
* Individual post page
*
*/

class Story extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    return { loggedInUser };
  }

  renderCreatePost() {
    if (
      this.props.loggedInUser &&
      this.props.loggedInUser.username == this.props.url.query.username
    ) {
      return <CreatePost loggedInUser={this.props.loggedInUser} />;
    }
    return null;
  }

  render() {
    if (this.props.GetUser.loading || this.props.GetUserPosts.loading) {
      return <div>loading!</div>;
    }

    return (
      <Layout>
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
                  <FollowButton
                    loggedInUser={this.props.loggedInUser}
                    followedUser={this.props.GetUser.User}
                  />
                </span>
              </div>
            </div>
            <div className="two-thirds column">
              {this.renderCreatePost()}
              {this.props.GetUserPosts.allPosts.map(post => (
                <Post
                  key={post.id}
                  id={post.id}
                  loggedInUser={this.props.loggedInUser}
                />
              ))}
            </div>
          </div>
        </MainContent>

        <style jsx>{`
          .story-header {
            font-size: 40px;
            font-weight: bold;
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
  query GetUserPosts($username: String!) {
    allPosts(
      filter: { author: { username: $username } }
      orderBy: createdAt_DESC
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
        variables: { username: props.url.query.username },
      }),
      name: 'GetUserPosts',
    }),
  )(Story),
);
