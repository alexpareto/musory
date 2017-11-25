import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';

import FacebookLogin from './FacebookLogin';
import Icon from './Icon';

class Header extends React.Component {
  renderStory = () => {
    if (this.props.loggedInUser) {
      return (
        <Link
          as={`/story/${this.props.loggedInUser.username}`}
          href={`/story?username=${this.props.loggedInUser.username}`}
        >
          <a>
            <div className="icon">
              <Icon name="book" />
              <style jsx>{`
                .icon {
                  stroke: #424242;
                  height: 40px;
                  width: 40px;
                  display: inline-block;
                  padding-left: 30px;
                }
              `}</style>
            </div>
          </a>
        </Link>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="holder">
        <div className="container">
          <div className="link-container">
            <div className="links">
              <Link href="/home">
                <a>
                  <div className="icon">
                    <Icon name="home" />
                  </div>
                </a>
              </Link>
              {this.renderStory()}
            </div>
            <div className="logo">twol</div>
            <div className="fb">
              <FacebookLogin
                loggedInUser={this.props.loggedInUser}
                showLogout={true}
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .icon {
            stroke: #424242;
            height: 40px;
            width: 40px;
            display: inline-block;
          }

          .logo {
            font-size: 40px;
            line-height: 40px;
            font-weight: bold;
          }

          .holder {
            width: 100%;
            position: fixed;
            top: 0;
            height: 65px;
            border-bottom: 1px solid #eee;
            background-color: #fff;
            z-index: 1;
          }

          .container {
            height: 100%;
          }

          .link-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
          }

          a {
            padding-left: 10px;
          }

          .links {
            padding-left: 10px;
          }

          .fb {
            padding-right: 20px;
          }
        `}</style>
      </div>
    );
  }
}

export default Header;
