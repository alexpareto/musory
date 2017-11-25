import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/withData';
import checkLoggedIn from './../lib/checkLoggedIn';

import Post from './../components/Post';
import CreatePost from './../components/CreatePost';
import Header from './../components/Header';
import Layout from './../components/Layout';

/*
* Individual post page
*
*/

class PostPage extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    return { loggedInUser };
  }

  onComponentWillMount() {
    this.props.data.GetPost();
  }

  render() {
    return (
      <Layout>
        <Header loggedInUser={this.props.loggedInUser} />
        <div>
          <Post id={this.props.url.query.id} />
        </div>
      </Layout>
    );
  }
}

export default withData(PostPage);
