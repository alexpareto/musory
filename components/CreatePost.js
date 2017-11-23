import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      imageUrl: '',
    };
  }

  _handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  _handleCreatePost = async () => {
    this.setState({
      content: '',
    });

    const loggedInUser = this.props.loggedInUser;

    // don't allow if user is not logged in
    if (!loggedInUser) {
      console.warn('Only logged in users can create new posts');
      return;
    }

    const { content, imageUrl } = this.state;
    const authorId = loggedInUser.id;

    await this.props.CreatePostMutation({
      variables: { content, imageUrl, authorId },
    });
  };

  render() {
    if (this.props.loggedInUser) {
      return (
        <div>
          <textarea
            name="content"
            value={this.state.content}
            onChange={this._handleInputChange}
          />
          <button onClick={this._handleCreatePost}>Create Post</button>
        </div>
      );
    }
    return null;
  }
}

const CREATE_POST = gql`
  mutation CreatePost($content: String!, $imageUrl: String, $authorId: ID!) {
    createPost(content: $content, imageUrl: $imageUrl, authorId: $authorId) {
      id
    }
  }
`;

export default graphql(CREATE_POST, { name: 'CreatePostMutation' })(CreatePost);
