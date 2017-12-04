import React from 'react';
import Head from 'next/head';
import { initGA, logPageView } from '../lib/analytics';

/*
* General component for wrapping pages
*
*/

class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  renderFooter() {
    if (!this.props.showFooter) {
      return null;
    }
    return (
      <div className="footer">
        <div />
        <div>
          <a href="/contact">Contact</a>
          <a href="https://baroo.io/terms.html">Terms of Service</a>
          <a href="https://baroo.io/privacy.html">Privacy Policy</a>
        </div>
        <style jsx>{`
          .footer {
            width: 100%;
            height: 50px;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          a {
            color: #e6e6e6;
            underline: none;
            text-decoration: none;
            transition: all 0.3s ease;
            padding-right: 10px;
          }

          a:hover {
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="body">
          <Head>
            <title>Musory</title>
            <meta
              name="google-site-verification"
              content="ycvpoSEdC81O44cn9gmx5A-TUK2W-oBEpKpgZkgDj6A"
            />
            <meta key="og:title" property="og:title" content="Musory" />
            <meta property="og:type" content="website" />
            <meta
              property="og:description"
              content="Tell your story, your way."
              key="og:description"
            />
            <meta
              property="fb:app_id"
              key="fb:app_id"
              content="312908249186717"
            />
            <meta property="og:url" key="og:url" content="https://musory.com" />
            <meta
              property="og:image"
              key="og:image"
              content="https://s3-us-west-1.amazonaws.com/twol/images/collage.gif"
            />
            <meta
              property="og:image:height"
              key="og:image:height"
              content="1121"
            />
            <meta
              property="og:image:width"
              key="og:image:width"
              content="3280"
            />
            <meta
              name="description"
              key="description"
              content="Tell your story, your way."
            />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <meta charSet="utf-8" />
            <link
              href="https://fonts.googleapis.com/css?family=Merriweather:300,400,700"
              rel="stylesheet"
            />
            <link rel="stylesheet" href="/static/normalize.css" />
            <link rel="stylesheet" href="/static/skeleton.css" />
          </Head>
          {this.props.children}
        </div>
        {this.renderFooter()}
        <style jsx>{`
          .body {
            min-height: 100vh;
          }
        `}</style>
      </div>
    );
  }
}

export default Layout;
