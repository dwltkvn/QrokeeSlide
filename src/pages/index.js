import React from "react";
import { navigate } from "gatsby";

import Layout from "../components/layout";
import Button from "@material-ui/core/Button";

class IndexPage extends React.Component {
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

  displaySelectedImage() {
    const img = new Image();
    img.onload = () => {
      const nbSlideH = 2; // hardcoded, for now we just want 2 rows
      const cubeside = img.height / nbSlideH;
      const w = cubeside * Math.ceil(img.width / cubeside);
      const nbSlideW = w / cubeside;

      this.storeImgSize = { w: w, h: img.height };
      this.storeNbSlide = { w: nbSlideW, h: nbSlideH };

      this.imageRef.width = w / 10;
      this.imageRef.height = img.height / 10;
      //console.log(img.width);
      //console.log(img.height);

      this.setState({ stateImageLoaded: true });
    };
    img.src = this.imgData;

    this.imageRef.src = this.imgData;
    this.storeImgData = this.imgData;
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
    return (
      <Layout>
        <input
          id="uploadInput"
          type="file"
          name="myFiles"
          onChange={() => this.onFilesSelected()}
          multiple
          ref={elem => (this.inputRef = elem)}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.inputRef.click()}
        >
          Select Image
        </Button>
        <Button
          variant="contained"
          color="primary"
          role="link"
          disabled={!this.state.stateImageLoaded}
          onClick={() =>
            navigate("/page-2/", {
              state: {
                size: this.storeImgSize,
                slide: this.storeNbSlide,
                data: this.storeImgData
              }
            })
          }
        >
          Continue
        </Button>
        <div>
          <img
            width="0"
            height="0"
            src=""
            alt=""
            ref={elem => (this.imageRef = elem)}
          />
        </div>
      </Layout>
    );
  }
}

export default IndexPage;
