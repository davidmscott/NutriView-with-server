import React, {Component} from 'react';

class Login extends Component {
  render() {
    return (
      <form className="form-inline" onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input className="form-control" placeholder="email@example.com" type="text" id="username" autofocus />
          <input className="form-control" placeholder="password" type="text" id="password" />
          <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onButtonClick();}}>Login</button>
        </div>
      </form>
    );
  }

  onButtonClick() {
    var loginInfo = {username: $('#username').val(), password: $('#password').val()};
    if (!loginInfo.username || !loginInfo.password) {
      return;
    }
    $('#username').val('');
    $('#password').val('');
    this.props.onLogin(loginInfo);
  }

}

export default Login;
