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
          <div className="photo-background" />
        </div>
        <div className="section">
          <div className="lander-content">
            <div className="container">
              <div className="info-header">
                <h3>no likes</h3>
                <h3>no comments</h3>
                <h3>no character limits</h3>
                <h3>no numbers</h3>
                <h2>just you</h2>
              </div>
            </div>
          </div>
          <div className="fb-login">
            <FacebookLogin loggedInUser={this.props.loggedInUser} />
          </div>
        </div>
        <div className="separator" />
        <div className="section">
          <div className="lander-content">
            <div className="container">
              <h3>Share what you want.</h3>
              <p>
                Create an entry of your thoughts, the crazy thing that happened
                to you last weekend, that time you got too much sugar from
                Starbucks, that song that's stuck in your head, when you got the
                highest grade on a test, what it was like waking up, a perfectly
                normal dream you had, a passing thought about cacti, whatever.
              </p>
              <p>
                There are no likes because this is not about sharing for others
                - it's about sharing for you.
              </p>
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
            text-align: justify;
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
