import React from 'react';
/*
* General component for wrapping pages
*
*/

class MainContent extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
        <style jsx>{`
          div {
            margin-top: 105px;
          }
        `}</style>
      </div>
    );
  }
}

export default MainContent;
