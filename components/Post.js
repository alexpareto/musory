import React from 'react';
import Link from 'next/link';
import moment from 'moment';

class Post extends React.Component {
  render() {
    return (
      <div className="post-container">
        <div className="post-content">
          <span className="post-header">
            <Link
              as={`/story/${this.props.post.author.username}`}
              href={`/story?username=${this.props.post.author.username}`}
            >
              <a>{this.props.post.author.username}</a>
            </Link>
          </span>
          {this.props.post.content}
        </div>
        <div className="post-meta">
          {moment(this.props.post.createdAt).fromNow()}
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

          div:hover {
          }
        `}</style>
      </div>
    );
  }
}

export default Post;
