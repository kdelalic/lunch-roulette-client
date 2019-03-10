import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import './Message.css';

const Message = props => {
  const { message } = props;

  return (
    <div className="MessageComponent">
      <CircularProgress className="circular-progress" />
      <h2 id="message">{message}</h2>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string.isRequired
};

export default Message;
