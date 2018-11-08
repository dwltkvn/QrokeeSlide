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
      stateImageLoaded: false,
      stateExternalScriptLoaded: false,
    };
  }

  componentDidMount() {
    if (
      this.props.location.state === null ||
      !this.props.location.state.hasOwnProperty("image") ||
      this.props.location.state.image === undefined
    ) {
      // there is no image fowarded from welcome page ; is there an image in localStorage ?
      const localStorageSession = localStorage.getItem("savedSession");
      if(localStorageSession)
      {
        this.storedImage = JSON.parse(localStorageSession);
        this.setState({ stateImageLoaded: true });
        this.setState({ stateData: this.storedImage.data });
      }
      else
        this.setState({ stateImageLoaded: false });
    } else {
      this.setState({ stateImageLoaded: true });
      this.storedImage = this.props.location.state.image;
    }
    
    //PreviewPage.updateScripts( () => this.processImage() );
    //window.addEventListener("online", PreviewPage.updateScripts);
    PreviewPage.updateScripts( () => {
      const IJS = window.IJS;
      this.setState( {stateExternalScriptLoaded:true} );
      IJS.Image.load(this.storedImage.data)
      .then(image => {
        let grey = image.grey();
        grey.flipX();
        grey.flipY();
        this.storedImage.data = grey.toDataURL();
        this.setState( {stateData:this.storedImage.data} );
      })
      .catch(err => {
        console.log(err);
      });
    });
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
                  "url('" + this.state.stateData + "')",
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

PreviewPage.updateScripts = (cb) => {
    if (!window.navigator.onLine) {
      return;
    }
     if (!PreviewPage.isIJSLoaded()) {
      return PreviewPage.loadIJS().then(PreviewPage.updateScripts);
    }
    else
    {
      // when script is loaded, then call the callback
      cb();
    }
  }
   PreviewPage.isIJSLoaded = () => {
    return !!window.IJS;
  }
   PreviewPage.loadIJS = () => {
     console.log("loadijs");
    return PreviewPage.addElem("script", {
      async: true,
      src: "https://www.lactame.com/lib/image-js/0.21.2/image.min.js"
    });
  }
   PreviewPage.addElem = (tag, attrs) => {
    return new Promise((resolve, reject) => {
      var el = document.createElement(tag);
      el.onload = resolve;
      el.onerror = reject;
       var keys = Object.keys(attrs);
       for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        el.setAttribute(key, attrs[key]);
      }
       document.head.appendChild(el);
    });
  }
   
export default withStyles(styles)(PreviewPage);
