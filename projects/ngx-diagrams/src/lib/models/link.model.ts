import { BaseModel } from './base.model';
import { DiagramModel } from './diagram.model';
import { PortModel } from './port.model';
import { PointModel } from './point.model';

export class LinkModel extends BaseModel<DiagramModel> {
	// TODO: decide what should be reactive using RXJS
	private name: string;
	private sourcePort: PortModel | null;
	private targetPort: PortModel | null;
	private points: PointModel[];
	private extras: any;

	constructor(linkType: string = 'default', id?: string) {
		super(linkType, id);
		// TODO: handle default initial points!
		this.points = [new PointModel(this, { x: 0, y: 0 }), new PointModel(this, { x: 0, y: 0 })];
		this.extras = {};
		this.sourcePort = null;
		this.targetPort = null;
	}

	setName(name: string) {
		this.name = name;
	}

	getName(): string {
		return this.name;
	}

	getExtras(): any {
		return this.extras;
	}

	setExtras(extras: any) {
		this.extras = extras;
	}

	remove() {
		if (this.sourcePort) {
			this.sourcePort.removeLink(this);
		}

		if (this.targetPort) {
			this.targetPort.removeLink(this);
		}

		super.remove();
	}

	isLastPoint(point: PointModel) {
		const index = this.getPointIndex(point);
		return index === this.points.length - 1;
	}

	getPointIndex(point: PointModel) {
		return this.points.indexOf(point);
	}

	getPortForPoint(point: PointModel): PortModel {
		if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
			return this.sourcePort;
		}
		if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
			return this.targetPort;
		}
		return null;
	}

	getPointForPort(port: PortModel): PointModel {
		if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
			return this.getFirstPoint();
		}
		if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
			return this.getLastPoint();
		}
		return null;
	}

	getFirstPoint(): PointModel {
		return this.points[0];
	}

	getLastPoint(): PointModel {
		return this.points[this.points.length - 1];
	}

	setSourcePort(port: PortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.sourcePort !== null) {
			this.sourcePort.removeLink(this);
		}
		this.sourcePort = port;
	}

	getSourcePort(): PortModel {
		return this.sourcePort;
	}

	getTargetPort(): PortModel {
		return this.targetPort;
	}

	setTargetPort(port: PortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.targetPort !== null) {
			this.targetPort.removeLink(this);
		}
		this.targetPort = port;
	}

	point(x: number, y: number): PointModel {
		return this.addPoint(this.generatePoint(x, y));
	}

	// addLabel(label: LabelModel) {
	//     label.setParent(this);
	//     this.labels.push(label);
	// }

	getPoints(): PointModel[] {
		return this.points;
	}

	setPoints(points: PointModel[]) {
		points.forEach(point => {
			point.setParent(this);
		});
		this.points = points;
	}

	removePoint(pointModel: PointModel) {
		this.points.splice(this.getPointIndex(pointModel), 1);
	}

	removePointsBefore(pointModel: PointModel) {
		this.points.splice(0, this.getPointIndex(pointModel));
	}

	removePointsAfter(pointModel: PointModel) {
		this.points.splice(this.getPointIndex(pointModel) + 1);
	}

	removeMiddlePoints() {
		if (this.points.length > 2) {
			this.points.splice(0, this.points.length - 2);
		}
	}

	addPoint<P extends PointModel>(pointModel: P, index = 1): P {
		pointModel.setParent(this);
		this.points.splice(index, 0, pointModel);
		return pointModel;
	}

	generatePoint(x: number = 0, y: number = 0): PointModel {
		return new PointModel(this, { x, y });
	}
}