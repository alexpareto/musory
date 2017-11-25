import React from 'react';
import Button from './Button';

const Modal = props => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-text">{props.text}</div>
        <div className="modal-buttons">
          <Button text="Cancel" onClick={props.onClickCancel} />
          <Button text="Continue" onClick={props.onClickContinue} />
        </div>
      </div>
      <style jsx>
        {`
          .modal-container {
            position: fixed; /* Stay in place */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.3);
            justify-content: center;
          }

          .modal-content {
            text-align: center;
            position: relative;
            max-width: 500px;
            background-color: white;
            border-radius: 3px;
            box-sizing: border-box;
            padding: 16px;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11),
              0 1px 3px rgba(0, 0, 0, 0.08);
          }

          .modal-text {
            padding-bottom: 16px;
          }

          .modal-buttons {
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
