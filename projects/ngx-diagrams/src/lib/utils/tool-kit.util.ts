// tslint:disable no-bitwise
// import { ROUTING_SCALING_FACTOR } from './routing/path-finding.service';
// import * as Path from 'paths-js/path';

/**
 * Utility pathing and routing service
 */

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Coords } from '../interfaces/coords.interface';
import ObjectID from 'bson-objectid';

export enum LOG_LEVEL {
	'LOG',
	'ERROR'
}

// @internal
export let __DEV__ = true;
// @internal
export let __LOG__: LOG_LEVEL = LOG_LEVEL.ERROR;

export function enableDiagramProdMode(): void {
	__DEV__ = false;
}

// @internal
export function setLogLevel(level: LOG_LEVEL): void {
	__LOG__ = level;
}

// @internal
export function isDev(): boolean {
	return __DEV__;
}

// @internal
export function log(message: string, level: LOG_LEVEL = LOG_LEVEL.LOG, ...args: any[]): void {
	if (isDev() && __LOG__ === level) {
		if (__LOG__ === LOG_LEVEL.ERROR) {
			console.error(message, ...args);
		}
		console.log(message, ...args);
	}
}

/**
 * rxjs log operator
 * @internal
 */
export function withLog(message: string, level: LOG_LEVEL = LOG_LEVEL.LOG, ...args: any) {
	return <T>(source: Observable<T>) => (isDev() ? source.pipe(tap(val => log(message, level, val, ...args))) : source);
}

export type ID = string;

/**
 * Generates a unique ID
 */
export function UID(): ID {
	return ObjectID.generate();
}

export function isArray<T>(val: any): val is T[] {
	return Array.isArray(val);
}

export function isString(val: any): val is string {
	return typeof val === 'string';
}

export function isFunction(val: any): val is (...args: any) => any {
	return typeof val === 'function';
}

// @internal
export function isNil(v: any) {
	return v === null || v === undefined;
}

export function coerceArray<T>(value: T | T[]): T[] {
	if (isNil(value)) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
}

export function mapToArray<T>(map: { [key: string]: T }): T[] {
	const result = [];
	for (const key in map) {
		if (!isNil(map[key])) {
			result.push(map[key]);
		}
	}

	return result;
}

export function arrayToMap<T>(arr: Array<{ id: ID } & T>): { [key: string]: T } {
	const result = {};
	for (const val of arr) {
		if (!isNil(val)) {
			result[val.id] = val;
		}
	}

	return result;
}

export function generateLinePath(firstPoint: any, lastPoint: any): string {
	return `M${firstPoint.x$},${firstPoint.y} L ${lastPoint.x$},${lastPoint.y}`;
}

export function generateCurvePath(firstPoint: Coords, lastPoint: Coords, curvy: number = 0): string {
	const isHorizontal = Math.abs(firstPoint.x - lastPoint.x) > Math.abs(firstPoint.y - lastPoint.y);
	const curvyX = isHorizontal ? curvy : 0;
	const curvyY = isHorizontal ? 0 : curvy;

	return `M${firstPoint.x},${firstPoint.y} C ${firstPoint.x + curvyX},${firstPoint.y + curvyY}
    ${lastPoint.x - curvyX},${lastPoint.y - curvyY} ${lastPoint.x},${lastPoint.y}`;
}

// export function generateDynamicPath(pathCoords: number[][]) {
//     let path = Path();
//     path = path.moveto(pathCoords[0][0] * ROUTING_SCALING_FACTOR, pathCoords[0][1] * ROUTING_SCALING_FACTOR);
//     pathCoords.slice(1).forEach(coords => {
//         path = path.lineto(coords[0] * ROUTING_SCALING_FACTOR, coords[1] * ROUTING_SCALING_FACTOR);
//     });
//     return path.print();
// }
