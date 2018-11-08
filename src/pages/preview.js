import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Layout from "../components/layout";
import ProgressStepper from "../components/progressStepper";

const styles = theme => ({
  margedBtn: { margin: theme.spacing.unit * 2 },
  heroBorder: {
    borderTop: "5px solid " + theme.palette.primary.main,
    borderBottom: "5px solid " + theme.palette.primary.main
  }
  //heroBorder : { borderStyle: "solid", borderWidth: "5px"}
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

class PreviewPage extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.state = {
      stateImageLoaded: false
    };
  }

  componentDidMount() {
    if (
      this.props.location.state === null ||
      !this.props.location.state.hasOwnProperty("image") ||
      this.props.location.state.image === undefined
    ) {
      console.log("No location state");
      const localStorageSession = localStorage.getItem("savedSession");
      if(localStorageSession)
      {
        console.log("Session available");
        this.storedImage = JSON.parse(localStorageSession);
        this.setState({ stateImageLoaded: true });
      }
      else
        this.setState({ stateImageLoaded: false });
    } else {
      this.setState({ stateImageLoaded: true });
      this.storedImage = this.props.location.state.image;
    }
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
      <Layout>
        {!this.state.stateImageLoaded ? null : (
          <div
            style={{
              /*border: "5px solid black",*/
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              flex: 1
            }}
          >
            <div
              className={classes.heroBorder}
              style={{
                flex: 1,
                //height:"100px",
                backgroundImage:
                  "url('" + this.storedImage.data + "')",
                backgroundSize: "cover"
              }}
            />
            <ProgressStepper activeStep={1}/>
          </div>
        )}
      </Layout>
    );
  }
}

PreviewPage.propTypes = {
  //classes: PropTypes.object.isRequired
};

PreviewPage.defaultProps = {
  /*name: 'Stranger'*/
};

/*
TemplateComponent.staticStyles = {
  ...
};
*/

export default withStyles(styles)(PreviewPage);
