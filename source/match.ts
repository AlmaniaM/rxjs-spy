/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/rxjs-spy
 */

import { Observable } from "rxjs/Observable";
import { Operator } from "rxjs/Operator";
import { Subscriber } from "rxjs/Subscriber";
import { identify } from "./identify";
import { isObservable } from "./util";

export type MatchPredicate = (tag: string | null, observable?: Observable<any>) => boolean;
export type Match = Observable<any> | string | RegExp | MatchPredicate;

export function matches<T>(observable: Observable<T>, match: Match): boolean {

    if (isObservable(match)) {
        return observable === match;
    }

    const identity = identify(observable);
    const tag = read(observable);

    if (typeof match === "function") {
        return match(tag, observable);
    }
    if (typeof match === "string") {
        return (match === identity) || (match === tag);
    }
    if (tag === null) {
        return false;
    }
    return match.test(tag);
}

export function read<T>(observable: Observable<T>): string | null {

    const operator = observable["operator"];
    if (!operator) {
        return null;
    }

    const tag = operator["tag"];
    if (!tag) {
        return null;
    }
    return tag;
}

export function toString(match: Match): string {

    if (isObservable(match)) {
        return "[Observable]";
    } else if (typeof match === "function") {
        return "[Function]";
    }
    return match.toString();
}
