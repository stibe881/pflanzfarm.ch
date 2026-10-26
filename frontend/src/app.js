(function () {
  const C = document.createElement("link").relList;
  if (C && C.supports && C.supports("modulepreload")) return;
  for (const L of document.querySelectorAll('link[rel="modulepreload"]')) y(L);
  new MutationObserver((L) => {
    for (const X of L)
      if (X.type === "childList")
        for (const Se of X.addedNodes) Se.tagName === "LINK" && Se.rel === "modulepreload" && y(Se);
  }).observe(document, { childList: !0, subtree: !0 });
  function _(L) {
    const X = {};
    return (
      L.integrity && (X.integrity = L.integrity),
      L.referrerPolicy && (X.referrerPolicy = L.referrerPolicy),
      L.crossOrigin === "use-credentials"
        ? (X.credentials = "include")
        : L.crossOrigin === "anonymous"
          ? (X.credentials = "omit")
          : (X.credentials = "same-origin"),
      X
    );
  }
  function y(L) {
    if (L.ep) return;
    L.ep = !0;
    const X = _(L);
    fetch(L.href, X);
  }
})();
var of = { exports: {} },
  Wi = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Bm;
function Kv() {
  if (Bm) return Wi;
  Bm = 1;
  var o = Symbol.for("react.transitional.element"),
    C = Symbol.for("react.fragment");
  function _(y, L, X) {
    var Se = null;
    if ((X !== void 0 && (Se = "" + X), L.key !== void 0 && (Se = "" + L.key), "key" in L)) {
      X = {};
      for (var Le in L) Le !== "key" && (X[Le] = L[Le]);
    } else X = L;
    return ((L = X.ref), { $$typeof: o, type: y, key: Se, ref: L !== void 0 ? L : null, props: X });
  }
  return ((Wi.Fragment = C), (Wi.jsx = _), (Wi.jsxs = _), Wi);
}
var qm;
function Jv() {
  return (qm || ((qm = 1), (of.exports = Kv())), of.exports);
}
var i = Jv(),
  hf = { exports: {} },
  W = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var km;
function Fv() {
  if (km) return W;
  km = 1;
  var o = Symbol.for("react.transitional.element"),
    C = Symbol.for("react.portal"),
    _ = Symbol.for("react.fragment"),
    y = Symbol.for("react.strict_mode"),
    L = Symbol.for("react.profiler"),
    X = Symbol.for("react.consumer"),
    Se = Symbol.for("react.context"),
    Le = Symbol.for("react.forward_ref"),
    ne = Symbol.for("react.suspense"),
    Ne = Symbol.for("react.memo"),
    A = Symbol.for("react.lazy"),
    p = Symbol.for("react.activity"),
    B = Symbol.for("react.view_transition"),
    ge = Symbol.iterator;
  function O(d) {
    return d === null || typeof d != "object"
      ? null
      : ((d = (ge && d[ge]) || d["@@iterator"]), typeof d == "function" ? d : null);
  }
  var re = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    ve = Object.assign,
    ht = {};
  function Qe(d, N, G) {
    ((this.props = d), (this.context = N), (this.refs = ht), (this.updater = G || re));
  }
  ((Qe.prototype.isReactComponent = {}),
    (Qe.prototype.setState = function (d, N) {
      if (typeof d != "object" && typeof d != "function" && d != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, d, N, "setState");
    }),
    (Qe.prototype.forceUpdate = function (d) {
      this.updater.enqueueForceUpdate(this, d, "forceUpdate");
    }));
  function k() {}
  k.prototype = Qe.prototype;
  function ye(d, N, G) {
    ((this.props = d), (this.context = N), (this.refs = ht), (this.updater = G || re));
  }
  var Ot = (ye.prototype = new k());
  ((Ot.constructor = ye), ve(Ot, Qe.prototype), (Ot.isPureReactComponent = !0));
  var R = Array.isArray;
  function te() {}
  var he = { H: null, A: null, T: null, S: null },
    Jt = Object.prototype.hasOwnProperty;
  function Ce(d, N, G) {
    var Y = G.ref;
    return { $$typeof: o, type: d, key: N, ref: Y !== void 0 ? Y : null, props: G };
  }
  function bt(d, N) {
    return Ce(d.type, N, d.props);
  }
  function ut(d) {
    return typeof d == "object" && d !== null && d.$$typeof === o;
  }
  function Mt(d) {
    var N = { "=": "=0", ":": "=2" };
    return (
      "$" +
      d.replace(/[=:]/g, function (G) {
        return N[G];
      })
    );
  }
  var gl = /\/+/g;
  function ke(d, N) {
    return typeof d == "object" && d !== null && d.key != null ? Mt("" + d.key) : N.toString(36);
  }
  function D(d) {
    switch (d.status) {
      case "fulfilled":
        return d.value;
      case "rejected":
        throw d.reason;
      default:
        switch (
          (typeof d.status == "string"
            ? d.then(te, te)
            : ((d.status = "pending"),
              d.then(
                function (N) {
                  d.status === "pending" && ((d.status = "fulfilled"), (d.value = N));
                },
                function (N) {
                  d.status === "pending" && ((d.status = "rejected"), (d.reason = N));
                },
              )),
          d.status)
        ) {
          case "fulfilled":
            return d.value;
          case "rejected":
            throw d.reason;
        }
    }
    throw d;
  }
  function Z(d, N, G, Y, ae) {
    var fe = typeof d;
    (fe === "undefined" || fe === "boolean") && (d = null);
    var de = !1;
    if (d === null) de = !0;
    else
      switch (fe) {
        case "bigint":
        case "string":
        case "number":
          de = !0;
          break;
        case "object":
          switch (d.$$typeof) {
            case o:
            case C:
              de = !0;
              break;
            case A:
              return ((de = d._init), Z(de(d._payload), N, G, Y, ae));
          }
      }
    if (de)
      return (
        (ae = ae(d)),
        (de = Y === "" ? "." + ke(d, 0) : Y),
        R(ae)
          ? ((G = ""),
            de != null && (G = de.replace(gl, "$&/") + "/"),
            Z(ae, N, G, "", function (Bt) {
              return Bt;
            }))
          : ae != null &&
            (ut(ae) &&
              (ae = bt(
                ae,
                G + (ae.key == null || (d && d.key === ae.key) ? "" : ("" + ae.key).replace(gl, "$&/") + "/") + de,
              )),
            N.push(ae)),
        1
      );
    de = 0;
    var q = Y === "" ? "." : Y + ":";
    if (R(d)) for (var F = 0; F < d.length; F++) ((Y = d[F]), (fe = q + ke(Y, F)), (de += Z(Y, N, G, fe, ae)));
    else if (((F = O(d)), typeof F == "function"))
      for (d = F.call(d), F = 0; !(Y = d.next()).done;)
        ((Y = Y.value), (fe = q + ke(Y, F++)), (de += Z(Y, N, G, fe, ae)));
    else if (fe === "object") {
      if (typeof d.then == "function") return Z(D(d), N, G, Y, ae);
      throw (
        (N = String(d)),
        Error(
          "Objects are not valid as a React child (found: " +
            (N === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : N) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return de;
  }
  function Q(d, N, G) {
    if (d == null) return d;
    var Y = [],
      ae = 0;
    return (
      Z(d, Y, "", "", function (fe) {
        return N.call(G, fe, ae++);
      }),
      Y
    );
  }
  function je(d) {
    if (d._status === -1) {
      var N = d._result,
        G = N();
      (G.then(
        function (Y) {
          (d._status === 0 || d._status === -1) &&
            ((d._status = 1), (d._result = Y), G.status === void 0 && ((G.status = "fulfilled"), (G.value = Y)));
        },
        function (Y) {
          (d._status === 0 || d._status === -1) &&
            ((d._status = 2), (d._result = Y), G.status === void 0 && ((G.status = "rejected"), (G.reason = Y)));
        },
      ),
        d._status === -1 && ((d._status = 0), (d._result = G)));
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var me =
    typeof reportError == "function"
      ? reportError
      : function (d) {
          if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var N = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof d == "object" && d !== null && typeof d.message == "string" ? String(d.message) : String(d),
              error: d,
            });
            if (!window.dispatchEvent(N)) return;
          } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", d);
            return;
          }
          console.error(d);
        };
  function jt(d) {
    var N = he.T,
      G = {};
    ((G.types = N !== null ? N.types : null), (he.T = G));
    try {
      var Y = d(),
        ae = he.S;
      (ae !== null && ae(G, Y), typeof Y == "object" && Y !== null && typeof Y.then == "function" && Y.then(te, me));
    } catch (fe) {
      me(fe);
    } finally {
      (N !== null && G.types !== null && (N.types = G.types), (he.T = N));
    }
  }
  function Ct(d) {
    var N = he.T;
    if (N !== null) {
      var G = N.types;
      G === null ? (N.types = [d]) : G.indexOf(d) === -1 && G.push(d);
    } else jt(Ct.bind(null, d));
  }
  var Ue = {
    map: Q,
    forEach: function (d, N, G) {
      Q(
        d,
        function () {
          N.apply(this, arguments);
        },
        G,
      );
    },
    count: function (d) {
      var N = 0;
      return (
        Q(d, function () {
          N++;
        }),
        N
      );
    },
    toArray: function (d) {
      return (
        Q(d, function (N) {
          return N;
        }) || []
      );
    },
    only: function (d) {
      if (!ut(d)) throw Error("React.Children.only expected to receive a single React element child.");
      return d;
    },
  };
  return (
    (W.Activity = p),
    (W.Children = Ue),
    (W.Component = Qe),
    (W.Fragment = _),
    (W.Profiler = L),
    (W.PureComponent = ye),
    (W.StrictMode = y),
    (W.Suspense = ne),
    (W.ViewTransition = B),
    (W.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = he),
    (W.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (d) {
        return he.H.useMemoCache(d);
      },
    }),
    (W.addTransitionType = Ct),
    (W.cache = function (d) {
      return function () {
        return d.apply(null, arguments);
      };
    }),
    (W.cacheSignal = function () {
      return null;
    }),
    (W.cloneElement = function (d, N, G) {
      if (d == null) throw Error("The argument must be a React element, but you passed " + d + ".");
      var Y = ve({}, d.props),
        ae = d.key;
      if (N != null)
        for (fe in (N.key !== void 0 && (ae = "" + N.key), N))
          !Jt.call(N, fe) ||
            fe === "key" ||
            fe === "__self" ||
            fe === "__source" ||
            (fe === "ref" && N.ref === void 0) ||
            (Y[fe] = N[fe]);
      var fe = arguments.length - 2;
      if (fe === 1) Y.children = G;
      else if (1 < fe) {
        for (var de = Array(fe), q = 0; q < fe; q++) de[q] = arguments[q + 2];
        Y.children = de;
      }
      return Ce(d.type, ae, Y);
    }),
    (W.createContext = function (d) {
      return (
        (d = { $$typeof: Se, _currentValue: d, _currentValue2: d, _threadCount: 0, Provider: null, Consumer: null }),
        (d.Provider = d),
        (d.Consumer = { $$typeof: X, _context: d }),
        d
      );
    }),
    (W.createElement = function (d, N, G) {
      var Y,
        ae = {},
        fe = null;
      if (N != null)
        for (Y in (N.key !== void 0 && (fe = "" + N.key), N))
          Jt.call(N, Y) && Y !== "key" && Y !== "__self" && Y !== "__source" && (ae[Y] = N[Y]);
      var de = arguments.length - 2;
      if (de === 1) ae.children = G;
      else if (1 < de) {
        for (var q = Array(de), F = 0; F < de; F++) q[F] = arguments[F + 2];
        ae.children = q;
      }
      if (d && d.defaultProps) for (Y in ((de = d.defaultProps), de)) ae[Y] === void 0 && (ae[Y] = de[Y]);
      return Ce(d, fe, ae);
    }),
    (W.createRef = function () {
      return { current: null };
    }),
    (W.forwardRef = function (d) {
      return { $$typeof: Le, render: d };
    }),
    (W.isValidElement = ut),
    (W.lazy = function (d) {
      return { $$typeof: A, _payload: { _status: -1, _result: d }, _init: je };
    }),
    (W.memo = function (d, N) {
      return { $$typeof: Ne, type: d, compare: N === void 0 ? null : N };
    }),
    (W.startTransition = jt),
    (W.unstable_useCacheRefresh = function () {
      return he.H.useCacheRefresh();
    }),
    (W.use = function (d) {
      return he.H.use(d);
    }),
    (W.useActionState = function (d, N, G) {
      return he.H.useActionState(d, N, G);
    }),
    (W.useCallback = function (d, N) {
      return he.H.useCallback(d, N);
    }),
    (W.useContext = function (d) {
      return he.H.useContext(d);
    }),
    (W.useDebugValue = function () {}),
    (W.useDeferredValue = function (d, N) {
      return he.H.useDeferredValue(d, N);
    }),
    (W.useEffect = function (d, N) {
      return he.H.useEffect(d, N);
    }),
    (W.useEffectEvent = function (d) {
      return he.H.useEffectEvent(d);
    }),
    (W.useId = function () {
      return he.H.useId();
    }),
    (W.useImperativeHandle = function (d, N, G) {
      return he.H.useImperativeHandle(d, N, G);
    }),
    (W.useInsertionEffect = function (d, N) {
      return he.H.useInsertionEffect(d, N);
    }),
    (W.useLayoutEffect = function (d, N) {
      return he.H.useLayoutEffect(d, N);
    }),
    (W.useMemo = function (d, N) {
      return he.H.useMemo(d, N);
    }),
    (W.useOptimistic = function (d, N) {
      return he.H.useOptimistic(d, N);
    }),
    (W.useReducer = function (d, N, G) {
      return he.H.useReducer(d, N, G);
    }),
    (W.useRef = function (d) {
      return he.H.useRef(d);
    }),
    (W.useState = function (d) {
      return he.H.useState(d);
    }),
    (W.useSyncExternalStore = function (d, N, G) {
      return he.H.useSyncExternalStore(d, N, G);
    }),
    (W.useTransition = function () {
      return he.H.useTransition();
    }),
    (W.version = "19.3.1"),
    W
  );
}
var Gm;
function Nf() {
  return (Gm || ((Gm = 1), (hf.exports = Fv())), hf.exports);
}
var H = Nf(),
  mf = { exports: {} },
  $i = {},
  gf = { exports: {} },
  vf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ym;
function Wv() {
  return (
    Ym ||
      ((Ym = 1),
      (function (o) {
        function C(D, Z) {
          var Q = D.length;
          D.push(Z);
          e: for (; 0 < Q;) {
            var je = (Q - 1) >>> 1,
              me = D[je];
            if (0 < L(me, Z)) ((D[je] = Z), (D[Q] = me), (Q = je));
            else break e;
          }
        }
        function _(D) {
          return D.length === 0 ? null : D[0];
        }
        function y(D) {
          if (D.length === 0) return null;
          var Z = D[0],
            Q = D.pop();
          if (Q !== Z) {
            D[0] = Q;
            e: for (var je = 0, me = D.length, jt = me >>> 1; je < jt;) {
              var Ct = 2 * (je + 1) - 1,
                Ue = D[Ct],
                d = Ct + 1,
                N = D[d];
              if (0 > L(Ue, Q))
                d < me && 0 > L(N, Ue) ? ((D[je] = N), (D[d] = Q), (je = d)) : ((D[je] = Ue), (D[Ct] = Q), (je = Ct));
              else if (d < me && 0 > L(N, Q)) ((D[je] = N), (D[d] = Q), (je = d));
              else break e;
            }
          }
          return Z;
        }
        function L(D, Z) {
          var Q = D.sortIndex - Z.sortIndex;
          return Q !== 0 ? Q : D.id - Z.id;
        }
        if (((o.unstable_now = void 0), typeof performance == "object" && typeof performance.now == "function")) {
          var X = performance;
          o.unstable_now = function () {
            return X.now();
          };
        } else {
          var Se = Date,
            Le = Se.now();
          o.unstable_now = function () {
            return Se.now() - Le;
          };
        }
        var ne = [],
          Ne = [],
          A = 1,
          p = null,
          B = 3,
          ge = !1,
          O = !1,
          re = !1,
          ve = !1,
          ht = typeof setTimeout == "function" ? setTimeout : null,
          Qe = typeof clearTimeout == "function" ? clearTimeout : null,
          k = typeof setImmediate < "u" ? setImmediate : null;
        function ye(D) {
          for (var Z = _(Ne); Z !== null;) {
            if (Z.callback === null) y(Ne);
            else if (Z.startTime <= D) (y(Ne), (Z.sortIndex = Z.expirationTime), C(ne, Z));
            else break;
            Z = _(Ne);
          }
        }
        function Ot(D) {
          if (((re = !1), ye(D), !O))
            if (_(ne) !== null) ((O = !0), R || ((R = !0), ut()));
            else {
              var Z = _(Ne);
              Z !== null && ke(Ot, Z.startTime - D);
            }
        }
        var R = !1,
          te = -1,
          he = 5,
          Jt = -1;
        function Ce() {
          return ve ? !0 : !(o.unstable_now() - Jt < he);
        }
        function bt() {
          if (((ve = !1), R)) {
            var D = o.unstable_now();
            Jt = D;
            var Z = !0;
            try {
              e: {
                ((O = !1), re && ((re = !1), Qe(te), (te = -1)), (ge = !0));
                var Q = B;
                try {
                  t: {
                    for (ye(D), p = _(ne); p !== null && !(p.expirationTime > D && Ce());) {
                      var je = p.callback;
                      if (typeof je == "function") {
                        ((p.callback = null), (B = p.priorityLevel));
                        var me = je(p.expirationTime <= D);
                        if (((D = o.unstable_now()), typeof me == "function")) {
                          ((p.callback = me), ye(D), (Z = !0));
                          break t;
                        }
                        (p === _(ne) && y(ne), ye(D));
                      } else y(ne);
                      p = _(ne);
                    }
                    if (p !== null) Z = !0;
                    else {
                      var jt = _(Ne);
                      (jt !== null && ke(Ot, jt.startTime - D), (Z = !1));
                    }
                  }
                  break e;
                } finally {
                  ((p = null), (B = Q), (ge = !1));
                }
                Z = void 0;
              }
            } finally {
              Z ? ut() : (R = !1);
            }
          }
        }
        var ut;
        if (typeof k == "function")
          ut = function () {
            k(bt);
          };
        else if (typeof MessageChannel < "u") {
          var Mt = new MessageChannel(),
            gl = Mt.port2;
          ((Mt.port1.onmessage = bt),
            (ut = function () {
              gl.postMessage(null);
            }));
        } else
          ut = function () {
            ht(bt, 0);
          };
        function ke(D, Z) {
          te = ht(function () {
            D(o.unstable_now());
          }, Z);
        }
        ((o.unstable_IdlePriority = 5),
          (o.unstable_ImmediatePriority = 1),
          (o.unstable_LowPriority = 4),
          (o.unstable_NormalPriority = 3),
          (o.unstable_Profiling = null),
          (o.unstable_UserBlockingPriority = 2),
          (o.unstable_cancelCallback = function (D) {
            D.callback = null;
          }),
          (o.unstable_forceFrameRate = function (D) {
            0 > D || 125 < D
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (he = 0 < D ? Math.floor(1e3 / D) : 5);
          }),
          (o.unstable_getCurrentPriorityLevel = function () {
            return B;
          }),
          (o.unstable_next = function (D) {
            switch (B) {
              case 1:
              case 2:
              case 3:
                var Z = 3;
                break;
              default:
                Z = B;
            }
            var Q = B;
            B = Z;
            try {
              return D();
            } finally {
              B = Q;
            }
          }),
          (o.unstable_requestPaint = function () {
            ve = !0;
          }),
          (o.unstable_runWithPriority = function (D, Z) {
            switch (D) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                D = 3;
            }
            var Q = B;
            B = D;
            try {
              return Z();
            } finally {
              B = Q;
            }
          }),
          (o.unstable_scheduleCallback = function (D, Z, Q) {
            var je = o.unstable_now();
            switch (
              (typeof Q == "object" && Q !== null
                ? ((Q = Q.delay), (Q = typeof Q == "number" && 0 < Q ? je + Q : je))
                : (Q = je),
              D)
            ) {
              case 1:
                var me = -1;
                break;
              case 2:
                me = 250;
                break;
              case 5:
                me = 1073741823;
                break;
              case 4:
                me = 1e4;
                break;
              default:
                me = 5e3;
            }
            return (
              (me = Q + me),
              (D = { id: A++, callback: Z, priorityLevel: D, startTime: Q, expirationTime: me, sortIndex: -1 }),
              Q > je
                ? ((D.sortIndex = Q),
                  C(Ne, D),
                  _(ne) === null && D === _(Ne) && (re ? (Qe(te), (te = -1)) : (re = !0), ke(Ot, Q - je)))
                : ((D.sortIndex = me), C(ne, D), O || ge || ((O = !0), R || ((R = !0), ut()))),
              D
            );
          }),
          (o.unstable_shouldYield = Ce),
          (o.unstable_wrapCallback = function (D) {
            var Z = B;
            return function () {
              var Q = B;
              B = Z;
              try {
                return D.apply(this, arguments);
              } finally {
                B = Q;
              }
            };
          }));
      })(vf)),
    vf
  );
}
var Vm;
function $v() {
  return (Vm || ((Vm = 1), (gf.exports = Wv())), gf.exports);
}
var yf = { exports: {} },
  ot = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Lm;
function Pv() {
  if (Lm) return ot;
  Lm = 1;
  var o = Nf();
  function C(A) {
    var p = "https://react.dev/errors/" + A;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var B = 2; B < arguments.length; B++) p += "&args[]=" + encodeURIComponent(arguments[B]);
    }
    return (
      "Minified React error #" +
      A +
      "; visit " +
      p +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function _() {}
  var y = {
      d: {
        f: _,
        r: function () {
          throw Error(C(522));
        },
        D: _,
        C: _,
        L: _,
        m: _,
        X: _,
        S: _,
        M: _,
      },
      p: 0,
      findDOMNode: null,
    },
    L = Symbol.for("react.portal"),
    X = Symbol.for("react.recoverable"),
    Se = Symbol.for("react.optimistic_key");
  function Le(A, p, B) {
    var ge = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: L,
      key: ge == null ? null : ge === Se ? Se : "" + ge,
      children: A,
      containerInfo: p,
      implementation: B,
    };
  }
  var ne = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Ne(A, p) {
    if (A === "font") return "";
    if (typeof p == "string") return p === "use-credentials" ? p : "";
  }
  return (
    (ot.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = y),
    (ot.browser = function (A) {
      return { $$typeof: X, _reason: A };
    }),
    (ot.createPortal = function (A, p) {
      var B = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || (p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)) throw Error(C(299));
      return Le(A, p, null, B);
    }),
    (ot.flushSync = function (A) {
      var p = ne.T,
        B = y.p;
      try {
        if (((ne.T = null), (y.p = 2), A)) return A();
      } finally {
        ((ne.T = p), (y.p = B), y.d.f());
      }
    }),
    (ot.preconnect = function (A, p) {
      typeof A == "string" &&
        (p
          ? ((p = p.crossOrigin), (p = typeof p == "string" ? (p === "use-credentials" ? p : "") : void 0))
          : (p = null),
        y.d.C(A, p));
    }),
    (ot.prefetchDNS = function (A) {
      typeof A == "string" && y.d.D(A);
    }),
    (ot.preinit = function (A, p) {
      if (typeof A == "string" && p && typeof p.as == "string") {
        var B = p.as,
          ge = Ne(B, p.crossOrigin),
          O = typeof p.integrity == "string" ? p.integrity : void 0,
          re = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
        B === "style"
          ? y.d.S(A, typeof p.precedence == "string" ? p.precedence : void 0, {
              crossOrigin: ge,
              integrity: O,
              fetchPriority: re,
            })
          : B === "script" &&
            y.d.X(A, {
              crossOrigin: ge,
              integrity: O,
              fetchPriority: re,
              nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            });
      }
    }),
    (ot.preinitModule = function (A, p) {
      if (typeof A == "string")
        if (typeof p == "object" && p !== null) {
          if (p.as == null || p.as === "script") {
            var B = Ne(p.as, p.crossOrigin);
            y.d.M(A, {
              crossOrigin: B,
              integrity: typeof p.integrity == "string" ? p.integrity : void 0,
              nonce: typeof p.nonce == "string" ? p.nonce : void 0,
              fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
            });
          }
        } else p == null && y.d.M(A);
    }),
    (ot.preload = function (A, p) {
      if (typeof A == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
        var B = p.as,
          ge = Ne(B, p.crossOrigin);
        y.d.L(A, B, {
          crossOrigin: ge,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0,
          type: typeof p.type == "string" ? p.type : void 0,
          fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
          referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
          imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
          imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
          media: typeof p.media == "string" ? p.media : void 0,
        });
      }
    }),
    (ot.preloadModule = function (A, p) {
      if (typeof A == "string")
        if (p) {
          var B = Ne(p.as, p.crossOrigin);
          y.d.m(A, {
            as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
            crossOrigin: B,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
          });
        } else y.d.m(A);
    }),
    (ot.requestFormReset = function (A) {
      y.d.r(A);
    }),
    (ot.unstable_batchedUpdates = function (A, p) {
      return A(p);
    }),
    (ot.useFormState = function (A, p, B) {
      return ne.H.useFormState(A, p, B);
    }),
    (ot.useFormStatus = function () {
      return ne.H.useHostTransitionStatus();
    }),
    (ot.version = "19.3.1"),
    ot
  );
}
var Zm;
function Iv() {
  if (Zm) return yf.exports;
  Zm = 1;
  function o() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o);
      } catch (C) {
        console.error(C);
      }
  }
  return (o(), (yf.exports = Pv()), yf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Qm;
function e1() {
  if (Qm) return $i;
  Qm = 1;
  var o = $v(),
    C = Nf(),
    _ = Iv();
  function y(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++) t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function L(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function X(e) {
    for (var t = e, l = t; l && !l.alternate;) ((t = l), (t.flags & 4098) !== 0 && (e = t.return), (l = t.return));
    for (; t.return;) t = t.return;
    return t.tag === 3 ? e : null;
  }
  function Se(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null)) return t.dehydrated;
    }
    return null;
  }
  function Le(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null)) return t.dehydrated;
    }
    return null;
  }
  function ne(e) {
    if (X(e) !== e) throw Error(y(188));
  }
  function Ne(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = X(e)), t === null)) throw Error(y(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ;) {
      var n = l.return;
      if (n === null) break;
      var u = n.alternate;
      if (u === null) {
        if (((a = n.return), a !== null)) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === u.child) {
        for (u = n.child; u;) {
          if (u === l) return (ne(n), e);
          if (u === a) return (ne(n), t);
          u = u.sibling;
        }
        throw Error(y(188));
      }
      if (l.return !== a.return) ((l = n), (a = u));
      else {
        for (var c = !1, s = n.child; s;) {
          if (s === l) {
            ((c = !0), (l = n), (a = u));
            break;
          }
          if (s === a) {
            ((c = !0), (a = n), (l = u));
            break;
          }
          s = s.sibling;
        }
        if (!c) {
          for (s = u.child; s;) {
            if (s === l) {
              ((c = !0), (l = u), (a = n));
              break;
            }
            if (s === a) {
              ((c = !0), (a = u), (l = n));
              break;
            }
            s = s.sibling;
          }
          if (!c) throw Error(y(189));
        }
      }
      if (l.alternate !== a) throw Error(y(190));
    }
    if (l.tag !== 3) throw Error(y(188));
    return l.stateNode.current === l ? e : t;
  }
  function A(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null;) {
      if (((t = A(e)), t !== null)) return t;
      e = e.sibling;
    }
    return null;
  }
  function p(e, t, l, a, n, u) {
    for (; e !== null;) {
      if (
        ((e.tag === 5 || e.tag === 27 || e.tag === 6) && l(e, a, n, u)) ||
        ((e.tag !== 22 || e.memoizedState === null) &&
          (t || (e.tag !== 5 && e.tag !== 27)) &&
          p(e.child, t, l, a, n, u))
      )
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function B(e) {
    for (e = e.return; e !== null;) {
      if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
      e = e.return;
    }
    return null;
  }
  function ge(e) {
    var t = !1;
    for (e = e.return; e !== null && (e.tag === 4 && (t = !0), !(e.tag === 3 || e.tag === 5 || e.tag === 27));)
      e = e.return;
    return t;
  }
  function O(e) {
    var t = [null, null],
      l = B(e);
    return (l === null || re(t, e, l.child, { foundSelf: !1 }), t);
  }
  function re(e, t, l, a) {
    for (; l !== null;) {
      if (l === t) a.foundSelf = !0;
      else if (l.tag === 5 || l.tag === 27 || l.tag === 6) {
        if (a.foundSelf) return ((e[1] = l), !0);
        e[0] = l;
      } else if ((l.tag !== 22 || l.memoizedState === null) && re(e, t, l.child, a)) return !0;
      l = l.sibling;
    }
    return !1;
  }
  function ve(e) {
    switch (e.tag) {
      case 5:
      case 27:
      case 6:
        return e.stateNode;
      case 3:
        return e.stateNode.containerInfo;
      default:
        throw Error(y(559));
    }
  }
  var ht = null,
    Qe = null;
  function k(e, t, l) {
    return e === l ? !0 : e === t ? ((ht = e), !0) : !1;
  }
  function ye(e, t, l) {
    return e === l ? ((Qe = e), !1) : e === t ? (Qe !== null && (ht = e), !0) : !1;
  }
  function Ot(e) {
    if (e === null) return null;
    do e = e === null ? null : e.return;
    while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
    return e || null;
  }
  function R(e, t, l) {
    for (var a = 0, n = e; n; n = l(n)) a++;
    n = 0;
    for (var u = t; u; u = l(u)) n++;
    for (; 0 < a - n;) ((e = l(e)), a--);
    for (; 0 < n - a;) ((t = l(t)), n--);
    for (; a--;) {
      if (e === t || (t !== null && e === t.alternate)) return e;
      ((e = l(e)), (t = l(t)));
    }
    return null;
  }
  var te = Object.assign,
    he = Symbol.for("react.element"),
    Jt = Symbol.for("react.transitional.element"),
    Ce = Symbol.for("react.portal"),
    bt = Symbol.for("react.fragment"),
    ut = Symbol.for("react.strict_mode"),
    Mt = Symbol.for("react.profiler"),
    gl = Symbol.for("react.consumer"),
    ke = Symbol.for("react.context"),
    D = Symbol.for("react.forward_ref"),
    Z = Symbol.for("react.suspense"),
    Q = Symbol.for("react.suspense_list"),
    je = Symbol.for("react.memo"),
    me = Symbol.for("react.lazy"),
    jt = Symbol.for("react.activity"),
    Ct = Symbol.for("react.legacy_hidden"),
    Ue = Symbol.for("react.memo_cache_sentinel"),
    d = Symbol.for("react.view_transition"),
    N = Symbol.for("react.recoverable"),
    G = Symbol.iterator;
  function Y(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (G && e[G]) || e["@@iterator"]), typeof e == "function" ? e : null);
  }
  var ae = Symbol.for("react.client.reference");
  function fe(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.$$typeof === ae ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case bt:
        return "Fragment";
      case Mt:
        return "Profiler";
      case ut:
        return "StrictMode";
      case Z:
        return "Suspense";
      case Q:
        return "SuspenseList";
      case jt:
        return "Activity";
      case d:
        return "ViewTransition";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case Ce:
          return "Portal";
        case ke:
          return e.displayName || "Context";
        case gl:
          return (e._context.displayName || "Context") + ".Consumer";
        case D:
          var t = e.render;
          return (
            (e = e.displayName),
            e || ((e = t.displayName || t.name || ""), (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case je:
          return ((t = e.displayName || null), t !== null ? t : fe(e.type) || "Memo");
        case me:
          ((t = e._payload), (e = e._init));
          try {
            return fe(e(t));
          } catch {}
      }
    return null;
  }
  var de = Array.isArray,
    q = C.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    F = _.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    Bt = { pending: !1, data: null, method: null, action: null },
    Ta = [],
    Xl = -1;
  function pt(e) {
    return { current: e };
  }
  function Xe(e) {
    0 > Xl || ((e.current = Ta[Xl]), (Ta[Xl] = null), Xl--);
  }
  function pe(e, t) {
    (Xl++, (Ta[Xl] = e.current), (e.current = t));
  }
  var qt = pt(null),
    Ie = pt(null),
    kt = pt(null),
    Ea = pt(null);
  function _a(e, t) {
    switch ((pe(kt, t), pe(Ie, e), pe(qt, null), t.nodeType)) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Xh(e) : 0;
        break;
      default:
        if (((e = t.tagName), (t = t.namespaceURI))) ((t = Xh(t)), (e = Kh(t, e)));
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    (Xe(qt), pe(qt, e));
  }
  function Al() {
    (Xe(qt), Xe(Ie), Xe(kt));
  }
  function tn(e) {
    var t = e.memoizedState;
    (t !== null && ((Wn._currentValue = t.memoizedState), pe(Ea, e)), (t = qt.current));
    var l = Kh(t, e.type);
    t !== l && (pe(Ie, e), pe(qt, l));
  }
  function ln(e) {
    (Ie.current === e && (Xe(qt), Xe(Ie)), Ea.current === e && (Xe(Ea), (Wn._currentValue = Bt)));
  }
  var li, tu;
  function ul(e) {
    if (li === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        ((li = (t && t[1]) || ""),
          (tu =
            -1 <
            l.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < l.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      li +
      e +
      tu
    );
  }
  var an = !1;
  function nn(e, t) {
    if (!e || an) return "";
    an = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var S = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(S.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(S, []);
                } catch (M) {
                  var h = M;
                }
                Reflect.construct(e, [], S);
              } else {
                try {
                  S.call();
                } catch (M) {
                  h = M;
                }
                S = !1;
                try {
                  var b = Object.getOwnPropertyDescriptor(e.prototype, "props");
                  (Object.defineProperty(e.prototype, "props", {
                    configurable: !0,
                    set: function () {
                      throw Error();
                    },
                  }),
                    (S = !0),
                    new e());
                } finally {
                  S && (b !== void 0 ? Object.defineProperty(e.prototype, "props", b) : delete e.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (M) {
                h = M;
              }
              (S = e()) && typeof S.catch == "function" && S.catch(function () {});
            }
          } catch (M) {
            if (M && h && typeof M.stack == "string") return [M.stack, h.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, "name");
      n &&
        n.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
      var u = a.DetermineComponentFrameRoot(),
        c = u[0],
        s = u[1];
      if (c && s) {
        var r = c.split(`
`),
          g = s.split(`
`);
        for (n = a = 0; a < r.length && !r[a].includes("DetermineComponentFrameRoot");) a++;
        for (; n < g.length && !g[n].includes("DetermineComponentFrameRoot");) n++;
        if (a === r.length || n === g.length)
          for (a = r.length - 1, n = g.length - 1; 1 <= a && 0 <= n && r[a] !== g[n];) n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (r[a] !== g[n]) {
            if (a !== 1 || n !== 1)
              do
                if ((a--, n--, 0 > n || r[a] !== g[n])) {
                  var j =
                    `
` + r[a].replace(" at new ", " at ");
                  return (
                    e.displayName && j.includes("<anonymous>") && (j = j.replace("<anonymous>", e.displayName)),
                    j
                  );
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      ((an = !1), (Error.prepareStackTrace = l));
    }
    return (l = e ? e.displayName || e.name : "") ? ul(l) : "";
  }
  function lu(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return ul(e.type);
      case 16:
        return ul("Lazy");
      case 13:
        return e.child !== t && t !== null ? ul("Suspense Fallback") : ul("Suspense");
      case 19:
        return ul("SuspenseList");
      case 0:
      case 15:
        return nn(e.type, !1);
      case 11:
        return nn(e.type.render, !1);
      case 1:
        return nn(e.type, !0);
      case 31:
        return ul("Activity");
      case 30:
        return ul("ViewTransition");
      default:
        return "";
    }
  }
  function au(e) {
    try {
      var t = "",
        l = null;
      do ((t += lu(e, l)), (l = e), (e = e.return));
      while (e);
      return t;
    } catch (a) {
      return (
        `
Error generating stack: ` +
        a.message +
        `
` +
        a.stack
      );
    }
  }
  var un = Object.prototype.hasOwnProperty,
    cn = o.unstable_scheduleCallback,
    sn = o.unstable_cancelCallback,
    Aa = o.unstable_shouldYield,
    Oa = o.unstable_requestPaint,
    et = o.unstable_now,
    Ma = o.unstable_getCurrentPriorityLevel,
    ai = o.unstable_ImmediatePriority,
    rn = o.unstable_UserBlockingPriority,
    Ol = o.unstable_NormalPriority,
    nu = o.unstable_LowPriority,
    zt = o.unstable_IdlePriority,
    qc = o.log,
    ni = o.unstable_setDisableYieldValue,
    Ca = null,
    mt = null;
  function cl(e) {
    if ((typeof qc == "function" && ni(e), mt && typeof mt.setStrictMode == "function"))
      try {
        mt.setStrictMode(Ca, e);
      } catch {}
  }
  var tt = Math.clz32 ? Math.clz32 : iu,
    I = Math.log,
    kc = Math.LN2;
  function iu(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((I(e) / kc) | 0)) | 0);
  }
  var fn = 256,
    Kl = 262144,
    Da = 4194304;
  function vl(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & -e;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Jl(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0,
      u = e.suspendedLanes,
      c = e.pingedLanes;
    e = e.warmLanes;
    var s = a & 134217727;
    return (
      s !== 0
        ? ((a = s & ~u),
          a !== 0 ? (n = vl(a)) : ((c &= s), c !== 0 ? (n = vl(c)) : l || ((l = s & ~e), l !== 0 && (n = vl(l)))))
        : ((s = a & ~u), s !== 0 ? (n = vl(s)) : c !== 0 ? (n = vl(c)) : l || ((l = a & ~e), l !== 0 && (n = vl(l)))),
      n === 0
        ? 0
        : t !== 0 &&
            t !== n &&
            (t & u) === 0 &&
            ((u = n & -n), (l = t & -t), u >= l || (u === 32 && (l & 4194048) !== 0))
          ? t
          : n
    );
  }
  function St(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function uu(e, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l;) {
        var a = 31 - tt(l),
          n = 1 << a;
        ((t |= e[a]), (l &= ~n));
      }
    return t;
  }
  function Tf(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function dn() {
    var e = Da;
    return ((Da <<= 1), (Da & 62914560) === 0 && (Da = 4194304), e);
  }
  function ii(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function wa(e, t) {
    ((e.pendingLanes |= t), t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
  }
  function Gc(e, t, l, a, n, u) {
    var c = e.pendingLanes;
    ((e.pendingLanes = l),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= l),
      (e.entangledLanes &= l),
      (e.errorRecoveryDisabledLanes &= l),
      (e.shellSuspendCounter = 0));
    var s = e.entanglements,
      r = e.expirationTimes,
      g = e.hiddenUpdates;
    for (l = c & ~l; 0 < l;) {
      var j = 31 - tt(l),
        S = 1 << j;
      ((s[j] = 0), (r[j] = -1));
      var h = g[j];
      if (h !== null)
        for (g[j] = null, j = 0; j < h.length; j++) {
          var b = h[j];
          b !== null && (b.lane &= -536870913);
        }
      l &= ~S;
    }
    (a !== 0 && cu(e, a, 0), u !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(c & ~t)));
  }
  function cu(e, t, l) {
    ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
    var a = 31 - tt(t);
    ((e.entangledLanes |= t), (e.entanglements[a] = e.entanglements[a] | 1073741824 | (l & 261930)));
  }
  function su(e, t) {
    var l = (e.entangledLanes |= t);
    for (e = e.entanglements; l;) {
      var a = 31 - tt(l),
        n = 1 << a;
      ((n & t) | (e[a] & t) && (e[a] |= t), (l &= ~n));
    }
  }
  function ru(e, t) {
    var l = t & -t;
    return ((l = (l & 42) !== 0 ? 1 : ui(l)), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l);
  }
  function ui(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function ci(e) {
    return ((e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function fu() {
    var e = F.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : Mm(e.type));
  }
  function du(e, t) {
    var l = F.p;
    try {
      return ((F.p = e), t());
    } finally {
      F.p = l;
    }
  }
  var sl = Math.random().toString(36).slice(2),
    $e = "__reactFiber$" + sl,
    gt = "__reactProps$" + sl,
    Fl = "__reactContainer$" + sl,
    v = "__reactEvents$" + sl,
    T = "__reactListeners$" + sl,
    E = "__reactHandles$" + sl,
    K = "__reactResources$" + sl,
    De = "__reactMarker$" + sl,
    Te = "__reactLoad$" + sl;
  function vt(e) {
    (delete e[$e], delete e[gt], delete e[T], delete e[E]);
  }
  function yt(e) {
    var t;
    if ((t = e[$e])) return t;
    for (var l = e.parentNode; l;) {
      if ((t = l[Fl] || l[$e])) {
        if (((l = t.alternate), t.child !== null || (l !== null && l.child !== null)))
          for (e = fm(e); e !== null;) {
            if ((l = e[$e])) return l;
            e = fm(e);
          }
        return t;
      }
      ((e = l), (l = e.parentNode));
    }
    return null;
  }
  function Ft(e) {
    if ((e = e[$e] || e[Fl])) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
    }
    return null;
  }
  function Ml(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(y(33));
  }
  function on(e) {
    var t = e[K];
    return (t || (t = e[K] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
  }
  function lt(e) {
    e[De] = !0;
  }
  function Ef(e) {
    e[Te] = void 0;
  }
  var _f = new Set(),
    Af = {};
  function Ra(e, t) {
    (hn(e, t), hn(e + "Capture", t));
  }
  function hn(e, t) {
    for (Af[e] = t, e = 0; e < t.length; e++) _f.add(t[e]);
  }
  var d0 = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    Of = {},
    Mf = {};
  function o0(e) {
    return un.call(Mf, e) ? !0 : un.call(Of, e) ? !1 : d0.test(e) ? (Mf[e] = !0) : ((Of[e] = !0), !1);
  }
  var xe = !1;
  function Cf() {
    var e = xe;
    return ((xe = !1), e);
  }
  function ou(e, t, l) {
    if (o0(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, l);
      }
  }
  function hu(e, t, l) {
    if (l === null) e.removeAttribute(t);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, l);
    }
  }
  function Cl(e, t, l, a) {
    if (a === null) e.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, a);
    }
  }
  function Gt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Df(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function h0(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get,
        u = a.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return n.call(this);
          },
          set: function (c) {
            ((l = "" + c), u.call(this, c));
          },
        }),
        Object.defineProperty(e, t, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return l;
          },
          setValue: function (c) {
            l = "" + c;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Yc(e) {
    if (!e._valueTracker) {
      var t = Df(e) ? "checked" : "value";
      e._valueTracker = h0(e, t, "" + e[t]);
    }
  }
  function wf(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(),
      a = "";
    return (e && (a = Df(e) ? (e.checked ? "true" : "false") : e.value), (e = a), e !== l ? (t.setValue(e), !0) : !1);
  }
  var m0 = /[\n"\\]/g;
  function Wt(e) {
    return e.replace(m0, function (t) {
      return "\\" + t.charCodeAt(0).toString(16) + " ";
    });
  }
  function Vc(e, t, l, a, n, u, c, s) {
    ((e.name = ""),
      c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean"
        ? (e.type = c)
        : e.removeAttribute("type"),
      t != null
        ? c === "number"
          ? ((t === 0 && e.value === "") || e.value != t) && (e.value = "" + Gt(t))
          : e.value !== "" + Gt(t) && (e.value = "" + Gt(t))
        : (c !== "submit" && c !== "reset") || e.removeAttribute("value"),
      t != null
        ? c === "number" && e.value == t
          ? Lc(e, Gt(e.value))
          : Lc(e, Gt(t))
        : l != null
          ? Lc(e, Gt(l))
          : a != null && e.removeAttribute("value"),
      n == null && u != null && (e.defaultChecked = !!u),
      n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"),
      s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean"
        ? (e.name = "" + Gt(s))
        : e.removeAttribute("name"));
  }
  function Rf(e, t, l, a, n, u, c, s) {
    if (
      (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u),
      t != null || l != null)
    ) {
      if (!((u !== "submit" && u !== "reset") || t != null)) {
        Yc(e);
        return;
      }
      ((l = l != null ? "" + Gt(l) : ""),
        (t = t != null ? "" + Gt(t) : l),
        s || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((a = a ?? n),
      (a = typeof a != "function" && typeof a != "symbol" && !!a),
      (e.checked = s ? e.checked : !!a),
      (e.defaultChecked = !!a),
      c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c),
      Yc(e));
  }
  function Lc(e, t) {
    e.defaultValue !== "" + t && (e.defaultValue = "" + t);
  }
  function mn(e, t, l, a) {
    if (((e = e.options), t)) {
      t = {};
      for (var n = 0; n < l.length; n++) t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        ((n = t.hasOwnProperty("$" + e[l].value)),
          e[l].selected !== n && (e[l].selected = n),
          n && a && (e[l].defaultSelected = !0));
    } else {
      for (l = "" + Gt(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          ((e[n].selected = !0), a && (e[n].defaultSelected = !0));
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Hf(e, t, l) {
    if (t != null && ((t = "" + Gt(t)), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Gt(l) : "";
  }
  function Uf(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(y(92));
        if (de(a)) {
          if (1 < a.length) throw Error(y(93));
          a = a[0];
        }
        l = a;
      }
      (l == null && (l = ""), (t = l));
    }
    ((l = Gt(t)), (e.defaultValue = l), (a = e.textContent), a === l && a !== "" && a !== null && (e.value = a), Yc(e));
  }
  function gn(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var g0 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function Bf(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === ""
      ? a
        ? e.setProperty(t, "")
        : t === "float"
          ? (e.cssFloat = "")
          : (e[t] = "")
      : a
        ? e.setProperty(t, l)
        : typeof l != "number" || l === 0 || g0.has(t)
          ? t === "float"
            ? (e.cssFloat = l)
            : (e[t] = ("" + l).trim())
          : (e[t] = l + "px");
  }
  function qf(e, t, l) {
    if (t != null && typeof t != "object") throw Error(y(62));
    if (((e = e.style), l != null)) {
      for (var a in l)
        !l.hasOwnProperty(a) ||
          (t != null && t.hasOwnProperty(a)) ||
          (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? (e.cssFloat = "") : (e[a] = ""), (xe = !0));
      for (var n in t) ((a = t[n]), t.hasOwnProperty(n) && l[n] !== a && (Bf(e, n, a), (xe = !0)));
    } else for (var u in t) t.hasOwnProperty(u) && Bf(e, u, t[u]);
  }
  function Zc(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var v0 = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["maskType", "mask-type"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    y0 =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function mu(e) {
    return y0.test("" + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  function yl() {}
  var Qc = null;
  function Xc(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var vn = null,
    yn = null;
  function kf(e) {
    var t = Ft(e);
    if (t && (e = t.stateNode)) {
      var l = e[gt] || null;
      e: switch (((e = t.stateNode), t.type)) {
        case "input":
          if (
            (Vc(e, l.value, l.defaultValue, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name),
            (t = l.name),
            l.type === "radio" && t != null)
          ) {
            for (l = e; l.parentNode;) l = l.parentNode;
            for (l = l.querySelectorAll('input[name="' + Wt("" + t) + '"][type="radio"]'), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[gt] || null;
                if (!n) throw Error(y(90));
                Vc(a, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name);
              }
            }
            for (t = 0; t < l.length; t++) ((a = l[t]), a.form === e.form && wf(a));
          }
          break e;
        case "textarea":
          Hf(e, l.value, l.defaultValue);
          break e;
        case "select":
          ((t = l.value), t != null && mn(e, !!l.multiple, t, !1));
      }
    }
  }
  var Kc = !1;
  function Gf(e, t, l) {
    if (Kc) return e(t, l);
    Kc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (((Kc = !1), (vn !== null || yn !== null) && (mc(), vn && ((t = vn), (e = yn), (yn = vn = null), kf(t), e))))
        for (t = 0; t < e.length; t++) kf(e[t]);
    }
  }
  function si(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[gt] || null;
    if (a === null) return null;
    l = a[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((a = !a.disabled) ||
          ((e = e.type), (a = !(e === "button" || e === "input" || e === "select" || e === "textarea"))),
          (e = !a));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function") throw Error(y(231, t, typeof l));
    return l;
  }
  var Dl = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    Jc = !1;
  if (Dl)
    try {
      var ri = {};
      (Object.defineProperty(ri, "passive", {
        get: function () {
          Jc = !0;
        },
      }),
        window.addEventListener("test", ri, ri),
        window.removeEventListener("test", ri, ri));
    } catch {
      Jc = !1;
    }
  var Wl = null,
    Fc = null,
    gu = null;
  function Yf() {
    if (gu) return gu;
    var e,
      t = Fc,
      l = t.length,
      a,
      n = "value" in Wl ? Wl.value : Wl.textContent,
      u = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++);
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[u - a]; a++);
    return (gu = n.slice(e, 1 < a ? 1 - a : void 0));
  }
  function vu(e) {
    var t = e.keyCode;
    return (
      "charCode" in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function yu() {
    return !0;
  }
  function Vf() {
    return !1;
  }
  function Nt(e) {
    function t(l, a, n, u, c) {
      ((this._reactName = l),
        (this._targetInst = n),
        (this.type = a),
        (this.nativeEvent = u),
        (this.target = c),
        (this.currentTarget = null));
      for (var s in e) e.hasOwnProperty(s) && ((l = e[s]), (this[s] = l ? l(u) : u[s]));
      return (
        (this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? yu : Vf),
        (this.isPropagationStopped = Vf),
        this
      );
    }
    return (
      te(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var l = this.nativeEvent;
          l &&
            (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1),
            (this.isDefaultPrevented = yu));
        },
        stopPropagation: function () {
          var l = this.nativeEvent;
          l &&
            (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0),
            (this.isPropagationStopped = yu));
        },
        persist: function () {},
        isPersistent: yu,
      }),
      t
    );
  }
  var $l = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    xu = Nt($l),
    fi = te({}, $l, { view: 0, detail: 0 }),
    x0 = Nt(fi),
    Wc,
    $c,
    di,
    bu = te({}, fi, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Ic,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== di &&
              (di && e.type === "mousemove"
                ? ((Wc = e.screenX - di.screenX), ($c = e.screenY - di.screenY))
                : ($c = Wc = 0),
              (di = e)),
            Wc);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : $c;
      },
    }),
    Lf = Nt(bu),
    b0 = te({}, bu, { dataTransfer: 0 }),
    j0 = Nt(b0),
    p0 = te({}, fi, { relatedTarget: 0 }),
    Pc = Nt(p0),
    z0 = te({}, $l, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    S0 = Nt(z0),
    N0 = te({}, $l, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    T0 = Nt(N0),
    E0 = te({}, $l, { data: 0 }),
    Zf = Nt(E0),
    _0 = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    A0 = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    O0 = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function M0(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = O0[e]) ? !!t[e] : !1;
  }
  function Ic() {
    return M0;
  }
  var C0 = te({}, fi, {
      key: function (e) {
        if (e.key) {
          var t = _0[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = vu(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? A0[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Ic,
      charCode: function (e) {
        return e.type === "keypress" ? vu(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress" ? vu(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
    }),
    D0 = Nt(C0),
    w0 = te({}, bu, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Qf = Nt(w0),
    R0 = te({}, $l, { submitter: 0 }),
    H0 = Nt(R0),
    U0 = te({}, fi, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Ic,
    }),
    B0 = Nt(U0),
    q0 = te({}, $l, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    k0 = Nt(q0),
    G0 = te({}, bu, {
      deltaX: function (e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Y0 = Nt(G0),
    V0 = te({}, $l, { newState: 0, oldState: 0, source: 0 }),
    L0 = Nt(V0),
    Z0 = [9, 13, 27, 32],
    es = Dl && "CompositionEvent" in window,
    oi = null;
  Dl && "documentMode" in document && (oi = document.documentMode);
  var Q0 = Dl && "TextEvent" in window && !oi,
    Xf = Dl && (!es || (oi && 8 < oi && 11 >= oi)),
    Kf = " ",
    Jf = !1;
  function Ff(e, t) {
    switch (e) {
      case "keyup":
        return Z0.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Wf(e) {
    return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
  }
  var xn = !1;
  function X0(e, t) {
    switch (e) {
      case "compositionend":
        return Wf(t);
      case "keypress":
        return t.which !== 32 ? null : ((Jf = !0), Kf);
      case "textInput":
        return ((e = t.data), e === Kf && Jf ? null : e);
      default:
        return null;
    }
  }
  function K0(e, t) {
    if (xn)
      return e === "compositionend" || (!es && Ff(e, t)) ? ((e = Yf()), (gu = Fc = Wl = null), (xn = !1), e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Xf && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var J0 = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function $f(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!J0[e.type] : t === "textarea";
  }
  function Pf(e, t, l, a) {
    (vn ? (yn ? yn.push(a) : (yn = [a])) : (vn = a),
      (t = jc(t, "onChange")),
      0 < t.length && ((l = new xu("onChange", "change", null, l, a)), e.push({ event: l, listeners: t })));
  }
  var hi = null,
    mi = null;
  function F0(e) {
    Gh(e, 0);
  }
  function ju(e) {
    var t = Ml(e);
    if (wf(t)) return e;
  }
  function If(e, t) {
    if (e === "change") return t;
  }
  var ed = !1;
  if (Dl) {
    var ts;
    if (Dl) {
      var ls = "oninput" in document;
      if (!ls) {
        var td = document.createElement("div");
        (td.setAttribute("oninput", "return;"), (ls = typeof td.oninput == "function"));
      }
      ts = ls;
    } else ts = !1;
    ed = ts && (!document.documentMode || 9 < document.documentMode);
  }
  function ld() {
    hi && (hi.detachEvent("onpropertychange", ad), (mi = hi = null));
  }
  function ad(e) {
    if (e.propertyName === "value" && ju(mi)) {
      var t = [];
      (Pf(t, mi, e, Xc(e)), Gf(F0, t));
    }
  }
  function W0(e, t, l) {
    e === "focusin" ? (ld(), (hi = t), (mi = l), hi.attachEvent("onpropertychange", ad)) : e === "focusout" && ld();
  }
  function $0(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return ju(mi);
  }
  function P0(e, t) {
    if (e === "click") return ju(t);
  }
  function I0(e, t) {
    if (e === "input" || e === "change") return ju(t);
  }
  function eg(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var Yt = typeof Object.is == "function" ? Object.is : eg;
  function gi(e, t) {
    if (Yt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var l = Object.keys(e),
      a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!un.call(t, n) || !Yt(e[n], t[n])) return !1;
    }
    return !0;
  }
  function as(e) {
    if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")) return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function nd(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e;
  }
  function id(e, t) {
    var l = nd(e);
    e = 0;
    for (var a; l;) {
      if (l.nodeType === 3) {
        if (((a = e + l.textContent.length), e <= t && a >= t)) return { node: l, offset: t - e };
        e = a;
      }
      e: {
        for (; l;) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = nd(l);
    }
  }
  function ud(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? ud(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function cd(e) {
    e =
      e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var t = as(e.document); t instanceof e.HTMLIFrameElement;) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = as(e.document);
    }
    return t;
  }
  function ns(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  var tg = Dl && "documentMode" in document && 11 >= document.documentMode,
    bn = null,
    is = null,
    vi = null,
    us = !1;
  function sd(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    us ||
      bn == null ||
      bn !== as(a) ||
      ((a = bn),
      "selectionStart" in a && ns(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = ((a.ownerDocument && a.ownerDocument.defaultView) || window).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (vi && gi(vi, a)) ||
        ((vi = a),
        (a = jc(is, "onSelect")),
        0 < a.length &&
          ((t = new xu("onSelect", "select", null, t, l)), e.push({ event: t, listeners: a }), (t.target = bn))));
  }
  function Ha(e, t) {
    var l = {};
    return ((l[e.toLowerCase()] = t.toLowerCase()), (l["Webkit" + e] = "webkit" + t), (l["Moz" + e] = "moz" + t), l);
  }
  var jn = {
      animationend: Ha("Animation", "AnimationEnd"),
      animationiteration: Ha("Animation", "AnimationIteration"),
      animationstart: Ha("Animation", "AnimationStart"),
      transitionrun: Ha("Transition", "TransitionRun"),
      transitionstart: Ha("Transition", "TransitionStart"),
      transitioncancel: Ha("Transition", "TransitionCancel"),
      transitionend: Ha("Transition", "TransitionEnd"),
    },
    cs = {},
    rd = {};
  Dl &&
    ((rd = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete jn.animationend.animation, delete jn.animationiteration.animation, delete jn.animationstart.animation),
    "TransitionEvent" in window || delete jn.transitionend.transition);
  function Ua(e) {
    if (cs[e]) return cs[e];
    if (!jn[e]) return e;
    var t = jn[e],
      l;
    for (l in t) if (t.hasOwnProperty(l) && l in rd) return (cs[e] = t[l]);
    return e;
  }
  var fd = Ua("animationend"),
    dd = Ua("animationiteration"),
    od = Ua("animationstart"),
    lg = Ua("transitionrun"),
    ag = Ua("transitionstart"),
    ng = Ua("transitioncancel"),
    hd = Ua("transitionend"),
    md = new Map(),
    ss =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  ss.push("scrollEnd");
  function rl(e, t) {
    (md.set(e, t), Ra(t, [e]));
  }
  var ig = 0;
  function wl(e, t) {
    if (e.name != null && e.name !== "auto") return e.name;
    if (t.autoName !== null) return t.autoName;
    e = hl.identifierPrefix;
    var l = ig++;
    return ((e = "_" + e + "t_" + l.toString(32) + "_"), (t.autoName = e));
  }
  function gd(e) {
    if (e == null || typeof e == "string") return e;
    var t = null,
      l = Gn;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = e[l[a]];
        if (n != null) {
          if (n === "none") return "none";
          t = t == null ? n : t + (" " + n);
        }
      }
    return t ?? e.default;
  }
  function Rl(e, t) {
    return ((e = gd(e)), (t = gd(t)), t == null ? (e === "auto" ? null : e) : t === "auto" ? null : t);
  }
  var pu =
      typeof reportError == "function"
        ? reportError
        : function (e) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var t = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", e);
              return;
            }
            console.error(e);
          },
    $t = [],
    pn = 0,
    rs = 0;
  function zu() {
    for (var e = pn, t = (rs = pn = 0); t < e;) {
      var l = $t[t];
      $t[t++] = null;
      var a = $t[t];
      $t[t++] = null;
      var n = $t[t];
      $t[t++] = null;
      var u = $t[t];
      if ((($t[t++] = null), a !== null && n !== null)) {
        var c = a.pending;
        (c === null ? (n.next = n) : ((n.next = c.next), (c.next = n)), (a.pending = n));
      }
      u !== 0 && vd(l, n, u);
    }
  }
  function Su(e, t, l, a) {
    (($t[pn++] = e),
      ($t[pn++] = t),
      ($t[pn++] = l),
      ($t[pn++] = a),
      (rs |= a),
      (e.lanes |= a),
      (e = e.alternate),
      e !== null && (e.lanes |= a));
  }
  function fs(e, t, l, a) {
    return (Su(e, t, l, a), Nu(e));
  }
  function Ba(e, t) {
    return (Su(e, null, null, t), Nu(e));
  }
  function vd(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = e.return; u !== null;)
      ((u.childLanes |= l),
        (a = u.alternate),
        a !== null && (a.childLanes |= l),
        u.tag === 22 && ((e = u.stateNode), e === null || e._visibility & 1 || (n = !0)),
        (e = u),
        (u = u.return));
    return e.tag === 3
      ? ((u = e.stateNode),
        n &&
          t !== null &&
          ((n = 31 - tt(l)),
          (e = u.hiddenUpdates),
          (a = e[n]),
          a === null ? (e[n] = [t]) : a.push(t),
          (t.lane = l | 536870912)),
        u)
      : null;
  }
  function Nu(e) {
    if (50 < qi) throw ((qi = 0), (hc = null), Error(y(185)));
    for (var t = e.return; t !== null;) ((e = t), (t = e.return));
    return e.tag === 3 ? e.stateNode : null;
  }
  var zn = {};
  function ug(e, t, l, a) {
    ((this.tag = e),
      (this.key = l),
      (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function Dt(e, t, l, a) {
    return new ug(e, t, l, a);
  }
  function ds(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function Hl(e, t) {
    var l = e.alternate;
    return (
      l === null
        ? ((l = Dt(e.tag, t, e.key, e.mode)),
          (l.elementType = e.elementType),
          (l.type = e.type),
          (l.stateNode = e.stateNode),
          (l.alternate = e),
          (e.alternate = l))
        : ((l.pendingProps = t), (l.type = e.type), (l.flags = 0), (l.subtreeFlags = 0), (l.deletions = null)),
      (l.flags = e.flags & 1206910976),
      (l.childLanes = e.childLanes),
      (l.lanes = e.lanes),
      (l.child = e.child),
      (l.memoizedProps = e.memoizedProps),
      (l.memoizedState = e.memoizedState),
      (l.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (l.sibling = e.sibling),
      (l.index = e.index),
      (l.ref = e.ref),
      (l.refCleanup = e.refCleanup),
      l
    );
  }
  function yd(e, t) {
    e.flags &= 1206910978;
    var l = e.alternate;
    return (
      l === null
        ? ((e.childLanes = 0),
          (e.lanes = t),
          (e.child = null),
          (e.subtreeFlags = 0),
          (e.memoizedProps = null),
          (e.memoizedState = null),
          (e.updateQueue = null),
          (e.dependencies = null),
          (e.stateNode = null))
        : ((e.childLanes = l.childLanes),
          (e.lanes = l.lanes),
          (e.child = l.child),
          (e.subtreeFlags = 0),
          (e.deletions = null),
          (e.memoizedProps = l.memoizedProps),
          (e.memoizedState = l.memoizedState),
          (e.updateQueue = l.updateQueue),
          (e.type = l.type),
          (t = l.dependencies),
          (e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
      e
    );
  }
  function Tu(e, t, l, a, n, u) {
    var c = 0;
    if (((a = e), typeof a == "function")) ds(a) && (c = 1);
    else if (typeof a == "string")
      c = Rv(e, l, qt.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (a) {
        case jt:
          return ((e = Dt(31, l, t, n)), (e.elementType = jt), (e.lanes = u), e);
        case bt:
          return qa(l.children, n, u, t);
        case ut:
          ((c = 8), (n |= 24));
          break;
        case Mt:
          return ((e = Dt(12, l, t, n | 2)), (e.elementType = Mt), (e.lanes = u), e);
        case Z:
          return ((e = Dt(13, l, t, n)), (e.elementType = Z), (e.lanes = u), e);
        case Q:
          return ((e = Dt(19, l, t, n)), (e.elementType = Q), (e.lanes = u), e);
        case Ct:
        case d:
          return (
            (e = n | 32),
            (e = Dt(30, l, t, e)),
            (e.elementType = d),
            (e.lanes = u),
            (e.stateNode = { autoName: null, paired: null, clones: null, ref: null }),
            e
          );
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case ke:
                c = 10;
                break e;
              case gl:
                c = 9;
                break e;
              case D:
                c = 11;
                break e;
              case je:
                c = 14;
                break e;
              case me:
                ((c = 16), (a = null));
                break e;
            }
          ((c = 29), (l = Error(y(130, e === null ? "null" : typeof e, ""))), (a = null));
      }
    return ((t = Dt(c, l, t, n)), (t.elementType = e), (t.type = a), (t.lanes = u), t);
  }
  function qa(e, t, l, a) {
    return ((e = Dt(7, e, a, t)), (e.lanes = l), e);
  }
  function os(e, t, l) {
    return ((e = Dt(6, e, null, t)), (e.lanes = l), e);
  }
  function xd(e) {
    var t = Dt(18, null, null, 0);
    return ((t.stateNode = e), t);
  }
  function hs(e, t, l) {
    return (
      (t = Dt(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = l),
      (t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }),
      t
    );
  }
  var bd = new WeakMap();
  function Pt(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = bd.get(e);
      return l !== void 0 ? l : ((t = { value: e, source: t, stack: au(t) }), bd.set(e, t), t);
    }
    return { value: e, source: t, stack: au(t) };
  }
  var Sn = [],
    Nn = 0,
    Eu = null,
    yi = 0,
    It = [],
    el = 0,
    Pl = null,
    xl = 1,
    bl = "";
  function Ul(e, t) {
    ((Sn[Nn++] = yi), (Sn[Nn++] = Eu), (Eu = e), (yi = t));
  }
  function jd(e, t, l) {
    ((It[el++] = xl), (It[el++] = bl), (It[el++] = Pl), (Pl = e));
    var a = xl;
    e = bl;
    var n = 32 - tt(a) - 1;
    ((a &= ~(1 << n)), (l += 1));
    var u = 32 - tt(t) + n;
    if (30 < u) {
      var c = n - (n % 5);
      ((u = (a & ((1 << c) - 1)).toString(32)),
        (a >>= c),
        (n -= c),
        (xl = (1 << (32 - tt(t) + n)) | (l << n) | a),
        (bl = u + e));
    } else ((xl = (1 << u) | (l << n) | a), (bl = e));
  }
  function _u(e) {
    e.return !== null && (Ul(e, 1), jd(e, 1, 0));
  }
  function ms(e) {
    for (; e === Eu;) ((Eu = Sn[--Nn]), (Sn[Nn] = null), (yi = Sn[--Nn]), (Sn[Nn] = null));
    for (; e === Pl;)
      ((Pl = It[--el]), (It[el] = null), (bl = It[--el]), (It[el] = null), (xl = It[--el]), (It[el] = null));
  }
  function pd(e, t) {
    ((It[el++] = xl), (It[el++] = bl), (It[el++] = Pl), (xl = t.id), (bl = t.overflow), (Pl = e));
  }
  var at = null,
    we = null,
    le = !1,
    Il = null,
    tl = !1,
    gs = Error(y(519));
  function ea(e) {
    var t = Error(y(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
    throw (xi(Pt(t, e)), gs);
  }
  function zd(e) {
    var t = e.stateNode,
      l = e.type,
      a = e.memoizedProps;
    switch (((t[$e] = e), (t[gt] = a), l)) {
      case "dialog":
        (ue("cancel", t), ue("close", t));
        break;
      case "iframe":
      case "object":
      case "embed":
        ue("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Gi.length; l++) ue(Gi[l], t);
        break;
      case "source":
        ue("error", t);
        break;
      case "img":
      case "image":
      case "link":
        (ue("error", t), ue("load", t));
        break;
      case "details":
        ue("toggle", t);
        break;
      case "input":
        (ue("invalid", t), Rf(t, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0));
        break;
      case "select":
        ue("invalid", t);
        break;
      case "textarea":
        (ue("invalid", t), Uf(t, a.value, a.defaultValue, a.children));
    }
    ((l = a.children),
      (typeof l != "string" && typeof l != "number" && typeof l != "bigint") ||
      t.textContent === "" + l ||
      a.suppressHydrationWarning === !0 ||
      Zh(t.textContent, l)
        ? (a.popover != null && (ue("beforetoggle", t), ue("toggle", t)),
          a.onScroll != null && ue("scroll", t),
          a.onScrollEnd != null && ue("scrollend", t),
          a.onClick != null && (t.onclick = yl),
          (t = !0))
        : (t = !1),
      t || ea(e, !0));
  }
  function Au(e) {
    for (at = e.return; at;)
      switch (at.tag) {
        case 5:
        case 31:
        case 13:
          tl = !1;
          return;
        case 27:
        case 3:
          tl = !0;
          return;
        default:
          at = at.return;
      }
  }
  function Tn(e) {
    if (e !== at) return !1;
    if (!le) return (Au(e), (le = !0), !1);
    var t = e.tag,
      l;
    if (
      ((l = t !== 3 && t !== 27) &&
        ((l = t === 5) && ((l = e.type), (l = !(l !== "form" && l !== "button") || Qr(e.type, e.memoizedProps))),
        (l = !l)),
      l && we && ea(e),
      Au(e),
      t === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(y(317));
      we = rm(e);
    } else if (t === 31) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(y(317));
      we = rm(e);
    } else
      t === 27
        ? ((t = we), va(e.type) ? ((e = ef), (ef = null), (we = e)) : (we = t))
        : (we = at ? al(e.stateNode.nextSibling) : null);
    return !0;
  }
  function ka() {
    ((we = at = null), (le = !1));
  }
  function vs() {
    var e = Il;
    return (e !== null && (Ht === null ? (Ht = e) : Ht.push.apply(Ht, e), (Il = null)), e);
  }
  function xi(e) {
    Il === null ? (Il = [e]) : Il.push(e);
  }
  var ys = pt(null),
    Ga = null,
    Bl = null;
  function ta(e, t, l) {
    (pe(ys, t._currentValue), (t._currentValue = l));
  }
  function ql(e) {
    ((e._currentValue = ys.current), Xe(ys));
  }
  function Ou(e, t, l) {
    for (; e !== null;) {
      var a = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), a !== null && (a.childLanes |= t))
          : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t),
        e === l)
      )
        break;
      e = e.return;
    }
  }
  function xs(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null;) {
      var u = n.dependencies;
      if (u !== null) {
        var c = n.child;
        u = u.firstContext;
        e: for (; u !== null;) {
          var s = u;
          u = n;
          for (var r = 0; r < t.length; r++)
            if (s.context === t[r]) {
              ((u.lanes |= l), (s = u.alternate), s !== null && (s.lanes |= l), Ou(u.return, l, e), a || (c = null));
              break e;
            }
          u = s.next;
        }
      } else if (n.tag === 18) {
        if (((c = n.return), c === null)) throw Error(y(341));
        ((c.lanes |= l), (u = c.alternate), u !== null && (u.lanes |= l), Ou(c, l, e), (c = null));
      } else
        n.tag === 13 && n.memoizedState !== null && n.memoizedState.dehydrated === null
          ? ((n.lanes |= l),
            (c = n.alternate),
            c !== null && (c.lanes |= l),
            Ou(n.return, l, e),
            (c = n.child),
            (c = c !== null ? c.sibling : null))
          : (c = n.child);
      if (c !== null) c.return = n;
      else
        for (c = n; c !== null;) {
          if (c === e) {
            c = null;
            break;
          }
          if (((n = c.sibling), n !== null)) {
            ((n.return = c.return), (c = n));
            break;
          }
          c = c.return;
        }
      n = c;
    }
  }
  function Ya(e, t, l, a) {
    e = null;
    for (var n = t, u = !1; n !== null;) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(y(387));
        if (((c = c.memoizedProps), c !== null)) {
          var s = n.type;
          Yt(n.pendingProps.value, c.value) || (e !== null ? e.push(s) : (e = [s]));
        }
      } else if (n === Ea.current) {
        if (((c = n.alternate), c === null)) throw Error(y(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Wn) : (e = [Wn]));
      }
      n = n.return;
    }
    return (e !== null && xs(t, e, l, a), (t.flags |= 262144), e !== null);
  }
  function Mu(e) {
    for (e = e.firstContext; e !== null;) {
      if (!Yt(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function Va(e) {
    ((Ga = e), (Bl = null), (e = e.dependencies), e !== null && (e.firstContext = null));
  }
  function ct(e) {
    return Sd(Ga, e);
  }
  function Cu(e, t) {
    return (Ga === null && Va(e), Sd(e, t));
  }
  function Sd(e, t) {
    var l = t._currentValue;
    if (((t = { context: t, memoizedValue: l, next: null }), Bl === null)) {
      if (e === null) throw Error(y(308));
      ((Bl = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
    } else Bl = Bl.next = t;
    return l;
  }
  var cg =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var e = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (l, a) {
                  e.push(a);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                e.forEach(function (l) {
                  return l();
                }));
            };
          },
    sg = o.unstable_scheduleCallback,
    rg = o.unstable_NormalPriority,
    Ke = { $$typeof: ke, Consumer: null, Provider: null, _currentValue: null, _currentValue2: null, _threadCount: 0 };
  function bs() {
    return { controller: new cg(), data: new Map(), refCount: 0 };
  }
  function bi(e) {
    (e.refCount--,
      e.refCount === 0 &&
        sg(rg, function () {
          e.controller.abort();
        }));
  }
  function Nd(e, t) {
    if ((e.pendingLanes & 4194048) !== 0) {
      var l = e.transitionTypes;
      for (l === null && (l = e.transitionTypes = []), e = 0; e < t.length; e++) {
        var a = t[e];
        l.indexOf(a) === -1 && l.push(a);
      }
    }
  }
  var ji = null;
  function fg(e) {
    var t = e.transitionTypes;
    return ((e.transitionTypes = null), t);
  }
  var pi = null,
    js = 0,
    La = 0,
    En = null;
  function dg(e, t) {
    if (pi === null) {
      var l = (pi = []);
      ((js = 0),
        (La = Ur()),
        (En = {
          status: "pending",
          value: void 0,
          then: function (a) {
            l.push(a);
          },
        }));
    }
    return (js++, t.then(Td, Td), t);
  }
  function Td() {
    if (--js === 0 && ((ji = null), pi !== null)) {
      En !== null && (En.status = "fulfilled");
      var e = pi;
      ((pi = null), (La = 0), (En = null));
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function og(e, t) {
    var l = [],
      a = {
        status: "pending",
        value: null,
        reason: null,
        then: function (n) {
          l.push(n);
        },
      };
    return (
      e.then(
        function () {
          ((a.status = "fulfilled"), (a.value = t));
          for (var n = 0; n < l.length; n++) (0, l[n])(t);
        },
        function (n) {
          for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++) (0, l[n])(void 0);
        },
      ),
      a
    );
  }
  var Ed = q.S;
  q.S = function (e, t) {
    if (((bh = et()), typeof t == "object" && t !== null && typeof t.then == "function" && dg(e, t), ji !== null))
      for (var l = Zn; l !== null;) (Nd(l, ji), (l = l.next));
    if (((l = e.types), l !== null)) {
      for (var a = Zn; a !== null;) (Nd(a, l), (a = a.next));
      if (La !== 0) {
        ((a = ji), a === null && (a = ji = []));
        for (var n = 0; n < l.length; n++) {
          var u = l[n];
          a.indexOf(u) === -1 && a.push(u);
        }
      }
    }
    Ed !== null && Ed(e, t);
  };
  var Za = pt(null);
  function ps() {
    var e = Za.current;
    return e !== null ? e : Me.pooledCache;
  }
  function Du(e, t) {
    t === null ? pe(Za, Za.current) : pe(Za, t.pool);
  }
  function _d() {
    var e = ps();
    return e === null ? null : { parent: Ke._currentValue, pool: e };
  }
  var _n = Error(y(460)),
    zs = Error(y(474)),
    wu = Error(y(542)),
    Ru = { then: function () {} };
  function Ad(e) {
    return ((e = e.status), e === "fulfilled" || e === "rejected");
  }
  function Od(e, t, l) {
    switch (((l = e[l]), l === void 0 ? e.push(t) : l !== t && (t.then(yl, yl), (t = l)), t.status)) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw ((e = t.reason), Cd(e), e === void 0 && !("reason" in t) ? Error(y(600)) : e);
      default:
        if (typeof t.status == "string") t.then(yl, yl);
        else {
          if (((e = Me), e !== null && 100 < e.shellSuspendCounter)) throw Error(y(482));
          ((e = t),
            (e.status = "pending"),
            e.then(
              function (a) {
                if (t.status === "pending") {
                  var n = t;
                  ((n.status = "fulfilled"), (n.value = a));
                }
              },
              function (a) {
                if (t.status === "pending") {
                  var n = t;
                  ((n.status = "rejected"), (n.reason = a));
                }
              },
            ));
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw ((e = t.reason), Cd(e), e);
        }
        throw ((Xa = t), _n);
    }
  }
  function Qa(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? ((Xa = l), _n) : l;
    }
  }
  var Xa = null;
  function Md() {
    if (Xa === null) throw Error(y(459));
    var e = Xa;
    return ((Xa = null), e);
  }
  function Cd(e) {
    if (e === _n || e === wu) throw Error(y(483));
  }
  var An = null,
    zi = 0;
  function Hu(e) {
    var t = zi;
    return ((zi += 1), An === null && (An = []), Od(An, e, t));
  }
  function la(e, t) {
    ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
  }
  function Uu(e, t) {
    throw t.$$typeof === he
      ? Error(y(525))
      : ((e = Object.prototype.toString.call(t)),
        Error(y(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
  }
  function Dd(e) {
    function t(m, f) {
      if (e) {
        var x = m.deletions;
        x === null ? ((m.deletions = [f]), (m.flags |= 16)) : x.push(f);
      }
    }
    function l(m, f) {
      if (!e) return null;
      for (; f !== null;) (t(m, f), (f = f.sibling));
      return null;
    }
    function a(m) {
      for (var f = new Map(); m !== null;) (m.key === null ? f.set(m.index, m) : f.set(m.key, m), (m = m.sibling));
      return f;
    }
    function n(m, f) {
      return ((m = Hl(m, f)), (m.index = 0), (m.sibling = null), m);
    }
    function u(m, f, x) {
      return (
        (m.index = x),
        e
          ? ((x = m.alternate),
            x !== null ? ((x = x.index), x < f ? ((m.flags |= 2), f) : x) : ((m.flags |= 134217730), f))
          : ((m.flags |= 1048576), f)
      );
    }
    function c(m) {
      return (e && m.alternate === null && (m.flags |= 134217730), m);
    }
    function s(m, f, x, z) {
      return f === null || f.tag !== 6
        ? ((f = os(x, m.mode, z)), (f.return = m), f)
        : ((f = n(f, x)), (f.return = m), f);
    }
    function r(m, f, x, z) {
      var w = x.type;
      return w === bt
        ? ((m = j(m, f, x.props.children, z, x.key)), la(m, x), m)
        : f !== null &&
            (f.elementType === w || (typeof w == "object" && w !== null && w.$$typeof === me && Qa(w) === f.type))
          ? ((f = n(f, x.props)), la(f, x), (f.return = m), f)
          : ((f = Tu(x.type, x.key, x.props, null, m.mode, z)), la(f, x), (f.return = m), f);
    }
    function g(m, f, x, z) {
      return f === null ||
        f.tag !== 4 ||
        f.stateNode.containerInfo !== x.containerInfo ||
        f.stateNode.implementation !== x.implementation
        ? ((f = hs(x, m.mode, z)), (f.return = m), f)
        : ((f = n(f, x.children || [])), (f.return = m), f);
    }
    function j(m, f, x, z, w) {
      return f === null || f.tag !== 7
        ? ((f = qa(x, m.mode, z, w)), (f.return = m), f)
        : ((f = n(f, x)), (f.return = m), f);
    }
    function S(m, f, x) {
      if ((typeof f == "string" && f !== "") || typeof f == "number" || typeof f == "bigint")
        return ((f = os("" + f, m.mode, x)), (f.return = m), f);
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case Jt:
            return ((x = Tu(f.type, f.key, f.props, null, m.mode, x)), la(x, f), (x.return = m), x);
          case Ce:
            return ((f = hs(f, m.mode, x)), (f.return = m), f);
          case me:
            return ((f = Qa(f)), S(m, f, x));
        }
        if (de(f) || Y(f)) return ((f = qa(f, m.mode, x, null)), (f.return = m), f);
        if (typeof f.then == "function") return S(m, Hu(f), x);
        if (f.$$typeof === ke) return S(m, Cu(m, f), x);
        Uu(m, f);
      }
      return null;
    }
    function h(m, f, x, z) {
      var w = f !== null ? f.key : null;
      if ((typeof x == "string" && x !== "") || typeof x == "number" || typeof x == "bigint")
        return w !== null ? null : s(m, f, "" + x, z);
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case Jt:
            return x.key === w ? r(m, f, x, z) : null;
          case Ce:
            return x.key === w ? g(m, f, x, z) : null;
          case me:
            return ((x = Qa(x)), h(m, f, x, z));
        }
        if (de(x) || Y(x)) return w !== null ? null : j(m, f, x, z, null);
        if (typeof x.then == "function") return h(m, f, Hu(x), z);
        if (x.$$typeof === ke) return h(m, f, Cu(m, x), z);
        Uu(m, x);
      }
      return null;
    }
    function b(m, f, x, z, w) {
      if ((typeof z == "string" && z !== "") || typeof z == "number" || typeof z == "bigint")
        return ((m = m.get(x) || null), s(f, m, "" + z, w));
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case Jt:
            return ((m = m.get(z.key === null ? x : z.key) || null), r(f, m, z, w));
          case Ce:
            return ((m = m.get(z.key === null ? x : z.key) || null), g(f, m, z, w));
          case me:
            return ((z = Qa(z)), b(m, f, x, z, w));
        }
        if (de(z) || Y(z)) return ((m = m.get(x) || null), j(f, m, z, w, null));
        if (typeof z.then == "function") return b(m, f, x, Hu(z), w);
        if (z.$$typeof === ke) return b(m, f, x, Cu(f, z), w);
        Uu(f, z);
      }
      return null;
    }
    function M(m, f, x, z) {
      for (var w = null, se = null, V = f, J = (f = 0), We = null; V !== null && J < x.length; J++) {
        V.index > J ? ((We = V), (V = null)) : (We = V.sibling);
        var oe = h(m, V, x[J], z);
        if (oe === null) {
          V === null && (V = We);
          break;
        }
        (e && V && oe.alternate === null && t(m, V),
          (f = u(oe, f, J)),
          se === null ? (w = oe) : (se.sibling = oe),
          (se = oe),
          (V = We));
      }
      if (J === x.length) return (l(m, V), le && Ul(m, J), w);
      if (V === null) {
        for (; J < x.length; J++)
          ((V = S(m, x[J], z)), V !== null && ((f = u(V, f, J)), se === null ? (w = V) : (se.sibling = V), (se = V)));
        return (le && Ul(m, J), w);
      }
      for (V = a(V); J < x.length; J++)
        ((We = b(V, m, J, x[J], z)),
          We !== null &&
            (e && ((oe = We.alternate), oe !== null && V.delete(oe.key === null ? J : oe.key)),
            (f = u(We, f, J)),
            se === null ? (w = We) : (se.sibling = We),
            (se = We)));
      return (
        e &&
          V.forEach(function (pa) {
            return t(m, pa);
          }),
        le && Ul(m, J),
        w
      );
    }
    function U(m, f, x, z) {
      if (x == null) throw Error(y(151));
      for (
        var w = null, se = null, V = f, J = (f = 0), We = null, oe = x.next();
        V !== null && !oe.done;
        J++, oe = x.next()
      ) {
        V.index > J ? ((We = V), (V = null)) : (We = V.sibling);
        var pa = h(m, V, oe.value, z);
        if (pa === null) {
          V === null && (V = We);
          break;
        }
        (e && V && pa.alternate === null && t(m, V),
          (f = u(pa, f, J)),
          se === null ? (w = pa) : (se.sibling = pa),
          (se = pa),
          (V = We));
      }
      if (oe.done) return (l(m, V), le && Ul(m, J), w);
      if (V === null) {
        for (; !oe.done; J++, oe = x.next())
          ((oe = S(m, oe.value, z)),
            oe !== null && ((f = u(oe, f, J)), se === null ? (w = oe) : (se.sibling = oe), (se = oe)));
        return (le && Ul(m, J), w);
      }
      for (V = a(V); !oe.done; J++, oe = x.next())
        ((oe = b(V, m, J, oe.value, z)),
          oe !== null &&
            (e && ((We = oe.alternate), We !== null && V.delete(We.key === null ? J : We.key)),
            (f = u(oe, f, J)),
            se === null ? (w = oe) : (se.sibling = oe),
            (se = oe)));
      return (
        e &&
          V.forEach(function (Xv) {
            return t(m, Xv);
          }),
        le && Ul(m, J),
        w
      );
    }
    function P(m, f, x, z) {
      if (
        (typeof x == "object" &&
          x !== null &&
          x.type === bt &&
          x.key === null &&
          x.props.ref === void 0 &&
          (x = x.props.children),
        typeof x == "object" && x !== null)
      ) {
        switch (x.$$typeof) {
          case Jt:
            e: {
              for (var w = x.key; f !== null;) {
                if (f.key === w) {
                  if (((w = x.type), w === bt)) {
                    if (f.tag === 7) {
                      (l(m, f.sibling), (z = n(f, x.props.children)), la(z, x), (z.return = m), (m = z));
                      break e;
                    }
                  } else if (
                    f.elementType === w ||
                    (typeof w == "object" && w !== null && w.$$typeof === me && Qa(w) === f.type)
                  ) {
                    (l(m, f.sibling), (z = n(f, x.props)), la(z, x), (z.return = m), (m = z));
                    break e;
                  }
                  l(m, f);
                  break;
                } else t(m, f);
                f = f.sibling;
              }
              x.type === bt
                ? ((z = qa(x.props.children, m.mode, z, x.key)), la(z, x), (z.return = m), (m = z))
                : ((z = Tu(x.type, x.key, x.props, null, m.mode, z)), la(z, x), (z.return = m), (m = z));
            }
            return c(m);
          case Ce:
            e: {
              for (w = x.key; f !== null;) {
                if (f.key === w)
                  if (
                    f.tag === 4 &&
                    f.stateNode.containerInfo === x.containerInfo &&
                    f.stateNode.implementation === x.implementation
                  ) {
                    (l(m, f.sibling), (z = n(f, x.children || [])), (z.return = m), (m = z));
                    break e;
                  } else {
                    l(m, f);
                    break;
                  }
                else t(m, f);
                f = f.sibling;
              }
              ((z = hs(x, m.mode, z)), (z.return = m), (m = z));
            }
            return c(m);
          case me:
            return ((x = Qa(x)), P(m, f, x, z));
        }
        if (de(x)) return M(m, f, x, z);
        if (Y(x)) {
          if (((w = Y(x)), typeof w != "function")) throw Error(y(150));
          return ((x = w.call(x)), U(m, f, x, z));
        }
        if (typeof x.then == "function") return P(m, f, Hu(x), z);
        if (x.$$typeof === ke) return P(m, f, Cu(m, x), z);
        Uu(m, x);
      }
      return (typeof x == "string" && x !== "") || typeof x == "number" || typeof x == "bigint"
        ? ((x = "" + x),
          f !== null && f.tag === 6
            ? (l(m, f.sibling), (z = n(f, x)), (z.return = m), (m = z))
            : (l(m, f), (z = os(x, m.mode, z)), (z.return = m), (m = z)),
          c(m))
        : l(m, f);
    }
    return function (m, f, x, z) {
      try {
        zi = 0;
        var w = P(m, f, x, z);
        return ((An = null), w);
      } catch (V) {
        if (V === _n || V === wu) throw V;
        var se = Dt(29, V, null, m.mode);
        return ((se.lanes = z), (se.return = m), se);
      } finally {
      }
    };
  }
  var Ka = Dd(!0),
    wd = Dd(!1),
    aa = !1;
  function Ss(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Ns(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          callbacks: null,
        }));
  }
  function na(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function ia(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (be & 2) !== 0)) {
      var n = a.pending;
      return (
        n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
        (a.pending = t),
        (t = Nu(e)),
        vd(e, null, l),
        t
      );
    }
    return (Su(e, a, t, l), Nu(e));
  }
  function Si(e, t, l) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (l & 4194048) !== 0))) {
      var a = t.lanes;
      ((a &= e.pendingLanes), (l |= a), (t.lanes = l), su(e, l));
    }
  }
  function Ts(e, t) {
    var l = e.updateQueue,
      a = e.alternate;
    if (a !== null && ((a = a.updateQueue), l === a)) {
      var n = null,
        u = null;
      if (((l = l.firstBaseUpdate), l !== null)) {
        do {
          var c = { lane: l.lane, tag: l.tag, payload: l.payload, callback: null, next: null };
          (u === null ? (n = u = c) : (u = u.next = c), (l = l.next));
        } while (l !== null);
        u === null ? (n = u = t) : (u = u.next = t);
      } else n = u = t;
      ((l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (e.updateQueue = l));
      return;
    }
    ((e = l.lastBaseUpdate), e === null ? (l.firstBaseUpdate = t) : (e.next = t), (l.lastBaseUpdate = t));
  }
  var Es = !1;
  function Ni() {
    if (Es) {
      var e = En;
      if (e !== null) throw e;
    }
  }
  function Ti(e, t, l, a) {
    Es = !1;
    var n = e.updateQueue;
    aa = !1;
    var u = n.firstBaseUpdate,
      c = n.lastBaseUpdate,
      s = n.shared.pending;
    if (s !== null) {
      n.shared.pending = null;
      var r = s,
        g = r.next;
      ((r.next = null), c === null ? (u = g) : (c.next = g), (c = r));
      var j = e.alternate;
      j !== null &&
        ((j = j.updateQueue),
        (s = j.lastBaseUpdate),
        s !== c && (s === null ? (j.firstBaseUpdate = g) : (s.next = g), (j.lastBaseUpdate = r)));
    }
    if (u !== null) {
      var S = n.baseState;
      ((c = 0), (j = g = r = null), (s = u));
      do {
        var h = s.lane & -536870913,
          b = h !== s.lane;
        if (b ? (ce & h) === h : (a & h) === h) {
          (h !== 0 && h === La && (Es = !0),
            j !== null && (j = j.next = { lane: 0, tag: s.tag, payload: s.payload, callback: null, next: null }));
          e: {
            var M = e,
              U = s;
            h = t;
            var P = l;
            switch (U.tag) {
              case 1:
                if (((M = U.payload), typeof M == "function")) {
                  S = M.call(P, S, h);
                  break e;
                }
                S = M;
                break e;
              case 3:
                M.flags = (M.flags & -65537) | 128;
              case 0:
                if (((M = U.payload), (h = typeof M == "function" ? M.call(P, S, h) : M), h == null)) break e;
                S = te({}, S, h);
                break e;
              case 2:
                aa = !0;
            }
          }
          ((h = s.callback),
            h !== null &&
              ((e.flags |= 64),
              b && (e.flags |= 8192),
              (b = n.callbacks),
              b === null ? (n.callbacks = [h]) : b.push(h)));
        } else
          ((b = { lane: h, tag: s.tag, payload: s.payload, callback: s.callback, next: null }),
            j === null ? ((g = j = b), (r = S)) : (j = j.next = b),
            (c |= h));
        if (((s = s.next), s === null)) {
          if (((s = n.shared.pending), s === null)) break;
          ((b = s), (s = b.next), (b.next = null), (n.lastBaseUpdate = b), (n.shared.pending = null));
        }
      } while (!0);
      (j === null && (r = S),
        (n.baseState = r),
        (n.firstBaseUpdate = g),
        (n.lastBaseUpdate = j),
        u === null && (n.shared.lanes = 0),
        (oa |= c),
        (e.lanes = c),
        (e.memoizedState = S));
    }
  }
  function Rd(e, t) {
    if (typeof e != "function") throw Error(y(191, e));
    e.call(t);
  }
  function Hd(e, t) {
    var l = e.callbacks;
    if (l !== null) for (e.callbacks = null, e = 0; e < l.length; e++) Rd(l[e], t);
  }
  var ua = pt(null),
    Bu = pt(0);
  function Ud(e, t) {
    ((e = Ll), pe(Bu, e), pe(ua, t), (Ll = e | t.baseLanes));
  }
  function _s() {
    (pe(Bu, Ll), pe(ua, ua.current));
  }
  function As() {
    ((Ll = Bu.current), Xe(ua), Xe(Bu));
  }
  var st = pt(null),
    xt = null;
  function ca(e) {
    var t = e.alternate;
    (pe(rt, rt.current & 1),
      pe(st, e),
      xt === null && (t === null || ua.current !== null || t.memoizedState !== null) && (xt = e));
  }
  function Os(e) {
    (pe(rt, rt.current), pe(st, e), xt === null && (xt = e));
  }
  function Bd(e) {
    e.tag === 22 ? (pe(rt, rt.current), pe(st, e), xt === null && (xt = e)) : sa();
  }
  function sa() {
    (pe(rt, rt.current), pe(st, st.current));
  }
  function Vt(e) {
    (Xe(st), xt === e && (xt = null), Xe(rt));
  }
  var rt = pt(0);
  function Ei(e, t) {
    (pe(st, st.current), pe(rt, t));
  }
  function Ms(e) {
    (Xe(rt), Xe(st), xt === e && (xt = null));
  }
  function qu(e) {
    for (var t = e; t !== null;) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && ((l = l.dehydrated), l === null || Pr(l) || Ir(l))) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var kl = 0,
    $ = null,
    Oe = null,
    Je = null,
    ku = !1,
    On = !1,
    Ja = !1,
    Gu = 0,
    _i = 0,
    Mn = null,
    hg = 0;
  function Ge() {
    throw Error(y(321));
  }
  function Cs(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++) if (!Yt(e[l], t[l])) return !1;
    return !0;
  }
  function Ds(e, t, l, a, n, u) {
    return (
      (kl = u),
      ($ = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (q.H = e === null || e.memoizedState === null ? po : zo),
      (Ja = !1),
      (u = l(a, n)),
      (Ja = !1),
      On && (u = kd(t, l, a, n)),
      qd(e),
      u
    );
  }
  function qd(e) {
    q.H = Ku;
    var t = Oe !== null && Oe.next !== null;
    if (((kl = 0), (Je = Oe = $ = null), (ku = !1), (_i = 0), (Mn = null), t)) throw Error(y(300));
    e === null || Fe || ((e = e.dependencies), e !== null && Mu(e) && (Fe = !0));
  }
  function kd(e, t, l, a) {
    $ = e;
    var n = 0;
    do {
      if ((On && (Mn = null), (_i = 0), (On = !1), 25 <= n)) throw Error(y(301));
      if (((n += 1), (Je = Oe = null), e.updateQueue != null)) {
        var u = e.updateQueue;
        ((u.lastEffect = null), (u.events = null), (u.stores = null), u.memoCache != null && (u.memoCache.index = 0));
      }
      ((q.H = pg), (u = t(l, a)));
    } while (On);
    return u;
  }
  function mg() {
    var e = q.H,
      t = e.useState()[0];
    return (
      (t = typeof t.then == "function" ? Ai(t) : t),
      (e = e.useState()[0]),
      (Oe !== null ? Oe.memoizedState : null) !== e && ($.flags |= 1024),
      t
    );
  }
  function ws() {
    var e = Gu !== 0;
    return ((Gu = 0), e);
  }
  function Rs(e, t, l) {
    ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~l));
  }
  function Hs(e) {
    if (ku) {
      for (e = e.memoizedState; e !== null;) {
        var t = e.queue;
        (t !== null && (t.pending = null), (e = e.next));
      }
      ku = !1;
    }
    ((kl = 0), (Je = Oe = $ = null), (On = !1), (_i = Gu = 0), (Mn = null));
  }
  function Tt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Je === null ? ($.memoizedState = Je = e) : (Je = Je.next = e), Je);
  }
  function Ze() {
    if (Oe === null) {
      var e = $.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Oe.next;
    var t = Je === null ? $.memoizedState : Je.next;
    if (t !== null) ((Je = t), (Oe = e));
    else {
      if (e === null) throw $.alternate === null ? Error(y(467)) : Error(y(310));
      ((Oe = e),
        (e = {
          memoizedState: Oe.memoizedState,
          baseState: Oe.baseState,
          baseQueue: Oe.baseQueue,
          queue: Oe.queue,
          next: null,
        }),
        Je === null ? ($.memoizedState = Je = e) : (Je = Je.next = e));
    }
    return Je;
  }
  function Yu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ai(e) {
    var t = _i;
    return (
      (_i += 1),
      Mn === null && (Mn = []),
      (e = Od(Mn, e, t)),
      (t = $),
      (Je === null ? t.memoizedState : Je.next) === null &&
        ((t = t.alternate), (q.H = t === null || t.memoizedState === null ? po : zo)),
      e
    );
  }
  function Vu(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Ai(e);
      if (e.$$typeof === N) return;
      if (e.$$typeof === ke) return ct(e);
    }
    throw Error(y(438, String(e)));
  }
  function Us(e) {
    var t = null,
      l = $.updateQueue;
    if ((l !== null && (t = l.memoCache), t == null)) {
      var a = $.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (t = {
              data: a.data.map(function (n) {
                return n.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      l === null && ((l = Yu()), ($.updateQueue = l)),
      (l.memoCache = t),
      (l = t.data[t.index]),
      l === void 0)
    )
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++) l[a] = Ue;
    return (t.index++, l);
  }
  function Gl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Lu(e) {
    var t = Ze();
    return Bs(t, Oe, e);
  }
  function Bs(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(y(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue,
      u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var c = n.next;
        ((n.next = u.next), (u.next = c));
      }
      ((t.baseQueue = n = u), (a.pending = null));
    }
    if (((u = e.baseState), n === null)) e.memoizedState = u;
    else {
      t = n.next;
      var s = (c = null),
        r = null,
        g = t,
        j = !1;
      do {
        var S = g.lane & -536870913;
        if (S !== g.lane ? (ce & S) === S : (kl & S) === S) {
          var h = g.revertLane;
          if (h === 0)
            (r !== null &&
              (r = r.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: g.action,
                  hasEagerState: g.hasEagerState,
                  eagerState: g.eagerState,
                  next: null,
                }),
              S === La && (j = !0));
          else if ((kl & h) === h) {
            ((g = g.next), h === La && (j = !0));
            continue;
          } else
            ((S = {
              lane: 0,
              revertLane: g.revertLane,
              gesture: null,
              action: g.action,
              hasEagerState: g.hasEagerState,
              eagerState: g.eagerState,
              next: null,
            }),
              r === null ? ((s = r = S), (c = u)) : (r = r.next = S),
              ($.lanes |= h),
              (oa |= h));
          ((S = g.action), Ja && l(u, S), (u = g.hasEagerState ? g.eagerState : l(u, S)));
        } else
          ((h = {
            lane: S,
            revertLane: g.revertLane,
            gesture: g.gesture,
            action: g.action,
            hasEagerState: g.hasEagerState,
            eagerState: g.eagerState,
            next: null,
          }),
            r === null ? ((s = r = h), (c = u)) : (r = r.next = h),
            ($.lanes |= S),
            (oa |= S));
        g = g.next;
      } while (g !== null && g !== t);
      if ((r === null ? (c = u) : (r.next = s), !Yt(u, e.memoizedState) && ((Fe = !0), j && ((l = En), l !== null))))
        throw l;
      ((e.memoizedState = u), (e.baseState = c), (e.baseQueue = r), (a.lastRenderedState = u));
    }
    return (n === null && (a.lanes = 0), [e.memoizedState, a.dispatch]);
  }
  function qs(e) {
    var t = Ze(),
      l = t.queue;
    if (l === null) throw Error(y(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch,
      n = l.pending,
      u = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = (n = n.next);
      do ((u = e(u, c.action)), (c = c.next));
      while (c !== n);
      (Yt(u, t.memoizedState) || (Fe = !0),
        (t.memoizedState = u),
        t.baseQueue === null && (t.baseState = u),
        (l.lastRenderedState = u));
    }
    return [u, a];
  }
  function Gd(e, t, l) {
    var a = $,
      n = Ze(),
      u = le;
    if (u) {
      if (l === void 0) throw Error(y(407));
      l = l();
    } else l = t();
    var c = !Yt((Oe || n).memoizedState, l);
    if (
      (c && ((n.memoizedState = l), (Fe = !0)),
      (n = n.queue),
      Ys(Ld.bind(null, a, n, e), [e]),
      (e = n.getSnapshot !== t || c || (Je !== null && (Je.memoizedState.tag & 1) !== 0)),
      Cn(e ? 9 : 8, { destroy: void 0 }, Vd.bind(null, a, n, l, t), null),
      e)
    ) {
      if (((a.flags |= 2048), Me === null)) throw Error(y(349));
      u || (kl & 127) !== 0 || Yd(a, t, l);
    }
    return l;
  }
  function Yd(e, t, l) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: l }),
      (t = $.updateQueue),
      t === null
        ? ((t = Yu()), ($.updateQueue = t), (t.stores = [e]))
        : ((l = t.stores), l === null ? (t.stores = [e]) : l.push(e)));
  }
  function Vd(e, t, l, a) {
    ((t.value = l), (t.getSnapshot = a), Zd(t) && Qd(e));
  }
  function Ld(e, t, l) {
    return l(function () {
      Zd(t) && Qd(e);
    });
  }
  function Zd(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !Yt(e, l);
    } catch {
      return !0;
    }
  }
  function Qd(e) {
    var t = Ba(e, 2);
    t !== null && Ut(t, e, 2);
  }
  function ks(e) {
    var t = Tt();
    if (typeof e == "function") {
      var l = e;
      if (((e = l()), Ja)) {
        cl(!0);
        try {
          l();
        } finally {
          cl(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = e),
      (t.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Gl, lastRenderedState: e }),
      t
    );
  }
  function Xd(e, t, l, a) {
    return ((e.baseState = l), Bs(e, Oe, typeof a == "function" ? a : Gl));
  }
  function gg(e, t, l, a, n) {
    if (Xu(e)) throw Error(y(485));
    if (((e = t.action), e !== null)) {
      var u = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (c) {
          u.listeners.push(c);
        },
      };
      (q.T !== null ? l(!0) : (u.isTransition = !1),
        a(u),
        (l = t.pending),
        l === null ? ((u.next = t.pending = u), Kd(t, u)) : ((u.next = l.next), (t.pending = l.next = u)));
    }
  }
  function Kd(e, t) {
    var l = t.action,
      a = t.payload,
      n = e.state;
    if (t.isTransition) {
      var u = q.T,
        c = {};
      ((c.types = u !== null ? u.types : null), (q.T = c));
      try {
        var s = l(n, a),
          r = q.S;
        (r !== null && r(c, s), Jd(e, t, s));
      } catch (g) {
        Gs(e, t, g);
      } finally {
        (u !== null && c.types !== null && (u.types = c.types), (q.T = u));
      }
    } else
      try {
        ((u = l(n, a)), Jd(e, t, u));
      } catch (g) {
        Gs(e, t, g);
      }
  }
  function Jd(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function"
      ? l.then(
          function (a) {
            Fd(e, t, a);
          },
          function (a) {
            return Gs(e, t, a);
          },
        )
      : Fd(e, t, l);
  }
  function Fd(e, t, l) {
    ((t.status = "fulfilled"),
      (t.value = l),
      Wd(t),
      (e.state = l),
      (t = e.pending),
      t !== null && ((l = t.next), l === t ? (e.pending = null) : ((l = l.next), (t.next = l), Kd(e, l))));
  }
  function Gs(e, t, l) {
    var a = e.pending;
    if (((e.pending = null), a !== null)) {
      a = a.next;
      do ((t.status = "rejected"), (t.reason = l), Wd(t), (t = t.next));
      while (t !== a);
    }
    e.action = null;
  }
  function Wd(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function $d(e, t) {
    return t;
  }
  function Pd(e, t) {
    if (le) {
      var l = Me.formState;
      if (l !== null) {
        e: {
          var a = $;
          if (le) {
            if (we) {
              t: {
                for (var n = we, u = tl; n.nodeType !== 8;) {
                  if (!u) {
                    n = null;
                    break t;
                  }
                  if (((n = al(n.nextSibling)), n === null)) {
                    n = null;
                    break t;
                  }
                }
                ((u = n.data), (n = u === "F!" || u === "F" ? n : null));
              }
              if (n) {
                ((we = al(n.nextSibling)), (a = n.data === "F!"));
                break e;
              }
            }
            ea(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return (
      (l = Tt()),
      (l.memoizedState = l.baseState = t),
      (a = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: $d, lastRenderedState: t }),
      (l.queue = a),
      (l = xo.bind(null, $, a)),
      (a.dispatch = l),
      (a = ks(!1)),
      (u = Xs.bind(null, $, !1, a.queue)),
      (a = Tt()),
      (n = { state: t, dispatch: null, action: e, pending: null }),
      (a.queue = n),
      (l = gg.bind(null, $, n, u, l)),
      (n.dispatch = l),
      (a.memoizedState = e),
      [t, l, !1]
    );
  }
  function Id(e) {
    var t = Ze();
    return eo(t, Oe, e);
  }
  function eo(e, t, l) {
    if (((t = Bs(e, t, $d)[0]), (e = Lu(Gl)[0]), typeof t == "object" && t !== null && typeof t.then == "function"))
      try {
        var a = Ai(t);
      } catch (c) {
        throw c === _n ? wu : c;
      }
    else a = t;
    t = Ze();
    var n = t.queue,
      u = n.dispatch;
    return (
      l !== t.memoizedState && (($.flags |= 2048), Cn(9, { destroy: void 0 }, vg.bind(null, n, l), null)),
      [a, u, e]
    );
  }
  function vg(e, t) {
    e.action = t;
  }
  function to(e) {
    var t = Ze(),
      l = Oe;
    if (l !== null) return eo(t, l, e);
    (Ze(), (t = t.memoizedState), (l = Ze()));
    var a = l.queue.dispatch;
    return ((l.memoizedState = e), [t, a, !1]);
  }
  function Cn(e, t, l, a) {
    return (
      (e = { tag: e, create: l, deps: a, inst: t, next: null }),
      (t = $.updateQueue),
      t === null && ((t = Yu()), ($.updateQueue = t)),
      (l = t.lastEffect),
      l === null ? (t.lastEffect = e.next = e) : ((a = l.next), (l.next = e), (e.next = a), (t.lastEffect = e)),
      e
    );
  }
  function lo() {
    return Ze().memoizedState;
  }
  function Zu(e, t, l, a) {
    var n = Tt();
    (($.flags |= e), (n.memoizedState = Cn(1 | t, { destroy: void 0 }, l, a === void 0 ? null : a)));
  }
  function Qu(e, t, l, a) {
    var n = Ze();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    Oe !== null && a !== null && Cs(a, Oe.memoizedState.deps)
      ? (n.memoizedState = Cn(t, u, l, a))
      : (($.flags |= e), (n.memoizedState = Cn(1 | t, u, l, a)));
  }
  function ao(e, t) {
    Zu(8390656, 8, e, t);
  }
  function Ys(e, t) {
    Qu(2048, 8, e, t);
  }
  function yg(e) {
    $.flags |= 4;
    var t = $.updateQueue;
    if (t === null) ((t = Yu()), ($.updateQueue = t), (t.events = [e]));
    else {
      var l = t.events;
      l === null ? (t.events = [e]) : l.push(e);
    }
  }
  function no(e) {
    var t = Ze().memoizedState;
    return (
      yg({ ref: t, nextImpl: e }),
      function () {
        if ((be & 2) !== 0) throw Error(y(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function io(e, t) {
    return Qu(4, 2, e, t);
  }
  function uo(e, t) {
    return Qu(4, 4, e, t);
  }
  function co(e, t) {
    if (typeof t == "function") {
      e = e();
      var l = t(e);
      return function () {
        typeof l == "function" ? l() : t(null);
      };
    }
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function so(e, t, l) {
    ((l = l != null ? l.concat([e]) : null), Qu(4, 4, co.bind(null, t, e), l));
  }
  function Vs() {}
  function ro(e, t) {
    var l = Ze();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Cs(t, a[1]) ? a[0] : ((l.memoizedState = [e, t]), e);
  }
  function fo(e, t) {
    var l = Ze();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Cs(t, a[1])) return a[0];
    if (((a = e()), Ja)) {
      cl(!0);
      try {
        e();
      } finally {
        cl(!1);
      }
    }
    return ((l.memoizedState = [a, t]), a);
  }
  function Ls(e, t, l) {
    return l === void 0 || ((kl & 1073741824) !== 0 && (ce & 261930) === 0)
      ? (e.memoizedState = t)
      : ((e.memoizedState = l), (e = ph()), ($.lanes |= e), (oa |= e), l);
  }
  function oo(e, t, l, a) {
    return Yt(l, t)
      ? l
      : ua.current !== null
        ? ((e = Ls(e, l, a)), Yt(e, t) || (Fe = !0), e)
        : (kl & 106) === 0 || ((kl & 1073741824) !== 0 && (ce & 261930) === 0)
          ? ((Fe = !0), (e.memoizedState = l))
          : ((e = ph()), ($.lanes |= e), (oa |= e), t);
  }
  function ho(e, t, l, a, n) {
    var u = F.p;
    F.p = u !== 0 && 8 > u ? u : 8;
    var c = q.T,
      s = {};
    ((s.types = c !== null ? c.types : null), (q.T = s), Xs(e, !1, t, l));
    try {
      var r = n(),
        g = q.S;
      if ((g !== null && g(s, r), r !== null && typeof r == "object" && typeof r.then == "function")) {
        var j = og(r, a);
        Oi(e, t, j, Xt(e));
      } else Oi(e, t, a, Xt(e));
    } catch (S) {
      Oi(e, t, { then: function () {}, status: "rejected", reason: S }, Xt());
    } finally {
      ((F.p = u), c !== null && s.types !== null && (c.types = s.types), (q.T = c));
    }
  }
  function xg() {}
  function Zs(e, t, l, a) {
    if (e.tag !== 5) throw Error(y(476));
    var n = mo(e).queue;
    ho(
      e,
      n,
      t,
      Bt,
      l === null
        ? xg
        : function () {
            return (go(e), l(a));
          },
    );
  }
  function mo(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Bt,
      baseState: Bt,
      baseQueue: null,
      queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Gl, lastRenderedState: Bt },
      next: null,
    };
    var l = {};
    return (
      (t.next = {
        memoizedState: l,
        baseState: l,
        baseQueue: null,
        queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Gl, lastRenderedState: l },
        next: null,
      }),
      (e.memoizedState = t),
      (e = e.alternate),
      e !== null && (e.memoizedState = t),
      t
    );
  }
  function go(e) {
    var t = mo(e);
    (t.next === null && (t = e.alternate.memoizedState), Oi(e, t.next.queue, {}, Xt()));
  }
  function Qs() {
    return ct(Wn);
  }
  function vo() {
    return Ze().memoizedState;
  }
  function yo() {
    return Ze().memoizedState;
  }
  function bg(e) {
    for (var t = e.return; t !== null;) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = Xt();
          e = na(l);
          var a = ia(t, e, l);
          (a !== null && (Ut(a, t, l), Si(a, t, l)), (t = { cache: bs() }), (e.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function jg(e, t, l) {
    var a = Xt();
    ((l = { lane: a, revertLane: 0, gesture: null, action: l, hasEagerState: !1, eagerState: null, next: null }),
      Xu(e) ? bo(t, l) : ((l = fs(e, t, l, a)), l !== null && (Ut(l, e, a), jo(l, t, a))));
  }
  function xo(e, t, l) {
    var a = Xt();
    Oi(e, t, l, a);
  }
  function Oi(e, t, l, a) {
    var n = { lane: a, revertLane: 0, gesture: null, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Xu(e)) bo(t, n);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && ((u = t.lastRenderedReducer), u !== null))
        try {
          var c = t.lastRenderedState,
            s = u(c, l);
          if (((n.hasEagerState = !0), (n.eagerState = s), Yt(s, c))) return (Su(e, t, n, 0), Me === null && zu(), !1);
        } catch {
        } finally {
        }
      if (((l = fs(e, t, n, a)), l !== null)) return (Ut(l, e, a), jo(l, t, a), !0);
    }
    return !1;
  }
  function Xs(e, t, l, a) {
    if (
      ((a = { lane: 2, revertLane: Ur(), gesture: null, action: a, hasEagerState: !1, eagerState: null, next: null }),
      Xu(e))
    ) {
      if (t) throw Error(y(479));
    } else ((t = fs(e, l, a, 2)), t !== null && Ut(t, e, 2));
  }
  function Xu(e) {
    var t = e.alternate;
    return e === $ || (t !== null && t === $);
  }
  function bo(e, t) {
    On = ku = !0;
    var l = e.pending;
    (l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)), (e.pending = t));
  }
  function jo(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      ((a &= e.pendingLanes), (l |= a), (t.lanes = l), su(e, l));
    }
  }
  var Ku = {
      readContext: ct,
      use: Vu,
      useCallback: Ge,
      useContext: Ge,
      useEffect: Ge,
      useImperativeHandle: Ge,
      useLayoutEffect: Ge,
      useInsertionEffect: Ge,
      useMemo: Ge,
      useReducer: Ge,
      useRef: Ge,
      useState: Ge,
      useDebugValue: Ge,
      useDeferredValue: Ge,
      useTransition: Ge,
      useSyncExternalStore: Ge,
      useId: Ge,
      useHostTransitionStatus: Ge,
      useFormState: Ge,
      useActionState: Ge,
      useOptimistic: Ge,
      useMemoCache: Ge,
      useCacheRefresh: Ge,
      useEffectEvent: Ge,
    },
    po = {
      readContext: ct,
      use: Vu,
      useCallback: function (e, t) {
        return ((Tt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: ct,
      useEffect: ao,
      useImperativeHandle: function (e, t, l) {
        ((l = l != null ? l.concat([e]) : null), Zu(4194308, 4, co.bind(null, t, e), l));
      },
      useLayoutEffect: function (e, t) {
        return Zu(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        Zu(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var l = Tt();
        t = t === void 0 ? null : t;
        var a = e();
        if (Ja) {
          cl(!0);
          try {
            e();
          } finally {
            cl(!1);
          }
        }
        return ((l.memoizedState = [a, t]), a);
      },
      useReducer: function (e, t, l) {
        var a = Tt();
        if (l !== void 0) {
          var n = l(t);
          if (Ja) {
            cl(!0);
            try {
              l(t);
            } finally {
              cl(!1);
            }
          }
        } else n = t;
        return (
          (a.memoizedState = a.baseState = n),
          (e = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: n }),
          (a.queue = e),
          (e = e.dispatch = jg.bind(null, $, e)),
          [a.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = Tt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: function (e) {
        e = ks(e);
        var t = e.queue,
          l = xo.bind(null, $, t);
        return ((t.dispatch = l), [e.memoizedState, l]);
      },
      useDebugValue: Vs,
      useDeferredValue: function (e, t) {
        var l = Tt();
        return Ls(l, e, t);
      },
      useTransition: function () {
        var e = ks(!1);
        return ((e = ho.bind(null, $, e.queue, !0, !1)), (Tt().memoizedState = e), [!1, e]);
      },
      useSyncExternalStore: function (e, t, l) {
        var a = $,
          n = Tt();
        if (le) {
          if (l === void 0) throw Error(y(407));
          l = l();
        } else {
          if (((l = t()), Me === null)) throw Error(y(349));
          (ce & 127) !== 0 || Yd(a, t, l);
        }
        n.memoizedState = l;
        var u = { value: l, getSnapshot: t };
        return (
          (n.queue = u),
          ao(Ld.bind(null, a, u, e), [e]),
          (a.flags |= 2048),
          Cn(9, { destroy: void 0 }, Vd.bind(null, a, u, l, t), null),
          l
        );
      },
      useId: function () {
        var e = Tt(),
          t = Me.identifierPrefix;
        if (le) {
          var l = bl,
            a = xl;
          ((l = (a & ~(1 << (32 - tt(a) - 1))).toString(32) + l),
            (t = "_" + t + "R_" + l),
            (l = Gu++),
            0 < l && (t += "H" + l.toString(32)),
            (t += "_"));
        } else ((l = hg++), (t = "_" + t + "r_" + l.toString(32) + "_"));
        return (e.memoizedState = t);
      },
      useHostTransitionStatus: Qs,
      useFormState: Pd,
      useActionState: Pd,
      useOptimistic: function (e) {
        var t = Tt();
        t.memoizedState = t.baseState = e;
        var l = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null };
        return ((t.queue = l), (t = Xs.bind(null, $, !0, l)), (l.dispatch = t), [e, t]);
      },
      useMemoCache: Us,
      useCacheRefresh: function () {
        return (Tt().memoizedState = bg.bind(null, $));
      },
      useEffectEvent: function (e) {
        var t = Tt(),
          l = { impl: e };
        return (
          (t.memoizedState = l),
          function () {
            if ((be & 2) !== 0) throw Error(y(440));
            return l.impl.apply(void 0, arguments);
          }
        );
      },
    },
    zo = {
      readContext: ct,
      use: Vu,
      useCallback: ro,
      useContext: ct,
      useEffect: Ys,
      useImperativeHandle: so,
      useInsertionEffect: io,
      useLayoutEffect: uo,
      useMemo: fo,
      useReducer: Lu,
      useRef: lo,
      useState: function () {
        return Lu(Gl);
      },
      useDebugValue: Vs,
      useDeferredValue: function (e, t) {
        var l = Ze();
        return oo(l, Oe.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Lu(Gl)[0],
          t = Ze().memoizedState;
        return [typeof e == "boolean" ? e : Ai(e), t];
      },
      useSyncExternalStore: Gd,
      useId: vo,
      useHostTransitionStatus: Qs,
      useFormState: Id,
      useActionState: Id,
      useOptimistic: function (e, t) {
        var l = Ze();
        return Xd(l, Oe, e, t);
      },
      useMemoCache: Us,
      useCacheRefresh: yo,
      useEffectEvent: no,
    },
    pg = {
      readContext: ct,
      use: Vu,
      useCallback: ro,
      useContext: ct,
      useEffect: Ys,
      useImperativeHandle: so,
      useInsertionEffect: io,
      useLayoutEffect: uo,
      useMemo: fo,
      useReducer: qs,
      useRef: lo,
      useState: function () {
        return qs(Gl);
      },
      useDebugValue: Vs,
      useDeferredValue: function (e, t) {
        var l = Ze();
        return Oe === null ? Ls(l, e, t) : oo(l, Oe.memoizedState, e, t);
      },
      useTransition: function () {
        var e = qs(Gl)[0],
          t = Ze().memoizedState;
        return [typeof e == "boolean" ? e : Ai(e), t];
      },
      useSyncExternalStore: Gd,
      useId: vo,
      useHostTransitionStatus: Qs,
      useFormState: to,
      useActionState: to,
      useOptimistic: function (e, t) {
        var l = Ze();
        return Oe !== null ? Xd(l, Oe, e, t) : ((l.baseState = e), [e, l.queue.dispatch]);
      },
      useMemoCache: Us,
      useCacheRefresh: yo,
      useEffectEvent: no,
    };
  function Ks(e, t, l, a) {
    ((t = e.memoizedState),
      (l = l(a, t)),
      (l = l == null ? t : te({}, t, l)),
      (e.memoizedState = l),
      e.lanes === 0 && (e.updateQueue.baseState = l));
  }
  var Js = {
    enqueueSetState: function (e, t, l) {
      e = e._reactInternals;
      var a = Xt(),
        n = na(a);
      ((n.payload = t), l != null && (n.callback = l), (t = ia(e, n, a)), t !== null && (Ut(t, e, a), Si(t, e, a)));
    },
    enqueueReplaceState: function (e, t, l) {
      e = e._reactInternals;
      var a = Xt(),
        n = na(a);
      ((n.tag = 1),
        (n.payload = t),
        l != null && (n.callback = l),
        (t = ia(e, n, a)),
        t !== null && (Ut(t, e, a), Si(t, e, a)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var l = Xt(),
        a = na(l);
      ((a.tag = 2), t != null && (a.callback = t), (t = ia(e, a, l)), t !== null && (Ut(t, e, l), Si(t, e, l)));
    },
  };
  function So(e, t, l, a, n, u, c) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(a, u, c)
        : t.prototype && t.prototype.isPureReactComponent
          ? !gi(l, a) || !gi(n, u)
          : !0
    );
  }
  function No(e, t, l, a) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a),
      typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a),
      t.state !== e && Js.enqueueReplaceState(t, t.state, null));
  }
  function Fa(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t) a !== "ref" && (l[a] = t[a]);
    }
    if ((e = e.defaultProps)) {
      l === t && (l = te({}, l));
      for (var n in e) l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function To(e) {
    pu(e);
  }
  function Eo(e) {
    console.error(e);
  }
  function _o(e) {
    pu(e);
  }
  function Ju(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Ao(e, t, l) {
    try {
      var a = e.onCaughtError;
      a(l.value, { componentStack: l.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  function Fs(e, t, l) {
    return (
      (l = na(l)),
      (l.tag = 3),
      (l.payload = { element: null }),
      (l.callback = function () {
        Ju(e, t);
      }),
      l
    );
  }
  function Oo(e) {
    return ((e = na(e)), (e.tag = 3), e);
  }
  function Mo(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      ((e.payload = function () {
        return n(u);
      }),
        (e.callback = function () {
          Ao(t, l, a);
        }));
    }
    var c = l.stateNode;
    c !== null &&
      typeof c.componentDidCatch == "function" &&
      (e.callback = function () {
        (Ao(t, l, a), typeof n != "function" && (ha === null ? (ha = new Set([this])) : ha.add(this)));
        var s = a.stack;
        this.componentDidCatch(a.value, { componentStack: s !== null ? s : "" });
      });
  }
  function zg(e, t, l, a, n) {
    if (((l.flags |= 32768), a !== null && typeof a == "object" && typeof a.then == "function")) {
      if (((t = l.alternate), t !== null && Ya(t, l, n, !0), (l = st.current), l !== null)) {
        switch (l.tag) {
          case 31:
          case 13:
          case 19:
            return (
              xt === null ? gc() : l.alternate === null && Ye === 0 && (Ye = 3),
              (l.flags &= -257),
              (l.flags |= 65536),
              (l.lanes = n),
              a === Ru
                ? (l.flags |= 16384)
                : ((t = l.updateQueue), t === null ? (l.updateQueue = new Set([a])) : t.add(a), wr(e, a, n)),
              !1
            );
          case 22:
            return (
              (l.flags |= 65536),
              a === Ru
                ? (l.flags |= 16384)
                : ((t = l.updateQueue),
                  t === null
                    ? ((t = { transitions: null, markerInstances: null, retryQueue: new Set([a]) }),
                      (l.updateQueue = t))
                    : ((l = t.retryQueue), l === null ? (t.retryQueue = new Set([a])) : l.add(a)),
                  wr(e, a, n)),
              !1
            );
        }
        throw Error(y(435, l.tag));
      }
      return (wr(e, a, n), gc(), !1);
    }
    if (le)
      return (
        (t = st.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = n),
            a !== gs && ((e = Error(y(422), { cause: a })), xi(Pt(e, l))))
          : (a !== gs && ((t = Error(y(423), { cause: a })), xi(Pt(t, l))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (n &= -n),
            (e.lanes |= n),
            (a = Pt(a, l)),
            (n = Fs(e.stateNode, a, n)),
            Ts(e, n),
            Ye !== 4 && (Ye = 2)),
        !1
      );
    var u = Error(y(520), { cause: a });
    if (((u = Pt(u, l)), Bi === null ? (Bi = [u]) : Bi.push(u), Ye !== 4 && (Ye = 2), t === null)) return !0;
    ((a = Pt(a, l)), (l = t));
    do {
      switch (l.tag) {
        case 3:
          return ((l.flags |= 65536), (e = n & -n), (l.lanes |= e), (e = Fs(l.stateNode, a, e)), Ts(l, e), !1);
        case 1:
          if (
            ((t = l.type),
            (u = l.stateNode),
            (l.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == "function" ||
                (u !== null && typeof u.componentDidCatch == "function" && (ha === null || !ha.has(u)))))
          )
            return ((l.flags |= 65536), (n &= -n), (l.lanes |= n), (n = Oo(n)), Mo(n, e, l, a), Ts(l, n), !1);
          break;
        case 22:
          if (l.memoizedState !== null) return ((l.flags |= 65536), !1);
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Ws = Error(y(461)),
    Fe = !1;
  function Pe(e, t, l, a) {
    t.child = e === null ? wd(t, null, l, a) : Ka(t, e.child, l, a);
  }
  function Co(e, t, l, a, n) {
    l = l.render;
    var u = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var s in a) s !== "ref" && (c[s] = a[s]);
    } else c = a;
    return (
      Va(t),
      (a = Ds(e, t, l, c, u, n)),
      (s = ws()),
      e !== null && !Fe ? (Rs(e, t, n), Yl(e, t, n)) : (le && s && _u(t), (t.flags |= 1), Pe(e, t, a, n), t.child)
    );
  }
  function Do(e, t, l, a, n) {
    if (e === null) {
      var u = l.type;
      return typeof u == "function" && !ds(u) && u.defaultProps === void 0 && l.compare === null
        ? ((t.tag = 15), (t.type = u), wo(e, t, u, a, n))
        : ((e = Tu(l.type, null, a, t, t.mode, n)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    if (((u = e.child), !nr(e, n))) {
      var c = u.memoizedProps;
      if (((l = l.compare), (l = l !== null ? l : gi), l(c, a) && e.ref === t.ref)) return Yl(e, t, n);
    }
    return ((t.flags |= 1), (e = Hl(u, a)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  function wo(e, t, l, a, n) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (gi(u, a) && e.ref === t.ref)
        if (((Fe = !1), (t.pendingProps = a = u), nr(e, n))) (e.flags & 131072) !== 0 && (Fe = !0);
        else return ((t.lanes = e.lanes), Yl(e, t, n));
    }
    return $s(e, t, l, a, n);
  }
  function Ro(e, t, l, a) {
    var n = a.children,
      u = e !== null ? e.memoizedState : null;
    if (
      (e === null &&
        t.stateNode === null &&
        (t.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      a.mode === "hidden")
    ) {
      if ((t.flags & 128) !== 0) {
        if (((u = u !== null ? u.baseLanes | l : l), e !== null)) {
          for (a = t.child = e.child, n = 0; a !== null;) ((n = n | a.lanes | a.childLanes), (a = a.sibling));
          a = n & ~u;
        } else ((a = 0), (t.child = null));
        return Ho(e, t, u, l, a);
      }
      if ((l & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && Du(t, u !== null ? u.cachePool : null),
          u !== null ? Ud(t, u) : _s(),
          Bd(t));
      else return ((a = t.lanes = 536870912), Ho(e, t, u !== null ? u.baseLanes | l : l, l, a));
    } else
      u !== null
        ? (Du(t, u.cachePool), Ud(t, u), sa(), (t.memoizedState = null))
        : (e !== null && Du(t, null), _s(), sa());
    return (Pe(e, t, n, l), t.child);
  }
  function Mi(e, t) {
    return (
      (e !== null && e.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      t.sibling
    );
  }
  function Ho(e, t, l, a, n) {
    var u = ps();
    return (
      (u = u === null ? null : { parent: Ke._currentValue, pool: u }),
      (t.memoizedState = { baseLanes: l, cachePool: u }),
      e !== null && Du(t, null),
      _s(),
      Bd(t),
      e !== null && Ya(e, t, a, !0),
      (t.childLanes = n),
      null
    );
  }
  function Fu(e, t) {
    return (
      (t = Wu({ mode: t.mode, children: t.children }, e.mode)),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function Uo(e, t, l) {
    return (Ka(t, e.child, null, l), (e = Fu(t, t.pendingProps)), (e.flags |= 2), Vt(t), (t.memoizedState = null), e);
  }
  function Sg(e, t, l) {
    var a = t.pendingProps,
      n = (t.flags & 128) !== 0;
    if (((t.flags &= -129), e === null)) {
      if (le) {
        if (a.mode === "hidden")
          return (
            (e = Fu(t, a)),
            (t.lanes = 536870912),
            (e.memoizedState = { baseLanes: 0, cachePool: null }),
            Mi(null, e)
          );
        if (
          (Os(t),
          (e = we)
            ? ((e = sm(e, tl)),
              (e = e !== null && e.data === "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: Pl !== null ? { id: xl, overflow: bl } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = xd(e)),
                (l.return = t),
                (t.child = l),
                (at = t),
                (we = null)))
            : (e = null),
          e === null)
        )
          throw ea(t);
        return ((t.lanes = 536870912), null);
      }
      return Fu(t, a);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if ((Os(t), n))
        if (t.flags & 256) ((t.flags &= -257), (t = Uo(e, t, l)));
        else if (t.memoizedState !== null) ((t.child = e.child), (t.flags |= 128), (t = null));
        else throw Error(y(558));
      else if ((Fe || Ya(e, t, l, !1), (n = (l & e.childLanes) !== 0), Fe || n)) {
        if (ua.current === null) {
          if (((a = Me), a !== null && ((c = ru(a, l)), c !== 0 && c !== u.retryLane)))
            throw ((u.retryLane = c), Ba(e, c), Ut(a, e, c), Ws);
          gc();
        }
        t = Uo(e, t, l);
      } else
        ((e = u.treeContext),
          (we = al(c.nextSibling)),
          (at = t),
          (le = !0),
          (Il = null),
          (tl = !1),
          e !== null && pd(t, e),
          (t = Fu(t, a)),
          (t.flags |= 134221824));
      return t;
    }
    return (
      (e = Hl(e.child, { mode: a.mode, children: a.children })),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function Dn(e, t) {
    var l = t.ref;
    if (l === null) e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object") throw Error(y(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function $s(e, t, l, a, n) {
    return (
      Va(t),
      (l = Ds(e, t, l, a, void 0, n)),
      (a = ws()),
      e !== null && !Fe ? (Rs(e, t, n), Yl(e, t, n)) : (le && a && _u(t), (t.flags |= 1), Pe(e, t, l, n), t.child)
    );
  }
  function Bo(e, t, l, a, n, u) {
    return (
      Va(t),
      (t.updateQueue = null),
      (l = kd(t, a, l, n)),
      qd(e),
      (a = ws()),
      e !== null && !Fe ? (Rs(e, t, u), Yl(e, t, u)) : (le && a && _u(t), (t.flags |= 1), Pe(e, t, l, u), t.child)
    );
  }
  function qo(e, t, l, a, n) {
    if ((Va(t), t.stateNode === null)) {
      var u = zn,
        c = l.contextType;
      (typeof c == "object" && c !== null && (u = ct(c)),
        (u = new l(a, u)),
        (t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null),
        (u.updater = Js),
        (t.stateNode = u),
        (u._reactInternals = t),
        (u = t.stateNode),
        (u.props = a),
        (u.state = t.memoizedState),
        (u.refs = {}),
        Ss(t),
        (c = l.contextType),
        (u.context = typeof c == "object" && c !== null ? ct(c) : zn),
        (u.state = t.memoizedState),
        (c = l.getDerivedStateFromProps),
        typeof c == "function" && (Ks(t, l, c, a), (u.state = t.memoizedState)),
        typeof l.getDerivedStateFromProps == "function" ||
          typeof u.getSnapshotBeforeUpdate == "function" ||
          (typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function") ||
          ((c = u.state),
          typeof u.componentWillMount == "function" && u.componentWillMount(),
          typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(),
          c !== u.state && Js.enqueueReplaceState(u, u.state, null),
          Ti(t, a, u, n),
          Ni(),
          (u.state = t.memoizedState)),
        typeof u.componentDidMount == "function" && (t.flags |= 4194308),
        (a = !0));
    } else if (e === null) {
      u = t.stateNode;
      var s = t.memoizedProps,
        r = Fa(l, s);
      u.props = r;
      var g = u.context,
        j = l.contextType;
      ((c = zn), typeof j == "object" && j !== null && (c = ct(j)));
      var S = l.getDerivedStateFromProps;
      ((j = typeof S == "function" || typeof u.getSnapshotBeforeUpdate == "function"),
        (s = t.pendingProps !== s),
        j ||
          (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
            typeof u.componentWillReceiveProps != "function") ||
          ((s || g !== c) && No(t, u, a, c)),
        (aa = !1));
      var h = t.memoizedState;
      ((u.state = h),
        Ti(t, a, u, n),
        Ni(),
        (g = t.memoizedState),
        s || h !== g || aa
          ? (typeof S == "function" && (Ks(t, l, S, a), (g = t.memoizedState)),
            (r = aa || So(t, l, r, a, h, g, c))
              ? (j ||
                  (typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function") ||
                  (typeof u.componentWillMount == "function" && u.componentWillMount(),
                  typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()),
                typeof u.componentDidMount == "function" && (t.flags |= 4194308))
              : (typeof u.componentDidMount == "function" && (t.flags |= 4194308),
                (t.memoizedProps = a),
                (t.memoizedState = g)),
            (u.props = a),
            (u.state = g),
            (u.context = c),
            (a = r))
          : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), (a = !1)));
    } else {
      ((u = t.stateNode),
        Ns(e, t),
        (c = t.memoizedProps),
        (j = Fa(l, c)),
        (u.props = j),
        (S = t.pendingProps),
        (h = u.context),
        (g = l.contextType),
        (r = zn),
        typeof g == "object" && g !== null && (r = ct(g)),
        (s = l.getDerivedStateFromProps),
        (g = typeof s == "function" || typeof u.getSnapshotBeforeUpdate == "function") ||
          (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
            typeof u.componentWillReceiveProps != "function") ||
          ((c !== S || h !== r) && No(t, u, a, r)),
        (aa = !1),
        (h = t.memoizedState),
        (u.state = h),
        Ti(t, a, u, n),
        Ni());
      var b = t.memoizedState;
      c !== S || h !== b || aa || (e !== null && e.dependencies !== null && Mu(e.dependencies))
        ? (typeof s == "function" && (Ks(t, l, s, a), (b = t.memoizedState)),
          (j = aa || So(t, l, j, a, h, b, r) || (e !== null && e.dependencies !== null && Mu(e.dependencies)))
            ? (g ||
                (typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function") ||
                (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, b, r),
                typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(a, b, r)),
              typeof u.componentDidUpdate == "function" && (t.flags |= 4),
              typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
            : (typeof u.componentDidUpdate != "function" ||
                (c === e.memoizedProps && h === e.memoizedState) ||
                (t.flags |= 4),
              typeof u.getSnapshotBeforeUpdate != "function" ||
                (c === e.memoizedProps && h === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = a),
              (t.memoizedState = b)),
          (u.props = a),
          (u.state = b),
          (u.context = r),
          (a = j))
        : (typeof u.componentDidUpdate != "function" ||
            (c === e.memoizedProps && h === e.memoizedState) ||
            (t.flags |= 4),
          typeof u.getSnapshotBeforeUpdate != "function" ||
            (c === e.memoizedProps && h === e.memoizedState) ||
            (t.flags |= 1024),
          (a = !1));
    }
    return (
      (u = a),
      Dn(e, t),
      (a = (t.flags & 128) !== 0),
      u || a
        ? ((u = t.stateNode),
          (l = a && typeof l.getDerivedStateFromError != "function" ? null : u.render()),
          (t.flags |= 1),
          e !== null && a ? ((t.child = Ka(t, e.child, null, n)), (t.child = Ka(t, null, l, n))) : Pe(e, t, l, n),
          (t.memoizedState = u.state),
          (e = t.child))
        : (e = Yl(e, t, n)),
      e
    );
  }
  function ko(e, t, l, a) {
    return (ka(), (t.flags |= 256), Pe(e, t, l, a), t.child);
  }
  var Ps = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function Is(e) {
    return { baseLanes: e, cachePool: _d() };
  }
  function er(e, t, l) {
    return ((e = e !== null ? e.childLanes & ~l : 0), t && (e |= Qt), e);
  }
  function Go(e, t, l) {
    var a = t.pendingProps,
      n = !1,
      u = (t.flags & 128) !== 0,
      c;
    if (
      ((c = u) || (c = e !== null && e.memoizedState === null ? !1 : (rt.current & 2) !== 0),
      c && ((n = !0), (t.flags &= -129)),
      (c = (t.flags & 32) !== 0),
      (t.flags &= -33),
      e === null)
    ) {
      if (le) {
        if (
          (n ? ca(t) : sa(),
          (e = we)
            ? ((e = sm(e, tl)),
              (e = e !== null && e.data !== "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: Pl !== null ? { id: xl, overflow: bl } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (l = xd(e)),
                (l.return = t),
                (t.child = l),
                (at = t),
                (we = null)))
            : (e = null),
          e === null)
        )
          throw ea(t);
        return (Ir(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      return (
        (u = a.children),
        (a = a.fallback),
        n
          ? (sa(),
            (n = t.mode),
            (u = Wu({ mode: "hidden", children: u }, n)),
            (a = qa(a, n, l, null)),
            (u.return = t),
            (a.return = t),
            (u.sibling = a),
            (t.child = u),
            (a = t.child),
            (a.memoizedState = Is(l)),
            (a.childLanes = er(e, c, l)),
            (t.memoizedState = Ps),
            Mi(null, a))
          : (ca(t), tr(t, u))
      );
    }
    var s = e.memoizedState;
    if (s !== null) {
      var r = s.dehydrated;
      if (r !== null) return Ng(e, t, u, c, a, r, s, l);
    }
    return n
      ? (sa(),
        (n = a.fallback),
        (u = t.mode),
        (s = e.child),
        (r = s.sibling),
        (a = Hl(s, { mode: "hidden", children: a.children })),
        (a.subtreeFlags = s.subtreeFlags & 1206910976),
        r !== null ? (n = Hl(r, n)) : ((n = qa(n, u, l, null)), (n.flags |= 2)),
        (n.return = t),
        (a.return = t),
        (a.sibling = n),
        (t.child = a),
        Mi(null, a),
        (a = t.child),
        (n = e.child.memoizedState),
        n === null
          ? (n = Is(l))
          : ((u = n.cachePool),
            u !== null ? ((s = Ke._currentValue), (u = u.parent !== s ? { parent: s, pool: s } : u)) : (u = _d()),
            (n = { baseLanes: n.baseLanes | l, cachePool: u })),
        (a.memoizedState = n),
        (a.childLanes = er(e, c, l)),
        (t.memoizedState = Ps),
        Mi(e.child, a))
      : (ca(t),
        (l = e.child),
        (e = l.sibling),
        (l = Hl(l, { mode: "visible", children: a.children })),
        (l.return = t),
        (l.sibling = null),
        e !== null && ((c = t.deletions), c === null ? ((t.deletions = [e]), (t.flags |= 16)) : c.push(e)),
        (t.child = l),
        (t.memoizedState = null),
        l);
  }
  function tr(e, t) {
    return ((t = Wu({ mode: "visible", children: t }, e.mode)), (t.return = e), (e.child = t));
  }
  function Wu(e, t) {
    return ((e = Dt(22, e, null, t)), (e.lanes = 0), e);
  }
  function $u(e, t, l) {
    return (Ka(t, e.child, null, l), (e = tr(t, t.pendingProps.children)), (e.flags |= 2), (t.memoizedState = null), e);
  }
  function Ng(e, t, l, a, n, u, c, s) {
    if (l)
      return t.flags & 256
        ? (ca(t), (t.flags &= -257), $u(e, t, s))
        : t.memoizedState !== null
          ? (sa(), (t.child = e.child), (t.flags |= 128), null)
          : (sa(),
            (u = n.fallback),
            (c = t.mode),
            (n = Wu({ mode: "visible", children: n.children }, c)),
            (u = qa(u, c, s, null)),
            (u.flags |= 2),
            (n.return = t),
            (u.return = t),
            (n.sibling = u),
            (t.child = n),
            Ka(t, e.child, null, s),
            (n = t.child),
            (n.memoizedState = Is(s)),
            (n.childLanes = er(e, a, s)),
            (t.memoizedState = Ps),
            Mi(null, n));
    if ((ca(t), Ir(u))) {
      if (((a = u.nextSibling && u.nextSibling.dataset), a)) var r = a.dgst;
      return (
        (a = r),
        a !== "" && ((n = Error(y(419))), (n.stack = ""), (n.digest = a), xi({ value: n, source: null, stack: null })),
        $u(e, t, s)
      );
    }
    if ((Fe || Ya(e, t, s, !1), (a = (s & e.childLanes) !== 0), Fe || a)) {
      if (ua.current !== null) return $u(e, t, s);
      if (((a = Me), a !== null && ((n = ru(a, s)), n !== 0 && n !== c.retryLane)))
        throw ((c.retryLane = n), Ba(e, n), Ut(a, e, n), Ws);
      return (Pr(u) || gc(), $u(e, t, s));
    }
    return Pr(u)
      ? ((t.flags |= 192), (t.child = e.child), null)
      : ((e = c.treeContext),
        (we = al(u.nextSibling)),
        (at = t),
        (le = !0),
        (Il = null),
        (tl = !1),
        e !== null && pd(t, e),
        (t = tr(t, n.children)),
        (t.flags |= 134221824),
        t);
  }
  function Yo(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    (a !== null && (a.lanes |= t), Ou(e.return, t, l));
  }
  function Vo(e) {
    for (var t = null; e !== null;) {
      var l = e.alternate;
      (l !== null && qu(l) === null && (t = e), (e = e.sibling));
    }
    return t;
  }
  function Pu(e, t, l, a, n, u) {
    var c = e.memoizedState;
    c === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: l,
          tailMode: n,
          treeForkCount: u,
        })
      : ((c.isBackwards = t),
        (c.rendering = null),
        (c.renderingStartTime = 0),
        (c.last = a),
        (c.tail = l),
        (c.tailMode = n),
        (c.treeForkCount = u));
  }
  function lr(e) {
    var t = e.child;
    for (e.child = null; t !== null;) {
      var l = t.sibling;
      ((t.sibling = e.child), (e.child = t), (t = l));
    }
  }
  function ar(e, t, l) {
    var a = t.pendingProps,
      n = a.revealOrder,
      u = a.tail;
    a = a.children;
    var c = rt.current;
    if (t.flags & 128) return (Ei(t, c), null);
    var s = (c & 2) !== 0;
    if (
      (s ? ((c = (c & 1) | 2), (t.flags |= 128)) : (c &= 1),
      Ei(t, c),
      n === "backwards" && e !== null ? (lr(e), Pe(e, t, a, l), lr(e)) : Pe(e, t, a, l),
      (a = le ? yi : 0),
      !s && e !== null && (e.flags & 128) !== 0)
    )
      e: for (e = t.child; e !== null;) {
        if (e.tag === 13) e.memoizedState !== null && Yo(e, l, t);
        else if (e.tag === 19) Yo(e, l, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    switch (n) {
      case "backwards":
        ((l = Vo(t.child)),
          l === null ? ((n = t.child), (t.child = null)) : ((n = l.sibling), (l.sibling = null), lr(t)),
          Pu(t, !0, n, null, u, a));
        break;
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null;) {
          if (((e = n.alternate), e !== null && qu(e) === null)) {
            t.child = n;
            break;
          }
          ((e = n.sibling), (n.sibling = l), (l = n), (n = e));
        }
        Pu(t, !0, l, null, u, a);
        break;
      case "together":
        Pu(t, !1, null, null, void 0, a);
        break;
      case "independent":
        t.memoizedState = null;
        break;
      default:
        ((l = Vo(t.child)),
          l === null ? ((n = t.child), (t.child = null)) : ((n = l.sibling), (l.sibling = null)),
          Pu(t, !1, n, l, u, a));
    }
    return t.child;
  }
  function Lo(e, t, l) {
    var a = t.pendingProps;
    return (ta(t, t.type, a.value), Pe(e, t, a.children, l), t.child);
  }
  function Yl(e, t, l) {
    if ((e !== null && (t.dependencies = e.dependencies), (oa |= t.lanes), (l & t.childLanes) === 0))
      if (e !== null) {
        if ((Ya(e, t, l, !1), (l & t.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && t.child !== e.child) throw Error(y(153));
    if (t.child !== null) {
      for (e = t.child, l = Hl(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null;)
        ((e = e.sibling), (l = l.sibling = Hl(e, e.pendingProps)), (l.return = t));
      l.sibling = null;
    }
    return t.child;
  }
  function nr(e, t) {
    return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && Mu(e)));
  }
  function Tg(e, t, l) {
    switch (t.tag) {
      case 3:
        (_a(t, t.stateNode.containerInfo), ta(t, Ke, e.memoizedState.cache), ka());
        break;
      case 27:
      case 5:
        tn(t);
        break;
      case 4:
        _a(t, t.stateNode.containerInfo);
        break;
      case 10:
        ta(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), Os(t), null);
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null) return (ca(t), (t.flags |= 128), null);
          a = Ya(e, t, l, !1);
          var n = t.child.childLanes;
          return a || (l & n) !== 0 ? Go(e, t, l) : (ca(t), (e = Yl(e, t, l)), e !== null ? e.sibling : null);
        }
        ca(t);
        break;
      case 19:
        if (t.flags & 128) return ar(e, t, l);
        if (
          ((n = (e.flags & 128) !== 0),
          (a = (l & t.childLanes) !== 0),
          a || (Ya(e, t, l, !1), (a = (l & t.childLanes) !== 0)),
          n)
        ) {
          if (a) return ar(e, t, l);
          t.flags |= 128;
        }
        if (
          ((n = t.memoizedState),
          n !== null && ((n.rendering = null), (n.tail = null), (n.lastEffect = null)),
          Ei(t, rt.current),
          a)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), Ro(e, t, l, t.pendingProps));
      case 24:
        ta(t, Ke, e.memoizedState.cache);
    }
    return Yl(e, t, l);
  }
  function Zo(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps) Fe = !0;
      else {
        if (!nr(e, l) && (t.flags & 128) === 0) return ((Fe = !1), Tg(e, t, l));
        Fe = (e.flags & 131072) !== 0;
      }
    else ((Fe = !1), le && (t.flags & 1048576) !== 0 && jd(t, yi, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (((e = Qa(t.elementType)), (t.type = e), typeof e == "function"))
            ds(e)
              ? ((a = Fa(e, a)), (t.tag = 1), (t = qo(null, t, e, a, l)))
              : ((t.tag = 0), (t = $s(null, t, e, a, l)));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === D) {
                ((t.tag = 11), (t = Co(null, t, e, a, l)));
                break e;
              } else if (n === je) {
                ((t.tag = 14), (t = Do(null, t, e, a, l)));
                break e;
              } else if (n === ke) {
                ((t.tag = 10), (t.type = e), (t = Lo(null, t, l)));
                break e;
              }
            }
            throw ((t = fe(e) || e), Error(y(306, t, "")));
          }
        }
        return t;
      case 0:
        return $s(e, t, t.type, t.pendingProps, l);
      case 1:
        return ((a = t.type), (n = Fa(a, t.pendingProps)), qo(e, t, a, n, l));
      case 3:
        e: {
          if ((_a(t, t.stateNode.containerInfo), e === null)) throw Error(y(387));
          a = t.pendingProps;
          var u = t.memoizedState;
          ((n = u.element), Ns(e, t), Ti(t, a, null, l));
          var c = t.memoizedState;
          if (((a = c.cache), ta(t, Ke, a), a !== u.cache && xs(t, [Ke], l, !0), Ni(), (a = c.element), u.isDehydrated))
            if (
              ((u = { element: a, isDehydrated: !1, cache: c.cache }),
              (t.updateQueue.baseState = u),
              (t.memoizedState = u),
              t.flags & 256)
            ) {
              t = ko(e, t, a, l);
              break e;
            } else if (a !== n) {
              ((n = Pt(Error(y(424)), t)), xi(n), (t = ko(e, t, a, l)));
              break e;
            } else {
              switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (we = al(e.firstChild), at = t, le = !0, Il = null, tl = !0, l = wd(t, null, a, l), t.child = l; l;)
                ((l.flags = (l.flags & -3) | 134221824), (l = l.sibling));
            }
          else {
            if ((ka(), a === n)) {
              t = Yl(e, t, l);
              break e;
            }
            Pe(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          Dn(e, t),
          e === null
            ? (l = gm(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = l)
              : le || (t.stateNode = Jh(t.type, t.pendingProps, kt.current, t))
            : (t.memoizedState = gm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
          null
        );
      case 27:
        return (
          tn(t),
          e === null &&
            le &&
            ((a = t.stateNode = dm(t.type, t.pendingProps, kt.current)),
            (at = t),
            (tl = !0),
            (n = we),
            va(t.type) ? ((ef = n), (we = al(a.firstChild))) : (we = n)),
          Pe(e, t, t.pendingProps.children, l),
          Dn(e, t),
          e === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          e === null &&
            le &&
            ((n = a = we) &&
              ((a = bv(a, t.type, t.pendingProps, tl)),
              a !== null ? ((t.stateNode = a), (at = t), (we = al(a.firstChild)), (tl = !1), (n = !0)) : (n = !1)),
            n || ea(t)),
          tn(t),
          (n = t.type),
          (u = t.pendingProps),
          (c = e !== null ? e.memoizedProps : null),
          (a = u.children),
          Qr(n, u) ? (a = null) : c !== null && Qr(n, c) && (t.flags |= 32),
          t.memoizedState !== null && ((n = Ds(e, t, mg, null, null, l)), (Wn._currentValue = n)),
          Dn(e, t),
          Pe(e, t, a, l),
          t.child
        );
      case 6:
        return (
          e === null &&
            le &&
            ((e = l = we) &&
              ((l = jv(l, t.pendingProps, tl)),
              l !== null ? ((t.stateNode = l), (at = t), (we = null), (e = !0)) : (e = !1)),
            e || ea(t)),
          null
        );
      case 13:
        return Go(e, t, l);
      case 4:
        return (
          _a(t, t.stateNode.containerInfo),
          (a = t.pendingProps),
          e === null ? (t.child = Ka(t, null, a, l)) : Pe(e, t, a, l),
          t.child
        );
      case 11:
        return Co(e, t, t.type, t.pendingProps, l);
      case 7:
        return ((a = t.pendingProps), Dn(e, t), Pe(e, t, a, l), t.child);
      case 8:
        return (Pe(e, t, t.pendingProps.children, l), t.child);
      case 12:
        return (Pe(e, t, t.pendingProps.children, l), t.child);
      case 10:
        return Lo(e, t, l);
      case 9:
        return (
          (n = t.type._context),
          (a = t.pendingProps.children),
          Va(t),
          (n = ct(n)),
          (a = a(n)),
          (t.flags |= 1),
          Pe(e, t, a, l),
          t.child
        );
      case 14:
        return Do(e, t, t.type, t.pendingProps, l);
      case 15:
        return wo(e, t, t.type, t.pendingProps, l);
      case 19:
        return ar(e, t, l);
      case 31:
        return Sg(e, t, l);
      case 22:
        return Ro(e, t, l, t.pendingProps);
      case 24:
        return (
          Va(t),
          (a = ct(Ke)),
          e === null
            ? ((n = ps()),
              n === null &&
                ((n = Me),
                (u = bs()),
                (n.pooledCache = u),
                u.refCount++,
                u !== null && (n.pooledCacheLanes |= l),
                (n = u)),
              (t.memoizedState = { parent: a, cache: n }),
              Ss(t),
              ta(t, Ke, n))
            : ((e.lanes & l) !== 0 && (Ns(e, t), Ti(t, null, null, l), Ni()),
              (n = e.memoizedState),
              (u = t.memoizedState),
              n.parent !== a
                ? ((n = { parent: a, cache: a }),
                  (t.memoizedState = n),
                  t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n),
                  ta(t, Ke, a))
                : ((a = u.cache), ta(t, Ke, a), a !== n.cache && xs(t, [Ke], l, !0))),
          Pe(e, t, t.pendingProps.children, l),
          t.child
        );
      case 30:
        return (
          t.stateNode === null && (t.stateNode = { autoName: null, paired: null, clones: null, ref: null }),
          (a = t.pendingProps),
          a.name != null && a.name !== "auto" ? (t.flags |= e === null ? 18882560 : 18874368) : le && _u(t),
          e !== null && e.memoizedProps.name !== a.name ? (t.flags |= 4194816) : Dn(e, t),
          Pe(e, t, a.children, l),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(y(156, t.tag));
  }
  function Vl(e) {
    e.flags |= 4;
  }
  function ir(e, t, l, a, n) {
    var u;
    if (
      ((u = (e.mode & 32) !== 0) &&
        (u = l === null ? bm(t, a) : bm(t, a) && (a.src !== l.src || a.srcSet !== l.srcSet)),
      u)
    ) {
      if (((e.flags |= 16777216), (n & 335544128) === n))
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Th()) e.flags |= 8192;
        else throw ((Xa = Ru), zs);
    } else e.flags &= -16777217;
  }
  function Qo(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
    else if (((e.flags |= 16777216), !jm(t)))
      if (Th()) e.flags |= 8192;
      else throw ((Xa = Ru), zs);
  }
  function Iu(e, t) {
    (t !== null && (e.flags |= 4),
      e.flags & 16384 && ((t = e.tag !== 22 ? dn() : 536870912), (e.lanes |= t), (Bn |= t)));
  }
  function Ci(e, t) {
    if (!le)
      switch (e.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var l = e.tail, a = null; l !== null;) (l.alternate !== null && (a = l), (l = l.sibling));
          a === null ? (t || e.tail === null ? (e.tail = null) : (e.tail.sibling = null)) : (a.sibling = null);
          break;
        default:
          for (t = e.tail, l = null; t !== null;) (t.alternate !== null && (l = t), (t = t.sibling));
          l === null ? (e.tail = null) : (l.sibling = null);
      }
  }
  function Re(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      l = 0,
      a = 0;
    if (t)
      for (var n = e.child; n !== null;)
        ((l |= n.lanes | n.childLanes),
          (a |= n.subtreeFlags & 1206910976),
          (a |= n.flags & 1206910976),
          (n.return = e),
          (n = n.sibling));
    else
      for (n = e.child; n !== null;)
        ((l |= n.lanes | n.childLanes), (a |= n.subtreeFlags), (a |= n.flags), (n.return = e), (n = n.sibling));
    return ((e.subtreeFlags |= a), (e.childLanes = l), t);
  }
  function Eg(e, t, l) {
    var a = t.pendingProps;
    switch ((ms(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Re(t), null);
      case 1:
        return (Re(t), null);
      case 3:
        return (
          (l = t.stateNode),
          (a = null),
          e !== null && (a = e.memoizedState.cache),
          t.memoizedState.cache !== a && (t.flags |= 2048),
          ql(Ke),
          Al(),
          l.pendingContext && ((l.context = l.pendingContext), (l.pendingContext = null)),
          (e === null || e.child === null) &&
            (Tn(t)
              ? Vl(t)
              : e === null || (e.memoizedState.isDehydrated && (t.flags & 256) === 0) || ((t.flags |= 1024), vs())),
          Re(t),
          null
        );
      case 26:
        var n = t.type,
          u = t.memoizedState;
        return (
          e === null
            ? (Vl(t), u !== null ? (Re(t), Qo(t, u)) : (Re(t), ir(t, n, null, a, l)))
            : u
              ? u !== e.memoizedState
                ? (Vl(t), Re(t), Qo(t, u))
                : (Re(t), (t.flags &= -16777217))
              : ((e = e.memoizedProps), e !== a && Vl(t), Re(t), ir(t, n, e, a, l)),
          null
        );
      case 27:
        if ((ln(t), (l = kt.current), (n = t.type), e !== null && t.stateNode != null)) e.memoizedProps !== a && Vl(t);
        else {
          if (!a) {
            if (t.stateNode === null) throw Error(y(166));
            return (Re(t), (t.subtreeFlags &= -33554433), null);
          }
          ((e = qt.current), Tn(t) ? zd(t) : ((e = dm(n, a, l)), (t.stateNode = e), Vl(t)));
        }
        return (Re(t), (t.subtreeFlags &= -33554433), null);
      case 5:
        if ((ln(t), (n = t.type), e !== null && t.stateNode != null)) e.memoizedProps !== a && Vl(t);
        else {
          if (!a) {
            if (t.stateNode === null) throw Error(y(166));
            return (Re(t), (t.subtreeFlags &= -33554433), null);
          }
          if (((u = qt.current), Tn(t))) zd(t);
          else {
            var c = Vi(kt.current);
            switch (u) {
              case 1:
                u = c.createElementNS("http://www.w3.org/2000/svg", n);
                break;
              case 2:
                u = c.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                break;
              default:
                switch (n) {
                  case "svg":
                    u = c.createElementNS("http://www.w3.org/2000/svg", n);
                    break;
                  case "math":
                    u = c.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                    break;
                  case "script":
                    ((u = c.createElement("div")),
                      (u.innerHTML = "<script><\/script>"),
                      (u = u.removeChild(u.firstChild)));
                    break;
                  case "select":
                    ((u =
                      typeof a.is == "string" ? c.createElement("select", { is: a.is }) : c.createElement("select")),
                      a.multiple ? (u.multiple = !0) : a.size && (u.size = a.size));
                    break;
                  default:
                    u = typeof a.is == "string" ? c.createElement(n, { is: a.is }) : c.createElement(n);
                }
            }
            ((u[$e] = t), (u[gt] = a));
            e: for (c = t.child; c !== null;) {
              if (c.tag === 5 || c.tag === 6) u.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                ((c.child.return = c), (c = c.child));
                continue;
              }
              if (c === t) break e;
              for (; c.sibling === null;) {
                if (c.return === null || c.return === t) break e;
                c = c.return;
              }
              ((c.sibling.return = c.return), (c = c.sibling));
            }
            t.stateNode = u;
            e: switch ((dt(u, n, a), n)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break e;
              case "img":
                a = !0;
                break e;
              default:
                a = !1;
            }
            a && Vl(t);
          }
        }
        return (
          Re(t),
          (t.subtreeFlags &= -33554433),
          ir(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, l),
          null
        );
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== a && Vl(t);
        else {
          if (typeof a != "string" && t.stateNode === null) throw Error(y(166));
          if (((e = kt.current), Tn(t))) {
            if (((e = t.stateNode), (l = t.memoizedProps), (a = null), (n = at), n !== null))
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            ((e[$e] = t),
              (e = !!(e.nodeValue === l || (a !== null && a.suppressHydrationWarning === !0) || Zh(e.nodeValue, l))),
              e || ea(t, !0));
          } else ((e = Vi(e).createTextNode(a)), (e[$e] = t), (t.stateNode = e));
        }
        return (Re(t), null);
      case 31:
        if (((l = t.memoizedState), e === null || e.memoizedState !== null)) {
          if (((a = Tn(t)), l !== null)) {
            if (e === null) {
              if (!a) throw Error(y(318));
              if (((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(y(557));
              e[$e] = t;
            } else (ka(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (Re(t), (e = !1));
          } else
            ((l = vs()), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), (e = !0));
          if (!e) return t.flags & 256 ? (Vt(t), t) : (Vt(t), null);
          if ((t.flags & 128) !== 0) throw Error(y(558));
        }
        return (Re(t), null);
      case 13:
        if (((a = t.memoizedState), e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))) {
          if (((n = Tn(t)), a !== null && a.dehydrated !== null)) {
            if (e === null) {
              if (!n) throw Error(y(318));
              if (((n = t.memoizedState), (n = n !== null ? n.dehydrated : null), !n)) throw Error(y(317));
              n[$e] = t;
            } else (ka(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (Re(t), (n = !1));
          } else
            ((n = vs()), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), (n = !0));
          if (!n) return t.flags & 256 ? (Vt(t), t) : (Vt(t), null);
        }
        return (
          Vt(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = l), t)
            : ((l = a !== null),
              (e = e !== null && e.memoizedState !== null),
              l &&
                ((a = t.child),
                (n = null),
                a.alternate !== null &&
                  a.alternate.memoizedState !== null &&
                  a.alternate.memoizedState.cachePool !== null &&
                  (n = a.alternate.memoizedState.cachePool.pool),
                (u = null),
                a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool),
                u !== n && (a.flags |= 2048)),
              l !== e && l && (t.child.flags |= 8192),
              Iu(t, t.updateQueue),
              Re(t),
              null)
        );
      case 4:
        return (Al(), e === null && Gr(t.stateNode.containerInfo), (t.flags |= 67108864), Re(t), null);
      case 10:
        return (ql(t.type), Re(t), null);
      case 19:
        if ((Ms(t), (a = t.memoizedState), a === null)) return (Re(t), null);
        if (((n = (t.flags & 128) !== 0), (u = a.rendering), u === null))
          if (n) Ci(a, !1);
          else {
            if (Ye !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null;) {
                if (((u = qu(e)), u !== null)) {
                  for (
                    t.flags |= 128,
                      Ci(a, !1),
                      e = u.updateQueue,
                      t.updateQueue = e,
                      Iu(t, e),
                      t.subtreeFlags = 0,
                      e = l,
                      l = t.child;
                    l !== null;
                  )
                    (yd(l, e), (l = l.sibling));
                  return (Ei(t, (rt.current & 1) | 2), le && Ul(t, a.treeForkCount), t.child);
                }
                e = e.sibling;
              }
            a.tail !== null && et() > dc && ((t.flags |= 128), (n = !0), Ci(a, !1), (t.lanes = 4194304));
          }
        else {
          if (!n)
            if (((e = qu(u)), e !== null)) {
              if (
                ((t.flags |= 128),
                (n = !0),
                (e = e.updateQueue),
                (t.updateQueue = e),
                Iu(t, e),
                Ci(a, !0),
                a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !u.alternate && !le)
              )
                return (Re(t), null);
            } else
              2 * et() - a.renderingStartTime > dc &&
                l !== 536870912 &&
                ((t.flags |= 128), (n = !0), Ci(a, !1), (t.lanes = 4194304));
          a.isBackwards
            ? ((u.sibling = t.child), (t.child = u))
            : ((e = a.last), e !== null ? (e.sibling = u) : (t.child = u), (a.last = u));
        }
        if (a.tail !== null) {
          e = a.tail;
          e: {
            for (l = e; l !== null;) {
              if (l.alternate !== null) {
                l = !1;
                break e;
              }
              l = l.sibling;
            }
            l = !0;
          }
          return (
            (a.rendering = e),
            (a.tail = e.sibling),
            (a.renderingStartTime = et()),
            (e.sibling = null),
            (u = rt.current),
            (u = n ? (u & 1) | 2 : u & 1),
            a.tailMode === "visible" || a.tailMode === "collapsed" || !l || le
              ? Ei(t, u)
              : ((l = u), pe(st, t), pe(rt, l), xt === null && (xt = t)),
            le && Ul(t, a.treeForkCount),
            e
          );
        }
        return (Re(t), null);
      case 22:
      case 23:
        return (
          Vt(t),
          As(),
          (a = t.memoizedState !== null),
          e !== null ? (e.memoizedState !== null) !== a && (t.flags |= 8192) : a && (t.flags |= 8192),
          a
            ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Re(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : Re(t),
          (l = t.updateQueue),
          l !== null && Iu(t, l.retryQueue),
          (l = null),
          e !== null &&
            e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (l = e.memoizedState.cachePool.pool),
          (a = null),
          t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool),
          a !== l && (t.flags |= 2048),
          e !== null && Xe(Za),
          null
        );
      case 24:
        return (
          (l = null),
          e !== null && (l = e.memoizedState.cache),
          t.memoizedState.cache !== l && (t.flags |= 2048),
          ql(Ke),
          Re(t),
          null
        );
      case 25:
        return null;
      case 30:
        return ((t.flags |= 33554432), Re(t), null);
    }
    throw Error(y(156, t.tag));
  }
  function _g(e, t) {
    switch ((ms(t), t.tag)) {
      case 1:
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 3:
        return (
          ql(Ke),
          Al(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 26:
      case 27:
      case 5:
        return (ln(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((Vt(t), t.alternate === null)) throw Error(y(340));
          ka();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 13:
        if ((Vt(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
          if (t.alternate === null) throw Error(y(340));
          ka();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 19:
        return (
          Ms(t),
          (e = t.flags),
          e & 65536
            ? ((t.flags = (e & -65537) | 128),
              (e = t.memoizedState),
              e !== null && ((e.rendering = null), (e.tail = null)),
              (t.flags |= 4),
              t)
            : null
        );
      case 4:
        return (Al(), null);
      case 10:
        return (ql(t.type), null);
      case 22:
      case 23:
        return (
          Vt(t),
          As(),
          e !== null && Xe(Za),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 24:
        return (ql(Ke), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Xo(e, t) {
    switch ((ms(t), t.tag)) {
      case 3:
        (ql(Ke), Al());
        break;
      case 26:
      case 27:
      case 5:
        ln(t);
        break;
      case 4:
        Al();
        break;
      case 31:
        t.memoizedState !== null && Vt(t);
        break;
      case 13:
        Vt(t);
        break;
      case 19:
        Ms(t);
        break;
      case 10:
        ql(t.type);
        break;
      case 22:
      case 23:
        (Vt(t), As(), e !== null && Xe(Za));
        break;
      case 24:
        ql(Ke);
    }
  }
  function Di(e, t) {
    try {
      var l = t.updateQueue,
        a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var u = l.create,
              c = l.inst;
            ((a = u()), (c.destroy = a));
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (s) {
      _e(t, t.return, s);
    }
  }
  function ra(e, t, l) {
    try {
      var a = t.updateQueue,
        n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & e) === e) {
            var c = a.inst,
              s = c.destroy;
            if (s !== void 0) {
              ((c.destroy = void 0), (n = t));
              var r = l,
                g = s;
              try {
                g();
              } catch (j) {
                _e(n, r, j);
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (j) {
      _e(t, t.return, j);
    }
  }
  function Ko(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Hd(t, l);
      } catch (a) {
        _e(e, e.return, a);
      }
    }
  }
  function Jo(e, t, l) {
    ((l.props = Fa(e.type, e.memoizedProps)), (l.state = e.memoizedState));
    try {
      l.componentWillUnmount();
    } catch (a) {
      _e(e, t, a);
    }
  }
  function jl(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            var n = e.stateNode,
              u = wl(e.memoizedProps, n);
            ((n.ref === null || n.ref.name !== u) && (n.ref = tm(u)), (a = n.ref));
            break;
          case 7:
            if (e.stateNode === null) {
              var c = new Kt(e);
              (p(e.child, !1, yv, c, void 0, void 0), (e.stateNode = c));
            }
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof l == "function" ? (e.refCleanup = l(a)) : (l.current = a);
      }
    } catch (s) {
      _e(e, t, s);
    }
  }
  function ft(e, t) {
    var l = e.ref,
      a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          _e(e, t, n);
        } finally {
          ((e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null));
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          _e(e, t, n);
        }
      else l.current = null;
  }
  function ec(e, t) {
    if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null)
      for (var l = 0; l < t.length; l++) cm(e.stateNode, t[l]);
  }
  function Fo(e) {
    for (var t = e.return; t !== null && (cr(t) && cm(e.stateNode, t.stateNode), !ur(t));) t = t.return;
  }
  function wi(e) {
    for (var t = e.return; t !== null && (cr(t) && xv(e.stateNode, t.stateNode), !ur(t));) t = t.return;
  }
  function ur(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 27;
  }
  function cr(e) {
    return e && e.tag === 7 && e.stateNode !== null;
  }
  function sr(e) {
    var t = e.type,
      l = e.memoizedProps,
      a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break e;
        case "img":
          l.src ? (a.src = l.src) : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      _e(e, e.return, n);
    }
  }
  function rr(e, t, l) {
    try {
      var a = e.stateNode;
      (Ig(a, e.type, l, t), (a[gt] = t));
    } catch (n) {
      _e(e, e.return, n);
    }
  }
  function Wo(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && va(e.type)) || e.tag === 4;
  }
  function fr(e) {
    e: for (;;) {
      for (; e.sibling === null;) {
        if (e.return === null || Wo(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
        if ((e.tag === 27 && va(e.type)) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function dr(e, t, l, a) {
    var n = e.tag;
    if (n === 5 || n === 6)
      ((n = e.stateNode),
        t
          ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(n, t)
          : ((t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l),
            t.appendChild(n),
            (l = l._reactRootContainer),
            l != null || t.onclick !== null || (t.onclick = yl)),
        ec(e, a),
        (xe = !0));
    else if (
      n !== 4 &&
      (n === 27 && (ec(e, a), (a = null), va(e.type) && ((l = e.stateNode), (t = null))), (e = e.child), e !== null)
    )
      for (dr(e, t, l, a), e = e.sibling; e !== null;) (dr(e, t, l, a), (e = e.sibling));
  }
  function tc(e, t, l, a) {
    var n = e.tag;
    if (n === 5 || n === 6) ((n = e.stateNode), t ? l.insertBefore(n, t) : l.appendChild(n), ec(e, a), (xe = !0));
    else if (
      n !== 4 &&
      (n === 27 && (ec(e, a), (a = null), va(e.type) && (l = e.stateNode)), (e = e.child), e !== null)
    )
      for (tc(e, t, l, a), e = e.sibling; e !== null;) (tc(e, t, l, a), (e = e.sibling));
  }
  function $o(e) {
    var t = e.stateNode,
      l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length;) t.removeAttributeNode(n[0]);
      (dt(t, a, l), (t[$e] = e), (t[gt] = l));
    } catch (u) {
      _e(e, e.return, u);
    }
  }
  var lc = !1,
    Lt = null;
  function Po(e) {
    (e.tag === 30 || (e.subtreeFlags & 33554432) !== 0) && (lc = !0);
  }
  var pl = null;
  function Io() {
    var e = pl;
    return ((pl = null), e);
  }
  var wt = 0;
  function wn(e, t, l, a, n) {
    return ((wt = 0), eh(e.child, t, l, a, n));
  }
  function eh(e, t, l, a, n) {
    for (var u = !1; e !== null;) {
      if (e.tag === 5) {
        var c = e.stateNode;
        if (a !== null) {
          var s = Jr(c);
          (a.push(s), s.view && (u = !0));
        } else u || (Jr(c).view && (u = !0));
        ((lc = !0), Ih(c, wt === 0 ? t : t + "_" + wt, l), wt++);
      } else
        (e.tag !== 22 || e.memoizedState === null) && ((e.tag === 30 && n) || (eh(e.child, t, l, a, n) && (u = !0)));
      e = e.sibling;
    }
    return u;
  }
  function zl(e, t) {
    for (; e !== null;)
      (e.tag === 5
        ? em(e.stateNode, e.memoizedProps)
        : (e.tag !== 22 || e.memoizedState === null) && ((e.tag === 30 && t) || zl(e.child, t)),
        (e = e.sibling));
  }
  function ac(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null;) {
        if (
          (e.tag !== 22 || e.memoizedState === null) &&
          (ac(e), e.tag === 30 && (e.flags & 18874368) !== 0 && e.stateNode.paired)
        ) {
          var t = e.memoizedProps;
          if (t.name == null || t.name === "auto") throw Error(y(544));
          var l = t.name;
          ((t = Rl(t.default, t.share)), t !== "none" && (wn(e, l, t, null, !1) || zl(e.child, !1)));
        }
        e = e.sibling;
      }
  }
  function or(e, t) {
    if (e.tag === 30) {
      var l = e.stateNode,
        a = e.memoizedProps,
        n = wl(a, l),
        u = Rl(a.default, l.paired ? a.share : a.enter);
      u !== "none" ? (wn(e, n, u, null, !1) ? (ac(e), l.paired || t || Yn(e, a.onEnter)) : zl(e.child, !1)) : ac(e);
    } else if ((e.subtreeFlags & 33554432) !== 0) for (e = e.child; e !== null;) (or(e, t), (e = e.sibling));
    else ac(e);
  }
  function hr(e) {
    if (Lt !== null && Lt.size !== 0) {
      var t = Lt;
      if ((e.subtreeFlags & 18874368) !== 0)
        for (e = e.child; e !== null;) {
          if (e.tag !== 22 || e.memoizedState === null) {
            if (e.tag === 30 && (e.flags & 18874368) !== 0) {
              var l = e.memoizedProps,
                a = l.name;
              if (a != null && a !== "auto") {
                var n = t.get(a);
                if (n !== void 0) {
                  var u = Rl(l.default, l.share);
                  if (
                    (u !== "none" &&
                      (wn(e, a, u, null, !1)
                        ? ((u = e.stateNode), (n.paired = u), (u.paired = n), Yn(e, l.onShare))
                        : zl(e.child, !1)),
                    t.delete(a),
                    t.size === 0)
                  )
                    break;
                }
              }
            }
            hr(e);
          }
          e = e.sibling;
        }
    }
  }
  function mr(e) {
    if (e.tag === 30) {
      var t = e.memoizedProps,
        l = wl(t, e.stateNode),
        a = Lt !== null ? Lt.get(l) : void 0,
        n = Rl(t.default, a !== void 0 ? t.share : t.exit);
      (n !== "none" &&
        (wn(e, l, n, null, !1)
          ? a !== void 0
            ? ((n = e.stateNode), (a.paired = n), (n.paired = a), Lt.delete(l), Yn(e, t.onShare))
            : Yn(e, t.onExit)
          : zl(e.child, !1)),
        Lt !== null && hr(e));
    } else if ((e.subtreeFlags & 33554432) !== 0) for (e = e.child; e !== null;) (mr(e), (e = e.sibling));
    else Lt !== null && hr(e);
  }
  function th(e) {
    for (e = e.child; e !== null;) {
      if (e.tag === 30) {
        var t = e.memoizedProps,
          l = wl(t, e.stateNode);
        ((t = Rl(t.default, t.update)), (e.flags &= -5), t !== "none" && wn(e, l, t, (e.memoizedState = []), !1));
      } else (e.subtreeFlags & 33554432) !== 0 && th(e);
      e = e.sibling;
    }
  }
  function gr(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null;) {
        if (e.tag !== 22 || e.memoizedState === null) {
          if (e.tag === 30 && (e.flags & 18874368) !== 0) {
            var t = e.stateNode;
            t.paired !== null && ((t.paired = null), zl(e.child, !1));
          }
          gr(e);
        }
        e = e.sibling;
      }
  }
  function nc(e) {
    if (e.tag === 30) ((e.stateNode.paired = null), zl(e.child, !1), gr(e));
    else if ((e.subtreeFlags & 33554432) !== 0) for (e = e.child; e !== null;) (nc(e), (e = e.sibling));
    else gr(e);
  }
  function lh(e) {
    for (e = e.child; e !== null;)
      (e.tag === 30 ? zl(e.child, !1) : (e.subtreeFlags & 33554432) !== 0 && lh(e), (e = e.sibling));
  }
  function vr(e, t, l, a, n, u, c) {
    for (var s = !1; t !== null;) {
      if (t.tag === 5) {
        var r = t.stateNode;
        if (u !== null && wt < u.length) {
          var g = u[wt],
            j = Jr(r);
          (g.view || j.view) && (s = !0);
          var S;
          if ((S = (e.flags & 4) === 0))
            if (j.clip) S = !0;
            else {
              S = g.rect;
              var h = j.rect;
              S = S.y !== h.y || S.x !== h.x || S.height !== h.height || S.width !== h.width;
            }
          (S && (e.flags |= 4),
            j.abs ? (j = !g.abs) : ((g = g.rect), (j = j.rect), (j = g.height !== j.height || g.width !== j.width)),
            j && (e.flags |= 32));
        } else e.flags |= 32;
        ((e.flags & 4) !== 0 && Ih(r, wt === 0 ? l : l + "_" + wt, n),
          (s && (e.flags & 4) !== 0) ||
            (pl === null && (pl = []), pl.push(r, wt === 0 ? a : a + "_" + wt, t.memoizedProps)),
          wt++);
      } else
        (t.tag !== 22 || t.memoizedState === null) &&
          (t.tag === 30 && c ? (e.flags |= t.flags & 32) : vr(e, t.child, l, a, n, u, c) && (s = !0));
      t = t.sibling;
    }
    return s;
  }
  function ah(e, t) {
    for (e = e.child; e !== null;) {
      if (e.tag === 30) {
        var l = e.memoizedProps,
          a = e.stateNode,
          n = wl(l, a),
          u = Rl(l.default, l.update),
          c;
        ((c = e.memoizedState), (e.memoizedState = null), (a = e));
        var s = e.child;
        ((wt = 0), (n = vr(a, s, n, n, u, c, !1)), (e.flags & 4) !== 0 && n && Yn(e, l.onUpdate));
      } else (e.subtreeFlags & 33554432) !== 0 && ah(e);
      e = e.sibling;
    }
  }
  var nt = !1,
    ze = !1,
    Sl = !1,
    yr = !1,
    nh = typeof WeakSet == "function" ? WeakSet : Set,
    it = null,
    Nl = !1,
    Ri = !1,
    ic = !1,
    xr = !1;
  function Ag(e, t, l) {
    if (((e = e.containerInfo), (Lr = $n), (e = cd(e)), ns(e))) {
      if ("selectionStart" in e) var a = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          a = ((a = e.ownerDocument) && a.defaultView) || window;
          var n = a.getSelection && a.getSelection();
          if (n && n.rangeCount !== 0) {
            a = n.anchorNode;
            var u = n.anchorOffset,
              c = n.focusNode;
            n = n.focusOffset;
            try {
              (a.nodeType, c.nodeType);
            } catch {
              a = null;
              break e;
            }
            var s = 0,
              r = -1,
              g = -1,
              j = 0,
              S = 0,
              h = e,
              b = null;
            t: for (;;) {
              for (
                var M;
                h !== a || (u !== 0 && h.nodeType !== 3) || (r = s + u),
                  h !== c || (n !== 0 && h.nodeType !== 3) || (g = s + n),
                  h.nodeType === 3 && (s += h.nodeValue.length),
                  (M = h.firstChild) !== null;
              )
                ((b = h), (h = M));
              for (;;) {
                if (h === e) break t;
                if ((b === a && ++j === u && (r = s), b === c && ++S === n && (g = s), (M = h.nextSibling) !== null))
                  break;
                ((h = b), (b = h.parentNode));
              }
              h = M;
            }
            a = r === -1 || g === -1 ? null : { start: r, end: g };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (
      Zr = { focusedElem: e, selectionRange: a }, $n = !1, l = (l & 335544064) === l, it = t, t = l ? 9270 : 1024;
      it !== null;
    ) {
      if (((e = it), l && ((a = e.deletions), a !== null))) for (u = 0; u < a.length; u++) l && mr(a[u]);
      if (e.alternate === null && (e.flags & 2) !== 0) (l && Po(e), uc(l));
      else {
        if (e.tag === 22) {
          if (((a = e.alternate), e.memoizedState !== null)) {
            (a !== null && a.memoizedState === null && l && mr(a), uc(l));
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            (l && Po(e), uc(l));
            continue;
          }
        }
        ((a = e.child), (e.subtreeFlags & t) !== 0 && a !== null ? ((a.return = e), (it = a)) : (l && th(e), uc(l)));
      }
    }
    Lt = null;
  }
  function uc(e) {
    for (; it !== null;) {
      var t = it,
        l = e,
        a = t.alternate,
        n = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((n & 1024) !== 0 && a !== null) {
            ((l = void 0), (n = a.memoizedProps), (a = a.memoizedState));
            var u = t.stateNode;
            try {
              var c = Fa(t.type, n);
              ((l = u.getSnapshotBeforeUpdate(c, a)), (u.__reactInternalSnapshotBeforeUpdate = l));
            } catch (s) {
              _e(t, t.return, s);
            }
          }
          break;
        case 3:
          if ((n & 1024) !== 0) {
            if (((a = t.stateNode.containerInfo), (l = a.nodeType), l === 9)) $r(a);
            else if (l === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  $r(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          l &&
            a !== null &&
            ((l = wl(a.memoizedProps, a.stateNode)),
            (n = t.memoizedProps),
            (n = Rl(n.default, n.update)),
            n !== "none" && wn(a, l, n, (a.memoizedState = []), !0));
          break;
        default:
          if ((n & 1024) !== 0) throw Error(y(163));
      }
      if (((a = t.sibling), a !== null)) {
        ((a.return = t.return), (it = a));
        break;
      }
      it = t.return;
    }
  }
  function ih(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (Tl(e, l), a & 4 && Di(5, l));
        break;
      case 1:
        if ((Tl(e, l), a & 4))
          if (((e = l.stateNode), t === null))
            try {
              e.componentDidMount();
            } catch (c) {
              _e(l, l.return, c);
            }
          else {
            var n = Fa(l.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(n, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (c) {
              _e(l, l.return, c);
            }
          }
        (a & 64 && Ko(l), a & 512 && jl(l, l.return));
        break;
      case 3:
        if ((Tl(e, l), a & 64 && ((e = l.updateQueue), e !== null))) {
          if (((t = null), l.child !== null))
            switch (l.child.tag) {
              case 27:
              case 5:
                t = l.child.stateNode;
                break;
              case 1:
                t = l.child.stateNode;
            }
          try {
            Hd(e, t);
          } catch (c) {
            _e(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && $o(l);
      case 26:
      case 5:
        (Tl(e, l), t === null && a & 4 && sr(l), a & 512 && jl(l, l.return));
        break;
      case 12:
        Tl(e, l);
        break;
      case 31:
        (Tl(e, l), a & 4 && rh(e, l));
        break;
      case 13:
        (Tl(e, l),
          a & 4 && fh(e, l),
          a & 64 &&
            ((e = l.memoizedState),
            e !== null && ((e = e.dehydrated), e !== null && ((l = Gg.bind(null, l)), pv(e, l)))));
        break;
      case 22:
        if (((a = l.memoizedState !== null || nt), !a)) {
          var u = (t !== null && t.memoizedState !== null) || ze;
          ((t = nt),
            (n = ze),
            (nt = a),
            (ze = u) && !n ? ((a = 2), (l.subtreeFlags & 8772) !== 0 && (a |= 1), ol(e, l, a)) : Tl(e, l),
            (nt = t),
            (ze = n));
        }
        break;
      case 30:
        (Tl(e, l), a & 512 && jl(l, l.return));
        break;
      case 7:
        a & 512 && jl(l, l.return);
      default:
        Tl(e, l);
    }
  }
  function br(e, t) {
    for (e = e.child; e !== null;) (uh(e, t), (e = e.sibling));
  }
  function uh(e, t) {
    switch (e.tag) {
      case 5:
      case 26:
        try {
          var l = e.stateNode;
          if (t) {
            var a = l.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : (a.display = "none");
          } else {
            var n = e.stateNode,
              u = e.memoizedProps.style,
              c = u != null && u.hasOwnProperty("display") ? u.display : null;
            n.style.display = c == null || typeof c == "boolean" ? "" : ("" + c).trim();
          }
        } catch (r) {
          _e(e, e.return, r);
        }
        jr(e, t);
        break;
      case 6:
        try {
          ((e.stateNode.nodeValue = t ? "" : e.memoizedProps), (xe = !0));
        } catch (r) {
          _e(e, e.return, r);
        }
        break;
      case 18:
        try {
          var s = e.stateNode;
          t ? Ph(s, !0) : Ph(e.stateNode, !1);
        } catch (r) {
          _e(e, e.return, r);
        }
        break;
      case 22:
      case 23:
        e.memoizedState === null && br(e, t);
        break;
      default:
        br(e, t);
    }
  }
  function jr(e, t) {
    if (e.subtreeFlags & 67108864)
      for (e = e.child; e !== null;) {
        e: {
          var l = e,
            a = t;
          switch (l.tag) {
            case 4:
              uh(l, a);
              break e;
            case 22:
              l.memoizedState === null && jr(l, a);
              break e;
            default:
              jr(l, a);
          }
        }
        e = e.sibling;
      }
  }
  function ch(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), ch(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && vt(t)),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  var Be = null,
    Rt = !1;
  function fl(e, t, l) {
    for (l = l.child; l !== null;) (sh(e, t, l), (l = l.sibling));
  }
  function sh(e, t, l) {
    if (mt && typeof mt.onCommitFiberUnmount == "function")
      try {
        mt.onCommitFiberUnmount(Ca, l);
      } catch {}
    switch (l.tag) {
      case 26:
        (ze || ft(l, t),
          fl(e, t, l),
          l.memoizedState
            ? l.memoizedState.count--
            : l.stateNode && !ze && ((l = l.stateNode), l.parentNode.removeChild(l)));
        break;
      case 27:
        (ze || ft(l, t), wi(l));
        var a = Be,
          n = Rt;
        (va(l.type) && ((Be = l.stateNode), (Rt = !1)),
          fl(e, t, l),
          om(l.stateNode, l.type, l.memoizedProps),
          (Be = a),
          (Rt = n));
        break;
      case 5:
        (ze || ft(l, t), wi(l));
      case 6:
        if ((l.tag === 6 && wi(l), (a = Be), (n = Rt), (Be = null), fl(e, t, l), (Be = a), (Rt = n), Be !== null))
          if (Rt)
            try {
              ((Be.nodeType === 9 ? Be.body : Be.nodeName === "HTML" ? Be.ownerDocument.body : Be).removeChild(
                l.stateNode,
              ),
                (xe = !0));
            } catch (u) {
              _e(l, t, u);
            }
          else
            try {
              (Be.removeChild(l.stateNode), (xe = !0));
            } catch (u) {
              _e(l, t, u);
            }
        break;
      case 18:
        Be !== null &&
          (Rt
            ? ((e = Be),
              $h(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, l.stateNode),
              Pn(e))
            : $h(Be, l.stateNode));
        break;
      case 4:
        ((a = Be), (n = Rt), (Be = l.stateNode.containerInfo), (Rt = !0), fl(e, t, l), (Be = a), (Rt = n));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (ra(2, l, t), ze || ra(4, l, t), fl(e, t, l));
        break;
      case 1:
        (ze || (ft(l, t), (a = l.stateNode), typeof a.componentWillUnmount == "function" && Jo(l, t, a)), fl(e, t, l));
        break;
      case 21:
        fl(e, t, l);
        break;
      case 22:
        ((ze = (a = ze) || l.memoizedState !== null), fl(e, t, l), (ze = a));
        break;
      case 30:
        (ft(l, t), fl(e, t, l));
        break;
      case 7:
        (ze || ft(l, t), fl(e, t, l));
        break;
      default:
        fl(e, t, l);
    }
  }
  function rh(e, t) {
    if (t.memoizedState === null && ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))) {
      e = e.dehydrated;
      try {
        Pn(e);
      } catch (l) {
        _e(t, t.return, l);
      }
    }
  }
  function fh(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        Pn(e);
      } catch (l) {
        _e(t, t.return, l);
      }
  }
  function Og(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return (t === null && (t = e.stateNode = new nh()), t);
      case 22:
        return ((e = e.stateNode), (t = e._retryCache), t === null && (t = e._retryCache = new nh()), t);
      default:
        throw Error(y(435, e.tag));
    }
  }
  function cc(e, t) {
    var l = Og(e);
    t.forEach(function (a) {
      if (!l.has(a)) {
        l.add(a);
        var n = Yg.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function Et(e, t, l) {
    var a = t.deletions;
    if (a !== null)
      for (var n = 0; n < a.length; n++) {
        var u = a[n],
          c = e,
          s = t,
          r = s;
        e: for (; r !== null;) {
          switch (r.tag) {
            case 27:
              if (va(r.type)) {
                ((Be = r.stateNode), (Rt = !1));
                break e;
              }
              break;
            case 5:
              ((Be = r.stateNode), (Rt = !1));
              break e;
            case 3:
            case 4:
              ((Be = r.stateNode.containerInfo), (Rt = !0));
              break e;
          }
          r = r.return;
        }
        if (Be === null) throw Error(y(160));
        (sh(c, s, u), (Be = null), (Rt = !1), (c = u.alternate), c !== null && (c.return = null), (u.return = null));
      }
    if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) (dh(t, e, l), (t = t.sibling));
  }
  var dl = null;
  function dh(e, t, l) {
    var a = e.alternate,
      n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (n & 4 && ((a = e.updateQueue), (a = a !== null ? a.events : null), a !== null))
          for (var u = 0; u < a.length; u++) {
            var c = a[u];
            c.ref.impl = c.nextImpl;
          }
        (Et(t, e, l), _t(e), n & 4 && (ra(3, e, e.return), Di(3, e), ra(5, e, e.return)));
        break;
      case 1:
        (Et(t, e, l),
          _t(e),
          n & 512 && (ze || a === null || ft(a, a.return)),
          n & 64 &&
            nt &&
            ((e = e.updateQueue),
            e !== null &&
              ((t = e.callbacks),
              t !== null &&
                ((l = e.shared.hiddenCallbacks), (e.shared.hiddenCallbacks = l === null ? t : l.concat(t))))));
        break;
      case 26:
        if (((u = dl), Et(t, e, l), _t(e), n & 512 && (ze || a === null || ft(a, a.return)), n & 4))
          if (((n = a !== null ? a.memoizedState : null), (l = e.memoizedState), a === null))
            if (l === null)
              if (e.stateNode === null)
                if (nt) e.stateNode = Jh(e.type, e.memoizedProps, t.containerInfo, e);
                else {
                  e: {
                    ((t = e.type), (l = e.memoizedProps), (n = u.ownerDocument || u));
                    t: switch (t) {
                      case "title":
                        ((a = n.getElementsByTagName("title")[0]),
                          (!a ||
                            a[De] ||
                            a[$e] ||
                            a.namespaceURI === "http://www.w3.org/2000/svg" ||
                            a.hasAttribute("itemprop")) &&
                            ((a = n.createElement(t)), n.head.insertBefore(a, n.querySelector("head > title"))),
                          dt(a, t, l),
                          (a[$e] = e),
                          lt(a),
                          (t = a));
                        break e;
                      case "link":
                        if ((u = xm("link", "href", n).get(t + (l.href || "")))) {
                          for (c = 0; c < u.length; c++)
                            if (
                              ((a = u[c]),
                              a.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) &&
                                a.getAttribute("rel") === (l.rel == null ? null : l.rel) &&
                                a.getAttribute("title") === (l.title == null ? null : l.title) &&
                                a.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin))
                            ) {
                              u.splice(c, 1);
                              break t;
                            }
                        }
                        ((a = n.createElement(t)), dt(a, t, l), n.head.appendChild(a));
                        break;
                      case "meta":
                        if ((u = xm("meta", "content", n).get(t + (l.content || "")))) {
                          for (c = 0; c < u.length; c++)
                            if (
                              ((a = u[c]),
                              a.getAttribute("content") === (l.content == null ? null : "" + l.content) &&
                                a.getAttribute("name") === (l.name == null ? null : l.name) &&
                                a.getAttribute("property") === (l.property == null ? null : l.property) &&
                                a.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) &&
                                a.getAttribute("charset") === (l.charSet == null ? null : l.charSet))
                            ) {
                              u.splice(c, 1);
                              break t;
                            }
                        }
                        ((a = n.createElement(t)), dt(a, t, l), n.head.appendChild(a));
                        break;
                      default:
                        throw Error(y(468, t));
                    }
                    ((a[$e] = e), lt(a), (t = a));
                  }
                  e.stateNode = t;
                }
              else nt || nf(u, e.type, e.stateNode);
            else e.stateNode = ym(u, l, e.memoizedProps);
          else
            n !== l
              ? (n === null ? ((t = a.stateNode), t === null || ze || t.parentNode.removeChild(t)) : n.count--,
                l === null ? nt || nf(u, e.type, e.stateNode) : ym(u, l, e.memoizedProps))
              : l === null && e.stateNode !== null && rr(e, e.memoizedProps, a.memoizedProps);
        break;
      case 27:
        (Et(t, e, l),
          _t(e),
          n & 512 && (ze || a === null || ft(a, a.return)),
          a !== null && n & 4 && rr(e, e.memoizedProps, a.memoizedProps));
        break;
      case 5:
        if (
          ((u = Sl),
          (Sl = !1),
          Et(t, e, l),
          (Sl = u),
          _t(e),
          n & 512 && (ze || a === null || ft(a, a.return)),
          e.flags & 32)
        ) {
          t = e.stateNode;
          try {
            (gn(t, ""), (xe = !0));
          } catch (j) {
            _e(e, e.return, j);
          }
        }
        (n & 4 && e.stateNode != null && ((t = e.memoizedProps), rr(e, t, a !== null ? a.memoizedProps : t)),
          n & 1024 && (yr = !0));
        break;
      case 6:
        if ((Et(t, e, l), _t(e), n & 4)) {
          if (e.stateNode === null) throw Error(y(162));
          ((t = e.memoizedProps), (l = e.stateNode));
          try {
            ((l.nodeValue = t), (xe = !0));
          } catch (j) {
            _e(e, e.return, j);
          }
        }
        break;
      case 3:
        if (
          ((xe = !1),
          (zc = null),
          (u = dl),
          (dl = Li(t.containerInfo)),
          Et(t, e, l),
          (dl = u),
          _t(e),
          n & 4 && a !== null && a.memoizedState.isDehydrated)
        )
          try {
            Pn(t.containerInfo);
          } catch (j) {
            _e(e, e.return, j);
          }
        (yr && ((yr = !1), oh(e)), (xe = !1));
        break;
      case 4:
        ((n = Sl),
          (Sl = nt),
          (a = Cf()),
          (u = dl),
          (dl = Li(e.stateNode.containerInfo)),
          Et(t, e, l),
          _t(e),
          (dl = u),
          xe && Ri && (ic = !0),
          (xe = a),
          (Sl = n));
        break;
      case 12:
        (Et(t, e, l), _t(e));
        break;
      case 31:
        (Et(t, e, l), _t(e), n & 4 && ((t = e.updateQueue), t !== null && ((e.updateQueue = null), cc(e, t))));
        break;
      case 13:
        (Et(t, e, l),
          _t(e),
          e.child.flags & 8192 && (e.memoizedState !== null) != (a !== null && a.memoizedState !== null) && (fc = et()),
          n & 4 && ((t = e.updateQueue), t !== null && ((e.updateQueue = null), cc(e, t))));
        break;
      case 22:
        ((u = e.memoizedState !== null), (c = a !== null && a.memoizedState !== null));
        var s = nt,
          r = ze,
          g = Sl;
        ((nt = s || u),
          (Sl = g || u),
          (ze = r || c),
          Et(t, e, l),
          (ze = r),
          (Sl = g),
          (nt = s),
          _t(e),
          n & 8192 &&
            ((t = e.stateNode),
            (t._visibility = u ? t._visibility & -2 : t._visibility | 1),
            !u ||
              a === null ||
              c ||
              nt ||
              ze ||
              ((t = c || ze), (l = nt), (a = ze), (nt = u || nt), (ze = t), fa(e, 2), (nt = l), (ze = a)),
            (!u && Sl) || br(e, u)),
          n & 4 &&
            ((t = e.updateQueue), t !== null && ((l = t.retryQueue), l !== null && ((t.retryQueue = null), cc(e, l)))));
        break;
      case 19:
        (Et(t, e, l), _t(e), n & 4 && ((t = e.updateQueue), t !== null && ((e.updateQueue = null), cc(e, t))));
        break;
      case 30:
        (n & 512 && (ze || a === null || ft(a, a.return)),
          (n = Cf()),
          (u = Ri),
          (c = (l & 335544064) === l),
          (s = e.memoizedProps),
          (Ri = c && Rl(s.default, s.update) !== "none"),
          Et(t, e, l),
          _t(e),
          c && a !== null && xe && (e.flags |= 4),
          (Ri = u),
          (xe = n));
        break;
      case 21:
        break;
      case 7:
        (n & 512 && (ze || a === null || ft(a, a.return)),
          a && a.stateNode !== null && (a.stateNode._fragmentFiber = e));
      default:
        (Et(t, e, l), _t(e));
    }
  }
  function _t(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null;) {
          if (Wo(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var n = e.return; n !== null;) {
          if (cr(n)) {
            var u = n.stateNode;
            a === null ? (a = [u]) : a.push(u);
          }
          if (ur(n)) break;
          n = n.return;
        }
        var c = a;
        if (l == null) throw Error(y(160));
        switch (l.tag) {
          case 27:
            var s = l.stateNode,
              r = fr(e);
            tc(e, r, s, c);
            break;
          case 5:
            var g = l.stateNode;
            l.flags & 32 && (gn(g, ""), (l.flags &= -33));
            var j = fr(e);
            tc(e, j, g, c);
            break;
          case 3:
          case 4:
            var S = l.stateNode.containerInfo,
              h = fr(e);
            dr(e, h, S, c);
            break;
          default:
            throw Error(y(161));
        }
      } catch (b) {
        _e(e, e.return, b);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function oh(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null;) {
        var t = e;
        (oh(t), t.tag === 5 && t.flags & 1024 && ((t = t.stateNode), ($n = !0), t.reset(), ($n = !1)), (e = e.sibling));
      }
  }
  function Rn(e, t) {
    if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) (hh(t, e), (t = t.sibling));
    else ah(t);
  }
  function hh(e, t) {
    var l = e.alternate;
    if (l === null) or(e, !1);
    else
      switch (e.tag) {
        case 3:
          if (((xr = Nl = !1), Io(), Rn(t, e), !Nl && !ic)) {
            if (((e = pl), e !== null))
              for (var a = 0; a < e.length; a += 3) {
                l = e[a];
                var n = e[a + 1];
                (em(l, e[a + 2]),
                  (l = l.ownerDocument.documentElement),
                  l !== null &&
                    l.animate(
                      { opacity: [0, 0], pointerEvents: ["none", "none"] },
                      { duration: 0, fill: "forwards", pseudoElement: "::view-transition-group(" + n + ")" },
                    ));
              }
            ((e = t.containerInfo),
              (e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement),
              e !== null &&
                e.style.viewTransitionName === "" &&
                ((e.style.viewTransitionName = "none"),
                e.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  { duration: 0, fill: "forwards", pseudoElement: "::view-transition-group(root)" },
                ),
                e.animate(
                  { width: [0, 0], height: [0, 0] },
                  { duration: 0, fill: "forwards", pseudoElement: "::view-transition" },
                )),
              (xr = !0));
          }
          pl = null;
          break;
        case 5:
          Rn(t, e);
          break;
        case 4:
          ((a = Nl), (Nl = !1), Rn(t, e), Nl && (ic = !0), (Nl = a));
          break;
        case 22:
          e.memoizedState === null && (l.memoizedState !== null ? or(e, !1) : Rn(t, e));
          break;
        case 30:
          ((a = Nl), (n = Io()), (Nl = !1), Rn(t, e), Nl && (e.flags |= 4));
          var u = e.memoizedProps,
            c = e.stateNode;
          ((t = wl(u, c)), (c = wl(l.memoizedProps, c)));
          var s = Rl(u.default, u.update);
          (s === "none"
            ? (t = !1)
            : ((u = l.memoizedState),
              (l.memoizedState = null),
              (l = e.child),
              (wt = 0),
              (t = vr(e, l, t, c, s, u, !0)),
              wt !== (u === null ? 0 : u.length) && (e.flags |= 32)),
            (e.flags & 4) !== 0 && t
              ? (Yn(e, e.memoizedProps.onUpdate), (pl = n))
              : n !== null && (n.push.apply(n, pl), (pl = n)),
            (Nl = (e.flags & 32) !== 0 ? !0 : a));
          break;
        default:
          Rn(t, e);
      }
  }
  function Tl(e, t) {
    if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) (ih(e, t.alternate, t), (t = t.sibling));
  }
  function fa(e, t) {
    for (e = e.child; e !== null;) {
      var l = e,
        a = t;
      switch (l.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (ra(4, l, l.return), fa(l, a));
          break;
        case 1:
          ft(l, l.return);
          var n = l.stateNode;
          (typeof n.componentWillUnmount == "function" && Jo(l, l.return, n), fa(l, a));
          break;
        case 27:
          (a & 2) !== 0 && om(l.stateNode, l.type, l.memoizedProps);
        case 5:
          (ft(l, l.return), (l.tag !== 5 && l.tag !== 27) || wi(l), fa(l, a));
          break;
        case 6:
          wi(l);
          break;
        case 26:
          (ft(l, l.return),
            (n = l.stateNode),
            l.memoizedState !== null || n === null || ze || n.parentNode.removeChild(n),
            fa(l, a));
          break;
        case 22:
          l.memoizedState === null && fa(l, a);
          break;
        case 30:
          (ft(l, l.return), fa(l, a));
          break;
        case 7:
          ft(l, l.return);
        default:
          fa(l, a);
      }
      e = e.sibling;
    }
  }
  function ol(e, t, l) {
    for (l = (t.subtreeFlags & 8772) !== 0 ? l : l & -2, t = t.child; t !== null;) {
      var a = t.alternate,
        n = e,
        u = t,
        c = u.flags,
        s = (l & 1) !== 0;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          (ol(n, u, l), Di(4, u));
          break;
        case 1:
          if ((ol(n, u, l), (a = u), (n = a.stateNode), typeof n.componentDidMount == "function"))
            try {
              n.componentDidMount();
            } catch (j) {
              _e(a, a.return, j);
            }
          if (((a = u), (n = a.updateQueue), n !== null)) {
            var r = a.stateNode;
            try {
              var g = n.shared.hiddenCallbacks;
              if (g !== null) for (n.shared.hiddenCallbacks = null, n = 0; n < g.length; n++) Rd(g[n], r);
            } catch (j) {
              _e(a, a.return, j);
            }
          }
          (s && c & 64 && Ko(u), jl(u, u.return));
          break;
        case 27:
          (l & 2) !== 0 && $o(u);
        case 5:
          ((u.tag !== 5 && u.tag !== 27) || Fo(u), ol(n, u, l), s && a === null && c & 4 && sr(u), jl(u, u.return));
          break;
        case 6:
          Fo(u);
          break;
        case 26:
          ((r = u.stateNode),
            u.memoizedState !== null || r === null || nt || nf(Li(r.ownerDocument), u.type, r),
            ol(n, u, l),
            s && a === null && c & 4 && sr(u),
            jl(u, u.return));
          break;
        case 12:
          ol(n, u, l);
          break;
        case 31:
          (ol(n, u, l), s && c & 4 && rh(n, u));
          break;
        case 13:
          (ol(n, u, l), s && c & 4 && fh(n, u));
          break;
        case 22:
          (u.memoizedState === null && ol(n, u, l), jl(u, u.return));
          break;
        case 30:
          (ol(n, u, l), jl(u, u.return));
          break;
        case 7:
          jl(u, u.return);
        default:
          ol(n, u, l);
      }
      t = t.sibling;
    }
  }
  function pr(e, t) {
    var l = null;
    (e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (l = e.memoizedState.cachePool.pool),
      (e = null),
      t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool),
      e !== l && (e != null && e.refCount++, l != null && bi(l)));
  }
  function zr(e, t) {
    ((e = null),
      t.alternate !== null && (e = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== e && (t.refCount++, e != null && bi(e)));
  }
  function ll(e, t, l, a) {
    var n = (l & 335544064) === l;
    if (t.subtreeFlags & (n ? 10262 : 10256)) for (t = t.child; t !== null;) (mh(e, t, l, a), (t = t.sibling));
    else n && lh(t);
  }
  function mh(e, t, l, a) {
    var n = (l & 335544064) === l;
    n && t.alternate === null && t.return !== null && t.return.alternate !== null && nc(t);
    var u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (ll(e, t, l, a), u & 2048 && Di(9, t));
        break;
      case 1:
        ll(e, t, l, a);
        break;
      case 3:
        (ll(e, t, l, a),
          n &&
            xr &&
            ((e = e.containerInfo),
            (e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e),
            e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""),
            (e = e.ownerDocument.documentElement),
            e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")),
          u & 2048 &&
            ((u = null),
            t.alternate !== null && (u = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== u && (t.refCount++, u != null && bi(u))));
        break;
      case 12:
        if (u & 2048) {
          (ll(e, t, l, a), (u = t.stateNode));
          try {
            var c = t.memoizedProps,
              s = c.id,
              r = c.onPostCommit;
            typeof r == "function" && r(s, t.alternate === null ? "mount" : "update", u.passiveEffectDuration, -0);
          } catch (g) {
            _e(t, t.return, g);
          }
        } else ll(e, t, l, a);
        break;
      case 31:
        ll(e, t, l, a);
        break;
      case 13:
        ll(e, t, l, a);
        break;
      case 23:
        break;
      case 22:
        ((c = t.stateNode),
          (s = t.alternate),
          t.memoizedState !== null
            ? (n && s !== null && s.memoizedState === null && nc(s), c._visibility & 2 ? ll(e, t, l, a) : Hi(e, t))
            : (n && s !== null && s.memoizedState !== null && nc(t),
              c._visibility & 2
                ? ll(e, t, l, a)
                : ((c._visibility |= 2), Hn(e, t, l, a, (t.subtreeFlags & 10256) !== 0 || !1))),
          u & 2048 && pr(s, t));
        break;
      case 24:
        (ll(e, t, l, a), u & 2048 && zr(t.alternate, t));
        break;
      case 30:
        (n && ((u = t.alternate), u !== null && (zl(u.child, !0), zl(t.child, !0))), ll(e, t, l, a));
        break;
      default:
        ll(e, t, l, a);
    }
  }
  function Hn(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null;) {
      var u = e,
        c = t,
        s = l,
        r = a,
        g = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          (Hn(u, c, s, r, n), Di(8, c));
          break;
        case 23:
          break;
        case 22:
          var j = c.stateNode;
          (c.memoizedState !== null
            ? j._visibility & 2
              ? Hn(u, c, s, r, n)
              : Hi(u, c)
            : ((j._visibility |= 2), Hn(u, c, s, r, n)),
            n && g & 2048 && pr(c.alternate, c));
          break;
        case 24:
          (Hn(u, c, s, r, n), n && g & 2048 && zr(c.alternate, c));
          break;
        default:
          Hn(u, c, s, r, n);
      }
      t = t.sibling;
    }
  }
  function Hi(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null;) {
        var l = e,
          a = t,
          n = a.flags;
        switch (a.tag) {
          case 22:
            (Hi(l, a), n & 2048 && pr(a.alternate, a));
            break;
          case 24:
            (Hi(l, a), n & 2048 && zr(a.alternate, a));
            break;
          default:
            Hi(l, a);
        }
        t = t.sibling;
      }
  }
  var Wa = 8192;
  function $a(e, t, l) {
    if (e.subtreeFlags & Wa) for (e = e.child; e !== null;) (gh(e, t, l), (e = e.sibling));
  }
  function gh(e, t, l) {
    switch (e.tag) {
      case 26:
        ($a(e, t, l),
          e.flags & Wa &&
            (e.memoizedState !== null
              ? Hv(l, dl, e.memoizedState, e.memoizedProps)
              : ((e = e.stateNode), (t & 335544128) === t && zm(l, e))));
        break;
      case 5:
        ($a(e, t, l), e.flags & Wa && ((e = e.stateNode), (t & 335544128) === t && zm(l, e)));
        break;
      case 3:
      case 4:
        var a = dl;
        ((dl = Li(e.stateNode.containerInfo)), $a(e, t, l), (dl = a));
        break;
      case 22:
        e.memoizedState === null &&
          ((a = e.alternate),
          a !== null && a.memoizedState !== null ? ((a = Wa), (Wa = 16777216), $a(e, t, l), (Wa = a)) : $a(e, t, l));
        break;
      case 30:
        if ((e.flags & Wa) !== 0 && ((a = e.memoizedProps.name), a != null && a !== "auto")) {
          var n = e.stateNode;
          ((n.paired = null), Lt === null && (Lt = new Map()), Lt.set(a, n));
        }
        $a(e, t, l);
        break;
      default:
        $a(e, t, l);
    }
  }
  function vh(e) {
    var t = e.alternate;
    if (t !== null && ((e = t.child), e !== null)) {
      t.child = null;
      do ((t = e.sibling), (e.sibling = null), (e = t));
      while (e !== null);
    }
  }
  function Ui(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          ((it = a), xh(a, e));
        }
      vh(e);
    }
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) (yh(e), (e = e.sibling));
  }
  function yh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Ui(e), e.flags & 2048 && ra(9, e, e.return));
        break;
      case 3:
        Ui(e);
        break;
      case 12:
        Ui(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13)
          ? ((t._visibility &= -3), sc(e))
          : Ui(e);
        break;
      default:
        Ui(e);
    }
  }
  function sc(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          ((it = a), xh(a, e));
        }
      vh(e);
    }
    for (e = e.child; e !== null;) {
      switch (((t = e), t.tag)) {
        case 0:
        case 11:
        case 15:
          (ra(8, t, t.return), sc(t));
          break;
        case 22:
          ((l = t.stateNode), l._visibility & 2 && ((l._visibility &= -3), sc(t)));
          break;
        default:
          sc(t);
      }
      e = e.sibling;
    }
  }
  function xh(e, t) {
    for (; it !== null;) {
      var l = it;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          ra(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          bi(l.memoizedState.cache);
      }
      if (((a = l.child), a !== null)) ((a.return = l), (it = a));
      else
        e: for (l = e; it !== null;) {
          a = it;
          var n = a.sibling,
            u = a.return;
          if ((ch(a), a === l)) {
            it = null;
            break e;
          }
          if (n !== null) {
            ((n.return = u), (it = n));
            break e;
          }
          it = u;
        }
    }
  }
  var Mg = {
      getCacheForType: function (e) {
        var t = ct(Ke),
          l = t.data.get(e);
        return (l === void 0 && ((l = e()), t.data.set(e, l)), l);
      },
      cacheSignal: function () {
        return ct(Ke).controller.signal;
      },
    },
    Cg = typeof WeakMap == "function" ? WeakMap : Map,
    be = 0,
    Me = null,
    ie = null,
    ce = 0,
    Ee = 0,
    Zt = null,
    da = !1,
    Un = !1,
    Sr = !1,
    Ll = 0,
    Ye = 0,
    oa = 0,
    Pa = 0,
    rc = 0,
    Qt = 0,
    Bn = 0,
    Bi = null,
    Ht = null,
    Nr = !1,
    fc = 0,
    bh = 0,
    dc = 1 / 0,
    oc = null,
    ha = null,
    qe = 0,
    hl = null,
    Ia = null,
    El = 0,
    Tr = 0,
    Er = null,
    jh = null,
    qn = null,
    kn = null,
    Gn = null,
    qi = 0,
    hc = null;
  function Xt() {
    return (be & 2) !== 0 && ce !== 0 ? ce & -ce : q.T !== null ? Ur() : fu();
  }
  function ph() {
    if (Qt === 0)
      if ((ce & 536870912) === 0 || le) {
        var e = Kl;
        ((Kl <<= 1), (Kl & 3932160) === 0 && (Kl = 262144), (Qt = e));
      } else Qt = 536870912;
    return ((e = st.current), e !== null && (e.flags |= 32), Qt);
  }
  function Yn(e, t) {
    if (t != null) {
      var l = e.stateNode,
        a = l.ref;
      (a === null && (a = l.ref = tm(wl(e.memoizedProps, l))), kn === null && (kn = []), kn.push(t.bind(null, a)));
    }
  }
  function Ut(e, t, l) {
    (((e === Me && (Ee === 2 || Ee === 9)) || e.cancelPendingCommit !== null) && (Vn(e, 0), ma(e, ce, Qt, !1)),
      wa(e, l),
      ((be & 2) === 0 || e !== Me) &&
        (e === Me && ((be & 2) === 0 && (Pa |= l), Ye === 4 && ma(e, ce, Qt, !1)), _l(e)));
  }
  function zh(e, t, l) {
    if ((be & 6) !== 0) throw Error(y(327));
    var a = (!l && (t & 127) === 0 && (t & e.expiredLanes) === 0) || St(e, t),
      n = a ? Rg(e, t) : Ar(e, t, !0),
      u = a;
    do {
      if (n === 0) {
        Un && !a && ma(e, t, 0, !1);
        break;
      } else {
        if (((l = e.current.alternate), u && !Dg(l))) {
          ((n = Ar(e, t, !1)), (u = !1));
          continue;
        }
        if (n === 2) {
          if (((u = t), e.errorRecoveryDisabledLanes & u)) var c = 0;
          else ((c = e.pendingLanes & -536870913), (c = c !== 0 ? c : c & 536870912 ? 536870912 : 0));
          if (c !== 0) {
            t = c;
            e: {
              var s = e;
              n = Bi;
              var r = s.current.memoizedState.isDehydrated;
              if ((r && (Vn(s, c).flags |= 256), (c = Ar(s, c, !1)), c !== 2 && c !== 6)) {
                if (Sr && !r) {
                  ((s.errorRecoveryDisabledLanes |= u), (Pa |= u), (n = 4));
                  break e;
                }
                ((u = Ht), (Ht = n), u !== null && (Ht === null ? (Ht = u) : Ht.push.apply(Ht, u)));
              }
              n = c;
            }
            if (((u = !1), n !== 2)) continue;
          }
        }
        if (n === 1) {
          (Vn(e, 0), ma(e, t, 0, !0));
          break;
        }
        e: {
          switch (((a = e), (u = n), u)) {
            case 0:
            case 1:
              throw Error(y(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t) break;
            case 6:
              ma(a, t, Qt, !da);
              break e;
            case 2:
              Ht = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(y(329));
          }
          if ((t & 62914560) === t && ((n = fc + 300 - et()), 10 < n)) {
            if ((ma(a, t, Qt, !da), Jl(a, 0, !0) !== 0)) break e;
            ((El = t),
              (a.timeoutHandle = Kr(Sh.bind(null, a, l, Ht, oc, Nr, t, Qt, Pa, Bn, da, u, "Throttled", -0, 0), n)));
            break e;
          }
          Sh(a, l, Ht, oc, Nr, t, Qt, Pa, Bn, da, u, null, -0, 0);
        }
      }
      break;
    } while (!0);
    _l(e);
  }
  function Sh(e, t, l, a, n, u, c, s, r, g, j, S, h, b) {
    e.timeoutHandle = -1;
    var M = t.subtreeFlags,
      U = (u & 335544064) === u;
    if (
      ((S = null),
      (U || M & 8192 || (M & 16785408) === 16785408) &&
        ((S = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: yl,
        }),
        (Lt = null),
        gh(t, u, S),
        U &&
          ((M = S),
          (U = e.containerInfo),
          (U = (U.nodeType === 9 ? U : U.ownerDocument).__reactViewTransition),
          U != null && (M.count++, (M.waitingForViewTransition = !0), (M = Xi.bind(M)), U.finished.then(M, M))),
        (M = (u & 62914560) === u ? fc - et() : (u & 4194048) === u ? bh - et() : 0),
        (M = Uv(S, M)),
        M !== null))
    ) {
      ((El = u),
        (e.cancelPendingCommit = M(Ch.bind(null, e, t, u, l, a, n, c, s, r, g, j, S, null, h, b))),
        ma(e, u, c, !g));
      return;
    }
    Ch(e, t, u, l, a, n, c, s, r, g, j, S);
  }
  function Dg(e) {
    for (var t = e; ;) {
      var l = t.tag;
      if (
        (l === 0 || l === 11 || l === 15) &&
        t.flags & 16384 &&
        ((l = t.updateQueue), l !== null && ((l = l.stores), l !== null))
      )
        for (var a = 0; a < l.length; a++) {
          var n = l[a],
            u = n.getSnapshot;
          n = n.value;
          try {
            if (!Yt(u(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (((l = t.child), t.subtreeFlags & 16384 && l !== null)) ((l.return = t), (t = l));
      else {
        if (t === e) break;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function ma(e, t, l, a) {
    ((t = uu(e, t)),
      (t &= ~rc),
      (t &= ~Pa),
      (e.suspendedLanes |= t),
      (e.pingedLanes &= ~t),
      a && (e.warmLanes |= t),
      (a = e.expirationTimes));
    for (var n = t; 0 < n;) {
      var u = 31 - tt(n),
        c = 1 << u;
      ((a[u] = -1), (n &= ~c));
    }
    l !== 0 && cu(e, l, t);
  }
  function mc() {
    return (be & 6) === 0 ? (ki(0), !1) : !0;
  }
  function _r() {
    if (ie !== null) {
      if (Ee === 0) var e = ie.return;
      else ((e = ie), (Bl = Ga = null), Hs(e), (An = null), (zi = 0), (e = ie));
      for (; e !== null;) (Xo(e.alternate, e), (e = e.return));
      ie = null;
    }
  }
  function Vn(e, t) {
    var l = e.timeoutHandle;
    return (
      l !== -1 && ((e.timeoutHandle = -1), lv(l)),
      (l = e.cancelPendingCommit),
      l !== null && ((e.cancelPendingCommit = null), l()),
      (El = 0),
      _r(),
      (Me = e),
      (ie = l = Hl(e.current, null)),
      (ce = t),
      (Ee = 0),
      (Zt = null),
      (da = !1),
      (Un = St(e, t)),
      (Sr = !1),
      (Bn = Qt = rc = Pa = oa = Ye = 0),
      (Ht = Bi = null),
      (Nr = !1),
      (Ll = uu(e, t)),
      zu(),
      l
    );
  }
  function Nh(e, t) {
    (($ = null),
      (q.H = Ku),
      t === _n || t === wu
        ? ((t = Md()), (Ee = 3))
        : t === zs
          ? ((t = Md()), (Ee = 4))
          : (Ee = t === Ws ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1),
      (Zt = t),
      ie === null && ((Ye = 1), Ju(e, Pt(t, e.current))));
  }
  function Th() {
    var e = st.current;
    return e === null
      ? !0
      : (ce & 4194048) === ce
        ? xt === null
        : (ce & 62914560) === ce || (ce & 536870912) !== 0
          ? e === xt
          : !1;
  }
  function Eh() {
    var e = q.H;
    return ((q.H = Ku), e === null ? Ku : e);
  }
  function _h() {
    var e = q.A;
    return ((q.A = Mg), e);
  }
  function gc() {
    ((Ye = 4),
      da || ((ce & 4194048) !== ce && st.current !== null) || (Un = !0),
      ((oa & 134217727) === 0 && (Pa & 134217727) === 0) || Me === null || ma(Me, ce, Qt, !1));
  }
  function Ar(e, t, l) {
    var a = be;
    be |= 2;
    var n = Eh(),
      u = _h();
    ((Me !== e || ce !== t) && ((oc = null), Vn(e, t)), (t = !1));
    var c = Ye;
    e: do
      try {
        if (Ee !== 0 && ie !== null) {
          var s = ie,
            r = Zt;
          switch (Ee) {
            case 8:
              (_r(), (c = 6));
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              st.current === null && (t = !0);
              var g = Ee;
              if (((Ee = 0), (Zt = null), Ln(e, s, r, g), l && Un)) {
                c = 0;
                break e;
              }
              break;
            default:
              ((g = Ee), (Ee = 0), (Zt = null), Ln(e, s, r, g));
          }
        }
        (wg(), (c = Ye));
        break;
      } catch (j) {
        Nh(e, j);
      }
    while (!0);
    return (
      t && e.shellSuspendCounter++,
      (Bl = Ga = null),
      (be = a),
      (q.H = n),
      (q.A = u),
      ie === null && ((Me = null), (ce = 0), zu()),
      c
    );
  }
  function wg() {
    for (; ie !== null;) Ah(ie);
  }
  function Rg(e, t) {
    var l = be;
    be |= 2;
    var a = Eh(),
      n = _h();
    Me !== e || ce !== t ? ((oc = null), (dc = et() + 500), Vn(e, t)) : (Un = St(e, t));
    e: do
      try {
        if (Ee !== 0 && ie !== null) {
          t = ie;
          var u = Zt;
          t: switch (Ee) {
            case 1:
              ((Ee = 0), (Zt = null), Ln(e, t, u, 1));
              break;
            case 2:
            case 9:
              if (Ad(u)) {
                ((Ee = 0), (Zt = null), Oh(t));
                break;
              }
              ((t = function () {
                ((Ee !== 2 && Ee !== 9) || Me !== e || (Ee = 7), _l(e));
              }),
                u.then(t, t));
              break e;
            case 3:
              Ee = 7;
              break e;
            case 4:
              Ee = 5;
              break e;
            case 7:
              Ad(u) ? ((Ee = 0), (Zt = null), Oh(t)) : ((Ee = 0), (Zt = null), Ln(e, t, u, 7));
              break;
            case 5:
              var c = null;
              switch (ie.tag) {
                case 26:
                  c = ie.memoizedState;
                case 5:
                case 27:
                  var s = ie;
                  if (c ? jm(c) : s.stateNode.complete) {
                    ((Ee = 0), (Zt = null));
                    var r = s.sibling;
                    if (r !== null) ie = r;
                    else {
                      var g = s.return;
                      g !== null ? ((ie = g), vc(g)) : (ie = null);
                    }
                    break t;
                  }
              }
              ((Ee = 0), (Zt = null), Ln(e, t, u, 5));
              break;
            case 6:
              ((Ee = 0), (Zt = null), Ln(e, t, u, 6));
              break;
            case 8:
              (_r(), (Ye = 6));
              break e;
            default:
              throw Error(y(462));
          }
        }
        Hg();
        break;
      } catch (j) {
        Nh(e, j);
      }
    while (!0);
    return ((Bl = Ga = null), (q.H = a), (q.A = n), (be = l), ie !== null ? 0 : ((Me = null), (ce = 0), zu(), Ye));
  }
  function Hg() {
    for (; ie !== null && !Aa();) Ah(ie);
  }
  function Ah(e) {
    var t = Zo(e.alternate, e, Ll);
    ((e.memoizedProps = e.pendingProps), t === null ? vc(e) : (ie = t));
  }
  function Oh(e) {
    var t = e,
      l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Bo(l, t, t.pendingProps, t.type, void 0, ce);
        break;
      case 11:
        t = Bo(l, t, t.pendingProps, t.type.render, t.ref, ce);
        break;
      case 5:
        Hs(t);
        var a = t;
        a === at && (le ? (Au(a), a.tag === 5 && a.stateNode != null && (we = a.stateNode)) : (Au(a), (le = !0)));
      default:
        (Xo(l, t), (t = ie = yd(t, Ll)), (t = Zo(l, t, Ll)));
    }
    ((e.memoizedProps = e.pendingProps), t === null ? vc(e) : (ie = t));
  }
  function Ln(e, t, l, a) {
    ((Bl = Ga = null), Hs(t), (An = null), (zi = 0));
    var n = t.return;
    try {
      if (zg(e, n, t, l, ce)) {
        ((Ye = 1), Ju(e, Pt(l, e.current)), (ie = null));
        return;
      }
    } catch (u) {
      if (n !== null) throw ((ie = n), u);
      ((Ye = 1), Ju(e, Pt(l, e.current)), (ie = null));
      return;
    }
    t.flags & 32768
      ? (le || a === 1
          ? (e = !0)
          : Un || (ce & 536870912) !== 0
            ? (e = !1)
            : ((da = e = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = st.current), a !== null && a.tag === 13 && (a.flags |= 16384))),
        Mh(t, e))
      : vc(t);
  }
  function vc(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Mh(t, da);
        return;
      }
      e = t.return;
      var l = Eg(t.alternate, t, Ll);
      if (l !== null) {
        ie = l;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        ie = t;
        return;
      }
      ie = t = e;
    } while (t !== null);
    Ye === 0 && (Ye = 5);
  }
  function Mh(e, t) {
    do {
      var l = _g(e.alternate, e);
      if (l !== null) {
        ((l.flags &= 32767), (ie = l));
        return;
      }
      if (
        ((l = e.return),
        l !== null && ((l.flags |= 32768), (l.subtreeFlags = 0), (l.deletions = null)),
        !t && ((e = e.sibling), e !== null))
      ) {
        ie = e;
        return;
      }
      ie = e = l;
    } while (e !== null);
    ((Ye = 6), (ie = null));
  }
  function Ch(e, t, l, a, n, u, c, s, r, g, j, S) {
    e.cancelPendingCommit = null;
    do yc();
    while (qe !== 0);
    if ((be & 6) !== 0) throw Error(y(327));
    if (t !== null) {
      if (t === e.current) throw Error(y(177));
      (e === Me && ((ie = Me = null), (ce = 0)),
        (Ia = t),
        (hl = e),
        (El = l),
        (Er = n),
        (jh = a),
        Ug(e, t, l, c, s, r, S));
    }
  }
  function Ug(e, t, l, a, n, u, c) {
    var s = t.lanes | t.childLanes;
    if (
      ((Tr = s),
      (s |= rs),
      Gc(e, l, s, a, n, u),
      (kn = null),
      (l & 335544064) === l ? ((Gn = fg(e)), (a = 10262)) : ((Gn = null), (a = 10256)),
      (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0
        ? ((e.callbackNode = null),
          (e.callbackPriority = 0),
          Vg(Ol, function () {
            return (Dr(), null);
          }))
        : ((e.callbackNode = null), (e.callbackPriority = 0)),
      (lc = !1),
      (a = (t.flags & 13878) !== 0),
      (t.subtreeFlags & 13878) !== 0 || a)
    ) {
      ((a = q.T), (q.T = null), (n = F.p), (F.p = 2), (u = be), (be |= 4));
      try {
        Ag(e, t, l);
      } finally {
        ((be = u), (F.p = n), (q.T = a));
      }
    }
    ((qe = 1), lc ? (qn = sv(c, e.containerInfo, Gn, Or, Mr, qg, Cr, Dr, Bg)) : (Or(), Mr(), Cr()));
  }
  function Bg(e) {
    if (qe !== 0) {
      var t = hl.onRecoverableError;
      t(e, { componentStack: null });
    }
  }
  function qg() {
    qe === 3 && ((qe = 0), hh(Ia, hl), (qe = 4));
  }
  function Or() {
    if (qe === 1) {
      qe = 0;
      var e = hl,
        t = Ia,
        l = El,
        a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        ((a = q.T), (q.T = null));
        var n = F.p;
        F.p = 2;
        var u = be;
        be |= 4;
        try {
          ((Ri = ic = !1), dh(t, e, l), (l = Zr));
          var c = cd(e.containerInfo),
            s = l.focusedElem,
            r = l.selectionRange;
          if (c !== s && s && s.ownerDocument && ud(s.ownerDocument.documentElement, s)) {
            if (r !== null && ns(s)) {
              var g = r.start,
                j = r.end;
              if ((j === void 0 && (j = g), "selectionStart" in s))
                ((s.selectionStart = g), (s.selectionEnd = Math.min(j, s.value.length)));
              else {
                var S = s.ownerDocument || document,
                  h = (S && S.defaultView) || window;
                if (h.getSelection) {
                  var b = h.getSelection(),
                    M = s.textContent.length,
                    U = Math.min(r.start, M),
                    P = r.end === void 0 ? U : Math.min(r.end, M);
                  !b.extend && U > P && ((c = P), (P = U), (U = c));
                  var m = id(s, U),
                    f = id(s, P);
                  if (
                    m &&
                    f &&
                    (b.rangeCount !== 1 ||
                      b.anchorNode !== m.node ||
                      b.anchorOffset !== m.offset ||
                      b.focusNode !== f.node ||
                      b.focusOffset !== f.offset)
                  ) {
                    var x = S.createRange();
                    (x.setStart(m.node, m.offset),
                      b.removeAllRanges(),
                      U > P
                        ? (b.addRange(x), b.extend(f.node, f.offset))
                        : (x.setEnd(f.node, f.offset), b.addRange(x)));
                  }
                }
              }
            }
            for (S = [], b = s; (b = b.parentNode);)
              b.nodeType === 1 && S.push({ element: b, left: b.scrollLeft, top: b.scrollTop });
            for (typeof s.focus == "function" && s.focus(), s = 0; s < S.length; s++) {
              var z = S[s];
              ((z.element.scrollLeft = z.left), (z.element.scrollTop = z.top));
            }
          }
          (($n = !!Lr), (Zr = Lr = null));
        } finally {
          ((be = u), (F.p = n), (q.T = a));
        }
      }
      ((e.current = t), (qe = 2));
    }
  }
  function Mr() {
    if (qe === 2) {
      qe = 0;
      var e = hl,
        t = Ia,
        l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        ((l = q.T), (q.T = null));
        var a = F.p;
        F.p = 2;
        var n = be;
        be |= 4;
        try {
          ih(e, t.alternate, t);
        } finally {
          ((be = n), (F.p = a), (q.T = l));
        }
      }
      qe = 3;
    }
  }
  function Cr() {
    if (qe === 4 || qe === 3) {
      qe = 0;
      var e = qn;
      ((qn = null), Oa());
      var t = hl,
        l = Ia,
        a = El,
        n = jh,
        u = (a & 335544064) === a ? 10262 : 10256;
      if (
        ((l.subtreeFlags & u) !== 0 || (l.flags & u) !== 0
          ? (qe = 5)
          : ((qe = 0), (Ia = hl = null), Dh(t, t.pendingLanes)),
        (u = t.pendingLanes),
        u === 0 && (ha = null),
        ci(a),
        (l = l.stateNode),
        mt && typeof mt.onCommitFiberRoot == "function")
      )
        try {
          mt.onCommitFiberRoot(Ca, l, void 0, (l.current.flags & 128) === 128);
        } catch {}
      if (n !== null) {
        ((l = q.T), (u = F.p), (F.p = 2), (q.T = null));
        try {
          for (var c = t.onRecoverableError, s = 0; s < n.length; s++) {
            var r = n[s];
            c(r.value, { componentStack: r.stack });
          }
        } finally {
          ((q.T = l), (F.p = u));
        }
      }
      if (((n = kn), (c = Gn), (Gn = null), n !== null && ((kn = null), c === null && (c = []), e !== null)))
        for (r = 0; r < n.length; r++) ((l = (0, n[r])(c)), l !== void 0 && e.finished.finally(l));
      ((El & 3) !== 0 && yc(),
        _l(t),
        (u = t.pendingLanes),
        (a & 261930) !== 0 && (u & 42) !== 0 ? (t === hc ? qi++ : ((qi = 0), (hc = t))) : ((qi = 0), (hc = null)),
        ki(0));
    }
  }
  function Dh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && ((t = e.pooledCache), t != null && ((e.pooledCache = null), bi(t)));
  }
  function yc() {
    return (qn !== null && (qn.skipTransition(), (qn = null)), Or(), Mr(), Cr(), Dr());
  }
  function Dr() {
    if (qe !== 5) return !1;
    var e = hl,
      t = Tr;
    Tr = 0;
    var l = ci(El),
      a = q.T,
      n = F.p;
    try {
      ((F.p = 32 > l ? 32 : l), (q.T = null), (l = Er), (Er = null));
      var u = hl,
        c = El;
      if (((qe = 0), (Ia = hl = null), (El = 0), (be & 6) !== 0)) throw Error(y(331));
      var s = be;
      if (
        ((be |= 4),
        yh(u.current),
        mh(u, u.current, c, l),
        (be = s),
        ki(0, !1),
        mt && typeof mt.onPostCommitFiberRoot == "function")
      )
        try {
          mt.onPostCommitFiberRoot(Ca, u);
        } catch {}
      return !0;
    } finally {
      ((F.p = n), (q.T = a), Dh(e, t));
    }
  }
  function wh(e, t, l) {
    ((t = Pt(l, t)), (t = Fs(e.stateNode, t, 2)), (e = ia(e, t, 2)), e !== null && (wa(e, 2), _l(e)));
  }
  function _e(e, t, l) {
    if (e.tag === 3) wh(e, e, l);
    else
      for (; t !== null;) {
        if (t.tag === 3) {
          wh(t, e, l);
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof a.componentDidCatch == "function" && (ha === null || !ha.has(a)))
          ) {
            ((e = Pt(l, e)), (l = Oo(2)), (a = ia(t, l, 2)), a !== null && (Mo(l, a, t, e), wa(a, 2), _l(a)));
            break;
          }
        }
        t = t.return;
      }
  }
  function wr(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new Cg();
      var n = new Set();
      a.set(t, n);
    } else ((n = a.get(t)), n === void 0 && ((n = new Set()), a.set(t, n)));
    n.has(l) || ((Sr = !0), n.add(l), (e = kg.bind(null, e, t, l)), t.then(e, e));
  }
  function kg(e, t, l) {
    var a = e.pingCache;
    (a !== null && a.delete(t),
      (e.pingedLanes |= e.suspendedLanes & l),
      (e.warmLanes &= ~l),
      Me === e &&
        (ce & l) === l &&
        ((Ye === 4 || (Ye === 3 && (ce & 62914560) === ce && 300 > et() - fc)) && (be & 2) === 0 ? Vn(e, 0) : (rc |= l),
        Bn === ce && (Bn = 0)),
      _l(e));
  }
  function Rh(e, t) {
    (t === 0 && (t = dn()), (e = Ba(e, t)), e !== null && (wa(e, t), _l(e)));
  }
  function Gg(e) {
    var t = e.memoizedState,
      l = 0;
    (t !== null && (l = t.retryLane), Rh(e, l));
  }
  function Yg(e, t) {
    var l = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode,
          n = e.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(y(314));
    }
    (a !== null && a.delete(t), Rh(e, l));
  }
  function Vg(e, t) {
    return cn(e, t);
  }
  var Zn = null,
    Qn = null,
    Rr = !1,
    xc = !1,
    Hr = !1,
    ga = 0;
  function _l(e) {
    (e !== Qn && e.next === null && (Qn === null ? (Zn = Qn = e) : (Qn = Qn.next = e)),
      (xc = !0),
      Rr || ((Rr = !0), Zg()));
  }
  function ki(e, t) {
    if (!Hr && xc) {
      Hr = !0;
      do
        for (var l = !1, a = Zn; a !== null;) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var c = a.suspendedLanes,
                s = a.pingedLanes;
              ((u = (1 << (31 - tt(42 | e) + 1)) - 1),
                (u &= n & ~(c & ~s)),
                (u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0));
            }
            u !== 0 && ((l = !0), qh(a, u));
          } else
            ((u = ce),
              (u = Jl(a, a === Me ? u : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1)),
              (u & 3) === 0 || St(a, u) || ((l = !0), qh(a, u)));
          a = a.next;
        }
      while (l);
      Hr = !1;
    }
  }
  function Lg() {
    Hh();
  }
  function Hh() {
    xc = Rr = !1;
    var e = 0;
    ga !== 0 && tv() && (e = ga);
    for (var t = et(), l = null, a = Zn; a !== null;) {
      var n = a.next,
        u = Uh(a, t);
      (u === 0
        ? ((a.next = null), l === null ? (Zn = n) : (l.next = n), n === null && (Qn = l))
        : ((l = a), (e !== 0 || (u & 3) !== 0) && (xc = !0)),
        (a = n));
    }
    ((qe !== 0 && qe !== 5) || ki(e), ga !== 0 && (ga = 0));
  }
  function Uh(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u;) {
      var c = 31 - tt(u),
        s = 1 << c,
        r = n[c];
      (r === -1 ? ((s & l) === 0 || (s & a) !== 0) && (n[c] = Tf(s, t)) : r <= t && (e.expiredLanes |= s), (u &= ~s));
    }
    if (
      ((t = Me),
      (l = ce),
      (l = Jl(e, e === t ? l : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      (a = e.callbackNode),
      l === 0 || (e === t && (Ee === 2 || Ee === 9)) || e.cancelPendingCommit !== null)
    )
      return (a !== null && a !== null && sn(a), (e.callbackNode = null), (e.callbackPriority = 0));
    if ((l & 3) === 0 || St(e, l)) {
      if (((t = l & -l), t === e.callbackPriority)) return t;
      switch ((a !== null && sn(a), ci(l))) {
        case 2:
        case 8:
          l = rn;
          break;
        case 32:
          l = Ol;
          break;
        case 268435456:
          l = zt;
          break;
        default:
          l = Ol;
      }
      return ((a = Bh.bind(null, e)), (l = cn(l, a)), (e.callbackPriority = t), (e.callbackNode = l), t);
    }
    return (a !== null && a !== null && sn(a), (e.callbackPriority = 2), (e.callbackNode = null), 2);
  }
  function Bh(e, t) {
    if (qe !== 0 && qe !== 5) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
    var l = e.callbackNode;
    if (yc() && e.callbackNode !== l) return null;
    var a = ce;
    return (
      (a = Jl(e, e === Me ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      a === 0
        ? null
        : (zh(e, a, t), Uh(e, et()), e.callbackNode != null && e.callbackNode === l ? Bh.bind(null, e) : null)
    );
  }
  function qh(e, t) {
    if (yc()) return null;
    zh(e, t, !0);
  }
  function Zg() {
    av(function () {
      (be & 6) !== 0 ? cn(ai, Lg) : Hh();
    });
  }
  function Ur() {
    if (ga === 0) {
      var e = La;
      (e === 0 && ((e = fn), (fn <<= 1), (fn & 261888) === 0 && (fn = 256)), (ga = e));
    }
    return ga;
  }
  function kh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : mu(e);
  }
  function Qg(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var u = kh((n[gt] || null).action),
        c = a.submitter;
      c &&
        ((t = (t = c[gt] || null) ? kh(t.formAction) : c.getAttribute("formAction")),
        t !== null && ((u = t), (c = null)));
      var s = new xu("action", "action", null, a, n);
      e.push({
        event: s,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (ga !== 0) {
                  var r = new FormData(n, c);
                  Zs(l, { pending: !0, data: r, method: n.method, action: u }, null, r);
                }
              } else
                typeof u == "function" &&
                  (s.preventDefault(),
                  (r = new FormData(n, c)),
                  Zs(l, { pending: !0, data: r, method: n.method, action: u }, u, r));
            },
            currentTarget: n,
          },
        ],
      });
    }
  }
  for (var Br = 0; Br < ss.length; Br++) {
    var qr = ss[Br],
      Xg = qr.toLowerCase(),
      Kg = qr[0].toUpperCase() + qr.slice(1);
    rl(Xg, "on" + Kg);
  }
  (rl(fd, "onAnimationEnd"),
    rl(dd, "onAnimationIteration"),
    rl(od, "onAnimationStart"),
    rl("dblclick", "onDoubleClick"),
    rl("focusin", "onFocus"),
    rl("focusout", "onBlur"),
    rl(lg, "onTransitionRun"),
    rl(ag, "onTransitionStart"),
    rl(ng, "onTransitionCancel"),
    rl(hd, "onTransitionEnd"),
    hn("onMouseEnter", ["mouseout", "mouseover"]),
    hn("onMouseLeave", ["mouseout", "mouseover"]),
    hn("onPointerEnter", ["pointerout", "pointerover"]),
    hn("onPointerLeave", ["pointerout", "pointerover"]),
    Ra("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    Ra("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
    Ra("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    Ra("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    Ra("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
    Ra("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" ")));
  var Gi =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    Jg = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Gi));
  function Gh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l],
        n = a.event;
      a = a.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var s = a[c],
              r = s.instance,
              g = s.currentTarget;
            if (((s = s.listener), r !== u && n.isPropagationStopped())) break e;
            ((u = s), (n.currentTarget = g));
            try {
              u(n);
            } catch (j) {
              pu(j);
            }
            ((n.currentTarget = null), (u = r));
          }
        else
          for (c = 0; c < a.length; c++) {
            if (
              ((s = a[c]),
              (r = s.instance),
              (g = s.currentTarget),
              (s = s.listener),
              r !== u && n.isPropagationStopped())
            )
              break e;
            ((u = s), (n.currentTarget = g));
            try {
              u(n);
            } catch (j) {
              pu(j);
            }
            ((n.currentTarget = null), (u = r));
          }
      }
    }
  }
  function ue(e, t) {
    var l = t[v];
    l === void 0 && (l = t[v] = new Set());
    var a = e + "__bubble";
    l.has(a) || (Yh(t, e, 2, !1), l.add(a));
  }
  function kr(e, t, l) {
    var a = 0;
    (t && (a |= 4), Yh(l, e, a, t));
  }
  var bc = "_reactListening" + Math.random().toString(36).slice(2);
  function Gr(e) {
    if (!e[bc]) {
      ((e[bc] = !0),
        _f.forEach(function (l) {
          l !== "selectionchange" && (Jg.has(l) || kr(l, !1, e), kr(l, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[bc] || ((t[bc] = !0), kr("selectionchange", !1, t));
    }
  }
  function Yh(e, t, l, a) {
    switch (Mm(t)) {
      case 2:
        var n = Gv;
        break;
      case 8:
        n = Yv;
        break;
      default:
        n = cf;
    }
    ((l = n.bind(null, t, l, e)),
      (n = void 0),
      !Jc || (t !== "touchstart" && t !== "touchmove" && t !== "wheel") || (n = !0),
      a
        ? n !== void 0
          ? e.addEventListener(t, l, { capture: !0, passive: n })
          : e.addEventListener(t, l, !0)
        : n !== void 0
          ? e.addEventListener(t, l, { passive: n })
          : e.addEventListener(t, l, !1));
  }
  function Yr(e, t, l, a, n) {
    var u = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (;;) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var s = a.stateNode.containerInfo;
          if (s === n) break;
          if (c === 4)
            for (c = a.return; c !== null;) {
              var r = c.tag;
              if ((r === 3 || r === 4) && c.stateNode.containerInfo === n) return;
              c = c.return;
            }
          for (; s !== null;) {
            if (((c = yt(s)), c === null)) return;
            if (((r = c.tag), r === 5 || r === 6 || r === 26 || r === 27)) {
              a = u = c;
              continue e;
            }
            s = s.parentNode;
          }
        }
        a = a.return;
      }
    Gf(function () {
      var g = u,
        j = Xc(l),
        S = [];
      e: {
        var h = md.get(e);
        if (h !== void 0) {
          var b = xu,
            M = e;
          switch (e) {
            case "keypress":
              if (vu(l) === 0) break e;
            case "keydown":
            case "keyup":
              b = D0;
              break;
            case "focusin":
              ((M = "focus"), (b = Pc));
              break;
            case "focusout":
              ((M = "blur"), (b = Pc));
              break;
            case "beforeblur":
            case "afterblur":
              b = Pc;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              b = Lf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              b = j0;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              b = B0;
              break;
            case fd:
            case dd:
            case od:
              b = S0;
              break;
            case hd:
              b = k0;
              break;
            case "scroll":
            case "scrollend":
              b = x0;
              break;
            case "wheel":
              b = Y0;
              break;
            case "copy":
            case "cut":
            case "paste":
              b = T0;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              b = Qf;
              break;
            case "submit":
              b = H0;
              break;
            case "toggle":
            case "beforetoggle":
              b = L0;
          }
          var U = (t & 4) !== 0,
            P = !U && (e === "scroll" || e === "scrollend"),
            m = U ? (h !== null ? h + "Capture" : null) : h;
          U = [];
          for (var f = g, x; f !== null;) {
            var z = f;
            if (
              ((x = z.stateNode),
              (z = z.tag),
              (z !== 5 && z !== 26 && z !== 27) ||
                x === null ||
                m === null ||
                ((z = si(f, m)), z != null && U.push(Yi(f, z, x))),
              P)
            )
              break;
            f = f.return;
          }
          0 < U.length && ((h = new b(h, M, null, l, j)), S.push({ event: h, listeners: U }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((b = e === "mouseover" || e === "pointerover"),
            (h = e === "mouseout" || e === "pointerout"),
            b && l !== Qc && (M = l.relatedTarget || l.fromElement) && (yt(M) || M[Fl]))
          )
            break e;
          (h || b) &&
            ((M = j.window === j ? j : (b = j.ownerDocument) ? b.defaultView || b.parentWindow : window),
            h
              ? ((b = l.relatedTarget || l.toElement),
                (h = g),
                (b = b ? yt(b) : null),
                b !== null && ((P = X(b)), (U = b.tag), b !== P || (U !== 5 && U !== 27 && U !== 6)) && (b = null))
              : ((h = null), (b = g)),
            h !== b &&
              ((U = Lf),
              (z = "onMouseLeave"),
              (m = "onMouseEnter"),
              (f = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((U = Qf), (z = "onPointerLeave"), (m = "onPointerEnter"), (f = "pointer")),
              (P = h == null ? M : Ml(h)),
              (x = b == null ? M : Ml(b)),
              (M = new U(z, f + "leave", h, l, j)),
              (M.target = P),
              (M.relatedTarget = x),
              (z = null),
              yt(j) === g && ((U = new U(m, f + "enter", b, l, j)), (U.target = x), (U.relatedTarget = P), (z = U)),
              (P = z),
              (U = h && b ? R(h, b, Fg) : null),
              h !== null && Vh(S, M, h, U, !1),
              b !== null && P !== null && Vh(S, P, b, U, !0)));
        }
        e: {
          if (
            ((h = g ? Ml(g) : window),
            (b = h.nodeName && h.nodeName.toLowerCase()),
            b === "select" || (b === "input" && h.type === "file"))
          )
            var w = If;
          else if ($f(h))
            if (ed) w = I0;
            else {
              w = $0;
              var se = W0;
            }
          else
            ((b = h.nodeName),
              !b || b.toLowerCase() !== "input" || (h.type !== "checkbox" && h.type !== "radio")
                ? g && Zc(g.elementType) && (w = If)
                : (w = P0));
          if (w && (w = w(e, g))) {
            Pf(S, w, l, j);
            break e;
          }
          se && se(e, h, g);
        }
        switch (((se = g ? Ml(g) : window), e)) {
          case "focusin":
            ($f(se) || se.contentEditable === "true") && ((bn = se), (is = g), (vi = null));
            break;
          case "focusout":
            vi = is = bn = null;
            break;
          case "mousedown":
            us = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((us = !1), sd(S, l, j));
            break;
          case "selectionchange":
            if (tg) break;
          case "keydown":
          case "keyup":
            sd(S, l, j);
        }
        var V;
        if (es)
          e: {
            switch (e) {
              case "compositionstart":
                var J = "onCompositionStart";
                break e;
              case "compositionend":
                J = "onCompositionEnd";
                break e;
              case "compositionupdate":
                J = "onCompositionUpdate";
                break e;
            }
            J = void 0;
          }
        else
          xn
            ? Ff(e, l) && (J = "onCompositionEnd")
            : e === "keydown" && l.keyCode === 229 && (J = "onCompositionStart");
        (J &&
          (Xf &&
            l.locale !== "ko" &&
            (xn || J !== "onCompositionStart"
              ? J === "onCompositionEnd" && xn && (V = Yf())
              : ((Wl = j), (Fc = "value" in Wl ? Wl.value : Wl.textContent), (xn = !0))),
          (se = jc(g, J)),
          0 < se.length &&
            ((J = new Zf(J, e, null, l, j)),
            S.push({ event: J, listeners: se }),
            V ? (J.data = V) : ((V = Wf(l)), V !== null && (J.data = V)))),
          (V = Q0 ? X0(e, l) : K0(e, l)) &&
            ((J = jc(g, "onBeforeInput")),
            0 < J.length &&
              ((se = new Zf("onBeforeInput", "beforeinput", null, l, j)),
              S.push({ event: se, listeners: J }),
              (se.data = V))),
          Qg(S, e, g, l, j));
      }
      Gh(S, t);
    });
  }
  function Yi(e, t, l) {
    return { instance: e, listener: t, currentTarget: l };
  }
  function jc(e, t) {
    for (var l = t + "Capture", a = []; e !== null;) {
      var n = e,
        u = n.stateNode;
      if (
        ((n = n.tag),
        (n !== 5 && n !== 26 && n !== 27) ||
          u === null ||
          ((n = si(e, l)), n != null && a.unshift(Yi(e, n, u)), (n = si(e, t)), n != null && a.push(Yi(e, n, u))),
        e.tag === 3)
      )
        return a;
      e = e.return;
    }
    return [];
  }
  function Fg(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Vh(e, t, l, a, n) {
    for (var u = t._reactName, c = []; l !== null && l !== a;) {
      var s = l,
        r = s.alternate,
        g = s.stateNode;
      if (((s = s.tag), r !== null && r === a)) break;
      ((s !== 5 && s !== 26 && s !== 27) ||
        g === null ||
        ((r = g),
        n
          ? ((g = si(l, u)), g != null && c.unshift(Yi(l, g, r)))
          : n || ((g = si(l, u)), g != null && c.push(Yi(l, g, r)))),
        (l = l.return));
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var Wg = /\r\n?/g,
    $g = /\u0000|\uFFFD/g;
  function Lh(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        Wg,
        `
`,
      )
      .replace($g, "");
  }
  function Zh(e, t) {
    return ((t = Lh(t)), Lh(e) === t);
  }
  function Ae(e, t, l, a, n, u) {
    switch (l) {
      case "children":
        if (typeof a == "string") t === "body" || (t === "textarea" && a === "") || gn(e, a);
        else if (typeof a == "number" || typeof a == "bigint") t !== "body" && gn(e, "" + a);
        else return;
        break;
      case "className":
        hu(e, "class", a);
        break;
      case "tabIndex":
        hu(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        hu(e, l, a);
        break;
      case "style":
        qf(e, a, u);
        return;
      case "data":
        if (t !== "object") {
          hu(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        ((a = mu(a)), e.setAttribute(l, a));
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof u == "function" &&
            (l === "formAction"
              ? (t !== "input" && Ae(e, t, "name", n.name, n, null),
                Ae(e, t, "formEncType", n.formEncType, n, null),
                Ae(e, t, "formMethod", n.formMethod, n, null),
                Ae(e, t, "formTarget", n.formTarget, n, null))
              : (Ae(e, t, "encType", n.encType, n, null),
                Ae(e, t, "method", n.method, n, null),
                Ae(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        ((a = mu(a)), e.setAttribute(l, a));
        break;
      case "onClick":
        a != null && (e.onclick = yl);
        return;
      case "onScroll":
        a != null && ue("scroll", e);
        return;
      case "onScrollEnd":
        a != null && ue("scrollend", e);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(y(61));
          if (((l = a.__html), l != null)) {
            if (n.children != null) throw Error(y(60));
            (u != null ? u.__html : void 0) !== l && (e.innerHTML = l);
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        ((l = mu(a)), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", l));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0
          ? e.setAttribute(l, "")
          : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol"
            ? e.setAttribute(l, a)
            : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a
          ? e.setAttribute(l, a)
          : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
          ? e.removeAttribute(l)
          : e.setAttribute(l, a);
        break;
      case "popover":
        (ue("beforetoggle", e), ue("toggle", e), ou(e, "popover", a));
        break;
      case "xlinkActuate":
        Cl(e, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
        break;
      case "xlinkArcrole":
        Cl(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
        break;
      case "xlinkRole":
        Cl(e, "http://www.w3.org/1999/xlink", "xlink:role", a);
        break;
      case "xlinkShow":
        Cl(e, "http://www.w3.org/1999/xlink", "xlink:show", a);
        break;
      case "xlinkTitle":
        Cl(e, "http://www.w3.org/1999/xlink", "xlink:title", a);
        break;
      case "xlinkType":
        Cl(e, "http://www.w3.org/1999/xlink", "xlink:type", a);
        break;
      case "xmlBase":
        Cl(e, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
        break;
      case "xmlLang":
        Cl(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
        break;
      case "xmlSpace":
        Cl(e, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
        break;
      case "is":
        ou(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < l.length) || (l[0] !== "o" && l[0] !== "O") || (l[1] !== "n" && l[1] !== "N"))
          ((l = v0.get(l) || l), ou(e, l, a));
        else return;
    }
    xe = !0;
  }
  function Vr(e, t, l, a, n, u) {
    switch (l) {
      case "style":
        qf(e, a, u);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(y(61));
          if (((l = a.__html), l != null)) {
            if (n.children != null) throw Error(y(60));
            (u != null ? u.__html : void 0) !== l && (e.innerHTML = l);
          }
        }
        break;
      case "children":
        if (typeof a == "string") gn(e, a);
        else if (typeof a == "number" || typeof a == "bigint") gn(e, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && ue("scroll", e);
        return;
      case "onScrollEnd":
        a != null && ue("scrollend", e);
        return;
      case "onClick":
        a != null && (e.onclick = yl);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!Af.hasOwnProperty(l))
          e: {
            if (
              l[0] === "o" &&
              l[1] === "n" &&
              ((n = l.endsWith("Capture")),
              (u = l.slice(2, n ? l.length - 7 : void 0)),
              (t = e[gt] || null),
              (t = t != null ? t[l] : null),
              typeof t == "function" && e.removeEventListener(u, t, n),
              typeof a == "function")
            ) {
              (typeof t != "function" &&
                t !== null &&
                (l in e ? (e[l] = null) : e.hasAttribute(l) && e.removeAttribute(l)),
                e.addEventListener(u, a, n));
              break e;
            }
            ((xe = !0), l in e ? (e[l] = a) : a === !0 ? e.setAttribute(l, "") : ou(e, l, a));
          }
        return;
    }
    xe = !0;
  }
  function dt(e, t, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (ue("error", e), ue("load", e));
        var a = !1,
          n = !1,
          u;
        for (u in l)
          if (l.hasOwnProperty(u)) {
            var c = l[u];
            if (c != null)
              switch (u) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(y(137, t));
                default:
                  Ae(e, t, u, c, l, null);
              }
          }
        (n && Ae(e, t, "srcSet", l.srcSet, l, null), a && Ae(e, t, "src", l.src, l, null));
        return;
      case "input":
        ue("invalid", e);
        var s = (u = c = n = null),
          r = null,
          g = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var j = l[a];
            if (j != null)
              switch (a) {
                case "name":
                  n = j;
                  break;
                case "type":
                  c = j;
                  break;
                case "checked":
                  r = j;
                  break;
                case "defaultChecked":
                  g = j;
                  break;
                case "value":
                  u = j;
                  break;
                case "defaultValue":
                  s = j;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (j != null) throw Error(y(137, t));
                  break;
                default:
                  Ae(e, t, a, j, l, null);
              }
          }
        Rf(e, u, s, r, g, c, n, !1);
        return;
      case "select":
        (ue("invalid", e), (a = c = u = null));
        for (n in l)
          if (l.hasOwnProperty(n) && ((s = l[n]), s != null))
            switch (n) {
              case "value":
                u = s;
                break;
              case "defaultValue":
                c = s;
                break;
              case "multiple":
                a = s;
              default:
                Ae(e, t, n, s, l, null);
            }
        ((t = u), (l = c), (e.multiple = !!a), t != null ? mn(e, !!a, t, !1) : l != null && mn(e, !!a, l, !0));
        return;
      case "textarea":
        (ue("invalid", e), (u = n = a = null));
        for (c in l)
          if (l.hasOwnProperty(c) && ((s = l[c]), s != null))
            switch (c) {
              case "value":
                a = s;
                break;
              case "defaultValue":
                n = s;
                break;
              case "children":
                u = s;
                break;
              case "dangerouslySetInnerHTML":
                if (s != null) throw Error(y(91));
                break;
              default:
                Ae(e, t, c, s, l, null);
            }
        Uf(e, a, n, u);
        return;
      case "option":
        for (r in l)
          if (l.hasOwnProperty(r) && ((a = l[r]), a != null))
            switch (r) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Ae(e, t, r, a, l, null);
            }
        return;
      case "dialog":
        (ue("beforetoggle", e), ue("toggle", e), ue("cancel", e), ue("close", e));
        break;
      case "iframe":
      case "object":
        ue("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Gi.length; a++) ue(Gi[a], e);
        break;
      case "image":
        (ue("error", e), ue("load", e));
        break;
      case "details":
        ue("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        (ue("error", e), ue("load", e));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (g in l)
          if (l.hasOwnProperty(g) && ((a = l[g]), a != null))
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(y(137, t));
              default:
                Ae(e, t, g, a, l, null);
            }
        return;
      default:
        if (Zc(t)) {
          for (j in l) l.hasOwnProperty(j) && ((a = l[j]), a !== void 0 && Vr(e, t, j, a, l, void 0));
          return;
        }
    }
    for (s in l) l.hasOwnProperty(s) && ((a = l[s]), a != null && Ae(e, t, s, a, l, null));
  }
  var Pg = {};
  function Ig(e, t, l, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null,
          u = null,
          c = null,
          s = null,
          r = null,
          g = null,
          j = null;
        for (b in l) {
          var S = l[b];
          if (l.hasOwnProperty(b) && S != null)
            switch (b) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                r = S;
              default:
                a.hasOwnProperty(b) || Ae(e, t, b, null, a, S);
            }
        }
        for (var h in a) {
          var b = a[h];
          if (((S = l[h]), a.hasOwnProperty(h) && (b != null || S != null)))
            switch (h) {
              case "type":
                (b !== S && (xe = !0), (u = b));
                break;
              case "name":
                (b !== S && (xe = !0), (n = b));
                break;
              case "checked":
                (b !== S && (xe = !0), (g = b));
                break;
              case "defaultChecked":
                (b !== S && (xe = !0), (j = b));
                break;
              case "value":
                (b !== S && (xe = !0), (c = b));
                break;
              case "defaultValue":
                (b !== S && (xe = !0), (s = b));
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (b != null) throw Error(y(137, t));
                break;
              default:
                b !== S && Ae(e, t, h, b, a, S);
            }
        }
        Vc(e, c, s, r, g, j, u, n);
        return;
      case "select":
        b = c = s = h = null;
        for (u in l)
          if (((r = l[u]), l.hasOwnProperty(u) && r != null))
            switch (u) {
              case "value":
                break;
              case "multiple":
                b = r;
              default:
                a.hasOwnProperty(u) || Ae(e, t, u, null, a, r);
            }
        for (n in a)
          if (((u = a[n]), (r = l[n]), a.hasOwnProperty(n) && (u != null || r != null)))
            switch (n) {
              case "value":
                (u !== r && (xe = !0), (h = u));
                break;
              case "defaultValue":
                (u !== r && (xe = !0), (s = u));
                break;
              case "multiple":
                (u !== r && (xe = !0), (c = u));
              default:
                u !== r && Ae(e, t, n, u, a, r);
            }
        ((t = s),
          (l = c),
          (a = b),
          h != null ? mn(e, !!l, h, !1) : !!a != !!l && (t != null ? mn(e, !!l, t, !0) : mn(e, !!l, l ? [] : "", !1)));
        return;
      case "textarea":
        b = h = null;
        for (s in l)
          if (((n = l[s]), l.hasOwnProperty(s) && n != null && !a.hasOwnProperty(s)))
            switch (s) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ae(e, t, s, null, a, n);
            }
        for (c in a)
          if (((n = a[c]), (u = l[c]), a.hasOwnProperty(c) && (n != null || u != null)))
            switch (c) {
              case "value":
                (n !== u && (xe = !0), (h = n));
                break;
              case "defaultValue":
                (n !== u && (xe = !0), (b = n));
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(y(91));
                break;
              default:
                n !== u && Ae(e, t, c, n, a, u);
            }
        Hf(e, h, b);
        return;
      case "option":
        for (var M in l)
          if (((h = l[M]), l.hasOwnProperty(M) && h != null && !a.hasOwnProperty(M)))
            switch (M) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ae(e, t, M, null, a, h);
            }
        for (r in a)
          if (((h = a[r]), (b = l[r]), a.hasOwnProperty(r) && h !== b && (h != null || b != null)))
            switch (r) {
              case "selected":
                (h !== b && (xe = !0), (e.selected = h && typeof h != "function" && typeof h != "symbol"));
                break;
              default:
                Ae(e, t, r, h, a, b);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var U in l)
          ((h = l[U]), l.hasOwnProperty(U) && h != null && !a.hasOwnProperty(U) && Ae(e, t, U, null, a, h));
        for (g in a)
          if (((h = a[g]), (b = l[g]), a.hasOwnProperty(g) && h !== b && (h != null || b != null)))
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (h != null) throw Error(y(137, t));
                break;
              default:
                Ae(e, t, g, h, a, b);
            }
        return;
      default:
        if (Zc(t)) {
          for (var P in l)
            ((h = l[P]), l.hasOwnProperty(P) && h !== void 0 && !a.hasOwnProperty(P) && Vr(e, t, P, void 0, a, h));
          for (j in a)
            ((h = a[j]),
              (b = l[j]),
              !a.hasOwnProperty(j) || h === b || (h === void 0 && b === void 0) || Vr(e, t, j, h, a, b));
          return;
        }
    }
    for (var m in l) ((h = l[m]), l.hasOwnProperty(m) && h != null && !a.hasOwnProperty(m) && Ae(e, t, m, null, a, h));
    for (S in a)
      ((h = a[S]), (b = l[S]), !a.hasOwnProperty(S) || h === b || (h == null && b == null) || Ae(e, t, S, h, a, b));
  }
  function Qh(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function ev() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a],
          u = n.transferSize,
          c = n.initiatorType,
          s = n.duration;
        if (u && s && Qh(c)) {
          for (c = 0, s = n.responseEnd, a += 1; a < l.length; a++) {
            var r = l[a],
              g = r.startTime;
            if (g > s) break;
            var j = r.transferSize,
              S = r.initiatorType;
            j && Qh(S) && ((r = r.responseEnd), (c += j * (r < s ? 1 : (s - g) / (r - g))));
          }
          if ((--a, (t += (8 * (u + c)) / (n.duration / 1e3)), e++, 10 < e)) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && ((e = navigator.connection.downlink), typeof e == "number") ? e : 5;
  }
  var Lr = null,
    Zr = null;
  function Vi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Xh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Kh(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function Jh(e, t, l, a) {
    return ((l = Vi(l).createElement(e)), (l[$e] = a), (l[gt] = t), dt(l, e, t), lt(l), l);
  }
  function Qr(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      typeof t.children == "bigint" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Xr = null;
  function tv() {
    var e = window.event;
    return e && e.type === "popstate" ? (e === Xr ? !1 : ((Xr = e), !0)) : ((Xr = null), !1);
  }
  var Kr = typeof setTimeout == "function" ? setTimeout : void 0,
    lv = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Fh = typeof Promise == "function" ? Promise : void 0,
    Wh = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Kr,
    av =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Fh < "u"
          ? function (e) {
              return Fh.resolve(null).then(e).catch(nv);
            }
          : Kr;
  function nv(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function va(e) {
    return e === "head";
  }
  function $h(e, t) {
    var l = t,
      a = 0;
    do {
      var n = l.nextSibling;
      if ((e.removeChild(l), n && n.nodeType === 8))
        if (((l = n.data), l === "/$" || l === "/&")) {
          if (a === 0) {
            (e.removeChild(n), Pn(t));
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&") a++;
        else if (l === "html") tf(e.ownerDocument.documentElement);
        else if (l === "head") {
          ((l = e.ownerDocument.head), tf(l));
          for (var u = l.firstChild; u;) {
            var c = u.nextSibling,
              s = u.nodeName;
            (u[De] ||
              s === "SCRIPT" ||
              s === "STYLE" ||
              (s === "LINK" && u.rel.toLowerCase() === "stylesheet") ||
              l.removeChild(u),
              (u = c));
          }
        } else l === "body" && tf(e.ownerDocument.body);
      l = n;
    } while (l);
    Pn(t);
  }
  function Ph(e, t) {
    var l = e;
    e = 0;
    do {
      var a = l.nextSibling;
      if (
        (l.nodeType === 1
          ? t
            ? ((l._stashedDisplay = l.style.display), (l.style.display = "none"))
            : ((l.style.display = l._stashedDisplay || ""),
              l.getAttribute("style") === "" && l.removeAttribute("style"))
          : l.nodeType === 3 &&
            (t ? ((l._stashedText = l.nodeValue), (l.nodeValue = "")) : (l.nodeValue = l._stashedText || "")),
        a && a.nodeType === 8)
      )
        if (((l = a.data), l === "/$")) {
          if (e === 0) break;
          e--;
        } else (l !== "$" && l !== "$?" && l !== "$~" && l !== "$!") || e++;
      l = a;
    } while (l);
  }
  function Ih(e, t, l) {
    if (
      ((t = CSS.escape(t) !== t ? "r-" + btoa(t).replace(/=/g, "") : t),
      (e.style.viewTransitionName = t),
      l != null && (e.style.viewTransitionClass = l),
      (l = getComputedStyle(e)),
      l.display === "inline")
    ) {
      if (((t = e.getClientRects()), t.length === 1)) var a = 1;
      else
        for (var n = (a = 0); n < t.length; n++) {
          var u = t[n];
          0 < u.width && 0 < u.height && a++;
        }
      a === 1 &&
        ((e = e.style),
        (e.display = t.length === 1 ? "inline-block" : "block"),
        (e.marginTop = "-" + l.paddingTop),
        (e.marginBottom = "-" + l.paddingBottom));
    }
  }
  function em(e, t) {
    ((e = e.style), (t = t.style));
    var l =
      t != null
        ? t.hasOwnProperty("viewTransitionName")
          ? t.viewTransitionName
          : t.hasOwnProperty("view-transition-name")
            ? t["view-transition-name"]
            : null
        : null;
    ((e.viewTransitionName = l == null || typeof l == "boolean" ? "" : ("" + l).trim()),
      (l =
        t != null
          ? t.hasOwnProperty("viewTransitionClass")
            ? t.viewTransitionClass
            : t.hasOwnProperty("view-transition-class")
              ? t["view-transition-class"]
              : null
          : null),
      (e.viewTransitionClass = l == null || typeof l == "boolean" ? "" : ("" + l).trim()),
      e.display === "inline-block" &&
        (t == null
          ? (e.display = e.margin = "")
          : ((l = t.display),
            (e.display = l == null || typeof l == "boolean" ? "" : l),
            (l = t.margin),
            l != null
              ? (e.margin = l)
              : ((l = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"]),
                (e.marginTop = l == null || typeof l == "boolean" ? "" : l),
                (t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"]),
                (e.marginBottom = t == null || typeof t == "boolean" ? "" : t)))));
  }
  function iv(e, t, l) {
    return (
      (l = l.ownerDocument.defaultView),
      {
        rect: e,
        abs: t.position === "absolute" || t.position === "fixed",
        clip:
          t.clipPath !== "none" ||
          t.overflow !== "visible" ||
          t.filter !== "none" ||
          t.mask !== "none" ||
          t.mask !== "none" ||
          t.borderRadius !== "0px",
        view: 0 <= e.bottom && 0 <= e.right && e.top <= l.innerHeight && e.left <= l.innerWidth,
      }
    );
  }
  function Jr(e) {
    var t = e.getBoundingClientRect(),
      l = getComputedStyle(e);
    return iv(t, l, e);
  }
  function uv(e) {
    return e.documentElement.clientHeight;
  }
  function cv(e) {
    (this.addEventListener("load", e), this.addEventListener("error", e));
  }
  function sv(e, t, l, a, n, u, c, s, r) {
    var g = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var j = g.startViewTransition({
        update: function () {
          var h = g.defaultView,
            b = h.navigation && h.navigation.transition,
            M = g.fonts.status;
          a();
          var U = [];
          if (
            (M === "loaded" && (uv(g), g.fonts.status === "loading" && U.push(g.fonts.ready)),
            (M = U.length),
            e !== null)
          )
            for (var P = e.suspenseyImages, m = 0, f = 0; f < P.length; f++) {
              var x = P[f];
              if (!x.complete) {
                var z = x.getBoundingClientRect();
                if (0 < z.bottom && 0 < z.right && z.top < h.innerHeight && z.left < h.innerWidth) {
                  if (((m += pm(x)), m > Sc)) {
                    U.length = M;
                    break;
                  }
                  ((x = new Promise(cv.bind(x))), U.push(x));
                }
              }
            }
          if (0 < U.length)
            return (
              (h = Promise.race([
                Promise.all(U),
                new Promise(function (w) {
                  return setTimeout(w, 500);
                }),
              ]).then(n, n)),
              (b ? Promise.allSettled([b.finished, h]) : h).then(u, u)
            );
          if ((n(), b)) return b.finished.then(u, u);
          u();
        },
        types: l,
      });
      g.__reactViewTransition = j;
      var S = [];
      return (
        j.ready.then(
          function () {
            for (var h = g.documentElement.getAnimations({ subtree: !0 }), b = 0; b < h.length; b++) {
              var M = h[b],
                U = M.effect,
                P = U.pseudoElement;
              if (P != null && P.startsWith("::view-transition")) {
                (S.push(M), (M = U.getKeyframes()));
                for (var m = (P = void 0), f = !0, x = 0; x < M.length; x++) {
                  var z = M[x],
                    w = z.width;
                  if (P === void 0) P = w;
                  else if (P !== w) {
                    f = !1;
                    break;
                  }
                  if (((w = z.height), m === void 0)) m = w;
                  else if (m !== w) {
                    f = !1;
                    break;
                  }
                  (delete z.width, delete z.height, z.transform === "none" && delete z.transform);
                }
                f &&
                  P !== void 0 &&
                  m !== void 0 &&
                  (U.setKeyframes(M),
                  (f = getComputedStyle(U.target, U.pseudoElement)),
                  f.width !== P || f.height !== m) &&
                  ((f = M[0]),
                  (f.width = P),
                  (f.height = m),
                  (f = M[M.length - 1]),
                  (f.width = P),
                  (f.height = m),
                  U.setKeyframes(M));
              }
            }
            c();
          },
          function (h) {
            g.__reactViewTransition === j && (g.__reactViewTransition = null);
            try {
              if (typeof h == "object" && h !== null)
                switch (h.name) {
                  case "InvalidStateError":
                    (h.message === "View transition was skipped because document visibility state is hidden." ||
                      h.message === "Skipping view transition because document visibility state has become hidden." ||
                      h.message === "Skipping view transition because viewport size changed." ||
                      h.message === "Transition was aborted because of invalid state") &&
                      (h = null);
                }
              h !== null && r(h);
            } finally {
              (a(), n(), c());
            }
          },
        ),
        j.finished.finally(function () {
          for (var h = 0; h < S.length; h++) S[h].cancel();
          (g.__reactViewTransition === j && (g.__reactViewTransition = null), s());
        }),
        j
      );
    } catch {
      return (a(), n(), c(), null);
    }
  }
  function en(e, t) {
    ((this._scope = document.documentElement), (this._selector = "::view-transition-" + e + "(" + t + ")"));
  }
  ((en.prototype.animate = function (e, t) {
    return (
      (t = typeof t == "number" ? { duration: t } : te({}, t)),
      (t.pseudoElement = this._selector),
      this._scope.animate(e, t)
    );
  }),
    (en.prototype.getAnimations = function () {
      for (
        var e = this._scope, t = this._selector, l = e.getAnimations({ subtree: !0 }), a = [], n = 0;
        n < l.length;
        n++
      ) {
        var u = l[n].effect;
        u !== null && u.target === e && u.pseudoElement === t && a.push(l[n]);
      }
      return a;
    }),
    (en.prototype.getComputedStyle = function () {
      return getComputedStyle(this._scope, this._selector);
    }));
  function tm(e) {
    return {
      name: e,
      group: new en("group", e),
      imagePair: new en("image-pair", e),
      old: new en("old", e),
      new: new en("new", e),
    };
  }
  function Kt(e) {
    ((this._fragmentFiber = e), (this._observers = this._eventListeners = null));
  }
  Kt.prototype.addEventListener = function (e, t, l) {
    var a = null,
      n = null;
    if (!(l != null && typeof l != "boolean" && ((a = l.signal || null), a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var u = this._eventListeners;
      if (am(u, e, t, l) === -1) {
        var c = this,
          s = t;
        (l != null &&
          typeof l != "boolean" &&
          l.once === !0 &&
          (s = function (r) {
            (c.removeEventListener(e, t, l), typeof t == "function" ? t.call(this, r) : t.handleEvent(r));
          }),
          a !== null &&
            ((n = c.removeEventListener.bind(c, e, t, l)),
            a.addEventListener("abort", n, { once: !0 }),
            (n = a.removeEventListener.bind(a, "abort", n))),
          (a = Xn(l)),
          u.push({ type: e, listener: t, optionsOrUseCapture: l, attachedListener: s, cleanup: n }),
          p(this._fragmentFiber.child, !1, rv, e, s, a));
      }
      this._eventListeners = u;
    }
  };
  function rv(e, t, l, a) {
    return (ve(e).addEventListener(t, l, a), !1);
  }
  Kt.prototype.removeEventListener = function (e, t, l) {
    var a = this._eventListeners;
    if (a !== null && ((t = am(a, e, t, l)), t !== -1)) {
      var n = a[t];
      l = n.attachedListener;
      var u = n.cleanup;
      ((n = Xn(n.optionsOrUseCapture)),
        p(this._fragmentFiber.child, !1, fv, e, l, n),
        a.splice(t, 1),
        u !== null && u());
    }
  };
  function fv(e, t, l, a) {
    return (ve(e).removeEventListener(t, l, a), !1);
  }
  function Xn(e) {
    return e != null && typeof e != "boolean" && (e.once === !0 || e.signal instanceof AbortSignal)
      ? { capture: e.capture, passive: e.passive }
      : e;
  }
  function lm(e) {
    return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
  }
  function am(e, t, l, a) {
    if (e.length === 0) return -1;
    a = lm(a);
    for (var n = 0; n < e.length; n++) {
      var u = e[n];
      if (u.type === t && u.listener === l && lm(u.optionsOrUseCapture) === a) return n;
    }
    return -1;
  }
  ((Kt.prototype.dispatchEvent = function (e) {
    var t = B(this._fragmentFiber);
    if (t === null) return !0;
    t = ve(t);
    var l = this._eventListeners;
    if ((l !== null && 0 < l.length) || !e.bubbles) {
      var a = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (l)
        for (var n = 0; n < l.length; n++) {
          var u = l[n];
          a.addEventListener(u.type, u.attachedListener, Xn(u.optionsOrUseCapture));
        }
      if ((t.appendChild(a), (e = a.dispatchEvent(e)), l))
        for (n = 0; n < l.length; n++)
          ((u = l[n]), a.removeEventListener(u.type, u.attachedListener, Xn(u.optionsOrUseCapture)));
      return (t.removeChild(a), e);
    }
    return t.dispatchEvent(e);
  }),
    (Kt.prototype.focus = function (e) {
      p(this._fragmentFiber.child, !0, nm, e, void 0, void 0);
    }));
  function nm(e, t) {
    return e.tag === 6 ? !1 : ((e = ve(e)), zv(e, t));
  }
  Kt.prototype.focusLast = function (e) {
    var t = [];
    p(this._fragmentFiber.child, !0, Fr, t, void 0, void 0);
    for (var l = t.length - 1; 0 <= l && !nm(t[l], e); l--);
  };
  function Fr(e, t) {
    return (t.push(e), !1);
  }
  Kt.prototype.blur = function () {
    var e = B(this._fragmentFiber);
    e !== null &&
      ((e = ve(e)), (e = Vi(e).activeElement), e !== null && p(this._fragmentFiber.child, !1, dv, e, void 0, void 0));
  };
  function dv(e, t) {
    return e.tag === 6 ? !1 : ((e = ve(e)), e === t || e.contains(t) ? (t.blur(), !0) : !1);
  }
  Kt.prototype.observeUsing = function (e) {
    (this._observers === null && (this._observers = new Set()),
      this._observers.add(e),
      p(this._fragmentFiber.child, !1, ov, e, void 0, void 0));
  };
  function ov(e, t) {
    return (e.tag === 6 || ((e = ve(e)), t.observe(e)), !1);
  }
  Kt.prototype.unobserveUsing = function (e) {
    var t = this._observers;
    if (t !== null && t.has(e)) {
      (t.delete(e), p(this._fragmentFiber.child, !1, hv, e, void 0, void 0));
      for (var l = (t = 0); l < ml.length; l++) {
        var a = ml[l];
        a.fragmentInstance === this && a.observer === e ? e.unobserve(a.instance) : (ml[t++] = a);
      }
      ml.length = t;
    }
  };
  function hv(e, t) {
    return (e.tag === 6 || ((e = ve(e)), t.unobserve(e)), !1);
  }
  var ml = [],
    Wr = !1;
  function mv(e, t, l) {
    (ml.push({ fragmentInstance: e, observer: t, instance: l }),
      Wr ||
        ((Wr = !0),
        Sv(function () {
          Wr = !1;
          var a = ml;
          ml = [];
          for (var n = 0; n < a.length; n++) {
            var u = a[n];
            u.observer.unobserve(u.instance);
          }
        })));
  }
  Kt.prototype.getClientRects = function () {
    var e = [];
    return (p(this._fragmentFiber.child, !1, gv, e, void 0, void 0), e);
  };
  function gv(e, t) {
    if (e.tag === 6) {
      e = e.stateNode;
      var l = e.ownerDocument.createRange();
      (l.selectNodeContents(e), t.push.apply(t, l.getClientRects()));
    } else ((e = ve(e)), t.push.apply(t, e.getClientRects()));
    return !1;
  }
  ((Kt.prototype.getRootNode = function (e) {
    var t = B(this._fragmentFiber);
    return t === null ? this : ve(t).getRootNode(e);
  }),
    (Kt.prototype.compareDocumentPosition = function (e) {
      var t = B(this._fragmentFiber);
      if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
      var l = [];
      p(this._fragmentFiber.child, !1, Fr, l, void 0, void 0);
      var a = ve(t);
      if (l.length === 0) {
        if (((l = a), ge(this._fragmentFiber))) {
          e: {
            for (t = this._fragmentFiber.return; t !== null;) {
              if (t.tag === 4) {
                t = t.stateNode.containerInfo;
                break e;
              }
              if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
              t = t.return;
            }
            t = null;
          }
          t != null && (l = t);
        }
        t = this._fragmentFiber;
        var n = (a = l.compareDocumentPosition(e));
        return (
          l === e
            ? (n = Node.DOCUMENT_POSITION_CONTAINS)
            : a & Node.DOCUMENT_POSITION_CONTAINED_BY &&
              ((l = O(t)[1]),
              l === null
                ? (n = Node.DOCUMENT_POSITION_PRECEDING)
                : ((e = ve(l).compareDocumentPosition(e)),
                  (n =
                    e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING
                      ? Node.DOCUMENT_POSITION_FOLLOWING
                      : Node.DOCUMENT_POSITION_PRECEDING))),
          (n |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC)
        );
      }
      ((t = ve(l[0])), (n = ve(l[l.length - 1])));
      var u = ge(this._fragmentFiber) ? t.parentElement : a;
      if (u == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
      ((a = u.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY),
        (u = u.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY));
      var c = t.compareDocumentPosition(e),
        s = n.compareDocumentPosition(e),
        r = c & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
      return (
        (s = a && u && c & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING),
        (t =
          (a && t === e) || (u && n === e) || r || s
            ? Node.DOCUMENT_POSITION_CONTAINED_BY
            : (!a && t === e) || (!u && n === e)
              ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
              : c),
        t & Node.DOCUMENT_POSITION_DISCONNECTED ||
        t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC ||
        vv(t, this._fragmentFiber, l[0], l[l.length - 1], e)
          ? t
          : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
      );
    }));
  function vv(e, t, l, a, n) {
    var u = yt(n);
    if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if ((l = !!u))
        e: {
          for (; u !== null;) {
            if (u.tag === 7 && (u === t || u.alternate === t)) {
              l = !0;
              break e;
            }
            u = u.return;
          }
          l = !1;
        }
      return l;
    }
    if (e & Node.DOCUMENT_POSITION_CONTAINS) {
      if (u === null) return ((u = n.ownerDocument), n === u || n === u.documentElement || n === u.body);
      e: {
        for (u = t, t = B(t); u !== null;) {
          if (!((u.tag !== 5 && u.tag !== 3 && u.tag !== 27) || (u !== t && u.alternate !== t))) {
            u = !0;
            break e;
          }
          u = u.return;
        }
        u = !1;
      }
      return u;
    }
    return e & Node.DOCUMENT_POSITION_PRECEDING
      ? ((t = !!u) &&
          !(t = u === l) &&
          ((t = R(l, u, Ot)), t === null ? (t = !1) : (p(t, !0, k, u, l), (u = ht), (ht = null), (t = u !== null))),
        t)
      : e & Node.DOCUMENT_POSITION_FOLLOWING
        ? ((t = !!u) &&
            !(t = u === a) &&
            ((t = R(a, u, Ot)),
            t === null ? (t = !1) : (p(t, !0, ye, u, a), (u = ht), (Qe = ht = null), (t = u !== null))),
          t)
        : !1;
  }
  function im(e, t) {
    var l = e.ownerDocument.createRange();
    (l.selectNodeContents(e),
      (e = l.getBoundingClientRect()),
      window.scrollTo(
        window.scrollX + e.left,
        t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight,
      ));
  }
  Kt.prototype.scrollIntoView = function (e) {
    if (typeof e == "object") throw Error(y(566));
    var t = [];
    p(this._fragmentFiber.child, !1, Fr, t, void 0, void 0);
    var l = e !== !1;
    if (t.length === 0) {
      var a = O(this._fragmentFiber);
      if (((a = l ? a[1] || a[0] || B(this._fragmentFiber) : a[0] || a[1]), a === null)) return;
      if (a.tag === 6) {
        ((e = ve(a)), im(e, l));
        return;
      }
      if (((a = ve(a)), a.nodeType !== 9)) {
        if (a.nodeType === 11) {
          ((l = "host" in a ? a.host : null), l !== null && l.scrollIntoView(e));
          return;
        }
        a.scrollIntoView(e);
      }
    }
    for (a = l ? t.length - 1 : 0; a !== (l ? -1 : t.length);) {
      var n = t[a];
      (n.tag === 6 ? ((n = ve(n)), im(n, l)) : ve(n).scrollIntoView(e), (a += l ? -1 : 1));
    }
  };
  function yv(e, t) {
    return ((e = ve(e)), um(e, t), !1);
  }
  function um(e, t) {
    (e.reactFragments == null && (e.reactFragments = new Set()), e.reactFragments.add(t));
  }
  function cm(e, t) {
    var l = t._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a];
        e.addEventListener(n.type, n.attachedListener, Xn(n.optionsOrUseCapture));
      }
    e.nodeType !== 3 &&
      ((l = t._observers),
      l !== null &&
        l.forEach(function (u) {
          for (var c = 0, s = 0; s < ml.length; s++) {
            var r = ml[s];
            (r.fragmentInstance !== t || r.observer !== u || r.instance !== e) && (ml[c++] = r);
          }
          ((ml.length = c), u.observe(e));
        }),
      um(e, t));
  }
  function xv(e, t) {
    var l = t._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a];
        e.removeEventListener(n.type, n.attachedListener, Xn(n.optionsOrUseCapture));
      }
    e.nodeType !== 3 &&
      ((l = t._observers),
      l !== null &&
        l.forEach(function (u) {
          typeof u.rootMargin == "string" ? mv(t, u, e) : u.unobserve(e);
        }),
      e.reactFragments != null && e.reactFragments.delete(t));
  }
  function $r(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
      var l = t;
      switch (((t = t.nextSibling), l.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          ($r(l), vt(l));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(l);
    }
  }
  function bv(e, t, l, a) {
    for (; e.nodeType === 1;) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
      } else if (a) {
        if (!e[De])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (((u = e.getAttribute("rel")), u === "stylesheet" && e.hasAttribute("data-precedence"))) break;
              if (
                u !== n.rel ||
                e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) ||
                e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) ||
                e.getAttribute("title") !== (n.title == null ? null : n.title)
              )
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (
                ((u = e.getAttribute("src")),
                (u !== (n.src == null ? null : n.src) ||
                  e.getAttribute("type") !== (n.type == null ? null : n.type) ||
                  e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) &&
                  u &&
                  e.hasAttribute("async") &&
                  !e.hasAttribute("itemprop"))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === u) return e;
      } else return e;
      if (((e = al(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function jv(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3;)
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l) ||
        ((e = al(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function sm(e, t) {
    for (; e.nodeType !== 8;)
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t) ||
        ((e = al(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function Pr(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Ir(e) {
    return e.data === "$!" || (e.data === "$?" && e.ownerDocument.readyState !== "loading");
  }
  function pv(e, t) {
    var l = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || l.readyState !== "loading") t();
    else {
      var a = function () {
        (t(), l.removeEventListener("DOMContentLoaded", a));
      };
      (l.addEventListener("DOMContentLoaded", a), (e._reactRetry = a));
    }
  }
  function al(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (((t = e.data), t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F"))
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var ef = null;
  function rm(e) {
    e = e.nextSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0) return al(e.nextSibling);
          t--;
        } else (l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&") || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function fm(e) {
    e = e.previousSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (t === 0) return e;
          t--;
        } else (l !== "/$" && l !== "/&") || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function zv(e, t) {
    function l() {
      a = !0;
    }
    if (e.ownerDocument.activeElement === e) return !0;
    var a = !1;
    try {
      (e.ownerDocument.addEventListener("focus", l, !0), (e.focus || HTMLElement.prototype.focus).call(e, t));
    } finally {
      e.ownerDocument.removeEventListener("focus", l, !0);
    }
    return a;
  }
  function Sv(e) {
    Wh(function () {
      Wh(function (t) {
        return e(t);
      });
    });
  }
  function dm(e, t, l) {
    switch (((t = Vi(l)), e)) {
      case "html":
        if (((e = t.documentElement), !e)) throw Error(y(452));
        return e;
      case "head":
        if (((e = t.head), !e)) throw Error(y(453));
        return e;
      case "body":
        if (((e = t.body), !e)) throw Error(y(454));
        return e;
      default:
        throw Error(y(451));
    }
  }
  function om(e, t, l) {
    for (var a in l) {
      var n = l[a];
      l.hasOwnProperty(a) && n != null && Ae(e, t, a, null, Pg, n);
    }
    (l.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === yl && (e.onclick = null), vt(e));
  }
  function tf(e) {
    for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
    vt(e);
  }
  var nl = new Map(),
    hm = new Set();
  function Li(e) {
    if (typeof e.getRootNode == "function") {
      var t = e.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Zl = F.d;
  F.d = { f: Nv, r: Tv, D: Ev, C: _v, L: Av, m: Ov, X: Cv, S: Mv, M: Dv };
  function Nv() {
    var e = Zl.f(),
      t = mc();
    return e || t;
  }
  function Tv(e) {
    var t = Ft(e);
    t !== null && t.tag === 5 && t.type === "form" ? go(t) : Zl.r(e);
  }
  var Kn = typeof document > "u" ? null : document;
  function mm(e, t, l) {
    var a = Kn;
    if (a && typeof t == "string" && t) {
      var n = Wt(t);
      ((n = 'link[rel="' + e + '"][href="' + n + '"]'),
        typeof l == "string" && (n += '[crossorigin="' + l + '"]'),
        hm.has(n) ||
          (hm.add(n),
          (e = { rel: e, crossOrigin: l, href: t }),
          a.querySelector(n) === null &&
            ((t = a.createElement("link")), dt(t, "link", e), lt(t), a.head.appendChild(t))));
    }
  }
  function Ev(e) {
    (Zl.D(e), mm("dns-prefetch", e, null));
  }
  function _v(e, t) {
    (Zl.C(e, t), mm("preconnect", e, t));
  }
  function Av(e, t, l) {
    Zl.L(e, t, l);
    var a = Kn;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Wt(t) + '"]';
      t === "image" && l && l.imageSrcSet
        ? ((n += '[imagesrcset="' + Wt(l.imageSrcSet) + '"]'),
          typeof l.imageSizes == "string" && (n += '[imagesizes="' + Wt(l.imageSizes) + '"]'))
        : (n += '[href="' + Wt(e) + '"]');
      var u = n;
      switch (t) {
        case "style":
          u = Jn(e);
          break;
        case "script":
          u = Fn(e);
      }
      if (!(
        nl.has(u) ||
        ((e = te({ rel: "preload", href: t === "image" && l && l.imageSrcSet ? void 0 : e, as: t }, l)),
        nl.set(u, e),
        a.querySelector(n) !== null ||
          (t === "style" && a.querySelector(Zi(u))) ||
          (t === "script" && a.querySelector(Qi(u))))
      )) {
        var c = a.createElement("link");
        (dt(c, "link", e),
          t === "style" &&
            ((c[Te] = !0),
            (c.onload = c.onerror =
              function () {
                Ef(c);
              })),
          lt(c),
          a.head.appendChild(c));
      }
    }
  }
  function Ov(e, t) {
    Zl.m(e, t);
    var l = Kn;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script",
        n = 'link[rel="modulepreload"][as="' + Wt(a) + '"][href="' + Wt(e) + '"]',
        u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Fn(e);
      }
      if (!nl.has(u) && ((e = te({ rel: "modulepreload", href: e }, t)), nl.set(u, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Qi(u))) return;
        }
        ((a = l.createElement("link")), dt(a, "link", e), lt(a), l.head.appendChild(a));
      }
    }
  }
  function Mv(e, t, l) {
    Zl.S(e, t, l);
    var a = Kn;
    if (a && e) {
      var n = on(a).hoistableStyles,
        u = Jn(e);
      t = t || "default";
      var c = n.get(u);
      if (!c) {
        var s = { loading: 0, preload: null };
        if ((c = a.querySelector(Zi(u)))) s.loading = 5;
        else {
          ((e = te({ rel: "stylesheet", href: e, "data-precedence": t }, l)), (l = nl.get(u)) && lf(e, l));
          var r = (c = a.createElement("link"));
          (lt(r),
            dt(r, "link", e),
            (r._p = new Promise(function (g, j) {
              ((r.onload = g), (r.onerror = j));
            })),
            r.addEventListener("load", function () {
              s.loading |= 1;
            }),
            r.addEventListener("error", function () {
              s.loading |= 2;
            }),
            (s.loading |= 4),
            pc(c, t, a));
        }
        ((c = { type: "stylesheet", instance: c, count: 1, state: s }), n.set(u, c));
      }
    }
  }
  function Cv(e, t) {
    Zl.X(e, t);
    var l = Kn;
    if (l && e) {
      var a = on(l).hoistableScripts,
        n = Fn(e),
        u = a.get(n);
      u ||
        ((u = l.querySelector(Qi(n))),
        u ||
          ((e = te({ src: e, async: !0 }, t)),
          (t = nl.get(n)) && af(e, t),
          (u = l.createElement("script")),
          lt(u),
          dt(u, "link", e),
          l.head.appendChild(u)),
        (u = { type: "script", instance: u, count: 1, state: null }),
        a.set(n, u));
    }
  }
  function Dv(e, t) {
    Zl.M(e, t);
    var l = Kn;
    if (l && e) {
      var a = on(l).hoistableScripts,
        n = Fn(e),
        u = a.get(n);
      u ||
        ((u = l.querySelector(Qi(n))),
        u ||
          ((e = te({ src: e, async: !0, type: "module" }, t)),
          (t = nl.get(n)) && af(e, t),
          (u = l.createElement("script")),
          lt(u),
          dt(u, "link", e),
          l.head.appendChild(u)),
        (u = { type: "script", instance: u, count: 1, state: null }),
        a.set(n, u));
    }
  }
  function gm(e, t, l, a) {
    var n = (n = kt.current) ? Li(n) : null;
    if (!n) throw Error(y(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string"
          ? ((l = Jn(l.href)),
            (t = on(n).hoistableStyles),
            (a = t.get(l)),
            a || ((a = { type: "style", instance: null, count: 0, state: null }), t.set(l, a)),
            a)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Jn(l.href);
          var u = on(n).hoistableStyles,
            c = u.get(e);
          if (
            (c ||
              ((n = n.ownerDocument || n),
              (c = { type: "stylesheet", instance: null, count: 0, state: { loading: 0, preload: null } }),
              u.set(e, c),
              (u = n.querySelector(Zi(e)))
                ? u._p || ((c.instance = u), (c.state.loading = 5))
                : ((u = nl.get(e)),
                  u ||
                    ((u = {
                      rel: "preload",
                      as: "style",
                      href: l.href,
                      crossOrigin: l.crossOrigin,
                      integrity: l.integrity,
                      media: l.media,
                      hrefLang: l.hrefLang,
                      referrerPolicy: l.referrerPolicy,
                    }),
                    nl.set(e, u)),
                  wv(n, e, u, c.state))),
            t && a === null)
          )
            throw Error(y(528, ""));
          return c;
        }
        if (t && a !== null) throw Error(y(529, ""));
        return null;
      case "script":
        return (
          (t = l.async),
          (l = l.src),
          typeof l == "string" && t && typeof t != "function" && typeof t != "symbol"
            ? ((l = Fn(l)),
              (t = on(n).hoistableScripts),
              (a = t.get(l)),
              a || ((a = { type: "script", instance: null, count: 0, state: null }), t.set(l, a)),
              a)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(y(444, e));
    }
  }
  function Jn(e) {
    return 'href="' + Wt(e) + '"';
  }
  function Zi(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function vm(e) {
    return te({}, e, { "data-precedence": e.precedence, precedence: null });
  }
  function wv(e, t, l, a) {
    if ((t = e.querySelector('link[rel="preload"][as="style"][' + t + "]"))) {
      if (t[Te] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      ((t = e.createElement("link")),
        (t[Te] = !0),
        (t.onload = t.onerror = Ef.bind(null, t)),
        dt(t, "link", l),
        lt(t),
        e.head.appendChild(t));
    ((a.preload = t),
      t.addEventListener("load", function () {
        return (a.loading |= 1);
      }),
      t.addEventListener("error", function () {
        return (a.loading |= 2);
      }));
  }
  function Fn(e) {
    return '[src="' + Wt(e) + '"]';
  }
  function Qi(e) {
    return "script[async]" + e;
  }
  function ym(e, t, l) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case "style":
          var a = e.querySelector('style[data-href~="' + Wt(l.href) + '"]');
          if (a) return ((t.instance = a), lt(a), a);
          var n = te({}, l, { "data-href": l.href, "data-precedence": l.precedence, href: null, precedence: null });
          return (
            (a = (e.ownerDocument || e).createElement("style")),
            lt(a),
            dt(a, "style", n),
            pc(a, l.precedence, e),
            (t.instance = a)
          );
        case "stylesheet":
          n = Jn(l.href);
          var u = e.querySelector(Zi(n));
          if (u) return ((t.state.loading |= 4), (t.instance = u), lt(u), u);
          ((a = vm(l)), (n = nl.get(n)) && lf(a, n), (u = (e.ownerDocument || e).createElement("link")), lt(u));
          var c = u;
          return (
            (c._p = new Promise(function (s, r) {
              ((c.onload = s), (c.onerror = r));
            })),
            dt(u, "link", a),
            (t.state.loading |= 4),
            pc(u, l.precedence, e),
            (t.instance = u)
          );
        case "script":
          return (
            (u = Fn(l.src)),
            (n = e.querySelector(Qi(u)))
              ? ((t.instance = n), lt(n), n)
              : ((a = l),
                (n = nl.get(u)) && ((a = te({}, l)), af(a, n)),
                (e = e.ownerDocument || e),
                (n = e.createElement("script")),
                lt(n),
                dt(n, "link", a),
                e.head.appendChild(n),
                (t.instance = n))
          );
        case "void":
          return null;
        default:
          throw Error(y(443, t.type));
      }
    else
      t.type === "stylesheet" &&
        (t.state.loading & 4) === 0 &&
        ((a = t.instance), (t.state.loading |= 4), pc(a, l.precedence, e));
    return t.instance;
  }
  function pc(e, t, l) {
    for (
      var a = l.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        n = a.length ? a[a.length - 1] : null,
        u = n,
        c = 0;
      c < a.length;
      c++
    ) {
      var s = a[c];
      if (s.dataset.precedence === t) u = s;
      else if (u !== n) break;
    }
    u
      ? u.parentNode.insertBefore(e, u.nextSibling)
      : ((t = l.nodeType === 9 ? l.head : l), t.insertBefore(e, t.firstChild));
  }
  function lf(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.title == null && (e.title = t.title));
  }
  function af(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.integrity == null && (e.integrity = t.integrity));
  }
  var zc = null;
  function xm(e, t, l) {
    if (zc === null) {
      var a = new Map(),
        n = (zc = new Map());
      n.set(l, a);
    } else ((n = zc), (a = n.get(l)), a || ((a = new Map()), n.set(l, a)));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var u = l[n];
      if (
        !(u[De] || u[$e] || (e === "link" && u.getAttribute("rel") === "stylesheet")) &&
        u.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var c = u.getAttribute(t) || "";
        c = e + c;
        var s = a.get(c);
        s ? s.push(u) : a.set(c, [u]);
      }
    }
    return a;
  }
  function nf(e, t, l) {
    ((e = e.ownerDocument || e), e.head.insertBefore(l, t === "title" ? e.querySelector("head > title") : null));
  }
  function Rv(e, t, l) {
    if (l === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
        switch (t.rel) {
          case "stylesheet":
            return ((e = t.disabled), typeof t.precedence == "string" && e == null);
          default:
            return !0;
        }
      case "script":
        if (
          t.async &&
          typeof t.async != "function" &&
          typeof t.async != "symbol" &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function bm(e, t) {
    return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function jm(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function pm(e) {
    return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function zm(e, t) {
    typeof t.decode == "function" &&
      (e.imgCount++,
      t.complete || ((e.imgBytes += pm(t)), e.suspenseyImages.push(t)),
      (e = Bv.bind(e)),
      t.decode().then(e, e));
  }
  function Hv(e, t, l, a) {
    if (
      l.type === "stylesheet" &&
      (typeof a.media != "string" || matchMedia(a.media).matches !== !1) &&
      (l.state.loading & 4) === 0
    ) {
      if (l.instance === null) {
        var n = Jn(a.href),
          u = t.querySelector(Zi(n));
        if (u) {
          ((t = u._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (e.count++, (e = Xi.bind(e)), t.then(e, e)),
            (l.state.loading |= 4),
            (l.instance = u),
            lt(u));
          return;
        }
        ((u = t.ownerDocument || t), (a = vm(a)), (n = nl.get(n)) && lf(a, n), (u = u.createElement("link")), lt(u));
        var c = u;
        ((c._p = new Promise(function (s, r) {
          ((c.onload = s), (c.onerror = r));
        })),
          dt(u, "link", a),
          (l.instance = u));
      }
      (e.stylesheets === null && (e.stylesheets = new Map()),
        e.stylesheets.set(l, t),
        (t = l.state.preload) &&
          (l.state.loading & 3) === 0 &&
          (e.count++, (l = Xi.bind(e)), t.addEventListener("load", l), t.addEventListener("error", l)));
    }
  }
  var Sc = 0;
  function Uv(e, t) {
    return (
      e.stylesheets && e.count === 0 && Tc(e, e.stylesheets),
      0 < e.count || 0 < e.imgCount
        ? function (l) {
            var a = setTimeout(function () {
              if ((e.stylesheets && Tc(e, e.stylesheets), e.unsuspend)) {
                var u = e.unsuspend;
                ((e.unsuspend = null), u());
              }
            }, 6e4 + t);
            0 < e.imgBytes && Sc === 0 && (Sc = 62500 * ev());
            var n = setTimeout(
              function () {
                if (
                  ((e.waitingForImages = !1), e.count === 0 && (e.stylesheets && Tc(e, e.stylesheets), e.unsuspend))
                ) {
                  var u = e.unsuspend;
                  ((e.unsuspend = null), u());
                }
              },
              (e.imgBytes > Sc ? 50 : 800) + t,
            );
            return (
              (e.unsuspend = l),
              function () {
                ((e.unsuspend = null), clearTimeout(a), clearTimeout(n));
              }
            );
          }
        : null
    );
  }
  function Sm(e) {
    if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
      if (e.stylesheets) Tc(e, e.stylesheets);
      else if (e.unsuspend) {
        var t = e.unsuspend;
        ((e.unsuspend = null), t());
      }
    }
  }
  function Xi() {
    (this.count--, Sm(this));
  }
  function Bv() {
    (this.imgCount--, Sm(this));
  }
  var Nc = null;
  function Tc(e, t) {
    ((e.stylesheets = null),
      e.unsuspend !== null && (e.count++, (Nc = new Map()), t.forEach(qv, e), (Nc = null), Xi.call(e)));
  }
  function qv(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Nc.get(e);
      if (l) var a = l.get(null);
      else {
        ((l = new Map()), Nc.set(e, l));
        for (var n = e.querySelectorAll("link[data-precedence],style[data-precedence]"), u = 0; u < n.length; u++) {
          var c = n[u];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), (a = c));
        }
        a && l.set(null, a);
      }
      ((n = t.instance),
        (c = n.getAttribute("data-precedence")),
        (u = l.get(c) || a),
        u === a && l.set(null, n),
        l.set(c, n),
        this.count++,
        (a = Xi.bind(this)),
        n.addEventListener("load", a),
        n.addEventListener("error", a),
        u
          ? u.parentNode.insertBefore(n, u.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(n, e.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var Wn = { $$typeof: ke, Provider: null, Consumer: null, _currentValue: Bt, _currentValue2: Bt, _threadCount: 0 };
  function kv(e, t, l, a, n, u, c, s, r) {
    ((this.tag = 1),
      (this.containerInfo = e),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null),
      (this.callbackPriority = 0),
      (this.expirationTimes = ii(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = ii(0)),
      (this.hiddenUpdates = ii(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = n),
      (this.onCaughtError = u),
      (this.onRecoverableError = c),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = r),
      (this.transitionTypes = null),
      (this.incompleteTransitions = new Map()));
  }
  function Nm(e, t, l, a, n, u, c, s, r, g, j, S) {
    return (
      (e = new kv(e, t, l, c, r, g, j, S, s)),
      (t = 1),
      u === !0 && (t |= 24),
      (u = Dt(3, null, null, t)),
      (e.current = u),
      (u.stateNode = e),
      (t = bs()),
      t.refCount++,
      (e.pooledCache = t),
      t.refCount++,
      (u.memoizedState = { element: a, isDehydrated: l, cache: t }),
      Ss(u),
      e
    );
  }
  function Tm(e) {
    return e ? ((e = zn), e) : zn;
  }
  function Em(e, t, l, a, n, u) {
    ((n = Tm(n)),
      a.context === null ? (a.context = n) : (a.pendingContext = n),
      (a = na(t)),
      (a.payload = { element: l }),
      (u = u === void 0 ? null : u),
      u !== null && (a.callback = u),
      (l = ia(e, a, t)),
      l !== null && (Ut(l, e, t), Si(l, e, t)));
  }
  function _m(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function uf(e, t) {
    (_m(e, t), (e = e.alternate) && _m(e, t));
  }
  function Am(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ba(e, 67108864);
      (t !== null && Ut(t, e, 67108864), uf(e, 67108864));
    }
  }
  function Om(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Xt();
      t = ui(t);
      var l = Ba(e, t);
      (l !== null && Ut(l, e, t), uf(e, t));
    }
  }
  var $n = !0;
  function Gv(e, t, l, a) {
    var n = q.T;
    q.T = null;
    var u = F.p;
    try {
      ((F.p = 2), cf(e, t, l, a));
    } finally {
      ((F.p = u), (q.T = n));
    }
  }
  function Yv(e, t, l, a) {
    var n = q.T;
    q.T = null;
    var u = F.p;
    try {
      ((F.p = 8), cf(e, t, l, a));
    } finally {
      ((F.p = u), (q.T = n));
    }
  }
  function cf(e, t, l, a) {
    if ($n) {
      var n = sf(a);
      if (n === null) (Yr(e, t, a, Ec, l), Cm(e, a));
      else if (Lv(n, e, t, l, a)) a.stopPropagation();
      else if ((Cm(e, a), t & 4 && -1 < Vv.indexOf(e))) {
        for (; n !== null;) {
          var u = Ft(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
                  var c = vl(u.pendingLanes);
                  if (c !== 0) {
                    var s = u;
                    for (s.pendingLanes |= 2, s.entangledLanes |= 2; c;) {
                      var r = 1 << (31 - tt(c));
                      ((s.entanglements[1] |= r), (c &= ~r));
                    }
                    (_l(u), (be & 6) === 0 && ((dc = et() + 500), ki(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((s = Ba(u, 2)), s !== null && Ut(s, u, 2), mc(), uf(u, 2));
            }
          if (((u = sf(a)), u === null && Yr(e, t, a, Ec, l), u === n)) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else Yr(e, t, a, null, l);
    }
  }
  function sf(e) {
    return ((e = Xc(e)), rf(e));
  }
  var Ec = null;
  function rf(e) {
    if (((Ec = null), (e = yt(e)), e !== null)) {
      var t = X(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (((e = Se(t)), e !== null)) return e;
          e = null;
        } else if (l === 31) {
          if (((e = Le(t)), e !== null)) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ((Ec = e), null);
  }
  function Mm(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Ma()) {
          case ai:
            return 2;
          case rn:
            return 8;
          case Ol:
          case nu:
            return 32;
          case zt:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ff = !1,
    ya = null,
    xa = null,
    ba = null,
    Ki = new Map(),
    Ji = new Map(),
    ja = [],
    Vv =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function Cm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        ya = null;
        break;
      case "dragenter":
      case "dragleave":
        xa = null;
        break;
      case "mouseover":
      case "mouseout":
        ba = null;
        break;
      case "pointerover":
      case "pointerout":
        Ki.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ji.delete(t.pointerId);
    }
  }
  function Fi(e, t, l, a, n, u) {
    return e === null || e.nativeEvent !== u
      ? ((e = { blockedOn: t, domEventName: l, eventSystemFlags: a, nativeEvent: u, targetContainers: [n] }),
        t !== null && ((t = Ft(t)), t !== null && Am(t)),
        e)
      : ((e.eventSystemFlags |= a), (t = e.targetContainers), n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function Lv(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return ((ya = Fi(ya, e, t, l, a, n)), !0);
      case "dragenter":
        return ((xa = Fi(xa, e, t, l, a, n)), !0);
      case "mouseover":
        return ((ba = Fi(ba, e, t, l, a, n)), !0);
      case "pointerover":
        var u = n.pointerId;
        return (Ki.set(u, Fi(Ki.get(u) || null, e, t, l, a, n)), !0);
      case "gotpointercapture":
        return ((u = n.pointerId), Ji.set(u, Fi(Ji.get(u) || null, e, t, l, a, n)), !0);
    }
    return !1;
  }
  function Dm(e) {
    var t = yt(e.target);
    if (t !== null) {
      var l = X(t);
      if (l !== null) {
        if (((t = l.tag), t === 13)) {
          if (((t = Se(l)), t !== null)) {
            ((e.blockedOn = t),
              du(e.priority, function () {
                Om(l);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = Le(l)), t !== null)) {
            ((e.blockedOn = t),
              du(e.priority, function () {
                Om(l);
              }));
            return;
          }
        } else if (t === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function _c(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length;) {
      var l = sf(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(l.type, l);
        ((Qc = a), l.target.dispatchEvent(a), (Qc = null));
      } else return ((t = Ft(l)), t !== null && Am(t), (e.blockedOn = l), !1);
      t.shift();
    }
    return !0;
  }
  function wm(e, t, l) {
    _c(e) && l.delete(t);
  }
  function Zv() {
    ((ff = !1),
      ya !== null && _c(ya) && (ya = null),
      xa !== null && _c(xa) && (xa = null),
      ba !== null && _c(ba) && (ba = null),
      Ki.forEach(wm),
      Ji.forEach(wm));
  }
  function Ac(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null), ff || ((ff = !0), o.unstable_scheduleCallback(o.unstable_NormalPriority, Zv)));
  }
  var Oc = null;
  function Rm(e) {
    Oc !== e &&
      ((Oc = e),
      o.unstable_scheduleCallback(o.unstable_NormalPriority, function () {
        Oc === e && (Oc = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t],
            a = e[t + 1],
            n = e[t + 2];
          if (typeof a != "function") {
            if (rf(a || l) === null) continue;
            break;
          }
          var u = Ft(l);
          u !== null && (e.splice(t, 3), (t -= 3), Zs(u, { pending: !0, data: n, method: l.method, action: a }, a, n));
        }
      }));
  }
  function Pn(e) {
    function t(r) {
      return Ac(r, e);
    }
    (ya !== null && Ac(ya, e), xa !== null && Ac(xa, e), ba !== null && Ac(ba, e), Ki.forEach(t), Ji.forEach(t));
    for (var l = 0; l < ja.length; l++) {
      var a = ja[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < ja.length && ((l = ja[0]), l.blockedOn === null);) (Dm(l), l.blockedOn === null && ja.shift());
    if (((l = (e.ownerDocument || e).$$reactFormReplay), l != null))
      for (a = 0; a < l.length; a += 3) {
        var n = l[a],
          u = l[a + 1],
          c = n[gt] || null;
        if (typeof u == "function") c || Rm(l);
        else if (c) {
          var s = null;
          if (u && u.hasAttribute("formAction")) {
            if (((n = u), (c = u[gt] || null))) s = c.formAction;
            else if (rf(n) !== null) continue;
          } else s = c.action;
          (typeof s == "function" ? (l[a + 1] = s) : (l.splice(a, 3), (a -= 3)), Rm(l));
        }
      }
  }
  function Hm() {
    function e(u) {
      u.canIntercept &&
        u.info === "react-transition" &&
        u.intercept({
          handler: function () {
            return new Promise(function (c) {
              return (n = c);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function t() {
      (n !== null && (n(), (n = null)), a || setTimeout(l, 20));
    }
    function l() {
      if (!a && !navigation.transition) {
        var u = navigation.currentEntry;
        u &&
          u.url != null &&
          navigation.navigate(u.url, { state: u.getState(), info: "react-transition", history: "replace" });
      }
    }
    if (typeof navigation == "object") {
      var a = !1,
        n = null;
      return (
        navigation.addEventListener("navigate", e),
        navigation.addEventListener("navigatesuccess", t),
        navigation.addEventListener("navigateerror", t),
        setTimeout(l, 100),
        function () {
          ((a = !0),
            navigation.removeEventListener("navigate", e),
            navigation.removeEventListener("navigatesuccess", t),
            navigation.removeEventListener("navigateerror", t),
            n !== null && (n(), (n = null)));
        }
      );
    }
  }
  function df(e) {
    this._internalRoot = e;
  }
  ((Mc.prototype.render = df.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(y(409));
      var l = t.current,
        a = Xt();
      Em(l, a, e, t, null, null);
    }),
    (Mc.prototype.unmount = df.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (Em(e.current, 2, null, e, null, null), mc(), (t[Fl] = null));
        }
      }));
  function Mc(e) {
    this._internalRoot = e;
  }
  Mc.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = fu();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < ja.length && t !== 0 && t < ja[l].priority; l++);
      (ja.splice(l, 0, e), l === 0 && Dm(e));
    }
  };
  var Um = C.version;
  if (Um !== "19.3.1") throw Error(y(527, Um, "19.3.1"));
  F.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(y(188)) : ((e = Object.keys(e).join(",")), Error(y(268, e)));
    return ((e = Ne(t)), (e = e !== null ? A(e) : null), (e = e === null ? null : e.stateNode), e);
  };
  var Qv = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: q,
    reconcilerVersion: "19.3.1",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Cc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Cc.isDisabled && Cc.supportsFiber)
      try {
        ((Ca = Cc.inject(Qv)), (mt = Cc));
      } catch {}
  }
  return (
    ($i.createRoot = function (e, t) {
      if (!L(e)) throw Error(y(299));
      var l = !1,
        a = "",
        n = To,
        u = Eo,
        c = _o;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (l = !0),
          t.identifierPrefix !== void 0 && (a = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (n = t.onUncaughtError),
          t.onCaughtError !== void 0 && (u = t.onCaughtError),
          t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
        (t = Nm(e, 1, !1, null, null, l, a, null, n, u, c, Hm)),
        (e[Fl] = t.current),
        Gr(e),
        new df(t)
      );
    }),
    ($i.hydrateRoot = function (e, t, l) {
      if (!L(e)) throw Error(y(299));
      var a = !1,
        n = "",
        u = To,
        c = Eo,
        s = _o,
        r = null;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (a = !0),
          l.identifierPrefix !== void 0 && (n = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
          l.onCaughtError !== void 0 && (c = l.onCaughtError),
          l.onRecoverableError !== void 0 && (s = l.onRecoverableError),
          l.formState !== void 0 && (r = l.formState)),
        (t = Nm(e, 1, !0, t, l ?? null, a, n, r, u, c, s, Hm)),
        (t.context = Tm(null)),
        (l = t.current),
        (a = Xt()),
        (a = ui(a)),
        (n = na(a)),
        (n.callback = null),
        ia(l, n, a),
        (l = a),
        (t.current.lanes = l),
        wa(t, l),
        _l(t),
        (e[Fl] = t.current),
        Gr(e),
        new Mc(t)
      );
    }),
    ($i.version = "19.3.1"),
    $i
  );
}
var Xm;
function t1() {
  if (Xm) return mf.exports;
  Xm = 1;
  function o() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o);
      } catch (C) {
        console.error(C);
      }
  }
  return (o(), (mf.exports = e1()), mf.exports);
}
var l1 = t1();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const a1 = (o) => o.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  n0 = (...o) =>
    o
      .filter((C, _, y) => !!C && C.trim() !== "" && y.indexOf(C) === _)
      .join(" ")
      .trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var n1 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const i1 = H.forwardRef(
  (
    {
      color: o = "currentColor",
      size: C = 24,
      strokeWidth: _ = 2,
      absoluteStrokeWidth: y,
      className: L = "",
      children: X,
      iconNode: Se,
      ...Le
    },
    ne,
  ) =>
    H.createElement(
      "svg",
      {
        ref: ne,
        ...n1,
        width: C,
        height: C,
        stroke: o,
        strokeWidth: y ? (Number(_) * 24) / Number(C) : _,
        className: n0("lucide", L),
        ...Le,
      },
      [...Se.map(([Ne, A]) => H.createElement(Ne, A)), ...(Array.isArray(X) ? X : [X])],
    ),
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ee = (o, C) => {
  const _ = H.forwardRef(({ className: y, ...L }, X) =>
    H.createElement(i1, { ref: X, iconNode: C, className: n0(`lucide-${a1(o)}`, y), ...L }),
  );
  return ((_.displayName = `${o}`), _);
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ve = ee("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const i0 = ee("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const zf = ee("Box", [
  [
    "path",
    {
      d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
      key: "hh9hay",
    },
  ],
  ["path", { d: "m3.3 7 8.7 5 8.7-5", key: "g66t2b" }],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const u1 = ee("CalendarDays", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const za = ee("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Pi = ee("ChevronDown", [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const u0 = ee("ChevronRight", [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const c1 = ee("CircleDollarSign", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const s1 = ee("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const r1 = ee("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Hc = ee("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0",
    },
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const f1 = ee("Facebook", [
  ["path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", key: "1jg4f8" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ti = ee("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const c0 = ee("Heart", [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky",
    },
  ],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Km = ee("Image", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const d1 = ee("Instagram", [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const o1 = ee("LayoutDashboard", [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const il = ee("Leaf", [
  ["path", { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z", key: "nnexq3" }],
  ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", key: "mt58a7" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const h1 = ee("Link2", [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const wc = ee("Mail", [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Jm = ee("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z",
    },
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const m1 = ee("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const g1 = ee("MessageCircle", [["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Fm = ee("Minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const v1 = ee("PackageCheck", [
  ["path", { d: "m16 16 2 2 4-4", key: "gfu2re" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h",
    },
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const s0 = ee("PackagePlus", [
  ["path", { d: "M16 16h6", key: "100bgy" }],
  ["path", { d: "M19 13v6", key: "85cyf1" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h",
    },
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wm = ee("PanelTop", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Uc = ee("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const r0 = ee("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476",
    },
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const eu = ee("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const y1 = ee("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3",
    },
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const f0 = ee("Settings2", [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Dc = ee("ShoppingBag", [
  ["path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", key: "hou9p0" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const x1 = ee("ShoppingCart", [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  ["path", { d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12", key: "9zh506" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const b1 = ee("SlidersHorizontal", [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const In = ee("Sprout", [
  ["path", { d: "M7 20h10", key: "e6iznv" }],
  ["path", { d: "M10 20c5.5-2.5.8-6.4 3-10", key: "161w41" }],
  [
    "path",
    { d: "M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z", key: "9gtqwd" },
  ],
  ["path", { d: "M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z", key: "bkxnd2" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bc = ee("TriangleAlert", [
  ["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", key: "wmoenq" }],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Rc = ee("Truck", [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  ["path", { d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14", key: "lysw3i" }],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $m = ee("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }],
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Pm = ee("X", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ]),
  xf = "2026-10-23";
function He(o) {
  return o.startsWith("/assets/") ? `${ei}${o}` : o;
}
function At(o) {
  return o
    .split(",")
    .map((C) => {
      const [_, y] = C.trim().split(/\s+/, 2);
      return y ? `${He(_)} ${y}` : He(_);
    })
    .join(", ");
}
const Ql = [
    {
      id: "thuja-smaragd",
      slug: "thuja-smaragd",
      name: "Thuja Smaragd",
      latin: "Thuja occidentalis „Smaragd“",
      category: "Heckenpflanzen",
      price: 15,
      image: "/assets/thuja-smaragd.jpg",
      imageSet: "/assets/thuja-smaragd-400.webp 400w, /assets/thuja-smaragd-800.webp 800w",
      badge: "Bestseller",
      height: "80–100 cm",
      traits: ["Immergrün", "Pflegeleicht"],
      description: "Der bewährte Klassiker für dichte, formschöne Hecken und natürlichen Sichtschutz.",
      variants: [
        "80–100 cm",
        "100–120 cm",
        "120–140 cm",
        "140–160 cm",
        "160–180 cm",
        "180–200 cm",
        "200–225 cm",
        "225–250 cm",
      ],
      stock: 48,
    },
    {
      id: "photinia-fraseri-red-robin",
      slug: "photinia-fraseri-red-robin",
      name: "Photinia fraseri ‘Red Robin’",
      latin: "Photinia × fraseri ‘Red Robin’",
      category: "Heckenpflanzen",
      price: 45,
      image: "/assets/photinia-red-robin.jpg",
      imageSet: "/assets/photinia-red-robin-400.webp 400w, /assets/photinia-red-robin-800.webp 800w",
      badge: "Beliebt",
      height: "Liefergrösse auf Anfrage",
      traits: ["Immergrün", "Sonnig", "Blütenreich"],
      description: "Glanzmispel mit attraktivem rotem Austrieb für strukturierte, immergrüne Pflanzungen.",
      variants: ["Liefergrösse auf Anfrage"],
      stock: 17,
    },
    {
      id: "diverse-beerenstraeucher",
      slug: "diverse-beerenstraeucher",
      priceOnRequest: !0,
      name: "Diverse Beerensträucher",
      latin: "Ribes – verschiedene Sorten",
      category: "Beerensträucher",
      price: 0,
      image: "/assets/diverse-beerenstraeucher.jpg",
      imageSet: "/assets/diverse-beerenstraeucher-400.webp 400w, /assets/diverse-beerenstraeucher-800.webp 800w",
      badge: "Sortiment",
      height: "Verschiedene Sorten",
      traits: ["Sonnig", "Naschgarten"],
      description:
        "Verschiedene Beerensträucher für einen vielfältigen Naschgarten. Preis und Verfügbarkeit auf Anfrage.",
      variants: ["Sorten und Grössen auf Anfrage"],
      stock: 6,
    },
  ],
  Sf = [
    {
      title: "Formgehölze & Taxus",
      category: "Baumschule",
      description: "Auswahl an Formgehölzen und Taxus aus der Pflanzfarm.",
      image: "/assets/pflanzfarm-garten-1.jpg",
      imageSet: "/assets/pflanzfarm-garten-1-640.webp 640w, /assets/pflanzfarm-garten-1-1280.webp 1280w",
      featured: !0,
    },
    {
      title: "Sichtschutz mit Photinia",
      category: "Garten & Umbauten",
      description: "Immergrüner Sichtschutz mit Photinia und sauber gefassten Gartenflächen.",
      image: "/assets/pflanzfarm-garten-2.jpg",
      imageSet: "/assets/pflanzfarm-garten-2-640.webp 640w, /assets/pflanzfarm-garten-2-1280.webp 1280w",
      featured: !1,
    },
    {
      title: "Thuja-Sichtschutz",
      category: "Garten & Umbauten",
      description: "Gepflegter Sichtschutz mit Thuja für einen klar gefassten Gartenraum.",
      image: "/assets/pflanzfarm-garten-3.jpg",
      imageSet: "/assets/pflanzfarm-garten-3-640.webp 640w, /assets/pflanzfarm-garten-3-1280.webp 1280w",
      featured: !1,
    },
  ],
  p1 = {
    active: !0,
    title: "Herbstzeit ist Pflanzzeit",
    text: "Jetzt Heckenpflanzen sichern und im passenden Pflanzfenster liefern lassen.",
    cta: "Hecken entdecken",
    target: "startseite",
    delay: 1,
    frequency: "sitzung",
    startsAt: "2026-09-15",
    endsAt: "2026-11-30",
  },
  S1 = [
    { label: "WhatsApp", href: "https://wa.me/41793361495", icon: g1 },
    { label: "Instagram", href: "https://www.instagram.com/pflanzfarm_steinmann/", icon: d1 },
    { label: "Facebook", href: "https://www.facebook.com/pflanzfarm.steinmann", icon: f1 },
  ],
  N1 = ["Alle", "Sichtschutz", "Gartenumbau", "Neubau", "Pflege"],
  T1 = {
    "Formgehölze & Taxus": ["Neubau"],
    "Sichtschutz mit Photinia": ["Sichtschutz", "Gartenumbau"],
    "Thuja-Sichtschutz": ["Sichtschutz"],
    "Pflege mit Perspektive": ["Pflege"],
  },
  E1 = [
    {
      id: "pflanzung",
      title: "Pflanzanleitung",
      text: "Vor dem Pflanzen den Wurzelballen gut wässern, ein grosszügiges Pflanzloch ausheben und die Erde anschliessend leicht andrücken. Bei Fragen beraten wir Sie gern persönlich.",
    },
    {
      id: "lieferung",
      title: "Lieferung & Abholung",
      text: "Wir liefern schweizweit oder bereiten Ihre Pflanzen zur Abholung in Ebersecken vor. Den passenden Liefer- oder Abholtermin stimmen wir persönlich mit Ihnen ab.",
    },
    {
      id: "pflege",
      title: "Pflege",
      text: "In den ersten Wochen gleichmässig wässern. Die genaue Pflege richtet sich nach Standort, Jahreszeit und gewählter Pflanzenhöhe.",
    },
  ],
  _1 = {
    home: "Pflanzfarm – Pflanzen für Ihren Garten",
    shop: "Pflanzen-Shop | Pflanzfarm",
    product: "Produktdetail | Pflanzfarm",
    references: "Referenzen | Pflanzfarm",
    about: "Über uns | Pflanzfarm",
    cart: "Warenkorb | Pflanzfarm",
    privacy: "Datenschutz | Pflanzfarm",
    imprint: "Impressum | Pflanzfarm",
    accessibility: "Barrierefreiheit | Pflanzfarm",
    service: "Gartenservice: Beratung, Lieferung & Pflanzservice | Pflanzfarm",
    guide: "Ratgeber: Hecken pflanzen, schneiden & pflegen | Pflanzfarm",
    contact: "Kontakt, Anfahrt & Offerte | Pflanzfarm",
    checkout: "Kasse | Pflanzfarm",
    thanks: "Vielen Dank für Ihre Bestellung | Pflanzfarm",
    account: "Mein Konto | Pflanzfarm",
    terms: "AGB | Pflanzfarm",
  },
  pf_desc = {
    home: "Pflanzfarm Steinmann in Ebersecken LU: Heckenpflanzen wie Thuja Smaragd und Photinia, Beerensträucher und Baumschule. Persönliche Beratung, Lieferung in die ganze Schweiz und Pflanzservice.",
    shop: "Heckenpflanzen und Beerensträucher aus der Pflanzfarm Steinmann: Thuja Smaragd, Photinia Red Robin und mehr – mit Lieferung oder Abholung in Ebersecken.",
    product: "Pflanze aus der Pflanzfarm Steinmann in Ebersecken – mit persönlicher Beratung, Lieferung schweizweit oder Abholung vor Ort.",
    references: "Referenzen der Pflanzfarm Steinmann: Sichtschutz mit Thuja und Photinia, Formgehölze und Gartenprojekte im Kanton Luzern.",
    about: "Die Pflanzfarm Steinmann ist ein Familienbetrieb in Ebersecken LU, gegründet 2020. Lernen Sie das Team hinter Baumschule und Gartenbau kennen.",
    cart: "Ihr Warenkorb bei der Pflanzfarm Steinmann.",
    privacy: "Datenschutzerklärung der Pflanzfarm Steinmann nach dem Schweizer Datenschutzgesetz (DSG).",
    imprint: "Impressum der Pflanzfarm Steinmann, Untergretti 2, 6245 Ebersecken.",
    accessibility: "Erklärung zur Barrierefreiheit der Website der Pflanzfarm Steinmann.",
    service: "Gartenservice der Pflanzfarm Steinmann: Standortberatung, Pflanzkonzepte, Lieferung, Pflanzservice und Pflege – mit persönlicher Offerte.",
    guide: "Ratgeber der Pflanzfarm: Thuja-Hecke pflanzen, Photinia schneiden, Beerensträucher setzen und richtig giessen – praktische Tipps aus der Baumschule.",
    contact: "Kontakt zur Pflanzfarm Steinmann in Ebersecken: Telefon, E-Mail, WhatsApp, Anfahrt und Offertanfrage für Hecken und Gartenprojekte.",
    checkout: "Bestellung abschliessen: Lieferung oder Abholung, Zahlung mit Karte, TWINT, Rechnung oder bar.",
    thanks: "Ihre Bestellung bei der Pflanzfarm Steinmann.",
    account: "Ihr Kundenkonto bei der Pflanzfarm Steinmann: Bestellungen, Angaben und Daten.",
    terms: "Allgemeine Geschäftsbedingungen (AGB) der Pflanzfarm Steinmann für Bestellungen im Online-Shop.",
  },
  A1 = {
    home: "/",
    shop: "/shop/",
    product: "/produkt/thuja-smaragd/",
    references: "/referenzen/",
    about: "/ueber-uns/",
    cart: "/warenkorb/",
    privacy: "/datenschutz/",
    imprint: "/impressum/",
    accessibility: "/barrierefreiheit/",
    service: "/gartenservice/",
    guide: "/ratgeber/",
    contact: "/kontakt/",
    checkout: "/kasse/",
    thanks: "/bestellung/danke/",
    account: "/konto/",
    terms: "/agb/",
  },
  pf_site = "https://pflanzfarm.ch",
  pf_mailto = (o, C) =>
    `mailto:info@pflanzfarm.ch?subject=${encodeURIComponent(o)}&body=${encodeURIComponent(C)}`,
  pf_isPlainClick = (o) => !(o.defaultPrevented || o.button !== 0 || o.metaKey || o.ctrlKey || o.shiftKey || o.altKey),
  h = (o, C, ..._) =>
    _.length > 1 ? i.jsxs(o, { ...C, children: _ }) : i.jsx(o, _.length ? { ...C, children: _[0] } : { ...C }),
  ei = "";
function Ii() {
  const o = window.location.pathname;
  return ei ? (o === ei ? "/" : o.startsWith(`${ei}/`) ? o.slice(ei.length) || "/" : o) : o;
}
function e0(o) {
  return `${ei}${o}`;
}
function t0(o) {
  return o.startsWith("/gartenservice")
    ? "service"
    : o.startsWith("/ratgeber")
      ? "guide"
      : o.startsWith("/kontakt")
        ? "contact"
        : o.startsWith("/kasse")
          ? "checkout"
          : o.startsWith("/bestellung/danke")
            ? "thanks"
            : o.startsWith("/konto")
              ? "account"
              : o.startsWith("/agb")
                ? "terms"
                : o.startsWith("/shop")
      ? "shop"
      : o.startsWith("/produkt/")
        ? "product"
        : o.startsWith("/referenzen")
          ? "references"
          : o.startsWith("/ueber-uns")
            ? "about"
            : o.startsWith("/warenkorb")
              ? "cart"
              : o.startsWith("/datenschutz")
                ? "privacy"
                : o.startsWith("/impressum")
                  ? "imprint"
                  : o.startsWith("/barrierefreiheit")
                    ? "accessibility"
                    : "home";
}
function jf(o) {
  const C = o.split("/").filter(Boolean)[1];
  return Ql.find((_) => _.slug === C) ?? Ql[0];
}
function Sa(o) {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" }).format(o);
}
function pf({ compact: o = !1, onActivate: C }) {
  return i.jsx("a", {
    className: `brand ${o ? "brand--compact" : ""}`,
    "aria-label": "Pflanzfarm Startseite",
    href: e0("/"),
    "data-nav": "",
    onClick: (_) => {
      pf_isPlainClick(_) && (_.preventDefault(), C());
    },
    children: i.jsx("img", { src: He("/assets/pflanzfarm-logo.webp"), alt: "Pflanzfarm" }),
  });
}
function l0() {
  return i.jsxs("nav", {
    className: "social-links",
    "aria-label": "Social Media",
    children: [
      i.jsx("span", { className: "social-links__label", children: "Folgen Sie uns" }),
      i.jsx("div", {
        children: S1.map(({ label: o, href: C, icon: _ }) =>
          i.jsxs(
            "a",
            {
              href: C,
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": `Pflanzfarm auf ${o} öffnen`,
              children: [i.jsx(_, { size: 17 }), i.jsx("span", { children: o })],
            },
            o,
          ),
        ),
      }),
    ],
  });
}
function a0({ product: o, onOpen: C, onAdd: _, isSaved: y, onToggleSaved: L, justAdded: X }) {
  return i.jsxs("article", {
    className: "product-card",
    children: [
      i.jsxs("button", {
        className: "product-card__image",
        onClick: C,
        "aria-label": `${o.name} öffnen`,
        children: [
          o.badge && i.jsx("span", { className: "product-badge", children: o.badge }),
          i.jsx("img", {
            src: He(o.image),
            srcSet: At(o.imageSet),
            sizes: "(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 360px",
            loading: "lazy",
            decoding: "async",
            alt: o.name,
          }),
          i.jsxs("span", { className: "quick-view", children: [i.jsx(Hc, { size: 17 }), " Details"] }),
        ],
      }),
      i.jsx("button", {
        className: y ? "product-favourite product-favourite--active" : "product-favourite",
        type: "button",
        "aria-label": y ? `${o.name} nicht mehr merken` : `${o.name} merken`,
        "aria-pressed": y,
        onClick: L,
        children: i.jsx(c0, { size: 17, fill: y ? "currentColor" : "none" }),
      }),
      i.jsxs("div", {
        className: "product-card__body",
        children: [
          i.jsx("span", { className: "product-category", children: o.category }),
          i.jsx("a", {
        className: "product-card__title",
        href: e0(`/produkt/${o.slug}/`),
        "data-nav": "",
        onClick: (Ee) => {
          pf_isPlainClick(Ee) && (Ee.preventDefault(), C());
        },
        children: o.name,
      }),
          i.jsx("p", { children: o.latin }),
          i.jsxs("div", {
            className: "product-card__meta",
            children: [
              i.jsx("span", { children: o.height }),
              i.jsxs("span", {
                className: (o.stock ?? 1) > 0 && !o.priceOnRequest ? "stock-dot" : "stock-dot stock-dot--request",
                children: [i.jsx("i", {}), (o.stock ?? 1) > 0 && !o.priceOnRequest ? " Auf Lager" : " Auf Anfrage"],
              }),
            ],
          }),
          i.jsxs("div", {
            className: "product-card__bottom",
            children: [
              i.jsx("strong", {
                children: o.priceOnRequest ? "Preis auf Anfrage" : (o.variants || []).length > 1 ? `ab ${Sa(o.price)}` : Sa(o.price),
              }),
              i.jsx("button", {
                className: X ? "round-button round-button--confirmed" : "round-button",
                onClick: o.priceOnRequest || (o.variants || []).length > 1 || (o.stock ?? 1) <= 0 ? C : _,
                "aria-label": o.priceOnRequest || (o.variants || []).length > 1 ? `${o.name}: Grösse wählen` : `${o.name} in Warenkorb`,
                children: X ? i.jsx(za, { size: 18 }) : i.jsx(Uc, { size: 18 }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const pf_Phone = ee("Phone", [
    [
      "path",
      {
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
        key: "pfphone",
      },
    ],
  ]),
  pf_Clock = ee("Clock", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "pfclock1" }],
    ["path", { d: "M12 6v6l4 2", key: "pfclock2" }],
  ]);
// Google-Analytics-Mess-ID eintragen (z. B. "G-XXXXXXXXXX"). Leer = Analytics wird nie geladen.
const pf_gaId = "G-595C54NRLK",
  pf_consentKey = "pflanzfarm-consent-v2",
  pf_readConsent = () => {
    try {
      const o = JSON.parse(window.localStorage.getItem(pf_consentKey) || "null");
      return o && typeof o.analytics == "boolean" ? o.analytics : null;
    } catch {
      return null;
    }
  },
  pf_applyConsent = (o) => {
    if (!pf_gaId) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    if (!window.__pfGa) {
      if (!o) return;
      (window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      }),
        window.gtag("consent", "update", { analytics_storage: "granted" }),
        window.gtag("js", new Date()),
        window.gtag("config", pf_gaId));
      const C = document.createElement("script");
      ((C.async = !0),
        (C.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(pf_gaId)}`),
        document.head.appendChild(C),
        (window.__pfGa = !0));
      return;
    }
    window.gtag("consent", "update", { analytics_storage: o ? "granted" : "denied" });
  };
function pf_Inquiry() {
  const [o, C] = H.useState(() => ({ name: "", contact: "", topic: "Offerte für eine Hecke", place: "", message: pf_prefillText, website: "" })),
    [pf_state, pf_setState] = H.useState("idle"),
    [pf_errors, pf_setErrors] = H.useState({}),
    _ = (L) => (X) => C((Se) => ({ ...Se, [L]: X.target.value })),
    y = async (L) => {
      (L.preventDefault(), pf_setState("sending"), pf_setErrors({}));
      try {
        (await pf_api("/contact", { method: "POST", body: o }), pf_setState("sent"), (pf_prefillText = ""));
      } catch (X) {
        (pf_setErrors({ ...X.errors, _: X.message }), pf_setState("idle"));
      }
    };
  if (
    (H.useEffect(() => {
      const L = (X) => C((Se) => ({ ...Se, topic: "Offerte für eine Hecke", message: X.detail }));
      return (window.addEventListener("pf-prefill", L), () => window.removeEventListener("pf-prefill", L));
    }, []),
    pf_state === "sent")
  )
    return h(
      "div",
      { className: "inquiry-form inquiry-form--sent", role: "status" },
      h("h2", { id: "anfrage" }, "Danke für Ihre Anfrage!"),
      h("p", null, "Wir melden uns so rasch wie möglich – in der Regel innert eines Arbeitstags."),
      h("button", { type: "button", className: "inline-link", onClick: () => (C((L) => ({ ...L, message: "" })), pf_setState("idle")) }, "Weitere Anfrage senden"),
    );
  return h(
    "form",
    { className: "inquiry-form", onSubmit: y },
    h("h2", { id: "anfrage" }, "Beratung oder Offerte anfragen"),
    h("p", null, "Beschreiben Sie kurz Ihr Vorhaben – wir melden uns persönlich bei Ihnen."),
    pf_errors._ && h("div", { className: "form-alert", role: "alert" }, pf_errors._),
    h("input", { className: "hp-field", tabIndex: -1, autoComplete: "off", "aria-hidden": "true", value: o.website, onChange: _("website") }),
    h(
      "div",
      { className: "inquiry-form__grid" },
      h("label", null, "Name", h("input", { required: !0, autoComplete: "name", value: o.name, onChange: _("name") })),
      h(
        "label",
        null,
        "Telefon oder E-Mail",
        h("input", { required: !0, autoComplete: "tel", value: o.contact, onChange: _("contact") }),
      ),
      h(
        "label",
        null,
        "Anliegen",
        h(
          "select",
          { value: o.topic, onChange: _("topic") },
          ...[
            "Offerte für eine Hecke",
            "Gartenberatung vor Ort",
            "Pflanzservice",
            "Besuch / Abholung in der Baumschule",
            "Andere Frage",
          ].map((L) => h("option", { key: L }, L)),
        ),
      ),
      h("label", null, "Ort / PLZ", h("input", { autoComplete: "postal-code", value: o.place, onChange: _("place") })),
    ),
    h(
      "label",
      null,
      "Nachricht",
      h("textarea", {
        rows: 5,
        required: !0,
        value: o.message,
        onChange: _("message"),
        placeholder: "z. B. 25 m Sichtschutz entlang der Grundstücksgrenze, Höhe ca. 1.8 m",
      }),
    ),
    h(
      "p",
      { className: "form-note" },
      "Ihre Angaben verwenden wir nur zur Bearbeitung der Anfrage (siehe ",
      h("a", { href: e0(A1.privacy) }, "Datenschutz"),
      ").",
    ),
    h("button", { type: "submit", className: "button button--primary", disabled: pf_state === "sending" }, pf_state === "sending" ? "Wird gesendet …" : "Anfrage senden ", h(y1, { size: 17 })),
  );
}
function pf_Map() {
  return h(
    "div",
    { className: "pf-map" },
    h("iframe", {
      title: "Karte: Pflanzfarm, Untergretti 2, 6245 Ebersecken",
      src: "https://www.openstreetmap.org/export/embed.html?bbox=7.9013%2C47.1660%2C7.9413%2C47.1840&layer=mapnik&marker=47.17497%2C7.92130",
      loading: "lazy",
    }),
  );
}
const pf_routeUrl = "https://www.google.com/maps/dir/?api=1&destination=Untergretti%202%2C%206245%20Ebersecken";
function pf_ContactList() {
  const o = (C, _, y, L, X = {}) =>
    h(
      "li",
      { key: _ },
      h(
        "a",
        { className: "contact-tile", href: L, ...X },
        h("span", { className: "contact-tile__icon", "aria-hidden": "true" }, h(C, { size: 20 })),
        h("span", { className: "contact-tile__text" }, h("small", null, _), h("b", null, y)),
        h(Ve, { size: 18, className: "contact-tile__arrow", "aria-hidden": "true" }),
      ),
    );
  return h(
    "ul",
    { className: "contact-tiles" },
    o(pf_Phone, "Telefon", "+41 79 336 14 95", "tel:+41793361495"),
    o(wc, "E-Mail", "info@pflanzfarm.ch", "mailto:info@pflanzfarm.ch"),
    o(g1, "WhatsApp", "Nachricht schreiben", "https://wa.me/41793361495", { target: "_blank", rel: "noopener noreferrer" }),
    o(Jm, "Adresse", "Untergretti 2, 6245 Ebersecken LU", pf_routeUrl, { target: "_blank", rel: "noopener noreferrer", "aria-label": "Route nach Untergretti 2, 6245 Ebersecken planen" }),
  );
}
let pf_catalogSettings = {
    openingHours: [{ label: "Baumschule, Beratung & Abholung", value: "nach telefonischer Vereinbarung" }],
    openingNote:
      "Als Familienbetrieb sind wir oft in Gärten unterwegs. Melden Sie sich kurz vor Ihrem Besuch – dann nehmen wir uns Zeit für Sie.",
    freeDeliveryFrom: 50000,
    invoiceEnabled: !0,
    cashEnabled: !0,
  },
  pf_refs = null,
  pf_articles = null,

  pf_prefillText = "";
const pf_xsrf = () => decodeURIComponent((document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/) || [])[1] || ""),
  pf_api = async (o, C = {}) => {
    const _ = (C.method || "GET").toUpperCase();
    _ !== "GET" && !pf_xsrf() && (await fetch("/sanctum/csrf-cookie", { credentials: "same-origin" }));
    const y = await fetch("/api" + o, {
        method: _,
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          ...(C.body ? { "Content-Type": "application/json" } : {}),
          ...(_ !== "GET" ? { "X-XSRF-TOKEN": pf_xsrf() } : {}),
        },
        body: C.body ? JSON.stringify(C.body) : void 0,
      }),
      L = await y.json().catch(() => ({}));
    if (!y.ok) {
      const X = new Error(
        y.status === 429
          ? "Zu viele Versuche. Bitte warten Sie einen Moment."
          : y.status === 419
            ? "Ihre Sitzung ist abgelaufen. Bitte laden Sie die Seite neu."
            : L.message || "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      );
      throw ((X.status = y.status), (X.errors = L.errors || {}), X);
    }
    return L;
  },
  // Preis und Bestand der gewählten Grösse
  pf_vd = (o, C) => {
    const _ = (o.variantData || []).find((y) => y.label === C) || (o.variantData || [])[0];
    return _ || { id: null, label: C, price: o.price, stock: o.stock ?? 0, shipping: null, pickupOnly: !1 };
  },
  // Mengenrabatt je Position (gleiche Rundung auf 5 Rappen wie auf dem Server)
  pf_line = (o, C, q) => {
    const v = pf_vd(o, C),
      pct = Math.min(90, Math.max(0, ...(o.discounts || []).filter((t) => q >= t.minQty).map((t) => t.percent))),
      unit = pct ? (Math.round((Math.round(v.price * 100) * (100 - pct)) / 100 / 5) * 5) / 100 : v.price;
    return { unit, total: Math.round(unit * q * 100) / 100, percent: pct, list: v.price, saved: Math.round((v.price - unit) * q * 100) / 100 };
  },
  pf_nextTier = (o, q) => (o.discounts || []).find((t) => q < t.minQty),
  pf_slots = { vormittag: "Vormittag", nachmittag: "Nachmittag", egal: "egal" },
  pf_fmtDate = (d) => (d ? new Date(d + "T12:00:00").toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "long" }) : ""),
  pf_minDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  },
  // Versandkosten: teuerste Versandklasse im Warenkorb, ab Gratis-Bestellwert gratis
  // Lieferzone nach PLZ (Zuschlag oder keine Lieferung)
  pf_zone = (o) => {
    const C = parseInt(String(o || "").replace(/\D/g, ""), 10);
    return C >= 1e3 && C <= 9999 ? (pf_catalogSettings.zones || []).find((_) => _.ranges.some(([y, L]) => C >= y && C <= L)) || null : null;
  },
  pf_shipping = (o, C, plz) => {
    if (C !== "lieferung" || !o.length) return 0;
    const _ = o.reduce((y, L) => y + pf_line(L.product, L.variant, L.quantity).total, 0);
    return pf_catalogSettings.freeDeliveryFrom > 0 && _ * 100 >= pf_catalogSettings.freeDeliveryFrom
      ? 0
      : Math.max(0, ...o.map((y) => (pf_vd(y.product, y.variant).shipping || { price: 0 }).price)) + ((pf_zone(plz) || {}).surcharge || 0);
  },
  // Pflanzservice: Preis pro Pflanze je Grösse, mindestens der Mindestbetrag
  pf_planting = (o) => {
    const C = o.reduce((_, y) => _ + (pf_vd(y.product, y.variant).plantingPrice || 0) * y.quantity, 0);
    return C > 0 ? Math.max(C, pf_catalogSettings.plantingMinFee || 0) : 0;
  },
  // Gutschein/Rabattcode, gleiche Rechnung wie auf dem Server
  pf_couponDiscount = (o, C, _) =>
    o
      ? Math.max(0, Math.min(o.type === "prozent" ? (Math.round((Math.round(C * 100) * o.value) / 100 / 5) * 5) / 100 : o.type === "betrag" ? o.value : o.balance || 0, _))
      : 0,
  pf_pickupOnly = (o) => o.filter((C) => pf_vd(C.product, C.variant).pickupOnly),
  pf_store = {
    get(o, C) {
      try {
        const _ = window.localStorage.getItem(o);
        return _ ? JSON.parse(_) : C;
      } catch {
        return C;
      }
    },
    set(o, C) {
      try {
        window.localStorage.setItem(o, JSON.stringify(C));
      } catch {}
    },
  },
  pf_err = (o, C) => {
    const _ = o && o[C];
    return _ ? h("span", { className: "field-error" }, Array.isArray(_) ? _[0] : _) : null;
  };
function pf_Field({ label: o, name: C, form: _, set: y, errors: L, type: X = "text", ...Se }) {
  return h(
    "label",
    { className: L && L[C] ? "has-error" : void 0 },
    o,
    h("input", { type: X, value: _[C] ?? "", onChange: (Le) => y(C, Le.target.value), name: C, ...Se }),
    pf_err(L, C),
  );
}
const pf_norm = (o) =>
  String(o || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
function pf_Search({ articles: o, onClose: C, onProduct: _, onArticle: y }) {
  const [L, X] = H.useState(""),
    Se = H.useRef(null),
    Le = pf_norm(L).split(/\s+/).filter(Boolean),
    ne = (A) => Le.length > 0 && Le.every((p) => A.includes(p)),
    Ne = Le.length
      ? {
          products: Ql.filter((A) => ne(pf_norm([A.name, A.latin, A.category, A.description, ...(A.traits || []), ...(A.variants || [])].join(" ")))).slice(0, 8),
          articles: o.filter((A) => ne(pf_norm([A.title, A.excerpt, ...A.paras].join(" ")))).slice(0, 5),
        }
      : { products: [], articles: [] };
  H.useEffect(() => {
    const A = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => Se.current && Se.current.focus(), 0);
    const p = (B) => B.key === "Escape" && C();
    return (
      window.addEventListener("keydown", p),
      () => {
        (window.removeEventListener("keydown", p), (document.body.style.overflow = A));
      }
    );
  }, []);
  const A = Ne.products.length + Ne.articles.length;
  return h(
    "div",
    { className: "search-overlay", role: "dialog", "aria-modal": "true", "aria-label": "Suche", onClick: (p) => p.target === p.currentTarget && C() },
    h(
      "div",
      { className: "search-panel" },
      h(
        "form",
        { className: "search-panel__field", role: "search", onSubmit: (p) => (p.preventDefault(), Ne.products[0] ? _(Ne.products[0]) : Ne.articles[0] && y(Ne.articles[0].id)) },
        h(eu, { size: 20, "aria-hidden": "true" }),
        h("input", {
          ref: Se,
          autoFocus: !0,
          type: "search",
          value: L,
          onChange: (p) => X(p.target.value),
          placeholder: "Pflanzen und Ratgeber durchsuchen, z. B. Thuja, Sichtschutz, giessen",
          "aria-label": "Suchbegriff",
          autoComplete: "off",
        }),
        h("button", { type: "button", className: "search-panel__close", onClick: C, "aria-label": "Suche schliessen" }, "Esc"),
      ),
      h(
        "div",
        { className: "search-panel__results", "aria-live": "polite" },
        !Le.length && h("p", { className: "search-panel__hint" }, "Suchen Sie nach Pflanzennamen, Eigenschaften wie «immergrün» oder Themen wie «Hecke schneiden»."),
        Le.length > 0 && !A && h("p", { className: "search-panel__hint" }, `Nichts gefunden zu «${L}». Rufen Sie uns an – vieles haben wir auch ausserhalb des Shops: +41 79 336 14 95.`),
        Ne.products.length > 0 &&
          h(
            "section",
            null,
            h("h2", null, "Pflanzen"),
            ...Ne.products.map((p) =>
              h(
                "a",
                {
                  key: p.id,
                  className: "search-hit",
                  href: e0(`/produkt/${p.slug}/`),
                  onClick: (B) => {
                    pf_isPlainClick(B) && (B.preventDefault(), _(p));
                  },
                },
                h("img", { src: He(p.image), srcSet: At(p.imageSet), sizes: "56px", alt: "", loading: "lazy" }),
                h("span", null, h("b", null, p.name), h("small", null, [p.latin, p.priceOnRequest ? "Preis auf Anfrage" : `ab ${Sa(p.price)}`].filter(Boolean).join(" · "))),
              ),
            ),
          ),
        Ne.articles.length > 0 &&
          h(
            "section",
            null,
            h("h2", null, "Ratgeber"),
            ...Ne.articles.map((p) =>
              h(
                "a",
                {
                  key: p.id,
                  className: "search-hit search-hit--article",
                  href: e0(`/ratgeber/${p.id}/`),
                  onClick: (B) => {
                    pf_isPlainClick(B) && (B.preventDefault(), y(p.id));
                  },
                },
                h("span", { className: "search-hit__icon", "aria-hidden": "true" }, h(In, { size: 18 })),
                h("span", null, h("b", null, p.title), h("small", null, (p.excerpt || p.paras[0] || "").slice(0, 110) + " …")),
              ),
            ),
          ),
      ),
    ),
  );
}
// Zusätzliche Icons (Lucide, ISC-Lizenz) für den Steckbrief
const pf_icon = (o, C = 18) =>
    h(
      "svg",
      { xmlns: "http://www.w3.org/2000/svg", width: C, height: C, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
      ...o.map((_, y) => (_.startsWith("c:") ? h("circle", { key: y, cx: 12, cy: 12, r: _.slice(2) }) : h("path", { key: y, d: _ }))),
    ),
  pf_icons = {
    sonne: ["c:4", "M12 2v2", "M12 20v2", "m4.93 4.93 1.41 1.41", "m17.66 17.66 1.41 1.41", "M2 12h2", "M20 12h2", "m6.34 17.66-1.41 1.41", "m19.07 4.93-1.41 1.41"],
    halbschatten: ["M12 2v2", "m4.93 4.93 1.41 1.41", "M20 12h2", "m19.07 4.93-1.41 1.41", "M15.947 12.65a4 4 0 0 0-5.925-4.128", "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"],
    schatten: ["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"],
    height: ["M12 2v20", "m8 18 4 4 4-4", "m8 6 4-4 4 4"],
    growth: ["M22 7 13.5 15.5 8.5 10.5 2 17", "M16 7h6v6"],
    frost: ["m10 20-1.25-2.5L6 18", "M10 4 8.75 6.5 6 6", "m14 20 1.25-2.5L18 18", "m14 4 1.25 2.5L18 6", "m17 21-3-6h-4", "m17 3-3 6 1.5 3", "M2 12h6.5L10 9", "m20 10-1.5 2 1.5 2", "M22 12h-6.5L14 15", "m4 10 1.5 2L4 14", "m7 21 3-6-1.5-3", "m7 3 3 6h4"],
  },
  pf_locLabels = { sonne: "Sonne", halbschatten: "Halbschatten", schatten: "Schatten" },
  pf_useLabels = { hecke: "Hecke", sichtschutz: "Sichtschutz", naschgarten: "Naschgarten", kuebel: "Kübel / Terrasse", solitaer: "Einzelpflanze", bienen: "Bienenfreundlich" },
  pf_m = (o) => (o >= 100 ? `${(o / 100).toLocaleString("de-CH", { maximumFractionDigits: 1 })} m` : `${o} cm`),
  pf_heightText = (o) => (!o || (!o.heightMin && !o.heightMax) ? "" : o.heightMin && o.heightMax && o.heightMin !== o.heightMax ? `${pf_m(o.heightMin).replace(" m", "")}–${pf_m(o.heightMax)}` : pf_m(o.heightMax || o.heightMin));
function pf_Profile({ product: o }) {
  const C = o.profile || {},
    _ = pf_heightText(C);
  if (!(C.locations || []).length && !_ && !C.growth && !C.hardiness && !(C.months || []).length) return null;
  const y = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    L = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  return h(
    "section",
    { className: "profile", "aria-label": "Steckbrief" },
    h("h2", null, "Steckbrief"),
    h(
      "dl",
      { className: "profile__grid" },
      (C.locations || []).length > 0 &&
        h(
          "div",
          null,
          h("dt", null, "Standort"),
          h("dd", { className: "profile__icons" }, ...C.locations.map((X) => h("span", { key: X, title: pf_locLabels[X] }, pf_icon(pf_icons[X] || pf_icons.sonne), " ", pf_locLabels[X] || X))),
        ),
      _ && h("div", null, h("dt", null, "Endhöhe"), h("dd", null, pf_icon(pf_icons.height), " ", _)),
      C.growth && h("div", null, h("dt", null, "Zuwachs"), h("dd", null, pf_icon(pf_icons.growth), ` ca. ${C.growth} cm pro Jahr`)),
      C.hardiness && h("div", null, h("dt", null, "Winterhärte"), h("dd", null, pf_icon(pf_icons.frost), " ", C.hardiness)),
      h("div", null, h("dt", null, "Laub"), h("dd", null, h(il, { size: 18 }), C.evergreen ? " immergrün" : " sommergrün")),
      (C.uses || []).length > 0 && h("div", null, h("dt", null, "Verwendung"), h("dd", null, C.uses.map((X) => pf_useLabels[X] || X).join(", "))),
    ),
    (C.months || []).length > 0 &&
      h(
        "div",
        { className: "profile__months" },
        h("span", null, "Pflanzzeit"),
        h(
          "ol",
          { "aria-label": `Pflanzzeit: ${C.months.map((X) => L[X - 1]).join(", ")}` },
          ...y.map((X, Se) => h("li", { key: Se, className: C.months.includes(Se + 1) ? "on" : "", title: L[Se], "aria-hidden": "true" }, X)),
        ),
      ),
  );
}
function pf_CartDrawer({ added: o, lines: C, total: _, onClose: y, onQty: L, onCheckout: X, onCart: Se }) {
  const Le = H.useRef(null);
  H.useEffect(() => {
    const ne = document.body.style.overflow,
      Ne = document.activeElement;
    ((document.body.style.overflow = "hidden"), window.setTimeout(() => Le.current && Le.current.focus(), 0));
    const A = (p) => p.key === "Escape" && y();
    return (
      window.addEventListener("keydown", A),
      () => {
        (window.removeEventListener("keydown", A), (document.body.style.overflow = ne), Ne && Ne.focus && Ne.focus());
      }
    );
  }, []);
  const ne = pf_shipping(C, "lieferung"),
    Ne = pf_catalogSettings.freeDeliveryFrom > 0 ? pf_catalogSettings.freeDeliveryFrom / 100 - _ : 0;
  return h(
    "div",
    { className: "drawer-backdrop", onClick: (A) => A.target === A.currentTarget && y() },
    h(
      "aside",
      { className: "cart-drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "cart-drawer-title", tabIndex: -1, ref: Le },
      h(
        "header",
        null,
        h("h2", { id: "cart-drawer-title" }, "Warenkorb"),
        h("button", { type: "button", className: "icon-button", onClick: y, "aria-label": "Warenkorb schliessen" }, h(Pm, { size: 20 })),
      ),
      o && h("p", { className: "cart-drawer__added", role: "status" }, h(za, { size: 16 }), ` ${o.quantity > 1 ? o.quantity + " × " : ""}${o.name} (${o.variant}) hinzugefügt`),
      C.length
        ? h(
            "ul",
            { className: "cart-drawer__lines" },
            ...C.map((A) =>
              h(
                "li",
                { key: A.key },
                h("img", { src: He(A.product.image), srcSet: At(A.product.imageSet), sizes: "64px", alt: "", loading: "lazy" }),
                h(
                  "div",
                  null,
                  h("b", null, A.product.name),
                  h("small", null, A.variant, pf_line(A.product, A.variant, A.quantity).percent ? ` · −${pf_line(A.product, A.variant, A.quantity).percent} % Mengenrabatt` : ""),
                  h(
                    "div",
                    { className: "quantity-control quantity-control--small" },
                    h("button", { type: "button", "aria-label": `${A.product.name}: Menge verringern`, onClick: () => L(A.key, -1) }, h(Fm, { size: 14 })),
                    h("span", null, A.quantity),
                    h("button", { type: "button", "aria-label": `${A.product.name}: Menge erhöhen`, onClick: () => L(A.key, 1) }, h(Uc, { size: 14 })),
                  ),
                ),
                h("strong", null, Sa(pf_line(A.product, A.variant, A.quantity).total)),
              ),
            ),
          )
        : h("p", { className: "cart-drawer__empty" }, "Ihr Warenkorb ist leer."),
      C.length > 0 &&
        h(
          "footer",
          null,
          h("div", { className: "cart-drawer__sum" }, h("span", null, "Zwischensumme"), h("strong", null, Sa(_))),
          h(
            "small",
            null,
            pf_pickupOnly(C).length
              ? "Enthält Grössen nur zur Abholung."
              : Ne > 0 && ne > 0
                ? `Lieferung ${Sa(ne)} · noch ${Sa(Ne)} bis zur Gratis-Lieferung · Abholung gratis`
                : ne > 0
                  ? `Lieferung ${Sa(ne)} · Abholung gratis`
                  : "Lieferung gratis",
          ),
          h("button", { type: "button", className: "button button--primary button--full", onClick: X }, "Zur Kasse ", h(Ve, { size: 17 })),
          h(
            "div",
            { className: "cart-drawer__links" },
            h("button", { type: "button", className: "inline-link", onClick: Se }, "Warenkorb bearbeiten"),
            h("button", { type: "button", className: "inline-link", onClick: y }, "Weiter einkaufen"),
          ),
        ),
    ),
  );
}
function pf_BeforeAfter({ before: o, beforeSet: C, after: _, afterSet: y, title: L }) {
  const [X, Se] = H.useState(50);
  return h(
    "div",
    { className: "before-after", style: { "--pos": `${X}%` } },
    h("img", { src: He(_), srcSet: y ? At(y) : void 0, sizes: "(max-width: 900px) 92vw, 50vw", alt: `${L} – nachher`, loading: "lazy" }),
    h("div", { className: "before-after__before" }, h("img", { src: He(o), srcSet: C ? At(C) : void 0, sizes: "(max-width: 900px) 92vw, 50vw", alt: `${L} – vorher`, loading: "lazy" })),
    h("span", { className: "before-after__tag before-after__tag--l", "aria-hidden": "true" }, "Vorher"),
    h("span", { className: "before-after__tag before-after__tag--r", "aria-hidden": "true" }, "Nachher"),
    h("span", { className: "before-after__handle", "aria-hidden": "true" }),
    h("input", { type: "range", min: 0, max: 100, value: X, onChange: (Le) => Se(+Le.target.value), "aria-label": `Vorher/Nachher vergleichen: ${L}` }),
  );
}
function pf_StockAlert({ variantId: o, label: C }) {
  const [_, y] = H.useState(""),
    [L, X] = H.useState(""),
    [Se, Le] = H.useState(!1),
    [ne, Ne] = H.useState(!1);
  return ne
    ? h("p", { className: "stock-alert stock-alert--done", role: "status" }, `Danke! Wir melden uns per E-Mail, sobald ${C} wieder an Lager ist.`)
    : h(
        "form",
        {
          className: "stock-alert",
          onSubmit: async (A) => {
            if ((A.preventDefault(), Se)) return;
            (Le(!0), X(""));
            try {
              (await pf_api("/stock-alerts", { method: "POST", body: { variant_id: o, email: _ } }), Ne(!0));
            } catch (p) {
              X((p.errors && p.errors.email && p.errors.email[0]) || p.message);
            }
            Le(!1);
          },
        },
        h("b", null, "Benachrichtigen, wenn wieder da"),
        h(
          "div",
          null,
          h("input", { type: "email", required: !0, value: _, onChange: (A) => y(A.target.value), placeholder: "Ihre E-Mail-Adresse", "aria-label": "E-Mail-Adresse", autoComplete: "email" }),
          h("button", { type: "submit", className: "button button--dark", disabled: Se }, Se ? "…" : "Eintragen"),
        ),
        L && h("span", { className: "field-error" }, L),
        h("small", null, "Einmalige E-Mail, sobald die Grösse wieder verfügbar ist. Keine Werbung."),
      );
}
function pf_Checkout({ lines: o, user: C, onNavigate: _, onPlaced: y }) {
  const [L, X] = H.useState(() => ({
      name: (C == null ? void 0 : C.name) || "",
      email: (C == null ? void 0 : C.email) || "",
      phone: (C == null ? void 0 : C.phone) || "",
      street: (C == null ? void 0 : C.street) || "",
      postal_code: (C == null ? void 0 : C.postal_code) || "",
      city: (C == null ? void 0 : C.city) || "",
      delivery_method: pf_pickupOnly(o).length ? "abholung" : "lieferung",
      payment_method: "stripe",
      note: "",
      preferred_date: "",
      preferred_slot: "egal",
      planting: !1,
      accept_terms: !1,
      newsletter: !1,
    })),
    [Se, Le] = H.useState({}),
    [ne, Ne] = H.useState(!1),
    [A, p] = H.useState(""),
    B = (k, ye) => X((Ot) => ({ ...Ot, [k]: ye })),
    ge = o.reduce((k, ye) => k + pf_line(ye.product, ye.variant, ye.quantity).total, 0),
    pf_saved = o.reduce((k, ye) => k + pf_line(ye.product, ye.variant, ye.quantity).saved, 0),
    O = pf_shipping(o, L.delivery_method, L.postal_code),
    pf_z = L.delivery_method === "lieferung" ? pf_zone(L.postal_code) : null,
    pf_plant = L.planting && L.delivery_method === "lieferung" && pf_catalogSettings.planting ? pf_planting(o) : 0,
    [pf_cp, pf_setCp] = H.useState(null),
    [pf_step, pf_setStep] = H.useState(1),
    [pf_cin, pf_setCin] = H.useState(""),
    [pf_cbusy, pf_setCbusy] = H.useState(!1),
    pf_cd = pf_couponDiscount(pf_cp, ge, ge + O + pf_plant),
    pf_total = Math.round((ge + O + pf_plant - pf_cd) * 100) / 100,
    pf_applyCoupon = async () => {
      if (!pf_cin.trim() || pf_cbusy) return;
      (pf_setCbusy(!0), Le((k) => ({ ...k, coupon_code: void 0 })));
      try {
        const k = await pf_api("/coupons/check", { method: "POST", body: { code: pf_cin.trim(), subtotal: ge } });
        (pf_setCp(k.coupon), pf_setCin(""));
      } catch (k) {
        Le((ye) => ({ ...ye, coupon_code: [k.message] }));
      }
      pf_setCbusy(!1);
    },
    pf_po = pf_pickupOnly(o),
    re = o.filter((k) => !pf_vd(k.product, k.variant).id || k.product.priceOnRequest);
  H.useEffect(() => {
    C && X((k) => ({ ...k, name: k.name || C.name, email: k.email || C.email, phone: k.phone || C.phone || "", street: k.street || C.street || "", postal_code: k.postal_code || C.postal_code || "", city: k.city || C.city || "" }));
  }, [C]);
  (H.useEffect(() => {
    L.payment_method === "cash" && L.delivery_method !== "abholung" && B("payment_method", "stripe");
  }, [L.delivery_method]),
    H.useEffect(() => {
      pf_po.length && L.delivery_method === "lieferung" && B("delivery_method", "abholung");
    }, [pf_po.length]));
  // Schritte: 1 Angaben, 2 Lieferung, 3 Zahlung & Abschluss
  const pf_stepOf = { name: 1, email: 1, phone: 1, delivery_method: 2, street: 2, postal_code: 2, city: 2, preferred_date: 2, preferred_slot: 2, planting: 2 },
    pf_check = (k) => {
      const ye = {};
      if (k >= 1) {
        L.name.trim().length < 2 && (ye.name = "Bitte geben Sie Ihren Namen an.");
        /^\S+@\S+\.\S+$/.test(L.email.trim()) || (ye.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.");
        L.phone.trim().length < 6 && (ye.phone = "Bitte geben Sie eine Telefonnummer an, für Rückfragen zum Termin.");
      }
      if (k >= 2 && L.delivery_method === "lieferung") {
        L.street.trim() || (ye.street = "Bitte geben Sie die Lieferadresse an.");
        L.postal_code.trim() || (ye.postal_code = "Bitte geben Sie die PLZ an.");
        L.city.trim() || (ye.city = "Bitte geben Sie den Ort an.");
        pf_z && !pf_z.deliverable && (ye.postal_code = "In diese Region liefern wir nicht. Bitte wählen Sie Abholung.");
      }
      return ye;
    },
    pf_go = (k) => {
      const ye = pf_check(k - 1),
        Ot = Object.keys(ye);
      if (Ot.length) {
        (Le(ye), pf_setStep(Math.min(...Ot.map((xe) => pf_stepOf[xe] || 3))));
        return;
      }
      (Le({}), pf_setStep(k), window.setTimeout(() => {
        const xe = document.querySelector(".checkout-steps");
        xe && xe.getBoundingClientRect().top < 0 && xe.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0));
    };
  const ve = async (k) => {
    if ((k.preventDefault(), ne)) return;
    if (pf_step < 3) return pf_go(pf_step + 1);
    (Ne(!0), p(""), Le({}));
    try {
      const ye = await pf_api("/orders", {
        method: "POST",
        body: { ...L, planting: !!pf_plant, coupon_code: pf_cp ? pf_cp.code : null, preferred_date: L.preferred_date || null, preferred_slot: L.preferred_date ? L.preferred_slot : null, items: o.map((Ot) => ({ variant_id: pf_vd(Ot.product, Ot.variant).id, quantity: Ot.quantity })) },
      });
      if (ye.redirect) {
        window.location.href = ye.redirect;
        return;
      }
      y(ye.order.number, ye.token);
    } catch (ye) {
      ((ye.errors || {}).coupon_code && pf_setCp(null), Le(ye.errors || {}), p(ye.message), Ne(!1));
      const pf_s = Object.keys(ye.errors || {}).map((xe) => pf_stepOf[xe] || 3);
      pf_s.length && pf_setStep(Math.min(...pf_s));
      const Ot = document.querySelector(".checkout .has-error, .checkout .form-alert");
      Ot && Ot.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  if (!o.length)
    return h(
      "div",
      { className: "empty-state empty-state--cart" },
      h("h2", null, "Ihr Warenkorb ist leer."),
      h("button", { type: "button", className: "button button--dark", onClick: () => _("shop") }, "Zum Shop"),
    );
  const ht = [
    ["stripe", "Karte oder TWINT", "Sicher bezahlen über Stripe. Sie werden zur Zahlungsseite weitergeleitet.", !0],
    ["invoice", "Rechnung", "Zahlbar innert 30 Tagen, Rechnung per E-Mail.", pf_catalogSettings.invoiceEnabled],
    ["cash", "Barzahlung bei Abholung", "Nur bei Abholung in Ebersecken.", pf_catalogSettings.cashEnabled && L.delivery_method === "abholung"],
  ].filter((k) => k[3]);
  return h(
    "form",
    { className: "checkout", onSubmit: ve, noValidate: !0 },
    h(
      "div",
      { className: "checkout__main" },
      h(
        "ol",
        { className: "checkout-steps", "aria-label": "Schritte der Bestellung" },
        ...["Ihre Angaben", "Lieferung", "Zahlung"].map((k, ye) =>
          h(
            "li",
            { key: k, className: pf_step === ye + 1 ? "is-current" : pf_step > ye + 1 ? "is-done" : "", "aria-current": pf_step === ye + 1 ? "step" : void 0 },
            h(
              "button",
              { type: "button", disabled: ye + 1 > pf_step, onClick: () => pf_setStep(ye + 1) },
              h("span", { className: "checkout-steps__nr" }, pf_step > ye + 1 ? h(za, { size: 14 }) : ye + 1),
              h("span", null, k),
            ),
          ),
        ),
      ),
      A && h("div", { className: "form-alert", role: "alert" }, A),
      re.length > 0 &&
        h("div", { className: "form-alert", role: "alert" }, "Einige Artikel sind nicht mehr online bestellbar. Bitte entfernen Sie sie aus dem Warenkorb."),
      pf_step === 1 &&
      h(
        "section",
        { className: "checkout-card" },
        h("h2", null, "1. Ihre Angaben"),
        !C &&
          h(
            "p",
            { className: "checkout-hint" },
            "Bereits Kunde? ",
            h("button", { type: "button", className: "inline-link", onClick: () => _("account") }, "Anmelden"),
            " – oder einfach als Gast bestellen.",
          ),
        h(
          "div",
          { className: "form-grid" },
          h(pf_Field, { label: "Vor- und Nachname", name: "name", form: L, set: B, errors: Se, autoComplete: "name", required: !0 }),
          h(pf_Field, { label: "E-Mail", name: "email", type: "email", form: L, set: B, errors: Se, autoComplete: "email", required: !0 }),
          h(pf_Field, { label: "Telefon", name: "phone", type: "tel", form: L, set: B, errors: Se, autoComplete: "tel", required: !0 }),
        ),
        h("div", { className: "checkout-next" }, h("button", { type: "button", className: "button button--dark", onClick: () => pf_go(2) }, "Weiter zur Lieferung ", h(Ve, { size: 17 }))),
      ),
      pf_step === 2 &&
      h(
        "section",
        { className: "checkout-card" },
        h("h2", null, "2. Lieferung oder Abholung"),
        h(
          "div",
          { className: "choice-list" },
          ...[
            [
              "lieferung",
              "Lieferung",
              pf_po.length
                ? `Nicht möglich: ${pf_po.map((k) => k.product.name + " (" + k.variant + ")").join(", ")} ${pf_po.length > 1 ? "können" : "kann"} nur abgeholt werden`
                : pf_shipping(o, "lieferung")
                  ? `Schweizweit, ${Sa(pf_shipping(o, "lieferung"))}${(pf_vd(o[0].product, o[0].variant).shipping || {}).name ? " (" + o.map((k) => pf_vd(k.product, k.variant).shipping).filter(Boolean).sort((k, ye) => ye.price - k.price)[0].name + ")" : ""}`
                  : "Schweizweit, gratis",
              pf_po.length > 0,
            ],
            ["abholung", "Abholung in Ebersecken", "Gratis, Termin nach Vereinbarung", !1],
          ].map(([k, ye, Ot, pf_dis]) =>
            h(
              "label",
              { key: k, className: pf_dis ? "choice choice--disabled" : L.delivery_method === k ? "choice choice--active" : "choice" },
              h("input", { type: "radio", name: "delivery_method", disabled: pf_dis, checked: L.delivery_method === k, onChange: () => B("delivery_method", k) }),
              h("span", null, h("b", null, ye), h("small", null, Ot)),
            ),
          ),
        ),
        pf_err(Se, "delivery_method"),
        L.delivery_method === "lieferung" &&
          h(
            "div",
            { className: "form-grid" },
            h(pf_Field, { label: "Strasse und Nr.", name: "street", form: L, set: B, errors: Se, autoComplete: "street-address" }),
            h(pf_Field, { label: "PLZ", name: "postal_code", form: L, set: B, errors: Se, autoComplete: "postal-code", inputMode: "numeric" }),
            h(pf_Field, { label: "Ort", name: "city", form: L, set: B, errors: Se, autoComplete: "address-level2" }),
          ),
        pf_z &&
          !pf_z.deliverable &&
          h("div", { className: "form-alert", role: "alert" }, "In diese Region liefern wir leider nicht. Bitte wählen Sie Abholung in Ebersecken oder rufen Sie uns an: 079 336 14 95."),
        pf_z && pf_z.deliverable && pf_z.surcharge > 0 && O > 0 && h("p", { className: "form-note" }, `Lieferzone ${pf_z.name}: Zuschlag ${Sa(pf_z.surcharge)} (in den Lieferkosten enthalten).`),
        L.delivery_method === "lieferung" &&
          pf_catalogSettings.planting &&
          h(
            "label",
            { className: L.planting ? "choice choice--active planting-choice" : "choice planting-choice" },
            h("input", { type: "checkbox", checked: L.planting, onChange: (k) => B("planting", k.target.checked) }),
            h(
              "span",
              null,
              h("b", null, `Pflanzservice dazubuchen – ${Sa(pf_planting(o))}`),
              h("small", null, `Wir pflanzen Ihre Pflanzen bei der Lieferung fachgerecht ein. Preis pro Pflanze je nach Grösse, mindestens ${Sa(pf_catalogSettings.plantingMinFee || 0)}.`),
            ),
          ),
        h(
          "fieldset",
          { className: "wish-date" },
          h("legend", null, L.delivery_method === "lieferung" ? "Wunschtermin für die Lieferung (optional)" : "Wunschtermin für die Abholung (optional)"),
          h(
            "div",
            { className: "wish-date__row" },
            h(
              "label",
              { className: Se.preferred_date ? "has-error" : "" },
              "Datum",
              h("input", { type: "date", min: pf_minDate(), value: L.preferred_date, onChange: (k) => B("preferred_date", k.target.value) }),
            ),
            h(
              "div",
              { className: "wish-date__slots", role: "radiogroup", "aria-label": "Tageszeit" },
              ...Object.entries(pf_slots).map(([k, ye]) =>
                h(
                  "label",
                  { key: k, className: L.preferred_slot === k ? "slot slot--active" : "slot" },
                  h("input", { type: "radio", name: "preferred_slot", checked: L.preferred_slot === k, disabled: !L.preferred_date, onChange: () => B("preferred_slot", k) }),
                  k === "egal" ? "Egal" : ye,
                ),
              ),
            ),
          ),
          pf_err(Se, "preferred_date"),
          h("small", null, "Frühestens in zwei Tagen, nicht am Sonntag. Wir bestätigen den Termin persönlich."),
        ),
        h(
          "label",
          null,
          "Bemerkung (optional)",
          h("textarea", { rows: 3, value: L.note, onChange: (k) => B("note", k.target.value), placeholder: "z. B. Zufahrt, Ablageort, Pflanzservice gewünscht" }),
        ),
        h(
          "div",
          { className: "checkout-next" },
          h("button", { type: "button", className: "inline-link", onClick: () => pf_setStep(1) }, "Zurück"),
          h("button", { type: "button", className: "button button--dark", onClick: () => pf_go(3) }, "Weiter zur Zahlung ", h(Ve, { size: 17 })),
        ),
      ),
      pf_step === 3 &&
        h(
          "div",
          { className: "checkout-recap" },
          h("div", null, h("small", null, "Ihre Angaben"), h("span", null, `${L.name} · ${L.email} · ${L.phone}`), h("button", { type: "button", className: "inline-link", onClick: () => pf_setStep(1) }, "ändern")),
          h(
            "div",
            null,
            h("small", null, L.delivery_method === "lieferung" ? "Lieferung" : "Abholung"),
            h(
              "span",
              null,
              L.delivery_method === "lieferung" ? `${L.street}, ${L.postal_code} ${L.city}` : "Pflanzfarm, Untergretti 2, 6245 Ebersecken",
              L.preferred_date ? ` · Wunsch: ${pf_fmtDate(L.preferred_date)}${L.preferred_slot !== "egal" ? ", " + pf_slots[L.preferred_slot] : ""}` : "",
              pf_plant ? " · mit Pflanzservice" : "",
            ),
            h("button", { type: "button", className: "inline-link", onClick: () => pf_setStep(2) }, "ändern"),
          ),
        ),
      pf_step === 3 &&
      h(
        "section",
        { className: "checkout-card" },
        h("h2", null, "3. Zahlung"),
        h(
          "div",
          { className: "choice-list" },
          ...ht.map(([k, ye, Ot]) =>
            h(
              "label",
              { key: k, className: L.payment_method === k ? "choice choice--active" : "choice" },
              h("input", { type: "radio", name: "payment_method", checked: L.payment_method === k, onChange: () => B("payment_method", k) }),
              h("span", null, h("b", null, ye), h("small", null, Ot)),
            ),
          ),
        ),
        pf_err(Se, "payment_method"),
      ),
    ),
    h(
      "aside",
      { className: "order-summary checkout__summary" },
      h("h2", null, "Bestellübersicht"),
      h(
        "ul",
        { className: "checkout-lines" },
        ...o.map((k) =>
          h(
            "li",
            { key: `${k.product.id}::${k.variant}` },
            h(
              "span",
              null,
              `${k.quantity} × ${k.product.name}`,
              h("small", null, k.variant, pf_line(k.product, k.variant, k.quantity).percent ? ` · Mengenrabatt ${pf_line(k.product, k.variant, k.quantity).percent} %` : ""),
            ),
            h("b", null, Sa(pf_line(k.product, k.variant, k.quantity).total)),
          ),
        ),
      ),
      h("div", null, h("span", null, "Zwischensumme"), h("strong", null, Sa(ge))),
      pf_saved > 0 && h("div", { className: "order-summary__saving" }, h("span", null, "Sie sparen (Mengenrabatt)"), h("span", null, "−" + Sa(pf_saved))),
      h("div", null, h("span", null, "Lieferung"), h("span", null, O ? Sa(O) : "gratis")),
      pf_plant > 0 && h("div", null, h("span", null, "Pflanzservice"), h("span", null, Sa(pf_plant))),
      pf_cp &&
        h(
          "div",
          { className: "order-summary__saving" },
          h(
            "span",
            null,
            `${pf_cp.type === "gutschein" ? "Gutschein" : "Rabattcode"} ${pf_cp.code} `,
            h("button", { type: "button", className: "coupon-remove", onClick: () => pf_setCp(null), "aria-label": "Code entfernen" }, "×"),
          ),
          h("span", null, "−" + Sa(pf_cd)),
        ),
      !pf_cp &&
        h(
          "div",
          { className: Se.coupon_code ? "coupon-field has-error" : "coupon-field" },
          h("input", {
            value: pf_cin,
            onChange: (k) => pf_setCin(k.target.value),
            onKeyDown: (k) => k.key === "Enter" && (k.preventDefault(), pf_applyCoupon()),
            placeholder: "Gutschein- oder Rabattcode",
            "aria-label": "Gutschein- oder Rabattcode",
            autoComplete: "off",
          }),
          h("button", { type: "button", className: "button button--soft", onClick: pf_applyCoupon, disabled: pf_cbusy || !pf_cin.trim() }, "Einlösen"),
        ),
      pf_err(Se, "coupon_code"),
      h("hr", null),
      h("div", { className: "order-summary__total" }, h("strong", null, "Total inkl. MWST"), h("strong", null, Sa(pf_total))),
      pf_err(Se, "items"),
      h(
        "label",
        { className: Se.accept_terms ? "check has-error" : "check" },
        h("input", { type: "checkbox", checked: L.accept_terms, onChange: (k) => B("accept_terms", k.target.checked) }),
        h("span", null, "Ich akzeptiere die ", h("a", { href: e0(A1.terms), target: "_blank" }, "AGB"), " und habe die ", h("a", { href: e0(A1.privacy), target: "_blank" }, "Datenschutzerklärung"), " gelesen."),
      ),
      pf_err(Se, "accept_terms"),
      h(
        "label",
        { className: "check" },
        h("input", { type: "checkbox", checked: L.newsletter, onChange: (k) => B("newsletter", k.target.checked) }),
        h("span", null, "Ja, ich möchte den Newsletter mit saisonalen Pflanztipps erhalten (jederzeit abbestellbar)."),
      ),
      h(
        "button",
        { type: "submit", className: "button button--primary button--full", disabled: ne || re.length > 0 || (pf_step === 3 && pf_z && !pf_z.deliverable) },
        ne
          ? "Wird gesendet …"
          : pf_step === 1
            ? "Weiter zur Lieferung"
            : pf_step === 2
              ? "Weiter zur Zahlung"
              : L.payment_method === "stripe" && pf_total > 0
                ? "Weiter zu Karte / TWINT"
                : "Zahlungspflichtig bestellen",
        " ",
        h(Ve, { size: 18 }),
      ),
      h("small", null, "Sie erhalten sofort eine Bestellbestätigung per E-Mail. Den Liefer- oder Abholtermin bestätigen wir persönlich – gern nach Ihrem Wunsch."),
    ),
  );
}
function pf_Thanks({ onClear: o, onNavigate: C }) {
  const _ = new URLSearchParams(window.location.search),
    y = _.get("nr"),
    L = _.get("t"),
    [X, Se] = H.useState(null),
    [Le, ne] = H.useState(""),
    [Ne, A] = H.useState(0);
  (H.useEffect(() => {
    o();
  }, []),
    H.useEffect(() => {
      if (!y) return;
      let p = !1;
      return (
        pf_api(`/orders/${encodeURIComponent(y)}?t=${encodeURIComponent(L || "")}`)
          .then((B) => {
            p || (Se(B.order), B.order.paymentStatus === "ausstehend" && Ne < 6 && window.setTimeout(() => A((ge) => ge + 1), 2500));
          })
          .catch((B) => p || ne(B.message)),
        () => {
          p = !0;
        }
      );
    }, [Ne]));
  return h(
    "div",
    { className: "thanks" },
    h("span", { className: "eyebrow" }, "Vielen Dank"),
    h("h1", null, "Ihre Bestellung ist bei uns eingegangen."),
    Le && h("p", { className: "form-alert" }, Le),
    X &&
      h(
        "div",
        { className: "thanks__card" },
        h("p", null, "Bestellnummer ", h("b", null, X.number), ". Eine Bestätigung ist unterwegs an Ihre E-Mail-Adresse."),
        X.paymentStatus === "ausstehend" && h("p", { className: "form-note" }, "Ihre Zahlung wird noch bestätigt – das dauert meist nur wenige Sekunden."),
        h(
          "ul",
          { className: "checkout-lines" },
          ...X.items.map((p, B) => h("li", { key: B }, h("span", null, `${p.quantity} × ${p.name}`, h("small", null, p.variant)), h("b", null, Sa(p.total)))),
          h("li", null, h("span", null, "Lieferung"), h("b", null, X.shipping ? Sa(X.shipping) : "gratis")),
          h("li", { className: "checkout-lines__total" }, h("span", null, "Total"), h("b", null, Sa(X.total))),
        ),
        h("p", null, `${X.deliveryMethodLabel} · ${X.paymentMethodLabel} · ${X.paymentStatusLabel}`),
        h(
          "div",
          { className: "thanks__actions" },
          h("a", { className: "button button--dark", href: `/api/orders/${encodeURIComponent(X.number)}/rechnung?t=${encodeURIComponent(L || "")}`, target: "_blank" }, "Rechnung (PDF)"),
          h("button", { type: "button", className: "button button--soft", onClick: () => C("shop") }, "Weiter einkaufen"),
        ),
      ),
    h("p", null, "Wir melden uns, sobald wir Ihre Bestellung bestätigt und den Termin festgelegt haben. Fragen? +41 79 336 14 95"),
  );
}
function pf_Account({ user: o, setUser: C, toast: _, onNavigate: y }) {
  const L = new URLSearchParams(window.location.search),
    [X, Se] = H.useState(L.get("reset") ? "reset" : "login"),
    [Le, ne] = H.useState({ email: L.get("email") || "", name: "", password: "", password_confirmation: "", phone: "" }),
    [Ne, A] = H.useState({}),
    [p, B] = H.useState(""),
    [ge, O] = H.useState(!1),
    [re, ve] = H.useState(null),
    [ht, Qe] = H.useState(null),
    k = (D, Z) => ne((Q) => ({ ...Q, [D]: Z })),
    ye = async (D, Z, Q) => {
      (O(!0), A({}), B(""));
      try {
        const je = await pf_api(D, Z);
        Q(je);
      } catch (je) {
        (A(je.errors || {}), B(je.message));
      }
      O(!1);
    };
  (H.useEffect(() => {
    L.get("verifiziert") && _("Danke – Ihre E-Mail-Adresse ist bestätigt.");
  }, []),
    H.useEffect(() => {
      o && (ve({ name: o.name || "", phone: o.phone || "", street: o.street || "", postal_code: o.postal_code || "", city: o.city || "", current_password: "", password: "", password_confirmation: "" }), pf_api("/me/orders").then((D) => Qe(D.orders)).catch(() => Qe([])));
    }, [o]));
  const Ot = p && h("div", { className: "form-alert", role: "alert" }, p);
  if (!o) {
    const D = (Z) => h("button", { type: "button", role: "tab", "aria-selected": X === Z[0], className: X === Z[0] ? "active" : "", onClick: () => (Se(Z[0]), A({}), B("")) }, Z[1]);
    return h(
      "div",
      { className: "account account--guest" },
      h("div", { className: "account-tabs", role: "tablist" }, D(["login", "Anmelden"]), D(["register", "Konto erstellen"])),
      Ot,
      X === "login" &&
        h(
          "form",
          { className: "account-card", onSubmit: (Z) => (Z.preventDefault(), ye("/login", { method: "POST", body: { email: Le.email, password: Le.password, remember: !0 } }, (Q) => (Q.redirect ? window.location.assign(Q.redirect) : (C(Q.user), _("Willkommen zurück!"))))) },
          h(pf_Field, { label: "E-Mail", name: "email", type: "email", form: Le, set: k, errors: Ne, autoComplete: "email" }),
          h(pf_Field, { label: "Passwort", name: "password", type: "password", form: Le, set: k, errors: Ne, autoComplete: "current-password" }),
          h("button", { type: "submit", className: "button button--primary", disabled: ge }, "Anmelden"),
          h("button", { type: "button", className: "inline-link", onClick: () => (Se("forgot"), A({}), B("")) }, "Passwort vergessen?"),
        ),
      X === "register" &&
        h(
          "form",
          { className: "account-card", onSubmit: (Z) => (Z.preventDefault(), ye("/register", { method: "POST", body: Le }, (Q) => (C(Q.user), _("Konto erstellt – bitte bestätigen Sie Ihre E-Mail-Adresse.")))) },
          h(pf_Field, { label: "Vor- und Nachname", name: "name", form: Le, set: k, errors: Ne, autoComplete: "name" }),
          h(pf_Field, { label: "E-Mail", name: "email", type: "email", form: Le, set: k, errors: Ne, autoComplete: "email" }),
          h(pf_Field, { label: "Telefon (optional)", name: "phone", type: "tel", form: Le, set: k, errors: Ne, autoComplete: "tel" }),
          h(pf_Field, { label: "Passwort (mind. 10 Zeichen)", name: "password", type: "password", form: Le, set: k, errors: Ne, autoComplete: "new-password" }),
          h(pf_Field, { label: "Passwort wiederholen", name: "password_confirmation", type: "password", form: Le, set: k, errors: Ne, autoComplete: "new-password" }),
          h("p", { className: "form-note" }, "Mit dem Konto sehen Sie Ihre Bestellungen und bestellen schneller. Wir verwenden Ihre Daten gemäss ", h("a", { href: e0(A1.privacy) }, "Datenschutzerklärung"), "."),
          h("button", { type: "submit", className: "button button--primary", disabled: ge }, "Konto erstellen"),
        ),
      X === "forgot" &&
        h(
          "form",
          { className: "account-card", onSubmit: (Z) => (Z.preventDefault(), ye("/forgot-password", { method: "POST", body: { email: Le.email } }, () => (_("Falls ein Konto existiert, ist ein Link unterwegs."), Se("login")))) },
          h("p", null, "Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link, mit dem Sie ein neues Passwort festlegen."),
          h(pf_Field, { label: "E-Mail", name: "email", type: "email", form: Le, set: k, errors: Ne, autoComplete: "email" }),
          h("button", { type: "submit", className: "button button--primary", disabled: ge }, "Link senden"),
        ),
      X === "reset" &&
        h(
          "form",
          {
            className: "account-card",
            onSubmit: (Z) => (
              Z.preventDefault(),
              ye("/reset-password", { method: "POST", body: { token: L.get("reset"), email: Le.email, password: Le.password, password_confirmation: Le.password_confirmation } }, () => {
                (_("Passwort geändert – bitte melden Sie sich an."), Se("login"), window.history.replaceState({}, "", e0(A1.account)));
              })
            ),
          },
          h("h2", null, "Neues Passwort festlegen"),
          h(pf_Field, { label: "E-Mail", name: "email", type: "email", form: Le, set: k, errors: Ne, autoComplete: "email" }),
          h(pf_Field, { label: "Neues Passwort (mind. 10 Zeichen)", name: "password", type: "password", form: Le, set: k, errors: Ne, autoComplete: "new-password" }),
          h(pf_Field, { label: "Passwort wiederholen", name: "password_confirmation", type: "password", form: Le, set: k, errors: Ne, autoComplete: "new-password" }),
          h("button", { type: "submit", className: "button button--primary", disabled: ge }, "Passwort speichern"),
        ),
    );
  }
  const D = (Z, Q) => ve((je) => ({ ...je, [Z]: Q }));
  return h(
    "div",
    { className: "account" },
    !o.verified &&
      h(
        "div",
        { className: "form-alert form-alert--info" },
        "Bitte bestätigen Sie Ihre E-Mail-Adresse über den Link, den wir Ihnen gesendet haben. ",
        h("button", { type: "button", className: "inline-link", onClick: () => ye("/email/verification-notification", { method: "POST" }, () => _("Bestätigungs-E-Mail erneut gesendet.")) }, "Erneut senden"),
      ),
    Ot,
    h(
      "section",
      { className: "account-card" },
      h("h2", null, "Meine Bestellungen"),
      ht === null
        ? h("p", null, "Wird geladen …")
        : ht.length === 0
          ? h("p", null, "Noch keine Bestellungen. ", h("button", { type: "button", className: "inline-link", onClick: () => y("shop") }, "Zum Shop"))
          : h(
              "div",
              { className: "order-list" },
              ...ht.map((Z) =>
                h(
                  "article",
                  { key: Z.number, className: "order-row" },
                  h("div", null, h("b", null, Z.number), h("small", null, new Date(Z.createdAt).toLocaleDateString("de-CH"))),
                  h("div", null, Z.items.map((Q) => `${Q.quantity} × ${Q.name}`).join(", ")),
                  h(
                    "div",
                    null,
                    h("span", { className: `status-badge status-badge--${Z.status}` }, Z.statusLabel),
                    h("small", null, Z.paymentStatusLabel),
                    Z.scheduledDate
                      ? h("small", null, `Termin: ${pf_fmtDate(Z.scheduledDate)}${Z.scheduledSlot && Z.scheduledSlot !== "egal" ? ", " + pf_slots[Z.scheduledSlot] : ""}`)
                      : Z.preferredDate && Z.status !== "storniert" && h("small", null, `Wunsch: ${pf_fmtDate(Z.preferredDate)}`),
                  ),
                  h(
                    "div",
                    null,
                    h("b", null, Sa(Z.total)),
                    h("a", { href: `/api/orders/${encodeURIComponent(Z.number)}/rechnung`, target: "_blank" }, "Rechnung"),
                    Z.cancellable &&
                      h(
                        "button",
                        {
                          type: "button",
                          className: "inline-link inline-link--danger",
                          disabled: ge,
                          onClick: () =>
                            window.confirm(
                              `Bestellung ${Z.number} wirklich stornieren?${Z.paymentStatus === "bezahlt" ? " Der bezahlte Betrag wird Ihnen zurückerstattet." : ""}`,
                            ) &&
                            ye(`/me/orders/${encodeURIComponent(Z.number)}/cancel`, { method: "POST" }, (Q) => {
                              (Qe((je) => je.map((xe) => (xe.number === Z.number ? Q.order : xe))), _("Die Bestellung wurde storniert. Sie erhalten eine Bestätigung per E-Mail."));
                            }),
                        },
                        "Stornieren",
                      ),
                  ),
                ),
              ),
            ),
    ),
    re &&
      h(
        "form",
        { className: "account-card", onSubmit: (Z) => (Z.preventDefault(), ye("/me", { method: "PUT", body: re }, (Q) => (C(Q.user), _("Angaben gespeichert.")))) },
        h("h2", null, "Meine Angaben"),
        h(
          "div",
          { className: "form-grid" },
          h(pf_Field, { label: "Name", name: "name", form: re, set: D, errors: Ne, autoComplete: "name" }),
          h("label", null, "E-Mail", h("input", { value: o.email, disabled: !0 })),
          h(pf_Field, { label: "Telefon", name: "phone", type: "tel", form: re, set: D, errors: Ne, autoComplete: "tel" }),
          h(pf_Field, { label: "Strasse und Nr.", name: "street", form: re, set: D, errors: Ne, autoComplete: "street-address" }),
          h(pf_Field, { label: "PLZ", name: "postal_code", form: re, set: D, errors: Ne, autoComplete: "postal-code" }),
          h(pf_Field, { label: "Ort", name: "city", form: re, set: D, errors: Ne, autoComplete: "address-level2" }),
        ),
        h(
          "details",
          null,
          h("summary", null, "Passwort ändern"),
          h(
            "div",
            { className: "form-grid" },
            h(pf_Field, { label: "Aktuelles Passwort", name: "current_password", type: "password", form: re, set: D, errors: Ne, autoComplete: "current-password" }),
            h(pf_Field, { label: "Neues Passwort", name: "password", type: "password", form: re, set: D, errors: Ne, autoComplete: "new-password" }),
            h(pf_Field, { label: "Wiederholen", name: "password_confirmation", type: "password", form: re, set: D, errors: Ne, autoComplete: "new-password" }),
          ),
        ),
        h("button", { type: "submit", className: "button button--primary", disabled: ge }, "Speichern"),
      ),
    h(
      "section",
      { className: "account-card" },
      h("h2", null, "Meine Daten"),
      h("p", null, "Sie können alle bei uns gespeicherten Daten herunterladen oder Ihr Konto löschen. Bestellungen bewahren wir wegen der gesetzlichen Aufbewahrungspflicht auf, aber ohne Verknüpfung zum Konto."),
      h(
        "div",
        { className: "account-actions" },
        h("a", { className: "button button--soft", href: "/api/me/export", download: "pflanzfarm-meine-daten.json" }, "Daten herunterladen"),
        h(
          "button",
          {
            type: "button",
            className: "button button--soft",
            onClick: () => ye("/logout", { method: "POST" }, () => (C(null), _("Sie sind abgemeldet."))),
          },
          "Abmelden",
        ),
      ),
      h(
        "details",
        { className: "danger-zone" },
        h("summary", null, "Konto löschen"),
        h(
          "form",
          { onSubmit: (Z) => (Z.preventDefault(), ye("/me", { method: "DELETE", body: { password: re ? re.current_password : "" } }, () => (C(null), _("Ihr Konto wurde gelöscht.")))) },
          h("p", null, "Zur Bestätigung bitte Ihr Passwort eingeben."),
          re && h(pf_Field, { label: "Passwort", name: "current_password", type: "password", form: re, set: D, errors: { current_password: Ne.password }, autoComplete: "current-password" }),
          h("button", { type: "submit", className: "button button--danger", disabled: ge }, "Konto endgültig löschen"),
        ),
      ),
    ),
  );
}
// Rechtstexte von Pflanzfarm (AGB, Versandbedingungen, Widerrufsbelehrung): [Überschrift, Einleitung, Aufzählung]
const pf_terms = [
  {
    id: "agb",
    title: "Allgemeine Geschäftsbedingungen",
    sections: [
      ["§ 1 Geltungsbereich", "Diese AGB gelten für alle Verträge, die zwischen der Pflanzfarm (nachfolgend «Anbieter» genannt) und den Kunden über den Online-Shop abgeschlossen werden. Abweichende Bedingungen des Kunden finden keine Anwendung, sofern der Anbieter nicht ausdrücklich schriftlich zugestimmt hat.", []],
      ["§ 2 Vertragsschluss", null, [
        "Die Präsentation der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Bestellung.",
        "Durch Anklicken des Buttons «Zahlungspflichtig bestellen» geben Sie ein verbindliches Angebot zum Abschluss eines Kaufvertrages ab.",
        "Der Vertrag kommt erst mit der ausdrücklichen Annahme Ihrer Bestellung durch eine Auftragsbestätigung per E-Mail zustande.",
      ]],
      ["§ 3 Preise und Zahlungsbedingungen", null, [
        "Alle angegebenen Preise verstehen sich in Schweizer Franken (CHF) inkl. der gesetzlichen Mehrwertsteuer, sofern diese anfällt.",
        "Zusätzliche Versandkosten werden gesondert ausgewiesen und sind im Bestellvorgang zu berücksichtigen.",
        "Die Zahlung erfolgt wahlweise per Kredit- oder Debitkarte, TWINT, auf Rechnung, bar bei Abholung oder mit anderen im Bestellprozess angebotenen Zahlungsmethoden.",
      ]],
      ["§ 4 Lieferung", null, [
        "Die Lieferung erfolgt ausschliesslich an die von Ihnen angegebene Lieferadresse innerhalb der Schweiz. Nach Absprache können Sie die Ware auch bei uns in Ebersecken abholen.",
        "Angaben zu Lieferzeiten und Verfügbarkeiten der Produkte finden Sie in unseren Versandbedingungen.",
        "Teillieferungen können vorkommen, sofern dies für die Erfüllung der Bestellung notwendig ist.",
      ]],
      ["§ 5 Eigentumsvorbehalt", "Die gelieferten Waren bleiben bis zur vollständigen Bezahlung im Eigentum des Anbieters.", []],
      ["§ 6 Gewährleistung und Haftung", null, [
        "Es gilt das gesetzlich vorgeschriebene Gewährleistungsrecht.",
        "Der Anbieter haftet nur für Schäden, die auf grober Fahrlässigkeit oder Vorsatz beruhen. Bei leichter Fahrlässigkeit haftet der Anbieter nur, sofern wesentliche Vertragspflichten (Kardinalpflichten) verletzt wurden.",
        "Eine weitergehende Haftung ist ausgeschlossen.",
      ]],
      ["§ 7 Schlussbestimmungen", null, [
        "Änderungen oder Ergänzungen des Vertrages bedürfen der Schriftform.",
        "Sollte eine Bestimmung dieser AGB unwirksam sein, bleiben die übrigen Bestimmungen davon unberührt.",
        "Gerichtsstand ist – soweit gesetzlich zulässig – der Sitz des Anbieters.",
      ]],
    ],
  },
  {
    id: "versand",
    title: "Versandbedingungen",
    sections: [
      ["1. Liefergebiet", "Die Lieferung erfolgt ausschliesslich innerhalb der Schweiz an die von Ihnen angegebene Lieferadresse.", []],
      ["2. Lieferzeiten", null, [
        "Die Bearbeitungszeit Ihrer Bestellung beträgt in der Regel 1–2 Werktage.",
        "Die Zustellung erfolgt abhängig von der gewählten Versandart meist innerhalb von 2–5 Werktagen.",
        "Bei Lieferverzögerungen informieren wir Sie umgehend per E-Mail.",
      ]],
      ["3. Versandkosten", null, [
        "Die Versandkosten werden während des Bestellvorgangs transparent ausgewiesen und richten sich nach dem Gesamtbestellwert sowie der Lieferadresse.",
        "Für Bestellungen ab einem bestimmten Bestellwert bieten wir versandkostenfreie Lieferung an (sofern im Online-Shop angegeben).",
      ]],
      ["4. Versanddienstleister", "Die Lieferung erfolgt über zuverlässige Versanddienstleister. Der Anbieter behält sich das Recht vor, den Versanddienstleister nach eigenem Ermessen zu wählen.", []],
      ["5. Lieferung an Packstationen und Postfächer", "Sofern die gewählte Versandart dies zulässt, erfolgt die Lieferung auch an Packstationen oder Postfächer. Bitte beachten Sie, dass für solche Lieferungen eventuell abweichende Lieferzeiten gelten können.", []],
    ],
  },
  {
    id: "widerruf",
    title: "Widerrufsbelehrung",
    intro: "Wichtiger Hinweis für Verbraucher (Verbraucher im Sinne des Schweizer Konsumrechts): In der Schweiz besteht grundsätzlich kein gesetzliches Widerrufsrecht für Fernabsatzverträge, sofern der Unternehmer seinen Sitz in der Schweiz hat. Sollte dennoch ein Widerrufsrecht vereinbart werden (z. B. im Rahmen von Kulanzregelungen), gelten folgende Bedingungen:",
    sections: [
      ["1. Widerrufsrecht", "Sofern Ihnen ein Widerrufsrecht eingeräumt wurde, können Sie den Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen widerrufen. Die Frist beginnt mit Erhalt der Ware.", []],
      ["2. Widerrufsverfahren", "Um Ihr Widerrufsrecht auszuüben, senden Sie uns bitte eine eindeutige Erklärung per E-Mail an info@pflanzfarm.ch.", []],
      ["3. Folgen des Widerrufs", "Im Falle eines wirksamen Widerrufs erstatten wir Ihnen alle Zahlungen, einschliesslich der Lieferkosten, unverzüglich (innerhalb von 14 Tagen) zurück, sobald die Ware zurückgegangen ist oder Sie den Nachweis der Rücksendung erbracht haben.", []],
      ["4. Rücksendekosten", "Sofern nichts anderes vereinbart wurde, tragen Sie die unmittelbaren Kosten der Rücksendung der Ware.", []],
    ],
  },
];
function O1() {
  const [o, C] = H.useState(() => t0(Ii())),
    [_, y] = H.useState(() => jf(Ii())),
    [L, X] = H.useState(() => jf(Ii()).variants[0]),
    [Se, Le] = H.useState(() => pf_store.get("pflanzfarm-warenkorb", {})),
    [ne, Ne] = H.useState(""),
    [A, p] = H.useState("Alle Pflanzen"),
    [B, ge] = H.useState("Alle Merkmale"),
    [pf_flt, pf_setFlt] = H.useState({ loc: [], evergreen: !1, use: "", height: "", price: "" }),
    [pf_fltOpen, pf_setFltOpen] = H.useState(!1),
    [pf_loaded, pf_setLoaded] = H.useState(!1),
    
    
    [Qe, k] = H.useState(!1),
    
    [R, te] = H.useState(p1),
    
    [Ce, bt] = H.useState({ preferences: !0, savedAt: "", version: xf }),
    [ut, Mt] = H.useState(!1),
    [gl, ke] = H.useState(!1),
    [D, Z] = H.useState(!1),
    [Q, je] = H.useState(!1),
    [me, jt] = H.useState(null),
    [Ct, Ue] = H.useState(""),
    [pf_cs, pf_setCs] = H.useState(pf_readConsent),
    [pf_bo, pf_setBo] = H.useState(() => pf_readConsent() === null),
    [d, N] = H.useState(1),
    [G, Y] = H.useState(!1),
    [ae, fe] = H.useState(() => pf_store.get("pflanzfarm-merkliste", [])),
    [pf_user, pf_setUser] = H.useState(null),
    [pf_ver, pf_setVer] = H.useState(0),
    [pf_onlySaved, pf_setOnlySaved] = H.useState(!1),
    [de, q] = H.useState(null),
    [F, Bt] = H.useState(!1),
    [Ta, Xl] = H.useState("popular"),
    [pt, Xe] = H.useState("Alle"),
    [pe, qt] = H.useState("pflanzung"),
    [Ie, kt] = H.useState("photo"),
    [pf_path, pf_setPath] = H.useState(Ii),
    [pf_drawer, pf_setDrawer] = H.useState(null),
    [pf_buyVisible, pf_setBuyVisible] = H.useState(!0),
    [pf_search, pf_setSearch] = H.useState(!1),
    [Ea, _a] = H.useState(""),
    [Al, tn] = H.useState(!1),
    [ln, li] = H.useState(!1),
    [tu, ul] = H.useState(!1),
    an = H.useRef(null),
    nn = H.useRef(null),
    lu = H.useRef(null),
    au = H.useRef(null),
    un = H.useRef(null),
    cn = H.useRef(!1),
    sn = H.useRef(new Set()),
    Aa = H.useRef(null),
    Oa = H.useRef(null),
    et = H.useMemo(() => Object.entries(Se).map(([v, T]) => ({ key: v, ...T })), [Se]),
    Ma = et.reduce((v, T) => v + T.quantity, 0),
    ai = et.reduce((v, T) => v + pf_line(T.product, T.variant, T.quantity).total, 0),
    rn = R.target === "alle" || (R.target === "startseite" && o === "home") || (R.target === "shop" && o === "shop"),
    Ol = new Date().toISOString().slice(0, 10),
    nu = (!R.startsAt || R.startsAt <= Ol) && (!R.endsAt || R.endsAt >= Ol),
    zt = `pflanzfarm-popup:${R.title}:${R.startsAt}:${R.endsAt}`,
    qc = () =>
      R.frequency === "immer"
        ? !0
        : Ce != null && Ce.preferences
          ? R.frequency === "sitzung"
            ? window.sessionStorage.getItem(zt) !== "shown"
            : R.frequency === "taeglich"
              ? window.localStorage.getItem(zt) !== Ol
              : window.localStorage.getItem(zt) !== "shown"
          : !sn.current.has(zt),
    ni = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    Ca = () => {
      (R.frequency !== "immer" && sn.current.add(zt),
        Ce != null &&
          Ce.preferences &&
          (R.frequency === "sitzung" && window.sessionStorage.setItem(zt, "shown"),
          R.frequency === "taeglich" && window.localStorage.setItem(zt, Ol),
          R.frequency === "einmalig" && window.localStorage.setItem(zt, "shown")));
    },
    mt = (v) => {
      const T = { preferences: v, savedAt: new Date().toISOString(), version: xf };
      bt(T);
      try {
        window.localStorage.setItem("pflanzfarm-consent", JSON.stringify(T));
      } catch {}
      (Mt(!1),
        Ue(v ? "Optionale Funktionsspeicherung ist aktiviert." : "Es werden nur notwendige Einstellungen verwendet."));
    },
    pf_decide = (v) => {
      pf_setCs(v);
      pf_setBo(!1);
      try {
        window.localStorage.setItem(pf_consentKey, JSON.stringify({ analytics: v, savedAt: new Date().toISOString() }));
      } catch {}
      (pf_applyConsent(v), Ue(v ? "Danke – Ihre Einwilligung wurde gespeichert." : "Ihre Auswahl wurde gespeichert."));
      // Fokus nicht auf den Sprunglink fallen lassen, wenn der Hinweis verschwindet
      window.setTimeout(() => {
        var T;
        return (T = document.getElementById("main-content")) == null ? void 0 : T.focus({ preventScroll: !0 });
      }, 0);
    },
    cl = () => {
      (ke((Ce == null ? void 0 : Ce.preferences) ?? !1), Mt(!0));
    };
  (H.useEffect(() => {
    try {
      const v = window.localStorage.getItem("pflanzfarm-consent");
      if (v) {
        const T = JSON.parse(v);
        if (typeof T.preferences == "boolean" && T.version === xf) {
          (bt({ preferences: T.preferences, savedAt: typeof T.savedAt == "string" ? T.savedAt : "", version: xf }),
            ke(T.preferences));
          return;
        }
      }
    } catch {}
  }, []),
    H.useEffect(() => {
      const v = () => {
        const T = t0(Ii());
        if (T === "product") {
          const E = jf(Ii());
          (y(E), X(E.variants[0]), N(1));
        }
        (pf_setPath(Ii()), C(T));
      };
      return (window.addEventListener("popstate", v), () => window.removeEventListener("popstate", v));
    }, []),
    H.useEffect(() => {
      const pf_a = o === "guide" ? pf_article(pf_path) : null,
        pf_t = o === "product" ? `${_.name} kaufen | Pflanzfarm` : pf_a ? `${pf_a.title} | Ratgeber Pflanzfarm` : _1[o],
        pf_d = o === "product" ? `${_.name} (${_.latin}): ${_.description} Lieferung schweizweit oder Abholung in Ebersecken.` : pf_a ? pf_a.excerpt || pf_a.paras[0] : pf_desc[o],
        pf_p = o === "product" ? `/produkt/${_.slug}/` : pf_a ? `/ratgeber/${pf_a.id}/` : A1[o],
        pf_set = (sel, attr, val, mk) => {
          let el = document.head.querySelector(sel);
          (el || ((el = document.createElement(mk[0])), el.setAttribute(mk[1], mk[2]), document.head.appendChild(el)),
            el.setAttribute(attr, val));
        };
      ((document.title = pf_t),
        pf_set('meta[name="description"]', "content", pf_d, ["meta", "name", "description"]),
        pf_set('meta[property="og:title"]', "content", pf_t, ["meta", "property", "og:title"]),
        pf_set('meta[property="og:description"]', "content", pf_d, ["meta", "property", "og:description"]),
        pf_set('meta[property="og:url"]', "content", pf_site + pf_p, ["meta", "property", "og:url"]),
        pf_set('link[rel="canonical"]', "href", pf_site + pf_p, ["link", "rel", "canonical"]));
      const v = window.setTimeout(() => {
        var T;
        return (T = document.getElementById("main-content")) == null ? void 0 : T.focus({ preventScroll: !0 });
      }, 0);
      return () => window.clearTimeout(v);
    }, [o, _, pf_path]),
    H.useEffect(() => {
      if (o !== "product") return;
      // Kaufleiste zeigen, sobald der Kaufbereich nach oben aus dem Bild gescrollt ist
      const v = () => {
        const T = document.getElementById("pf-buy");
        pf_setBuyVisible(!T || T.getBoundingClientRect().bottom > 0);
      };
      return (v(), window.addEventListener("scroll", v, { passive: !0 }), () => (window.removeEventListener("scroll", v), pf_setBuyVisible(!0)));
    }, [o]),
    H.useEffect(() => {
      let v = null;
      const T = () => {
        v === null &&
          (v = window.requestAnimationFrame(() => {
            var Te;
            const E = window.scrollY,
              K = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
              De = E > 24;
            (cn.current !== De && ((cn.current = De), Y(De)),
              (Te = un.current) == null ||
                Te.style.setProperty("transform", `scaleX(${Math.min(Math.max(E / K, 0), 1)})`),
              (v = null));
          }));
      };
      return (
        T(),
        window.addEventListener("scroll", T, { passive: !0 }),
        window.addEventListener("resize", T),
        () => {
          (window.removeEventListener("scroll", T),
            window.removeEventListener("resize", T),
            v !== null && window.cancelAnimationFrame(v));
        }
      );
    }, [o]),
    H.useEffect(() => {
      const v = window.matchMedia("(prefers-reduced-motion: reduce)"),
        pf_w = window.matchMedia("(min-width: 761px)"),
        T = () => {
          const pf_c = navigator.connection,
            E = !v.matches && !(pf_c && pf_c.saveData);
          (li(E), E || ul(!1));
        };
      return (
        T(),
        v.addEventListener("change", T),
        pf_w.addEventListener("change", T),
        () => {
          (v.removeEventListener("change", T), pf_w.removeEventListener("change", T));
        }
      );
    }, []),
    H.useEffect(() => {
      (k(!1), jt(null), ni());
    }, [o]),
    H.useEffect(() => {
      pf_cs === !0 && pf_applyConsent(!0);
    }, []),
    H.useEffect(() => {
      pf_store.set("pflanzfarm-warenkorb", Se);
    }, [Se]),
    H.useEffect(() => {
      pf_store.set("pflanzfarm-merkliste", ae);
    }, [ae]),
    H.useEffect(() => {
      const v = new URLSearchParams(window.location.search),
        T = { bestaetigt: "Danke – Ihre Newsletter-Anmeldung ist bestätigt.", abgemeldet: "Sie sind vom Newsletter abgemeldet.", ungueltig: "Der Link ist ungültig oder abgelaufen." }[v.get("newsletter")];
      (T && (Ue(T), window.history.replaceState({}, "", window.location.pathname)),
        v.get("zahlung") === "abgebrochen" && Ue("Die Zahlung wurde abgebrochen. Ihr Warenkorb ist noch da."),
        v.get("pflegetipps") === "abgemeldet" && (Ue("Sie erhalten keine Pflegetipps mehr von uns."), window.history.replaceState({}, "", window.location.pathname)),
        pf_api("/me")
          .then((E) => pf_setUser(E.user))
          .catch(() => {}),
        pf_api("/catalog")
          .then((E) => {
            (Ql.splice(0, Ql.length, ...E.products),
              (pf_refs = E.references),
              Sf.splice(0, Sf.length, ...E.references.filter((K) => K.onHomepage).slice(0, 3)),
              (pf_articles = E.articles),
              (pf_catalogSettings = { ...pf_catalogSettings, ...E.settings }),
              te(
                E.popup
                  ? { active: !0, frequency: "sitzung", ...E.popup }
                  : (K) => ({ ...K, active: !1 }),
              ),
              Le((K) => {
                const De = {};
                for (const [Te, vt] of Object.entries(K)) {
                  const yt = Ql.find((Ft) => Ft.slug === vt.product.slug);
                  yt && !yt.priceOnRequest && yt.variants.includes(vt.variant) && (De[`${yt.id}::${vt.variant}`] = { ...vt, product: yt });
                }
                return De;
              }));
            const K = t0(Ii());
            if (K === "product") {
              const De = jf(Ii());
              (y(De), X((Te) => (De.variants.includes(Te) ? Te : De.variants[0])));
            }
            (pf_setVer((De) => De + 1), pf_setLoaded(!0));
          })
          .catch(() => pf_setLoaded(!0)));
    }, []),
    H.useEffect(() => {
      const v = Q || (pf_cs !== null && R.active && nu && qc());
      if (o === "admin" || !rn || !v || (!Q && me === zt)) {
        Z(!1);
        return;
      }
      const T = window.setTimeout(() => {
        (Z(!0), Q || Ca());
      }, R.delay * 1e3);
      return () => window.clearTimeout(T);
    }, [o, R.active, R.delay, R.frequency, R.startsAt, R.endsAt, R.target, R.title, rn, nu, Q, me, zt, Ce, pf_cs]),
    H.useEffect(() => {
      if (!ut) return;
      const v = document.activeElement instanceof HTMLElement ? document.activeElement : null,
        T = document.querySelector(".app"),
        E = document.body.style.overflow;
      (T == null || T.setAttribute("inert", ""), (document.body.style.overflow = "hidden"));
      const K = an.current;
      K == null || K.focus();
      const De = (Te) => {
        if ((Te.key === "Escape" && Ce && Mt(!1), Te.key !== "Tab" || !K)) return;
        const vt = Array.from(K.querySelectorAll("button, input, select, textarea, [href]")).filter(
          (Ml) => !Ml.hasAttribute("disabled"),
        );
        if (!vt.length) return;
        const yt = vt[0],
          Ft = vt[vt.length - 1];
        (Te.shiftKey && document.activeElement === yt && (Te.preventDefault(), Ft.focus()),
          !Te.shiftKey && document.activeElement === Ft && (Te.preventDefault(), yt.focus()));
      };
      return (
        window.addEventListener("keydown", De),
        () => {
          (window.removeEventListener("keydown", De),
            T == null || T.removeAttribute("inert"),
            (document.body.style.overflow = E),
            v == null || v.focus());
        }
      );
    }, [ut, Ce]),
    H.useEffect(() => {
      if (!Ct) return;
      const v = window.setTimeout(() => Ue(""), 2600);
      return () => window.clearTimeout(v);
    }, [Ct]),
    H.useEffect(
      () => () => {
        (Aa.current && window.clearTimeout(Aa.current), Oa.current && window.clearTimeout(Oa.current));
      },
      [],
    ));
  const tt = () => {
    (Z(!1), jt(zt), je(!1));
  };
  H.useEffect(() => {
    if (!D) return;
    const v = document.activeElement instanceof HTMLElement ? document.activeElement : null,
      T = document.querySelector(".app"),
      E = document.body.style.overflow;
    (T == null || T.setAttribute("inert", ""), (document.body.style.overflow = "hidden"));
    const K = nn.current;
    K == null || K.focus();
    const De = (Te) => {
      if ((Te.key === "Escape" && tt(), Te.key !== "Tab" || !K)) return;
      const vt = Array.from(K.querySelectorAll("button, [href]")).filter((Ml) => !Ml.hasAttribute("disabled"));
      if (!vt.length) return;
      const yt = vt[0],
        Ft = vt[vt.length - 1];
      (Te.shiftKey && document.activeElement === yt && (Te.preventDefault(), Ft.focus()),
        !Te.shiftKey && document.activeElement === Ft && (Te.preventDefault(), yt.focus()));
    };
    return (
      window.addEventListener("keydown", De),
      () => {
        (window.removeEventListener("keydown", De),
          T == null || T.removeAttribute("inert"),
          (document.body.style.overflow = E),
          v == null || v.focus());
      }
    );
  }, [D, zt]);
  const I = (v) => {
      const T = v === o && pf_path === A1[v];
      (window.history.pushState({}, "", e0(A1[v])),
        pf_setPath(A1[v]),
        C(v),
        T &&
          (k(!1),
          ni(),
          window.setTimeout(() => {
            var E;
            return (E = document.getElementById("main-content")) == null ? void 0 : E.focus({ preventScroll: !0 });
          }, 0)));
    },
    pf_request = (v) => {
      ((pf_prefillText = v), window.dispatchEvent(new CustomEvent("pf-prefill", { detail: v })), o !== "contact" && I("contact"));
      window.setTimeout(() => {
        var T;
        return (T = document.getElementById("anfrage")) == null ? void 0 : T.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    },
    Lk = (v, T) => ({
      href: e0(A1[v]),
      "data-nav": "",
      onClick: (E) => {
        pf_isPlainClick(E) && (E.preventDefault(), T && T(), I(v));
      },
    }),
    pf_openArticle = (v) => {
      (window.history.pushState({}, "", e0(`/ratgeber/${v}/`)), pf_setPath(`/ratgeber/${v}/`), C("guide"), ni());
    },
    kc = (v) => {
      (window.history.pushState({}, "", e0(`/produkt/${v.slug}/`)),
        pf_setPath(`/produkt/${v.slug}/`),
        y(v),
        X(v.variants[0]),
        N(1),
        qt("pflanzung"),
        kt("photo"),
        ni(),
        C("product"));
    },
    iu = (v) => kc(v),
    fn = () => {
      (I("shop"),
        window.setTimeout(() => {
          var v;
          return (v = lu.current) == null ? void 0 : v.focus();
        }, 0));
    },
    Kl = (v, T = 1, E = v.variants[0]) => {
      const K = `${v.id}::${E}`;
      (Le((De) => {
        var Te;
        return {
          ...De,
          [K]: { product: v, variant: E, quantity: (((Te = De[K]) == null ? void 0 : Te.quantity) ?? 0) + T },
        };
      }),
        Aa.current && window.clearTimeout(Aa.current),
        Oa.current && window.clearTimeout(Oa.current),
        q(v.id),
        Bt(!1),
        window.requestAnimationFrame(() => Bt(!0)),
        (Aa.current = window.setTimeout(() => q(null), 900)),
        (Oa.current = window.setTimeout(() => Bt(!1), 460)),
        pf_setDrawer({ name: v.name, variant: E, quantity: T }));
    },
    Da = (v) => {
      fe((T) => (T.includes(v) ? T.filter((E) => E !== v) : [...T, v]));
    },
    vl = () => {
      if (!/^\S+@\S+\.\S+$/.test(Ea.trim())) {
        Ue("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;
      }
      pf_api("/newsletter", { method: "POST", body: { email: Ea.trim(), source: "website" } })
        .then(() => tn(!0))
        .catch((v) => Ue(v.message));
    },
    Jl = (v, T) => {
      Le((E) => {
        const K = E[v];
        if (!K) return E;
        const De = Math.max(0, K.quantity + T);
        if (De === 0) {
          const { [v]: Te, ...vt } = E;
          return (
            window.setTimeout(() => {
              var yt;
              return (yt = document.getElementById("cart-heading")) == null ? void 0 : yt.focus();
            }, 0),
            vt
          );
        }
        return { ...E, [v]: { ...K, quantity: De } };
      });
    },
    pf_fltCount = pf_flt.loc.length + (pf_flt.evergreen ? 1 : 0) + (pf_flt.use ? 1 : 0) + (pf_flt.height ? 1 : 0) + (pf_flt.price ? 1 : 0),
    pf_resetFilters = () => {
      (Ne(""), p("Alle Pflanzen"), ge("Alle Merkmale"), pf_setFlt({ loc: [], evergreen: !1, use: "", height: "", price: "" }), pf_setOnlySaved(!1));
    },
    dn = [
      ...Ql.filter((v) => {
        const T = `${v.name} ${v.latin} ${(v.traits || []).join(" ")}`.toLowerCase().includes(ne.toLowerCase()),
          E = (A === "Alle Pflanzen" || v.category === A) && (!pf_onlySaved || ae.includes(v.id)),
          K = B === "Alle Merkmale" || v.traits.includes(B),
          De = v.profile || {},
          Te = De.heightMax || De.heightMin || 0,
          He2 =
            (!pf_flt.loc.length || pf_flt.loc.some((Ce) => (De.locations || []).includes(Ce))) &&
            (!pf_flt.evergreen || De.evergreen) &&
            (!pf_flt.use || (De.uses || []).includes(pf_flt.use)) &&
            (!pf_flt.height || (Te > 0 && (pf_flt.height === "klein" ? Te <= 150 : pf_flt.height === "mittel" ? Te > 150 && (De.heightMin || Te) <= 300 : Te > 300))) &&
            (!pf_flt.price || (!v.priceOnRequest && v.price > 0 && v.price <= +pf_flt.price));
        return T && E && K && He2;
      }),
    ].sort((v, T) =>
      Ta === "price-asc"
        ? v.price - T.price
        : Ta === "price-desc"
          ? T.price - v.price
          : Ta === "name"
            ? v.name.localeCompare(T.name, "de")
            : Ta === "growth"
              ? ((T.profile || {}).growth || 0) - ((v.profile || {}).growth || 0)
              : Ql.indexOf(v) - Ql.indexOf(T),
    ),
    ii = () => {
      (jt(null), je(!0), Z(!1), I(R.target === "shop" ? "shop" : "home"));
    },
    wa = (v) => {
      ((au.current = v),
        v &&
          (v.setAttribute("playsinline", ""),
          v.setAttribute("webkit-playsinline", ""),
          (v.muted = !0),
          (v.defaultMuted = !0),
          (v.playsInline = !0),
          (v.controls = !1),
          (v.disablePictureInPicture = !0)));
    },
    Gc = (v) => {
      ((v.muted = !0), (v.defaultMuted = !0), v.play().catch(() => {}), ul(!0));
    },
    cu = () =>
      i.jsxs("header", {
        className: G ? "site-header site-header--scrolled" : "site-header",
        children: [
          i.jsxs("div", {
            className: "announcement-bar",
            children: [
              i.jsxs("span", { children: [i.jsx(Rc, { size: 14 }), " Schweizweit lieferbar"] }),
              i.jsxs("span", { children: [i.jsx(il, { size: 14 }), " Schweizer Familienbetrieb"] }),
              i.jsxs("span", { children: [i.jsx(c0, { size: 14 }), " Für Gärten, die bleiben"] }),
            ],
          }),
          i.jsx("span", { ref: un, className: "scroll-progress", "aria-hidden": "true" }),
          i.jsxs("div", {
            className: "site-header__main container",
            children: [
              i.jsx(pf, { onActivate: () => I("home") }),
              i.jsxs("nav", {
                id: "site-navigation",
                className: Qe ? "main-nav main-nav--open" : "main-nav",
                "aria-label": "Hauptnavigation",
                children: [
                  i.jsx("a", { ...Lk("shop"), "aria-current": o === "shop" || o === "product" ? "page" : void 0, children: "Pflanzen" }),
                  i.jsx("a", { ...Lk("service"), "aria-current": o === "service" ? "page" : void 0, children: "Gartenservice" }),
                  i.jsx("a", { ...Lk("references"), "aria-current": o === "references" ? "page" : void 0, children: "Referenzen" }),
                  i.jsx("a", { ...Lk("guide"), "aria-current": o === "guide" ? "page" : void 0, children: "Ratgeber" }),
                  i.jsx("a", { ...Lk("about"), "aria-current": o === "about" ? "page" : void 0, children: "Über uns" }),
                  i.jsx("a", { ...Lk("contact"), "aria-current": o === "contact" ? "page" : void 0, children: "Kontakt" }),
                ],
              }),
              i.jsxs("div", {
                className: "header-actions",
                children: [
                  i.jsx("button", {
                    className: "icon-button",
                    "aria-label": "Suche öffnen",
                    "aria-haspopup": "dialog",
                    onClick: () => pf_setSearch(!0),
                    children: i.jsx(eu, { size: 21 }),
                  }),
                  i.jsx("a", {
                    className: "icon-button account-button",
                    ...Lk("account"),
                    "aria-label": pf_user ? `Mein Konto (${pf_user.name})` : "Anmelden oder Konto erstellen",
                    title: pf_user ? "Mein Konto" : "Anmelden",
                    children: i.jsx($m, { size: 21 }),
                  }),
                  i.jsxs("button", {
                    className: F ? "cart-button cart-button--pulse" : "cart-button",
                    "aria-label": `Warenkorb öffnen – ${Ma} Artikel`,
                    "aria-haspopup": "dialog",
                    onClick: () => (o === "cart" || o === "checkout" ? I("cart") : pf_setDrawer({})),
                    children: [i.jsx(Dc, { size: 21 }), i.jsx("span", { children: Ma })],
                  }),
                  i.jsx("button", {
                    className: "mobile-menu icon-button",
                    onClick: () => k((v) => !v),
                    "aria-label": Qe ? "Menü schliessen" : "Menü öffnen",
                    "aria-expanded": Qe,
                    "aria-controls": "site-navigation",
                    children: i.jsx(m1, { size: 23 }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    su = () =>
      i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        children: [
          i.jsxs("section", {
            className: "hero",
            children: [
              i.jsxs("picture", {
                className: "hero__poster",
                "aria-hidden": "true",
                children: [
                  i.jsx("source", {
                    type: "image/avif",
                    srcSet: At(
                      "/assets/pflanzfarm-hero-mitarbeitende-poster-768.avif 768w, /assets/pflanzfarm-hero-mitarbeitende-poster-1280.avif 1280w",
                    ),
                    sizes: "100vw",
                  }),
                  i.jsx("source", {
                    type: "image/webp",
                    srcSet: At(
                      "/assets/pflanzfarm-hero-mitarbeitende-poster-768.webp 768w, /assets/pflanzfarm-hero-mitarbeitende-poster-1280.webp 1280w",
                    ),
                    sizes: "100vw",
                  }),
                  i.jsx("img", {
                    src: He("/assets/pflanzfarm-hero-mitarbeitende-poster-1280.webp"),
                    srcSet: At(
                      "/assets/pflanzfarm-hero-mitarbeitende-poster-768.webp 768w, /assets/pflanzfarm-hero-mitarbeitende-poster-1280.webp 1280w",
                    ),
                    sizes: "100vw",
                    width: "1280",
                    height: "720",
                    fetchPriority: "high",
                    decoding: "async",
                    alt: "",
                  }),
                ],
              }),
              ln &&
                i.jsx("video", {
                  ref: wa,
                  className: tu ? "hero__video hero__video--ready" : "hero__video",
                  autoPlay: !0,
                  muted: !0,
                  loop: !0,
                  playsInline: !0,
                  disablePictureInPicture: !0,
                  controls: !1,
                  controlsList: "nodownload noplaybackrate nofullscreen",
                  tabIndex: -1,
                  preload: "metadata",
                  poster: He("/assets/pflanzfarm-hero-mitarbeitende-poster-1280.avif"),
                  "aria-hidden": "true",
                  onCanPlay: (v) => Gc(v.currentTarget),
                  children: [
                    i.jsx(
                      "source",
                      { src: He("/assets/pflanzfarm-hero-loop-540.mp4"), type: "video/mp4", media: "(max-width: 760px)" },
                      "mp4-540",
                    ),
                    i.jsx("source", { src: He("/assets/pflanzfarm-hero-loop-720.mp4"), type: "video/mp4" }, "mp4-720"),
                  ],
                }),
              i.jsx("div", { className: "hero__shade" }),
              i.jsxs("div", {
                className: "container hero__content",
                children: [
                  i.jsx("p", { className: "hero__kicker", children: "Pflanzen für ein schöneres Zuhause" }),
                  i.jsxs("h1", { children: ["Grün, das", i.jsx("br", {}), "bleibt."] }),
                  i.jsxs("p", {
                    children: ["Robuste Pflanzen. Persönliche Beratung.", i.jsx("br", {}), "Direkt zu Ihnen."],
                  }),
                  i.jsxs("div", {
                    className: "hero__actions",
                    children: [
                      i.jsxs("a", {
                        className: "button button--primary",
                        ...Lk("shop"),
                        children: ["Pflanzen entdecken ", i.jsx(Ve, { size: 18 })],
                      }),
                      i.jsx("a", {
                        className: "button button--ghost",
                        ...Lk("service"),
                        children: "Gartenprojekt planen",
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "hero__facts",
                    children: [
                      i.jsxs("span", { children: [i.jsx(il, {}), " Qualität aus der Schweiz"] }),
                      i.jsxs("span", { children: [i.jsx($m, {}), " Persönliche Fachberatung"] }),
                      i.jsxs("span", { children: [i.jsx(Rc, {}), " Zuverlässige Lieferung"] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          i.jsx("section", {
            className: "section featured-section",
            children: i.jsxs("div", {
              className: "container",
              children: [
                i.jsxs("div", {
                  className: "section-heading section-heading--split",
                  children: [
                    i.jsx("div", { children: i.jsx("h2", { children: "Unsere Empfehlungen" }) }),
                    i.jsxs("a", {
                      className: "text-link",
                      ...Lk("shop"),
                      children: ["Alle Pflanzen ansehen ", i.jsx(Ve, { size: 16 })],
                    }),
                  ],
                }),
                i.jsx("div", {
                  className: "product-grid",
                  children: Ql.map((v) =>
                    i.jsx(
                      a0,
                      {
                        product: v,
                        onOpen: () => iu(v),
                        onAdd: () => Kl(v),
                        isSaved: ae.includes(v.id),
                        onToggleSaved: () => Da(v.id),
                        justAdded: de === v.id,
                      },
                      v.id,
                    ),
                  ),
                }),
              ],
            }),
          }),
          i.jsxs("section", {
            className: "story-section container",
            children: [
              i.jsxs("div", {
                className: "story-section__text",
                children: [
                  i.jsx("h2", { children: "Aus Ideen werden Gärten, die wachsen." }),
                  i.jsx("p", {
                    children:
                      "Von der passenden Hecke bis zur fachgerechten Pflanzung: Wir begleiten Ihr Projekt mit Erfahrung, ehrlicher Beratung und Pflanzen, die zum Standort passen.",
                  }),
                  i.jsxs("ul", {
                    className: "check-list",
                    children: [
                      i.jsxs("li", { children: [i.jsx(za, { size: 17 }), " Standortanalyse und Pflanzkonzepte"] }),
                      i.jsxs("li", { children: [i.jsx(za, { size: 17 }), " Lieferung, Abholung und Pflanzservice"] }),
                      i.jsxs("li", { children: [i.jsx(za, { size: 17 }), " Pflege für langfristig gesunde Pflanzen"] }),
                    ],
                  }),
                  i.jsxs("a", {
                    className: "button button--dark",
                    ...Lk("references"),
                    children: ["Unsere Projekte ", i.jsx(Ve, { size: 18 })],
                  }),
                ],
              }),
              i.jsxs("div", {
                className: "story-section__visual",
                children: [
                  i.jsx("img", {
                    src: He("/assets/pflanzfarm-garten-2.jpg"),
                    srcSet: At(
                      "/assets/pflanzfarm-garten-2-640.webp 640w, /assets/pflanzfarm-garten-2-1280.webp 1280w",
                    ),
                    sizes: "(max-width: 900px) 92vw, 50vw",
                    loading: "lazy",
                    decoding: "async",
                    alt: "Sichtschutz mit Photinia aus einem Pflanzfarm-Gartenprojekt",
                  }),
                  i.jsxs("div", {
                    className: "visual-stamp",
                    children: [
                      i.jsx(il, { size: 25 }),
                      i.jsxs("span", { children: ["Regional", i.jsx("br", {}), "gewachsen"] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          h(
            "section",
            { className: "section ref-showcase", "aria-labelledby": "ref-showcase-title" },
            h(
              "div",
              { className: "container" },
              h(
                "div",
                { className: "ref-showcase__head" },
                h(
                  "div",
                  null,
                  h("span", { className: "eyebrow" }, "Referenzen"),
                  h("h2", { id: "ref-showcase-title" }, "Gärten, die Geschichten erzählen."),
                ),
                h(
                  "div",
                  { className: "ref-showcase__intro" },
                  h("p", null, "Vom dichten Sichtschutz bis zum Formgehölz: Ein Blick auf Projekte, die wir mit unseren Pflanzen umgesetzt haben."),
                  h("a", { className: "text-link", ...Lk("references") }, "Alle Referenzen ", h(Ve, { size: 16 })),
                ),
              ),
              h(
                "div",
                { className: `ref-showcase__grid ref-showcase__grid--${Math.min(Sf.length, 3)}` },
                ...Sf.slice(0, 3).map((v, T) =>
                  h(
                    "a",
                    { key: v.title, className: T === 0 ? "ref-tile ref-tile--main" : "ref-tile", ...Lk("references"), "aria-label": `Referenz ${v.title} ansehen` },
                    v.image
                      ? h("img", {
                          src: He(v.image),
                          srcSet: At(v.imageSet || v.image),
                          sizes: T === 0 ? "(max-width: 760px) 92vw, 60vw" : "(max-width: 760px) 92vw, 30vw",
                          loading: "lazy",
                          decoding: "async",
                          alt: v.title,
                        })
                      : h("span", { className: "ref-tile__placeholder" }, h(il, { size: 42 })),
                    h(
                      "span",
                      { className: "ref-tile__card" },
                      h("span", { className: "ref-tile__category" }, v.category),
                      h("span", { className: "ref-tile__title" }, v.title),
                      T === 0 && v.description && h("span", { className: "ref-tile__text" }, v.description),
                      (v.location || v.year) &&
                        h(
                          "span",
                          { className: "ref-tile__meta" },
                          v.location && h("span", null, h(Jm, { size: 13 }), " ", v.location),
                          v.year && h("span", null, h(u1, { size: 13 }), " ", v.year),
                        ),
                      h("span", { className: "ref-tile__arrow", "aria-hidden": "true" }, h(i0, { size: 18 })),
                    ),
                  ),
                ),
              ),
            ),
          ),
          i.jsxs("section", {
            className: Al ? "newsletter newsletter--subscribed container" : "newsletter container",
            children: [
              i.jsx("div", {
                children: i.jsxs("h2", { children: ["Ideen, Tipps und", i.jsx("br", {}), "grüne Neuigkeiten."] }),
              }),
              i.jsx("div", {
                className: "newsletter__form",
                children: Al
                  ? i.jsxs("div", {
                      className: "newsletter__success",
                      role: "status",
                      children: [
                        i.jsx(za, { size: 22 }),
                        i.jsxs("div", {
                          children: [
                            i.jsx("b", { children: "Fast geschafft." }),
                            i.jsx("span", { children: "Bitte bestätigen Sie Ihre Anmeldung über den Link in der E-Mail, die wir Ihnen soeben gesendet haben." }),
                          ],
                        }),
                        i.jsx("button", {
                          className: "inline-link",
                          onClick: () => {
                            (tn(!1), _a(""));
                          },
                          children: "Adresse ändern",
                        }),
                      ],
                    })
                  : i.jsxs(i.Fragment, {
                      children: [
                        i.jsx("p", { children: "Erhalten Sie saisonale Pflanztipps direkt in Ihr Postfach." }),
                        i.jsxs("div", {
                          children: [
                            i.jsx("input", {
                              value: Ea,
                              onChange: (v) => _a(v.target.value),
                              onKeyDown: (v) => {
                                v.key === "Enter" && vl();
                              },
                              placeholder: "Ihre E-Mail-Adresse",
                              "aria-label": "Ihre E-Mail-Adresse",
                              inputMode: "email",
                            }),
                            i.jsxs("button", { onClick: vl, children: ["Anmelden ", i.jsx(Ve, { size: 17 })] }),
                          ],
                        }),
                        i.jsxs("small", {
                          children: [
                            "Abmeldung jederzeit möglich. Mehr in unserer ",
                            i.jsx("a", {
                              className: "inline-link",
                              ...Lk("privacy"),
                              children: "Datenschutzbestimmungen",
                            }),
                            ".",
                          ],
                        }),
                      ],
                    }),
              }),
            ],
          }),
        ],
      }),
    ru = () =>
      i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        className: "shop-page",
        children: [
          i.jsxs("div", {
            className: "container shop-page__intro",
            children: [
              i.jsxs("h1", { children: ["Finden, was in Ihrem", i.jsx("br", {}), "Garten wachsen soll."] }),
              i.jsx("p", { children: "Robuste Pflanzen, passend zu Ihrem Standort und mit fachkundiger Beratung." }),
            ],
          }),
          i.jsxs("div", {
            className: "container shop-toolbar",
            children: [
              i.jsxs("label", {
                className: "search-field",
                children: [
                  i.jsx(eu, { size: 20 }),
                  i.jsx("input", {
                    ref: lu,
                    "aria-label": "Pflanzen suchen",
                    value: ne,
                    onChange: (v) => Ne(v.target.value),
                    placeholder: "Pflanzen, botanische Namen …",
                  }),
                ],
              }),
              i.jsxs("div", {
                className: "filter-group",
                children: [
                  i.jsx(b1, { size: 18 }),
                  i.jsxs("select", {
                    "aria-label": "Pflanzenkategorie filtern",
                    value: A,
                    onChange: (v) => p(v.target.value),
                    children: [
                      i.jsx("option", { children: "Alle Pflanzen" }),
                      ...[...new Set(Ql.map((v) => v.category))].map((v) => i.jsx("option", { children: v }, v)),
                    ],
                  }),
                  h(
                    "button",
                    {
                      type: "button",
                      className: pf_fltOpen || pf_fltCount ? "filter-toggle filter-toggle--active" : "filter-toggle",
                      "aria-expanded": pf_fltOpen,
                      "aria-controls": "shop-filters",
                      onClick: () => pf_setFltOpen((v) => !v),
                    },
                    "Filter",
                    pf_fltCount > 0 && h("span", { className: "filter-toggle__count" }, pf_fltCount),
                  ),
                ],
              }),
            ],
          }),
          h(
            "div",
            { id: "shop-filters", className: "container shop-filters", hidden: !pf_fltOpen },
            h(
              "fieldset",
              null,
              h("legend", null, "Standort"),
              ...Object.entries(pf_locLabels).map(([v, T]) =>
                h(
                  "button",
                  {
                    key: v,
                    type: "button",
                    className: pf_flt.loc.includes(v) ? "chip chip--active" : "chip",
                    "aria-pressed": pf_flt.loc.includes(v),
                    onClick: () => pf_setFlt((E) => ({ ...E, loc: E.loc.includes(v) ? E.loc.filter((K) => K !== v) : [...E.loc, v] })),
                  },
                  pf_icon(pf_icons[v], 16),
                  " ",
                  T,
                ),
              ),
            ),
            h(
              "fieldset",
              null,
              h("legend", null, "Laub"),
              h(
                "button",
                { type: "button", className: pf_flt.evergreen ? "chip chip--active" : "chip", "aria-pressed": pf_flt.evergreen, onClick: () => pf_setFlt((v) => ({ ...v, evergreen: !v.evergreen })) },
                h(il, { size: 16 }),
                " Immergrün",
              ),
            ),
            h(
              "label",
              null,
              "Verwendung",
              h(
                "select",
                { value: pf_flt.use, onChange: (v) => pf_setFlt((T) => ({ ...T, use: v.target.value })) },
                h("option", { value: "" }, "Alle"),
                ...Object.entries(pf_useLabels).map(([v, T]) => h("option", { key: v, value: v }, T)),
              ),
            ),
            h(
              "label",
              null,
              "Endhöhe",
              h(
                "select",
                { value: pf_flt.height, onChange: (v) => pf_setFlt((T) => ({ ...T, height: v.target.value })) },
                h("option", { value: "" }, "Alle"),
                h("option", { value: "klein" }, "bis 1.5 m"),
                h("option", { value: "mittel" }, "1.5–3 m"),
                h("option", { value: "gross" }, "über 3 m"),
              ),
            ),
            h(
              "label",
              null,
              "Preis pro Stück",
              h(
                "select",
                { value: pf_flt.price, onChange: (v) => pf_setFlt((T) => ({ ...T, price: v.target.value })) },
                h("option", { value: "" }, "Alle"),
                h("option", { value: "20" }, "bis CHF 20"),
                h("option", { value: "50" }, "bis CHF 50"),
                h("option", { value: "100" }, "bis CHF 100"),
              ),
            ),
            pf_fltCount > 0 && h("button", { type: "button", className: "inline-link", onClick: pf_resetFilters }, "Filter zurücksetzen"),
          ),
          i.jsxs("div", {
            className: "container shop-results",
            children: [
              i.jsxs("div", {
                className: "shop-results__top",
                children: [
                  i.jsxs("span", {
                    children: [
                      i.jsx("strong", { children: dn.length }),
                      " Pflanzen gefunden ",
                      ae.length > 0 &&
                        i.jsx("button", {
                          type: "button",
                          className: pf_onlySaved ? "saved-filter saved-filter--active" : "saved-filter",
                          "aria-pressed": pf_onlySaved,
                          onClick: () => pf_setOnlySaved((v) => !v),
                          children: pf_onlySaved ? "Alle anzeigen" : `Merkliste (${ae.length})`,
                        }),
                    ],
                  }),
                  i.jsxs("label", {
                    className: "sort-control",
                    children: [
                      "Sortieren ",
                      i.jsxs("select", {
                        "aria-label": "Pflanzen sortieren",
                        value: Ta,
                        onChange: (v) => Xl(v.target.value),
                        children: [
                          i.jsx("option", { value: "popular", children: "Beliebtheit" }),
                          i.jsx("option", { value: "price-asc", children: "Preis aufsteigend" }),
                          i.jsx("option", { value: "price-desc", children: "Preis absteigend" }),
                          i.jsx("option", { value: "growth", children: "Schnellwüchsig zuerst" }),
                          i.jsx("option", { value: "name", children: "Name A–Z" }),
                        ],
                      }),
                      i.jsx(Pi, { size: 16 }),
                    ],
                  }),
                ],
              }),
              i.jsx("div", {
                className: "product-grid product-grid--shop",
                children: dn.map((v) =>
                  i.jsx(
                    a0,
                    {
                      product: v,
                      onOpen: () => iu(v),
                      onAdd: () => Kl(v),
                      isSaved: ae.includes(v.id),
                      onToggleSaved: () => Da(v.id),
                      justAdded: de === v.id,
                    },
                    v.id,
                  ),
                ),
              }),
              dn.length === 0 &&
                i.jsxs("div", {
                  className: "empty-state",
                  children: [
                    i.jsx(il, { size: 37 }),
                    i.jsx("h3", { children: "Keine passende Pflanze gefunden." }),
                    i.jsx("p", { children: "Versuchen Sie eine andere Suche oder setzen Sie den Filter zurück." }),
                    i.jsx("button", {
                      className: "button button--dark",
                      onClick: pf_resetFilters,
                      children: "Filter zurücksetzen",
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
    ui = () =>
      i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        className: "product-page container",
        children: [
          i.jsxs("a", {
            className: "breadcrumb",
            ...Lk("shop"),
            children: ["Shop ", i.jsx(u0, { size: 14 }), " ", _.category],
          }),
          i.jsxs("div", {
            className: "product-detail",
            children: [
              i.jsxs("div", {
                className: "product-gallery",
                children: [
                  i.jsxs("div", {
                    className: "product-gallery__thumbs",
                    children: [
                      i.jsx("button", {
                        className: Ie === "photo" ? "selected" : "",
                        "aria-label": "Produktbild anzeigen",
                        "aria-pressed": Ie === "photo",
                        onClick: () => kt("photo"),
                        children: i.jsx("img", { src: He(_.image), srcSet: At(_.imageSet), sizes: "96px", alt: "" }),
                      }),
                      ...(_.gallery || []).map((v, T) =>
                        h(
                          "button",
                          {
                            key: v,
                            className: Ie === `g${T}` ? "selected" : "",
                            "aria-label": `Bild ${T + 2} anzeigen`,
                            "aria-pressed": Ie === `g${T}`,
                            onClick: () => kt(`g${T}`),
                          },
                          h("img", { src: He(v), sizes: "96px", alt: "", loading: "lazy" }),
                        ),
                      ),
                      i.jsx("button", {
                        className: Ie === "traits" ? "selected placeholder-thumb" : "placeholder-thumb",
                        "aria-label": "Pflanzeigenschaften anzeigen",
                        "aria-pressed": Ie === "traits",
                        onClick: () => kt("traits"),
                        children: i.jsx(il, { size: 19 }),
                      }),
                      i.jsx("button", {
                        className: Ie === "care" ? "selected placeholder-thumb" : "placeholder-thumb",
                        "aria-label": "Pflanzberatung anzeigen",
                        "aria-pressed": Ie === "care",
                        onClick: () => kt("care"),
                        children: i.jsx(In, { size: 19 }),
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "product-gallery__main",
                    children: [
                      Ie.startsWith("g") && (_.gallery || [])[+Ie.slice(1)]
                        ? h("img", { src: He(_.gallery[+Ie.slice(1)]), decoding: "async", alt: `${_.name}, Bild ${+Ie.slice(1) + 2}` })
                        : Ie === "photo" || Ie.startsWith("g")
                        ? i.jsx("img", {
                            src: He(_.image),
                            srcSet: At(_.imageSet),
                            sizes: "(max-width: 900px) 92vw, 560px",
                            fetchPriority: "high",
                            decoding: "async",
                            alt: _.name,
                          })
                        : i.jsxs("div", {
                            className: "gallery-insight",
                            children: [
                              i.jsx("span", {
                                children: Ie === "traits" ? i.jsx(il, { size: 38 }) : i.jsx(In, { size: 38 }),
                              }),
                              i.jsx("h2", { children: Ie === "traits" ? "Auf einen Blick" : "Gut begleitet" }),
                              i.jsx("p", {
                                children:
                                  Ie === "traits"
                                    ? `${_.name} ist ${_.traits.join(", ").toLowerCase()} und für einen langlebigen Garten geeignet.`
                                    : "Unsere Fachberatung unterstützt Sie bei Standort, Pflanzung und der ersten Pflege.",
                              }),
                            ],
                          }),
                      i.jsxs("span", {
                        className: "gallery-caption",
                        children: [
                          i.jsx(Hc, { size: 15 }),
                          " ",
                          Ie === "photo" || Ie.startsWith("g") ? "Produktansicht" : Ie === "traits" ? "Eigenschaften" : "Pflanzberatung",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              i.jsxs("div", {
                className: "product-detail__info",
                children: [
                  i.jsx("span", { className: "eyebrow", children: _.category }),
                  i.jsx("h1", { children: _.name }),
                  i.jsx("p", { className: "latin", children: _.latin }),
                  i.jsx("p", { className: "product-description", children: _.description }),
                  i.jsx("div", {
                    className: "care-tags",
                    children: _.traits.map((v) => i.jsxs("span", { children: [i.jsx(il, { size: 15 }), " ", v] }, v)),
                  }),
                  i.jsxs("label", {
                    className: "variant-label",
                    children: [
                      "Grösse",
                      i.jsx("select", {
                        value: L,
                        onChange: (v) => X(v.target.value),
                        children: _.variants.map((v) => i.jsx("option", { children: v }, v)),
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "product-purchase",
                    id: "pf-buy",
                    children: [
                      i.jsxs("div", {
                        children: [
                          i.jsx("strong", { children: _.priceOnRequest ? "Preis auf Anfrage" : Sa(pf_line(_, L, d).unit) }),
                          i.jsx("span", {
                            children: !_.priceOnRequest && pf_line(_, L, d).percent ? `statt ${Sa(pf_vd(_, L).price)} · inkl. MwSt.` : "inkl. MwSt.",
                          }),
                        ],
                      }),
                      i.jsxs("div", {
                        className: "quantity-control",
                        children: [
                          i.jsx("button", {
                            "aria-label": "Menge verringern",
                            onClick: () => N((v) => Math.max(1, v - 1)),
                            children: i.jsx(Fm, { size: 17 }),
                          }),
                          i.jsx("span", { children: d }),
                          i.jsx("button", {
                            "aria-label": "Menge erhöhen",
                            onClick: () => N((v) => v + 1),
                            children: i.jsx(Uc, { size: 17 }),
                          }),
                        ],
                      }),
                      _.priceOnRequest || pf_vd(_, L).stock < d
                        ? i.jsxs("button", {
                            className: "button button--primary button--cart",
                            onClick: () => pf_request(`Anfrage zu ${_.name} (${L}), Menge: ${d}`),
                            children: [i.jsx(y1, { size: 18 }), " Anfrage senden"],
                          })
                        : i.jsxs("button", {
                            className: "button button--primary button--cart",
                            onClick: () => Kl(_, d, L),
                            children: [i.jsx(x1, { size: 18 }), " In den Warenkorb"],
                          }),
                    ],
                  }),
                  !_.priceOnRequest &&
                    pf_vd(_, L).id &&
                    pf_vd(_, L).stock <= 0 &&
                    h(pf_StockAlert, { key: pf_vd(_, L).id, variantId: pf_vd(_, L).id, label: `${_.name} (${L})` }),
                  !_.priceOnRequest &&
                    (_.discounts || []).length > 0 &&
                    h(
                      "div",
                      { className: "volume-tiers", "aria-label": "Mengenrabatt" },
                      h("b", null, "Mengenrabatt"),
                      ...(_.discounts || []).map((v) =>
                        h(
                          "button",
                          {
                            key: v.minQty,
                            type: "button",
                            className: pf_line(_, L, d).percent === v.percent ? "volume-tier volume-tier--active" : "volume-tier",
                            onClick: () => N(v.minQty),
                            title: `${v.minQty} Stück wählen`,
                          },
                          `ab ${v.minQty} Stk. −${v.percent} %`,
                        ),
                      ),
                      d > 1 && h("small", null, `Total für ${d} Stück: ${Sa(pf_line(_, L, d).total)}`),
                    ),
                  h(
                    "ul",
                    { className: "avail-box", "aria-label": "Lieferung und Verfügbarkeit" },
                    h(
                      "li",
                      { className: _.priceOnRequest || pf_vd(_, L).stock <= 0 ? "avail-box--muted" : "avail-box--ok" },
                      h(za, { size: 17 }),
                      h("span", null, _.priceOnRequest ? "Verfügbarkeit auf Anfrage" : pf_vd(_, L).stock > 0 ? `An Lager: ${pf_vd(_, L).stock} Stück` : "Zurzeit ausverkauft"),
                    ),
                    !_.priceOnRequest &&
                      h(
                        "li",
                        null,
                        h(pf_vd(_, L).pickupOnly ? Jm : Rc, { size: 17 }),
                        h(
                          "span",
                          null,
                          pf_vd(_, L).pickupOnly
                            ? "Diese Grösse gibt es nur zur Abholung in Ebersecken."
                            : pf_vd(_, L).shipping
                              ? `Lieferung schweizweit: ${Sa(pf_vd(_, L).shipping.price)}${pf_catalogSettings.freeDeliveryFrom > 0 ? `, gratis ab ${Sa(pf_catalogSettings.freeDeliveryFrom / 100)}` : ""}`
                              : "Lieferung schweizweit",
                        ),
                      ),
                    h("li", null, h(Jm, { size: 17 }), h("span", null, "Abholung in Ebersecken gratis")),
                    pf_catalogSettings.planting !== !1 && h("li", null, h(In, { size: 17 }), h("span", null, "Pflanzservice in der Kasse dazubuchbar")),
                  ),
                  h(pf_Profile, { product: _ }),
                  i.jsx("div", {
                    className: "accordions",
                    children: E1.map((v) =>
                      i.jsxs(
                        "section",
                        {
                          className: pe === v.id ? "accordion-item accordion-item--open" : "accordion-item",
                          children: [
                            i.jsxs("button", {
                              "aria-expanded": pe === v.id,
                              "aria-controls": `guide-${v.id}`,
                              onClick: () => qt((T) => (T === v.id ? null : v.id)),
                              children: [i.jsx("span", { children: v.title }), i.jsx(Pi, { size: 18 })],
                            }),
                            i.jsx("div", {
                              id: `guide-${v.id}`,
                              className: "accordion-item__content",
                              hidden: pe !== v.id,
                              children: i.jsx("p", { children: v.text }),
                            }),
                          ],
                        },
                        v.id,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ci = () => {
      const T = (pf_refs || Sf.concat([
        {
          title: "Pflege mit Perspektive",
          category: "Baumpflege",
          description: "Sorgfältige Pflege macht aus gewachsenen Gärten langjährige Lieblingsorte.",
          image: "",
          imageSet: "",
          featured: !1,
        },
      ])).filter((E) => {
        var K;
        return pt === "Alle" || ((K = E.tags || T1[E.title]) == null ? void 0 : K.includes(pt));
      });
      return i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        className: "references-page",
        children: [
          i.jsx("div", {
            className: "references-head container",
            children: i.jsxs("header", {
              className: "guide-head",
              children: [
                i.jsx("span", { className: "eyebrow", children: "Referenzen" }),
                i.jsxs("h1", { children: ["Gärten, die", i.jsx("br", {}), "weiterwachsen."] }),
                i.jsx("p", {
                  children: "Wir verbinden Pflanzenwissen, Handwerk und Orte, an denen man gern zuhause ist.",
                }),
              ],
            }),
          }),
          i.jsxs("section", {
            className: "container section references-body",
            children: [
              i.jsxs("div", {
                className: "reference-filter",
                children: [
                  i.jsx("span", { children: "Projektart:" }),
                  N1.map((E) =>
                    i.jsx(
                      "button",
                      {
                        className: pt === E ? "active" : "",
                        "aria-pressed": pt === E,
                        onClick: () => Xe(E),
                        children: E,
                      },
                      E,
                    ),
                  ),
                ],
              }),
              i.jsxs("div", {
                className: "references-filter-status",
                role: "status",
                children: [T.length, " ", T.length === 1 ? "Projekt" : "Projekte", " sichtbar"],
              }),
              i.jsx("div", {
                className: "references-list",
                children: T.map((E, K) =>
                  i.jsxs(
                    "article",
                    {
                      className: "reference-list-card",
                      children: [
                        i.jsx("div", {
                          className: `reference-list-card__image reference-list-card__image--${K}`,
                          children: E.image && E.before
                            ? h(pf_BeforeAfter, { before: E.before, beforeSet: E.beforeSet, after: E.image, afterSet: E.imageSet, title: E.title })
                            : E.image
                            ? i.jsx("img", {
                                src: He(E.image),
                                srcSet: At(E.imageSet),
                                sizes: "(max-width: 760px) 92vw, 46vw",
                                loading: "lazy",
                                decoding: "async",
                                alt: E.title,
                              })
                            : i.jsxs("div", {
                                children: [i.jsx(In, { size: 42 }), i.jsx("span", { children: E.category })],
                              }),
                        }),
                        i.jsxs("div", {
                          className: "reference-list-card__body",
                          children: [
                            i.jsx("span", { className: "eyebrow", children: E.category }),
                            i.jsx("h2", { children: E.title }),
                            i.jsx("p", { children: E.description }),
                            i.jsxs("div", {
                              className: "reference-facts",
                              children: [
                                (E.location ?? "Kanton Luzern") && i.jsxs("span", { children: [i.jsx(Jm, { size: 16 }), " ", E.location ?? "Kanton Luzern"] }),
                                (E.year ?? 2025) && i.jsxs("span", { children: [i.jsx(u1, { size: 16 }), " ", E.year ?? 2025] }),
                              ],
                            }),
                            i.jsxs("a", {
                              className: "text-link",
                              ...Lk("contact"),
                              children: ["Ähnliches Projekt anfragen ", i.jsx(Ve, { size: 16 })],
                            }),
                          ],
                        }),
                      ],
                    },
                    E.title,
                  ),
                ),
              }),
              T.length === 0 &&
                i.jsxs("div", {
                  className: "empty-state",
                  children: [
                    i.jsx(il, { size: 37 }),
                    i.jsx("h3", { children: "Keine Referenz in dieser Kategorie." }),
                    i.jsx("button", {
                      className: "button button--dark",
                      onClick: () => Xe("Alle"),
                      children: "Alle Projekte anzeigen",
                    }),
                  ],
                }),
            ],
          }),
        ],
      });
    },
    fu = () => {
      const v = [
        {
          name: "Thomas Steinmann",
          role: "Leitung · Gartenbau HF · Landwirtschaft EFZ",
          image: "/assets/about/thomas-steinmann.jpg",
          imageSet: "/assets/about/thomas-steinmann-480.webp 480w, /assets/about/thomas-steinmann-960.webp 960w",
          alt: "Thomas Steinmann bei der Pflege von Formgehölzen",
        },
        {
          name: "Susan Steinmann",
          role: "Baumschule",
          image: "/assets/about/susan-steinmann.jpg",
          imageSet: "/assets/about/susan-steinmann-480.webp 480w, /assets/about/susan-steinmann-960.webp 960w",
          alt: "Susan Steinmann bei der Pflanzenpflege in der Baumschule",
        },
        {
          name: "Hans Steinmann",
          role: "Gartenbau · Meister-Landwirtschaft",
          image: "/assets/about/hans-steinmann.jpg",
          imageSet: "/assets/about/hans-steinmann-480.webp 480w, /assets/about/hans-steinmann-960.webp 960w",
          alt: "Hans Steinmann bei der Gartenarbeit",
        },
        {
          name: "David Müller",
          role: "Gartenbau in Weiterbildung zum Gartenbau HF",
          image: "/assets/about/david-mueller.jpg",
          imageSet: "/assets/about/david-mueller-480.webp 480w, /assets/about/david-mueller-960.webp 960w",
          alt: "David Müller bei der Pflege einer Heckenpflanzung",
        },
      ];
      return i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        className: "about-page",
        children: [
          i.jsxs("section", {
            className: "about-hero container",
            children: [
              i.jsxs("div", {
                className: "about-hero__copy",
                children: [
                  i.jsx("p", { className: "about-kicker", children: "Über uns" }),
                  i.jsxs("h1", {
                    children: ["Verwurzelt in der Region.", i.jsx("br", {}), "Für Gärten in der ganzen Schweiz."],
                  }),
                  i.jsx("p", {
                    children:
                      "Seit 2020 steht Pflanzfarm Steinmann für Pflanzenwissen, handwerkliche Sorgfalt und eine persönliche Begleitung – von der Auswahl bis zum eingewachsenen Garten.",
                  }),
                  i.jsxs("div", {
                    className: "about-hero__actions",
                    children: [
                      i.jsxs("a", {
                        className: "button button--dark",
                        ...Lk("shop"),
                        children: ["Pflanzen entdecken ", i.jsx(Ve, { size: 18 })],
                      }),
                      i.jsxs("a", {
                        className: "text-link",
                        ...Lk("references"),
                        children: ["Unsere Projekte ", i.jsx(Ve, { size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              i.jsxs("figure", {
                className: "about-hero__portrait",
                children: [
                  i.jsx("img", {
                    src: He("/assets/about/pflanzfarm-team-hero.jpg"),
                    srcSet: At(
                      "/assets/about/pflanzfarm-team-hero-480.webp 480w, /assets/about/pflanzfarm-team-hero-960.webp 960w",
                    ),
                    sizes: "(max-width: 800px) 92vw, 42vw",
                    fetchPriority: "high",
                    decoding: "async",
                    alt: "Thomas Steinmann, Gründer der Pflanzfarm Steinmann",
                  }),
                  i.jsxs("figcaption", {
                    children: [
                      i.jsx("span", { children: "2020 gegründet" }),
                      i.jsx("strong", { children: "Pflanzfarm Steinmann" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          i.jsx("section", {
            className: "about-story-section",
            children: i.jsxs("div", {
              className: "container about-story",
              children: [
                i.jsx("div", {
                  className: "about-story__image",
                  children: i.jsx("img", {
                    src: He("/assets/pflanzfarm-garten-1.jpg"),
                    srcSet: At(
                      "/assets/pflanzfarm-garten-1-640.webp 640w, /assets/pflanzfarm-garten-1-1280.webp 1280w",
                    ),
                    sizes: "(max-width: 860px) 92vw, 48vw",
                    loading: "lazy",
                    decoding: "async",
                    alt: "Pflanzenquartiere der Pflanzfarm",
                  }),
                }),
                i.jsxs("div", {
                  className: "about-story__copy",
                  children: [
                    i.jsx("p", { className: "about-kicker", children: "Ein Familienbetrieb" }),
                    i.jsx("h2", { children: "Mit Pflanzen gewachsen." }),
                    i.jsx("p", {
                      children:
                        "Thomas Steinmann gründete die Pflanzfarm im Jahr 2020. Heute ist daraus ein Schweizer Familienbetrieb entstanden, der Privatpersonen und Unternehmen in der ganzen Schweiz mit sorgfältig ausgewählten Pflanzen begleitet.",
                    }),
                    i.jsx("p", {
                      children:
                        "Erfahrung aus Garten- und Landschaftsbau verbindet sich bei uns mit echter Freude an Pflanzen – und mit Beratung, die zum Standort, zum Projekt und zu den Menschen dahinter passt.",
                    }),
                    i.jsxs("div", {
                      className: "about-story__note",
                      children: [
                        i.jsx(il, { size: 20 }),
                        i.jsx("span", { children: "Auswahl, Lieferung, Pflanzung und Pflege aus einer Hand." }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
          i.jsxs("section", {
            className: "about-focus container",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("p", { className: "about-kicker", children: "Was uns wichtig ist" }),
                  i.jsxs("h2", { children: ["Praktisches Wissen.", i.jsx("br", {}), "Ehrliche Empfehlungen."] }),
                ],
              }),
              i.jsxs("div", {
                className: "about-focus__list",
                children: [
                  i.jsxs("article", {
                    children: [
                      i.jsx("span", { children: "01" }),
                      i.jsxs("div", {
                        children: [
                          i.jsx("h3", { children: "Passende Pflanzen" }),
                          i.jsx("p", {
                            children:
                              "Wir helfen dabei, die passende Pflanze für Standort, Nutzung und gewünschte Wirkung zu finden.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  i.jsxs("article", {
                    children: [
                      i.jsx("span", { children: "02" }),
                      i.jsxs("div", {
                        children: [
                          i.jsx("h3", { children: "Verlässlich begleitet" }),
                          i.jsx("p", {
                            children:
                              "Von der Baumschule bis zum Gartenprojekt bleiben wir an Ihrer Seite – auch nach der Pflanzung.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  i.jsxs("article", {
                    children: [
                      i.jsx("span", { children: "03" }),
                      i.jsxs("div", {
                        children: [
                          i.jsx("h3", { children: "Mit Blick aufs Ganze" }),
                          i.jsx("p", {
                            children:
                              "Wir verbinden Pflanzen, Gartenbau und Pflege zu Lösungen, die langfristig funktionieren.",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          i.jsx("section", {
            className: "about-team-section",
            children: i.jsxs("div", {
              className: "container",
              children: [
                i.jsxs("div", {
                  className: "about-team-heading",
                  children: [
                    i.jsxs("div", {
                      children: [
                        i.jsx("p", { className: "about-kicker", children: "Das Team" }),
                        i.jsxs("h2", { children: ["Menschen hinter", i.jsx("br", {}), "der Pflanzfarm."] }),
                      ],
                    }),
                    i.jsx("p", {
                      children:
                        "Vier Perspektiven, ein gemeinsamer Anspruch: Pflanzen und Gärten mit Aufmerksamkeit, Erfahrung und Freude zu begleiten.",
                    }),
                  ],
                }),
                i.jsx("div", {
                  className: "team-grid",
                  children: v.map((T) =>
                    i.jsxs(
                      "article",
                      {
                        className: "team-card",
                        children: [
                          i.jsx("img", {
                            src: He(T.image),
                            srcSet: At(T.imageSet),
                            sizes: "(max-width: 640px) 92vw, (max-width: 1050px) 46vw, 24vw",
                            loading: "lazy",
                            decoding: "async",
                            alt: T.alt,
                          }),
                          i.jsxs("div", {
                            children: [i.jsx("h3", { children: T.name }), i.jsx("p", { children: T.role })],
                          }),
                        ],
                      },
                      T.name,
                    ),
                  ),
                }),
              ],
            }),
          }),
          i.jsxs("section", {
            className: "container about-callout",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("p", { className: "about-kicker", children: "Ihr Gartenprojekt" }),
                  i.jsx("h2", { children: "Was soll bei Ihnen wachsen?" }),
                  i.jsx("p", {
                    children:
                      "Entdecken Sie passende Pflanzen im Shop oder lassen Sie sich von umgesetzten Gartenprojekten inspirieren.",
                  }),
                ],
              }),
              i.jsxs("div", {
                children: [
                  i.jsxs("a", {
                    className: "button button--primary",
                    ...Lk("shop"),
                    children: ["Zum Pflanzenshop ", i.jsx(Ve, { size: 18 })],
                  }),
                  i.jsx("a", {
                    className: "button button--ghost",
                    ...Lk("references"),
                    children: "Referenzen ansehen",
                  }),
                ],
              }),
            ],
          }),
          i.jsxs("section", {
            className: "container about-social",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("p", { className: "about-kicker", children: "In Verbindung bleiben" }),
                  i.jsx("h2", { children: "Folgen Sie der Pflanzfarm." }),
                  i.jsx("p", {
                    children:
                      "Einblicke aus der Baumschule, aktuelle Pflanzen und Gartenprojekte finden Sie auf unseren Kanälen.",
                  }),
                ],
              }),
              i.jsx(l0, {}),
            ],
          }),
        ],
      });
    },
    du = () =>
      i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        className: "cart-page container",
        children: [
          i.jsxs("div", {
            className: "cart-page__heading",
            children: [
              i.jsx("span", { className: "eyebrow", children: "Ihr Warenkorb" }),
              i.jsx("h1", { id: "cart-heading", tabIndex: -1, children: "Fast bereit zum Einpflanzen." }),
              i.jsx("p", {
                children: Ma ? `${Ma} Pflanzen warten auf ihren neuen Garten.` : "Ihr Warenkorb ist noch leer.",
              }),
            ],
          }),
          et.length
            ? i.jsxs("div", {
                className: "cart-layout",
                children: [
                  i.jsx("div", {
                    className: "cart-items",
                    children: et.map(({ key: v, product: T, variant: E, quantity: K }) =>
                      i.jsxs(
                        "article",
                        {
                          className: "cart-line",
                          children: [
                            i.jsx("img", {
                              src: He(T.image),
                              srcSet: At(T.imageSet),
                              sizes: "(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 360px",
                              loading: "lazy",
                              decoding: "async",
                              alt: T.name,
                            }),
                            i.jsxs("div", {
                              children: [
                                i.jsx("span", { className: "product-category", children: T.category }),
                                i.jsx("h3", { children: T.name }),
                                i.jsxs("p", { children: ["Variante: ", E] }),
                                i.jsx("button", {
                                  className: "remove-link",
                                  onClick: () => Jl(v, -K),
                                  children: "Entfernen",
                                }),
                              ],
                            }),
                            i.jsxs("div", {
                              className: "cart-line__right",
                              children: [
                                i.jsx("strong", { children: Sa(pf_line(T, E, K).total) }),
                                pf_line(T, E, K).percent > 0 &&
                                  h("small", { className: "cart-line__discount" }, `inkl. ${pf_line(T, E, K).percent} % Mengenrabatt`),
                                !pf_line(T, E, K).percent &&
                                  pf_nextTier(T, K) &&
                                  h("small", { className: "cart-line__hint" }, `Ab ${pf_nextTier(T, K).minQty} Stück ${pf_nextTier(T, K).percent} % Rabatt`),
                                i.jsxs("div", {
                                  className: "quantity-control quantity-control--small",
                                  children: [
                                    i.jsx("button", {
                                      "aria-label": `${T.name}: Menge verringern`,
                                      onClick: () => Jl(v, -1),
                                      children: i.jsx(Fm, { size: 15 }),
                                    }),
                                    i.jsx("span", { children: K }),
                                    i.jsx("button", {
                                      "aria-label": `${T.name}: Menge erhöhen`,
                                      onClick: () => Jl(v, 1),
                                      children: i.jsx(Uc, { size: 15 }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        v,
                      ),
                    ),
                  }),
                  i.jsxs("aside", {
                    className: "order-summary",
                    children: [
                      i.jsx("h2", { children: "Bestellübersicht" }),
                      i.jsxs("div", {
                        children: [i.jsx("span", { children: "Zwischensumme" }), i.jsx("strong", { children: Sa(ai) })],
                      }),
                      i.jsxs("div", {
                        children: [
                          i.jsx("span", { children: "Lieferung" }),
                          i.jsx("span", { children: pf_pickupOnly(et).length ? "nur Abholung" : pf_shipping(et, "lieferung") ? Sa(pf_shipping(et, "lieferung")) : "gratis" }),
                        ],
                      }),
                      i.jsx("hr", {}),
                      i.jsxs("div", {
                        className: "order-summary__total",
                        children: [i.jsx("strong", { children: "Total inkl. MWST" }), i.jsx("strong", { children: Sa(ai + (pf_pickupOnly(et).length ? 0 : pf_shipping(et, "lieferung"))) })],
                      }),
                      i.jsx("small", {
                        children:
                          pf_pickupOnly(et).length
                            ? `${pf_pickupOnly(et).map((v) => v.product.name + " (" + v.variant + ")").join(", ")} ${pf_pickupOnly(et).length > 1 ? "können" : "kann"} nur in Ebersecken abgeholt werden.`
                            : pf_catalogSettings.freeDeliveryFrom > 0 && ai * 100 < pf_catalogSettings.freeDeliveryFrom
                            ? `Gratis-Lieferung ab ${Sa(pf_catalogSettings.freeDeliveryFrom / 100)}. Abholung in Ebersecken ist immer gratis.`
                            : "Abholung in Ebersecken ist gratis. Bezahlung mit Karte, TWINT, auf Rechnung oder bar bei Abholung.",
                      }),
                      i.jsxs("a", {
                        className: "button button--primary button--full",
                        ...Lk("checkout"),
                        children: ["Zur Kasse ", i.jsx(Ve, { size: 18 })],
                      }),
                      i.jsxs("a", {
                        className: "text-link",
                        ...Lk("shop"),
                        children: ["Weiter einkaufen ", i.jsx(Ve, { size: 16 })],
                      }),
                    ],
                  }),
                ],
              })
            : i.jsxs("div", {
                className: "empty-state empty-state--cart",
                children: [
                  i.jsx(Dc, { size: 42 }),
                  i.jsx("h2", { children: "Ihr Warenkorb ist noch leer." }),
                  i.jsx("p", { children: "Entdecken Sie robuste Pflanzen für Ihren Garten." }),
                  i.jsx("a", { className: "button button--dark", ...Lk("shop"), children: "Zum Shop" }),
                ],
              }),
        ],
      }),
    sl = () =>
      i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        className: "legal-page container",
        children: [
          i.jsxs("header", {
            className: "legal-hero",
            children: [
              i.jsx("span", { className: "eyebrow", children: "Datenschutz" }),
              i.jsx("h1", { children: "Datenschutzerklärung" }),
              i.jsx("p", {
                children:
                  "Wir bearbeiten Personendaten sorgfältig und nur so weit, wie es für unsere Website, Ihre Anfragen und Bestellungen nötig ist. Massgebend ist das Schweizer Bundesgesetz über den Datenschutz (DSG).",
              }),
              i.jsx("span", { className: "legal-version", children: "Stand: 25. Oktober 2026" }),
            ],
          }),
          i.jsxs("section", {
            className: "legal-notice",
            children: [
              i.jsx(za, { size: 20 }),
              i.jsxs("p", {
                children: [
                  i.jsx("b", { children: "Kurz gesagt:" }),
                  " Wir verwenden Ihre Daten für Bestellungen, Anfragen und – nur mit Ihrer Einwilligung – für Newsletter und Statistik. Keine Werbe-Cookies, kein Verkauf von Daten.",
                ],
              }),
            ],
          }),
          i.jsx("div", {
            className: "legal-grid",
            children: [
              ["Verantwortliche Stelle", [
                "Pflanzfarm Steinmann, Inhaber Thomas Steinmann, Untergretti 2, CH-6245 Ebersecken. ",
                i.jsx("a", { href: "mailto:info@pflanzfarm.ch", children: "info@pflanzfarm.ch" }, "m"),
                " · ",
                i.jsx("a", { href: "tel:+41793361495", children: "+41 79 336 14 95" }, "t"),
              ]],
              ["Aufruf der Website und Hosting",
                "Website, Shop und Kundendaten werden auf Servern unseres Hosting-Anbieters Hetzner Online GmbH (Deutschland) betrieben. Beim Aufruf werden technisch notwendige Daten wie IP-Adresse, Datum und Uhrzeit, aufgerufene Seite und Browser-Informationen verarbeitet, um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Diese Protokolle löschen wir nach spätestens 30 Tagen."],
              ["Kontakt und Anfragen",
                "Wenn Sie uns über das Kontaktformular, per E-Mail, Telefon oder WhatsApp kontaktieren, verwenden wir Ihre Angaben ausschliesslich zur Bearbeitung Ihres Anliegens. Für Nachrichten über WhatsApp gelten zusätzlich die Datenschutzbestimmungen von WhatsApp (Meta)."],
              ["Bestellungen und Zahlung",
                "Für Bestellungen verarbeiten wir Name, E-Mail, Telefon, Liefer- und Rechnungsadresse sowie die bestellten Artikel zur Abwicklung von Bestellung, Lieferung und Rechnungsstellung. Zahlungen mit Karte oder TWINT wickelt Stripe (Stripe Payments Europe Ltd., Irland) ab; Ihre Karten- und Zahlungsdaten gehen direkt an Stripe und werden nicht bei uns gespeichert. Stripe kann Daten auch in die USA übermitteln und stützt sich dafür auf das Data Privacy Framework und Standardvertragsklauseln. Buchhaltungsrelevante Unterlagen bewahren wir während der gesetzlichen Frist von zehn Jahren auf."],
              ["Kundenkonto",
                "Wenn Sie ein Kundenkonto erstellen, speichern wir Name, E-Mail-Adresse, ein verschlüsseltes Passwort sowie freiwillig Telefon und Adresse, damit Sie Ihre Bestellungen einsehen und schneller bestellen können. Sie können Ihre Daten im Konto jederzeit herunterladen oder das Konto löschen."],
              ["E-Mail-Versand",
                "Bestellbestätigungen, Kontobestätigungen, Antworten auf Anfragen und den Newsletter versenden wir über den Dienst Resend (Resend, Inc., USA). Dabei werden Ihre E-Mail-Adresse und der Inhalt der Nachricht an Resend übermittelt und in die USA übertragen; Resend ist dafür vertraglich zum Datenschutz verpflichtet."],
              ["Newsletter",
                "Unseren Newsletter erhalten Sie nur, wenn Sie sich anmelden und die Anmeldung über den Link in unserer Bestätigungs-E-Mail bestätigen (Double-Opt-in). Wir speichern Ihre E-Mail-Adresse sowie Zeitpunkt von Anmeldung und Bestätigung. Jede Ausgabe enthält einen Abmeldelink; danach erhalten Sie keine Newsletter mehr."],
              ["Pflegetipps und Warteliste",
                "Nach einer Lieferung senden wir Ihnen einmalig Pflegetipps zu den gekauften Pflanzen, gegebenenfalls mit der Bitte um eine Bewertung, sowie gelegentlich saisonale Hinweise (z. B. zum Schnitt) zu Pflanzen, die Sie bei uns gekauft haben. Jede dieser E-Mails enthält einen Abmeldelink. Wenn Sie sich für «Benachrichtigen, wenn wieder da» eintragen, speichern wir Ihre E-Mail-Adresse und die gewünschte Grösse und schreiben Ihnen einmalig, sobald sie wieder verfügbar ist."],
              ["Cookies und lokale Speicherung", [
                "Für Anmeldung und Bestellung verwenden wir technisch notwendige Cookies (Sitzung und Schutz vor Missbrauch), die beim Schliessen des Browsers bzw. nach spätestens 2 Stunden ablaufen. Im lokalen Speicher Ihres Browsers merken wir uns Ihren Warenkorb, Ihre Merkliste und Ihre Entscheidung im Cookie-Hinweis; diese Daten verlassen Ihr Gerät nicht. Im Sitzungsspeicher steht zudem, ob ein saisonaler Hinweis bereits angezeigt wurde. Weitere Cookies setzen wir nur mit Ihrer Einwilligung (siehe Google Analytics). ",
                i.jsx("button", { type: "button", className: "inline-link", onClick: () => pf_setBo(!0), children: "Cookie-Einstellungen öffnen" }, "c"),
              ]],
              ["Google Analytics",
                "Wenn Sie einwilligen, nutzen wir Google Analytics 4 der Google Ireland Limited (Irland) bzw. Google LLC (USA), um die Nutzung unserer Website statistisch auszuwerten, etwa welche Seiten besucht werden und über welche Wege Besucherinnen und Besucher zu uns finden. Dafür werden Cookies gesetzt und Nutzungsdaten wie aufgerufene Seiten, Verweildauer, ungefährer Standort sowie Geräte- und Browserinformationen an Google übermittelt; IP-Adressen werden von Google Analytics 4 nicht gespeichert. Dabei können Daten in die USA übermittelt werden; Google ist unter dem Swiss-U.S. Data Privacy Framework zertifiziert. Die Daten werden höchstens 14 Monate aufbewahrt. Ohne Ihre Einwilligung wird Google Analytics nicht geladen. Sie können Ihre Einwilligung jederzeit über «Cookie-Einstellungen» widerrufen."],
              ["Karte und externe Links",
                "Auf der Kontaktseite binden wir eine Karte von OpenStreetMap (OpenStreetMap Foundation, Grossbritannien) ein. Beim Anzeigen der Karte wird Ihre IP-Adresse an OpenStreetMap übermittelt; es werden dabei keine Cookies zu Werbezwecken gesetzt. Links zu Instagram, Facebook, WhatsApp oder Google Maps sind einfache Verlinkungen – Daten fliessen erst, wenn Sie diese anklicken."],
              ["Ihre Rechte", [
                "Sie können Auskunft über Ihre Daten verlangen sowie deren Berichtigung, Löschung oder Herausgabe. Schreiben Sie uns dazu an ",
                i.jsx("a", { href: "mailto:info@pflanzfarm.ch", children: "info@pflanzfarm.ch" }, "m"),
                ". Zudem können Sie sich beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) beschweren.",
              ]],
              ["Änderungen",
                "Wir passen diese Datenschutzerklärung an, wenn sich unsere Website oder unsere Abläufe ändern. Es gilt die jeweils hier veröffentlichte Fassung."],
            ].map(([v, T]) => i.jsxs("section", { children: [i.jsx("h2", { children: v }), i.jsx("p", { children: T })] }, v)),
          }),
        ],
      }),
    $e = () =>
      i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        className: "legal-page container",
        children: [
          i.jsxs("header", {
            className: "legal-hero",
            children: [
              i.jsx("span", { className: "eyebrow", children: "Impressum" }),
              i.jsx("h1", { children: "Impressum" }),
              i.jsx("p", { children: "Angaben zum Anbieter dieser Website." }),
            ],
          }),
          i.jsxs("div", {
            className: "legal-grid legal-grid--imprint",
            children: [
              i.jsxs("section", {
                children: [
                  i.jsx("h2", { children: "Anbieter" }),
                  i.jsxs("p", {
                    children: [
                      "Pflanzfarm",
                      i.jsx("br", {}),
                      "Inhaber/Betreiber: Thomas Steinmann",
                      i.jsx("br", {}),
                      "Untergretti 2",
                      i.jsx("br", {}),
                      "CH-6245 Ebersecken",
                    ],
                  }),
                  i.jsxs("p", { children: ["UID / MWST-Nr.: CHE-214.008.517"] }),
                  i.jsxs("p", {
                    children: [
                      i.jsx("a", { href: "tel:+41793361495", children: "+41 79 336 14 95" }),
                      i.jsx("br", {}),
                      i.jsx("a", { href: "mailto:info@pflanzfarm.ch", children: "info@pflanzfarm.ch" }),
                    ],
                  }),
                ],
              }),
              i.jsxs("section", {
                children: [
                  i.jsx("h2", { children: "Verantwortung für Inhalte" }),
                  i.jsxs("p", {
                    children: [
                      "Thomas Steinmann",
                      i.jsx("br", {}),
                      "Untergretti 2",
                      i.jsx("br", {}),
                      "CH-6245 Ebersecken",
                    ],
                  }),
                ],
              }),
              i.jsxs("section", {
                children: [
                  i.jsx("h2", { children: "Bestellungen" }),
                  i.jsx("p", {
                    children:
                      "Für Bestellungen im Online-Shop gelten unsere Allgemeinen Geschäftsbedingungen (AGB) mit Versandbedingungen und Widerrufsbelehrung. Preise in Schweizer Franken inklusive Mehrwertsteuer.",
                  }),
                ],
              }),
              i.jsxs("section", {
                children: [
                  i.jsx("h2", { children: "Urheberrecht und Links" }),
                  i.jsx("p", {
                    children:
                      "Texte und Bilder dieser Website sind urheberrechtlich geschützt und dürfen nur mit unserer Zustimmung verwendet werden. Für die Inhalte verlinkter externer Websites sind ausschliesslich deren Betreiber verantwortlich.",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    gt = () =>
      i.jsxs("main", {
        id: "main-content",
        tabIndex: -1,
        className: "legal-page container",
        children: [
          i.jsxs("header", {
            className: "legal-hero",
            children: [
              i.jsx("span", { className: "eyebrow", children: "Barrierefreiheit" }),
              i.jsx("h1", { children: "Für möglichst viele Menschen bedienbar." }),
              i.jsx("p", {
                children: "Die öffentliche Oberfläche richtet sich am Konformitätsziel WCAG 2.2 auf Stufe AA aus.",
              }),
            ],
          }),
          i.jsxs("div", {
            className: "legal-grid",
            children: [
              i.jsxs("section", {
                children: [
                  i.jsx("h2", { children: "Umgesetzte Massnahmen" }),
                  i.jsx("p", {
                    children:
                      "Sprunglink, sichtbare Tastaturfokusse, semantische Hauptbereiche, aussagekräftige Beschriftungen, ausreichende Kontraste, robuste Zielgrössen und Unterstützung für reduzierte Bewegung sind umgesetzt. Bei reduzierter Bewegung oder aktiviertem Datensparmodus wird statt des Videos ein Standbild gezeigt.",
                  }),
                ],
              }),
              i.jsxs("section", {
                children: [
                  i.jsx("h2", { children: "Tastatur und Fokus" }),
                  i.jsx("p", {
                    children:
                      "Alle wesentlichen Funktionen sind mit der Tastatur erreichbar, der Fokus bleibt sichtbar. Saisonale Hinweise lassen sich mit Escape schliessen; der Cookie-Hinweis blockiert die Seite nicht. Bitte melden Sie uns beobachtete Barrieren.",
                  }),
                ],
              }),
              i.jsxs("section", {
                children: [
                  i.jsx("h2", { children: "Feedback" }),
                  i.jsxs("p", {
                    children: [
                      "Wenn Sie eine Barriere feststellen oder Informationen in einer anderen Form benötigen, kontaktieren Sie uns unter ",
                      i.jsx("a", { href: "mailto:info@pflanzfarm.ch", children: "info@pflanzfarm.ch" }),
                      " oder telefonisch unter ",
                      i.jsx("a", { href: "tel:+41793361495", children: "+41 79 336 14 95" }),
                      ".",
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    pf_PageHead = (v, T, E) =>
      h(
        "header",
        { className: "legal-hero" },
        h("span", { className: "eyebrow" }, v),
        h("h1", null, T),
        h("p", null, E),
      ),
    pf_service = () =>
      h(
        "main",
        { id: "main-content", tabIndex: -1, className: "service-page" },
        h(
          "section",
          { className: "svc-hero container" },
          h(
            "div",
            { className: "svc-hero__copy" },
            h("span", { className: "eyebrow" }, "Gartenservice"),
            h("h1", null, "Von der Beratung bis zur eingewachsenen Hecke."),
            h("p", { className: "svc-lead" }, "Wir begleiten Ihr Gartenprojekt persönlich – mit Pflanzen aus unserer eigenen Baumschule in Ebersecken und Erfahrung aus Gartenbau und Landschaftsbau."),
            h(
              "div",
              { className: "svc-hero__actions" },
              h("a", { className: "button button--primary", ...Lk("contact") }, "Beratung anfragen ", h(Ve, { size: 18 })),
              h("a", { className: "button button--soft", href: "tel:+41793361495" }, h(pf_Phone, { size: 17 }), " 079 336 14 95"),
            ),
          ),
          h(
            "figure",
            { className: "svc-hero__media" },
            h("img", {
              src: He("/assets/pflanzfarm-garten-3.jpg"),
              srcSet: At("/assets/pflanzfarm-garten-3-640.webp 640w, /assets/pflanzfarm-garten-3-1280.webp 1280w"),
              sizes: "(max-width: 900px) 92vw, 46vw",
              alt: "Frisch gepflanzte Thuja-Hecke in einem Garten",
              fetchPriority: "high",
            }),
            h("figcaption", null, h(il, { size: 16 }), " Thuja-Sichtschutz, Kanton Luzern"),
          ),
        ),
        h(
          "section",
          { className: "svc-services container", "aria-labelledby": "leistungen" },
          h(
            "div",
            { className: "svc-head" },
            h("span", { className: "eyebrow" }, "Leistungen"),
            h("h2", { id: "leistungen" }, "Alles aus einer Hand."),
          ),
          h(
            "div",
            { className: "svc-grid" },
            ...[
              [In, "Beratung & Standortanalyse", "Wir schauen uns Boden, Licht, Platz und Nutzung an und empfehlen Pflanzen, die bei Ihnen langfristig gedeihen."],
              [il, "Pflanzkonzepte", "Ob Sichtschutz, Naschgarten oder Formgehölze: Wir planen Auswahl, Abstände und Grössen passend zu Ihrem Garten."],
              [Rc, "Lieferung schweizweit", "Wir liefern Ihre Pflanzen zuverlässig in die ganze Schweiz – oder Sie holen sie nach Absprache in Ebersecken ab."],
              [za, "Pflanzservice", "Auf Wunsch setzen wir Ihre Hecke oder Gartenpflanzen fachgerecht – inklusive Bodenvorbereitung und Angiessen."],
              [pf_Clock, "Pflege & Schnitt", "Damit Ihre Pflanzen gesund bleiben: Heckenschnitt, Formschnitt und Pflege von Gehölzen nach Absprache."],
              [Jm, "Baumschule vor Ort", "Besuchen Sie uns nach Vereinbarung und wählen Sie Ihre Pflanzen direkt in unseren Pflanzenquartieren aus."],
            ].map(([v, T, E], K) =>
              h(
                "article",
                { key: T, className: K === 3 ? "svc-card svc-card--accent" : "svc-card" },
                h("span", { className: "svc-card__icon", "aria-hidden": "true" }, h(v, { size: 22 })),
                h("h3", null, T),
                h("p", null, E),
              ),
            ),
          ),
        ),
        h(
          "section",
          { className: "svc-process", "aria-labelledby": "ablauf" },
          h(
            "div",
            { className: "container" },
            h(
              "div",
              { className: "svc-process__grid" },
              h(
                "figure",
                { className: "svc-process__media" },
                h("img", {
                  src: He("/assets/pflanzfarm-garten-2.jpg"),
                  srcSet: At("/assets/pflanzfarm-garten-2-640.webp 640w, /assets/pflanzfarm-garten-2-1280.webp 1280w"),
                  sizes: "(max-width: 900px) 92vw, 40vw",
                  alt: "Gartenanlage mit gepflanzten Hecken",
                  loading: "lazy",
                }),
              ),
              h(
                "div",
                { className: "svc-process__copy" },
                h("span", { className: "eyebrow eyebrow--light" }, "Gut zu wissen"),
                h("h2", { id: "ablauf" }, "Wie wir mit Ihnen arbeiten."),
                h("p", { className: "svc-process__lead" }, "Sie sprechen von der ersten Frage bis zur Pflege mit denselben Leuten aus unserem Familienbetrieb. Was Sie vorab wissen sollten:"),
                h(
                  "dl",
                  { className: "svc-facts-list" },
                  ...[
                    ["Kontakt", "Telefon, E-Mail, WhatsApp oder Kontaktformular – wir antworten in der Regel innert eines Arbeitstags."],
                    ["Beratung", "Telefonisch, bei uns in der Baumschule in Ebersecken oder bei Ihnen im Garten."],
                    ["Offerte", "Nach der Beratung erhalten Sie eine klare, schriftliche Offerte."],
                    ["Pflanzzeit", "Die beste Zeit für Hecken und Gehölze ist Frühling oder Herbst – den Termin planen wir mit Ihnen."],
                  ].map(([v, T]) => h("div", { key: v }, h("dt", null, v), h("dd", null, T))),
                ),
              ),
            ),
          ),
        ),
        h(
          "section",
          { className: "svc-cta container" },
          h(
            "div",
            { className: "svc-cta__inner" },
            h(
              "div",
              null,
              h("h2", null, "Bereit für Ihr Gartenprojekt?"),
              h("p", null, "Erzählen Sie uns von Ihrem Vorhaben – wir melden uns in der Regel innert eines Arbeitstags."),
            ),
            h(
              "div",
              { className: "svc-cta__actions" },
              h("a", { className: "button button--primary", ...Lk("contact") }, "Anfrage senden ", h(Ve, { size: 18 })),
              h("a", { className: "button button--ghost", href: "https://wa.me/41793361495", target: "_blank", rel: "noopener noreferrer" }, h(g1, { size: 17 }), " WhatsApp"),
            ),
          ),
        ),
      ),
    pf_article = (v) => {
      const T = (v.match(/^\/ratgeber\/([a-z0-9-]+)/) || [])[1];
      return T ? (pf_articles || pf_defaultArticles).find((E) => E.id === T) || null : null;
    },
    pf_articlePage = (v, T) => {
      const E = v.product && Ql.find((De) => De.slug === v.product),
        K = T.filter((De) => De.id !== v.id).slice(0, 3);
      return h(
        "main",
        { id: "main-content", tabIndex: -1, className: "legal-page container info-page article-page" },
        h("a", { className: "breadcrumb", ...Lk("guide") }, "Ratgeber ", h(u0, { size: 14 }), " ", v.title),
        h(
          "article",
          { className: "guide-article guide-article--full" },
          h("span", { className: "eyebrow" }, "Ratgeber"),
          h("h1", null, v.title),
          ...v.paras.map((De, Te) => h("p", { key: Te }, De)),
          E &&
            h(
              "a",
              {
                className: "guide-product",
                href: e0(`/produkt/${E.slug}/`),
                "data-nav": "",
                onClick: (De) => {
                  pf_isPlainClick(De) && (De.preventDefault(), iu(E));
                },
              },
              h("img", { src: He(E.image), srcSet: At(E.imageSet), sizes: "120px", alt: "", loading: "lazy" }),
              h("span", null, h("small", null, "Passend dazu"), h("b", null, E.name), h("span", null, E.priceOnRequest ? "Preis auf Anfrage" : `ab ${Sa(E.price)}`)),
              h(Ve, { size: 18 }),
            ),
        ),
        K.length > 0 &&
          h(
            "section",
            { className: "guide-more" },
            h("h2", null, "Weitere Tipps"),
            h(
              "div",
              { className: "guide-cards" },
              ...K.map((De) =>
                h(
                  "a",
                  {
                    key: De.id,
                    className: "guide-card",
                    href: e0(`/ratgeber/${De.id}/`),
                    "data-nav": "",
                    onClick: (Te) => {
                      pf_isPlainClick(Te) && (Te.preventDefault(), pf_openArticle(De.id));
                    },
                  },
                  h("h3", null, De.title),
                  h("span", { className: "text-link" }, "Lesen ", h(Ve, { size: 16 })),
                ),
              ),
            ),
          ),
      );
    },
    pf_guide = () => {
      const v = pf_articles || pf_defaultArticles;
      return pf_guideView(v);
    },
    pf_defaultArticles = [
        {
          id: "thuja-hecke-pflanzen",
          title: "Thuja-Hecke pflanzen: Zeitpunkt, Abstand und Pflege",
          product: "thuja-smaragd",
          paras: [
            "Die beste Pflanzzeit ist der Herbst von September bis November oder der Frühling von März bis Mai – jeweils bei frostfreiem, nicht zu nassem Boden. Im Herbst wurzeln die Pflanzen dank der Bodenwärme besonders gut ein.",
            "Für eine dichte Hecke mit Thuja Smaragd in der Grösse 80–100 cm rechnen wir mit rund drei Pflanzen pro Laufmeter. Spannen Sie eine Schnur, damit die Hecke gerade wird, und heben Sie Pflanzlöcher aus, die etwa doppelt so breit sind wie der Wurzelballen.",
            "Wässern Sie den Ballen vor dem Pflanzen gründlich, setzen Sie die Pflanze nicht tiefer als im Topf und giessen Sie kräftig an. Eine Mulchschicht hält die Feuchtigkeit im Boden. Im ersten Jahr regelmässig giessen – als immergrüne Pflanze braucht Thuja auch an frostfreien Wintertagen Wasser.",
          ],
        },
        {
          id: "photinia-schneiden",
          title: "Photinia ‘Red Robin’ schneiden für den roten Austrieb",
          product: "photinia-fraseri-red-robin",
          paras: [
            "Die Glanzmispel zeigt ihren leuchtend roten Austrieb vor allem nach einem Schnitt. Schneiden Sie die Hecke nach dem ersten Austrieb ab Ende Mai bis Juni in Form.",
            "Ein zweiter, leichter Schnitt bis spätestens Mitte August regt einen weiteren roten Austrieb an. Später sollten Sie nicht mehr stark schneiden, damit die jungen Triebe vor dem Winter ausreifen.",
            "Photinia liebt sonnige bis halbschattige, etwas geschützte Standorte. In den ersten Wintern schützt ein Vlies bei starkem Frost ohne Schnee vor Austrocknung.",
          ],
        },
        {
          id: "beerenstraeucher-pflanzen",
          title: "Beerensträucher pflanzen und schneiden",
          product: "diverse-beerenstraeucher",
          paras: [
            "Johannis- und Stachelbeeren pflanzen Sie am besten im Herbst an einen sonnigen bis halbschattigen Platz. Lassen Sie zwischen den Sträuchern etwa 1.2 bis 1.5 Meter Abstand.",
            "Setzen Sie Johannisbeeren etwas tiefer als im Topf – so bilden sie mehr kräftige Bodentriebe. Nach der Ernte entfernen Sie die ältesten, drei- bis vierjährigen Triebe bodennah und lassen junge, kräftige Triebe stehen.",
          ],
        },
        {
          id: "richtig-giessen",
          title: "Richtig giessen im ersten Standjahr",
          paras: [
            "Lieber selten, dafür durchdringend: Eine frisch gepflanzte Heckenpflanze braucht bei Trockenheit ein- bis zweimal pro Woche etwa 10 bis 20 Liter Wasser, je nach Grösse und Boden.",
            "Machen Sie die Fingerprobe: Ist die Erde in einigen Zentimetern Tiefe trocken, wird gegossen. Staunässe vermeiden – bei schweren Böden hilft eine Drainageschicht im Pflanzloch.",
          ],
        },
        {
          id: "hecke-schneiden",
          title: "Wann darf die Hecke geschnitten werden?",
          paras: [
            "Ein Formschnitt im Juni sowie ein zweiter leichter Schnitt im Spätsommer halten die meisten Hecken dicht. Schneiden Sie an einem bedeckten Tag, damit die Schnittstellen nicht verbrennen.",
            "Prüfen Sie vor jedem Schnitt, ob Vögel in der Hecke brüten – während der Brutzeit von etwa März bis August sind stärkere Rückschnitte zu vermeiden.",
          ],
        },
      ],
    pf_guideView = (v) => {
      const pf_a = pf_article(pf_path);
      if (pf_a) return pf_articlePage(pf_a, v);
      const T = [
          ["/assets/pflanzfarm-garten-3.jpg", "/assets/pflanzfarm-garten-3-640.webp 640w, /assets/pflanzfarm-garten-3-1280.webp 1280w"],
          ["/assets/pflanzfarm-garten-2.jpg", "/assets/pflanzfarm-garten-2-640.webp 640w, /assets/pflanzfarm-garten-2-1280.webp 1280w"],
          ["/assets/pflanzfarm-garten-1.jpg", "/assets/pflanzfarm-garten-1-640.webp 640w, /assets/pflanzfarm-garten-1-1280.webp 1280w"],
        ],
        E = (K, De) => {
          const Te = K.product && Ql.find((yt) => yt.slug === K.product),
            vt = T[De % T.length],
            Ft = K.paras.join(" ").split(/\s+/).length,
            Ce = K.excerpt || K.paras[0] || "";
          return {
            img: Te ? [Te.image, Te.imageSet] : vt,
            topic: Te ? Te.category : "Pflege",
            minutes: Math.max(1, Math.round(Ft / 180)),
            text: Ce.length > 160 ? Ce.slice(0, Ce.lastIndexOf(" ", 160)) + " …" : Ce,
          };
        },
        K = (De, Te, vt) => {
          const Ft = E(De, Te);
          return h(
            "a",
            {
              key: De.id,
              className: vt ? "guide-tile guide-tile--featured" : "guide-tile",
              href: e0(`/ratgeber/${De.id}/`),
              "data-nav": "",
              onClick: (Ce) => {
                pf_isPlainClick(Ce) && (Ce.preventDefault(), pf_openArticle(De.id));
              },
            },
            h(
              "span",
              { className: "guide-tile__media" },
              h("img", { src: He(Ft.img[0]), srcSet: Ft.img[1] ? At(Ft.img[1]) : void 0, sizes: vt ? "(max-width: 900px) 92vw, 50vw" : "(max-width: 900px) 92vw, 30vw", alt: "", loading: vt ? "eager" : "lazy" }),
            ),
            h(
              "span",
              { className: "guide-tile__body" },
              h("span", { className: "guide-tile__meta" }, h("span", { className: "guide-tile__topic" }, Ft.topic), ` · ${Ft.minutes} Min. Lesezeit`),
              h(vt ? "h2" : "h3", null, De.title),
              h("p", null, Ft.text),
              h("span", { className: "guide-tile__more" }, "Weiterlesen ", h(Ve, { size: 16 })),
            ),
          );
        };
      return h(
        "main",
        { id: "main-content", tabIndex: -1, className: "guide-page container" },
        h(
          "header",
          { className: "guide-head" },
          h("span", { className: "eyebrow" }, "Ratgeber"),
          h("h1", null, "Tipps aus der Baumschule."),
          h("p", null, "Praktisches Wissen rund um Hecken, Beerensträucher und Pflege – damit Ihre Pflanzen gut anwachsen und lange Freude machen."),
        ),
        v.length > 0 && K(v[0], 0, !0),
        // 4 weitere Artikel als 2×2, sonst Dreierraster (keine einzelne Karte allein in einer Reihe)
        h("div", { className: (v.length - 1) % 3 === 1 && v.length > 2 ? "guide-grid guide-grid--two" : "guide-grid" }, ...v.slice(1).map((De, Te) => K(De, Te + 1, !1))),
        h(
          "section",
          { className: "guide-help" },
          h(
            "div",
            null,
            h("span", { className: "eyebrow eyebrow--light" }, "Persönliche Beratung"),
            h("h2", null, "Ihre Frage ist nicht dabei?"),
            h("p", null, "Rufen Sie uns an oder schreiben Sie uns – wir helfen Ihnen gern weiter."),
          ),
          h(
            "div",
            { className: "guide-help__actions" },
            h("a", { className: "button button--primary", href: "tel:+41793361495" }, h(pf_Phone, { size: 17 }), " 079 336 14 95"),
            h("a", { className: "button button--ghost", ...Lk("contact") }, "Kontakt aufnehmen ", h(Ve, { size: 18 })),
          ),
        ),
      );
    },
    pf_contact = () =>
      h(
        "main",
        { id: "main-content", tabIndex: -1, className: "legal-page container info-page" },
        pf_PageHead(
          "Kontakt",
          "Wir sind gern für Sie da.",
          "Für Beratung, Offerten, Bestellungen oder einen Besuch in unserer Baumschule in Ebersecken.",
        ),
        h(
          "div",
          { className: "contact-grid" },
          h("section", { className: "contact-card" }, h("h2", null, "So erreichen Sie uns"), h(pf_ContactList, null)),
          h(
            "section",
            { className: "contact-card" },
            h("h2", null, "Öffnungszeiten"),
            ...(pf_catalogSettings.openingHours || []).map((v, T) =>
              h("p", { key: T, className: "contact-hours" }, h(pf_Clock, { size: 18 }), h("span", null, h("b", null, v.label), h("br", null), v.value)),
            ),
            pf_catalogSettings.openingNote && h("p", null, pf_catalogSettings.openingNote),
            h("a", { className: "button button--dark", href: "tel:+41793361495" }, h(pf_Phone, { size: 17 }), " Jetzt anrufen"),
          ),
          h(
            "section",
            { className: "contact-card contact-card--wide" },
            h(
              "div",
              { className: "contact-route" },
              h("div", null, h("h2", null, "Anfahrt"), h("p", null, "Untergretti 2, 6245 Ebersecken (Gemeinde Altishofen, Kanton Luzern). Parkplätze direkt beim Hof.")),
              h(
                "div",
                { className: "contact-route__actions" },
                h("a", { className: "pill-link", href: pf_routeUrl, target: "_blank", rel: "noopener noreferrer" }, h(Jm, { size: 16 }), " Route planen"),
                h(
                  "a",
                  { className: "pill-link pill-link--soft", href: "https://www.openstreetmap.org/?mlat=47.17497&mlon=7.92130#map=16/47.17497/7.92130", target: "_blank", rel: "noopener noreferrer" },
                  "Grosse Karte ",
                  h(i0, { size: 15 }),
                ),
              ),
            ),
            h(pf_Map, null),
          ),
        ),
        h(pf_Inquiry, null),
      );
  return i.jsxs(i.Fragment, {
    children: [
      i.jsxs("div", {
        className: "app",
        children: [
          i.jsx("a", { className: "skip-link", href: "#main-content", children: "Zum Inhalt springen" }),
          pf_catalogSettings.testMode &&
            i.jsx("div", { className: "test-banner", role: "note", children: "Testumgebung – Bestellungen sind nicht verbindlich, Zahlungen sind Testzahlungen (keine echten Abbuchungen)." }),
          i.jsxs(i.Fragment, {
                children: [
                  cu(),
                  o === "home" && su(),
                  o === "shop" && ru(),
                  o === "product" && ui(),
                  o === "references" && ci(),
                  o === "about" && fu(),
                  o === "cart" && du(),
                  o === "privacy" && sl(),
                  o === "imprint" && $e(),
                  o === "accessibility" && gt(),
                  o === "service" && pf_service(),
                  o === "guide" && pf_guide(),
                  o === "contact" && pf_contact(),
                  o === "checkout" &&
                    h(
                      "main",
                      { id: "main-content", tabIndex: -1, className: "legal-page container info-page checkout-page" },
                      pf_PageHead("Kasse", "Fast geschafft.", "Prüfen Sie Ihre Angaben und wählen Sie Lieferung und Zahlung."),
                      h(pf_Checkout, {
                        key: pf_ver,
                        lines: et,
                        user: pf_user,
                        onNavigate: I,
                        onPlaced: (v, T) => {
                          (window.history.pushState({}, "", e0(`${A1.thanks}?nr=${encodeURIComponent(v)}&t=${encodeURIComponent(T)}`)), C("thanks"));
                        },
                      }),
                    ),
                  o === "thanks" &&
                    h(
                      "main",
                      { id: "main-content", tabIndex: -1, className: "legal-page container info-page" },
                      h(pf_Thanks, { onClear: () => Le({}), onNavigate: I }),
                    ),
                  o === "account" &&
                    h(
                      "main",
                      { id: "main-content", tabIndex: -1, className: "legal-page container info-page" },
                      pf_PageHead("Kundenkonto", pf_user ? `Grüezi ${pf_user.name.split(" ")[0]}` : "Mein Konto", pf_user ? "Ihre Bestellungen und Angaben auf einen Blick." : "Melden Sie sich an oder erstellen Sie ein Konto, um schneller zu bestellen und Ihre Bestellungen zu sehen."),
                      h(pf_Account, { user: pf_user, setUser: pf_setUser, toast: Ue, onNavigate: I }),
                    ),
                  o === "terms" &&
                    h(
                      "main",
                      { id: "main-content", tabIndex: -1, className: "legal-page container" },
                      pf_PageHead("AGB", "Allgemeine Geschäftsbedingungen", "Für Bestellungen im Online-Shop der Pflanzfarm Steinmann, mit Versandbedingungen und Widerrufsbelehrung. Stand: Oktober 2026."),
                      h(
                        "nav",
                        { className: "legal-toc", "aria-label": "Inhalt" },
                        ...pf_terms.map((v) => h("a", { key: v.id, className: "pill-link pill-link--soft", href: `#${v.id}` }, v.title)),
                      ),
                      ...pf_terms.map((v) =>
                        h(
                          "section",
                          { key: v.id, id: v.id, className: "legal-doc", "aria-labelledby": `${v.id}-titel` },
                          h("h2", { id: `${v.id}-titel` }, v.title),
                          v.intro && h("p", { className: "legal-doc__intro" }, v.intro),
                          ...v.sections.map(([T, E, K]) =>
                            h("div", { key: T, className: "legal-doc__part" }, h("h3", null, T), E && h("p", null, E), K.length > 0 && h("ol", null, ...K.map((De) => h("li", { key: De }, De)))),
                          ),
                        ),
                      ),
                    ),
                  h(
                    "footer",
                    { className: "pf-footer", "aria-label": "Fussbereich" },
                    h(
                      "div",
                      { className: "container pf-footer__main" },
                      h(
                        "a",
                        { ...Lk("home"), className: "pf-footer__logo", "aria-label": "Pflanzfarm Startseite" },
                        h("img", { src: He("/assets/pflanzfarm-logo.webp"), alt: "Pflanzfarm Steinmann", width: 74, height: 50 }),
                      ),
                      h(
                        "nav",
                        { className: "pf-footer__nav", "aria-label": "Fussnavigation" },
                        h("a", { ...Lk("shop") }, "Pflanzen"),
                        h("a", { ...Lk("service") }, "Gartenservice"),
                        h("a", { ...Lk("references") }, "Referenzen"),
                        h("a", { ...Lk("guide") }, "Ratgeber"),
                        h("a", { ...Lk("about") }, "Über uns"),
                        h("a", { ...Lk("contact") }, "Kontakt"),
                        h("a", { ...Lk("account") }, "Mein Konto"),
                      ),
                      h(
                        "div",
                        { className: "pf-footer__contact" },
                        h("a", { href: "tel:+41793361495" }, h(pf_Phone, { size: 15 }), " 079 336 14 95"),
                        h("a", { href: "mailto:info@pflanzfarm.ch" }, h(wc, { size: 15 }), " info@pflanzfarm.ch"),
                        h(
                          "span",
                          { className: "pf-footer__social" },
                          ...S1.map(({ label: v, href: T, icon: E }) =>
                            h("a", { key: v, href: T, target: "_blank", rel: "noopener noreferrer", "aria-label": `Pflanzfarm auf ${v}`, title: v }, h(E, { size: 16 })),
                          ),
                        ),
                      ),
                    ),
                    h(
                      "div",
                      { className: "pf-footer__bottom" },
                      h(
                        "div",
                        { className: "container pf-footer__bottom-inner" },
                        h("span", null, "© 2026 Pflanzfarm Steinmann · Untergretti 2, 6245 Ebersecken"),
                        h(
                          "nav",
                          { className: "pf-footer__legal", "aria-label": "Rechtliches" },
                          h("a", { ...Lk("terms") }, "AGB"),
                          h("a", { ...Lk("privacy") }, "Datenschutz"),
                          h("a", { ...Lk("imprint") }, "Impressum"),
                          h("a", { ...Lk("accessibility") }, "Barrierefreiheit"),
                          h("button", { type: "button", onClick: () => pf_setBo(!0) }, "Cookie-Einstellungen"),
                        ),
                      ),
                    ),
                  ),
                ],
              }),
        ],
      }),
      D &&
        rn &&
        i.jsx("div", {
          className: "popup-backdrop",
          role: "presentation",
          children: i.jsxs("section", {
            ref: nn,
            tabIndex: -1,
            className: "campaign-popup",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Aktuelles Angebot",
            children: [
              i.jsx("button", {
                className: "popup-close",
                onClick: tt,
                "aria-label": "Popup schliessen",
                children: i.jsx(Pm, { size: 20 }),
              }),
              i.jsx("div", {
                className: "campaign-popup__image",
                children: i.jsx("img", {
                  src: He(R.image || "/assets/pflanzfarm-garten-3.jpg"),
                  srcSet: At(R.imageSet || R.image || "/assets/pflanzfarm-garten-3-640.webp 640w, /assets/pflanzfarm-garten-3-1280.webp 1280w"),
                  sizes: "(max-width: 760px) 92vw, 420px",
                  loading: "lazy",
                  decoding: "async",
                  alt: "",
                }),
              }),
              i.jsxs("div", {
                className: "campaign-popup__content",
                children: [
                  i.jsx("span", { className: "eyebrow", children: "Pflanzfarm aktuell" }),
                  i.jsx("h2", { children: R.title }),
                  i.jsx("p", { children: R.text }),
                  i.jsxs("button", {
                    className: "button button--primary button--full",
                    onClick: () => {
                      (tt(), I(A1[R.ctaTarget] ? R.ctaTarget : "shop"));
                    },
                    children: [R.cta, " ", i.jsx(Ve, { size: 17 })],
                  }),
                  i.jsx("button", { className: "popup-skip", onClick: tt, children: "Jetzt nicht, danke" }),
                ],
              }),
            ],
          }),
        }),
      pf_drawer &&
        h(pf_CartDrawer, {
          added: pf_drawer.name ? pf_drawer : null,
          lines: et,
          total: ai,
          onClose: () => pf_setDrawer(null),
          onQty: (v, T) => Jl(v, T),
          onCheckout: () => (pf_setDrawer(null), I("checkout")),
          onCart: () => (pf_setDrawer(null), I("cart")),
        }),
      o === "product" &&
        !pf_buyVisible &&
        !_.priceOnRequest &&
        h(
          "div",
          { className: "buy-bar", role: "region", "aria-label": "Schnell kaufen" },
          h("div", null, h("b", null, _.name), h("small", null, `${L} · ${Sa(pf_line(_, L, d).unit)}`)),
          pf_vd(_, L).stock >= d
            ? h("button", { type: "button", className: "button button--primary", onClick: () => Kl(_, d, L) }, h(x1, { size: 17 }), d > 1 ? ` ${d} in den Warenkorb` : " In den Warenkorb")
            : h(
                "button",
                { type: "button", className: "button button--dark", onClick: () => document.getElementById("pf-buy").scrollIntoView({ behavior: "smooth", block: "center" }) },
                "Verfügbarkeit ansehen",
              ),
        ),
      pf_search &&
        h(pf_Search, {
          articles: pf_articles || pf_defaultArticles,
          onClose: () => pf_setSearch(!1),
          onProduct: (v) => (pf_setSearch(!1), iu(v)),
          onArticle: (v) => (pf_setSearch(!1), pf_openArticle(v)),
        }),
      pf_bo &&
        i.jsxs("section", {
          className: "consent-bar",
          role: "region",
          "aria-labelledby": "consent-bar-title",
          children: [
            i.jsxs("div", {
              className: "consent-bar__text",
              children: [
                i.jsx("h2", { id: "consent-bar-title", children: "Cookies & Statistik" }),
                i.jsxs("p", {
                  children: [
                    "Mit Ihrer Zustimmung nutzen wir Google Analytics, um zu verstehen, wie unsere Website genutzt wird, und sie zu verbessern. Dabei werden Cookies gesetzt und Daten an Google (auch in die USA) übermittelt. Sie können Ihre Wahl jederzeit unter «Cookie-Einstellungen» ändern. ",
                    i.jsx("a", { ...Lk("privacy"), children: "Mehr in der Datenschutzerklärung" }),
                  ],
                }),
              ],
            }),
            i.jsxs("div", {
              className: "consent-bar__actions",
              children: [
                i.jsx("button", { type: "button", className: "button consent-bar__choice", onClick: () => pf_decide(!1), children: "Ablehnen" }),
                i.jsx("button", { type: "button", className: "button consent-bar__choice", onClick: () => pf_decide(!0), children: "Akzeptieren" }),
              ],
            }),
          ],
        }),
      Ct &&
        i.jsxs("div", {
          className: "toast",
          role: "status",
          "aria-live": "polite",
          children: [i.jsx(za, { size: 18 }), " ", Ct],
        }),
    ],
  });
}
l1.createRoot(document.getElementById("root")).render(i.jsx(O1, {}));
