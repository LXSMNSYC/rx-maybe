import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onComplete, onError,
  } = observer;

  const { source, callable } = this;

  source.subscribeWith({
    onSubscribe,
    onComplete() {
      callable();
      onComplete();
    },
    onSuccess,
    onError,
  });
}

/**
 * @ignore
 */
export default (source, callable) => {
  if (typeof callable !== 'function') {
    return source;
  }

  const maybe = new Maybe();
  maybe.source = source;
  maybe.callable = callable;
  maybe.subscribeActual = subscribeActual.bind(maybe);
  return maybe;
};
