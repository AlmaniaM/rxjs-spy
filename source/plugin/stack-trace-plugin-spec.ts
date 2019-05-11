/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-spy
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { getStackTrace, StackTracePlugin } from "./stack-trace-plugin";
import { SubscriberRefsPlugin } from "./subscriber-refs-plugin";
import { create } from "../spy-factory";
import { Spy } from "../spy-interface";

describe("StackTracePlugin", () => {

    let spy: Spy;
    let stackTracePlugin: StackTracePlugin;
    let subscriberRefsPlugin: SubscriberRefsPlugin;

    beforeEach(() => {

        stackTracePlugin = new StackTracePlugin();
        subscriberRefsPlugin = new SubscriberRefsPlugin();
        spy = create({ defaultPlugins: false, warning: false });
        spy.plug(stackTracePlugin, subscriberRefsPlugin);
    });

    it("should determine the stack traces", () => {

        const subject = new Subject<number>();
        const mapped = subject.pipe(map((value) => value));
        const subscription = mapped.subscribe();

        const subjectSubscriptionRef = subscriberRefsPlugin.get(subject);
        const mappedSubscriptionRef = subscriberRefsPlugin.get(mapped);

        const subjectStackTrace = getStackTrace(subjectSubscriptionRef);
        const mappedStackTrace = getStackTrace(mappedSubscriptionRef);

        expect(subjectStackTrace).to.exist;
        expect(subjectStackTrace).to.not.be.empty;

        expect(mappedStackTrace).to.exist;
        expect(mappedStackTrace).to.not.be.empty;
    });

    afterEach(() => {

        if (spy) {
            spy.teardown();
        }
    });
});
