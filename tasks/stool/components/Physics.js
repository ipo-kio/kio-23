import * as THREE from "three";
import {Vector3} from "three";
import Chair from "./Chair"

class Physics {
    constructor(plane, scene, planeWidth, planeHeight, KioApi, view, hR, restart) {

        this.restart = restart
        this.view = view
        this.kioApi = KioApi
        this.plane = plane
        this.scene = scene
        this.chair = new Chair(this.scene)
        this.global_tips_position = []
        this.h = 0.2
        this.hR = hR
        this.hFall = 0.035

        this.contactNum = 0
        this.inDetail = true
        this.angle = 0
        this.dist = 0 // param 1
        this.tiltAngle = 0 // param 2

        this.planeWidth = planeWidth;
        this.planeHeight = planeHeight;
    }

    init = (position, angle) => {
        this.chair.init(position)
        this.angle = angle
        this.chair.leftRotation(angle)

    }

    rotate = () => {
        this.chair.rotateAboutPoint(this._rotationParams.point, this._rotationParams.axis, this._rotationParams.angle)
    }

    checkCollision = (tip, index) => {
        if (this.distanceToPlane(index) <= this.hFall + 0.01) { // collision happened
            tip.grounded = true
            this.contactNum += 1
            tip.contact = this.contactNum

            this.chair.moveDown(this.distanceToPlane(index) - this.hFall)

            return true
        }
        return false
    }

    distanceToPlane = (index) => {
        let current_tip = this.chair.group.localToWorld(this.chair.tips[index].position.clone())
        let ray = new THREE.Raycaster(current_tip, new THREE.Vector3(0, -1, 0))
        let intersections = ray.intersectObject(this.plane.planeMesh, false)
        if (intersections.length > 0) {
            return intersections[0].distance
        }
        return 0
    }

