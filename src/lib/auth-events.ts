type AuthSessionListener = () => void;
type UnauthorizedListener = () => void;

const sessionListeners = new Set<AuthSessionListener>();
const unauthorizedListeners = new Set<UnauthorizedListener>();

export function subscribeAuthSession(listener: AuthSessionListener): () => void {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function notifyAuthSessionChanged(): void {
  sessionListeners.forEach((listener) => listener());
}

export function subscribeUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

export function notifyUnauthorized(): void {
  unauthorizedListeners.forEach((listener) => listener());
}
