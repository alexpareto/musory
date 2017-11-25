import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/withData';
import redirect from './../lib/redirect';
import checkLoggedIn from './../lib/checkLoggedIn';

import Layout from './../components/Layout';
import Post from './../components/Post';
import CreatePost from './../components/CreatePost';
import AddUsername from './../components/AddUsername';
import Header from './../components/Header';

/*
* Feed/home page
*
*/

class Home extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (!loggedInUser) {
      redirect(context, '/');
    }

    return { loggedInUser };
  }

  render() {
    if (this.props.data.loading) {
      return <div>loading!</div>;
    }

    if (!this.props.loggedInUser.username) {
      return (
        <Layout>
          <AddUsername loggedInUser={this.props.loggedInUser} />
        </Layout>
      );
    }

    return (
      <Layout>
        <Header loggedInUser={this.props.loggedInUser} />
        <div className="container">
          <CreatePost loggedInUser={this.props.loggedInUser} />
          {this.props.data.allPosts.map(post => (
            <Post key={post.id} id={post.id} />
          ))}
          <style jsx>{`
            .container {
            }
          `}</style>
        </div>
      </Layout>
    );
  }
}

const ALL_POSTS = gql`
  query AllPostsQuery {
    allPosts(orderBy: createdAt_DESC) {
      id
      imageUrl
      content
      createdAt
      views
      author {
        username
      }
    }
  }
`;

export default compose(
  withData,
  graphql(ALL_POSTS, { options: { pollInterval: 200 } }),
)(Home);