    startRotation = (curTipIndex) => {
        this.toRotate = true
        let opposite = false

        let axis, point

        if (this.chair.tips[curTipIndex].contact === 1) {
            this.firstTipIndex = curTipIndex

            axis = this.global_tips_position[curTipIndex].clone().sub(this.global_tips_position[(+curTipIndex + 1) % 4])
            axis.multiplyScalar(-1)
            axis.applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 4)
            axis.normalize()
            point = this.global_tips_position[curTipIndex].clone()

            this._rotationParams = {
                point: point,
                axis: axis,
                angle: -0.01
            }

            if (this.inDetail === true) {
                let torus_position = new THREE.Vector3(this.chair.tips[curTipIndex].position.x,
                    this.chair.tips[curTipIndex].position.y + this.chair.tube + this.chair.footboard_height + 0.1,
                    this.chair.tips[curTipIndex].position.z)
                this.chair.torus(torus_position)
            }
        } else if (this.chair.tips[curTipIndex].contact === 2) {

            this.firstTipIndex = +this.firstTipIndex
            curTipIndex = +curTipIndex

            if (this.firstTipIndex === 3 && curTipIndex === 0) {
                axis = new THREE.Vector3().copy(this.global_tips_position[curTipIndex]).sub(this.global_tips_position[this.firstTipIndex])
                axis.multiplyScalar(-1)
            } else if ((this.firstTipIndex > curTipIndex) || (this.firstTipIndex === 0 && curTipIndex === 3)) { // swap  2 -- 1 -> 1 -- 2, 0--3 (change)
                axis = new THREE.Vector3().copy(this.global_tips_position[curTipIndex]).sub(this.global_tips_position[this.firstTipIndex])
            } else { // 1 -- 2 (ok)


                axis = new THREE.Vector3().copy(this.global_tips_position[this.firstTipIndex]).sub(this.global_tips_position[curTipIndex])
            }
            axis.normalize()

            point = this.global_tips_position[curTipIndex].clone()

            let ang

            if ((this.firstTipIndex + 2) % 4 === curTipIndex) {
                opposite = true

                let countAirTips = 0, airTip1, airTip2
                for (let i in this.chair.tips) {
                    if (this.chair.tips[i].contact === -1 && countAirTips === 0) {
                        airTip1 = i
                        countAirTips = 1
                    }
                    if (this.chair.tips[i].contact === -1 && countAirTips === 1) {
                        airTip2 = i
                        countAirTips = 2
                    }
                }
                if (this.distanceToPlane(airTip1) < this.distanceToPlane(airTip2)) {
                    ang = -1
                } else {
                    ang = 1
                }
            }
            ang = opposite ? ang : 1

            this._rotationParams = {
                point: point,
                axis: axis,
                angle: ang * 0.004
            }

            if (this.inDetail === true) {
                let torus_position_1 = new THREE.Vector3(this.chair.tips[curTipIndex].position.x,
                    this.chair.tips[curTipIndex].position.y + this.chair.tube + this.chair.footboard_height+ 0.1,
                    this.chair.tips[curTipIndex].position.z)
                let torus_position_2 = new THREE.Vector3(this.chair.tips[curTipIndex].position.x,
                    this.chair.tips[curTipIndex].position.y + this.chair.tube + this.chair.tube * 4 + this.chair.footboard_height + 0.1,
                    this.chair.tips[curTipIndex].position.z)
                this.chair.torus(torus_position_1)
                this.chair.torus(torus_position_2)
            }
        } else {
            this.toRotate = false

            if (this.inDetail === true) {
                let torus_position_1 = new THREE.Vector3(this.chair.tips[curTipIndex].position.x,
                    this.chair.tips[curTipIndex].position.y + this.chair.tube + this.chair.footboard_height+ 0.1,
                    this.chair.tips[curTipIndex].position.z)
                let torus_position_2 = new THREE.Vector3(this.chair.tips[curTipIndex].position.x,
                    this.chair.tips[curTipIndex].position.y + this.chair.tube + this.chair.tube * 4 + this.chair.footboard_height+ 0.1,
                    this.chair.tips[curTipIndex].position.z)
                let torus_position_3 = new THREE.Vector3(this.chair.tips[curTipIndex].position.x,
                    this.chair.tips[curTipIndex].position.y + this.chair.tube + 2 * this.chair.tube * 4 + this.chair.footboard_height + 0.1,
                    this.chair.tips[curTipIndex].position.z)
                this.chair.torus(torus_position_1)
                this.chair.torus(torus_position_2)
                this.chair.torus(torus_position_3)
            }

            for (let i in this.chair.tips) {
                if (this.chair.tips[i].grounded === false) {
                    let dist = this.distanceToPlane(i)
                    if(dist <= 0.025){
                        this.dist = 0;
                    }
                    else if(dist<=0.03){
                        this.dist = 0.01
                        this.chair.showDistanceToPlane(this.global_tips_position[i], this.dist)
                    }
                    else{
                        this.dist = dist - 0.025
                        this.chair.showDistanceToPlane(this.global_tips_position[i], this.dist)
                    }
                    break;
                }
            }

            let bottom, top
            top = this.chair.group.localToWorld(this.chair.coord[0].clone())
            bottom = this.global_tips_position[0].clone()
            axis = bottom.clone().sub(top)
            axis.normalize()
            axis.multiplyScalar(-1)

            let projectionPoint = top.clone().setY(bottom.y)
            let axis2 = bottom.clone().sub(projectionPoint)

            this.tiltAngle = Math.acos((axis.x * axis2.x + axis.y * axis2.y + axis.z * axis2.z)
                / (Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z) *
                    Math.sqrt(axis2.x * axis2.x + axis2.y * axis2.y + axis2.z * axis2.z)))
            this.tiltAngle = this.tiltAngle * 180 / Math.PI
            this.tiltAngle = Math.round(Math.abs(this.tiltAngle - 90))
            this.dist = Math.round(this.dist * 100)

            this.tiltAngle = this.tiltAngle ? this.tiltAngle : 0

