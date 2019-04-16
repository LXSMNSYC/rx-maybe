/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2019
 */
/**
 * @external {Scheduler} https://lxsmnsyc.github.io/rx-scheduler/
 */
/**
 * @external {Iterable} https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
/**
 * @external {Thennable} https://promisesaplus.com/
 */
/**
 * @external {PromiseLike} https://promisesaplus.com/
 */
/**
 * @external {Cancellable} https://lxsmnsyc.github.io/rx-cancellable/
 */
import { LinkedCancellable } from 'rx-cancellable';
import { isObserver } from './internal/utils';
import {
  amb, ambWith, cache, compose, create,
  defer, empty, defaultIfEmpty, delay,
  delaySubscription, delayUntil, doAfterSuccess,
  doAfterTerminate, doFinally, doOnCancel,
  doOnComplete, doOnError, doOnEvent,
  doOnSubscribe, doOnSuccess, doOnTerminate,
  error, filter, flatMap, fromCallable,
  fromPromise, fromResolvable, just,
  lift, map, merge, never, onErrorComplete,
  onErrorResumeNext, onErrorReturn,
  onErrorReturnItem, retry, switchIfEmpty,
  takeUntil, timeout, timer, zip, zipWith, subscribeOn, observeOn,
} from './internal/operators';
/**
 * The Maybe class represents a deferred computation and emission of a single value,
 * no value at all or an exception.
 *
 * The Maybe class default consumer type it interacts with is the MaybeObserver via the
 * subscribe(MaybeObserver) method.
 *
 * The Maybe operates with the following sequential protocol:
 *
 * onSubscribe (onSuccess | onError | onComplete)?
 *
 * Note that onSuccess, onError and onComplete are mutually exclusive events;
 * unlike Observable, onSuccess is never followed by onError or onComplete.
 *
 * Like Observable, a running Maybe can be stopped through the Cancellable instance
 * provided to consumers through MaybeObserver.onSubscribe(Cancellable).
 *
 * Like an Observable, a Maybe is lazy, can be either "hot" or "cold", synchronous or
 * asynchronous.
 *
 * The documentation for this class makes use of marble diagrams. The following
 * legend explains these diagrams:
 *
 * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-maybe/master/assets/images/maybe.png" class="diagram">
 */
export default class Maybe {
  /**
   * @ignore
   */
  constructor(subscribeActual) {
    /**
     * @ignore
     */
    this.subscribeActual = subscribeActual;
  }

  /**
   * Runs multiple MaybeSources and signals the events
   * of the first one that signals (aborting the rest).
   *
   * @param {!Iterable} sources
   * the Iterable sequence of sources. A subscription
   * to each source will occur in the same order as
   * in the Iterable.
   * @returns {Maybe}
   */
  static amb(sources) {
    return amb(sources);
  }

  /**
   * Mirrors the Maybe (current or provided) that
   * first signals an event.
   * @param {!Maybe} other
   * a Maybe competing to react first. A subscription
   * to this provided source will occur after subscribing
   * to the current source.
   * @returns {Maybe}
   * a Maybe that emits the same sequence as whichever of the
   * source MaybeSources first signalled
   */
  ambWith(other) {
    return ambWith(this, other);
  }

  /**
   * Returns a Maybe that subscribes to this Maybe lazily,
   * caches its event and replays it, to all the downstream
   * subscribers.
   *
   * The operator subscribes only when the first downstream
   * subscriber subscribes and maintains a single subscription
   * towards this Maybe.
   *
   * @returns {Maybe}
   * a Maybe that, when first subscribed to, caches all of its
   * items and notifications for the benefit of subsequent
   * subscribers.
   */
  cache() {
    return cache(this);
  }

  /**
   * Transform a Maybe by applying a particular Transformer
   * function to it.
   *
   * This method operates on the Maybe itself whereas lift(MaybeObserver)
   * operates on the Maybe's Observers.
   *
   * If the operator you are creating is designed to act on
   * the individual item emitted by a Maybe, use lift(MaybeObserver).
   * If your operator is designed to transform the source
   * Maybe as a whole (for instance, by applying a particular
   * set of existing Maybe operators to it) use compose.
   *
   * @param {!function(source: Maybe):Maybe} transformer
   * the transformer function, not null
   * @returns {Maybe}
   * a Maybe, transformed by the transformer function
   */
  compose(transformer) {
    return compose(this, transformer);
  }

