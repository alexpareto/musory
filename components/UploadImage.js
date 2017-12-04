import React from 'react';
import { withApollo } from 'react-apollo';
import Dropzone from 'react-dropzone';
import loadImage from 'blueimp-load-image';

import Button from './Button';

class UploadImage extends React.Component {
  constructor(props) {
    super(props);
  }

  _onDrop = (acceptedFiles, rejectedFiles) => {
    loadImage(
      acceptedFiles[0],
      canvas => {
        this.props.setImage(
          canvas.toDataURL(),
          acceptedFiles[0].type,
          acceptedFiles[0].name.split('.').pop(),
        );
      },
      {
        maxWidth: 600,
        orientation: true,
        canvas: true,
        noRevoke: true,
      }, // Options
    );
  };

  render() {
    if (this.props.loggedInUser) {
      return (
        <div>
          <Dropzone className="image-drop-zone" onDrop={this._onDrop}>
            <Button text="Add a photo..." />
          </Dropzone>
        </div>
      );
    }
    return null;
  }
}

export default withApollo(UploadImage);
