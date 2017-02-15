import React, {Component} from 'react';

import NavBar from './nav_bar';

class About extends Component {
  render() {
    return (
      <div>
        <NavBar
          onSetRoute={this.props.onSetRoute}
          onLogout={this.props.onLogout}
          state={this.props.state}
        />
        <div className="container" style={{"color": "white"}}>
          <h2 className="text-center" style={{"padding": "4vh"}}>About NutriView</h2>
          <p>
            NutriView helps its users to better understand their nutritional intake by acquiring food information from Nutritionix's API and creating dynamic visualizations.  Our database saves the collections of food items that our users create so that they can track their diets over time.
          </p>
          <p>
            Users can feel confident that their information is secure because of user authentication and password encryption.
          </p>
        </div>
      </div>
    );
  }

}

export default About;
