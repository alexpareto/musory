import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import autosize from 'autosize';
import Link from 'next/link';
import Autolinker from 'autolinker';

import Button from './Button';
import UploadImage from './UploadImage';
import Icon from './Icon';

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      showAddReply: false,
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

  _handleKeyUp = e => {
    if (e.key === 'Enter') {
      this._handleCreateReply();
    }
  };

  _renderAddReply = () => {
    if (!this.state.showAddReply) {
      return false;
    }
    return (
      <div>
        <input
          ref={ref => {
            this.textArea = ref;
          }}
          name="content"
          placeholder={
            this.props.placeholder
              ? this.props.placeholder
              : 'Privately reply...'
          }
          value={this.state.content}
          onChange={this._handleInputChange}
          onKeyPress={this._handleKeyUp}
        />
        <style jsx>{`
          div {
            padding-left: 20px;
          }

          input {
            width: 100%;
            resize: none;
            border: 1px solid #eee;
            outline: 0px none transparent;
            transition: all 0.3s ease;
            padding: 3px 16px;
            box-sizing: border-box;
            border-radius: 3px;
            overflow: hidden;
            height: 30px;
          }

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
  };

  _onReplyClick = () => {
    this.setState({
      showAddReply: !this.state.showAddReply,
    });
  };

  _handleCreateReply = async () => {
    this.textArea.blur();
    const loggedInUser = this.props.loggedInUser;
    // don't allow if user is not logged in
    if (!loggedInUser) {
      console.warn('Only logged in users can create new posts');
      return;
    }

    const { content } = this.state;
    const authorId = loggedInUser.id;
    const commentId = this.props.comment.id;

    this.setState({
      content: '',
      imageUrl: '',
    });

    await this.props.createSubComment({
      variables: { content, commentId, authorId },
    });

    this.props.onPost();
  };

  render() {
    return (
      <div key={this.props.comment.id}>
        <span className="post-header">
          <Link
            as={`/story/${this.props.comment.author.username}`}
            href={`/story?username=${this.props.comment.author.username}`}
          >
            <a>{this.props.comment.author.username}</a>
          </Link>
        </span>
        <span
          dangerouslySetInnerHTML={{
            __html: Autolinker.link(this.props.comment.content),
          }}
        />
        <span className="icon" onClick={this._onReplyClick}>
          <Icon name="reply" />
        </span>
        <div>
          {this.props.comment.replies.map(reply => {
            return (
              <div key={reply.id}>
                <span className="post-header">
                  <Link
                    as={`/story/${reply.author.username}`}
                    href={`/story?username=${reply.author.username}`}
                  >
                    <a>{reply.author.username}</a>
                  </Link>
                </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: Autolinker.link(reply.content),
                  }}
                />
              </div>
            );
          })}
          {this._renderAddReply()}
        </div>
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
  }
}

const CREATE_SUB_COMMENT = gql`
  mutation CreateSubComment(
    $content: String!
    $commentId: ID!
    $authorId: ID!
  ) {
    createSubComment(
      content: $content
      commentId: $commentId
      authorId: $authorId
    ) {
      id
    }
  }
`;

export default graphql(CREATE_SUB_COMMENT, { name: 'createSubComment' })(
  Comment,
);
