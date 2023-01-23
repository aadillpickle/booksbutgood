/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
var t = {
    519: (t) => {
      t.exports = function (t, e) {
        e || (e = {}), "function" == typeof e && (e = { cmp: e });
        var n,
          r = "boolean" == typeof e.cycles && e.cycles,
          o =
            e.cmp &&
            ((n = e.cmp),
            function (t) {
              return function (e, r) {
                var o = { key: e, value: t[e] },
                  a = { key: r, value: t[r] };
                return n(o, a);
              };
            }),
          a = [];
        return (function t(e) {
          if (
            (e && e.toJSON && "function" == typeof e.toJSON && (e = e.toJSON()),
            void 0 !== e)
          ) {
            if ("number" == typeof e) return isFinite(e) ? "" + e : "null";
            if ("object" != typeof e) return JSON.stringify(e);
            var n, i;
            if (Array.isArray(e)) {
              for (i = "[", n = 0; n < e.length; n++)
                n && (i += ","), (i += t(e[n]) || "null");
              return i + "]";
            }
            if (null === e) return "null";
            if (-1 !== a.indexOf(e)) {
              if (r) return JSON.stringify("__cycle__");
              throw new TypeError("Converting circular structure to JSON");
            }
            var s = a.push(e) - 1,
              c = Object.keys(e).sort(o && o(e));
            for (i = "", n = 0; n < c.length; n++) {
              var l = c[n],
                u = t(e[l]);
              u && (i && (i += ","), (i += JSON.stringify(l) + ":" + u));
            }
            return a.splice(s, 1), "{" + i + "}";
          }
        })(t);
      };
    },
    19: (t, e) => {
      e.JQ = function (t) {
        for (
          var e, r = t.length, o = r % 3, a = [], i = 16383, c = 0, l = r - o;
          c < l;
          c += i
        )
          a.push(s(t, c, c + i > l ? l : c + i));
        return (
          1 === o
            ? ((e = t[r - 1]), a.push(n[e >> 2] + n[(e << 4) & 63] + "=="))
            : 2 === o &&
              ((e = (t[r - 2] << 8) + t[r - 1]),
              a.push(n[e >> 10] + n[(e >> 4) & 63] + n[(e << 2) & 63] + "=")),
          a.join("")
        );
      };
      for (
        var n = [],
          r = [],
          o =
            ("undefined" != typeof Uint8Array && Uint8Array,
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),
          a = 0,
          i = o.length;
        a < i;
        ++a
      )
        (n[a] = o[a]), (r[o.charCodeAt(a)] = a);
      function s(t, e, r) {
        for (var o, a, i = [], s = e; s < r; s += 3)
          (o =
            ((t[s] << 16) & 16711680) +
            ((t[s + 1] << 8) & 65280) +
            (255 & t[s + 2])),
            i.push(
              n[((a = o) >> 18) & 63] +
                n[(a >> 12) & 63] +
                n[(a >> 6) & 63] +
                n[63 & a]
            );
        return i.join("");
      }
      (r["-".charCodeAt(0)] = 62), (r["_".charCodeAt(0)] = 63);
    },
  },
  e = {};
