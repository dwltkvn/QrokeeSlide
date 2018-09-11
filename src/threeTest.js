import React from "react";
import * as THREE from "three";

class ThreeTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0xf0f0f0);

    // RENDERER creation and configuration
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    }));
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // CAMERA creation and configuraiton
    const width = window.innerWidth;
    const height = window.innerHeight;
    /*const camera = (this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    ));*/

    this.frustumSize = 1;
    const aspect = window.innerWidth / window.innerHeight;
    const camera = (this.camera = new THREE.OrthographicCamera(
      (this.frustumSize * aspect) / -2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      0,
      2000
    ));

    //camera.position.z = 1;
    //camera.position.y = 400;

    // GEOMETRY - Create our only geometry: a cube.
    //const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry = new THREE.PlaneGeometry(0.99, 0.99, 0.99);

    // MATERIAL - create the default material (red cube) and selected material (white cube) + create a material for each color of the palette passed via props.
    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    // MESH - create the model cube that will be cloned to create its others siblings
    //const cubes = new THREE.Mesh(geometry, material);

    const cube = new THREE.Mesh(geometry, material); //cubes.clone();
    cube.position.set(0, 0, 0);
    scene.add(cube);

    const cube2 = cube.clone();
    cube2.position.set(1, 0, 0);
    scene.add(cube2);

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
    const animate = function() {
      requestAnimationFrame(animate);

      const f1 = Date.now() / 1000;
      //cube.rotation.x = Math.sin(f1);
      //cube.rotation.y = Math.cos(f1);
      renderer.render(scene, camera);
    };
    animate();

    // EVENT LISTENER - connect event to their respective slots.
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    this.renderer.dispose();
  }

  onResize(e) {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera.left = (-this.frustumSize * aspect) / 2;
    this.camera.right = (this.frustumSize * aspect) / 2;
    this.camera.top = this.frustumSize / 2;
    this.camera.bottom = -this.frustumSize / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    return <canvas ref={el => (this.canvas = el)} />;
  }
}

export default ThreeTest;
