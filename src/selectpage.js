import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  className0: {
    border: "1px solid red"
  }
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

const NavButton = props => (
  <Route
    render={({ history }) => (
      <Button
        variant="contained"
        color="secondary"
        {...props}
        onClick={() => {
          history.push("/qrokee");
        }}
      >
        Continue
      </Button>
    )}
  />
);

class SelectPage extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.onFilesSelected = this.onFilesSelected.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.displaySelectedImage = this.displaySelectedImage.bind(this);

    this.state = {
      stateImageLoaded: false
    };
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

  displaySelectedImage() {
    const img = new Image();
    img.onload = () => {
      const nbSlideH = 2; // hardcoded, for now we just want 2 rows
      const cubeside = img.height / nbSlideH;
      const w = cubeside * Math.ceil(img.width / cubeside);
      const nbSlideW = w / cubeside;

      this.props.cbStoreImgSize(w, img.height);
      this.props.cbStoreNbSlide(nbSlideW, nbSlideH);

      this.imageRef.width = w / 10;
      this.imageRef.height = img.height / 10;
      //console.log(img.width);
      //console.log(img.height);

      this.setState({ stateImageLoaded: true });
    };
    img.src = this.imgData;

    this.imageRef.src = this.imgData;
    this.props.cbStoreImgData(this.imgData);
  }

  onFileLoaded(e) {
    this.imgData = e.target.result;
    this.displaySelectedImage();
  }

  onFilesSelected(e) {
    console.log(this.inputRef.files);

    Array.from(this.inputRef.files).forEach(file => {
      console.log(file.name);
    });

    var reader = new FileReader();
    reader.onload = this.onFileLoaded;
    reader.readAsDataURL(this.inputRef.files[0]);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.className0}>
          <input
            id="uploadInput"
            type="file"
            name="myFiles"
            onChange={() => this.onFilesSelected()}
            multiple
            ref={elem => (this.inputRef = elem)}
            style={{ display: "none" }}
          />
          <Typography variant="display4" gutterBottom>
            Qrokee Slider
          </Typography>
        </div>
        <div className={{ ...classes.className0 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.inputRef.click()}
          >
            Select Image
          </Button>
          <NavButton disabled={!this.state.stateImageLoaded} />
        </div>
        <div className={classes.className0}>
          <img
            width="0"
            height="0"
            src=""
            alt=""
            ref={elem => (this.imageRef = elem)}
          />
        </div>
      </div>
    );
  }
}

SelectPage.propTypes = {
  //classes: PropTypes.object.isRequired
};

SelectPage.defaultProps = {
  /*name: 'Stranger'*/
};

/*
TemplateComponent.staticStyles = {
  ...
};
*/

export default withStyles(styles)(SelectPage);
