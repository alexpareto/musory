import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Post extends React.Component {
  render() {
    return (
      <div>
        <p> {this.props.post.content}</p>
      </div>
    );
  }
}

export default Post;
