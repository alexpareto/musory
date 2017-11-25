import React from 'react';

const Button = props => {
  return (
    <span>
      <button className={props.className} onClick={props.onClick}>
        {props.text}
      </button>
      <style jsx>
        {`
          button {
            height: 30px;
            width: 125px;
            background-color: rgba(0, 0, 0, 0);
            border: 1px solid #e6e6e6;
            font-weight: bold;
            transition: all 0.3s ease;
          }

          button:hover {
            border: 1px solid #666;
          }
        `}
      </style>
    </span>
  );
};

export default Button;
