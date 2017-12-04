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
      <Layout showFooter={true}>
        <Header loggedInUser={this.props.loggedInUser} url={this.props.url} />
        <MainContent>
          <div className="container">
            <div className="content">
              <h1 className="about-header">Contact</h1>
              <div
                className="typeform-widget"
                data-url="https://alexpareto.typeform.com/to/L35Ryw"
                style={{ width: '100%', height: '500px' }}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `(function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm", b="https://embed.typeform.com/"; if(!gi.call(d,id)) { js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })()`,
                }}
              />
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

          h1 {
            text-align: center;
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
