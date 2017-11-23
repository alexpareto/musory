import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/withData';
import redirect from './../lib/redirect';
import checkLoggedIn from './../lib/checkLoggedIn';

import Post from './../components/Post';
import CreatePost from './../components/CreatePost';

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
      return <div>Loading</div>;
    }

    return (
      <div>
        <div>
          <CreatePost loggedInUser={this.props.loggedInUser} />
          {this.props.data.allPosts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    );
  }
}

const ALL_POSTS = gql`
  query AllPostsQuery {
    allPosts(orderBy: createdAt_DESC) {
      id
      imageUrl
      content
    }
  }
`;

export default compose(
  withData,
  graphql(ALL_POSTS, { options: { pollInterval: 200 } }),
)(Home);
