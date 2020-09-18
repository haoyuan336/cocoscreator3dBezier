import { _decorator, Component, Node, path, Tween, v3, Quat, v2, Vec3 } from 'cc';
import { BezierN } from './BezierN';
const { ccclass, property } = _decorator;

@ccclass('FinshCtl')
export class FinshCtl extends Component {

    @property({ type: Node })
    public fishNode: Node = null;

    @property({ type: Node })
    public ctlPosNodeList: Node[] = [];
    //控制点的列表
    start() {
        // Your initialization goes here.
        let v3List = [];
        for (let i = 0; i < this.ctlPosNodeList.length; i++) {
            let node = this.ctlPosNodeList[i];
            v3List.push(node.position);
        }
        let bezier = new BezierN(v3List);
        let pathList = bezier.getPointList(30);
        this.fishFly(pathList);
    }
    fishFly(pathList: Vec3[]) {
        let tw = new Tween(this.fishNode);
        this.fishNode.position = pathList[0];
        const moveToPoint = (node: Node, beforPos, pos) => {
            let dir = v3(beforPos).subtract(pos).normalize();
            let quat = new Quat();
            Quat.fromViewUp(quat, dir, Vec3.UP);
            tw.to(0.2, {
                position: pos,
                worldRotation: quat
            })
        }
        for (let i = 1; i < pathList.length; i++) {
            let point = pathList[i];
            moveToPoint(this.fishNode, pathList[i - 1], point);
        }

        tw.call(() => {
            this.fishFly(pathList);
        })
        tw.start();
    }


}
