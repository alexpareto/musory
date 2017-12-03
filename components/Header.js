import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';

import FacebookLogin from './FacebookLogin';
import Icon from './Icon';

class Header extends React.Component {
  renderLinks = () => {
    if (this.props.loggedInUser) {
      return (
        <div>
          <Link
            as={`/story/${this.props.loggedInUser.username}`}
            href={`/story?username=${this.props.loggedInUser.username}`}
          >
            <a>
              <div className="icon">
                <Icon name="book" />
              </div>
            </a>
          </Link>
          <Link href="/find">
            <a>
              <div className="icon">
                <Icon name="search" />
              </div>
            </a>
          </Link>
          <style jsx>{`
            .icon {
              stroke: #424242;
              height: 40px;
              width: 40px;
              display: inline-block;
            }
          `}</style>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="holder">
        <div className="container">
          <div className="link-container">
            <div className="center-element" />
            <Link href="/home">
              <a>
                <div className="logo">Musory</div>
              </a>
            </Link>
            <div className="fb">
              <FacebookLogin
                loggedInUser={this.props.loggedInUser}
                showLogout={false}
              />
              <div className="links">{this.renderLinks()}</div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .logo {
            font-size: 20px;
            line-height: 40px;
            font-weight: bold;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          a:hover {
            text-decoration: none;
          }

          .center-element {
            display: none;
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
            justify-content: space-around;
            height: 100%;
          }

          .links {
            width: 100%;
            justify-content: flex-end;
          }

          .fb {
            width: 200px;
          }

          /* Larger than mobile */
          @media (min-width: 400px) {
            .links {
              width: 80px;
              display: inline-block;
            }

            .center-element {
              display: inline-block;
              width: 80px;
            }

            .fb {
              width: 80px;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Header;
