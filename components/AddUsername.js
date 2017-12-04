import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import redirect from './../lib/redirect';

import Button from './Button';

class AddUsername extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
    };
  }

  _handleKeyDown = event => {
    if (event.which == 13 || event.keyCode == 13) {
      this._handleCreateUsername();
    }
  };

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
    const username = this.state.username.replace(/\s/g, '');

    const response = await this.props.AddUsernameMutation({
      variables: { id: id, username: username },
    });
    window.location.replace('/home');
  };

  render() {
    if (this.props.loggedInUser && !this.props.loggedInUser.username) {
      return (
        <div className="add-username-holder">
          <div>
            <input
              name="username"
              placeholder="Choose a username..."
              value={this.state.username}
              onChange={this._handleInputChange}
              onKeyDown={this._handleKeyDown}
            />
          </div>
          <Button text="Continue" onClick={this._handleCreateUsername} />
          <style jsx>{`
            input {
              display: inline-block;
              border: 1px solid #eee;
              outline: 0px none transparent;
              transition: all 0.3s ease;
              padding: 10px 10px;
              box-sizing: border-box;
              margin-bottom: 10px;
            }

            .add-username-holder {
              text-align: center;
            }
          `}</style>
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
