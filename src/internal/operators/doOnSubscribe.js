import Maybe from '../../maybe';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSubscribe, onSuccess, onError } = observer;

  const { source, callable } = this;

  source.subscribeWith({
    onSubscribe(d) {
      callable(d);
      onSubscribe(d);
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
  const single = new Maybe();
  single.source = source;
  single.callable = callable;
  single.subscribeActual = subscribeActual.bind(single);
  return single;
};