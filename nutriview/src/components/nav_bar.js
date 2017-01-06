import React from 'react';

const NavBar = (props) => {
  return (
    <div>
      <button onClick={() => props.onSetRoute('dates')}>View Dates</button>
      <button onClick={() => props.onSetRoute('foods')}>View Food Details</button>
      <button onClick={() => props.onLogout()}>Logout</button>
    </div>
  );

};

export default NavBar;
