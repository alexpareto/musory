import React from 'react';
import withData from '../lib/withData';
import checkLoggedIn from '../lib/checkLoggedIn';
import FacebookLogin from '../components/FacebookLogin';

import Layout from './../components/Layout';
import Header from './../components/Header';
import MainContent from './../components/MainContent';
import Loading from './../components/Loading';

/*
* header page
*
*/

class About extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient);
    if (loggedInUser) {
      //redirect(context, '/home');
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
        <MainContent>
          <div className="container">
            <div className="content">
              <h1 className="about-header">about</h1>
              <p>
                People love to share. It makes sense then that there are a lot
                of online sharing platforms out there: Facebook, Twitter,
                Instagram, etc. etc. Yet, to really be clear, those platforms
                aren't sharing platforms - they're social media platforms.
              </p>
              <p>
                The idea of a "quality tweet" or a "like-to-minute ratio" on an
                Instagram post means that we're not sharing for us - we're
                sharing for our followers. That leaves half of our stories and
                thoughts forgotten in this so-called quality anxiety.
              </p>
              <p>
                musory is sharing for you. Make a photo entry. Write a three
                page story. Share a passing thought. There are no likes or
                hearts, no good or bad entries, no follower counts. Nothing is
                off limits. musory exists to help you capture all those moments
                that maybe aren't perfect enough for the big screen. After all,
                aren't those the moments that say the most?
              </p>
              <div className="fb-login">
                <FacebookLogin
                  loggedInUser={this.props.loggedInUser}
                  showLogout={false}
                />
              </div>
            </div>
          </div>
        </MainContent>
        <style jsx>{`
          .content {
            box-sizing: border-box;
            max-width: 500px;
            text-align: left;
            margin: 0 auto;
            margin-bottom: 20px;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0);
            background-color: #fff;
            border-radius: 3px;
            border: 1px solid #e6e6e6;
            padding: 16px 16px;
          }

          .fb-login {
            display: flex;
            justify-content: center;
          }
        `}</style>
      </Layout>
    );
  }
}

export default withData(About);
