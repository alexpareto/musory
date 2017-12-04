import React from 'react';
import Link from 'next/link';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import Autolinker from 'autolinker';

import Icon from './Icon';
import Modal from './Modal';
import CreateComment from './CreateComment';
import Comment from './Comment';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderDeleteModal: false,
      showAddComment: false,
      showAddAfterThought: false,
      showDelete: false,
    };
  }

  componentDidMount() {}

  _renderContent = () => {
    if (this.props.data.Post.imageUrl) {
      return (
        <div>
          <div className="post-header">
            <Link
              as={`/story/${this.props.data.Post.author.username}`}
              href={`/story?username=${this.props.data.Post.author.username}`}
            >
              <a>{this.props.data.Post.author.username}</a>
            </Link>
          </div>
          <div>
            <img src={this.props.data.Post.imageUrl} />
          </div>
          <div className="post-content">{this.props.data.Post.content}</div>
          <style jsx>{`
            img {
              width: 100%;
              image-orientation: from-image;
            }

            .post-header {
              font-weight: bold;
              padding-right: 5px;
              padding-bottom: 16px;
              padding: 10px 16px;
            }

            .post-header a {
              color: inherit;
              underline: none;
              text-decoration: none;
            }

            .post-content {
              padding: 10px 16px;
              white-space: pre-line;
            }
          `}</style>
        </div>
      );
    }

    return (
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
        <span
          dangerouslySetInnerHTML={{
            __html: Autolinker.link(this.props.data.Post.content),
          }}
        />
        <style jsx>{`
          .post-header {
            font-weight: bold;
            padding-right: 5px;
          }

          .post-header a {
            color: inherit;
            underline: none;
            text-decoration: none;
          }

          .post-content {
            padding: 10px 16px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        `}</style>
      </div>
    );
  };

  _renderAfterThought = afterThought => {
    return (
      <div key={afterThought.id}>
        <span className="post-header">
          <Link
            as={`/story/${afterThought.author.username}`}
            href={`/story?username=${afterThought.author.username}`}
          >
            <a>{afterThought.author.username}</a>
          </Link>
        </span>
        <span
          dangerouslySetInnerHTML={{
            __html: Autolinker.link(afterThought.content),
          }}
        />
        <style jsx>{`
          div {
            padding: 3px 18px;
          }
          .post-header {
            font-weight: bold;
            padding-right: 5px;
          }

          .icon {
            height: 20px;
            width: 20px;
            stroke: #e6e6e6;
            display: inline-block;
            transition: all 0.3s ease;
            padding-left: 7px;
            cursor: pointer;
            float: right;
          }

          .icon:hover {
            stroke: #666;
          }

          .post-header a {
            color: inherit;
            underline: none;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  };

  _renderCreateAfterThought = () => {
    if (!this.state.showAddAfterThought) {
      return null;
    }
    return (
      <div className="add-comment">
        <CreateComment
          placeholder="Add a public after thought..."
          postId={this.props.id}
          loggedInUser={this.props.loggedInUser}
          onPost={this._refreshComments}
        />
      </div>
    );
  };

  _renderAfterThoughts = () => {
    if (this.props.afterThoughts.loading) {
      return <span />;
    } else if (
      this.props.afterThoughts.allComments.length == 0 &&
      (this.props.loggedInUser.id !== this.props.data.Post.author.id ||
        !this.state.showAddAfterThought)
    ) {
      return null;
    }
    return (
      <div>
        <hr />
        {this.props.afterThoughts.allComments.map(comment =>
          this._renderAfterThought(comment),
        )}
        {this._renderCreateAfterThought()}
        <style jsx>{`
          hr {
            margin: 0;
            margin-bottom: 10px;
            color: #e6e6e6;
            background-color: #e6e6e6;
          }

          .comments-text {
            color: #e6e6e6;
            padding: 0 16px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          div {
            padding-bottom: 10px;
          }
        `}</style>
      </div>
    );
  };

  _renderCreateComment = () => {
    if (!this.state.showAddComment) {
      return null;
    }
    return (
      <div className="add-comment">
        <CreateComment
          postId={this.props.id}
          loggedInUser={this.props.loggedInUser}
          onPost={this._refreshComments}
        />
      </div>
    );
  };

  _renderComments = () => {
    if (this.props.comments.loading) {
      return <span />;
    } else if (
      this.props.comments.allComments.length == 0 &&
      (this.props.loggedInUser.id === this.props.data.Post.author.id ||
        !this.state.showAddComment)
    ) {
      return null;
    }
    return (
      <div>
        <hr />
        {this.props.comments.allComments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            loggedInUser={this.props.loggedInUser}
            onPost={this._refreshComments}
          />
        ))}
        {this._renderCreateComment()}
        <style jsx>{`
          hr {
            margin: 0;
            margin-bottom: 10px;
            color: #e6e6e6;
            background-color: #e6e6e6;
          }

          .comments-text {
            color: #e6e6e6;
            padding: 0 16px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          div {
            padding-bottom: 10px;
          }
        `}</style>
      </div>
    );
  };

  _refreshComments = () => {
    this.props.comments.refetch();
    this.props.afterThoughts.refetch();
  };

  _renderDeleteIcon = () => {
    if (
      this.props.loggedInUser &&
      this.props.data.Post &&
      this.props.data.Post.author.id == this.props.loggedInUser.id &&
      this.state.showDelete
    ) {
      return (
        <span className="post-meta-x" href="#" onClick={this.onClickDelete}>
          <Icon name="x" />
          <style jsx>
            {`
              .post-meta-x {
                position: absolute;
                top: 2px;
                right: 2px;
                height: 20px;
                width: 20px;
                stroke: #e6e6e6;
                cursor: pointer;
                padding-left: 7px;
                display: inline-block;
                transition: all 0.3s ease;
              }

              .post-meta-x:hover {
                stroke: #666;
              }
            `}
          </style>
        </span>
      );
    }
    return null;
  };

  _onClickPlus = () => {
    if (this.props.loggedInUser.id === this.props.data.Post.author.id) {
      this.setState({ showAddAfterThought: !this.state.showAddAfterThought });
    } else {
      this.setState({ showAddComment: !this.state.showAddComment });
    }
  };

  _renderPost = () => {
    if (this.props.data.loading) {
      return <span>Loading</span>;
    }

    return (
      <div>
        {this._renderContent()}
        <div className="post-meta">
          <span className="post-meta-time">
            {moment(this.props.data.Post.createdAt).fromNow()}
          </span>
          <div className="actions">
            <span onClick={this._onClickPlus} className="post-meta-icon">
              <Icon name="message" />
            </span>
            <Link
              as={`/muse/${this.props.id}`}
              href={`/muse?id=${this.props.id}`}
            >
              <span className="post-meta-icon">
                <Icon name="share" />
              </span>
            </Link>
          </div>
        </div>
        {this._renderAfterThoughts()}
        {this._renderComments()}

        <style jsx>{`
          .post-meta {
            color: #e6e6e6;
            padding: 0 16px;
            padding-bottom: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .post-meta-icon {
            height: 20px;
            width: 20px;
            stroke: #e6e6e6;
            display: inline-block;
            transition: all 0.3s ease;
            padding-left: 7px;
            cursor: pointer;
          }

          .post-meta-icon:hover {
            stroke: #666;
          }

          .actions {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        `}</style>
      </div>
    );
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
    this.props.onChange();
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

  onMouseEnter = event => {
    this.setState({
      showDelete: true,
    });
  };

  onMouseLeave = event => {
    this.setState({
      showDelete: false,
    });
  };

  render() {
    if (!this.props.data.Post && !this.props.data.loading) {
      return (
        <div className="container">
          <h3>Uh oh, that muse doesn't exist.</h3>
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
      <div
        className="post-container"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this._renderDeleteIcon()}
        {this.renderModal()}
        {this._renderPost()}
        <style jsx>{`
          .post-container {
            box-sizing: border-box;
            max-width: 500px;
            text-align: left;
            margin: 0 auto;
            margin-bottom: 20px;
            border: 1px solid rgba(0, 0, 0, 0);
            background-color: #fff;
            border-radius: 3px;
            border: 1px solid #e6e6e6;
            position: relative;
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

const GET_COMMENTS = gql`
  query GetComments($postId: ID!, $loggedInUser: ID!) {
    allComments(
      filter: {
        OR: [
          {
            post: { id: $postId }
            author: { id: $loggedInUser, posts_none: { id: $postId } }
          }
          {
            post: { id: $postId, author: { id: $loggedInUser } }
            author: { posts_none: { id: $postId } }
          }
        ]
      }
      orderBy: createdAt_ASC
    ) {
      id
      content
      replies {
        id
        content
        author {
          username
        }
      }
      author {
        username
      }
    }
  }
`;

const GET_AFTER_THOUGHTS = gql`
  query GetComments($postId: ID!) {
    allComments(
      filter: { post: { id: $postId }, author: { posts_some: { id: $postId } } }
      orderBy: createdAt_ASC
    ) {
      id
      content
      author {
        username
      }
    }
  }
`;

export default compose(
  graphql(ADD_VIEW, { name: 'addViewMutation' }),
  graphql(GET_POST, {
    options: props => ({
      variables: { id: props.id },
    }),
    name: 'data',
  }),
  graphql(GET_COMMENTS, {
    options: props => ({
      variables: { postId: props.id, loggedInUser: props.loggedInUser.id },
    }),
    name: 'comments',
  }),
  graphql(GET_AFTER_THOUGHTS, {
    options: props => ({
      variables: { postId: props.id },
    }),
    name: 'afterThoughts',
  }),
  graphql(DELETE_POST, {
    name: 'deletePostMutation',
  }),
)(Post);
