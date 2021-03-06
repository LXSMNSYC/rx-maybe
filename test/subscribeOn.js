/* eslint-disable no-undef */
import assert from 'assert';
import Scheduler from 'rx-scheduler';
import Maybe from '../src/maybe';

describe('#subscribeOn', () => {
  it('should return a Maybe', () => {
    assert(Maybe.empty().subscribeOn(Scheduler.current));
  });
  it('should be synchronous with non-Scheduler', (done) => {
    let flag = false;

    const maybe = Maybe.just('Hello World').subscribeOn();

    maybe.subscribe(
      () => { flag = true; },
      done,
      done,
    );

    if (flag) {
      done();
    } else {
      done(false);
    }
  });
  it('should be synchronous with Scheduler.current', (done) => {
    let flag = false;

    const maybe = Maybe.empty().subscribeOn(Scheduler.current);

    maybe.subscribe(
      done,
      () => { flag = true; },
      done,
    );

    if (flag) {
      done();
    } else {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.tick', (done) => {
    let flag = false;

    const maybe = Maybe.empty().subscribeOn(Scheduler.tick);

    maybe.subscribe(
      done,
      () => { flag = true; },
      done,
    );

    process.nextTick(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.async', (done) => {
    let flag = false;

    const maybe = Maybe.empty().subscribeOn(Scheduler.async);

    maybe.subscribe(
      done,
      () => { flag = true; },
      done,
    );

    Promise.resolve().then(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.immediate', (done) => {
    let flag = false;

    const maybe = Maybe.empty().subscribeOn(Scheduler.immediate);

    maybe.subscribe(
      done,
      () => { flag = true; },
      done,
    );

    setImmediate(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.timeout', (done) => {
    let flag = false;

    const maybe = Maybe.error(new Error('Hello World')).subscribeOn(Scheduler.timeout);

    maybe.subscribe(
      done,
      done,
      () => { flag = true; },
    );

    setTimeout(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
});