  /**
   * Provides an API (via a cold Maybe) that bridges the
   * reactive world with the callback-style world.
   *
   * @param {!function(e: Emitter):any} subscriber
   * the emitter that is called when a MaybeObserver
   * subscribes to the returned Maybe
   * @returns {Maybe}
   */
  static create(subscriber) {
    return create(subscriber);
  }

  /**
   * Returns a Maybe that emits the item emitted by the
   * source Maybe or a specified default item if the source
   * Maybe is empty.
   *
   * Note that the result Maybe is semantically equivalent to a
   * Single, since it's guaranteed to emit exactly one item or
   * an error.
   *
   * @param {!any} value
   * the item to emit if the source Maybe emits no items
   * @returns {Maybe}
   * a Maybe that emits either the specified default item
   * if the source Maybe emits no items, or the items emitted
   * by the source Maybe.
   */
  defaultIfEmpty(value) {
    return defaultIfEmpty(this, value);
  }

  /**
   * Calls a function for each individual MaybeObserver to return
   * the actual Maybe source to be subscribed to.
   *
   * @param {!function():Maybe} supplier
   * the function that is called for each individual MaybeObserver
   * and returns a Maybe instance to subscribe to
   * @returns {Maybe}
   */
  static defer(supplier) {
    return defer(supplier);
  }

  /**
   * Returns a Maybe that signals the events emitted by the
   * source Maybe shifted forward in time by a specified delay.
   * @param {!number} amount
   * the delay to shift the source by in milliseconds.
   * @param {?Scheduler} scheduler
   * the target scheduler to use for the non-blocking wait and emission.
   * By default, schedules on the current thread.
   * @param {?boolean} doDelayError
   * if true, both success and error signals are delayed.
   * if false, only success signals are delayed.
   * @returns {Maybe}
   */
  delay(amount, scheduler, doDelayError) {
    return delay(this, amount, scheduler, doDelayError);
  }

  /**
   * Returns a Maybe that delays the subscription to the source
   * Maybe by a given amount of time.
   * @param {!number} amount
   * the time to delay the subscription
   * @param {?Scheduler} scheduler
   * the target scheduler to use for the non-blocking wait and emission.
   * By default, schedules on the current thread.
   * @returns {Maybe}
   * a Maybe that delays the subscription to the source
   * Maybe by the given amount
   */
  delaySubscription(amount, scheduler) {
    return delaySubscription(this, amount, scheduler);
  }

  /**
   * Delays the actual subscription to the current Maybe until
   * the given other Maybe signals success.
   *
   * If the delaying source signals an error, that error is
   * re-emitted and no subscription to the current Maybe happens.
   *
   * @param {!Maybe} other
   * the Single that has to complete before the subscription
   * to the current Single happens.
   * @returns {Maybe}
   */
  delayUntil(other) {
    return delayUntil(this, other);
  }

  /**
   * Calls the specified consumer with the success item after this
   * item has been emitted to the downstream.
   * @param {!function(x:any)} consumer
   * the consumer that will be called after emitting an item
   * from upstream to the downstream
   * @returns {Maybe}
   */
  doAfterSuccess(consumer) {
    return doAfterSuccess(this, consumer);
  }

  /**
   * Registers an Action to be called when this Maybe invokes either
   * onSuccess, onComplete or onError.
   * @param {!function} action
   * an action to be invoked when the source Maybe finishes
   * @returns {Maybe}
   * a Maybe that emits the same items as the source Maybe,
   * then invokes the Action
   */
  doAfterTerminate(action) {
    return doAfterTerminate(this, action);
  }

  /**
   * Calls the specified action after this Maybe signals onSuccess,
   * onError or onComplete or gets cancelled by the downstream.
   *
   * In case of a race between a terminal event and a cancel call,
   * the provided onFinally action is executed once per subscription.
   *
   * @param {!function} action
   * the action called when this Maybe terminates or gets cancelled
   * @returns {Maybe}
   */
  doFinally(action) {
    return doFinally(this, action);
  }

