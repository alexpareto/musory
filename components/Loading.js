import React from 'react';
import Layout from './Layout';

const Loading = props => {
  return (
    <Layout showFooter={false}>
      <div className="loading-container">
        <h1>Musory</h1>
        <h4>Loading...</h4>
        <style jsx>{`
          .loading-container {
            height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            margin-bottom: -80px;
            z-index: 1;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Loading;
