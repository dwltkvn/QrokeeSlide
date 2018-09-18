import React from "react";
import * as THREE from "three";

import Hammer from "hammerjs";
import { Link } from "react-router-dom";

class ThreeTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateError: false
    };

    this.animObj = {
      moveX: false,
      moveY: false,
      rotate: 0,
      t: 0,
      tDelta: 0.1
    };

    this.displaySize = 0.5; // default : 0.5
    this.rotationOrientation = 0;

    this.onResize = this.onResize.bind(this);
    this.onDoubleTap = this.onDoubleTap.bind(this);

    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
    this.onSwipeUp = this.onSwipeUp.bind(this);
    this.onSwipeDown = this.onSwipeDown.bind(this);

    this.translateX = this.translateX.bind(this);
    this.translateY = this.translateY.bind(this);

    this.onAnim = this.onAnim.bind(this);
  }

  componentDidMount() {
    this.hammertime = new Hammer.Manager(this.canvas, {
      recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Tap, { event: "doubletap", taps: 2 }]
      ]
    });

    this.hammerswipe = new Hammer.Manager(this.canvas, {
      recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Swipe, {}]
      ]
    });

    // load ressoures, then build three js scene
    //const img = new THREE.ImageLoader().load(kdoimg, i => this.buildThree(i));
    const img = new THREE.ImageLoader().load(
      this.props.propImgData,
      i => this.buildThree(i),
      undefined,
      () => {
        console.log("Error on image load");
        this.setState({ stateError: true });
      }
    );

    //console.log(this.props.propImgWidth);
    //console.log(this.props.propImgHeight);

    // EVENT LISTENER - connect event to their respective slots.
    window.addEventListener("resize", this.onResize);
    this.hammertime.on("doubletap", () => this.onDoubleTap());
    this.hammerswipe.on("swipeleft", () => this.onSwipeLeft());
    this.hammerswipe.on("swiperight", () => this.onSwipeRight());
    this.hammerswipe.on("swipeup", () => this.onSwipeUp());
    this.hammerswipe.on("swipedown", () => this.onSwipeDown());
  }

  buildThree(myImg) {
    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0x000000);

    // RENDERER creation and configuration
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    }));
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // CAMERA creation and configuraiton
    let portraitAspect = window.innerWidth / window.innerHeight;
    let landscapeAspect = window.innerHeight / window.innerWidth;
    window.innerHeight > window.innerWidth
      ? (portraitAspect = 1)
      : (landscapeAspect = 1);
    const camera = (this.camera = new THREE.OrthographicCamera(
      -this.displaySize * portraitAspect,
      this.displaySize * portraitAspect,
      this.displaySize * landscapeAspect,
      -this.displaySize * landscapeAspect,
      0,
      2000
    ));

    // GEOMETRY - Create our only geometry: a cube.
    //const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry = new THREE.PlaneGeometry(0.99, 0.99, 0.99);
    const markerGeom = new THREE.CircleGeometry(0.1, 3);

    // MATERIAL - create the default material (red cube) and selected material (white cube) + create a material for each color of the palette passed via props.
    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: false
    });

    const circle = new THREE.Mesh(markerGeom, markerMaterial);
    //const texture = new THREE.TextureLoader().load(kdoimg);

    // texture from canvas:

    // CanvasTexture https://threejs.org/docs/#api/en/textures/CanvasTexture

    // http://collaboradev.com/2016/03/17/drawing-on-textures-in-threejs/
    // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/drawImage
    // void ctx.drawImage(image, dx, dy, dLargeur, dHauteur);

    //create in memory canvas
    const sImgW = this.props.propImgWidth;
    const sImgH = this.props.propImgHeight;

    const nbW = this.props.propNbSlideW;
    const nbH = this.props.propNbSlideH;

    for (let i = 0; i < nbW; i++) {
      for (let j = 0; j < nbH; j++) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        canvas.width = sImgW / nbW;
        canvas.height = sImgH / nbH;
        context.drawImage(myImg, i * (-sImgW / nbW), j * (-sImgH / nbH));
        const canvasTexture = new THREE.CanvasTexture(canvas);

        const textureMaterial = new THREE.MeshBasicMaterial({
          map: canvasTexture
        });

        const cube = new THREE.Mesh(geometry, textureMaterial); //cubes.clone();
        cube.position.set(i, -j, -1);
        scene.add(cube);

        const c = circle.clone();
        c.position.set(i, -j, 0);
        scene.add(c);
      }
    }

    // LIGHT - use two light at opposed position and at cube corner.
    const light_p = new THREE.PointLight(0xffffff);
    light_p.position.set(10, 10, 10);
    scene.add(light_p);

    const light_p2 = new THREE.PointLight(0xffffff);
    light_p2.position.set(-10, -10, -10);
    scene.add(light_p2);

    const light_a = new THREE.AmbientLight(0x333333);
    scene.add(light_a);

    // ANIMATION FRAME - initiate the request animation frame and call it a first time to start the loop.
    this.onAnim();
  }

  onAnim() {
    requestAnimationFrame(this.onAnim);

    this.animObj.t = THREE.Math.clamp(
      this.animObj.t + this.animObj.tDelta,
      0,
      1.0
    );

    if (this.animObj.moveX === true) {
      this.camera.position.x = THREE.Math.lerp(
        this.animObj.start,
        this.animObj.end,
        this.animObj.t
      );
      if (this.camera.position.x === this.animObj.end) {
        this.animObj.moveX = false;
        this.camera.position.x = this.animObj.end;
      }
    }

    if (this.animObj.moveY === true) {
      this.camera.position.y = THREE.Math.lerp(
        this.animObj.start,
        this.animObj.end,
        this.animObj.t
      );
      if (this.camera.position.y === this.animObj.end) {
        this.animObj.moveY = false;
        this.camera.position.y = this.animObj.end;
      }
    }

    if (this.animObj.rotate > 0) {
      this.camera.rotateZ(this.animObj.tDelta /*Math.PI / 2*/);
      this.animObj.rotate -= this.animObj.tDelta;

      if (this.animObj.rotate < this.animObj.tDelta) {
        this.camera.rotateZ(this.animObj.rotate);
        this.animObj.rotate = 0;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    if (this.renderer) this.renderer.dispose();
  }

  onResize(e) {
    let portraitAspect = window.innerWidth / window.innerHeight;
    let landscapeAspect = window.innerHeight / window.innerWidth;
    window.innerHeight > window.innerWidth
      ? (portraitAspect = 1)
      : (landscapeAspect = 1);
    this.camera.left = -this.displaySize * portraitAspect;
    this.camera.right = this.displaySize * portraitAspect;
    this.camera.top = this.displaySize * landscapeAspect;
    this.camera.bottom = -this.displaySize * landscapeAspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onDoubleTap() {
    this.animObj.rotate = Math.PI / 2;
    this.rotationOrientation = (this.rotationOrientation + 1) % 4;
  }

  translateX(delta) {
    if (
      this.animObj.moveX === false &&
      this.animObj.moveY === false &&
      this.animObj.rotate === 0
    ) {
      this.animObj.moveX = true;
      this.animObj.start = this.camera.position.x;
      this.animObj.end = this.camera.position.x + delta;
      this.animObj.t = 0;
    }
  }

  translateY(delta) {
    if (
      this.animObj.moveY === false &&
      this.animObj.moveX === false &&
      this.animObj.rotate === 0
    ) {
      this.animObj.moveY = true;
      this.animObj.start = this.camera.position.y;
      this.animObj.end = this.camera.position.y + delta;
      this.animObj.t = 0;
    }
  }

  onSwipeLeft() {
    //this.translateX(+0.5);
    if (this.rotationOrientation === 0) this.translateX(+0.5);
    else if (this.rotationOrientation === 1) this.translateY(+0.5);
    else if (this.rotationOrientation === 2) this.translateX(-0.5);
    else if (this.rotationOrientation === 3) this.translateY(-0.5);
  }

  onSwipeRight() {
    if (this.rotationOrientation === 0) this.translateX(-0.5);
    else if (this.rotationOrientation === 1) this.translateY(-0.5);
    else if (this.rotationOrientation === 2) this.translateX(0.5);
    else if (this.rotationOrientation === 3) this.translateY(0.5);
  }

  onSwipeUp() {
    if (this.rotationOrientation === 0) this.translateY(-0.5);
    else if (this.rotationOrientation === 1) this.translateX(+0.5);
    else if (this.rotationOrientation === 2) this.translateY(+0.5);
    else if (this.rotationOrientation === 3) this.translateX(-0.5);
  }

  onSwipeDown() {
    if (this.rotationOrientation === 0) this.translateY(+0.5);
    else if (this.rotationOrientation === 1) this.translateX(-0.5);
    else if (this.rotationOrientation === 2) this.translateY(-0.5);
    else if (this.rotationOrientation === 3) this.translateX(+0.5);
  }

  render() {
    return this.state.stateError ? (
      <Link to="/">Load an image first !</Link>
    ) : (
      <canvas ref={el => (this.canvas = el)} />
    );
  }
}

export default ThreeTest;
