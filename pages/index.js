import React from 'react';
import withData from '../lib/withData';
import FacebookLogin from '../components/FacebookLogin';

import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

import Layout from './../components/Layout';

/*
* landing/login page
*
*/

class Index extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (loggedInUser) {
      redirect(context, '/home');
    }

    return { loggedInUser };
  }

  render() {
    if (this.props.data && this.props.data.loading) {
      return <div>loading!</div>;
    }

    return (
      <Layout>
        <div className="section">
          <div className="container">
            <div className="lander-content">
              <h1>tell your story. your way.</h1>
            </div>
            <div className="fb-login">
              <FacebookLogin loggedInUser={this.props.loggedInUser} />
            </div>
          </div>
        </div>
        <div className="section">
          <div className="lander-content">
            <div className="container">
              <h1>how it works</h1>
              <p>
                twol is about sharing your story in your own way. Create an
                entry for your thoughts, the crazy thing that happened to you
                last weekend, a picture of your cat, your fears, your goals,
                your coffee, a new pen, share links, whatever. There are no
                likes because this isn't about sharing for others - it's about
                sharing for you.
              </p>
              <h3>1. no likes</h3>
              <h3>2. no comments</h3>
              <h3>3. no character limits</h3>
              <h3>4. no titles</h3>
              <h3>5. all public</h3>
            </div>
          </div>
          <div className="fb-login">
            <FacebookLogin loggedInUser={this.props.loggedInUser} />
          </div>
        </div>
        <style jsx>{`
          .section {
            min-height: 100vh;
            width: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
          }

          .fb-login {
            margin: 30px;
            display: flex;
            align-items: center;
            justify-content center;
          }

          .lander-content h1 {
            text-align: center;
          }
        `}</style>
      </Layout>
    );
  }
}

export default withData(Index);
