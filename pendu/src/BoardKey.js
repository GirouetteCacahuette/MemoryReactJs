import React from 'react';

import './BoardKey.css';

const BoardKey = ({key, feedback, onClick}) => (
  <div className={`key ${feedback}`} onClick={() => onClick(key)}>
      <span className="key">{key}</span>
  </div>
);