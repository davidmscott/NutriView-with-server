import React from 'react';

const NavBar = (props) => {
  if (props.showDatesLink) {
    return (
      <div className="navbar navbar-default navbar-fixed-top" style={{"backgroundColor": "white"}}>
        <div className="container">
          <div className="navbar-header">
            <div className="navbar-brand" style={{"color": "#5cb85c", "fontWeight": "bold"}}>
              NutriView
              <span style={{"color": "auto", "fontWeight": "200", "fontSize": "0.5em"}}>
                Powered by <a href="http://www.nutritionix.com/api" target="_blank">Nutritionix API</a>
              </span>
            </div>
            <button className="btn btn-success navbar-btn" style={{"float": "right", "marginRight": "2vh"}} onClick={() => props.onLogout()}>Logout</button>
            <button className="btn btn-success navbar-btn" style={{"float": "right", "marginRight": "2vh"}} onClick={() => props.onSetRoute('dates')}>View Collections</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="navbar navbar-default navbar-fixed-top" style={{"backgroundColor": "white"}}>
        <div className="container">
          <div className="navbar-header">
            <div className="navbar-brand" style={{"color": "#5cb85c", "fontWeight": "bold"}}>
              NutriView
              <span style={{"color": "auto", "fontWeight": "200", "fontSize": "0.5em"}}>
                Powered by <a href="http://www.nutritionix.com/api" target="_blank">Nutritionix API</a>
              </span>
            </div>
            <button className="btn btn-success navbar-btn" style={{"float": "right", "marginRight": "2vh"}} onClick={() => props.onLogout()}>Logout</button>
          </div>
        </div>
      </div>
    );
  }

};

export default NavBar;
