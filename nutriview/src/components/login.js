import React, {Component} from 'react';

class Login extends Component {
  render() {
    return (
      <div className="row" style={{"paddingTop": "20vh"}}>
        <div className="col-md-4"></div>
        <div className="col-md-4 col-md-offset-4" style={{"padding": "0"}}>
          <form className="form-signin" style={{"padding": "3vh", "backgroundColor": "white", "borderRadius": "1vh"}} onSubmit={e => e.preventDefault()}>
            <h2 className="form-signin-heading text-center" style={{"color": "#5cb85c"}}>Welcome to NutriView</h2>
            <input type="email" id="username" className="form-control" placeholder="Email address" required autofocus />
            <input type="password" id="password" className="form-control" placeholder="Password" required />
            <button className="btn btn-success" onClick={(e) => {e.preventDefault(); this.onLoginClick();}}>Login</button>
            <button className="btn btn-success" style={{"float": "right"}} onClick={(e) => {e.preventDefault(); this.onRegisterClick();}}>Register</button>
          </form>
        </div>
      </div>
    );
  }

  onLoginClick() {
    var loginInfo = {username: $('#username').val(), password: $('#password').val()};
    if (!loginInfo.username || !loginInfo.password) {
      return;
    }
    this.props.onLogin(loginInfo);
  }

  onRegisterClick() {
    var registerInfo = {username: $('#username').val(), password: $('#password').val()};
    if (!registerInfo.username || !registerInfo.password) {
      return;
    }
    this.props.onRegister(registerInfo);
  }

}

export default Login;

// <div>
//   <form className="form-inline" onSubmit={e => e.preventDefault()}>
//     <div className="form-group">
//       <input className="form-control" placeholder="email@example.com" type="text" id="username" autofocus />
//       <input className="form-control" placeholder="password" type="password" id="password" />
//       <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onLoginClick();}}>Login</button>
//       <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onRegisterClick();}}>Register</button>
//     </div>
//   </form>
// </div>
//
