import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import autosize from 'autosize';

import Button from './Button';
import UploadImage from './UploadImage';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      imageUrl: '',
    };
  }

  componentDidMount() {
    autosize(this.textArea);
  }

  _renderButton = () => {
    if (!this.state.content && !this.state.imageUrl) {
      return null;
    }
    return <Button text="Post" onClick={this._handleCreatePost} />;
  };

  _handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  _handleCreatePost = async () => {
    this.textArea.blur();
    const loggedInUser = this.props.loggedInUser;
    // don't allow if user is not logged in
    if (!loggedInUser) {
      console.warn('Only logged in users can create new posts');
      return;
    }

    const { content } = this.state;
    const authorId = loggedInUser.id;
    const postId = this.props.postId;

    this.setState({
      content: '',
      imageUrl: '',
    });

    await this.props.createComment({
      variables: { content, postId, authorId },
    });

    this.props.onPost();
  };

  render() {
    if (this.props.loggedInUser) {
      return (
        <div>
          <textarea
            ref={ref => {
              this.textArea = ref;
            }}
            name="content"
            placeholder={
              this.props.placeholder
                ? this.props.placeholder
                : 'Add a private reply...'
            }
            value={this.state.content}
            onChange={this._handleInputChange}
          />
          <div className="footer">
            <div className="add-entry-button">{this._renderButton()}</div>
          </div>
          <style jsx>{`
            div {
              max-width: 500px;
              margin: 0 auto;
              margin-bottom: 20px;
              box-sizing: border-box;
              padding: 0 16px;
            }

            .footer {
              margin-bottom: 20px;
            }

            .add-entry-button {
              margin-top: 10px;
            }

            textarea {
              width: 100%;
              display: block;
              resize: none;
              border: 1px solid #eee;
              outline: 0px none transparent;
              transition: all 0.3s ease;
              padding: 3px 16px;
              box-sizing: border-box;
              border-radius: 3px;
              overflow: hidden;
              height: 30px;
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

const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $postId: ID!, $authorId: ID!) {
    createComment(content: $content, postId: $postId, authorId: $authorId) {
      id
    }
  }
`;

export default graphql(CREATE_COMMENT, { name: 'createComment' })(CreatePost);