  /**
   * Calls the shared action if an MaybeObserver subscribed to the current
   * Maybe cancels the common Cancellable it received via onSubscribe.
   *
   * @param {!function} action
   * the action called when the subscription is cancelled
   * @returns {Maybe}
   */
  doOnCancel(action) {
    return doOnCancel(this, action);
  }

  /**
   * Modifies the source Maybe so that it invokes an action when it calls
   * onComplete.
   * @param {!function} action
   * the action to invoke when the source Maybe calls onComplete.
   * @returns {Maybe}
   * the new Maybe with the side-effecting behavior applied.
   */
  doOnComplete(action) {
    return doOnComplete(this, action);
  }

  /**
   * Calls the shared consumer with the error sent via onError for each
   * MaybeObserver that subscribes to the current Maybe.
   * @param {!function(e: Error)} consumer
   * the consumer called with the success value of onError
   * @returns {Maybe}
   */
  doOnError(consumer) {
    return doOnError(this, consumer);
  }

  /**
   * Calls the given onEvent callback with the (success value, null) for
   * an onSuccess, (null, throwable) for an onError or (null, null) for
   * an onComplete signal from this Maybe before delivering said signal to the downstream.
   * @param {!function(success: any, e: Error)} biconsumer
   * the callback to call with the terminal event tuple
   * @returns {Maybe}
   */
  doOnEvent(biconsumer) {
    return doOnEvent(this, biconsumer);
  }

  /**
   * Calls the shared consumer with the Cancellable sent through
   * the onSubscribe for each MaybeObserver that subscribes to the current Maybe.
   *
   * @param {!function(ac: Cancellable)} consumer
   * the consumer called with the Cancellable sent via onSubscribe
   * @returns {Maybe}
   */
  doOnSubscribe(consumer) {
    return doOnSubscribe(this, consumer);
  }

  /**
   * Calls the shared consumer with the success value sent via onSuccess
   * for each MaybeObserver that subscribes to the current Maybe.
   *
   * @param {!function(success: any)} consumer
   * the consumer called with the success value of onSuccess
   * @returns {Maybe}
   */
  doOnSuccess(consumer) {
    return doOnSuccess(this, consumer);
  }

  /**
   * Returns a Maybe instance that calls the given onTerminate callback
   * just before this Maybe completes normally or with an exception.
   *
   * This differs from doAfterTerminate in that this happens before
   * the onComplete or onError notification.
   * @param {!function} action
   * the action to invoke when the consumer calls onComplete or onError
   * @returns {Maybe}
   */
  doOnTerminate(action) {
    return doOnTerminate(this, action);
  }

  /**
   * Returns a (singleton) Maybe instance that calls onComplete immediately.
   * @returns {Maybe}
   */
  static empty() {
    return empty();
  }

  /**
   * Returns a Maybe that invokes a subscriber's onError method when
   * the subscriber subscribes to it.
   * @param {!(function():Error|Error)} err
   * - the callable that is called for each individual
   * MaybeObserver and returns or throws a value to be emitted.
   * - the particular value to pass to onError
   * @returns {Maybe}
   * a Maybe that invokes the subscriber's onError method when the
   * subscriber subscribes to it
   */
  static error(err) {
    return error(err);
  }

  /**
   * Filters the success item of the Maybe via a predicate function
   * and emitting it if the predicate returns true, completing otherwise.
   * @param {!function(x: any):boolean} predicate
   * a function that evaluates the item emitted by the source Maybe,
   * returning true if it passes the filter
   * @returns {Maybe}
   * a Maybe that emit the item emitted by the source Maybe that the filter
   * evaluates as true
   */
  filter(predicate) {
    return filter(this, predicate);
  }

  /**
   * Returns a Maybe that is based on applying a specified function to the
   * item emitted by the source Maybe, where that function returns a Maybe.
   * @param {!function(x: any):Maybe} mapper
   * a function that, when applied to the item emitted by the source Maybe,
   * returns a Maybe.
   * @returns {Maybe}
   * the Maybe returned from mapper when applied to the item emitted by the
   * source Maybe
   */
  flatMap(mapper) {
    return flatMap(this, mapper);
  }

