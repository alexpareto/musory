import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/withData';
import redirect from './../lib/redirect';
import checkLoggedIn from './../lib/checkLoggedIn';

import Post from './../components/Post';
import CreatePost from './../components/CreatePost';

/*
* Individual post page
*
*/

class PostPage extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    return { loggedInUser };
  }

  renderCreatePost() {
    if (
      this.props.loggedInUser &&
      this.props.loggedInUser.id == this.props.url.query.id
    ) {
      return <CreatePost loggedInUser={this.props.loggedInUser} />;
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderCreatePost()}
        {this.props.data.allPosts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    );
  }
}

const GET_USER_POSTS = gql`
  query GetUserPosts($id: ID!) {
    allPosts(filter: { author: { id: $id } }, orderBy: createdAt_DESC) {
      id
      content
      imageUrl
    }
  }
`;

export default withData(
  graphql(GET_USER_POSTS, {
    options: props => ({
      variables: { id: props.url.query.id },
      name: 'GetUserPosts',
    }),
  })(PostPage),
);
