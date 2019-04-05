import AbortController from 'abort-controller';
import { cleanObserver } from '../utils';
import Maybe from '../../maybe';

function subscribeActual(observer) {
  const {
    onSubscribe, onSuccess, onError,
  } = cleanObserver(observer);

  const controller = new AbortController();

  onSubscribe(controller);

  const { signal } = controller;

  if (signal.aborted) {
    return;
  }

  const { source, value } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onSuccess(x) {
      onSuccess(x);
      controller.abort();
    },
    onComplete() {
      onSuccess(value);
      controller.abort();
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
  });
}

/**
 * @ignore
 */
export default (source, value) => {
  if (value == null) {
    return source;
  }

  const maybe = new Maybe(subscribeActual);
  maybe.source = source;
  maybe.value = value;

  return maybe;
};
