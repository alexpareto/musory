import React from 'react';
import { compose, withApollo, graphql } from 'react-apollo';
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
      imageType: '',
      imageExtension: '',
    };
  }

  componentDidMount() {
    autosize(this.textArea);
  }

  _setImage = (url, type, extension) => {
    this.setState({
      imageUrl: url,
      imageType: type,
      imageExtension: extension,
    });
  };

  _renderImage = () => {
    if (this.state.imageUrl) {
      return (
        <div>
          <img src={this.state.imageUrl} />
          <style jsx>{`
            div {
              max-width: 500px;
            }

            img {
              width: 100%;
            }
          `}</style>
        </div>
      );
    }
    return null;
  };

  _renderImageUpload = () => {
    if (this.state.imageUrl) {
      return null;
    }

    return (
      <UploadImage
        loggedInUser={this.props.loggedInUser}
        setImage={this._setImage}
      />
    );
  };

  _handleUploadImage = async (file, type, extension) => {
    var body = new FormData();
    body.append('file', file);
    const { data } = await this.props.client.query({
      query: GET_SIGNED_URL,
      variables: {
        filePath:
          Math.random()
            .toString(36)
            .substring(7) +
          '.' +
          extension,
      },
    });
    const url = data.SignedUrl.signedUrl;
    return fetch(url, {
      method: 'PUT',
      body: file, // This is the content of your file
    })
      .then(response => response.text())
      .then(success => data.SignedUrl.getUrl)
      .catch(
        error => console.log(error), // Handle the error response object
      );
  };

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

    // upload image if we have one
    let imageUrl = '';
    if (this.state.imageUrl) {
      const image = await fetch(this.state.imageUrl).then(function(response) {
        return response.blob();
      });
      imageUrl = await this._handleUploadImage(
        image,
        this.state.imageType,
        this.state.imageExtension,
      );
    }

    const authorId = loggedInUser.id;

    this.setState({
      content: '',
      imageUrl: '',
    });

    await this.props.CreatePostMutation({
      variables: { content, imageUrl, authorId },
    });

    this.props.onPost();
  };

  render() {
    if (this.props.loggedInUser) {
      return (
        <div>
          {this._renderImage()}
          <textarea
            ref={ref => {
              this.textArea = ref;
            }}
            name="content"
            placeholder="Create a muse..."
            value={this.state.content}
            onChange={this._handleInputChange}
          />
          <div className="footer">
            {this._renderImageUpload()}
            <div className="add-entry-button">{this._renderButton()}</div>
          </div>
          <style jsx>{`
            div {
              max-width: 500px;
              margin: 0 auto;
              margin-bottom: 20px;
              box-sizing: border-box;
            }

            .footer {
              margin-bottom: 20px;
              height: 80px;
              text-align: center;
              padding: 10px;
              transition: all 0.3s ease;
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
              padding: 16px 10px;
              box-sizing: border-box;
              border-radius: 3px;
              overflow: hidden;
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

const GET_SIGNED_URL = gql`
  query GetSignedUrl($filePath: String!) {
    SignedUrl(filePath: $filePath) {
      fileName
      signedUrl
      getUrl
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($content: String!, $imageUrl: String, $authorId: ID!) {
    createPost(content: $content, imageUrl: $imageUrl, authorId: $authorId) {
      id
    }
  }
`;

export default compose(
  withApollo,
  graphql(CREATE_POST, { name: 'CreatePostMutation' }),
)(CreatePost);