function n(r) {
  if (e[r]) return e[r].exports;
  var o = (e[r] = { exports: {} });
  return t[r](o, o.exports, n), o.exports;
}
(n.n = (t) => {
  var e = t && t.__esModule ? () => t.default : () => t;
  return n.d(e, { a: e }), e;
}),
  (n.d = (t, e) => {
    for (var r in e)
      n.o(e, r) &&
        !n.o(t, r) &&
        Object.defineProperty(t, r, { enumerable: !0, get: e[r] });
  }),
  (n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
  (() => {
    var t, e, r;
    !(function (t) {
      (t.InitialConfiguration = "initialConfiguration"),
        (t.HostUpdate = "hostUpdate");
    })(t || (t = {})),
      (function (t) {
        (t.OnLoad = "onLoad"), (t.TaskUpdate = "taskUpdate");
      })(e || (e = {})),
      (function (t) {
        t.Memory = "memory";
      })(r || (r = {}));
    const o = "main";
    var a, i;
    !(function (t) {
      (t.QA = "qa"), (t.Cloze = "cloze"), (t.Plain = "plain");
    })(a || (a = {})),
      (function (t) {
        (t.Task = "task"), (t.AttachmentReference = "attachmentReference");
      })(i || (i = {}));
    var s = n(19);
    function c(t) {
      return (0, s.JQ)(t)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .substring(0, 22);
    }
    const l =
        /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
      u = function (t) {
        return "string" == typeof t && l.test(t);
      };
    for (var d = [], h = 0; h < 256; ++h)
      d.push((h + 256).toString(16).substr(1));
    const f = function (t) {
      if (!u(t)) throw TypeError("Invalid UUID");
      var e,
        n = new Uint8Array(16);
      return (
        (n[0] = (e = parseInt(t.slice(0, 8), 16)) >>> 24),
        (n[1] = (e >>> 16) & 255),
        (n[2] = (e >>> 8) & 255),
        (n[3] = 255 & e),
        (n[4] = (e = parseInt(t.slice(9, 13), 16)) >>> 8),
        (n[5] = 255 & e),
        (n[6] = (e = parseInt(t.slice(14, 18), 16)) >>> 8),
        (n[7] = 255 & e),
        (n[8] = (e = parseInt(t.slice(19, 23), 16)) >>> 8),
        (n[9] = 255 & e),
        (n[10] = ((e = parseInt(t.slice(24, 36), 16)) / 1099511627776) & 255),
        (n[11] = (e / 4294967296) & 255),
        (n[12] = (e >>> 24) & 255),
        (n[13] = (e >>> 16) & 255),
        (n[14] = (e >>> 8) & 255),
        (n[15] = 255 & e),
        n
      );
    };
    function m(t, e, n, r) {
      switch (t) {
        case 0:
          return (e & n) ^ (~e & r);
        case 1:
          return e ^ n ^ r;
        case 2:
          return (e & n) ^ (e & r) ^ (n & r);
        case 3:
          return e ^ n ^ r;
      }
    }
    function p(t, e) {
      return (t << e) | (t >>> (32 - e));
    }
    const g = (function (t, e, n) {
      function r(t, e, n, r) {
        if (
          ("string" == typeof t &&
            (t = (function (t) {
              t = unescape(encodeURIComponent(t));
              for (var e = [], n = 0; n < t.length; ++n)
                e.push(t.charCodeAt(n));
              return e;
            })(t)),
          "string" == typeof e && (e = f(e)),
          16 !== e.length)
        )
          throw TypeError(
            "Namespace must be array-like (16 iterable integer values, 0-255)"
          );
        var o = new Uint8Array(16 + t.length);
        if (
          (o.set(e),
          o.set(t, e.length),
          ((o = (function (t) {
            var e = [1518500249, 1859775393, 2400959708, 3395469782],
              n = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
            if ("string" == typeof t) {
              var r = unescape(encodeURIComponent(t));
              t = [];
              for (var o = 0; o < r.length; ++o) t.push(r.charCodeAt(o));
            } else Array.isArray(t) || (t = Array.prototype.slice.call(t));
            t.push(128);
            for (
              var a = t.length / 4 + 2,
                i = Math.ceil(a / 16),
                s = new Array(i),
                c = 0;
              c < i;
              ++c
            ) {
              for (var l = new Uint32Array(16), u = 0; u < 16; ++u)
                l[u] =
                  (t[64 * c + 4 * u] << 24) |
                  (t[64 * c + 4 * u + 1] << 16) |
                  (t[64 * c + 4 * u + 2] << 8) |
                  t[64 * c + 4 * u + 3];
              s[c] = l;
            }
            (s[i - 1][14] = (8 * (t.length - 1)) / Math.pow(2, 32)),
              (s[i - 1][14] = Math.floor(s[i - 1][14])),
              (s[i - 1][15] = (8 * (t.length - 1)) & 4294967295);
            for (var d = 0; d < i; ++d) {
              for (var h = new Uint32Array(80), f = 0; f < 16; ++f)
                h[f] = s[d][f];
              for (var g = 16; g < 80; ++g)
                h[g] = p(h[g - 3] ^ h[g - 8] ^ h[g - 14] ^ h[g - 16], 1);
              for (
                var b = n[0], v = n[1], w = n[2], y = n[3], C = n[4], O = 0;
                O < 80;
                ++O
              ) {
                var M = Math.floor(O / 20),
                  A = (p(b, 5) + m(M, v, w, y) + C + e[M] + h[O]) >>> 0;
                (C = y), (y = w), (w = p(v, 30) >>> 0), (v = b), (b = A);
              }
              (n[0] = (n[0] + b) >>> 0),
                (n[1] = (n[1] + v) >>> 0),
                (n[2] = (n[2] + w) >>> 0),
                (n[3] = (n[3] + y) >>> 0),
                (n[4] = (n[4] + C) >>> 0);
            }
            return [
              (n[0] >> 24) & 255,
              (n[0] >> 16) & 255,
              (n[0] >> 8) & 255,
              255 & n[0],
              (n[1] >> 24) & 255,
              (n[1] >> 16) & 255,
              (n[1] >> 8) & 255,
              255 & n[1],
              (n[2] >> 24) & 255,
              (n[2] >> 16) & 255,
              (n[2] >> 8) & 255,
              255 & n[2],
              (n[3] >> 24) & 255,
              (n[3] >> 16) & 255,
              (n[3] >> 8) & 255,
              255 & n[3],
              (n[4] >> 24) & 255,
              (n[4] >> 16) & 255,
              (n[4] >> 8) & 255,
              255 & n[4],
            ];
          })(o))[6] = (15 & o[6]) | 80),
          (o[8] = (63 & o[8]) | 128),
          n)
        ) {
          r = r || 0;
          for (var a = 0; a < 16; ++a) n[r + a] = o[a];
          return n;
        }
        return (function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0,
            n = (
              d[t[e + 0]] +
              d[t[e + 1]] +
              d[t[e + 2]] +
              d[t[e + 3]] +
              "-" +
              d[t[e + 4]] +
              d[t[e + 5]] +
              "-" +
              d[t[e + 6]] +
              d[t[e + 7]] +
              "-" +
              d[t[e + 8]] +
              d[t[e + 9]] +
              "-" +
              d[t[e + 10]] +
              d[t[e + 11]] +
              d[t[e + 12]] +
              d[t[e + 13]] +
              d[t[e + 14]] +
              d[t[e + 15]]
            ).toLowerCase();
          if (!u(n)) throw TypeError("Stringified UUID is invalid");
          return n;
        })(o);
      }
      try {
        r.name = "v5";
      } catch (t) {}
      return (
        (r.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
        (r.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8"),
        r
      );
    })();
    var b = n(519),
      v = n.n(b);
    function w(t) {
      const e = Date.now(),
        n = {
          dueTimestampMillis: e,
          intervalMillis: 0,
          createdAtTimestampMillis: e,
          lastRepetitionTimestampMillis: null,
        };
      switch (t.type) {
        case a.QA:
        case a.Plain:
          return { [o]: n };
        case a.Cloze:
          return Object.fromEntries(
            Object.keys(t.components).map((t) => [t, n])
          );
      }
    }
    function y(t) {
      switch (t.type) {
        case a.QA:
        case a.Plain:
          return o;
        case a.Cloze:
          const e = Object.entries(t.components);
          return e.sort((t, e) => t[1].order - e[1].order), e[0][0];
      }
    }
    function C(t) {
      const e = new Uint8Array(16);
      return g(t, g.URL, e), c(e);
    }
    let O = null;
    function M(t) {
      O || (O = f("354182c0-33a8-4763-bbad-960bf679b4a1"));
      const e = new Uint8Array(16);
      return g(v()(t), O, e), c(e);
    }
    let A = !1;
    function I() {
      var t;
      const e = document.head;
      let n = null,
        r = null,
        o = null,
        a = null,
        i = null;
      for (let t = 0; t < e.children.length; t++) {
        const s = e.children[t];
        if (s instanceof HTMLMetaElement) {
          const t = s.getAttribute("property"),
            e = s.getAttribute("content");
          "og:title" === t
            ? (r = e)
            : "og:site_name" === t
            ? (o = e)
            : "orbit:color" === t && (a = e);
        } else
          s instanceof HTMLTitleElement
            ? (n = s.innerText)
            : s instanceof HTMLLinkElement &&
              "canonical" === s.getAttribute("rel") &&
              (i = s.getAttribute("href"));
      }
      return (
        n ||
          A ||
          ((A = !0),
          console.warn(
            "[Orbit] This page has no title. It will not display correctly in Orbit's interface."
          )),
        {
          url: null != i ? i : document.location.toString(),
          title: null != r ? r : n,
          siteName: o,
          colorPaletteName: null !== (t = a) && void 0 !== t ? t : null,
        }
      );
    }
    class E {
      constructor() {
        (this.onHeadChange = () => {
          const t = this.cachedMetadata,
            e = I();
          if (
            e.url !== t.url ||
            e.title !== t.title ||
            e.siteName !== t.siteName ||
            e.colorPaletteName !== t.colorPaletteName
          ) {
            for (const t of this.listeners) t(e);
            this.cachedMetadata = e;
          }
        }),
          (this.listeners = new Set()),
          new MutationObserver(this.onHeadChange).observe(document.head, {
            subtree: !0,
            childList: !0,
            attributes: !0,
          }),
          (this.cachedMetadata = I());
      }
      addEventListener(t) {
        this.listeners.add(t), t(this.cachedMetadata);
      }
      removeEventListener(t) {
        this.listeners.delete(t);
      }
    }
    let T = null;
    function N() {
      return T || (T = new E()), T;
    }
    const U = new Map();
    let L = [],
      k = !1;
    function R() {
      k ||
        ((k = !0),
        (L = null),
        setTimeout(() => {
          k = !1;
          const e =
              (null === L &&
                (L = [...U.keys()].sort((t, e) => {
                  const n = t.compareDocumentPosition(e);
                  if (
                    (n & Node.DOCUMENT_POSITION_PRECEDING) ===
                    Node.DOCUMENT_POSITION_PRECEDING
                  )
                    return 1;
                  if (
                    (n & Node.DOCUMENT_POSITION_FOLLOWING) ===
                    Node.DOCUMENT_POSITION_FOLLOWING
                  )
                    return -1;
                  throw new Error(
                    `Unexpected compareDocumentPosition return value ${n} for ${t} and ${e}`
                  );
                })),
              L),
            n = e.map((t) => {
              var e;
              return null !== (e = U.get(t)) && void 0 !== e ? e : null;
            });
          e.forEach((e, r) => {
            const o = {
              type: t.HostUpdate,
              state: { orderedScreenRecords: n, receiverIndex: r },
            };
            e.iframe.contentWindow.postMessage(o, "*");
          });
        }, 1e3));
    }
    function P(n) {
      if ("https://withorbit.com/embed".startsWith(n.origin) && n.data)
        switch (n.data.type) {
          case e.OnLoad:
            {
              const { element: e } = r(),
                n = e.getConfiguration();
              e.iframe.contentWindow.postMessage(
                { type: t.InitialConfiguration, configuration: n },
                "*"
              );
            }
            break;
          case e.TaskUpdate: {
            const { element: t, record: e } = r(),
              { task: o } = n.data;
            U.set(
              t,
              Object.assign(Object.assign({}, e), {
                reviewItems: e.reviewItems.map((t) =>
                  t.task.id === o.id
                    ? Object.assign(Object.assign({}, t), { task: o })
                    : t
                ),
              })
            ),
              R();
          }
        }
      function r() {
        const t = [...U.entries()].find(([t]) => {
          var e;
          return (
            (null === (e = t.iframe) || void 0 === e
              ? void 0
              : e.contentWindow) === n.source
          );
        });
        if (!t) throw new Error("Update from unknown review area " + n.source);
        return { element: t[0], record: t[1] };
      }
    }
    let D = !1;
    const S = new ResizeObserver((t) => {
      for (const e of t) x(e.target);
    });
    function x(t) {
      const e = t.getBoundingClientRect().width;
      t.style.height =
        (function (t) {
          const e = Math.min(500, t - 32);
          return Math.round((5 * e) / 6) + 144;
        })(e) +
        40 +
        "px";
    }
    const j = Date.now();
    class _ extends HTMLElement {
      constructor() {
        super(...arguments),
          (this.cachedMetadata = null),
          (this.cachedRecord = null),
          (this.iframe = null),
          (this.onMetadataChange = (t) => {
            this.cachedMetadata = t;
          });
      }
      onChildPromptChange() {
        this.cachedRecord = null;
      }
      getEmbeddedItems() {
        return (
          null === this.cachedRecord &&
            ((this.cachedRecord = (function (t) {
              const e = [],
                n = {};
              return (
                t.querySelectorAll(":scope > orbit-prompt").forEach((t) => {
                  const { content: o, attachmentIDsToURLs: s } = (function (t) {
                    const e = t.getAttribute("cloze");
                    if (e) {
                      const { markupWithoutBraces: t, clozeComponents: n } =
                        (function (t) {
                          let e,
                            n = 0,
                            r = "",
                            o = 0;
                          const a = new RegExp(/{([^{}]+?)}/g),
                            i = {};
                          for (; (e = a.exec(t)); n++)
                            (r += t.slice(o, e.index)),
                              (r += e[1]),
                              (o = a.lastIndex),
                              (i[n.toString()] = {
                                order: n,
                                ranges: [
                                  {
                                    startIndex: e.index - 2 * n,
                                    length: e[1].length,
                                    hint: null,
                                  },
                                ],
                              });
                          return (
                            (r += t.slice(o)),
                            { markupWithoutBraces: r, clozeComponents: i }
                          );
                        })(e);
                      return {
                        content: {
                          type: a.Cloze,
                          body: { text: t, attachments: [] },
                          components: n,
                        },
                        attachmentIDsToURLs: null,
                      };
                    }
                    {
                      const e = new Map();
                      function n(n, r) {
                        var o, a;
                        const i = t.getAttribute(n);
                        if (null === i)
                          throw new Error(
                            `Prompt is missing ${n}: ${t.outerHTML}`
                          );
                        const s = [],
                          c =
                            null !==
                              (a =
                                null === (o = t.getAttribute(r)) || void 0 === o
                                  ? void 0
                                  : o.split(";")) && void 0 !== a
                              ? a
                              : [];
                        for (const t of c) {
                          const n = C(t);
                          e.set(n, t), s.push(n);
                        }
                        return { text: i, attachments: s };
                      }
                      return {
                        content: {
                          type: a.QA,
                          body: n("question", "question-attachments"),
                          answer: n("answer", "answer-attachments"),
                        },
                        attachmentIDsToURLs: e,
                      };
                    }
                  })(t);
                  if (
                    (e.push(
                      (function (t) {
                        const e = { type: r.Memory, content: t };
                        return {
                          task: {
                            type: i.Task,
                            id: M(e),
                            spec: e,
                            provenance: null,
                            createdAtTimestampMillis: Date.now(),
                            componentStates: w(t),
                            isDeleted: !1,
                            metadata: {},
                          },
                          componentID: y(t),
                        };
                      })(o)
                    ),
                    s)
                  )
                    for (const [t, e] of s) n[t] = e;
                }),
                { reviewItems: e, attachmentIDsToURLs: n }
              );
            })(this)),
            U.set(this, this.cachedRecord),
            R()),
          this.cachedRecord
        );
      }
      getConfiguration() {
        if (!this.cachedMetadata)
          throw new Error("Invariant violation: no embedded host metadata");
        const t = this.getAttribute("color");
        return Object.assign(Object.assign({}, this.getEmbeddedItems()), {
          embeddedHostMetadata: Object.assign(
            Object.assign({}, this.cachedMetadata),
            t && { colorPaletteName: t }
          ),
          sessionStartTimestampMillis: j,
          isDebug:
            location.search.includes("orbitDebug") ||
            this.hasAttribute("debug"),
        });
      }
      connectedCallback() {
        D || (window.addEventListener("message", P), (D = !0)),
          N().addEventListener(this.onMetadataChange),
          this.style.display || (this.style.display = "block");
        const t = this.attachShadow({ mode: "closed" });
        (this.iframe = document.createElement("iframe")),
          (this.iframe.style.border = "none"),
          (this.iframe.style.width = "100%"),
          (this.iframe.style.marginBottom = "1rem"),
          this.iframe.setAttribute("loading", "eager"),
          this.iframe.setAttribute(
            "sandbox",
            "allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-modals"
          ),
          t.appendChild(this.iframe),
          S.observe(this.iframe);
        const e = this.iframe;
        this.getEmbeddedItems(),
          requestAnimationFrame(() => {
            x(e), (e.src = "https://withorbit.com/embed");
          });
      }
      disconnectedCallback() {
        this.iframe && S.unobserve(this.iframe),
          U.delete(this),
          R(),
          N().removeEventListener(this.onMetadataChange);
      }
    }
    class H extends HTMLElement {
      constructor() {
        super(...arguments), (this.mountPoint = null);
      }
      connectedCallback() {
        const t = this.getReviewAreaParent();
        if (!t) throw new Error("Card without review area: " + this.outerHTML);
        t.onChildPromptChange();
      }
      attributeChangedCallback() {
        var t;
        null === (t = this.getReviewAreaParent()) ||
          void 0 === t ||
          t.onChildPromptChange();
      }
      getReviewAreaParent() {
        let t = this;
        do {
          t = t.parentElement;
        } while (null !== t && !(t instanceof _));
        return t;
      }
      static get observedAttributes() {
        return ["question", "answer"];
      }
    }
    window.customElements.define("orbit-reviewarea", _),
      window.customElements.define("orbit-prompt", H);
  })();
//# sourceMappingURL=orbit-web-component.js.map
