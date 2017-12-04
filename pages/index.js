import React from 'react';
import withData from '../lib/withData';
import FacebookLogin from '../components/FacebookLogin';
import Link from 'next/link';

import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';

import Layout from './../components/Layout';
import Header from './../components/Header';
import Loading from './../components/Loading';

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
      return <Loading />;
    }

    return (
      <Layout>
        <Header loggedInUser={this.props.loggedInUser} url={this.props.url} />
        <div className="section">
          <div className="container">
            <div className="lander-content">
              <h1>Tell your story. Your way.</h1>
            </div>
            <div className="fb-login">
              <FacebookLogin loggedInUser={this.props.loggedInUser} />
            </div>
          </div>
        </div>
        <div className="section">
          <div className="photo-background" />
        </div>
        <div className="section">
          <div className="lander-content">
            <div className="container">
              <div className="info-header">
                <h3>No likes.</h3>
                <h3>No public comments.</h3>
                <h3>No character limits.</h3>
                <h3>No follower counts.</h3>
                <h3>No numbers.</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="separator" />
        <div className="section">
          <div className="lander-content">
            <div className="container">
              <h3>Share what you want.</h3>
              <p>
                Create a muse of a passing thought, a casual selfie, whatever.
              </p>
              <p>There are no likes or hearts, no good or bad muses.</p>
              <p>
                It's not about sharing for others - it's about sharing for you.
              </p>
              <div className="fb-login">
                <FacebookLogin
                  loggedInUser={this.props.loggedInUser}
                  showLogout={false}
                />
              </div>
              <p>
                <Link href="/about">
                  <a>Learn more</a>
                </Link>
              </p>
            </div>
          </div>
        </div>
        <style jsx>{`
          .section {
            min-height: 100vh;
            width: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            background-color: #fff;
          }

          .photo-background {
            height: 100vh;
            width: 100%;
            background-image: url('https://s3-us-west-1.amazonaws.com/twol/images/collage.gif');
            background-size: cover;
            background-position: center;
          }

          h3 {
            text-align: center;
          }

          p {
            text-align: center;
            font-size: 18px;
          }

          .info-header {
            text-align: center;
          }

          .overlay {
            height: 100%;
            width: 100%;
            background-color: rgba(0,0,0,0.6);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
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
