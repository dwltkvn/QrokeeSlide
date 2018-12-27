import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Layout from "../components/layout";
import ProgressStepper from "../components/progressStepper";


import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from "@material-ui/core/Button";

const styles = theme => ({
  margedBtn: { margin: theme.spacing.unit * 2 },
  heroBorder: {
    borderTop: "5px solid " + theme.palette.primary.main,
    borderBottom: "5px solid " + theme.palette.primary.main
  }
  //heroBorder : { borderStyle: "solid", borderWidth: "5px"}
});

const grayAlgo = ["none", "luma709" , "luma601" , "maximum" , "minimum" , "average" , "minmax" , "red" , "green" , "blue" , "cyan" , "magenta" , "yellow" , "black" , "hue" , "saturation" , "lightness" ];
const thresholdAlgo = ['none', 'huang','intermodes','isodata','li','maxentropy','mean','minerror','minimum','moments','otsu','percentile','renyientropy','shanbhag','triangle','yen'];
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
      age: '',
    };
  }
  
  handleChange = event => {
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    console.log(this.props.location.state.image.w );
    console.log(this.props.location.state.image.h );
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
      {
        console.log("not loaded");
        this.setState({ stateImageLoaded: false });
      }
    } else {
      console.log("fowarded stored image");
      this.setState({ stateImageLoaded: true });
      this.storedImage = this.props.location.state.image;
    }
    
    this.setState( {stateData:this.storedImage.data} );    
  }

  componentWillUnmount() {
    //window.removeEventListener("event", this.handleEvent);
  }

  preview(grayAlgoName, thresholdAlgoName)
  {
    console.log(`algo:${grayAlgoName} ${thresholdAlgoName}`);
    
    if(grayAlgoName===undefined || grayAlgoName==="none")
    {
      this.setState( {stateData:this.storedImage.data} );
      return;
    }
    
    PreviewPage.updateScripts( () => {
      console.log("run update script cb");
      const IJS = window.IJS;
      this.setState( {stateExternalScriptLoaded:true} );
      IJS.Image.load(this.storedImage.data)
      .then(image => {
        let grey=image.grey({algorithm:grayAlgoName});
        let grad = grey.morphologicalGradient();
        let level = grad.level();
        
        if(thresholdAlgoName===undefined || thresholdAlgoName==="none")
        {
          let proceededImage = level.toDataURL();
          this.setState( {stateData:proceededImage} );
          return;
        }
        
        //let proceededImage2 = grad.toDataURL();
        //this.setState( {stateData:proceededImage2} );
        //return;
        
        let mask=level.mask({algorithm:thresholdAlgoName, threshold:0.5, invert:false});
        let result = level.rgba8().paintMasks(mask, {color:'orange'});
        let proceededImage = result.toDataURL();
        
        this.setState( {stateData:proceededImage} );
      })
      .catch(err => {
        console.log(err);
      });
    });
  }
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
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center", 
              }}
            />
            <div
                  style={{
                    //border: "5px solid red",
                    display: "flex",
                    //flexDirection: "row",
                    //alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap"
                  }}
                >
               <form className={classes.root} autoComplete="off">
                <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Gray Algo</InputLabel>
                <Select
                  value={this.state.stateGreyAlgo}
                  onChange={this.handleChange}
                  inputProps={{ name: 'stateGreyAlgo', id: 'gray-algo-name', }}
                >
                  {
                    grayAlgo.map( (e,i) => <MenuItem value={e} key={i}>{e}</MenuItem>)
                  }
              </Select>
                 </FormControl>
                  <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Threshold Algo</InputLabel>
              <Select
                  value={this.state.stateThresholdAlgo}
                  onChange={this.handleChange}
                  inputProps={{ name: 'stateThresholdAlgo', id: 'threshold-algo-name', }}
                >
                  {
                    thresholdAlgo.map( (e,i) => <MenuItem value={e} key={i}>{e}</MenuItem>)
                  }
              </Select>
            </FormControl>
          </form>
              
              <Button variant="contained" color="primary" onClick={ () => this.preview(this.state.stateGreyAlgo, this.state.stateThresholdAlgo)}>
    Preview
  </Button>
                </div>
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
      console.log("not online");
      return;
    }
    if (!PreviewPage.isIJSLoaded()) {
      console.log("try to load ijs");
      return PreviewPage.loadIJS().then( () => PreviewPage.updateScripts(cb));
    }
    else
    {
      // when script is loaded, then call the callback
      console.log("call cb");
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