  /**
   * Returns a Maybe that invokes the given callable for each individual
   * MaybeObserver that subscribes and emits the resulting non-null item via
   * onSuccess while considering a null result from the callable as
   * indication for valueless completion via onComplete.
   *
   * This operator allows you to defer the execution of the given Callable
   * until a MaybeObserver subscribes to the returned Maybe. In other terms,
   * this source operator evaluates the given callable "lazily"
   *
   * If the result is a Promise-like instance, the
   * MaybeObserver is then subscribed to the Promise through
   * the fromPromise operator.
   *
   * @param {!function():any} callable
   * a callable instance whose execution should be deferred and performed
   * for each individual MaybeObserver that subscribes to the returned Maybe.
   * @returns {Maybe}
   */
  static fromCallable(callable) {
    return fromCallable(callable);
  }

  /**
   * Converts a Promise-like instance into a Maybe.
   *
   * @param {!(Promise|Thennable|PromiseLike)} promise
   * The promise to be converted into a Maybe.
   * @returns {Maybe}
   */
  static fromPromise(promise) {
    return fromPromise(promise);
  }

  /**
   * Provides a Promise-like interface for emitting signals.
   *
   * @param {!function(resolve: function, reject:function))} fulfillable
   * A function that accepts two parameters: resolve and reject,
   * similar to a Promise construct.
   * @returns {Maybe}
   */
  static fromResolvable(fulfillable) {
    return fromResolvable(fulfillable);
  }

  /**
   * Returns a Maybe that emits a specified item.
   * @param {!any} value
   * the item to emit
   * @returns {Maybe}
   * a Maybe that emits item
   */
  static just(value) {
    return just(value);
  }

  /**
   * This method requires advanced knowledge about building operators,
   * please consider other standard composition methods first;
   *
   * Returns a Maybe which, when subscribed to, invokes the operator
   * method of the provided MaybeObserver for each individual downstream Maybe
   * and allows the insertion of a custom operator by accessing the
   * downstream's MaybeObserver during this subscription phase and providing a new
   * MaybeObserver, containing the custom operator's intended business logic,
   * that will be used in the subscription process going further upstream.
   *
   * Generally, such a new MaybeObserver will wrap the downstream's MaybeObserver
   * and forwards the onSuccess, onError and onComplete events from the
   * upstream directly or according to the emission pattern the custom
   * operator's business logic requires. In addition, such operator can
   * intercept the flow control calls of cancel and signal.cancelled that
   * would have traveled upstream and perform additional actions
   * depending on the same business logic requirements.
   *
   * Note that implementing custom operators via this lift()
   * method adds slightly more overhead by requiring an additional
   * allocation and indirection per assembled flows. Instead,
   * using compose() method and  creating a transformer function
   * with it is recommended.
   *
   * @param {!function(observer: MaybeObserver):MaybeObserver} operator
   * the function that receives the downstream's MaybeObserver and should
   * return a MaybeObserver with custom behavior to be used as the consumer
   * for the current Maybe.
   * @returns {Maybe}
   */
  lift(operator) {
    return lift(this, operator);
  }

  /**
   * Returns a Maybe that applies a specified function to the item
   * emitted by the source Maybe and emits the result of this function
   * application.
   *
   * @param {!function} mapper
   * a function to apply to the item emitted by the Maybe
   * @returns {Maybe}
   * a Maybe that emits the item from the source Maybe, transformed by
   * the specified function
   */
  map(mapper) {
    return map(this, mapper);
  }


  /**
   * Flattens a Maybe that emits a Maybe into a single Maybe that emits
   * the item emitted by the nested Maybe, without any transformation.
   *
   * @param {!Maybe} source
   * a Maybe that emits a Maybe
   * @returns {Maybe}
   * a Maybe that emits the item that is the result of flattening the
   * Maybe emitted by source
   */
  static merge(source) {
    return merge(source);
  }

  /**
   * Returns a Maybe that never sends any items or notifications to a
   * MaybeObserver.
   *
   * @returns {Maybe}
   * a Maybe that never emits any items or sends any notifications to a
   * MaybeObserver
   */
  static never() {
    return never();
  }

