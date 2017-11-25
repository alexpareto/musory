import React from 'react';

import withData from '../lib/withData';
import checkLoggedIn from './../lib/checkLoggedIn';

import Post from './../components/Post';
import Header from './../components/Header';
import Layout from './../components/Layout';
import MainContent from './../components/MainContent';

/*
* Individual post page
*
*/

class PostPage extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    return { loggedInUser };
  }

  onComponentWillMount() {
    this.props.data.GetPost();
  }

  render() {
    return (
      <Layout>
        <Header loggedInUser={this.props.loggedInUser} />
        <MainContent>
          <div>
            <Post
              id={this.props.url.query.id}
              loggedInUser={this.props.loggedInUser}
            />
          </div>
        </MainContent>
      </Layout>
    );
  }
}

export default withData(PostPage);
