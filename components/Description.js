import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import autosize from 'autosize';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      description: this.props.description ? this.props.description : '',
    };
  }

  componentDidMount() {
    autosize(this.textArea);
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
    this.textArea.blur();
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
            ref={ref => {
              this.textArea = ref;
            }}
            name="description"
            placeholder="Add a description..."
            value={this.state.description}
            onChange={this._handleInputChange}
            onKeyDown={this._handleKeyPress}
          />
          <style jsx>{`
            textarea {
              background-color: #fafafa;
              padding: 0;
              resize: none;
              text-align: center;
              border: none;
            }

            textarea:hover {
              border: none;
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
