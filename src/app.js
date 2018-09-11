import React from "react";
import PropTypes from "prop-types";

import ThreeRenderer from "./threeTest";
//import { withStyles } from "@material-ui/core/styles";

//const CmpntStateless = props => <div>{props.children}</div>;

/*
const CmpntStateless2 = props =>  {
                                    const var = 0;
                                    return (
                                      <div>{props.children}</div>
                                    );
                                  }
*/

/*
const CmpntStateless3 = props => {
                                    return props.myProp? <div>{props.children}</div> : <div>{props.children}</div>
                                 }
*/

const styles = theme => ({
  stub: {}
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { classes } = this.props;

    return (
      <div>
        <ThreeRenderer />
      </div>
    );
  }
}

App.propTypes = {
  //classes: PropTypes.object.isRequired
};

//export default withStyles(styles)(App);
export default App;
