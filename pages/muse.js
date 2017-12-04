import React from 'react';
import Head from 'next/head';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/withData';
import checkLoggedIn from './../lib/checkLoggedIn';

import Post from './../components/Post';
import Header from './../components/Header';
import Layout from './../components/Layout';
import MainContent from './../components/MainContent';
import Loading from './../components/Loading';

/*
* Individual post page
*
*/

class PostPage extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    return { loggedInUser };
  }

  render() {
    if (this.props.data.Post) {
      return (
        <Layout showFooter={true}>
          <Head>
            <meta
              name="og:title"
              property="og:title"
              content={
                this.props.data.Post.author.username + "'s entry on Musory"
              }
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:image"
              key="og:image"
              content={this.props.data.Post.imageUrl}
            />
            <meta
              property="og:description"
              content={this.props.data.Post.content}
              key="og:description"
            />
            <meta
              name="description"
              key="description"
              content={this.props.data.Post.content}
            />
          </Head>
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
    return <Loading />;
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
        id
        username
      }
    }
  }
`;

const component = graphql(GET_POST, {
  options: props => ({
    variables: { id: props.url.query.id },
  }),
})(PostPage);

export default withData(component);
