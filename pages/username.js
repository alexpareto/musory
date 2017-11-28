import React from 'react';
import gql from 'graphql-tag';

import withData from '../lib/withData';
import redirect from './../lib/redirect';
import checkLoggedIn from './../lib/checkLoggedIn';

import Layout from './../components/Layout';
import MainContent from './../components/MainContent';
import Post from './../components/Post';
import CreatePost from './../components/CreatePost';
import AddUsername from './../components/AddUsername';
import Header from './../components/Header';

/*
* Feed/home page
*
*/

class Home extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (!loggedInUser) {
      redirect(context, '/');
    } else if (loggedInUser.username) {
      redirect(context, '/home');
    }

    return { loggedInUser };
  }

  render() {
    return (
      <Layout>
        <div className="username-holder">
          <div>
            <span>
              <h1>One more thing...</h1>
            </span>
            <AddUsername loggedInUser={this.props.loggedInUser} />
          </div>
        </div>
        <style jsx>{`
          .username-holder {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
        `}</style>
      </Layout>
    );
  }
}

export default withData(Home);
