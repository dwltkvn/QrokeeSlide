import React from "react";
import * as THREE from "three";

import Hammer from "hammerjs";
import kdoimg from "./tampon-bois-boussole.jpg";

class ThreeTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

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
      () => console.log("Error on image load")
    );

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

    //const texture = new THREE.TextureLoader().load(kdoimg);

    // texture from canvas:

    // CanvasTexture https://threejs.org/docs/#api/en/textures/CanvasTexture

    // http://collaboradev.com/2016/03/17/drawing-on-textures-in-threejs/
    // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/drawImage
    // void ctx.drawImage(image, dx, dy, dLargeur, dHauteur);

    //create in memory canvas
    const sImg = 768;
    //const img = new THREE.ImageLoader().load(kdoimg);

    let canvas2 = document.createElement("canvas");
    let context2 = canvas2.getContext("2d");
    canvas2.width = sImg / 2;
    canvas2.height = sImg / 2;
    context2.drawImage(myImg, 0, 0);
    const canvasTexture2 = new THREE.CanvasTexture(canvas2);

    let canvas3 = document.createElement("canvas");
    let context3 = canvas3.getContext("2d");
    canvas3.width = sImg / 2;
    canvas3.height = sImg / 2;
    context3.drawImage(myImg, -sImg / 2, 0);
    const canvasTexture3 = new THREE.CanvasTexture(canvas3);

    let canvas4 = document.createElement("canvas");
    let context4 = canvas4.getContext("2d");
    canvas4.width = sImg / 2;
    canvas4.height = sImg / 2;
    context4.drawImage(myImg, 0, -sImg / 2);
    const canvasTexture4 = new THREE.CanvasTexture(canvas4);

    let canvas5 = document.createElement("canvas");
    let context5 = canvas5.getContext("2d");
    canvas5.width = sImg / 2;
    canvas5.height = sImg / 2;
    context5.drawImage(myImg, -sImg / 2, -sImg / 2);
    const canvasTexture5 = new THREE.CanvasTexture(canvas5);

    var textureMaterial2 = new THREE.MeshBasicMaterial({
      map: canvasTexture2
    });

    var textureMaterial3 = new THREE.MeshBasicMaterial({
      map: canvasTexture3
    });

    var textureMaterial4 = new THREE.MeshBasicMaterial({
      map: canvasTexture4
    });

    var textureMaterial5 = new THREE.MeshBasicMaterial({
      map: canvasTexture5
    });

    // MESH - create the model cube that will be cloned to create its others siblings
    const cube = new THREE.Mesh(geometry, textureMaterial2); //cubes.clone();
    cube.position.set(0, 0, -1);
    scene.add(cube);

    const cube2 = new THREE.Mesh(geometry, textureMaterial3);
    cube2.position.set(1, 0, -1);
    scene.add(cube2);

    const cube3 = new THREE.Mesh(geometry, textureMaterial4);
    cube3.position.set(0, -1, -1);
    scene.add(cube3);

    const cube4 = new THREE.Mesh(geometry, textureMaterial5);
    cube4.position.set(1, -1, -1);
    scene.add(cube4);

    const circle = new THREE.Mesh(markerGeom, markerMaterial);

    for (let x of [0, 0.5, 1]) {
      for (let y of [-1, -0.5, 0]) {
        const c = circle.clone();
        c.position.set(x, y, 0);
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
    this.renderer.dispose();
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
    return <canvas ref={el => (this.canvas = el)} />;
  }
}

export default ThreeTest;
