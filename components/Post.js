import React from 'react';
import Link from 'next/link';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import Icon from './Icon';
import Modal from './Modal';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderDeleteModal: false,
    };
  }
  componentDidMount() {
    /*
    this.props
      .addViewMutation({
        variables: { id: this.props.data.Post.id },
      })
      .then(response => {
        console.log('add view success!');
      })
      .catch(error => {
        console.error(error);
      });

    */
  }

  _renderDeleteIcon = () => {
    if (
      this.props.loggedInUser &&
      this.props.data.Post.author.id == this.props.loggedInUser.id
    ) {
      return (
        <a className="post-meta-x" href="#" onClick={this.onClickDelete}>
          <Icon name="x" />
          <style jsx>
            {`
              .post-meta-x {
                height: 20px;
                width: 20px;
                stroke: #e6e6e6;
                display: inline-block;
                padding-right: 20px;
              }

              .post-meta-x:hover {
                stroke: #666;
                transition: all 0.3s ease;
              }
            `}
          </style>
        </a>
      );
    }
    return null;
  };

  renderModal = () => {
    if (this.state.renderDeleteModal) {
      return (
        <Modal
          text="Are you sure you want to delete this post? twol encourages you to share for you. There are no good or bad posts!"
          onClickContinue={this.onClickModalContinue}
          onClickCancel={this.onClickModalCancel}
        />
      );
    }
    return null;
  };

  onClickDelete = () => {
    this.setState({ renderDeleteModal: true });
  };

  onClickModalCancel = () => {
    this.setState({
      renderDeleteModal: false,
    });
  };

  onClickModalContinue = async () => {
    this.setState({
      renderDeleteModal: false,
    });
    await this.props.deletePostMutation({
      variables: { id: this.props.data.Post.id },
    });
  };

  _insertBreak = () => {
    if (this.props.data.Post.content.length > 200) {
      return <br />;
    }
    return null;
  };

  _onUsernameClick = event => {
    event.stopPropagation();
  };

  render() {
    if (this.props.data.loading) {
      return <div>loading!</div>;
    }

    if (!this.props.data.Post) {
      return (
        <div className="container">
          <h3>Uh oh, that entry doesn't exist.</h3>
          <Link href="/home">
            <a>Go home</a>
          </Link>
          <style jsx>{`
            .container {
              text-align: center;
            }
          `}</style>
        </div>
      );
    }

    return (
      <div className="post-container">
        {this.renderModal()}
        <div className="post-content">
          <span className="post-header">
            <Link
              as={`/story/${this.props.data.Post.author.username}`}
              href={`/story?username=${this.props.data.Post.author.username}`}
            >
              <a>{this.props.data.Post.author.username}</a>
            </Link>
          </span>
          {this._insertBreak()}
          {this.props.data.Post.content}
        </div>

        <div className="post-meta">
          <span className="post-meta-time">
            {moment(this.props.data.Post.createdAt).fromNow()}
          </span>
          <div className="actions">
            {this._renderDeleteIcon()}
            <Link
              as={`/entry/${this.props.id}`}
              href={`/entry?id=${this.props.id}`}
            >
              <a className="post-meta-share">
                <Icon name="share" />
              </a>
            </Link>
          </div>
        </div>
        <style jsx>{`
          .post-container {
            box-sizing: border-box;
            max-width: 500px;
            text-align: left;
            margin: 0 auto;
            margin-bottom: 20px;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0);
            background-color: #fff;
            border-radius: 3px;
            border: 1px solid #e6e6e6;
            padding: 0 16px;
          }

          .post-header {
            font-weight: bold;
            padding-right: 5px;
          }

          .post-header a {
            color: inherit;
            underline: none;
            text-decoration: none;
          }

          .post-meta {
            color: #e6e6e6;
            padding-bottom: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .post-content {
            padding: 10px 0;
            white-space: pre-wrap;
          }

          .post-meta-share {
            height: 20px;
            width: 20px;
            stroke: #e6e6e6;
            display: inline-block;
            transition: all 0.3s ease;
          }

          .post-meta-share:hover {
            stroke: #666;
          }

          .actions {
            display: flex;
            align-items: center;
          }

          div:hover {
          }
        `}</style>
      </div>
    );
  }
}

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const GET_POST = gql`
  query GetPost($id: ID!) {
    Post(id: $id) {
      id
      imageUrl
      content
      views
      createdAt
      author {
        id
        username
      }
    }
  }
`;

const ADD_VIEW = gql`
  mutation AddView($id: ID!) {
    addPostView(id: $id) {
      id
    }
  }
`;

export default compose(
  graphql(ADD_VIEW, { name: 'addViewMutation' }),
  graphql(GET_POST, {
    options: props => ({
      variables: { id: props.id },
    }),
  }),
  graphql(DELETE_POST, {
    name: 'deletePostMutation',
  }),
)(Post);
