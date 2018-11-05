import React from "react";
import PropTypes from "prop-types";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import MobileStepper from "@material-ui/core/MobileStepper";
import Hidden from "@material-ui/core/Hidden";

import withWidth from "@material-ui/core/withWidth";

const DesktopProgressStepper = props => {
  return (
    <Stepper activeStep={0}>
      <Step>
        <StepLabel>Select Image</StepLabel>
      </Step>
      <Step>
        <StepLabel>Image Processing</StepLabel>
      </Step>
      <Step>
        <StepLabel>Navigation</StepLabel>
      </Step>
    </Stepper>
  );
};

const MobileProgressStepper = props => {
  return (
    <MobileStepper
      variant="dots"
      steps={3}
      activeStep={0}
      position="static"
      style={{ justifyContent: "center" }}
    />
  );
};
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

    return (
      <>
        <Hidden xsDown>
          <DesktopProgressStepper />
        </Hidden>
        <Hidden smUp>
          <MobileProgressStepper />
        </Hidden>
      </>
    );
  }
}

ProgressStepper.propTypes = {
  /*classes: PropTypes.object.isRequired*/
};

ProgressStepper.defaultProps = {
  /*name: 'Stranger'*/
};

/*
TemplateComponent.staticStyles = {
  ...
};
*/

export default withWidth()(ProgressStepper);
