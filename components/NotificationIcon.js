import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';

import Icon from './Icon';

const NotificationIcon = props => {
  if (!props.data.loading) {
    console.log(props.data);
  }
  if (!props.data.loading && props.data._allNotificationsMeta.count != 0) {
    return (
      <Link href="/notifications">
        <div className="icon icon-circle-fill">
          <Icon name="alert-circle" />
          <style jsx>{`
            .icon {
              stroke: #424242;
              height: 40px;
              width: 40px;
              display: inline-block;
              cursor: pointer;
            }

            .icon-circle-fill {
              stroke: #fff;
              fill: #e5625e;
            }
          `}</style>
        </div>
      </Link>
    );
  }
  return (
    <Link href="/notifications">
      <div className="icon icon-circle">
        <Icon name="circle" />
        <style jsx>{`
          .icon {
            stroke: #424242;
            height: 40px;
            width: 40px;
            display: inline-block;
            cursor: pointer;
          }

          .icon-circle {
            fill: none;
          }
        `}</style>
      </div>
    </Link>
  );
};

const GET_NOTIFICATION_COUNT = gql`
  query getNotificationCount($id: ID!) {
    _allNotificationsMeta(filter: { targetUser: { id: $id }, viewed: false }) {
      count
    }
  }
`;

export default graphql(GET_NOTIFICATION_COUNT, {
  options: props => ({
    variables: { id: props.loggedInUser.id },
  }),
})(NotificationIcon);