  /**
   * Returns a Maybe which emits the terminal events from the
   * thread of the specified scheduler.
   *
   * @param {?Scheduler} scheduler
   * the target scheduler to use for the non-blocking wait and emission.
   * By default, schedules on the current thread.
   *
   * @returns {Maybe}
   * the source Maybe modified so that its subscribers are
   * notified on the specified Scheduler
   */
  observeOn(scheduler) {
    return observeOn(this, scheduler);
  }

  /**
   * Returns a Maybe instance that if this Maybe emits an
   * error and the predicate returns true, it will emit an onComplete
   * and swallow the throwable.
   *
   * If no predicate is provided, returns a Maybe instance that
   * if this Maybe emits an error, it will emit an onComplete
   * and swallow the error
   *
   * @param {function(e: Error):boolean} predicate
   * the predicate to call when an Error is emitted which should return true
   * if the Error should be swallowed and replaced with an onComplete.
   * @returns {Maybe}
   */
  onErrorComplete(predicate) {
    return onErrorComplete(this, predicate);
  }

  /**
   * Instructs a Maybe to pass control to another Maybe rather than
   * invoking onError if it encounters an error.
   *
   * @param {!function(e: Error):Maybe|Maybe} other
   * - the next Maybe that will take over if the source Maybe encounters an error
   * - a function that returns a Maybe that will take over if the source Maybe encounters an error
   * @returns {Maybe}
   */
  onErrorResumeNext(other) {
    return onErrorResumeNext(this, other);
  }

  /**
   * Instructs a Maybe to emit an item (returned by a specified function)
   * rather than invoking onError if it encounters an error.
   * @param {!function(e: Error):Maybe} supplier
   * a function that returns a single value that will be emitted as success value
   * the current Maybe signals an onError event
   * @returns {Maybe}
   */
  onErrorReturn(supplier) {
    return onErrorReturn(this, supplier);
  }

  /**
   * Instructs a Maybe to emit an item (returned by a specified function)
   * rather than invoking onError if it encounters an error.
   * @param {any} value
   * the value that is emitted as onSuccess in case this Maybe signals an onError
   * @returns {Maybe}
   */
  onErrorReturnItem(value) {
    return onErrorReturnItem(this, value);
  }

  /**
   * Returns a Maybe that mirrors the source Maybe, resubscribing to it if it calls
   * onError and the predicate returns true for that specific exception and retry count.
   * @param {!function(retries: number, err: Error):boolean} bipredicate
   * the predicate that determines if a resubscription may happen in case of a
   * specific exception and retry count.
   * @returns {Maybe}
   */
  retry(bipredicate) {
    return retry(this, bipredicate);
  }

  /**
   * Returns a Maybe which subscribes the child subscriber on the specified scheduler,
   * making sure the subscription side-effects happen on that specific thread of the scheduler.
   *
   * @param {?Scheduler} scheduler
   * the target scheduler to use for the non-blocking wait and emission.
   * By default, schedules on the current thread.
   *
   * @returns {Maybe}
   * the source Maybe modified so that its subscriptions happen
   * on the specified Scheduler
   */
  subscribeOn(scheduler) {
    return subscribeOn(this, scheduler);
  }

  /**
   * Returns a Maybe that emits the items emitted by the source Maybe or the items
   * of an alternate Maybe if the current Maybe is empty.
   * @param {Maybe} other
   * the alternate Maybe to subscribe to if the main does not emit any items
   * @returns {Maybe}
   * a Maybe that emits the items emitted by the source Maybe
   * or the items of an alternate Maybe if the source Maybe is empty.
   */
  switchIfEmpty(other) {
    return switchIfEmpty(this, other);
  }

  /**
   * Returns a Maybe that emits the items emitted by the source Maybe until
   * a second Maybe emits an item.
   * @param {Maybe} other
   * the Maybe whose first emitted item will cause takeUntil to stop
   * emitting items from the source Maybe
   * @returns {Maybe}
   * a Maybe that emits the items emitted by the source Maybe until
   * such time as other emits its first item
   */
  takeUntil(other) {
    return takeUntil(this, other);
  }

