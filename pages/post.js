import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/withData';
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

  onComponentWillMount() {
    console.log(this.props.data);
    this.props.data.GetPost();
  }

  render() {
    if (!this.props.data.Post) {
      return <div>Sorry that post doesn't exist.</div>;
    }
    return (
      <div>
        <div>
          <Post post={this.props.data.Post} />
        </div>
      </div>
    );
  }
}

const GET_POST = gql`
  query GetPost($id: ID!) {
    Post(id: $id) {
      id
      imageUrl
      content
    }
  }
`;

export default withData(
  graphql(GET_POST, {
    options: props => ({
      variables: { id: props.url.query.id },
      name: 'GetPost',
    }),
  })(PostPage),
);
