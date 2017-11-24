import React from 'react';
import withData from '../lib/withData';
import checkLoggedIn from '../lib/checkLoggedIn';
import FacebookLogin from '../components/FacebookLogin';
import redirect from '../lib/redirect';

import Layout from './../components/Layout';

/*
* landing/login page
*
*/

class Index extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (loggedInUser) {
      //redirect(context, '/home');
    }

    return { loggedInUser };
  }

  render() {
    if (this.props.data && this.props.data.loading) {
      return <div>loading!</div>;
    }

    return (
      <Layout>
        <section>
          <div className="lander-content">
            <h1>tell your story, your way</h1>
          </div>
          <div className="fb-login">
            <FacebookLogin loggedInUser={this.props.loggedInUser} />
          </div>
        </section>
        <section>
          <div className="lander-content">
            <h1>the rules</h1>
            <h3>1. no likes</h3>
            <h3>2. no comments, only dm's</h3>
            <h3>3. no character limits</h3>
            <h3>4. no titles</h3>
            <h3>5. put your thoughts center stage</h3>
          </div>
          <div className="fb-login">
            <FacebookLogin loggedInUser={this.props.loggedInUser} />
          </div>
        </section>
        <style jsx>{`
          section {
            height: 100vh;
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

          .lander-content {
            padding-left: 10%;
          }

          .lander-content h1 {
            font-size: 100px;
          }

          .lander-content h3 {
            font-size: 40px;
          }
        `}</style>
      </Layout>
    );
  }
}

export default withData(Index);