  /**
   * Returns a Maybe that mirrors the source Maybe but applies a
   * timeout policy for each emitted item. If the next item isn't
   * emitted within the specified timeout duration starting from its
   * predecessor, the resulting Maybe terminates and notifies MaybeObserver
   * of an Error with TimeoutException.
   *
   * @param {!number} amount
   * Amount of time in milliseconds
   * @param {?Scheduler} scheduler
   * the target scheduler to use for the non-blocking wait and emission.
   * By default, schedules on the current thread.
   * @returns {Maybe}
   */
  timeout(amount, scheduler) {
    return timeout(this, amount, scheduler);
  }

  /**
   * Returns a Maybe that emits 0L after a specified delay.
   * @param {!number} amount
   * Amount of time in milliseconds
   * @param {?Scheduler} scheduler
   * the target scheduler to use for the non-blocking wait and emission.
   * By default, schedules on the current thread.
   * @returns {Maybe}
   */
  static timer(amount, scheduler) {
    return timer(amount, scheduler);
  }

  /**
   * Returns a Maybe that emits the results of a specified combiner function
   * applied to combinations of items emitted, in sequence, by an Iterable of other
   * Maybes.
   * @param {!Iterable} sources
   * an Iterable of source Maybe
   * @param {?function(results: Array):any} zipper
   * a function that, when applied to an item emitted by each of the source Maybe,
   * results in an item that will be emitted by the resulting Maybe
   * @returns {Maybe}
   */
  static zip(sources, zipper) {
    return zip(sources, zipper);
  }

  /**
   * Waits until this and the other Maybe signal a success value then applies the
   * given function to those values and emits the function's resulting value to downstream.
   *
   * If either this or the other Maybe is empty or signals an error,
   * the resulting Maybe will terminate immediately and cancel the other source.
   *
   * @param {Maybe} other
   * the other Maybe
   * @param {function(a: any, b: any):any} zipper
   * a function that combines the pairs of items from the two Maybe to
   * generate the items to be emitted by the resulting Maybe
   * @returns {Maybe}
   */
  zipWith(other, zipper) {
    return zipWith(this, other, zipper);
  }

  /**
   * @desc
   * Subscribes with an Object that is an MaybeObserver.
   *
   * An Object is considered as an MaybeObserver if:
   *  - if it has the method onSubscribe
   *  - if it has the method onComplete (optional)
   *  - if it has the method onSuccess (optional)
   *  - if it has the method onError (optional)
   *
   * The onSubscribe method is called when subscribeWith
   * or subscribe is executed. This method receives an
   * Cancellable instance.
   *
   * @param {!Object} observer
   * @returns {undefined}
   */
  subscribeWith(observer) {
    if (isObserver(observer)) {
      this.subscribeActual.call(this, observer);
    }
  }

  /**
   * @desc
   * Subscribes to a Maybe instance with an onSuccess
   * and an onError method.
   *
   * onSuccess receives a non-undefined value.
   * onError receives a string(or an Error object).
   *
   * Both are called once.
   * @param {?function(x: any)} onSuccess
   * the function you have designed to accept the emission
   * from the Maybe
   * @param {?function(x: any)} onComplete
   * the function you have designed to accept the completion
   * from the Maybe
   * @param {?function(x: any)} onError
   * the function you have designed to accept any error
   * notification from the Maybe
   * @returns {Cancellable}
   * an Cancellable reference can request the Maybe to cancel.
   */
  subscribe(onSuccess, onComplete, onError) {
    const controller = new LinkedCancellable();
    this.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete,
      onSuccess,
      onError,
    });
    return controller;
  }


  /**
   * Converts the Maybe to a Promise instance.
   *
   * @returns {Promise}
   */
  toPromise() {
    return new Promise((res, rej) => {
      this.subscribe(res, rej);
    });
  }

  /**
   * Converts the Maybe to a Promise instance
   * and attaches callbacks to it.
   *
   * @param {!function(x: any):any} onFulfill
   * @param {?function(x: Error):any} onReject
   * @returns {Promise}
   */
  then(onFulfill, onReject) {
    return this.toPromise().then(onFulfill, onReject);
  }

  /**
   * Converts the Maybe to a Promise instance
   * and attaches an onRejection callback to it.
   *
   * @param {!function(x: Error):any} onReject
   * @returns {Promise}
   */
  catch(onReject) {
    return this.toPromise().catch(onReject);
  }
}
