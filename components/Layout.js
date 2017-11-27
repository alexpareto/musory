import React from 'react';
import Head from 'next/head';
/*
* General component for wrapping pages
*
*/

class Layout extends React.Component {
  render() {
    return (
      <div>
        <Head>
          <title>Musory</title>
          <meta
            key="og:title"
            name="og:title"
            property="og:title"
            content="Musory"
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            content="Tell your story, your way."
            key="og:description"
          />
          <meta
            property="og:image"
            key="og:image"
            content="https://s3-us-west-1.amazonaws.com/twol/images/collage.gif"
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
    );
  }
}

export default Layout;
