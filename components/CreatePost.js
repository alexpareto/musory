import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import autosize from 'autosize';

import Button from './Button';

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
    if (!this.state.content) {
      return null;
    }
    return (
      <div>
        <Button text="Add" onClick={this._handleCreatePost} />
      </div>
    );
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
            ref={ref => {
              this.textArea = ref;
            }}
            name="content"
            placeholder="Add an entry..."
            value={this.state.content}
            onChange={this._handleInputChange}
          />
          <div className="footer">{this._renderButton()}</div>
          <style jsx>{`
            div {
              max-width: 500px;
              margin: 0 auto;
              margin-bottom: 20px;
              box-sizing: border-box;
            }

            .footer {
              margin-bottom: 20px;
              height: 30px;
              text-align: center;
              padding: 10px;
              transition: all 0.3s ease;
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
