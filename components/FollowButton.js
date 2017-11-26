import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Button from './Button';

class FollowButton extends React.Component {
  _onClickFollow = async () => {
    await this.props.addFollower({
      variables: {
        idFollowed: this.props.followedUser.id,
        idFollowing: this.props.loggedInUser.id,
      },
    });
    await this.props.isFollowing.refetch();
  };

  _onClickUnfollow = async () => {
    await this.props.removeFollower({
      variables: {
        idFollowed: this.props.followedUser.id,
        idFollowing: this.props.loggedInUser.id,
      },
    });
    await this.props.isFollowing.refetch();
  };

  render() {
    if (!this.props.loggedInUser) {
      return null;
    }

    if (this.props.addFollower.loading || this.props.isFollowing.loading) {
      return <Button text="Follow" disabled />;
    } else if (this.props.isFollowing.allUsers.length > 0) {
      return <Button text="Unfollow" onClick={this._onClickUnfollow} />;
    }
    return <Button text="Follow" onClick={this._onClickFollow} />;
  }
}

const REMOVE_FOLLOWER = gql`
  mutation RemoveFollower($idFollowed: ID!, $idFollowing: ID!) {
    removeFromFollowedByUser(
      followingUserId: $idFollowing
      isFollowedByUserId: $idFollowed
    ) {
      followingUser {
        id
      }
    }
  }
`;

const ADD_FOLLOWER = gql`
  mutation AddFollower($idFollowed: ID!, $idFollowing: ID!) {
    addToFollowedByUser(
      followingUserId: $idFollowing
      isFollowedByUserId: $idFollowed
    ) {
      followingUser {
        id
      }
    }
  }
`;

const IS_FOLLOWING = gql`
  query IsFollowing($idFollowed: ID!, $idFollowing: ID!) {
    allUsers(
      filter: {
        AND: [{ id: $idFollowing }, { following_some: { id: $idFollowed } }]
      }
    ) {
      id
    }
  }
`;

export default compose(
  graphql(ADD_FOLLOWER, { name: 'addFollower' }),
  graphql(IS_FOLLOWING, {
    options: props => ({
      variables: {
        idFollowing: props.loggedInUser.id,
        idFollowed: props.followedUser.id,
      },
    }),
    name: 'isFollowing',
  }),
  graphql(REMOVE_FOLLOWER, { name: 'removeFollower' }),
)(FollowButton);
