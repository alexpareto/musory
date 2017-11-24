import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      description: this.props.description ? this.props.description : '',
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
      this._handleUpdateDescription();
    }
  };

  _handleUpdateDescription = async () => {
    this.refs.descriptionEntry.focus = false;
    const loggedInUser = this.props.loggedInUser;
    // don't allow if user is not logged in
    if (!loggedInUser) {
      console.warn('Only logged in users can create new posts');
      return;
    }

    const { description } = this.state;
    const authorId = loggedInUser.id;

    await this.props.UpdateDescriptionMutation({
      variables: { description, id: authorId },
    });
  };

  render() {
    if (this.props.canEdit) {
      return (
        <div>
          <textarea
            ref="descriptionEntry"
            name="description"
            placeholder="Add a description..."
            value={this.state.description}
            onChange={this._handleInputChange}
            onKeyUp={this._handleKeyPress}
          />
          <style jsx>{`
            textarea {
              background-color: #fafafa;
              border: none;
              padding: 0;
            }
          `}</style>
        </div>
      );
    }
    return <div>{this.props.description}</div>;
  }
}

const UPDATE_DESCRIPTION = gql`
  mutation UpdateDescription($id: ID!, $description: String!) {
    updateUser(id: $id, description: $description) {
      id
      description
    }
  }
`;

export default graphql(UPDATE_DESCRIPTION, {
  name: 'UpdateDescriptionMutation',
})(CreatePost);
