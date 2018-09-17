import React from "react";
import PropTypes from "prop-types";

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

class SelectPage extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.onFilesSelected = this.onFilesSelected.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.onClick = this.onClick.bind(this);

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

  onClick() {
    const c = this.canvasRef;
    const ctx = c.getContext("2d");

    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = this.imgData;

    this.imageRef.src = this.imgData;
  }

  onFileLoaded(e) {
    this.imgData = e.target.result;
    this.onClick();
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
    //const { someState } = this.state;

    return (
      <div>
        <input
          id="uploadInput"
          type="file"
          name="myFiles"
          onChange={() => this.onFilesSelected()}
          multiple
          ref={elem => (this.inputRef = elem)}
        />
        <canvas
          id="myCanvas"
          width="200"
          height="100"
          style={{ border: "1px solid #000000" }}
          ref={elem => (this.canvasRef = elem)}
        />
        <img
          src=""
          width="200"
          height="100"
          alt="Aperçu de l’image..."
          ref={elem => (this.imageRef = elem)}
        />
        <button type="button" onClick={() => this.onClick()}>
          Click Me!
        </button>
      </div>
    );
  }
}

SelectPage.propTypes = {
  classes: PropTypes.object.isRequired
};

SelectPage.defaultProps = {
  /*name: 'Stranger'*/
};

/*
TemplateComponent.staticStyles = {
  ...
};
*/

export default SelectPage;
