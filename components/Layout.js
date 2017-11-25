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
          <title>twol</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta charset="utf-8" />
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
