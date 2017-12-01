import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Waypoint from 'react-waypoint';
import Router from 'next/router';

import withData from '../lib/withData';
import redirect from './../lib/redirect';
import checkLoggedIn from './../lib/checkLoggedIn';

import Layout from './../components/Layout';
import MainContent from './../components/MainContent';
import Post from './../components/Post';
import CreatePost from './../components/CreatePost';
import AddUsername from './../components/AddUsername';
import Header from './../components/Header';
import Loading from './../components/Loading';

/*
* Feed/home page
*
*/

class Home extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (!loggedInUser) {
      redirect(context, '/');
    } else if (!loggedInUser.username) {
      redirect(context, '/username');
    }

    return { loggedInUser };
  }

  _refreshPosts = () => {
    this.props.data.refetch();
  };

  _renderNoPosts = () => {
    if (this.props.data.allPosts.length === 0) {
      return (
        <p>
          This is your feed. It includes everyone that you follow and you! Try
          making a muse above!
          <style jsx>{`
            p {
              text-align: center;
            }
          `}</style>
        </p>
      );
    }
  };

  render() {
    if (this.props.data.loading) {
      return <Loading />;
    }
    return (
      <Layout>
        <Header loggedInUser={this.props.loggedInUser} url={this.props.url} />
        <MainContent>
          <div className="container page">
            <CreatePost
              loggedInUser={this.props.loggedInUser}
              onPost={this._refreshPosts}
            />
            {this.props.data.allPosts.map(post => (
              <Post
                key={post.id}
                id={post.id}
                loggedInUser={this.props.loggedInUser}
                onChange={this._refreshPosts}
              />
            ))}
            {this._renderNoPosts()}
            <div style={{ height: 10 }}>
              <Waypoint onEnter={this.props.loadMorePosts} threshold={0} />
            </div>
          </div>
        </MainContent>
      </Layout>
    );
  }
}

const ALL_POSTS = gql`
  query AllPostsQuery($id: ID!, $first: Int!, $skip: Int!) {
    allPosts(
      filter: {
        OR: [
          { author: { isFollowedBy_some: { id: $id } } }
          { author: { id: $id } }
        ]
      }
      orderBy: createdAt_DESC
      first: $first
      skip: $skip
    ) {
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

export default compose(
  withData,
  graphql(ALL_POSTS, {
    options: props => ({
      variables: {
        id: props.loggedInUser.id,
        skip: 0,
        first: 5,
      },
    }),
    props: ({ data }) => ({
      data,
      loadMorePosts: () => {
        return data.fetchMore({
          variables: {
            skip: data.allPosts.length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return Object.assign({}, previousResult, {
              // Append the new posts results to the old one
              allPosts: [
                ...previousResult.allPosts,
                ...fetchMoreResult.allPosts,
              ],
            });
          },
        });
      },
    }),
  }),
)(Home);