            this.kioApi.submitResult({distance: this.dist, tiltAngle: this.tiltAngle})

        }
    }

    align = (i) => {
        this.chair.moveDown(this.distanceToPlane(i) - this.hFall)
    }

    animate = () => {

        for (let i in this.chair.tips) {
            this.global_tips_position[i] = this.chair.group.localToWorld(this.chair.tips[i].position.clone())
        }

        if (this.toDrop) {
            this.chair.moveDown(this.hFall)
            for (let i in this.chair.tips) {
                this.global_tips_position[i] = this.chair.group.localToWorld(this.chair.tips[i].position.clone())
            }
            for (let i in this.chair.tips) {
                if (this.checkCollision(this.chair.tips[i], i)) {
                    this.toDrop = false
                    for (let i in this.chair.tips) {
                        this.global_tips_position[i] = this.chair.group.localToWorld(this.chair.tips[i].position.clone())
                    }
                    this.align(i)
                    this.startRotation(i)
                    break
                }
            }
        }
        if (this.toRotate) {
            this.rotate()
            for (let i in this.chair.tips) {
                this.global_tips_position[i] = this.chair.group.localToWorld(this.chair.tips[i].position.clone())
            }
            for (let i in this.chair.tips) {
                if (this.chair.tips[i].grounded === false && this.checkCollision(this.chair.tips[i], i)) {
                    for (let i in this.chair.tips) {
                        this.global_tips_position[i] = this.chair.group.localToWorld(this.chair.tips[i].position.clone())
                    }
                    if (this.contactNum < 4) {
                        this.startRotation(i)
                    }
                }
            }
        }
    }

    dropButton = () => {
        if (!this.canMove()) {
            this.restart()
            return
        }
        if (this.canMove()) {
            this.inDetail = true
            this.toDrop = true
            let min = this.distanceToPlane(0);
            for (let i = 1; i < 4; i++) {
                let tmp = this.distanceToPlane(i);
                if (min > tmp){
                    min = tmp;
                }
            }
            let partsNum = Math.round(min/this.hFall)
            this.chair.moveDown(partsNum * this.hFall - 20 * this.hFall);
        }
    }

    dropAndShow = () => {
        if (!this.canMove()) {
            this.restart()
            return
        }
        if (this.canMove()) {
            this.inDetail = true
            this.toDrop = true
        }
    }

    canMove = () => {
        if (this.toDrop === true || this.toRotate === true) return false
        let groundedTips = 0
        for (let i in this.chair.tips) {
            if (this.chair.tips[i].grounded === true) {
                groundedTips += 1
            }
        }
        return groundedTips === 0;
    }

    check = (vec) => {
        let offset = this.chair.chairSize / 2
        for (let pos of this.global_tips_position) {
            let total = pos.clone().add(vec)
            if (vec.x !== 0) {
                if (Math.abs(total.x) >= this.planeWidth / 2 - offset) {
                    return false
                }
            } else if (vec.z !== 0) {
                if ((Math.abs(total.z) >= this.planeHeight / 2 - offset)) {
                    return false
                }
            }
        }
        return true
    }

    leftButton = () => {
        if (!this.canMove()) {
            this.restart()
            return
        }
        if (this.check(new THREE.Vector3(0, 0, this.h))) {
            this.chair.moveLeft(this.h)
        }
        this.view(this.chair.group.position.x,this.chair.group.position.z,this.angle)
    }

    rightButton = () => {
        if (!this.canMove()) {
            this.restart()
            return
        }
        if (this.check(new THREE.Vector3(0, 0, -this.h))) {
            this.chair.moveRight(this.h)
        }
        this.view(this.chair.group.position.x,this.chair.group.position.z,this.angle)
    }

    backButton = () => {
        if (!this.canMove()) {
            this.restart()
            return
        }
        if (this.check(new THREE.Vector3(-this.h, 0, 0))) {
            this.chair.moveBack(this.h)
        }
        this.view(this.chair.group.position.x,this.chair.group.position.z,this.angle)
    }

    forwardButton = () => {
        if (!this.canMove()) {
            this.restart()
            return
        }
        if (this.check(new THREE.Vector3(this.h, 0, 0))) {
            this.chair.moveForward(this.h)
        }
        this.view(this.chair.group.position.x,this.chair.group.position.z,this.angle)
    }

    transparentButtonOn = () => {
        this.chair.transparentStateOn()
    }

    transparentButtonOff = () => {
        this.chair.transparentStateOff()
    }

    rightRotationButton = () => {
        if (!this.canMove()) {
            this.restart()
            return
        }
        this.chair.rightRotation(this.hR)
        this.angle -= this.hR
        this.view(this.chair.group.position.x,this.chair.group.position.z,this.angle)
    }

    leftRotationButton = () => {
        if (!this.canMove()) {
            this.restart()
            return
        }

        this.chair.leftRotation(this.hR)
        this.angle += this.hR
        this.view(this.chair.group.position.x,this.chair.group.position.z,this.angle)
    }

    RotateOn01Degree = () =>{
        this.hR = 0.1
    }

    RotateOn05Degree = () =>{
        this.hR = 0.5
    }

    RotateOn1Degree = () =>{
        this.hR = 1;
    }

    RotateOn2Degree = () =>{
        this.hR = 2;
    }

    RotateOn5Degree = () =>{
        this.hR = 5;
    }

    RotateOn10Degree = () =>{
        this.hR = 10;
    }

    deleteFromScene = () => {
        this.chair.clearScene()
        this.scene.children = this.scene.children.filter(obj => !(obj instanceof THREE.ArrowHelper));

        this.toDrop = false
        this.inDetail = false
        this.toRotate = false
        this.contactNum = 0
    }

}

export default Physics
