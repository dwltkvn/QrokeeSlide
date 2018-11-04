import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const styles = theme => ({
  className0: {}
});

/*
const localStyles = {
  className1: {
    ...
  },
  className2: {
    ...
  },
};
*/

class ProgressStepper extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.state = {};
  }

  componentDidMount() {
    //window.addEventListener("event", this.handleEvent);
  }

  componentWillUnmount() {
    //window.removeEventListener("event", this.handleEvent);
  }

  /*
  handleEvent(event) {
    ...
  }
  */

  render() {
    const { classes } = this.props;
    //const { someState } = this.state;

    return <Stepper activeStep={0}>
            <Step><StepLabel>Select Image</StepLabel></Step>
            <Step><StepLabel>Image Processing</StepLabel></Step>
            <Step><StepLabel>Navigation</StepLabel></Step>
          </Stepper>;
  }
}

ProgressStepper.propTypes = {
  classes: PropTypes.object.isRequired
};

ProgressStepper.defaultProps = {
  /*name: 'Stranger'*/
};

/*
TemplateComponent.staticStyles = {
  ...
};
*/

export default withStyles(styles)(ProgressStepper);
