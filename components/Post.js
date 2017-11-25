import React from 'react';
import Link from 'next/link';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import Icon from './Icon';

class Post extends React.Component {
  componentDidMount() {
    /*
    this.props
      .addViewMutation({
        variables: { id: this.props.post.id },
      })
      .then(response => {
        console.log('add view success!');
      })
      .catch(error => {
        console.error(error);
      });
    */
  }

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
          <Link
            as={`/entry/${this.props.id}`}
            href={`/entry?id=${this.props.id}`}
          >
            <a>
              <div className="post-meta-share">
                <Icon name="share" />
              </div>
            </a>
          </Link>
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
          }

          .post-content {
            padding: 10px 0;
          }

          .post-meta-share {
            height: 20px;
            width: 20px;
            stroke: #e6e6e6;
            display: inline-block;
            float: right;
          }

          div:hover {
          }
        `}</style>
      </div>
    );
  }
}

const GET_POST = gql`
  query GetPost($id: ID!) {
    Post(id: $id) {
      id
      imageUrl
      content
      views
      createdAt
      author {
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
)(Post);
