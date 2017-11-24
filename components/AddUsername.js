import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class AddUsername extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
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

  _handleCreateUsername = async () => {
    // don't allow if user is not logged in
    if (!this.props.loggedInUser) {
      console.warn('Only logged in users can create a username');
      return;
    }

    const id = this.props.loggedInUser.id;
    const username = this.state.username;

    await this.props.AddUsernameMutation({
      variables: { id: id, username: username },
    });
  };

  render() {
    if (this.props.loggedInUser && !this.props.loggedInUser.username) {
      return (
        <div>
          <input
            name="username"
            value={this.state.username}
            onChange={this._handleInputChange}
          />
          <button onClick={this._handleCreateUsername}>Add Username</button>
        </div>
      );
    }
    return null;
  }
}

const ADD_USERNAME = gql`
  mutation AddUsername($id: ID!, $username: String!) {
    updateUser(id: $id, username: $username) {
      id
      username
    }
  }
`;

export default graphql(ADD_USERNAME, { name: 'AddUsernameMutation' })(
  AddUsername,
);
