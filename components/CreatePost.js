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

  _handleKeyPress = event => {
    if (event.key === 'Enter') {
      this._handleCreatePost();
    }
  };

  _handleCreatePost = async () => {
    const loggedInUser = this.props.loggedInUser;
    // don't allow if user is not logged in
    if (!loggedInUser) {
      console.warn('Only logged in users can create new posts');
      return;
    }

    const { content, imageUrl } = this.state;
    const authorId = loggedInUser.id;

    this.setState({
      content: '',
    });

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
            placeholder="Add an entry..."
            value={this.state.content}
            onChange={this._handleInputChange}
            onKeyUp={this._handleKeyPress}
          />
          <style jsx>{`
            div {
              max-width: 500px;
              margin: 0 auto;
              margin-bottom: 20px;
              box-sizing: border-box;
            }

            textarea {
              width: 100%;
              display: block;
              resize: none;
              border: 1px solid #eee;
              outline: 0px none transparent;
              transition: all 0.3s ease;
              padding: 16px 10px;
              box-sizing: border-box;
              border-radius: 3px;
            }

            textarea:focus,
            input:focus {
              outline: 0;
              border: 1px solid #222;
            }

            *:focus {
              outline: 0;
            }
          `}</style>
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
