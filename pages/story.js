import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/withData';
import checkLoggedIn from './../lib/checkLoggedIn';

import Layout from './../components/Layout';
import Post from './../components/Post';
import CreatePost from './../components/CreatePost';
import Header from './../components/Header';
import Description from './../components/Description';

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
    if (this.props.data.loading) {
      return <div>loading!</div>;
    }

    return (
      <Layout>
        <Header loggedInUser={this.props.loggedInUser} />
        <div className="container">
          <div className="one-third column">
            <div className="story-header">{this.props.url.query.username}</div>
            <div className="story-description">
              <Description
                loggedInUser={this.props.loggedInUser}
                description={this.props.data.allPosts[0].author.description}
                canEdit={
                  this.props.loggedInUser &&
                  this.props.loggedInUser.username ==
                    this.props.url.query.username
                }
              />
            </div>
          </div>
          <div className="two-thirds column">
            {this.renderCreatePost()}
            {this.props.data.allPosts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
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

const GET_USER_POSTS = gql`
  query GetUserPosts($username: String!) {
    allPosts(
      filter: { author: { username: $username } }
      orderBy: createdAt_DESC
    ) {
      id
      content
      imageUrl
      author {
        username
        description
      }
    }
  }
`;

export default withData(
  graphql(GET_USER_POSTS, {
    options: props => ({
      variables: { username: props.url.query.username },
      name: 'GetUserPosts',
    }),
  })(Story),
);
