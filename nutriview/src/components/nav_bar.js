import React from 'react';

const NavBar = (props) => {
  return (
    <div className="navbar navbar-default fixed-top" style={{"backgroundColor": "white", "borderBottom": "2px solid #5cb85c"}}>
      <div className="container">
        <div className="navbar-header">
          <div className="navbar-brand" style={{"color": "#5cb85c", "fontWeight": "bold"}}>
            NutriView
            <span style={{"color": "auto", "fontWeight": "200", "fontSize": "0.5em"}}>
              Powered by <a href="http://www.nutritionix.com/api" target="_blank">Nutritionix API</a>
            </span>
          </div>
          {!props.state.token && props.state.route !== 'login' ? <button className="btn btn-success navbar-btn" style={{"float": "right", "marginRight": "2vh"}} onClick={() => props.onSetRoute('login')}>Login</button> : null}
          {props.state.token && props.state.route !== 'login' ? <button className="btn btn-success navbar-btn" style={{"float": "right", "marginRight": "2vh"}} onClick={() => props.onLogout()}>Logout</button> : null}
          {props.state.token && props.state.route !== 'dates' ? <button className="btn btn-success navbar-btn" style={{"float": "right", "marginRight": "2vh"}} onClick={() => props.onSetRoute('dates')}>Collections</button> : null}
          {props.state.route !== 'about' ? <button className="btn btn-success navbar-btn" style={{"float": "right", "marginRight": "2vh"}} onClick={() => props.onSetRoute('about')}>About</button> : null}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
