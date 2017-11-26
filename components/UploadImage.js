import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Dropzone from 'react-dropzone';

import Button from './Button';

class UploadImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _onDrop = (acceptedFiles, rejectedFiles) => {
    this._handleUploadImage(
      acceptedFiles[0],
      acceptedFiles[0].type,
      acceptedFiles[0].name.split('.').pop(),
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
    fetch(url, {
      // Your POST endpoint
      method: 'PUT',
      body: file, // This is the content of your file
    })
      .then(
        response => response.text(), // if the response is a JSON object
      )
      .then(
        success => this.props.setImage(data.SignedUrl.getUrl), // Handle the success response object
      )
      .catch(
        error => console.log(error), // Handle the error response object
      );
  };

  render() {
    if (this.props.loggedInUser) {
      return (
        <Dropzone className="image-drop-zone" onDrop={this._onDrop}>
          <Button text="Add a photo..." />
        </Dropzone>
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

export default withApollo(UploadImage);
