import { options as n, createContext as L, createElement as v$1, isValidElement as l$1, cloneElement as I } from './preact.js';

var t,r,u,i=[],o=n.__r,f=n.diffed,c=n.__c,e=n.unmount;function a(t){n.__h&&n.__h(r);var u=r.__H||(r.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v(n){return m(x,n)}function m(n,u,i){var o=a(t++);return o.__c||(o.__c=r,o.__=[i?i(u):x(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p(n,u){var i=a(t++);q(i.__H,u)&&(i.__=n,i.__H=u,r.__H.__h.push(i));}function l(n,u){var i=a(t++);q(i.__H,u)&&(i.__=n,i.__H=u,r.__h.push(i));}function y(n){return s(function(){return {current:n}},[])}function s(n,r){var u=a(t++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function h(n,t){return s(function(){return n},t)}function T(n){var u=r.context[n.__c];if(!u)return n.__;var i=a(t++);return null==i.__&&(i.__=!0,u.sub(r)),u.props.value}function F(){i.some(function(t){if(t.__P)try{t.__H.__h.forEach(_),t.__H.__h.forEach(g),t.__H.__h=[];}catch(r){return n.__e(r,t.__v),!0}}),i=[];}function _(n){n.t&&n.t();}function g(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o&&o(n),t=0,(r=n.__c).__H&&(r.__H.__h.forEach(_),r.__H.__h.forEach(g),r.__H.__h=[]);},n.diffed=function(t){f&&f(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i.push(r)&&u===n.requestAnimationFrame||((u=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_),t.__h=t.__h.filter(function(n){return !n.__||g(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c&&c(t,r);},n.unmount=function(t){e&&e(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

var locationHook = ({ base = "" } = {}) => {
  const [path, update] = v(currentPathname(base));
  const prevPath = y(path);

  p(() => {
    patchHistoryEvents();

    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.
    const checkForUpdates = () => {
      const pathname = currentPathname(base);
      prevPath.current !== pathname && update((prevPath.current = pathname));
    };

    const events = ["popstate", "pushState", "replaceState"];
    events.map(e => addEventListener(e, checkForUpdates));

    // it's possible that an update has occurred between render and the effect handler,
    // so we run additional check on mount to catch these updates. Based on:
    // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
    checkForUpdates();

    return () => events.map(e => removeEventListener(e, checkForUpdates));
  }, []);

  // the 2nd argument of the `useLocation` return value is a function
  // that allows to perform a navigation.
  //
  // the function reference should stay the same between re-renders, so that
  // it can be passed down as an element prop without any performance concerns.
  const navigate = h(
    (to, replace) =>
      history[replace ? "replaceState" : "pushState"](0, 0, base + to),
    []
  );

  return [path, navigate];
};

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031

let patched = 0;

const patchHistoryEvents = () => {
  if (patched) return;

  ["pushState", "replaceState"].map(type => {
    const original = history[type];

    history[type] = function() {
      const result = original.apply(this, arguments);
      const event = new Event(type);
      event.arguments = arguments;

      dispatchEvent(event);
      return result;
    };
  });

  return (patched = 1);
};

const currentPathname = (base, path = location.pathname) =>
  !path.indexOf(base) ? path.slice(base.length) || "/" : path;

// creates a matcher function
function makeMatcher(makeRegexpFn = pathToRegexp) {
  let cache = {};

  // obtains a cached regexp version of the pattern
  const getRegexp = pattern =>
    (cache[pattern]) || (cache[pattern] = makeRegexpFn(pattern));

  return (pattern, path) => {
    const { regexp, keys } = getRegexp(pattern || "");
    const out = regexp.exec(path);

    if (!out) return [false, null];

    // formats an object with matched params
    const params = keys.reduce((params, key, i) => {
      params[key.name] = out[i + 1];
      return params;
    }, {});

    return [true, params];
  };
}

// escapes a regexp string (borrowed from path-to-regexp sources)
// https://github.com/pillarjs/path-to-regexp/blob/v3.0.0/index.js#L202
const escapeRx = str => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

// returns a segment representation in RegExp based on flags
// adapted and simplified version from path-to-regexp sources
const rxForSegment = (repeat, optional, prefix) => {
  let capture = repeat ? "((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)" : "([^\\/]+?)";
  if (optional && prefix) capture = "(?:\\/" + capture + ")";
  return capture + (optional ? "?" : "");
};

const pathToRegexp = pattern => {
  const groupRx = /:([A-Za-z0-9_]+)([?+*]?)/g;

  let match = null,
    lastIndex = 0,
    keys = [],
    result = "";

  while ((match = groupRx.exec(pattern)) !== null) {
    const [_, segment, mod] = match;

    // :foo  [1]      (  )
    // :foo? [0 - 1]  ( o)
    // :foo+ [1 - ∞]  (r )
    // :foo* [0 - ∞]  (ro)
    const repeat = mod === "+" || mod === "*";
    const optional = mod === "?" || mod === "*";
    const prefix = optional && pattern[match.index - 1] === "/" ? 1 : 0;

    const prev = pattern.substring(lastIndex, match.index - prefix);

    keys.push({ name: segment });
    lastIndex = groupRx.lastIndex;

    result += escapeRx(prev) + rxForSegment(repeat, optional, prefix);
  }

  result += escapeRx(pattern.substring(lastIndex));
  return { keys, regexp: new RegExp("^" + result + "(?:\\/)?$", "i") };
};

/*
 * Part 1, Hooks API: useRouter, useRoute and useLocation
 */

// one of the coolest features of `createContext`:
// when no value is provided — default object is used.
// allows us to use the router context as a global ref to store
// the implicitly created router (see `useRouter` below)
const RouterCtx = L({});

const buildRouter = ({
  hook = locationHook,
  base = "",
  matcher = makeMatcher()
} = {}) => ({ hook, base, matcher });

const useRouter = () => {
  const globalRef = T(RouterCtx);

  // either obtain the router from the outer context (provided by the
  // `<Router /> component) or create an implicit one on demand.
  return globalRef.v || (globalRef.v = buildRouter());
};

const useLocation = () => {
  const router = useRouter();
  return router.hook(router);
};

const useRoute = pattern => {
  const [path] = useLocation();
  return useRouter().matcher(pattern, path);
};

/*
 * Part 2, Low Carb Router API: Router, Route, Link, Switch
 */

const Router = props => {
  const ref = y(null);

  // this little trick allows to avoid having unnecessary
  // calls to potentially expensive `buildRouter` method.
  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  const value = ref.current || (ref.current = { v: buildRouter(props) });

  return v$1(RouterCtx.Provider, {
    value: value,
    children: props.children
  });
};

const Route = ({ path, match, component, children }) => {
  const useRouteMatch = useRoute(path);

  // `props.match` is present - Route is controlled by the Switch
  const [matches, params] = match || useRouteMatch;

  if (!matches) return null;

  // React-Router style `component` prop
  if (component) return v$1(component, { params });

  // support render prop or plain children
  return typeof children === "function" ? children(params) : children;
};

const Link = props => {
  const [, navigate] = useLocation();
  const { base } = useRouter();

  const href = props.href || props.to;
  const { children, onClick } = props;

  const handleClick = h(
    event => {
      // ignores the navigation when clicked using right mouse button or
      // by holding a special modifier key: ctrl, command, win, alt, shift
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.button !== 0
      )
        return;

      event.preventDefault();
      navigate(href);
      onClick && onClick(event);
    },
    [href, onClick, navigate]
  );

  // wraps children in `a` if needed
  const extraProps = { href: base + href, onClick: handleClick, to: null };
  const jsx = l$1(children) ? children : v$1("a", props);

  return I(jsx, extraProps);
};

const Switch = ({ children, location }) => {
  const { matcher } = useRouter();
  const [originalLocation] = useLocation();

  children = Array.isArray(children) ? children : [children];

  for (const element of children) {
    let match = 0;

    if (
      l$1(element) &&
      // we don't require an element to be of type Route,
      // but we do require it to contain a truthy `path` prop.
      // this allows to use different components that wrap Route
      // inside of a switch, for example <AnimatedRoute />.
      element.props.path &&
      (match = matcher(element.props.path, location || originalLocation))[0]
    )
      return I(element, { match });
  }

  return null;
};

const Redirect = props => {
  const [, push] = useLocation();
  l(() => {
    push(props.href || props.to);

    // we pass an empty array of dependecies to ensure that
    // we only run the effect once after initial render
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default useRoute;
export { Link, Redirect, Route, Router, Switch, useLocation, useRoute, useRouter };
