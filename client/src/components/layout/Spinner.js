import React, { Fragment } from 'react';

const Spinner = () => (
  <Fragment>
    <img
      src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt="Loading..."
    />
  </Fragment>
);

export default Spinner;