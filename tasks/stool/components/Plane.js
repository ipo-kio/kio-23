import * as THREE from "three";
import {Sky} from "three/examples/jsm/objects/Sky";
import {Vector3} from "three";

class Plane {

    constructor(scene, renderer) {
        this.scene = scene
        this.renderer = renderer
    }

    initSky = () => {
        // Add Sky
        let sky = new Sky();
        sky.scale.setScalar(450000);
        // Add Sun
        let sun = new THREE.Vector3();

        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 45,
            exposure: this.renderer.toneMappingExposure
        };

        const uniforms = sky.material.uniforms;
        uniforms['turbidity'].value = effectController.turbidity;
        uniforms['rayleigh'].value = effectController.rayleigh;
        uniforms['mieCoefficient'].value = effectController.mieCoefficient;
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);
        sun.setFromSphericalCoords(1, phi, theta);
        uniforms['sunPosition'].value.copy(sun);
        this.renderer.toneMappingExposure = effectController.exposure;
        this.scene.add(sky);
    }

    initPlane = (width, height) => {
        // Plane
        let geometry = new THREE.PlaneBufferGeometry(width, height, 50, 50)
        geometry.rotateX(-Math.PI / 2);
        let gridPlane = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({color: "#1C1C1C"}))

        let vertices = geometry.attributes.position.array;

        for (let j = 1; j < vertices.length; j += 3) {
            vertices[j] = Math.pow(Math.sin(0.31 * (vertices[j - 1] + 1) - 0.32 * (vertices[j + 1] + 1)), 2) +
                Math.pow(Math.cos(0.385 * (vertices[j - 1] + 1) + 0.158 * (vertices[j + 1] + 1)), 2);
        }

        let count = geometry.attributes.position.count;
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count*3), 3));

        let color = new THREE.Color();
        for(let i=0; i<count; i++){
            let position = vertices[i*3 + 1];
            color.setRGB(123/255, 157/255 + position/6, 47/255)
            geometry.attributes.color.setXYZ(i, color.r, color.g, color.b);
        }

        // Materials
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            color: "#827888",
            side: THREE.DoubleSide
        })

        this.planeMesh = new THREE.Mesh(geometry, material)
        this.planeMesh.castShadow = true;
        this.planeMesh.receiveShadow = true;
        this.scene.add(this.planeMesh)
        this.scene.add(gridPlane)
    }

    geoGrid = (vertices) =>{
        for (let j = 1; j < vertices.length; j += 3) {
            let point2 = new Vector3(vertices[j-1], vertices[j], vertices[j+1]);
            let point1 = new Vector3(-this.df_dx(vertices[j-1], vertices[j+1]), 0, this.df_dz(vertices[j-1], vertices[j+1])).add(point2);
            let geoLine = new THREE.BufferGeometry().setFromPoints([point2, point1])
            this.scene.add(new THREE.Line(geoLine, new THREE.LineBasicMaterial({
                color: "#68A848"
            })).translateY(0.1));
        }
    }

    df_dx = (x, z) =>{
        return (-0.385*Math.sin(0.77*x + 0.316*z + 1.086) - 0.31*Math.sin(-0.62*x + 0.64*z + 0.02));
    }

    df_dz = (x, z) =>{
        return (0.32*Math.sin(-0.62*x + 0.64*z + 0.02) - 0.158*Math.sin(0.77*x + 0.316*z + 0.86));
    }

}

export default Plane
