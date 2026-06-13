var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// build/worker.bundled.mjs
var Ye = /* @__PURE__ */ __name((e2, t, r) => (n, o) => {
  let s = -1;
  return a(0);
  async function a(l) {
    if (l <= s) throw new Error("next() called multiple times");
    s = l;
    let c, i = false, u;
    if (e2[l] ? (u = e2[l][0][0], n.req.routeIndex = l) : u = l === e2.length && o || void 0, u) try {
      c = await u(n, () => a(l + 1));
    } catch (f) {
      if (f instanceof Error && t) n.error = f, c = await t(f, n), i = true;
      else throw f;
    }
    else n.finalized === false && r && (c = await r(n));
    return c && (n.finalized === false || i) && (n.res = c), n;
  }
  __name(a, "a");
}, "Ye");
var Nt = /* @__PURE__ */ Symbol();
var Tt = /* @__PURE__ */ __name(async (e2, t = /* @__PURE__ */ Object.create(null)) => {
  let { all: r = false, dot: n = false } = t, s = (e2 instanceof ge ? e2.raw.headers : e2.headers).get("Content-Type");
  return s?.startsWith("multipart/form-data") || s?.startsWith("application/x-www-form-urlencoded") ? xn(e2, { all: r, dot: n }) : {};
}, "Tt");
async function xn(e2, t) {
  let r = await e2.formData();
  return r ? Fn(r, t) : {};
}
__name(xn, "xn");
function Fn(e2, t) {
  let r = /* @__PURE__ */ Object.create(null);
  return e2.forEach((n, o) => {
    t.all || o.endsWith("[]") ? In(r, o, n) : r[o] = n;
  }), t.dot && Object.entries(r).forEach(([n, o]) => {
    n.includes(".") && (Cn(r, n, o), delete r[n]);
  }), r;
}
__name(Fn, "Fn");
var In = /* @__PURE__ */ __name((e2, t, r) => {
  e2[t] !== void 0 ? Array.isArray(e2[t]) ? e2[t].push(r) : e2[t] = [e2[t], r] : t.endsWith("[]") ? e2[t] = [r] : e2[t] = r;
}, "In");
var Cn = /* @__PURE__ */ __name((e2, t, r) => {
  if (/(?:^|\.)__proto__\./.test(t)) return;
  let n = e2, o = t.split(".");
  o.forEach((s, a) => {
    a === o.length - 1 ? n[s] = r : ((!n[s] || typeof n[s] != "object" || Array.isArray(n[s]) || n[s] instanceof File) && (n[s] = /* @__PURE__ */ Object.create(null)), n = n[s]);
  });
}, "Cn");
var Pe = /* @__PURE__ */ __name((e2) => {
  let t = e2.split("/");
  return t[0] === "" && t.shift(), t;
}, "Pe");
var Ot = /* @__PURE__ */ __name((e2) => {
  let { groups: t, path: r } = Bn(e2), n = Pe(r);
  return En(n, t);
}, "Ot");
var Bn = /* @__PURE__ */ __name((e2) => {
  let t = [];
  return e2 = e2.replace(/\{[^}]+\}/g, (r, n) => {
    let o = `@${n}`;
    return t.push([o, r]), o;
  }), { groups: t, path: e2 };
}, "Bn");
var En = /* @__PURE__ */ __name((e2, t) => {
  for (let r = t.length - 1; r >= 0; r--) {
    let [n] = t[r];
    for (let o = e2.length - 1; o >= 0; o--) if (e2[o].includes(n)) {
      e2[o] = e2[o].replace(n, t[r][1]);
      break;
    }
  }
  return e2;
}, "En");
var _e = {};
var Dt = /* @__PURE__ */ __name((e2, t) => {
  if (e2 === "*") return "*";
  let r = e2.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (r) {
    let n = `${e2}#${t}`;
    return _e[n] || (r[2] ? _e[n] = t && t[0] !== ":" && t[0] !== "*" ? [n, r[1], new RegExp(`^${r[2]}(?=/${t})`)] : [e2, r[1], new RegExp(`^${r[2]}$`)] : _e[n] = [e2, r[1], true]), _e[n];
  }
  return null;
}, "Dt");
var be = /* @__PURE__ */ __name((e2, t) => {
  try {
    return t(e2);
  } catch {
    return e2.replace(/(?:%[0-9A-Fa-f]{2})+/g, (r) => {
      try {
        return t(r);
      } catch {
        return r;
      }
    });
  }
}, "be");
var An = /* @__PURE__ */ __name((e2) => be(e2, decodeURI), "An");
var ze = /* @__PURE__ */ __name((e2) => {
  let t = e2.url, r = t.indexOf("/", t.indexOf(":") + 4), n = r;
  for (; n < t.length; n++) {
    let o = t.charCodeAt(n);
    if (o === 37) {
      let s = t.indexOf("?", n), a = t.indexOf("#", n), l = s === -1 ? a === -1 ? void 0 : a : a === -1 ? s : Math.min(s, a), c = t.slice(r, l);
      return An(c.includes("%25") ? c.replace(/%25/g, "%2525") : c);
    } else if (o === 63 || o === 35) break;
  }
  return t.slice(r, n);
}, "ze");
var Zt = /* @__PURE__ */ __name((e2) => {
  let t = ze(e2);
  return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, "Zt");
var S = /* @__PURE__ */ __name((e2, t, ...r) => (r.length && (t = S(t, ...r)), `${e2?.[0] === "/" ? "" : "/"}${e2}${t === "/" ? "" : `${e2?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), "S");
var ye = /* @__PURE__ */ __name((e2) => {
  if (e2.charCodeAt(e2.length - 1) !== 63 || !e2.includes(":")) return null;
  let t = e2.split("/"), r = [], n = "";
  return t.forEach((o) => {
    if (o !== "" && !/\:/.test(o)) n += "/" + o;
    else if (/\:/.test(o)) if (/\?/.test(o)) {
      r.length === 0 && n === "" ? r.push("/") : r.push(n);
      let s = o.replace("?", "");
      n += "/" + s, r.push(n);
    } else n += "/" + o;
  }), r.filter((o, s, a) => a.indexOf(o) === s);
}, "ye");
var Xe = /* @__PURE__ */ __name((e2) => /[%+]/.test(e2) ? (e2.indexOf("+") !== -1 && (e2 = e2.replace(/\+/g, " ")), e2.indexOf("%") !== -1 ? be(e2, He) : e2) : e2, "Xe");
var Wt = /* @__PURE__ */ __name((e2, t, r) => {
  let n;
  if (!r && t && !/[%+]/.test(t)) {
    let a = e2.indexOf("?", 8);
    if (a === -1) return;
    for (e2.startsWith(t, a + 1) || (a = e2.indexOf(`&${t}`, a + 1)); a !== -1; ) {
      let l = e2.charCodeAt(a + t.length + 1);
      if (l === 61) {
        let c = a + t.length + 2, i = e2.indexOf("&", c);
        return Xe(e2.slice(c, i === -1 ? void 0 : i));
      } else if (l == 38 || isNaN(l)) return "";
      a = e2.indexOf(`&${t}`, a + 1);
    }
    if (n = /[%+]/.test(e2), !n) return;
  }
  let o = {};
  n ??= /[%+]/.test(e2);
  let s = e2.indexOf("?", 8);
  for (; s !== -1; ) {
    let a = e2.indexOf("&", s + 1), l = e2.indexOf("=", s);
    l > a && a !== -1 && (l = -1);
    let c = e2.slice(s + 1, l === -1 ? a === -1 ? void 0 : a : l);
    if (n && (c = Xe(c)), s = a, c === "") continue;
    let i;
    l === -1 ? i = "" : (i = e2.slice(l + 1, a === -1 ? void 0 : a), n && (i = Xe(i))), r ? (o[c] && Array.isArray(o[c]) || (o[c] = []), o[c].push(i)) : o[c] ??= i;
  }
  return t ? o[t] : o;
}, "Wt");
var Mt = Wt;
var jt = /* @__PURE__ */ __name((e2, t) => Wt(e2, t, true), "jt");
var He = decodeURIComponent;
var Vt = /* @__PURE__ */ __name((e2) => be(e2, He), "Vt");
var ge = class {
  static {
    __name(this, "ge");
  }
  raw;
  #e;
  #t;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(e2, t = "/", r = [[]]) {
    this.raw = e2, this.path = t, this.#t = r, this.#e = {};
  }
  param(e2) {
    return e2 ? this.#r(e2) : this.#s();
  }
  #r(e2) {
    let t = this.#t[0][this.routeIndex][1][e2], r = this.#n(t);
    return r && /\%/.test(r) ? Vt(r) : r;
  }
  #s() {
    let e2 = {}, t = Object.keys(this.#t[0][this.routeIndex][1]);
    for (let r of t) {
      let n = this.#n(this.#t[0][this.routeIndex][1][r]);
      n !== void 0 && (e2[r] = /\%/.test(n) ? Vt(n) : n);
    }
    return e2;
  }
  #n(e2) {
    return this.#t[1] ? this.#t[1][e2] : e2;
  }
  query(e2) {
    return Mt(this.url, e2);
  }
  queries(e2) {
    return jt(this.url, e2);
  }
  header(e2) {
    if (e2) return this.raw.headers.get(e2) ?? void 0;
    let t = {};
    return this.raw.headers.forEach((r, n) => {
      t[n] = r;
    }), t;
  }
  async parseBody(e2) {
    return Tt(this, e2);
  }
  #o = /* @__PURE__ */ __name((e2) => {
    let { bodyCache: t, raw: r } = this, n = t[e2];
    if (n) return n;
    let o = Object.keys(t)[0];
    return o ? t[o].then((s) => (o === "json" && (s = JSON.stringify(s)), new Response(s)[e2]())) : t[e2] = r[e2]();
  }, "#o");
  json() {
    return this.#o("text").then((e2) => JSON.parse(e2));
  }
  text() {
    return this.#o("text");
  }
  arrayBuffer() {
    return this.#o("arrayBuffer");
  }
  bytes() {
    return this.#o("arrayBuffer").then((e2) => new Uint8Array(e2));
  }
  blob() {
    return this.#o("blob");
  }
  formData() {
    return this.#o("formData");
  }
  addValidatedData(e2, t) {
    this.#e[e2] = t;
  }
  valid(e2) {
    return this.#e[e2];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [Nt]() {
    return this.#t;
  }
  get matchedRoutes() {
    return this.#t[0].map(([[, e2]]) => e2);
  }
  get routePath() {
    return this.#t[0].map(([[, e2]]) => e2)[this.routeIndex].path;
  }
};
var Yt = { Stringify: 1, BeforeStream: 2, Stream: 3 };
var Un = /* @__PURE__ */ __name((e2, t) => {
  let r = new String(e2);
  return r.isEscaped = true, r.callbacks = t, r;
}, "Un");
var Je = /* @__PURE__ */ __name(async (e2, t, r, n, o) => {
  typeof e2 == "object" && !(e2 instanceof String) && (e2 instanceof Promise || (e2 = e2.toString()), e2 instanceof Promise && (e2 = await e2));
  let s = e2.callbacks;
  if (!s?.length) return Promise.resolve(e2);
  o ? o[0] += e2 : o = [e2];
  let a = Promise.all(s.map((l) => l({ phase: t, buffer: o, context: n }))).then((l) => Promise.all(l.filter(Boolean).map((c) => Je(c, t, false, n, o))).then(() => o[0]));
  return r ? Un(await a, s) : a;
}, "Je");
var Qn = "text/plain; charset=UTF-8";
var qe = /* @__PURE__ */ __name((e2, t) => ({ "Content-Type": e2, ...t }), "qe");
var K = /* @__PURE__ */ __name((e2, t) => new Response(e2, t), "K");
var Ke = class {
  static {
    __name(this, "Ke");
  }
  #e;
  #t;
  env = {};
  #r;
  finalized = false;
  error;
  #s;
  #n;
  #o;
  #f;
  #c;
  #u;
  #a;
  #d;
  #l;
  constructor(e2, t) {
    this.#e = e2, t && (this.#n = t.executionCtx, this.env = t.env, this.#u = t.notFoundHandler, this.#l = t.path, this.#d = t.matchResult);
  }
  get req() {
    return this.#t ??= new ge(this.#e, this.#l, this.#d), this.#t;
  }
  get event() {
    if (this.#n && "respondWith" in this.#n) return this.#n;
    throw Error("This context has no FetchEvent");
  }
  get executionCtx() {
    if (this.#n) return this.#n;
    throw Error("This context has no ExecutionContext");
  }
  get res() {
    return this.#o ||= K(null, { headers: this.#a ??= new Headers() });
  }
  set res(e2) {
    if (this.#o && e2) {
      e2 = K(e2.body, e2);
      for (let [t, r] of this.#o.headers.entries()) if (t !== "content-type") if (t === "set-cookie") {
        let n = this.#o.headers.getSetCookie();
        e2.headers.delete("set-cookie");
        for (let o of n) e2.headers.append("set-cookie", o);
      } else e2.headers.set(t, r);
    }
    this.#o = e2, this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...e2) => (this.#c ??= (t) => this.html(t), this.#c(...e2)), "render");
  setLayout = /* @__PURE__ */ __name((e2) => this.#f = e2, "setLayout");
  getLayout = /* @__PURE__ */ __name(() => this.#f, "getLayout");
  setRenderer = /* @__PURE__ */ __name((e2) => {
    this.#c = e2;
  }, "setRenderer");
  header = /* @__PURE__ */ __name((e2, t, r) => {
    this.finalized && (this.#o = K(this.#o.body, this.#o));
    let n = this.#o ? this.#o.headers : this.#a ??= new Headers();
    t === void 0 ? n.delete(e2) : r?.append ? n.append(e2, t) : n.set(e2, t);
  }, "header");
  status = /* @__PURE__ */ __name((e2) => {
    this.#s = e2;
  }, "status");
  set = /* @__PURE__ */ __name((e2, t) => {
    this.#r ??= /* @__PURE__ */ new Map(), this.#r.set(e2, t);
  }, "set");
  get = /* @__PURE__ */ __name((e2) => this.#r ? this.#r.get(e2) : void 0, "get");
  get var() {
    return this.#r ? Object.fromEntries(this.#r) : {};
  }
  #i(e2, t, r) {
    let n = this.#o ? new Headers(this.#o.headers) : this.#a ?? new Headers();
    if (typeof t == "object" && "headers" in t) {
      let s = t.headers instanceof Headers ? t.headers : new Headers(t.headers);
      for (let [a, l] of s) a.toLowerCase() === "set-cookie" ? n.append(a, l) : n.set(a, l);
    }
    if (r) for (let [s, a] of Object.entries(r)) if (typeof a == "string") n.set(s, a);
    else {
      n.delete(s);
      for (let l of a) n.append(s, l);
    }
    let o = typeof t == "number" ? t : t?.status ?? this.#s;
    return K(e2, { status: o, headers: n });
  }
  newResponse = /* @__PURE__ */ __name((...e2) => this.#i(...e2), "newResponse");
  body = /* @__PURE__ */ __name((e2, t, r) => this.#i(e2, t, r), "body");
  text = /* @__PURE__ */ __name((e2, t, r) => !this.#a && !this.#s && !t && !r && !this.finalized ? new Response(e2) : this.#i(e2, t, qe(Qn, r)), "text");
  json = /* @__PURE__ */ __name((e2, t, r) => this.#i(JSON.stringify(e2), t, qe("application/json", r)), "json");
  html = /* @__PURE__ */ __name((e2, t, r) => {
    let n = /* @__PURE__ */ __name((o) => this.#i(o, t, qe("text/html; charset=UTF-8", r)), "n");
    return typeof e2 == "object" ? Je(e2, Yt.Stringify, false, {}).then(n) : n(e2);
  }, "html");
  redirect = /* @__PURE__ */ __name((e2, t) => {
    let r = String(e2);
    return this.header("Location", /[^\x00-\xFF]/.test(r) ? encodeURI(r) : r), this.newResponse(null, t ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name(() => (this.#u ??= () => K(), this.#u(this)), "notFound");
};
var b = "ALL";
var Xt = "all";
var Pt = ["get", "post", "put", "delete", "options", "patch"];
var we = "Can not add a route since the matcher is already built.";
var xe = class extends Error {
  static {
    __name(this, "xe");
  }
};
var zt = "__COMPOSED_HANDLER";
var kn = /* @__PURE__ */ __name((e2) => e2.text("404 Not Found", 404), "kn");
var Ht = /* @__PURE__ */ __name((e2, t) => {
  if ("getResponse" in e2) {
    let r = e2.getResponse();
    return t.newResponse(r.body, r);
  }
  return console.error(e2), t.text("Internal Server Error", 500);
}, "Ht");
var Jt = class qt {
  static {
    __name(this, "qt");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #e = "/";
  routes = [];
  constructor(t = {}) {
    [...Pt, Xt].forEach((s) => {
      this[s] = (a, ...l) => (typeof a == "string" ? this.#e = a : this.#s(s, this.#e, a), l.forEach((c) => {
        this.#s(s, this.#e, c);
      }), this);
    }), this.on = (s, a, ...l) => {
      for (let c of [a].flat()) {
        this.#e = c;
        for (let i of [s].flat()) l.map((u) => {
          this.#s(i.toUpperCase(), this.#e, u);
        });
      }
      return this;
    }, this.use = (s, ...a) => (typeof s == "string" ? this.#e = s : (this.#e = "*", a.unshift(s)), a.forEach((l) => {
      this.#s(b, this.#e, l);
    }), this);
    let { strict: n, ...o } = t;
    Object.assign(this, o), this.getPath = n ?? true ? t.getPath ?? ze : Zt;
  }
  #t() {
    let t = new qt({ router: this.router, getPath: this.getPath });
    return t.errorHandler = this.errorHandler, t.#r = this.#r, t.routes = this.routes, t;
  }
  #r = kn;
  errorHandler = Ht;
  route(t, r) {
    let n = this.basePath(t);
    return r.routes.map((o) => {
      let s;
      r.errorHandler === Ht ? s = o.handler : (s = /* @__PURE__ */ __name(async (a, l) => (await Ye([], r.errorHandler)(a, () => o.handler(a, l))).res, "s"), s[zt] = o.handler), n.#s(o.method, o.path, s, o.basePath);
    }), this;
  }
  basePath(t) {
    let r = this.#t();
    return r._basePath = S(this._basePath, t), r;
  }
  onError = /* @__PURE__ */ __name((t) => (this.errorHandler = t, this), "onError");
  notFound = /* @__PURE__ */ __name((t) => (this.#r = t, this), "notFound");
  mount(t, r, n) {
    let o, s;
    n && (typeof n == "function" ? s = n : (s = n.optionHandler, n.replaceRequest === false ? o = /* @__PURE__ */ __name((c) => c, "o") : o = n.replaceRequest));
    let a = s ? (c) => {
      let i = s(c);
      return Array.isArray(i) ? i : [i];
    } : (c) => {
      let i;
      try {
        i = c.executionCtx;
      } catch {
      }
      return [c.env, i];
    };
    o ||= (() => {
      let c = S(this._basePath, t), i = c === "/" ? 0 : c.length;
      return (u) => {
        let f = new URL(u.url);
        return f.pathname = this.getPath(u).slice(i) || "/", new Request(f, u);
      };
    })();
    let l = /* @__PURE__ */ __name(async (c, i) => {
      let u = await r(o(c.req.raw), ...a(c));
      if (u) return u;
      await i();
    }, "l");
    return this.#s(b, S(t, "*"), l), this;
  }
  #s(t, r, n, o) {
    t = t.toUpperCase(), r = S(this._basePath, r);
    let s = { basePath: o !== void 0 ? S(this._basePath, o) : this._basePath, path: r, method: t, handler: n };
    this.router.add(t, r, [n, s]), this.routes.push(s);
  }
  #n(t, r) {
    if (t instanceof Error) return this.errorHandler(t, r);
    throw t;
  }
  #o(t, r, n, o) {
    if (o === "HEAD") return (async () => new Response(null, await this.#o(t, r, n, "GET")))();
    let s = this.getPath(t, { env: n }), a = this.router.match(o, s), l = new Ke(t, { path: s, matchResult: a, env: n, executionCtx: r, notFoundHandler: this.#r });
    if (a[0].length === 1) {
      let i;
      try {
        i = a[0][0][0][0](l, async () => {
          l.res = await this.#r(l);
        });
      } catch (u) {
        return this.#n(u, l);
      }
      return i instanceof Promise ? i.then((u) => u || (l.finalized ? l.res : this.#r(l))).catch((u) => this.#n(u, l)) : i ?? this.#r(l);
    }
    let c = Ye(a[0], this.errorHandler, this.#r);
    return (async () => {
      try {
        let i = await c(l);
        if (!i.finalized) throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        return i.res;
      } catch (i) {
        return this.#n(i, l);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((t, ...r) => this.#o(t, r[1], r[0], t.method), "fetch");
  request = /* @__PURE__ */ __name((t, r, n, o) => t instanceof Request ? this.fetch(r ? new Request(t, r) : t, n, o) : (t = t.toString(), this.fetch(new Request(/^https?:\/\//.test(t) ? t : `http://localhost${S("/", t)}`, r), n, o)), "request");
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (t) => {
      t.respondWith(this.#o(t.request, t, void 0, t.request.method));
    });
  }, "fire");
};
var Fe = [];
function et(e2, t) {
  let r = this.buildAllMatchers(), n = /* @__PURE__ */ __name(((o, s) => {
    let a = r[o] || r[b], l = a[2][s];
    if (l) return l;
    let c = s.match(a[0]);
    if (!c) return [[], Fe];
    let i = c.indexOf("", 1);
    return [a[1][i], c];
  }), "n");
  return this.match = n, n(e2, t);
}
__name(et, "et");
var Ie = "[^/]+";
var ee = ".*";
var te = "(?:|/.*)";
var N = /* @__PURE__ */ Symbol();
var Sn = new Set(".\\+*[^]$()");
function Rn(e2, t) {
  return e2.length === 1 ? t.length === 1 ? e2 < t ? -1 : 1 : -1 : t.length === 1 || e2 === ee || e2 === te ? 1 : t === ee || t === te ? -1 : e2 === Ie ? 1 : t === Ie ? -1 : e2.length === t.length ? e2 < t ? -1 : 1 : t.length - e2.length;
}
__name(Rn, "Rn");
var Kt = class tt {
  static {
    __name(this, "tt");
  }
  #e;
  #t;
  #r = /* @__PURE__ */ Object.create(null);
  insert(t, r, n, o, s) {
    if (t.length === 0) {
      if (this.#e !== void 0) throw N;
      if (s) return;
      this.#e = r;
      return;
    }
    let [a, ...l] = t, c = a === "*" ? l.length === 0 ? ["", "", ee] : ["", "", Ie] : a === "/*" ? ["", "", te] : a.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/), i;
    if (c) {
      let u = c[1], f = c[2] || Ie;
      if (u && c[2] && (f === ".*" || (f = f.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(f)))) throw N;
      if (i = this.#r[f], !i) {
        if (Object.keys(this.#r).some((p) => p !== ee && p !== te)) throw N;
        if (s) return;
        i = this.#r[f] = new tt(), u !== "" && (i.#t = o.varIndex++);
      }
      !s && u !== "" && n.push([u, i.#t]);
    } else if (i = this.#r[a], !i) {
      if (Object.keys(this.#r).some((u) => u.length > 1 && u !== ee && u !== te)) throw N;
      if (s) return;
      i = this.#r[a] = new tt();
    }
    i.insert(l, r, n, o, s);
  }
  buildRegExpStr() {
    let r = Object.keys(this.#r).sort(Rn).map((n) => {
      let o = this.#r[n];
      return (typeof o.#t == "number" ? `(${n})@${o.#t}` : Sn.has(n) ? `\\${n}` : n) + o.buildRegExpStr();
    });
    return typeof this.#e == "number" && r.unshift(`#${this.#e}`), r.length === 0 ? "" : r.length === 1 ? r[0] : "(?:" + r.join("|") + ")";
  }
};
var er = class {
  static {
    __name(this, "er");
  }
  #e = { varIndex: 0 };
  #t = new Kt();
  insert(e2, t, r) {
    let n = [], o = [];
    for (let a = 0; ; ) {
      let l = false;
      if (e2 = e2.replace(/\{[^}]+\}/g, (c) => {
        let i = `@\\${a}`;
        return o[a] = [i, c], a++, l = true, i;
      }), !l) break;
    }
    let s = e2.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let a = o.length - 1; a >= 0; a--) {
      let [l] = o[a];
      for (let c = s.length - 1; c >= 0; c--) if (s[c].indexOf(l) !== -1) {
        s[c] = s[c].replace(l, o[a][1]);
        break;
      }
    }
    return this.#t.insert(s, t, n, this.#e, r), n;
  }
  buildRegExp() {
    let e2 = this.#t.buildRegExpStr();
    if (e2 === "") return [/^$/, [], []];
    let t = 0, r = [], n = [];
    return e2 = e2.replace(/#(\d+)|@(\d+)|\.\*\$/g, (o, s, a) => s !== void 0 ? (r[++t] = Number(s), "$()") : (a !== void 0 && (n[Number(a)] = ++t), "")), [new RegExp(`^${e2}`), r, n];
  }
};
var $n = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var tr = /* @__PURE__ */ Object.create(null);
function rr(e2) {
  return tr[e2] ??= new RegExp(e2 === "*" ? "" : `^${e2.replace(/\/\*$|([.\\+*[^\]$()])/g, (t, r) => r ? `\\${r}` : "(?:|/.*)")}$`);
}
__name(rr, "rr");
function Ln() {
  tr = /* @__PURE__ */ Object.create(null);
}
__name(Ln, "Ln");
function Gn(e2) {
  let t = new er(), r = [];
  if (e2.length === 0) return $n;
  let n = e2.map((i) => [!/\*|\/:/.test(i[0]), ...i]).sort(([i, u], [f, p]) => i ? 1 : f ? -1 : u.length - p.length), o = /* @__PURE__ */ Object.create(null);
  for (let i = 0, u = -1, f = n.length; i < f; i++) {
    let [p, d, _] = n[i];
    p ? o[d] = [_.map(([v]) => [v, /* @__PURE__ */ Object.create(null)]), Fe] : u++;
    let y;
    try {
      y = t.insert(d, u, p);
    } catch (v) {
      throw v === N ? new xe(d) : v;
    }
    p || (r[u] = _.map(([v, m]) => {
      let h = /* @__PURE__ */ Object.create(null);
      for (m -= 1; m >= 0; m--) {
        let [x, k] = y[m];
        h[x] = k;
      }
      return [v, h];
    }));
  }
  let [s, a, l] = t.buildRegExp();
  for (let i = 0, u = r.length; i < u; i++) for (let f = 0, p = r[i].length; f < p; f++) {
    let d = r[i][f]?.[1];
    if (!d) continue;
    let _ = Object.keys(d);
    for (let y = 0, v = _.length; y < v; y++) d[_[y]] = l[d[_[y]]];
  }
  let c = [];
  for (let i in a) c[i] = r[a[i]];
  return [s, c, o];
}
__name(Gn, "Gn");
function j(e2, t) {
  if (e2) {
    for (let r of Object.keys(e2).sort((n, o) => o.length - n.length)) if (rr(r).test(t)) return [...e2[r]];
  }
}
__name(j, "j");
var Ce = class {
  static {
    __name(this, "Ce");
  }
  name = "RegExpRouter";
  #e;
  #t;
  constructor() {
    this.#e = { [b]: /* @__PURE__ */ Object.create(null) }, this.#t = { [b]: /* @__PURE__ */ Object.create(null) };
  }
  add(e2, t, r) {
    let n = this.#e, o = this.#t;
    if (!n || !o) throw new Error(we);
    n[e2] || [n, o].forEach((l) => {
      l[e2] = /* @__PURE__ */ Object.create(null), Object.keys(l[b]).forEach((c) => {
        l[e2][c] = [...l[b][c]];
      });
    }), t === "/*" && (t = "*");
    let s = (t.match(/\/:/g) || []).length;
    if (/\*$/.test(t)) {
      let l = rr(t);
      e2 === b ? Object.keys(n).forEach((c) => {
        n[c][t] ||= j(n[c], t) || j(n[b], t) || [];
      }) : n[e2][t] ||= j(n[e2], t) || j(n[b], t) || [], Object.keys(n).forEach((c) => {
        (e2 === b || e2 === c) && Object.keys(n[c]).forEach((i) => {
          l.test(i) && n[c][i].push([r, s]);
        });
      }), Object.keys(o).forEach((c) => {
        (e2 === b || e2 === c) && Object.keys(o[c]).forEach((i) => l.test(i) && o[c][i].push([r, s]));
      });
      return;
    }
    let a = ye(t) || [t];
    for (let l = 0, c = a.length; l < c; l++) {
      let i = a[l];
      Object.keys(o).forEach((u) => {
        (e2 === b || e2 === u) && (o[u][i] ||= [...j(n[u], i) || j(n[b], i) || []], o[u][i].push([r, s - c + l + 1]));
      });
    }
  }
  match = et;
  buildAllMatchers() {
    let e2 = /* @__PURE__ */ Object.create(null);
    return Object.keys(this.#t).concat(Object.keys(this.#e)).forEach((t) => {
      e2[t] ||= this.#r(t);
    }), this.#e = this.#t = void 0, Ln(), e2;
  }
  #r(e2) {
    let t = [], r = e2 === b;
    return [this.#e, this.#t].forEach((n) => {
      let o = n[e2] ? Object.keys(n[e2]).map((s) => [s, n[e2][s]]) : [];
      o.length !== 0 ? (r ||= true, t.push(...o)) : e2 !== b && t.push(...Object.keys(n[b]).map((s) => [s, n[b][s]]));
    }), r ? Gn(t) : null;
  }
};
var rt = class {
  static {
    __name(this, "rt");
  }
  name = "SmartRouter";
  #e = [];
  #t = [];
  constructor(e2) {
    this.#e = e2.routers;
  }
  add(e2, t, r) {
    if (!this.#t) throw new Error(we);
    this.#t.push([e2, t, r]);
  }
  match(e2, t) {
    if (!this.#t) throw new Error("Fatal error");
    let r = this.#e, n = this.#t, o = r.length, s = 0, a;
    for (; s < o; s++) {
      let l = r[s];
      try {
        for (let c = 0, i = n.length; c < i; c++) l.add(...n[c]);
        a = l.match(e2, t);
      } catch (c) {
        if (c instanceof xe) continue;
        throw c;
      }
      this.match = l.match.bind(l), this.#e = [l], this.#t = void 0;
      break;
    }
    if (s === o) throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, a;
  }
  get activeRouter() {
    if (this.#t || this.#e.length !== 1) throw new Error("No active router has been determined yet.");
    return this.#e[0];
  }
};
var re = /* @__PURE__ */ Object.create(null);
var Nn = /* @__PURE__ */ __name((e2) => {
  for (let t in e2) return true;
  return false;
}, "Nn");
var nr = class or {
  static {
    __name(this, "or");
  }
  #e;
  #t;
  #r;
  #s = 0;
  #n = re;
  constructor(t, r, n) {
    if (this.#t = n || /* @__PURE__ */ Object.create(null), this.#e = [], t && r) {
      let o = /* @__PURE__ */ Object.create(null);
      o[t] = { handler: r, possibleKeys: [], score: 0 }, this.#e = [o];
    }
    this.#r = [];
  }
  insert(t, r, n) {
    this.#s = ++this.#s;
    let o = this, s = Ot(r), a = [];
    for (let l = 0, c = s.length; l < c; l++) {
      let i = s[l], u = s[l + 1], f = Dt(i, u), p = Array.isArray(f) ? f[0] : i;
      if (p in o.#t) {
        o = o.#t[p], f && a.push(f[1]);
        continue;
      }
      o.#t[p] = new or(), f && (o.#r.push(f), a.push(f[1])), o = o.#t[p];
    }
    return o.#e.push({ [t]: { handler: n, possibleKeys: a.filter((l, c, i) => i.indexOf(l) === c), score: this.#s } }), o;
  }
  #o(t, r, n, o, s) {
    for (let a = 0, l = r.#e.length; a < l; a++) {
      let c = r.#e[a], i = c[n] || c[b], u = {};
      if (i !== void 0 && (i.params = /* @__PURE__ */ Object.create(null), t.push(i), o !== re || s && s !== re)) for (let f = 0, p = i.possibleKeys.length; f < p; f++) {
        let d = i.possibleKeys[f], _ = u[i.score];
        i.params[d] = s?.[d] && !_ ? s[d] : o[d] ?? s?.[d], u[i.score] = true;
      }
    }
  }
  search(t, r) {
    let n = [];
    this.#n = re;
    let s = [this], a = Pe(r), l = [], c = a.length, i = null;
    for (let u = 0; u < c; u++) {
      let f = a[u], p = u === c - 1, d = [];
      for (let y = 0, v = s.length; y < v; y++) {
        let m = s[y], h = m.#t[f];
        h && (h.#n = m.#n, p ? (h.#t["*"] && this.#o(n, h.#t["*"], t, m.#n), this.#o(n, h, t, m.#n)) : d.push(h));
        for (let x = 0, k = m.#r.length; x < k; x++) {
          let he = m.#r[x], E = m.#n === re ? {} : { ...m.#n };
          if (he === "*") {
            let M = m.#t["*"];
            M && (this.#o(n, M, t, m.#n), M.#n = E, d.push(M));
            continue;
          }
          let [je, ve, G] = he;
          if (!f && !(G instanceof RegExp)) continue;
          let B = m.#t[je];
          if (G instanceof RegExp) {
            if (i === null) {
              i = new Array(c);
              let me = r[0] === "/" ? 1 : 0;
              for (let q = 0; q < c; q++) i[q] = me, me += a[q].length + 1;
            }
            let M = r.substring(i[u]), Ve = G.exec(M);
            if (Ve) {
              if (E[ve] = Ve[0], this.#o(n, B, t, m.#n, E), Nn(B.#t)) {
                B.#n = E;
                let me = Ve[0].match(/\//)?.length ?? 0;
                (l[me] ||= []).push(B);
              }
              continue;
            }
          }
          (G === true || G.test(f)) && (E[ve] = f, p ? (this.#o(n, B, t, E, m.#n), B.#t["*"] && this.#o(n, B.#t["*"], t, E, m.#n)) : (B.#n = E, d.push(B)));
        }
      }
      let _ = l.shift();
      s = _ ? d.concat(_) : d;
    }
    return n.length > 1 && n.sort((u, f) => u.score - f.score), [n.map(({ handler: u, params: f }) => [u, f])];
  }
};
var nt = class {
  static {
    __name(this, "nt");
  }
  name = "TrieRouter";
  #e;
  constructor() {
    this.#e = new nr();
  }
  add(e2, t, r) {
    let n = ye(t);
    if (n) {
      for (let o = 0, s = n.length; o < s; o++) this.#e.insert(e2, n[o], r);
      return;
    }
    this.#e.insert(e2, t, r);
  }
  match(e2, t) {
    return this.#e.search(e2, t);
  }
};
var ot = class extends Jt {
  static {
    __name(this, "ot");
  }
  constructor(e2 = {}) {
    super(e2), this.router = e2.router ?? new rt({ routers: [new Ce(), new nt()] });
  }
};
var On = /[&"<]/g;
var Dn = /[&<]/g;
function F(e2, t) {
  let r = String(e2 ?? ""), n = t ? On : Dn;
  n.lastIndex = 0;
  let o = "", s = 0;
  for (; n.test(r); ) {
    let a = n.lastIndex - 1, l = r[a];
    o += r.substring(s, a) + (l === "&" ? "&amp;" : l === '"' ? "&quot;" : "&lt;"), s = a + 1;
  }
  return o + r.substring(s);
}
__name(F, "F");
function sr(e2) {
  var t, r, n = "";
  if (typeof e2 == "string" || typeof e2 == "number") n += e2;
  else if (typeof e2 == "object") if (Array.isArray(e2)) {
    var o = e2.length;
    for (t = 0; t < o; t++) e2[t] && (r = sr(e2[t])) && (n && (n += " "), n += r);
  } else for (r in e2) e2[r] && (n && (n += " "), n += r);
  return n;
}
__name(sr, "sr");
function ir() {
  for (var e2, t, r = 0, n = "", o = arguments.length; r < o; r++) (e2 = arguments[r]) && (t = sr(e2)) && (n && (n += " "), n += t);
  return n;
}
__name(ir, "ir");
var Zn = Array.prototype.indexOf;
var st = Array.prototype.includes;
var ar = Object.prototype;
var Wn = Array.prototype;
var Ee = Object.prototype.hasOwnProperty;
var C = /* @__PURE__ */ __name(() => {
}, "C");
function Ae() {
  var e2, t, r = new Promise((n, o) => {
    e2 = n, t = o;
  });
  return { promise: r, resolve: e2, reject: t };
}
__name(Ae, "Ae");
var lr = { translate: /* @__PURE__ */ new Map([[true, "yes"], [false, "no"]]) };
function Ue(e2, t, r = false) {
  if (e2 === "hidden" && t !== "until-found" && (r = true), t == null || !t && r) return "";
  let n = Ee.call(lr, e2) && lr[e2].get(t) || t, o = r ? '=""' : `="${F(n, true)}"`;
  return ` ${e2}${o}`;
}
__name(Ue, "Ue");
function fr(e2) {
  return typeof e2 == "object" ? ir(e2) : e2 ?? "";
}
__name(fr, "fr");
var cr = [...` 	
\r\f\xA0\v\uFEFF`];
function at(e2, t, r) {
  var n = e2 == null ? "" : "" + e2;
  if (t && (n = n ? n + " " + t : t), r) {
    for (var o of Object.keys(r)) if (r[o]) n = n ? n + " " + o : o;
    else if (n.length) for (var s = o.length, a = 0; (a = n.indexOf(o, a)) >= 0; ) {
      var l = a + s;
      (a === 0 || cr.includes(n[a - 1])) && (l === n.length || cr.includes(n[l])) ? n = (a === 0 ? "" : n.substring(0, a)) + n.substring(l + 1) : a = l;
    }
  }
  return n === "" ? null : n;
}
__name(at, "at");
function ur(e2, t = false) {
  var r = t ? " !important;" : ";", n = "";
  for (var o of Object.keys(e2)) {
    var s = e2[o];
    s != null && s !== "" && (n += " " + o + ": " + s + r);
  }
  return n;
}
__name(ur, "ur");
function it(e2) {
  return e2[0] !== "-" || e2[1] !== "-" ? e2.toLowerCase() : e2;
}
__name(it, "it");
function dr(e2, t) {
  if (t) {
    var r = "", n, o;
    if (Array.isArray(t) ? (n = t[0], o = t[1]) : n = t, e2) {
      e2 = String(e2).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var s = false, a = 0, l = false, c = [];
      n && c.push(...Object.keys(n).map(it)), o && c.push(...Object.keys(o).map(it));
      var i = 0, u = -1;
      let y = e2.length;
      for (var f = 0; f < y; f++) {
        var p = e2[f];
        if (l ? p === "/" && e2[f - 1] === "*" && (l = false) : s ? s === p && (s = false) : p === "/" && e2[f + 1] === "*" ? l = true : p === '"' || p === "'" ? s = p : p === "(" ? a++ : p === ")" && a--, !l && s === false && a === 0) {
          if (p === ":" && u === -1) u = f;
          else if (p === ";" || f === y - 1) {
            if (u !== -1) {
              var d = it(e2.substring(i, u).trim());
              if (!c.includes(d)) {
                p !== ";" && f++;
                var _ = e2.substring(i, f).trim();
                r += " " + _ + ";";
              }
            }
            i = f + 1, u = -1;
          }
        }
      }
    }
    return n && (r += ur(n)), o && (r += ur(o, true)), r = r.trim(), r === "" ? null : r;
  }
  return e2 == null ? null : String(e2);
}
__name(dr, "dr");
var lt = typeof window < "u";
var pr = "development";
var g = pr && !pr.toLowerCase().startsWith("prod");
var Y = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
var Vi = !!globalThis.document?.contentType && globalThis.document.contentType.includes("xml");
var O = false;
var le = `<!--${"["}-->`;
var W = `<!--${"]"}-->`;
var Zr = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "indeterminate", "inert", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected", "webkitdirectory", "defer", "disablepictureinpicture", "disableremoteplayback"];
function Wr(e2) {
  return Zr.includes(e2);
}
__name(Wr, "Wr");
var Rd = [...Zr, "formNoValidate", "isMap", "noModule", "playsInline", "readOnly", "value", "volume", "defaultValue", "defaultChecked", "srcObject", "noValidate", "allowFullscreen", "disablePictureInPicture", "disableRemotePlayback"];
var Ao = ["$state", "$state.raw", "$derived", "$derived.by"];
var $d = [...Ao, "$state.eager", "$state.snapshot", "$props", "$props.id", "$bindable", "$effect", "$effect.pre", "$effect.tracking", "$effect.root", "$effect.pending", "$inspect", "$inspect().with", "$inspect.trace", "$host"];
var Mr = null;
function It() {
  Mr?.abort(Y), Mr = null;
}
__name(It, "It");
function jr() {
  let e2 = new Error("async_local_storage_unavailable\nThe node API `AsyncLocalStorage` is not available, but is required to use async server rendering.\nhttps://svelte.dev/e/async_local_storage_unavailable");
  throw e2.name = "Svelte error", e2;
}
__name(jr, "jr");
function Oe() {
  let e2 = new Error(`await_invalid
Encountered asynchronous work while rendering synchronously.
https://svelte.dev/e/await_invalid`);
  throw e2.name = "Svelte error", e2;
}
__name(Oe, "Oe");
function Vr() {
  let e2 = new Error("html_deprecated\nThe `html` property of server render results has been deprecated. Use `body` instead.\nhttps://svelte.dev/e/html_deprecated");
  throw e2.name = "Svelte error", e2;
}
__name(Vr, "Vr");
function Yr() {
  let e2 = new Error("invalid_csp\n`csp.nonce` was set while `csp.hash` was `true`. These options cannot be used simultaneously.\nhttps://svelte.dev/e/invalid_csp");
  throw e2.name = "Svelte error", e2;
}
__name(Yr, "Yr");
function Xr() {
  let e2 = new Error("invalid_id_prefix\nThe `idPrefix` option cannot include `--`.\nhttps://svelte.dev/e/invalid_id_prefix");
  throw e2.name = "Svelte error", e2;
}
__name(Xr, "Xr");
function Pr() {
  let e2 = new Error("server_context_required\nCould not resolve `render` context.\nhttps://svelte.dev/e/server_context_required");
  throw e2.name = "Svelte error", e2;
}
__name(Pr, "Pr");
var w = null;
function I(e2) {
  w = e2;
}
__name(I, "I");
function zr(e2) {
  w = { p: w, c: null, r: null }, g && (w.function = e2, w.element = w.p?.element);
}
__name(zr, "zr");
function Hr() {
  w = w.p;
}
__name(Hr, "Hr");
var ko = "font-weight: bold";
var So = "font-weight: normal";
function Jr(e2, t) {
  g ? console.warn(`%c[svelte] unresolved_hydratable
%cA \`hydratable\` value with key \`${e2}\` was created, but at least part of it was not used during the render.

The \`hydratable\` was initialized in:
${t}
https://svelte.dev/e/unresolved_hydratable`, ko, So) : console.warn("https://svelte.dev/e/unresolved_hydratable");
}
__name(Jr, "Jr");
var qr = null;
var De = null;
function en() {
  let e2 = De ?? Ze?.getStore();
  return e2 || Pr(), e2;
}
__name(en, "en");
async function tn(e2) {
  if (De = { hydratable: { lookup: /* @__PURE__ */ new Map(), comparisons: [], unresolved_promises: /* @__PURE__ */ new Map() } }, $o()) {
    let { promise: t, resolve: r } = Ae(), n = qr;
    return qr = t, await n, e2().finally(r);
  }
  try {
    return Ze === null && jr(), Ze.run(De, e2);
  } finally {
    De = null;
  }
}
__name(tn, "tn");
var Ze = null;
var Kr = null;
function rn() {
  return Kr ??= import("node:async_hooks").then((e2) => {
    Ze = new e2.AsyncLocalStorage();
  }).then(C, C), Kr;
}
__name(rn, "rn");
function $o() {
  return !!globalThis.process?.versions?.webcontainer;
}
__name($o, "$o");
var nn;
var on;
var Lo = /* @__PURE__ */ __name((e2) => import(e2), "Lo");
async function sn(e2) {
  nn ??= new TextEncoder(), on ??= globalThis.crypto?.subtle?.digest ? globalThis.crypto : (await Lo("node:crypto")).webcrypto;
  let t = await on.subtle.digest("SHA-256", nn.encode(e2));
  return Go(t);
}
__name(sn, "sn");
function Go(e2) {
  if (!lt && globalThis.Buffer) return globalThis.Buffer.from(e2).toString("base64");
  let t = "";
  for (let r = 0; r < e2.length; r++) t += String.fromCharCode(e2[r]);
  return btoa(t);
}
__name(Go, "Go");
var an = { "<": "\\u003C", "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\u2028": "\\u2028", "\u2029": "\\u2029" };
var L = class extends Error {
  static {
    __name(this, "L");
  }
  constructor(t, r, n, o) {
    super(t), this.name = "DevalueError", this.path = r.join(""), this.value = n, this.root = o;
  }
};
function ue(e2) {
  return e2 === null || typeof e2 != "object" && typeof e2 != "function";
}
__name(ue, "ue");
var No = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function ln(e2) {
  let t = Object.getPrototypeOf(e2);
  return t === Object.prototype || t === null || Object.getPrototypeOf(t) === null || Object.getOwnPropertyNames(t).sort().join("\0") === No;
}
__name(ln, "ln");
function We(e2) {
  return Object.prototype.toString.call(e2).slice(8, -1);
}
__name(We, "We");
function To(e2) {
  switch (e2) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return e2 < " " ? `\\u${e2.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
__name(To, "To");
function A(e2) {
  let t = "", r = 0, n = e2.length;
  for (let o = 0; o < n; o += 1) {
    let s = e2[o], a = To(s);
    a && (t += e2.slice(r, o) + a, r = o + 1);
  }
  return `"${r === 0 ? e2 : t + e2.slice(r)}"`;
}
__name(A, "A");
function cn(e2) {
  return Object.getOwnPropertySymbols(e2).filter((t) => Object.getOwnPropertyDescriptor(e2, t).enumerable);
}
__name(cn, "cn");
var Oo = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function un(e2) {
  return Oo.test(e2) ? "." + e2 : "[" + JSON.stringify(e2) + "]";
}
__name(un, "un");
function Do(e2) {
  return !(!Number.isInteger(e2) || e2 < 0 || e2 > 4294967294);
}
__name(Do, "Do");
function Zo(e2) {
  if (e2.length === 0 || e2.length > 1 && e2.charCodeAt(0) === 48) return false;
  for (let t = 0; t < e2.length; t++) {
    let r = e2.charCodeAt(t);
    if (r < 48 || r > 57) return false;
  }
  return Do(+e2);
}
__name(Zo, "Zo");
function fn(e2) {
  let t = Object.keys(e2);
  for (var r = t.length - 1; r >= 0 && !Zo(t[r]); r--) ;
  return t.length = r + 1, t;
}
__name(fn, "fn");
var Ct = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var Wo = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var Mo = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
function Me(e2, t) {
  let r = /* @__PURE__ */ new Map(), n = [], o = /* @__PURE__ */ new Map();
  function s(i) {
    if (ue(i)) {
      if (typeof i == "symbol") throw new L("Cannot stringify a Symbol primitive", n, i, e2);
    } else {
      if (r.has(i)) {
        r.set(i, r.get(i) + 1);
        return;
      }
      if (r.set(i, 1), t) {
        let f = t(i, (p) => Me(p, t));
        if (typeof f == "string") {
          o.set(i, f);
          return;
        }
      }
      if (typeof i == "function") throw new L("Cannot stringify a function", n, i, e2);
      switch (We(i)) {
        case "Number":
        case "BigInt":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
        case "URL":
        case "URLSearchParams":
          return;
        case "Array":
          i.forEach((f, p) => {
            n.push(`[${p}]`), s(f), n.pop();
          });
          break;
        case "Set":
          Array.from(i).forEach(s);
          break;
        case "Map":
          for (let [f, p] of i) n.push(`.get(${ue(f) ? Bt(f) : "..."})`), s(p), n.pop();
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
        case "DataView":
          s(i.buffer);
          return;
        case "ArrayBuffer":
          return;
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          return;
        default:
          if (!ln(i)) throw new L("Cannot stringify arbitrary non-POJOs", n, i, e2);
          if (cn(i).length > 0) throw new L("Cannot stringify POJOs with symbolic keys", n, i, e2);
          for (let f of Object.keys(i)) {
            if (f === "__proto__") throw new L("Cannot stringify objects with __proto__ keys", n, i, e2);
            n.push(un(f)), s(i[f]), n.pop();
          }
      }
    }
  }
  __name(s, "s");
  s(e2);
  let a = /* @__PURE__ */ new Map();
  Array.from(r).filter((i) => i[1] > 1).sort((i, u) => u[1] - i[1]).forEach((i, u) => {
    a.set(i[0], jo(u));
  });
  function l(i) {
    if (a.has(i)) return a.get(i);
    if (ue(i)) return Bt(i);
    if (o.has(i)) return o.get(i);
    let u = We(i);
    switch (u) {
      case "Number":
      case "String":
      case "Boolean":
      case "BigInt":
        return `Object(${l(i.valueOf())})`;
      case "RegExp":
        let { source: f, flags: p } = i;
        return p ? `new RegExp(${A(f)},"${p}")` : `new RegExp(${A(f)})`;
      case "Date":
        return `new Date(${i.getTime()})`;
      case "URL":
        return `new URL(${A(i.toString())})`;
      case "URLSearchParams":
        return `new URLSearchParams(${A(i.toString())})`;
      case "Array": {
        let v = false, m = "[";
        for (let x = 0; x < i.length; x += 1) if (x > 0 && (m += ","), Object.hasOwn(i, x)) m += l(i[x]);
        else if (!v) {
          let k = fn(i), he = k.length, E = String(i.length).length, je = i.length + 2, ve = 25 + E + he * (E + 2);
          if (je > ve) {
            let G = k.map((B) => `${B}:${l(i[B])}`).join(",");
            return `Object.assign(Array(${i.length}),{${G}})`;
          }
          v = true, x -= 1;
        }
        let h = i.length === 0 || i.length - 1 in i ? "" : ",";
        return m + h + "]";
      }
      case "Set":
      case "Map":
        return `new ${u}([${Array.from(i).map(l).join(",")}])`;
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Float16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array": {
        let v = `new ${u}`;
        if (a.has(i.buffer)) v += `(${l(i.buffer)})`;
        else {
          let m = new i.constructor(i.buffer);
          v += `([${m}])`;
        }
        if (i.byteLength !== i.buffer.byteLength) {
          let m = i.byteOffset / i.BYTES_PER_ELEMENT, h = m + i.length;
          v += `.subarray(${m},${h})`;
        }
        return v;
      }
      case "DataView": {
        let v = "new DataView";
        return a.has(i.buffer) ? v += `(${l(i.buffer)}` : v += `(new Uint8Array([${new Uint8Array(i.buffer)}]).buffer`, i.byteLength !== i.buffer.byteLength && (v += `,${i.startOffset},${i.byteLength}`), v + ")";
      }
      case "ArrayBuffer":
        return `new Uint8Array([${new Uint8Array(i).toString()}]).buffer`;
      case "Temporal.Duration":
      case "Temporal.Instant":
      case "Temporal.PlainDate":
      case "Temporal.PlainTime":
      case "Temporal.PlainDateTime":
      case "Temporal.PlainMonthDay":
      case "Temporal.PlainYearMonth":
      case "Temporal.ZonedDateTime":
        return `${u}.from(${A(i.toString())})`;
      default:
        let d = Object.keys(i), _ = d.map((v) => `${Yo(v)}:${l(i[v])}`).join(",");
        return Object.getPrototypeOf(i) === null ? d.length > 0 ? `{${_},__proto__:null}` : "{__proto__:null}" : `{${_}}`;
    }
  }
  __name(l, "l");
  let c = l(e2);
  if (a.size) {
    let i = [], u = [], f = [];
    return a.forEach((p, d) => {
      if (i.push(p), o.has(d)) {
        f.push(o.get(d));
        return;
      }
      if (ue(d)) {
        f.push(Bt(d));
        return;
      }
      let _ = We(d);
      switch (_) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          f.push(`Object(${l(d.valueOf())})`);
          break;
        case "RegExp":
          let { source: y, flags: v } = d, m = v ? `new RegExp(${A(y)},"${v}")` : `new RegExp(${A(y)})`;
          f.push(m);
          break;
        case "Date":
          f.push(`new Date(${d.getTime()})`);
          break;
        case "URL":
          f.push(`new URL(${A(d.toString())})`);
          break;
        case "URLSearchParams":
          f.push(`new URLSearchParams(${A(d.toString())})`);
          break;
        case "Array":
          f.push(`Array(${d.length})`), d.forEach((h, x) => {
            u.push(`${p}[${x}]=${l(h)}`);
          });
          break;
        case "Set":
          f.push("new Set"), u.push(`${p}.${Array.from(d).map((h) => `add(${l(h)})`).join(".")}`);
          break;
        case "Map":
          f.push("new Map"), u.push(`${p}.${Array.from(d).map(([h, x]) => `set(${l(h)}, ${l(x)})`).join(".")}`);
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          let h = `new ${_}`;
          if (a.has(d.buffer)) h += `(${l(d.buffer)})`;
          else {
            let x = new d.constructor(d.buffer);
            h += `([${x}])`;
          }
          if (d.byteLength !== d.buffer.byteLength) {
            let x = d.byteOffset / d.BYTES_PER_ELEMENT, k = x + d.length;
            h += `.subarray(${x},${k})`;
          }
          f.push("{}"), u.push(`${p}=${h}`);
          break;
        }
        case "DataView": {
          let h = "new DataView";
          a.has(d.buffer) ? h += `(${l(d.buffer)}` : h += `(new Uint8Array([${new Uint8Array(d.buffer)}]).buffer`, d.byteLength !== d.buffer.byteLength && (h += `,${d.byteOffset},${d.byteLength}`), h += ")", f.push("{}"), u.push(`${p}=${h}`);
          break;
        }
        case "ArrayBuffer":
          f.push(`new Uint8Array([${new Uint8Array(d)}]).buffer`);
          break;
        default:
          f.push(Object.getPrototypeOf(d) === null ? "Object.create(null)" : "{}"), Object.keys(d).forEach((h) => {
            u.push(`${p}${Xo(h)}=${l(d[h])}`);
          });
      }
    }), u.push(`return ${c}`), `(function(${i.join(",")}){${u.join(";")}}(${f.join(",")}))`;
  } else return c;
}
__name(Me, "Me");
function jo(e2) {
  let t = "";
  do
    t = Ct[e2 % Ct.length] + t, e2 = ~~(e2 / Ct.length) - 1;
  while (e2 >= 0);
  return Mo.test(t) ? `${t}0` : t;
}
__name(jo, "jo");
function Vo(e2) {
  return an[e2] || e2;
}
__name(Vo, "Vo");
function dn(e2) {
  return e2.replace(Wo, Vo);
}
__name(dn, "dn");
function Yo(e2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(e2) ? e2 : dn(JSON.stringify(e2));
}
__name(Yo, "Yo");
function Xo(e2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(e2) ? `.${e2}` : `[${dn(JSON.stringify(e2))}]`;
}
__name(Xo, "Xo");
function Bt(e2) {
  let t = typeof e2;
  if (t === "string") return A(e2);
  if (e2 === void 0) return "void 0";
  if (e2 === 0 && 1 / e2 < 0) return "-0";
  let r = String(e2);
  return t === "number" ? r.replace(/^(-)?0\./, "$1.") : t === "bigint" ? e2 + "n" : r;
}
__name(Bt, "Bt");
var fe = class e {
  static {
    __name(this, "e");
  }
  #e = [];
  #t = void 0;
  #r = false;
  #s = null;
  type;
  #n;
  promise = void 0;
  global;
  local;
  constructor(t, r) {
    this.#n = r, this.global = t, this.local = r ? { ...r.local } : { select_value: void 0 }, this.type = r ? r.type : "body";
  }
  head(t) {
    let r = new e(this.global, this);
    r.type = "head", this.#e.push(r), r.child(t);
  }
  async_block(t, r) {
    this.#e.push(le), this.async(t, r), this.#e.push(W);
  }
  async(t, r) {
    let n = r;
    if (t.length > 0) {
      let o = w;
      n = /* @__PURE__ */ __name((s) => Promise.all(t).then(() => {
        let a = w;
        try {
          return I(o), r(s);
        } finally {
          I(a);
        }
      }), "n");
    }
    this.child(n);
  }
  run(t) {
    let r = w, n = Promise.resolve(t[0]()), o = [n];
    for (let s of t.slice(1)) n = n.then(() => {
      let a = w;
      I(r);
      try {
        return s();
      } finally {
        I(a);
      }
    }), o.push(n);
    return n.catch(C), this.promise = n, o;
  }
  child_block(t) {
    this.#e.push(le), this.child(t), this.#e.push(W);
  }
  child(t) {
    let r = new e(this.global, this);
    this.#e.push(r);
    let n = w;
    I({ ...w, p: n, c: null, r });
    let o = t(r);
    return I(n), o instanceof Promise && (o.catch(C), o.finally(() => I(null)).catch(C), r.global.mode === "sync" && Oe(), r.promise = o), r;
  }
  boundary(t, r) {
    let n = new e(this.global, this);
    this.#e.push(n);
    let o = w;
    t.failed && (n.#s = { failed: t.failed, transformError: this.global.transformError, context: o }), I({ ...w, p: o, c: null, r: n });
    try {
      let s = r(n);
      I(o), s instanceof Promise && (n.global.mode === "sync" && Oe(), s.catch(C), n.promise = s);
    } catch (s) {
      I(o);
      let a = t.failed;
      if (!a) throw s;
      let l = this.global.transformError(s);
      n.#e.length = 0, n.#s = null, l instanceof Promise ? (this.global.mode === "sync" && Oe(), n.promise = l.then((c) => {
        I(o), n.#e.push(e.#o(c)), a(n, c, C), n.#e.push(W);
      }), n.promise.catch(C)) : (n.#e.push(e.#o(l)), a(n, l, C), n.#e.push(W));
    }
  }
  component(t, r) {
    zr(r);
    let n = this.child(t);
    n.#r = true, Hr();
  }
  select(t, r, n, o, s, a, l) {
    let { value: c, ...i } = t;
    this.push(`<select${At(i, n, o, s, a)}>`), this.child((u) => {
      u.local.select_value = c, r(u);
    }), this.push(`${l ? "<!>" : ""}</select>`);
  }
  option(t, r, n, o, s, a, l) {
    this.#e.push(`<option${At(t, n, o, s, a)}`);
    let c = /* @__PURE__ */ __name((i, u, { head: f, body: p }) => {
      Ee.call(t, "value") && (u = t.value), u === this.local.select_value && i.#e.push(' selected=""'), i.#e.push(`>${p}${l ? "<!>" : ""}</option>`), f && i.head((d) => d.push(f));
    }, "c");
    typeof r == "function" ? this.child((i) => {
      let u = new e(this.global, this);
      if (r(u), this.global.mode === "async") return u.#i().then((f) => {
        c(i, f.body.replaceAll("<!---->", ""), f);
      });
      {
        let f = u.#l();
        c(i, f.body.replaceAll("<!---->", ""), f);
      }
    }) : c(this, r, { body: F(r) });
  }
  title(t) {
    let r = this.get_path(), n = /* @__PURE__ */ __name((o) => {
      this.global.set_title(o, r);
    }, "n");
    this.child((o) => {
      let s = new e(o.global, o);
      if (t(s), o.global.mode === "async") return s.#i().then((a) => {
        n(a.head);
      });
      {
        let a = s.#l();
        n(a.head);
      }
    });
  }
  push(t) {
    typeof t == "function" ? this.child(async (r) => r.push(await t())) : this.#e.push(t);
  }
  on_destroy(t) {
    (this.#t ??= []).push(t);
  }
  get_path() {
    return this.#n ? [...this.#n.get_path(), this.#n.#e.indexOf(this)] : [];
  }
  copy() {
    let t = new e(this.global, this.#n);
    return t.#e = this.#e.map((r) => r instanceof e ? r.copy() : r), t.promise = this.promise, t;
  }
  subsume(t) {
    if (this.global.mode !== t.global.mode) throw new Error("invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!");
    this.local = t.local, this.#e = t.#e.map((r, n) => {
      let o = this.#e[n];
      return o instanceof e && r instanceof e ? (o.subsume(r), o) : r;
    }), this.promise = t.promise, this.type = t.type;
  }
  get length() {
    return this.#e.length;
  }
  static #o(t) {
    var r = JSON.stringify(t), n = r.replace(/>/g, "\\u003e").replace(/</g, "\\u003c");
    return `<!--${"[?"}${n}-->`;
  }
  static render(t, r = {}) {
    let n, o, s = {};
    return Object.defineProperties(s, { html: { get: /* @__PURE__ */ __name(() => (n ??= e.#a(t, r)).body, "get") }, head: { get: /* @__PURE__ */ __name(() => (n ??= e.#a(t, r)).head, "get") }, body: { get: /* @__PURE__ */ __name(() => (n ??= e.#a(t, r)).body, "get") }, hashes: { value: { script: "" } }, then: { value: /* @__PURE__ */ __name((a, l) => {
      if (!O) {
        let c = n ??= e.#a(t, r), i = a({ head: c.head, body: c.body, html: c.body, hashes: { script: [] } });
        return Promise.resolve(i);
      }
      return o ??= rn().then(() => tn(() => e.#d(t, r))), o.then((c) => (Object.defineProperty(c, "html", { get: /* @__PURE__ */ __name(() => {
        Vr();
      }, "get") }), a(c)), l);
    }, "value") } }), s;
  }
  *#f() {
    for (let t of this.#c()) yield* t.#u();
  }
  *#c() {
    for (let t of this.#e) typeof t != "string" && (yield* t.#c());
    this.#r && (yield this);
  }
  *#u() {
    if (this.#t) for (let t of this.#t) yield t;
    for (let t of this.#e) t instanceof e && !t.#r && (yield* t.#u());
  }
  static #a(t, r) {
    var n = w;
    try {
      let o = e.#p("sync", t, r), s = o.#l();
      return e.#h(s, o);
    } finally {
      It(), I(n);
    }
  }
  static async #d(t, r) {
    let n = w;
    try {
      let o = e.#p("async", t, r), s = await o.#i(), a = await o.#v();
      return a !== null && (s.head = a + s.head), e.#h(s, o);
    } finally {
      I(n), It();
    }
  }
  #l(t = { head: "", body: "" }) {
    for (let r of this.#e) typeof r == "string" ? t[this.type] += r : r instanceof e && r.#l(t);
    return t;
  }
  async #i(t = { head: "", body: "" }) {
    await this.promise;
    for (let r of this.#e) if (typeof r == "string") t[this.type] += r;
    else if (r instanceof e) if (r.#s) {
      let n = { head: "", body: "" };
      try {
        await r.#i(n), t.head += n.head, t.body += n.body;
      } catch (o) {
        let { context: s, failed: a, transformError: l } = r.#s;
        I(s);
        let c = l(o);
        I(null);
        let i = await c;
        I(s);
        let u = new e(r.global, r);
        u.type = r.type, u.#e.push(e.#o(i)), a(u, i, C), u.#e.push(W), await u.#i(t);
      }
    } else await r.#i(t);
    return t;
  }
  async #v() {
    let t = en().hydratable;
    for (let [r, n] of t.unresolved_promises) Jr(n, t.lookup.get(n)?.stack ?? "<missing stack trace>");
    for (let r of t.comparisons) await r;
    return await this.#m(t);
  }
  static #p(t, r, n) {
    n.idPrefix?.includes("--") && Xr();
    var o = w;
    try {
      let s = new e(new Et(t, n.idPrefix ? n.idPrefix + "-" : "", n.csp, n.transformError)), a = { p: null, c: n.context ?? null, r: s };
      return I(a), s.push(le), r(s, n.props ?? {}), s.push(W), s;
    } finally {
      I(o);
    }
  }
  static #h(t, r) {
    for (let s of r.#f()) s();
    let n = t.head + r.global.get_title(), o = t.body;
    for (let { hash: s, code: a } of r.global.css) n += `<style id="${s}">${a}</style>`;
    return { head: n, body: o, hashes: { script: r.global.csp.script_hashes } };
  }
  async #m(t) {
    if (t.lookup.size === 0) return null;
    let r = [], n = false;
    for (let [l, c] of t.lookup) {
      if (c.promises) {
        n = true;
        for (let i of c.promises) await i;
      }
      r.push(`[${Me(l)},${c.serialized}]`);
    }
    let o = "const h = (window.__svelte ??= {}).h ??= new Map();";
    n && (o = `const r = (v) => Promise.resolve(v);
				${o}`);
    let s = `
			{
				${o}

				for (const [k, v] of [
					${r.join(`,
					`)}
				]) {
					h.set(k, v);
				}
			}
		`, a = "";
    if (this.global.csp.nonce) a = ` nonce="${this.global.csp.nonce}"`;
    else if (this.global.csp.hash) {
      let l = await sn(s);
      this.global.csp.script_hashes.push(`sha256-${l}`);
    }
    return `
		<script${a}>${s}<\/script>`;
  }
};
var Et = class {
  static {
    __name(this, "Et");
  }
  csp;
  mode;
  uid;
  css = /* @__PURE__ */ new Set();
  transformError;
  #e = { path: [], value: "" };
  constructor(t, r = "", n = { hash: false }, o) {
    this.mode = t, this.csp = { ...n, script_hashes: [] }, this.transformError = o ?? ((a) => {
      throw a;
    });
    let s = 1;
    this.uid = () => `${r}s${s++}`;
  }
  get_title() {
    return this.#e.value;
  }
  set_title(t, r) {
    let n = this.#e.path, o = 0, s = Math.min(r.length, n.length);
    for (; o < s && r[o] === n[o]; ) o += 1;
    r[o] !== void 0 && (n[o] === void 0 || r[o] > n[o]) && (this.#e.path = r, this.#e.value = t);
  }
};
var zo = { li: { direct: ["li"] }, dt: { descendant: ["dt", "dd"], reset_by: ["dl"] }, dd: { descendant: ["dt", "dd"], reset_by: ["dl"] }, p: { descendant: ["address", "article", "aside", "blockquote", "div", "dl", "fieldset", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "menu", "nav", "ol", "p", "pre", "section", "table", "ul"] }, rt: { descendant: ["rt", "rp"] }, rp: { descendant: ["rt", "rp"] }, optgroup: { descendant: ["optgroup"] }, option: { descendant: ["option", "optgroup"] }, thead: { direct: ["tbody", "tfoot"] }, tbody: { direct: ["tbody", "tfoot"] }, tfoot: { direct: ["tbody"] }, tr: { direct: ["tr", "tbody"] }, td: { direct: ["td", "th", "tr"] }, th: { direct: ["td", "th", "tr"] } };
var bp = { ...zo, form: { descendant: ["form"] }, a: { descendant: ["a"] }, button: { descendant: ["button"] }, h1: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] }, h2: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] }, h3: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] }, h4: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] }, h5: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] }, h6: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] }, tr: { only: ["th", "td", "style", "script", "template"] }, tbody: { only: ["tr", "style", "script", "template"] }, thead: { only: ["tr", "style", "script", "template"] }, tfoot: { only: ["tr", "style", "script", "template"] }, colgroup: { only: ["col", "template"] }, table: { only: ["caption", "colgroup", "tbody", "thead", "tfoot", "style", "script", "template"] }, head: { only: ["base", "basefont", "bgsound", "link", "meta", "title", "noscript", "noframes", "style", "script", "template"] }, html: { only: ["head", "body", "frameset"] }, frameset: { only: ["frame"] }, "#document": { only: ["html"] } };
var Ko = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function Ut(e2, t = {}) {
  return t.csp?.hash && t.csp.nonce && Yr(), fe.render(e2, t);
}
__name(Ut, "Ut");
function At(e2, t, r, n, o = 0) {
  n && (e2.style = dr(e2.style, n)), e2.class && (e2.class = fr(e2.class)), (t || r) && (e2.class = at(e2.class, t, r));
  let s = "", a, l = (o & 1) === 0, c = (o & 2) === 0, i = (o & 4) !== 0;
  for (a of Object.keys(e2)) if (typeof e2[a] != "function" && !(a[0] === "$" && a[1] === "$") && !(a === "" || Ko.test(a))) {
    var u = e2[a], f = a.toLowerCase();
    c && (a = f), !(f.length > 2 && f.startsWith("on")) && (i && (a === "defaultvalue" || a === "defaultchecked") && (a = a === "defaultvalue" ? "value" : "checked", e2[a]) || (s += Ue(a, u, l && Wr(a))));
  }
  return s;
}
__name(At, "At");
function Qt(e2, t, r) {
  var n = at(e2, t, r);
  return n ? ` class="${F(n, true)}"` : "";
}
__name(Qt, "Qt");
function de(e2) {
  return e2 ? e2.length !== void 0 ? e2 : Array.from(e2) : [];
}
__name(de, "de");
var hn = "__hono_svelte_mounted__";
var H = {};
var J = "/__svelte";
function es(e2) {
  let t = H[e2];
  return t && t.hash ? `${e2}.${t.hash}` : e2;
}
__name(es, "es");
function mn(e2, t) {
  H = t.bundles, J = t.prefix ?? "/__svelte";
  let r = e2;
  r[hn] || (r[hn] = true, e2.get(`${J}/:filename`, async (n) => {
    let o = n.req.param("filename"), s = o.match(/^([a-zA-Z0-9_\-]+)\.([a-zA-Z0-9]{6,})\.(js|css)$/), a = s ? null : o.match(/^([a-zA-Z0-9_\-]+)\.(js|css)$/);
    if (!s && !a) return n.notFound();
    let l = s ? s[1] : a[1], c = s ? s[2] : null, i = s ? s[3] : a[2], u = H[l];
    if (!u || c && u.hash && c !== u.hash) return n.notFound();
    let f = !!(c && u.hash), p = f ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate", d = f ? globalThis.caches?.default : void 0;
    if (d) {
      let y = await d.match(n.req.raw);
      if (y) return y;
    }
    let _ = i === "js" ? new Response(u.js, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": p } }) : new Response(u.css, { headers: { "content-type": "text/css; charset=utf-8", "cache-control": p } });
    return d && n.executionCtx.waitUntil(d.put(n.req.raw, _.clone())), _;
  }));
}
__name(mn, "mn");
function vn(e2) {
  return e2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
__name(vn, "vn");
var kt = "_runtime";
var ts = "_shared_manifest";
function rs() {
  let e2 = H[kt];
  if (!e2) return null;
  let t = e2.hash ? `${kt}.${e2.hash}` : kt;
  return `${J}/${t}.js`;
}
__name(rs, "rs");
function ns() {
  let e2 = H[ts];
  if (!e2) return null;
  let t = e2.js.match(/export default (\{[^}]*\});/);
  if (!t) return null;
  try {
    return JSON.parse(t[1]);
  } catch {
    return null;
  }
}
__name(ns, "ns");
function os() {
  let e2 = ns();
  if (!e2) return {};
  let t = {};
  for (let [r, n] of Object.entries(e2)) {
    let o = H[n];
    if (!o) continue;
    let s = o.hash ? `${n}.${o.hash}` : n;
    t[r] = `${J}/${s}.js`;
  }
  return t;
}
__name(os, "os");
function ss(e2, t, r, n) {
  let o = es(t), s = r ? `<link rel="stylesheet" href="${J}/${o}.css">` : "", a = n.title ? `<title>${vn(n.title)}</title>` : "", l = n.head ?? "", c = n.bodyClass ? ` class="${vn(n.bodyClass)}"` : "", i = JSON.stringify(n.props ?? {}), u = rs(), f = os(), p = u ? `<script type="importmap">${JSON.stringify({ imports: { svelte: u, "svelte/internal/client": u, "svelte/internal/disclose-version": u, ...f } })}<\/script>` : "", d = Object.values(f).map((y) => `<link rel="modulepreload" href="${y}">`).join(`
`), _ = u ? `<link rel="modulepreload" href="${u}">
${d}` : d;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${a}
${p}
${_}
${s}
${l}
${e2.head}
</head>
<body${c}>
<div id="svelte-hono-root">${e2.body}</div>
<script type="module">
import { hydrate } from "${J}/${o}.js";
hydrate(${i});
<\/script>
</body>
</html>`;
}
__name(ss, "ss");
function St(e2, t) {
  return async (r) => {
    let n = t.props ?? {}, o = Ut(e2, { props: n }), s = ss({ body: o.body, head: o.head }, t.hydrateAs, true, t), a = t.cacheControl ?? "public, max-age=0, must-revalidate", l = { "content-type": "text/html; charset=utf-8" };
    return a && (l["cache-control"] = a), new Response(s, { status: 200, headers: l });
  };
}
__name(St, "St");
var gn = { _runtime: { js: 'typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var it={};var D=Symbol("uninitialized"),U=Symbol("filename"),Ht=Symbol("hmr"),rn="http://www.w3.org/1999/xhtml",$t="http://www.w3.org/2000/svg",Sr="http://www.w3.org/1998/Math/MathML";var nn="@attach";var on=!0;var ui=globalThis.process?.env?.NODE_ENV,u=ui&&!ui.toLowerCase().startsWith("prod");var Ye=Array.isArray,pi=Array.prototype.indexOf,St=Array.prototype.includes,ir=Array.from,Nr=Object.keys,ce=Object.defineProperty,_e=Object.getOwnPropertyDescriptor,sn=Object.getOwnPropertyDescriptors,an=Object.prototype,_i=Array.prototype,Nt=Object.getPrototypeOf,eo=Object.isExtensible,di=Object.prototype.hasOwnProperty;function kt(e){return typeof e=="function"}var ue=()=>{};function to(e){return typeof e?.then=="function"}function mi(e){return e()}function sr(e){for(var t=0;t<e.length;t++)e[t]()}function fn(){var e,t,r=new Promise((n,o)=>{e=n,t=o});return{promise:r,resolve:e,reject:t}}function nf(e,t,r=!1){return e===void 0?r?t():t:e}function of(e,t){if(Array.isArray(e))return e;if(t===void 0||!(Symbol.iterator in e))return Array.from(e);let r=[];for(let n of e)if(r.push(n),r.length===t)break;return r}function sf(e,t){var r={};for(var n in e)t.includes(n)||(r[n]=e[n]);for(var o of Object.getOwnPropertySymbols(e))Object.propertyIsEnumerable.call(e,o)&&!t.includes(o)&&(r[o]=e[o]);return r}var G=Symbol("$state"),Vt=Symbol("legacy props"),hi=Symbol(""),ln=Symbol("proxy path"),cn=Symbol("attributes"),kr=Symbol("class"),Rr=Symbol("style"),Cr=Symbol("text"),Rt=Symbol("form reset"),un=Symbol("hmr anchor"),dt=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},mt=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml"),ar=1,Ut=3,$e=8,pn=11;function _n(e){if(u){let t=new Error(`experimental_async_required\nCannot use \\`${e}(...)\\` unless the \\`experimental.async\\` compiler option is \\`true\\`\nhttps://svelte.dev/e/experimental_async_required`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/experimental_async_required")}function vi(){if(u){let e=new Error("invalid_default_snippet\\nCannot use `{@render children(...)}` if the parent component uses `let:` directives. Consider using a named snippet instead\\nhttps://svelte.dev/e/invalid_default_snippet");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invalid_default_snippet")}function ro(){if(u){let e=new Error("invalid_snippet_arguments\\nA snippet function was passed invalid arguments. Snippets should only be instantiated via `{@render ...}`\\nhttps://svelte.dev/e/invalid_snippet_arguments");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invalid_snippet_arguments")}function gi(e){if(u){let t=new Error(`invariant_violation\nAn invariant violation occurred, meaning Svelte\'s internal assumptions were flawed. This is a bug in Svelte, not your app \\u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"\nhttps://svelte.dev/e/invariant_violation`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invariant_violation")}function ht(e){if(u){let t=new Error(`lifecycle_outside_component\n\\`${e}(...)\\` can only be used during component initialisation\nhttps://svelte.dev/e/lifecycle_outside_component`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function xi(){if(u){let e=new Error(`missing_context\nContext was not set in a parent component\nhttps://svelte.dev/e/missing_context`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/missing_context")}function wi(){if(u){let e=new Error("snippet_without_render_tag\\nAttempted to render a snippet without a `{@render}` block. This would cause the snippet code to be stringified instead of its content being rendered to the DOM. To fix this, change `{snippet}` to `{@render snippet()}`.\\nhttps://svelte.dev/e/snippet_without_render_tag");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/snippet_without_render_tag")}function yi(e){if(u){let t=new Error(`store_invalid_shape\n\\`${e}\\` is not a store with a \\`subscribe\\` method\nhttps://svelte.dev/e/store_invalid_shape`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/store_invalid_shape")}function bi(){if(u){let e=new Error("svelte_element_invalid_this_value\\nThe `this` prop on `<svelte:element>` must be a string, if defined\\nhttps://svelte.dev/e/svelte_element_invalid_this_value");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/svelte_element_invalid_this_value")}function Ti(){if(u){let e=new Error("async_derived_orphan\\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\\nhttps://svelte.dev/e/async_derived_orphan");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function no(){if(u){let e=new Error("bind_invalid_checkbox_value\\nUsing `bind:value` together with a checkbox input is not allowed. Use `bind:checked` instead\\nhttps://svelte.dev/e/bind_invalid_checkbox_value");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/bind_invalid_checkbox_value")}function Ai(e,t){if(u){let r=new Error(`component_api_changed\nCalling \\`${e}\\` on a component instance (of ${t}) is no longer valid in Svelte 5\nhttps://svelte.dev/e/component_api_changed`);throw r.name="Svelte error",r}else throw new Error("https://svelte.dev/e/component_api_changed")}function $i(e,t){if(u){let r=new Error(`component_api_invalid_new\nAttempted to instantiate ${e} with \\`new ${t}\\`, which is no longer valid in Svelte 5. If this component is not under your control, set the \\`compatibility.componentApi\\` compiler option to \\`4\\` to keep it working.\nhttps://svelte.dev/e/component_api_invalid_new`);throw r.name="Svelte error",r}else throw new Error("https://svelte.dev/e/component_api_invalid_new")}function Si(){if(u){let e=new Error(`derived_references_self\nA derived value cannot reference itself recursively\nhttps://svelte.dev/e/derived_references_self`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/derived_references_self")}function oo(e,t,r){if(u){let n=new Error(`each_key_duplicate\n${r?`Keyed each block has duplicate key \\`${r}\\` at indexes ${e} and ${t}`:`Keyed each block has duplicate key at indexes ${e} and ${t}`}\nhttps://svelte.dev/e/each_key_duplicate`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function Ni(e,t,r){if(u){let n=new Error(`each_key_volatile\nKeyed each block has key that is not idempotent \\u2014 the key for item at index ${e} was \\`${t}\\` but is now \\`${r}\\`. Keys must be the same each time for a given item\nhttps://svelte.dev/e/each_key_volatile`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_volatile")}function ki(e){if(u){let t=new Error(`effect_in_teardown\n\\`${e}\\` cannot be used inside an effect cleanup function\nhttps://svelte.dev/e/effect_in_teardown`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function Ri(){if(u){let e=new Error("effect_in_unowned_derived\\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\\nhttps://svelte.dev/e/effect_in_unowned_derived");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function Ci(e){if(u){let t=new Error(`effect_orphan\n\\`${e}\\` can only be used inside an effect (e.g. during component initialisation)\nhttps://svelte.dev/e/effect_orphan`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_orphan")}function Oi(){if(u){let e=new Error("effect_pending_outside_reaction\\n`$effect.pending()` can only be called inside an effect or derived\\nhttps://svelte.dev/e/effect_pending_outside_reaction");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_pending_outside_reaction")}function Di(){if(u){let e=new Error(`effect_update_depth_exceeded\nMaximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state\nhttps://svelte.dev/e/effect_update_depth_exceeded`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Ii(){if(u){let e=new Error(`fork_discarded\nCannot commit a fork that was already discarded\nhttps://svelte.dev/e/fork_discarded`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/fork_discarded")}function Mi(){if(u){let e=new Error(`fork_timing\nCannot create a fork inside an effect or when state changes are pending\nhttps://svelte.dev/e/fork_timing`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/fork_timing")}function Li(){if(u){let e=new Error("get_abort_signal_outside_reaction\\n`getAbortSignal()` can only be called inside an effect or derived\\nhttps://svelte.dev/e/get_abort_signal_outside_reaction");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/get_abort_signal_outside_reaction")}function Fi(e){if(u){let t=new Error(`hydratable_missing_but_required\nExpected to find a hydratable with key \\`${e}\\` during hydration, but did not.\nhttps://svelte.dev/e/hydratable_missing_but_required`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/hydratable_missing_but_required")}function Pi(){if(u){let e=new Error(`hydration_failed\nFailed to hydrate the application\nhttps://svelte.dev/e/hydration_failed`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/hydration_failed")}function Yi(){if(u){let e=new Error("invalid_snippet\\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\\nhttps://svelte.dev/e/invalid_snippet");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invalid_snippet")}function io(e){if(u){let t=new Error(`lifecycle_legacy_only\n\\`${e}(...)\\` cannot be used in runes mode\nhttps://svelte.dev/e/lifecycle_legacy_only`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/lifecycle_legacy_only")}function Bi(e){if(u){let t=new Error(`props_invalid_value\nCannot do \\`bind:${e}={undefined}\\` when \\`${e}\\` has a fallback value\nhttps://svelte.dev/e/props_invalid_value`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_invalid_value")}function Hi(e){if(u){let t=new Error(`props_rest_readonly\nRest element properties of \\`$props()\\` such as \\`${e}\\` are readonly\nhttps://svelte.dev/e/props_rest_readonly`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function Vi(e){if(u){let t=new Error(`rune_outside_svelte\nThe \\`${e}\\` rune is only available inside \\`.svelte\\` and \\`.svelte.js/ts\\` files\nhttps://svelte.dev/e/rune_outside_svelte`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function Ui(){if(u){let e=new Error("set_context_after_init\\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\\nhttps://svelte.dev/e/set_context_after_init");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/set_context_after_init")}function qi(){if(u){let e=new Error("state_descriptors_fixed\\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\\nhttps://svelte.dev/e/state_descriptors_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function ji(){if(u){let e=new Error("state_prototype_fixed\\nCannot set prototype of `$state` object\\nhttps://svelte.dev/e/state_prototype_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Gi(){if(u){let e=new Error("state_unsafe_mutation\\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\\nhttps://svelte.dev/e/state_unsafe_mutation");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function zi(){if(u){let e=new Error("svelte_boundary_reset_onerror\\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var de="font-weight: bold",me="font-weight: normal";function Wi(e,t){u?console.warn(`%c[svelte] assignment_value_stale\n%cAssignment to \\`${e}\\` property (${t}) will evaluate to the right-hand side, not the value of \\`${e}\\` following the assignment. This may result in unexpected behaviour.\nhttps://svelte.dev/e/assignment_value_stale`,de,me):console.warn("https://svelte.dev/e/assignment_value_stale")}function Ki(e){u?console.warn(`%c[svelte] await_reactivity_loss\n%cDetected reactivity loss when reading \\`${e}\\`. This happens when state is read in an async function after an earlier \\`await\\`\nhttps://svelte.dev/e/await_reactivity_loss`,de,me):console.warn("https://svelte.dev/e/await_reactivity_loss")}function Xi(e,t){u?console.warn(`%c[svelte] await_waterfall\n%cAn async derived, \\`${e}\\` (${t}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app\nhttps://svelte.dev/e/await_waterfall`,de,me):console.warn("https://svelte.dev/e/await_waterfall")}function Zi(e,t){u?console.warn(`%c[svelte] binding_property_non_reactive\n%c${t?`\\`${e}\\` (${t}) is binding to a non-reactive property`:`\\`${e}\\` is binding to a non-reactive property`}\nhttps://svelte.dev/e/binding_property_non_reactive`,de,me):console.warn("https://svelte.dev/e/binding_property_non_reactive")}function Ji(e){u?console.warn(`%c[svelte] console_log_state\n%cYour \\`console.${e}\\` contained \\`$state\\` proxies. Consider using \\`$inspect(...)\\` or \\`$state.snapshot(...)\\` instead\nhttps://svelte.dev/e/console_log_state`,de,me):console.warn("https://svelte.dev/e/console_log_state")}function Qi(){u?console.warn(`%c[svelte] derived_inert\n%cReading a derived belonging to a now-destroyed effect may result in stale values\nhttps://svelte.dev/e/derived_inert`,de,me):console.warn("https://svelte.dev/e/derived_inert")}function es(e,t){u?console.warn(`%c[svelte] event_handler_invalid\n%c${e} should be a function. Did you mean to ${t}?\nhttps://svelte.dev/e/event_handler_invalid`,de,me):console.warn("https://svelte.dev/e/event_handler_invalid")}function ts(e){u?console.warn(`%c[svelte] hydratable_missing_but_expected\n%cExpected to find a hydratable with key \\`${e}\\` during hydration, but did not.\nhttps://svelte.dev/e/hydratable_missing_but_expected`,de,me):console.warn("https://svelte.dev/e/hydratable_missing_but_expected")}function rs(e,t,r){u?console.warn(`%c[svelte] hydration_attribute_changed\n%cThe \\`${e}\\` attribute on \\`${t}\\` changed its value between server and client renders. The client value, \\`${r}\\`, will be ignored in favour of the server value\nhttps://svelte.dev/e/hydration_attribute_changed`,de,me):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function ns(e){u?console.warn(`%c[svelte] hydration_html_changed\n%c${e?`The value of an \\`{@html ...}\\` block ${e} changed between server and client renders. The client value will be ignored in favour of the server value`:"The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}\nhttps://svelte.dev/e/hydration_html_changed`,de,me):console.warn("https://svelte.dev/e/hydration_html_changed")}function Ct(e){u?console.warn(`%c[svelte] hydration_mismatch\n%c${e?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${e}`:"Hydration failed because the initial UI does not match what was rendered on the server"}\nhttps://svelte.dev/e/hydration_mismatch`,de,me):console.warn("https://svelte.dev/e/hydration_mismatch")}function os(){u?console.warn("%c[svelte] invalid_raw_snippet_render\\n%cThe `render` function passed to `createRawSnippet` should return HTML for a single element\\nhttps://svelte.dev/e/invalid_raw_snippet_render",de,me):console.warn("https://svelte.dev/e/invalid_raw_snippet_render")}function is(){u?console.warn(`%c[svelte] lifecycle_double_unmount\n%cTried to unmount a component that was not mounted\nhttps://svelte.dev/e/lifecycle_double_unmount`,de,me):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function ss(e,t,r,n){u?console.warn(`%c[svelte] ownership_invalid_binding\n%c${e} passed property \\`${t}\\` to ${r} with \\`bind:\\`, but its parent component ${n} did not declare \\`${t}\\` as a binding. Consider creating a binding between ${n} and ${e} (e.g. \\`bind:${t}={...}\\` instead of \\`${t}={...}\\`)\nhttps://svelte.dev/e/ownership_invalid_binding`,de,me):console.warn("https://svelte.dev/e/ownership_invalid_binding")}function as(e,t,r,n){u?console.warn(`%c[svelte] ownership_invalid_mutation\n%cMutating unbound props (\\`${e}\\`, at ${t}) is strongly discouraged. Consider using \\`bind:${r}={...}\\` in ${n} (or using a callback) instead\nhttps://svelte.dev/e/ownership_invalid_mutation`,de,me):console.warn("https://svelte.dev/e/ownership_invalid_mutation")}function fs(){u?console.warn("%c[svelte] select_multiple_invalid_value\\n%cThe `value` property of a `<select multiple>` element should be an array, but it received a non-array value. The selection will be kept as is.\\nhttps://svelte.dev/e/select_multiple_invalid_value",de,me):console.warn("https://svelte.dev/e/select_multiple_invalid_value")}function fr(e){u?console.warn(`%c[svelte] state_proxy_equality_mismatch\n%cReactive \\`$state(...)\\` proxies and the values they proxy have different identities. Because of this, comparisons with \\`${e}\\` will produce unexpected results\nhttps://svelte.dev/e/state_proxy_equality_mismatch`,de,me):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function ls(){u?console.warn(`%c[svelte] state_proxy_unmount\n%cTried to unmount a state proxy, rather than a component\nhttps://svelte.dev/e/state_proxy_unmount`,de,me):console.warn("https://svelte.dev/e/state_proxy_unmount")}function cs(){u?console.warn("%c[svelte] svelte_boundary_reset_noop\\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\\nhttps://svelte.dev/e/svelte_boundary_reset_noop",de,me):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var h=!1;function O(e){h=e}var y;function S(e){if(e===null)throw Ct(),it;return y=e}function q(){return S(fe(y))}function so(e){if(h){if(fe(y)!==null)throw Ct(),it;y=e}}function af(e){h&&(y=e.content)}function ao(e=1){if(h){for(var t=e,r=y;t--;)r=fe(r);y=r}}function Be(e=!0){for(var t=0,r=y;;){if(r.nodeType===$e){var n=r.data;if(n==="]"){if(t===0)return r;t-=1}else(n==="["||n==="[!"||n[0]==="["&&!isNaN(Number(n.slice(1))))&&(t+=1)}var o=fe(r);e&&r.remove(),r=o}}function lr(e){if(!e||e.nodeType!==$e)throw Ct(),it;return e.data}function dn(e){return e===this.v}function mn(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function hn(e){return!mn(e,this.v)}var Z=!1,vt=!1,Je=!1;var us="font-weight: bold",ps="font-weight: normal";function _s(e){u?console.warn(`%c[svelte] dynamic_void_element_content\n%c\\`<svelte:element this="${e}">\\` is a void element \\u2014 it cannot have content\nhttps://svelte.dev/e/dynamic_void_element_content`,us,ps):console.warn("https://svelte.dev/e/dynamic_void_element_content")}function fo(e){u?console.warn(`%c[svelte] state_snapshot_uncloneable\n%c${e?`The following properties cannot be cloned with \\`$state.snapshot\\` \\u2014 the return value contains the originals:\n\n${e}`:"Value cannot be cloned with `$state.snapshot` \\u2014 the original value was returned"}\nhttps://svelte.dev/e/state_snapshot_uncloneable`,us,ps):console.warn("https://svelte.dev/e/state_snapshot_uncloneable")}var ff=[];function Ot(e,t=!1,r=!1){if(u&&!t){let n=[],o=Or(e,new Map,"",n,null,r);if(n.length===1&&n[0]==="")fo();else if(n.length>0){let i=n.length>10?n.slice(0,7):n.slice(0,10),s=n.length-i.length,a=i.map(f=>`- <value>${f}`).join(`\n`);s>0&&(a+=`\n- ...and ${s} more`),fo(a)}return o}return Or(e,new Map,"",ff,null,r)}function Or(e,t,r,n,o=null,i=!1){if(typeof e=="object"&&e!==null){var s=t.get(e);if(s!==void 0)return s;if(e instanceof Map)return new Map(e);if(e instanceof Set)return new Set(e);if(Ye(e)){var a=Array(e.length);t.set(e,a),o!==null&&t.set(o,a);for(var f=0;f<e.length;f+=1){var l=e[f];f in e&&(a[f]=Or(l,t,u?`${r}[${f}]`:r,n,null,i))}return a}if(Nt(e)===an){a={},t.set(e,a),o!==null&&t.set(o,a);for(var d of Object.keys(e))a[d]=Or(e[d],t,u?`${r}.${d}`:r,n,null,i);return a}if(e instanceof Date)return structuredClone(e);if(typeof e.toJSON=="function"&&!i)return Or(e.toJSON(),t,u?`${r}.toJSON()`:r,n,e)}if(e instanceof EventTarget)return e;try{return structuredClone(e)}catch{return u&&n.push(r),e}}var Qe=null;function ms(e,t){let r=e.v;if(r===D)return;let n=lf(e),o=b,i=e.wv>o.wv||o.wv===0,s=i?"color: CornflowerBlue; font-weight: bold":"color: grey; font-weight: normal";if(console.groupCollapsed(e.label?`%c${n}%c ${e.label}`:`%c${n}%c`,s,i?"font-weight: normal":s,typeof r=="object"&&r!==null&&G in r?Ot(r,!0):r),n==="$derived"){let f=new Set(e.deps);for(let l of f)ms(l)}if(e.created&&console.log(e.created),i&&e.updated)for(let f of e.updated.values())f.error&&console.log(f.error);if(t)for(var a of t.traces)console.log(a);console.groupEnd()}function lf(e){return(e.f&4194306)!==0?"$derived":e.label?.startsWith("$")?"store":"$state"}function cf(e,t){var r=Qe;try{Qe={entries:new Map,reaction:b};var n=performance.now(),o=t(),i=(performance.now()-n).toFixed(2),s=k(e);if(!gt())console.log(`${s} %cran outside of an effect (${i}ms)`,"color: grey");else if(Qe.entries.size===0)console.log(`${s} %cno reactive dependencies (${i}ms)`,"color: grey");else{console.group(`${s} %c(${i}ms)`,"color: grey");var a=Qe.entries;k(()=>{for(let[f,l]of a)ms(f,l)}),Qe=null,console.groupEnd()}return o}finally{Qe=r}}function Se(e,t){return e.label=t,vn(e.v,t),e}function vn(e,t){return e?.[ln]?.(t),e}function Ge(e){let t=new Error,r=uf();return r.length===0?null:(r.unshift(`\n`),ce(t,"stack",{value:r.join(`\n`)}),ce(t,"name",{value:e}),t)}function uf(){let e=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let t=new Error().stack;if(Error.stackTraceLimit=e,!t)return[];let r=t.split(`\n`),n=[];for(let o=0;o<r.length;o++){let i=r[o],s=i.replaceAll("\\\\","/");if(i.trim()!=="Error"){if(i.includes("validate_each_keys"))return[];s.includes("svelte/src/internal")||s.includes("node_modules/.vite")||n.push(i)}}return n}function hs(e,t){if(!u)throw new Error("invariant(...) was not guarded by if (DEV)");e||gi(t)}var T=null;function xt(e){T=e}var Ne=null;function cr(e){Ne=e}function pf(e,t,r,n,o,i){let s=Ne;Ne={type:t,file:r[U],line:n,column:o,parent:s,...i};try{return e()}finally{Ne=s}}var Ce=null;function ur(e){Ce=e}function _f(){let e={};return[()=>(xs(e)||xi(),vs(e)),t=>gs(e,t)]}function vs(e){return gn("getContext").get(e)}function gs(e,t){let r=gn("setContext");if(Z){var n=x.f,o=!b&&(n&32)!==0&&!T.i;o||Ui()}return r.set(e,t),t}function xs(e){return gn("hasContext").has(e)}function df(){return gn("getAllContexts")}function lo(e,t=!1,r){T={p:T,i:!1,c:null,e:null,s:e,x:null,r:x,l:vt&&!t?{s:null,u:null,$:[]}:null},u&&(T.function=r,Ce=r)}function co(e){var t=T,r=t.e;if(r!==null){t.e=null;for(var n of r)uo(n)}return e!==void 0&&(t.x=e),t.i=!0,T=t.p,u&&(Ce=T?.function??null),e??{}}function ze(){return!vt||T!==null&&T.l===null}function gn(e){return T===null&&ht(e),T.c??=new Map(mf(T)||void 0)}function mf(e){let t=e.p;for(;t!==null;){let r=t.c;if(r!==null)return r;t=t.p}return null}var zt=[];function ws(){var e=zt;zt=[],sr(e)}function W(e){if(zt.length===0&&!Dt){var t=zt;queueMicrotask(()=>{t===zt&&ws()})}zt.push(e)}function ys(){for(;zt.length>0;)ws()}var po=new WeakMap;function xn(e){var t=x;if(t===null)return b.f|=8388608,e;if(u&&e instanceof Error&&!po.has(e)&&po.set(e,hf(e,t)),(t.f&32768)===0&&(t.f&4)===0)throw u&&!t.parent&&e instanceof Error&&bs(e),e;We(e,t)}function We(e,t){if(!(t!==null&&(t.f&16384)!==0)){for(;t!==null;){if((t.f&128)!==0){if((t.f&32768)===0)throw e;try{t.b.error(e);return}catch(r){e=r}}t=t.parent}throw u&&e instanceof Error&&bs(e),e}}function hf(e,t){let r=_e(e,"message");if(!(r&&!r.configurable)){for(var n=pr?"  ":"	",o=`\n${n}in ${t.fn?.name||"<unknown>"}`,i=t.ctx;i!==null;)o+=`\n${n}in ${i.function?.[U].split("/").pop()}`,i=i.p;return{message:e.message+`\n${o}\n`,stack:e.stack?.split(`\n`).filter(s=>!s.includes("svelte/src/internal")).join(`\n`)}}}function bs(e){let t=po.get(e);t&&(ce(e,"message",{value:t.message}),ce(e,"stack",{value:t.stack}))}var vf=-7169;function P(e,t){e.f=e.f&vf|t}function _r(e){(e.f&512)!==0||e.deps===null?P(e,1024):P(e,4096)}function Es(e){if(e!==null)for(let t of e)(t.f&2)===0||(t.f&65536)===0||(t.f^=65536,Es(t.deps))}function wn(e,t,r){(e.f&2048)!==0?t.add(e):(e.f&4096)!==0&&r.add(e),Es(e.deps),P(e,1024)}function yn(e,t,r){if(e==null)return t(void 0),r&&r(void 0),ue;let n=k(()=>e.subscribe(t,r));return n.unsubscribe?()=>n.unsubscribe():n}function Ts(e){let t;return yn(e,r=>t=r)(),t}var bn=!1,Ir=!1,_o=Symbol("unmounted");function gf(e,t,r){let n=r[t]??={store:null,source:at(void 0),unsubscribe:ue};if(u&&(n.source.label=t),n.store!==e&&!(_o in r))if(n.unsubscribe(),n.store=e??null,e==null)n.source.v=void 0,n.unsubscribe=ue;else{var o=!0;n.unsubscribe=yn(e,i=>{o?n.source.v=i:ne(n.source,i)}),o=!1}return e&&_o in r?Ts(e):$(n.source)}function xf(e,t,r){let n=r[t];return n&&n.store!==e&&(n.unsubscribe(),n.unsubscribe=ue),e}function As(e,t){return En(e,t),t}function wf(e,t){var r=e[t];r.store!==null&&As(r.store,r.source.v)}function yf(){let e={};function t(){Y(()=>{for(var r in e)e[r].unsubscribe();ce(e,_o,{enumerable:!1,value:!0})})}return[e,t]}function En(e,t){bn=!0;try{e.set(t)}finally{bn=!1}}function bf(e,t,r){return En(e,r),t}function Ef(e,t,r=1){return En(e,t+r),t}function Tf(e,t,r=1){let n=t+r;return En(e,n),n}function Af(){Ir=!0}function Tn(e){var t=Ir;try{return Ir=!1,[e(),Ir]}finally{Ir=t}}function $s(e){let t=0,r=oe(0),n;return u&&Se(r,"createSubscriber version"),()=>{gt()&&($(r),I(()=>(t===0&&(n=k(()=>e(()=>Kt(r)))),t+=1,()=>{W(()=>{t-=1,t===0&&(n?.(),n=void 0,Kt(r))})})))}}var $f=589824;function ho(e,t,r,n){new mo(e,t,r,n)}var mo=class{parent;is_pending=!1;transform_error;#e;#t=h?y:null;#r;#a;#i;#s=null;#n=null;#f=null;#o=null;#d=0;#c=0;#u=!1;#p=new Set;#h=new Set;#l=null;#x=$s(()=>(this.#l=oe(this.#d),u&&Se(this.#l,"$effect.pending()"),()=>{this.#l=null}));constructor(t,r,n,o){this.#e=t,this.#r=r,this.#a=i=>{var s=x;s.b=this,s.f|=128,n(i)},this.parent=x.b,this.transform_error=o??this.parent?.transform_error??(i=>i),this.#i=pe(()=>{if(h){let i=this.#t;q();let s=i.data==="[!";if(i.data.startsWith("[?")){let f=JSON.parse(i.data.slice("[?".length));this.#w(f)}else s?this.#b():this.#v()}else this.#y()},$f),h&&(this.#e=y)}#v(){try{this.#s=te(()=>this.#a(this.#e))}catch(t){this.error(t)}}#w(t){let r=this.#r.failed;r&&(this.#f=te(()=>{r(this.#e,()=>t,()=>()=>{})}))}#b(){let t=this.#r.pending;t&&(this.is_pending=!0,this.#n=te(()=>t(this.#e)),W(()=>{var r=this.#o=document.createDocumentFragment(),n=J();r.append(n),this.#s=this.#g(()=>te(()=>this.#a(n))),this.#c===0&&(this.#e.before(r),this.#o=null,ft(this.#n,()=>{this.#n=null}),this.#_(E))}))}#y(){try{if(this.is_pending=this.has_pending_snippet(),this.#c=0,this.#d=0,this.#s=te(()=>{this.#a(this.#e)}),this.#c>0){var t=this.#o=document.createDocumentFragment();dr(this.#s,t);let r=this.#r.pending;this.#n=te(()=>r(this.#e))}else this.#_(E)}catch(r){this.error(r)}}#_(t){this.is_pending=!1,t.transfer_effects(this.#p,this.#h)}defer_effect(t){wn(t,this.#p,this.#h)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#r.pending}#g(t){var r=x,n=b,o=T;K(this.#i),le(this.#i),xt(this.#i.ctx);try{return Re.ensure(),t()}catch(i){return xn(i),null}finally{K(r),le(n),xt(o)}}#m(t,r){if(!this.has_pending_snippet()){this.parent&&this.parent.#m(t,r);return}this.#c+=t,this.#c===0&&(this.#_(r),this.#n&&ft(this.#n,()=>{this.#n=null}),this.#o&&(this.#e.before(this.#o),this.#o=null))}update_pending_count(t,r){this.#m(t,r),this.#d+=t,!(!this.#l||this.#u)&&(this.#u=!0,W(()=>{this.#u=!1,this.#l&&De(this.#l,this.#d)}))}get_effect_pending(){return this.#x(),$(this.#l)}error(t){if(!this.#r.onerror&&!this.#r.failed)throw t;E?.is_fork?(this.#s&&E.skip_effect(this.#s),this.#n&&E.skip_effect(this.#n),this.#f&&E.skip_effect(this.#f),E.oncommit(()=>{this.#E(t)})):this.#E(t)}#E(t){this.#s&&(z(this.#s),this.#s=null),this.#n&&(z(this.#n),this.#n=null),this.#f&&(z(this.#f),this.#f=null),h&&(S(this.#t),ao(),S(Be()));var r=this.#r.onerror;let n=this.#r.failed;var o=!1,i=!1;let s=()=>{if(o){cs();return}o=!0,i&&zi(),this.#f!==null&&ft(this.#f,()=>{this.#f=null}),this.#g(()=>{this.#y()})},a=f=>{try{i=!0,r?.(f,s),i=!1}catch(l){We(l,this.#i&&this.#i.parent)}n&&(this.#f=this.#g(()=>{try{return te(()=>{var l=x;l.b=this,l.f|=128,n(this.#e,()=>f,()=>s)})}catch(l){return We(l,this.#i.parent),null}}))};W(()=>{var f;try{f=this.transform_error(t)}catch(l){We(l,this.#i&&this.#i.parent);return}f!==null&&typeof f=="object"&&typeof f.then=="function"?f.then(a,l=>We(l,this.#i&&this.#i.parent)):a(f)})}};function Sf(){x===null&&Oi();var e=x.b;return e===null?0:e.get_effect_pending()}function Lt(e,t,r,n){let o=ze()?yt:Xt;var i=e.filter(_=>!_.settled),s=t.map(o);if(u&&s.forEach((_,m)=>{_.label=t[m].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\\$\\.get\\((.+?)\\)/g,(g,v)=>v)}),r.length===0&&i.length===0){n(s);return}var a=x,f=Mr(),l=i.length===1?i[0].promise:i.length>1?Promise.all(i.map(_=>_.promise)):null;function d(_){if((a.f&16384)===0){f();try{n([...s,..._])}catch(m){We(m,a)}lt()}}var p=Sn();if(r.length===0){l.then(()=>d([])).finally(p);return}function c(){Promise.all(r.map(_=>go(_))).then(d).catch(_=>We(_,a)).finally(p)}l?l.then(()=>{f(),c(),lt()}):c()}function vo(e,t){Lt(e,[],[],t)}function Mr(){var e=x,t=b,r=T,n=E;if(u)var o=Ne;return function(s=!0){K(e),le(t),xt(r),s&&(e.f&16384)===0&&(n?.activate(),n?.apply()),u&&(Mt(null),cr(o))}}async function Nf(e){var t=Mr(),r=await e;return()=>(t(),r)}async function An(e){var t=ye;queueMicrotask(()=>{ye===t&&Mt(null)});var r=await e;return()=>(Mt(t),queueMicrotask(()=>{ye===t&&Mt(null)}),r)}async function*kf(e){let t=e[Symbol.asyncIterator]?.()??e[Symbol.iterator]?.();if(t===void 0)throw new TypeError("value is not async iterable");let r=!0;try{for(;;){let{done:o,value:i}=(await An(t.next()))();if(o){r=!1;break}var n=ye;try{yield i}catch(s){throw Mt(n),t.return!==void 0&&(await An(t.return()))(),s}Mt(n)}}catch(o){throw r=!1,o}finally{if(r&&t.return!==void 0)return(await An(t.return()))().value}}function lt(e=!0){K(null),le(null),xt(null),e&&E?.deactivate(),u&&(Mt(null),cr(null))}function Rf(e){let t=Mr(),r=Sn();var n=x,o=null;let i=l=>{o={error:l},$n(n)||We(l,n)};var s=Promise.resolve(e[0]()).catch(i),a={promise:s,settled:!1},f=[a];s.finally(()=>{a.settled=!0,lt()});for(let l of e.slice(1)){s=s.then(()=>{t();try{if(o)throw o.error;if($n(n))throw dt;return l()}finally{lt()}}).catch(i);let d={promise:s,settled:!1};f.push(d),s.finally(()=>{d.settled=!0,lt()})}return s.then(()=>Promise.resolve()).finally(r),f}function Cf(e){return Promise.all(e.map(t=>t.promise))}function Sn(){var e=x,t=e.b,r=E,n=!!t?.is_rendered();return t?.update_pending_count(1,r),r.increment(n,e),()=>{t?.update_pending_count(-1,r),r.decrement(n,e)}}var ye=null;function Mt(e){ye=e}var Lr=new Set;function yt(e){var t=2050;x!==null&&(x.f|=524288);let r={ctx:T,deps:null,effects:null,equals:dn,f:t,fn:e,reactions:null,rv:0,v:D,wv:0,parent:x,ac:null};return u&&Je&&(r.created=Ge("created at")),r}var mr=Symbol("obsolete");function go(e,t,r){let n=x;n===null&&Ti();var o=void 0,i=oe(D);u&&(i.label=t??e.toString());var s=!b,a=new Set;return Rs(()=>{var f=x;u&&(ye={effect:f,effect_deps:new Set,warned:!1});var l=fn();o=l.promise;try{Promise.resolve(e()).then(l.resolve,_=>{_!==dt&&l.reject(_)}).finally(lt)}catch(_){l.reject(_),lt()}if(u){if(ye){if(f.deps!==null)for(let _=0;_<Ie;_+=1)ye.effect_deps.add(f.deps[_]);if(be!==null)for(let _=0;_<be.length;_+=1)ye.effect_deps.add(be[_])}ye=null}var d=E;if(s){if((f.f&32768)!==0)var p=Sn();if(n.b?.is_rendered())d.async_deriveds.get(f)?.reject(mr);else for(let _ of a.values())_.reject(mr);a.add(l),d.async_deriveds.set(f,l)}let c=(_,m=void 0)=>{u&&(ye=null),p?.(),a.delete(l),m!==mr&&(d.activate(),m?(i.f|=8388608,De(i,m)):((i.f&8388608)!==0&&(i.f^=8388608),u&&r!==void 0&&!i.equals(_)&&(Lr.add(i),setTimeout(()=>{Lr.has(i)&&(f.f&16384)===0&&(Xi(i.label,r),Lr.delete(i))})),De(i,_)),d.deactivate())};l.promise.then(c,_=>c(null,_||"unknown"))}),Y(()=>{for(let f of a)f.reject(mr)}),u&&(i.f|=4194304),new Promise(f=>{function l(d){function p(){d===o?f(i):l(o)}d.then(p,p)}l(o)})}function Of(e){let t=yt(e);return Z||kn(t),t}function Xt(e){let t=yt(e);return t.equals=hn,t}function Ns(e){var t=e.effects;if(t!==null){e.effects=null;for(var r=0;r<t.length;r+=1)z(t[r])}}var xo=[];function Pr(e){var t,r=x,n=e.parent;if(!Ue&&n!==null&&e.v!==D&&(n.f&24576)!==0)return Qi(),e.v;if(K(n),u){let o=Zt;Fr(new Set);try{St.call(xo,e)&&Si(),xo.push(e),e.f&=-65537,Ns(e),t=Nn(e)}finally{K(r),Fr(o),xo.pop()}}else try{e.f&=-65537,Ns(e),t=Nn(e)}finally{K(r)}return t}function wo(e){var t=Pr(e);if(!e.equals(t)&&(e.wv=Ft(),(!E?.is_fork||e.deps===null)&&(E!==null?(E.capture(e,t,!0),ct?.capture(e,t,!0)):e.v=t,e.deps===null))){P(e,1024);return}Ue||(ie!==null?(gt()||E?.is_fork)&&ie.set(e,t):_r(e))}function ks(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac?.abort(dt),t.fn!==null&&(t.teardown=ue),t.ac=null,Jt(t,0),Yr(t))}function yo(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&tt(t)}var Rn=null,hr=null,E=null,ct=null,ie=null,Ao=null,Dt=!1,bo=!1,Qt=null,Br=null,Cs=0,Eo=new Set,Df=1,Re=class e{id=Df++;#e=!1;linked=!0;#t=null;#r=null;async_deriveds=new Map;current=new Map;previous=new Map;#a=new Set;#i=new Set;#s=0;#n=new Map;#f=null;#o=[];#d=[];#c=new Set;#u=new Set;#p=new Map;#h=new Set;is_fork=!1;#l=!1;constructor(){hr===null?Rn=hr=this:(hr.#r=this,this.#t=hr),hr=this}#x(){if(this.is_fork)return!0;for(let n of this.#n.keys()){for(var t=n,r=!1;t.parent!==null;){if(this.#p.has(t)){r=!0;break}t=t.parent}if(!r)return!0}return!1}skip_effect(t){this.#p.has(t)||this.#p.set(t,{d:[],m:[]}),this.#h.delete(t)}unskip_effect(t,r=n=>this.schedule(n)){var n=this.#p.get(t);if(n){this.#p.delete(t);for(var o of n.d)P(o,2048),r(o);for(o of n.m)P(o,4096),r(o)}this.#h.add(t)}#v(){if(this.#e=!0,Cs++>1e3&&(this.#m(),If()),u)for(let f of this.current.keys())Eo.add(f);for(let f of this.#c)this.#u.delete(f),P(f,2048),this.schedule(f);for(let f of this.#u)P(f,4096),this.schedule(f);let t=this.#o;this.#o=[],this.apply();var r=Qt=[],n=[],o=Br=[];for(let f of t)try{this.#w(f,r,n)}catch(l){throw Ls(f),this.#x()||this.discard(),l}if(E=null,o.length>0){var i=e.ensure();for(let f of o)i.schedule(f)}if(Qt=null,Br=null,this.#x()){this.#_(n),this.#_(r);for(let[f,l]of this.#p)Ms(f,l);o.length>0&&E.#v();return}let s=this.#b();if(s){this.#_(n),this.#_(r),s.#y(this);return}this.#c.clear(),this.#u.clear();for(let f of this.#a)f(this);this.#a.clear(),ct=this,Os(n),Os(r),ct=null,this.#f?.resolve();var a=E;if(this.#s===0&&(this.#o.length===0||a!==null)&&(this.#m(),Z&&(this.#g(),E=a)),this.#o.length>0)if(a!==null){let f=a;f.#o.push(...this.#o.filter(l=>!f.#o.includes(l)))}else a=this;a!==null&&a.#v()}#w(t,r,n){t.f^=1024;for(var o=t.first;o!==null;){var i=o.f,s=(i&96)!==0,a=s&&(i&1024)!==0,f=a||(i&8192)!==0||this.#p.has(o);if(!f&&o.fn!==null){s?o.f^=1024:(i&4)!==0?r.push(o):Z&&(i&16777224)!==0?n.push(o):Tt(o)&&((i&16)!==0&&this.#u.add(o),tt(o));var l=o.first;if(l!==null){o=l;continue}}for(;o!==null;){var d=o.next;if(d!==null){o=d;break}o=o.parent}}}#b(){for(var t=this.#t;t!==null;){if(!t.is_fork){for(let[r,[,n]]of this.current)if(t.current.has(r)&&!n)return t}t=t.#t}return null}#y(t){for(let[n,o]of t.current)!this.previous.has(n)&&t.previous.has(n)&&this.previous.set(n,t.previous.get(n)),this.current.set(n,o);for(let[n,o]of t.async_deriveds){let i=this.async_deriveds.get(n);i&&o.promise.then(i.resolve).catch(i.reject)}t.async_deriveds.clear(),this.transfer_effects(t.#c,t.#u);let r=n=>{var o=n.reactions;if(o!==null)for(let a of o){var i=a.f;if((i&2)!==0)r(a);else{var s=a;i&4194320&&!this.async_deriveds.has(s)&&(this.#u.delete(s),P(s,2048),this.schedule(s))}}};for(let n of this.current.keys())r(n);this.oncommit(()=>t.discard()),t.#m(),E=this,this.#v()}#_(t){for(var r=0;r<t.length;r+=1)wn(t[r],this.#c,this.#u)}capture(t,r,n=!1){t.v!==D&&!this.previous.has(t)&&this.previous.set(t,t.v),(t.f&8388608)===0&&(this.current.set(t,[r,n]),ie?.set(t,r)),this.is_fork||(t.v=r)}activate(){E=this}deactivate(){E=null,ie=null}flush(){try{u&&Eo.clear(),bo=!0,E=this,this.#v()}finally{if(Cs=0,Ao=null,Qt=null,Br=null,bo=!1,E=null,ie=null,Et.clear(),u)for(let t of Eo)t.updated=null}}discard(){for(let t of this.#i)t(this);this.#i.clear();for(let t of this.async_deriveds.values())t.reject(mr);this.#m(),this.#f?.resolve()}register_created_effect(t){this.#d.push(t)}#g(){for(let p=Rn;p!==null;p=p.#r){var t=p.id<this.id,r=[];for(let[c,[_,m]]of this.current){if(p.current.has(c)){var n=p.current.get(c)[0];if(t&&_!==n)p.current.set(c,[_,m]);else continue}r.push(c)}if(t)for(let[c,_]of this.async_deriveds){let m=p.async_deriveds.get(c);m&&_.promise.then(m.resolve).catch(m.reject)}var o=[...p.current.keys()].filter(c=>!p.current.get(c)[1]);if(!(!p.#e||o.length===0)){var i=o.filter(c=>!this.current.has(c));if(i.length===0)t&&p.discard();else if(r.length>0){if(u&&!p.#l&&hs(p.#o.length===0,"Batch has scheduled roots"),t)for(let c of this.#h)p.unskip_effect(c,_=>{(_.f&4194320)!==0?p.schedule(_):p.#_([_])});p.activate();var s=new Set,a=new Map;for(var f of r)Ds(f,i,s,a);a=new Map;var l=[...p.current].filter(([c,_])=>{let m=this.current.get(c);return m?m[0]!==_[0]||m[1]!==_[1]:!0}).map(([c])=>c);if(l.length>0)for(let c of this.#d)(c.f&155648)===0&&$o(c,l,a)&&((c.f&4194320)!==0?(P(c,2048),p.schedule(c)):p.#c.add(c));if(p.#o.length>0&&!p.#l){p.apply();for(var d of p.#o)p.#w(d,[],[]);p.#o=[]}p.deactivate()}}}}increment(t,r){if(this.#s+=1,t){let n=this.#n.get(r)??0;this.#n.set(r,n+1)}}decrement(t,r){if(this.#s-=1,t){let n=this.#n.get(r)??0;n===1?this.#n.delete(r):this.#n.set(r,n-1)}this.#l||(this.#l=!0,W(()=>{this.#l=!1,this.linked&&this.flush()}))}transfer_effects(t,r){for(let n of t)this.#c.add(n);for(let n of r)this.#u.add(n);t.clear(),r.clear()}oncommit(t){this.#a.add(t)}ondiscard(t){this.#i.add(t)}settled(){return(this.#f??=fn()).promise}static ensure(){if(E===null){let t=E=new e;!bo&&!Dt&&W(()=>{t.#e||t.flush()})}return E}apply(){if(!Z||!this.is_fork&&this.#t===null&&this.#r===null){ie=null;return}ie=new Map;for(let[r,[n]]of this.current)ie.set(r,n);for(let r=Rn;r!==null;r=r.#r)if(!(r===this||r.is_fork)){var t=!1;if(r.id<this.id){for(let[n,[,o]]of r.current)if(!o&&this.current.has(n)){t=!0;break}}if(!t)for(let[n,o]of r.previous)ie.has(n)||ie.set(n,o)}}schedule(t){if(Ao=t,t.b?.is_pending&&(t.f&16777228)!==0&&(t.f&32768)===0){t.b.defer_effect(t);return}for(var r=t;r.parent!==null;){r=r.parent;var n=r.f;if(Qt!==null&&r===x&&(Z||(b===null||(b.f&2)===0)&&!bn))return;if((n&96)!==0){if((n&1024)===0)return;r.f^=1024}}this.#o.push(r)}#m(){if(this.linked){var t=this.#t,r=this.#r;t===null?Rn=r:t.#r=r,r===null?hr=t:r.#t=t,this.linked=!1}}};function rt(e){var t=Dt;Dt=!0;try{var r;for(e&&(E!==null&&!E.is_fork&&E.flush(),r=e());;){if(ys(),E===null)return r;E.flush()}}finally{Dt=t}}function If(){if(u){var e=new Map;for(let r of E.current.keys())for(let[n,o]of r.updated??[]){var t=e.get(n);t||(t={error:o.error,count:0},e.set(n,t)),t.count+=o.count}for(let r of e.values())r.error&&console.error(r.error)}try{Di()}catch(r){u&&ce(r,"stack",{value:""}),We(r,Ao)}}var Xe=null;function Os(e){var t=e.length;if(t!==0){for(var r=0;r<t;){var n=e[r++];if((n.f&24576)===0&&Tt(n)&&(Xe=new Set,tt(n),n.deps===null&&n.first===null&&n.nodes===null&&n.teardown===null&&n.ac===null&&So(n),Xe?.size>0)){Et.clear();for(let o of Xe){if((o.f&24576)!==0)continue;let i=[o],s=o.parent;for(;s!==null;)Xe.has(s)&&(Xe.delete(s),i.push(s)),s=s.parent;for(let a=i.length-1;a>=0;a--){let f=i[a];(f.f&24576)===0&&tt(f)}}Xe.clear()}}Xe=null}}function Ds(e,t,r,n){if(!r.has(e)&&(r.add(e),e.reactions!==null))for(let o of e.reactions){let i=o.f;(i&2)!==0?Ds(o,t,r,n):(i&4194320)!==0&&(i&2048)===0&&$o(o,t,n)&&(P(o,2048),Hr(o))}}function Is(e,t){if(e.reactions!==null)for(let r of e.reactions){let n=r.f;(n&2)!==0?Is(r,t):(n&131072)!==0&&(P(r,2048),t.add(r))}}function $o(e,t,r){let n=r.get(e);if(n!==void 0)return n;if(e.deps!==null)for(let o of e.deps){if(St.call(t,o))return!0;if((o.f&2)!==0&&$o(o,t,r))return r.set(o,!0),!0}return r.set(e,!1),!1}function Hr(e){E.schedule(e)}var Cn=[];function Mf(){rt(()=>{let e=Cn;Cn=[];for(let t of e)gr(t)})}var To=new Map;function Lf(e){var t=!0,r=void 0;if(b===null)return e();let n=b,o=To.get(n)??oe(0);return To.set(n,o),Y(()=>{n.f&33554432&&To.delete(n)}),$(o),On(()=>{if(t){var i=ie;try{ie=null,r=e()}finally{ie=i}return}Cn.length===0&&W(Mf),Cn.push(o)}),t=!1,r}function Ms(e,t){if(!((e.f&32)!==0&&(e.f&1024)!==0)){(e.f&2048)!==0?t.d.push(e):(e.f&4096)!==0&&t.m.push(e),P(e,1024);for(var r=e.first;r!==null;)Ms(r,t),r=r.next}}function Ls(e){P(e,1024);for(var t=e.first;t!==null;)Ls(t),t=t.next}function Ff(e){Z||_n("fork"),E!==null&&Mi();var t=Re.ensure();t.is_fork=!0,ie=new Map;var r=!1,n=t.settled();return rt(e),{commit:async()=>{if(r){await n;return}t.linked||Ii(),r=!0,t.is_fork=!1;for(var[o,[i]]of t.current)o.v=i,o.wv=Ft();rt(()=>{var s=new Set;for(var a of t.current.keys())Is(a,s);Fr(s),Vr()}),t.flush(),await n},discard:()=>{for(var o of t.current.keys())o.wv=Ft();!r&&t.linked&&t.discard()}}}var Zt=new Set,Et=new Map;function Fr(e){Zt=e}var No=!1;function Fs(){No=!0}function oe(e,t){var r={f:0,v:e,reactions:null,equals:dn,rv:0,wv:0};return u&&Je&&(r.created=t??Ge("created at"),r.updated=null,r.set_during_effect=!1,r.trace=null),r}function ut(e,t){let r=oe(e,t);return kn(r),r}function at(e,t=!1,r=!0){let n=oe(e);return t||(n.equals=hn),vt&&r&&T!==null&&T.l!==null&&(T.l.s??=[]).push(n),n}function Pf(e,t){return ne(e,k(()=>$(e))),t}function ne(e,t,r=!1){b!==null&&(!Me||(b.f&131072)!==0)&&ze()&&(b.f&4325394)!==0&&(nt===null||!nt.has(e))&&Gi();let n=r?At(t):t;return u&&vn(n,e.label),De(e,n,Br)}function De(e,t,r=null){if(!e.equals(t)){Et.set(e,Ue?t:e.v);var n=Re.ensure();if(n.capture(e,t),u){if(Je||x!==null){e.updated??=new Map;let o=(e.updated.get("")?.count??0)+1;if(e.updated.set("",{error:null,count:o}),Je||o>5){let i=Ge("updated at");if(i!==null){let s=e.updated.get(i.stack);s||(s={error:i,count:0},e.updated.set(i.stack,s)),s.count++}}}x!==null&&(e.set_during_effect=!0)}if((e.f&2)!==0){let o=e;(e.f&2048)!==0&&Pr(o),ie===null&&_r(o)}e.wv=Ft(),Ps(e,2048,r),ze()&&x!==null&&(x.f&1024)!==0&&(x.f&96)===0&&(qe===null?Ys([e]):qe.push(e)),!n.is_fork&&Zt.size>0&&!No&&Vr()}return t}function Vr(){No=!1;for(let e of Zt){(e.f&1024)!==0&&P(e,4096);let t;try{t=Tt(e)}catch{t=!0}t&&tt(e)}Zt.clear()}function gr(e,t=1){var r=$(e),n=t===1?r++:r--;return ne(e,r),n}function Yf(e,t=1){var r=$(e);return ne(e,t===1?++r:--r)}function Kt(e){ne(e,e.v+1)}function Ps(e,t,r){var n=e.reactions;if(n!==null)for(var o=ze(),i=n.length,s=0;s<i;s++){var a=n[s],f=a.f;if(!(!o&&a===x)){var l=(f&2048)===0;if(l&&P(a,t),(f&131072)!==0)Zt.add(a);else if((f&2)!==0){var d=a;ie?.delete(d),(f&65536)===0&&(f&512&&(x===null||(x.f&2097152)===0)&&(a.f|=65536),Ps(d,4096,r))}else if(l){var p=a;(f&16)!==0&&Xe!==null&&Xe.add(p),r!==null?r.push(p):Hr(p)}}}}var Bf=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function At(e){if(typeof e!="object"||e===null||G in e)return e;let t=Nt(e);if(t!==an&&t!==_i)return e;var r=new Map,n=Ye(e),o=ut(0),i=u&&Je?Ge("created at"):null,s=Pt,a=p=>{if(Pt===s)return p();var c=b,_=Pt;le(null),ko(s);var m=p();return le(c),ko(_),m};n&&(r.set("length",ut(e.length,i)),u&&(e=Vf(e)));var f="";let l=!1;function d(p){if(!l){l=!0,f=p,Se(o,`${f} version`);for(let[c,_]of r)Se(_,er(f,c));l=!1}}return new Proxy(e,{defineProperty(p,c,_){(!("value"in _)||_.configurable===!1||_.enumerable===!1||_.writable===!1)&&qi();var m=r.get(c);return m===void 0?a(()=>{var g=ut(_.value,i);return r.set(c,g),u&&typeof c=="string"&&Se(g,er(f,c)),g}):ne(m,_.value,!0),!0},deleteProperty(p,c){var _=r.get(c);if(_===void 0){if(c in p){let m=a(()=>ut(D,i));r.set(c,m),Kt(o),u&&Se(m,er(f,c))}}else ne(_,D),Kt(o);return!0},get(p,c,_){if(c===G)return e;if(u&&c===ln)return d;var m=r.get(c),g=c in p;if(m===void 0&&(!g||_e(p,c)?.writable)&&(m=a(()=>{var w=At(g?p[c]:D),A=ut(w,i);return u&&Se(A,er(f,c)),A}),r.set(c,m)),m!==void 0){var v=$(m);return v===D?void 0:v}return Reflect.get(p,c,_)},getOwnPropertyDescriptor(p,c){var _=Reflect.getOwnPropertyDescriptor(p,c);if(_&&"value"in _){var m=r.get(c);m&&(_.value=$(m))}else if(_===void 0){var g=r.get(c),v=g?.v;if(g!==void 0&&v!==D)return{enumerable:!0,configurable:!0,value:v,writable:!0}}return _},has(p,c){if(c===G)return!0;var _=r.get(c),m=_!==void 0&&_.v!==D||Reflect.has(p,c);if(_!==void 0||x!==null&&(!m||_e(p,c)?.writable)){_===void 0&&(_=a(()=>{var v=m?At(p[c]):D,w=ut(v,i);return u&&Se(w,er(f,c)),w}),r.set(c,_));var g=$(_);if(g===D)return!1}return m},set(p,c,_,m){var g=r.get(c),v=c in p;if(n&&c==="length")for(var w=_;w<g.v;w+=1){var A=r.get(w+"");A!==void 0?ne(A,D):w in p&&(A=a(()=>ut(D,i)),r.set(w+"",A),u&&Se(A,er(f,w)))}if(g===void 0)(!v||_e(p,c)?.writable)&&(g=a(()=>ut(void 0,i)),u&&Se(g,er(f,c)),ne(g,At(_)),r.set(c,g));else{v=g.v!==D;var R=a(()=>At(_));ne(g,R)}var C=Reflect.getOwnPropertyDescriptor(p,c);if(C?.set&&C.set.call(m,_),!v){if(n&&typeof c=="string"){var F=r.get("length"),se=Number(c);Number.isInteger(se)&&se>=F.v&&ne(F,se+1)}Kt(o)}return!0},ownKeys(p){$(o);var c=Reflect.ownKeys(p).filter(g=>{var v=r.get(g);return v===void 0||v.v!==D});for(var[_,m]of r)m.v!==D&&!(_ in p)&&c.push(_);return c},setPrototypeOf(){ji()}})}function er(e,t){return typeof t=="symbol"?`${e}[Symbol(${t.description??""})]`:Bf.test(t)?`${e}.${t}`:/^\\d+$/.test(t)?`${e}[${t}]`:`${e}[\'${t}\']`}function pt(e){try{if(e!==null&&typeof e=="object"&&G in e)return e[G]}catch{}return e}function Dn(e,t){return Object.is(pt(e),pt(t))}var Hf=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function Vf(e){return new Proxy(e,{get(t,r,n){var o=Reflect.get(t,r,n);return Hf.has(r)?function(...i){Fs();var s=o.apply(this,i);return Vr(),s}:o}})}function Bs(){let e=Array.prototype,t=Array.__svelte_cleanup;t&&t();let{indexOf:r,lastIndexOf:n,includes:o}=e;e.indexOf=function(i,s){let a=r.call(this,i,s);if(a===-1){for(let f=s??0;f<this.length;f+=1)if(pt(this[f])===i){fr("array.indexOf(...)");break}}return a},e.lastIndexOf=function(i,s){let a=n.call(this,i,s??this.length-1);if(a===-1){for(let f=0;f<=(s??this.length-1);f+=1)if(pt(this[f])===i){fr("array.lastIndexOf(...)");break}}return a},e.includes=function(i,s){let a=o.call(this,i,s);if(!a){for(let f=0;f<this.length;f+=1)if(pt(this[f])===i){fr("array.includes(...)");break}}return a},Array.__svelte_cleanup=()=>{e.indexOf=r,e.lastIndexOf=n,e.includes=o}}function Uf(e,t,r=!0){try{e===t!=(pt(e)===pt(t))&&fr(r?"===":"!==")}catch{}return e===t===r}function qf(e,t,r=!0){return e==t!=(pt(e)==pt(t))&&fr(r?"==":"!="),e==t===r}var Ro,Hs,pr,Vs,Us;function In(){if(Ro===void 0){Ro=window,Hs=document,pr=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,r=Text.prototype;Vs=_e(t,"firstChild").get,Us=_e(t,"nextSibling").get,eo(e)&&(e[kr]=void 0,e[cn]=null,e[Rr]=void 0,e.__e=void 0),eo(r)&&(r[Cr]=void 0),u&&(e.__svelte_meta=null,Bs())}}function J(e=""){return document.createTextNode(e)}function M(e){return Vs.call(e)}function fe(e){return Us.call(e)}function jf(e,t){if(!h)return M(e);var r=M(y);if(r===null)r=y.appendChild(J());else if(t&&r.nodeType!==Ut){var n=J();return r?.before(n),S(n),n}return t&&Ur(r),S(r),r}function Gf(e,t=!1){if(!h){var r=M(e);return r instanceof Comment&&r.data===""?fe(r):r}if(t){if(y?.nodeType!==Ut){var n=J();return y?.before(n),S(n),n}Ur(y)}return y}function zf(e,t=1,r=!1){let n=h?y:e;for(var o;t--;)o=n,n=fe(n);if(!h)return n;if(r){if(n?.nodeType!==Ut){var i=J();return n===null?o?.after(i):n.before(i),S(i),i}Ur(n)}return S(n),n}function wr(e){e.textContent=""}function Mn(){if(!Z||Xe!==null)return!1;var e=x.f;return(e&32768)!==0}function Le(e,t,r){return t==null||t===rn?r?document.createElement(e,{is:r}):document.createElement(e):r?document.createElementNS(t,e,{is:r}):document.createElementNS(t,e)}function qs(){return document.createDocumentFragment()}function Ln(e=""){return document.createComment(e)}function js(e,t,r=""){if(t.startsWith("xlink:")){e.setAttributeNS("http://www.w3.org/1999/xlink",t,r);return}return e.setAttribute(t,r)}function Ur(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===Ut;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}function Co(e,t){if(t){let r=document.body;e.autofocus=!0,W(()=>{document.activeElement===r&&e.focus()})}}function Wf(e){h&&M(e)!==null&&wr(e)}var Gs=!1;function Fn(){Gs||(Gs=!0,document.addEventListener("reset",e=>{Promise.resolve().then(()=>{if(!e.defaultPrevented)for(let t of e.target.elements)t[Rt]?.()})},{capture:!0}))}function ge(e,t,r,n=!0){n&&r();for(var o of t)e.addEventListener(o,r);Y(()=>{for(var i of t)e.removeEventListener(i,r)})}function je(e){var t=b,r=x;le(null),K(null);try{return e()}finally{le(t),K(r)}}function tr(e,t,r,n=r){e.addEventListener(t,()=>je(r));let o=e[Rt];o?e[Rt]=()=>{o(),n(!0)}:e[Rt]=()=>n(!0),Fn()}function Pn(e){x===null&&(b===null&&Ci(e),Ri()),Ue&&ki(e)}function Kf(e,t){var r=t.last;r===null?t.last=t.first=e:(r.next=e,e.prev=r,t.last=e)}function Fe(e,t){var r=x;if(u)for(;r!==null&&(r.f&131072)!==0;)r=r.parent;r!==null&&(r.f&8192)!==0&&(e|=8192);var n={ctx:T,deps:null,nodes:null,f:e|2048|512,first:null,fn:t,last:null,next:null,parent:r,b:r&&r.b,prev:null,teardown:null,wv:0,ac:null};u&&(n.component_function=Ce),E?.register_created_effect(n);var o=n;if((e&4)!==0)Qt!==null?Qt.push(n):Re.ensure().schedule(n);else if(t!==null){try{tt(n)}catch(s){throw z(n),s}o.deps===null&&o.teardown===null&&o.nodes===null&&o.first===o.last&&(o.f&524288)===0&&(o=o.first,(e&16)!==0&&(e&65536)!==0&&o!==null&&(o.f|=65536))}if(o!==null&&(o.parent=r,r!==null&&Kf(o,r),b!==null&&(b.f&2)!==0&&(e&64)===0)){var i=b;(i.effects??=[]).push(o)}return n}function gt(){return b!==null&&!Me}function Y(e){let t=Fe(8,null);return P(t,1024),t.teardown=e,t}function yr(e){Pn("$effect"),u&&ce(e,"name",{value:"$effect"});var t=x.f,r=!b&&(t&32)!==0&&T!==null&&!T.i;if(r){var n=T;(n.e??=[]).push(e)}else return uo(e)}function uo(e){return Fe(1048580,e)}function qr(e){return Pn("$effect.pre"),u&&ce(e,"name",{value:"$effect.pre"}),Fe(1048584,e)}function On(e){return Fe(131072,e)}function Io(e){Re.ensure();let t=Fe(524352,e);return()=>{z(t)}}function Ws(e){Re.ensure();let t=Fe(524352,e);return(r={})=>new Promise(n=>{r.outro?ft(t,()=>{z(t),n(void 0)}):(z(t),n(void 0))})}function re(e){return Fe(4,e)}function Xf(e,t){var r=T,n={effect:null,ran:!1,deps:e};r.l.$.push(n),n.effect=I(()=>{if(e(),!n.ran){n.ran=!0;var o=x;try{K(o.parent),k(t)}finally{K(o)}}})}function Zf(){var e=T;I(()=>{for(var t of e.l.$){t.deps();var r=t.effect;(r.f&1024)!==0&&r.deps!==null&&P(r,4096),Tt(r)&&tt(r),t.ran=!1}})}function Rs(e){return Fe(4718592,e)}function I(e,t=0){return Fe(8|t,e)}function Mo(e,t=[],r=[],n=[]){Lt(n,t,r,o=>{Fe(8,()=>{e(...o.map($))})})}function Jf(e,t=[],r=[],n=[]){Lt(n,t,r,o=>{Fe(4,()=>e(...o.map($)))})}function pe(e,t=0){var r=Fe(16|t,e);return u&&(r.dev_stack=Ne),r}function Yn(e,t=0){var r=Fe(16777216|t,e);return u&&(r.dev_stack=Ne),r}function te(e){return Fe(524320,e)}function Lo(e){var t=e.teardown;if(t!==null){let r=Ue,n=b;Oo(!0),le(null);try{t.call(null)}finally{Oo(r),le(n)}}}function Yr(e,t=!1){var r=e.first;for(e.first=e.last=null;r!==null;){let o=r.ac;o!==null&&je(()=>{o.abort(dt)});var n=r.next;(r.f&64)!==0?r.parent=null:z(r,t),r=n}}function Ks(e){for(var t=e.first;t!==null;){var r=t.next;(t.f&32)===0&&z(t),t=r}}function z(e,t=!0){var r=!1;(t||(e.f&262144)!==0)&&e.nodes!==null&&e.nodes.end!==null&&(Fo(e.nodes.start,e.nodes.end),r=!0),e.f|=33554432,Yr(e,t&&!r),Jt(e,0);var n=e.nodes&&e.nodes.t;if(n!==null)for(let i of n)i.stop();Lo(e),e.f^=33554432,e.f|=16384;var o=e.parent;o!==null&&o.first!==null&&So(e),u&&(e.component_function=null),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=e.b=null}function Fo(e,t){for(;e!==null;){var r=e===t?null:fe(e);e.remove(),e=r}}function So(e){var t=e.parent,r=e.prev,n=e.next;r!==null&&(r.next=n),n!==null&&(n.prev=r),t!==null&&(t.first===e&&(t.first=n),t.last===e&&(t.last=r))}function ft(e,t,r=!0){var n=[];Xs(e,n,!0);var o=()=>{r&&z(e),t&&t()},i=n.length;if(i>0){var s=()=>--i||o();for(var a of n)a.out(s)}else o()}function Xs(e,t,r){if((e.f&8192)===0){e.f^=8192;var n=e.nodes&&e.nodes.t;if(n!==null)for(let a of n)(a.is_global||r)&&t.push(a);for(var o=e.first;o!==null;){var i=o.next;if((o.f&64)===0){var s=(o.f&65536)!==0||(o.f&32)!==0&&(e.f&16)!==0;Xs(o,t,s?r:!1)}o=i}}}function br(e){Zs(e,!0)}function Zs(e,t){if((e.f&8192)!==0){e.f^=8192,(e.f&1024)===0&&(P(e,2048),Re.ensure().schedule(e));for(var r=e.first;r!==null;){var n=r.next,o=(r.f&65536)!==0||(r.f&32)!==0;Zs(r,o?t:!1),r=n}var i=e.nodes&&e.nodes.t;if(i!==null)for(let s of i)(s.is_global||t)&&s.in()}}function $n(e=x){return(e.f&16384)!==0}function dr(e,t){if(e.nodes)for(var r=e.nodes.start,n=e.nodes.end;r!==null;){var o=r===n?null:fe(r);t.append(r),r=o}}var rr=null;function Qf(e){var t=rr;try{if(rr=new Set,k(e),t!==null)for(var r of rr)t.add(r);return rr}finally{rr=t}}function el(e){for(var t of Qf(e))De(t,t.v)}var Bn=!1,Ue=!1;function Oo(e){Ue=e}var b=null,Me=!1;function le(e){b=e}var x=null;function K(e){x=e}var nt=null;function kn(e){b!==null&&(!Z||(b.f&2)!==0)&&(nt??=new Set).add(e)}var be=null,Ie=0,qe=null;function Ys(e){qe=e}var Js=1,nr=0,Pt=nr;function ko(e){Pt=e}function Ft(){return++Js}function Tt(e){var t=e.f;if((t&2048)!==0)return!0;if(t&2&&(e.f&=-65537),(t&4096)!==0){for(var r=e.deps,n=r.length,o=0;o<n;o++){var i=r[o];if(Tt(i)&&wo(i),i.wv>e.wv)return!0}(t&512)!==0&&ie===null&&P(e,1024)}return!1}function Qs(e,t,r=!0){var n=e.reactions;if(n!==null&&!(!Z&&nt!==null&&nt.has(e)))for(var o=0;o<n.length;o++){var i=n[o];(i.f&2)!==0?Qs(i,t,!1):t===i&&(r?P(i,2048):(i.f&1024)!==0&&P(i,4096),Hr(i))}}function Nn(e){var t=be,r=Ie,n=qe,o=b,i=nt,s=T,a=Me,f=Pt,l=e.f;be=null,Ie=0,qe=null,b=(l&96)===0?e:null,nt=null,xt(e.ctx),Me=!1,Pt=++nr,e.ac!==null&&(je(()=>{e.ac.abort(dt)}),e.ac=null);try{e.f|=2097152;var d=e.fn,p=d();e.f|=32768;var c=e.deps,_=E?.is_fork;if(be!==null){var m;if(_||Jt(e,Ie),c!==null&&Ie>0)for(c.length=Ie+be.length,m=0;m<be.length;m++)c[Ie+m]=be[m];else e.deps=c=be;if(gt()&&(e.f&512)!==0)for(m=Ie;m<c.length;m++)(c[m].reactions??=[]).push(e)}else!_&&c!==null&&Ie<c.length&&(Jt(e,Ie),c.length=Ie);if(ze()&&qe!==null&&!Me&&c!==null&&(e.f&6146)===0)for(m=0;m<qe.length;m++)Qs(qe[m],e);if(o!==null&&o!==e){if(nr++,o.deps!==null)for(let g=0;g<r;g+=1)o.deps[g].rv=nr;if(t!==null)for(let g of t)g.rv=nr;qe!==null&&(n===null?n=qe:n.push(...qe))}return(e.f&8388608)!==0&&(e.f^=8388608),p}catch(g){return xn(g)}finally{e.f^=2097152,be=t,Ie=r,qe=n,b=o,nt=i,xt(s),Me=a,Pt=f}}function tl(e,t){let r=t.reactions;if(r!==null){var n=pi.call(r,e);if(n!==-1){var o=r.length-1;o===0?r=t.reactions=null:(r[n]=r[o],r.pop())}}if(r===null&&(t.f&2)!==0&&(be===null||!St.call(be,t))){var i=t;(i.f&512)!==0&&(i.f^=512,i.f&=-65537),i.v!==D&&_r(i),ks(i),Jt(i,0)}}function Jt(e,t){var r=e.deps;if(r!==null)for(var n=t;n<r.length;n++)tl(e,r[n])}function tt(e){var t=e.f;if((t&16384)===0){P(e,1024);var r=x,n=Bn;if(x=e,Bn=!0,u){var o=Ce;ur(e.component_function);var i=Ne;cr(e.dev_stack??Ne)}try{(t&16777232)!==0?Ks(e):Yr(e),Lo(e);var s=Nn(e);if(e.teardown=typeof s=="function"?s:null,e.wv=Js,u&&Je&&(e.f&2048)!==0&&e.deps!==null)for(var a of e.deps)a.set_during_effect&&(a.wv=Ft(),a.set_during_effect=!1)}finally{Bn=n,x=r,u&&(ur(o),cr(i))}}}async function Vn(){if(Z)return new Promise(e=>{requestAnimationFrame(()=>e()),setTimeout(()=>e())});await Promise.resolve(),rt()}function rl(){return Re.ensure().settled()}function $(e){var t=e.f,r=(t&2)!==0;if(rr?.add(e),b!==null&&!Me){var n=x!==null&&(x.f&16384)!==0;if(!n&&(nt===null||!nt.has(e))){var o=b.deps;if((b.f&2097152)!==0)e.rv<nr&&(e.rv=nr,be===null&&o!==null&&o[Ie]===e?Ie++:be===null?be=[e]:be.push(e));else{b.deps??=[],St.call(b.deps,e)||b.deps.push(e);var i=e.reactions;i===null?e.reactions=[b]:St.call(i,b)||i.push(b)}}}if(u){if(!Me&&ye&&E===null&&ct===null&&!ye.warned&&(ye.effect.f&2097152)===0&&!ye.effect_deps.has(e)){ye.warned=!0,Ki(e.label);var s=Ge("traced at");s&&console.warn(s)}if(Lr.delete(e),Je&&!Me&&Qe!==null&&b!==null&&Qe.reaction===b){if(e.trace)e.trace();else if(s=Ge("traced at"),s){var a=Qe.entries.get(e);a===void 0&&(a={traces:[]},Qe.entries.set(e,a));var f=a.traces[a.traces.length-1];s.stack!==f?.stack&&a.traces.push(s)}}}if(Ue&&Et.has(e))return Et.get(e);if(r){var l=e;if(Ue){var d=l.v;return((l.f&1024)===0&&l.reactions!==null||ta(l))&&(d=Pr(l)),Et.set(l,d),d}var p=(l.f&512)===0&&!Me&&b!==null&&(Bn||(b.f&512)!==0),c=(l.f&32768)===0;Tt(l)&&(p&&(l.f|=512),wo(l)),p&&!c&&(yo(l),ea(l))}if(ie?.has(e))return ie.get(e);if((e.f&8388608)!==0)throw e.v;return e.v}function ea(e){if(e.f|=512,e.deps!==null)for(let t of e.deps)(t.reactions??=[]).push(e),(t.f&2)!==0&&(t.f&512)===0&&(yo(t),ea(t))}function ta(e){if(e.v===D)return!0;if(e.deps===null)return!1;for(let t of e.deps)if(Et.has(t)||(t.f&2)!==0&&ta(t))return!0;return!1}function nl(e){return e&&$(e)}function k(e){var t=Me;try{return Me=!0,e()}finally{Me=t}}function jr(e){if(!(typeof e!="object"||!e||e instanceof EventTarget)){if(G in e)Hn(e);else if(!Array.isArray(e))for(let t in e){let r=e[t];typeof r=="object"&&r&&G in r&&Hn(r)}}}function Hn(e,t=new Set){if(typeof e=="object"&&e!==null&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let n in e)try{Hn(e[n],t)}catch{}let r=Nt(e);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){let n=sn(r);for(let o in n){let i=n[o].get;if(i)try{i.call(e)}catch{}}}}}function ol(e,t){if(Z||_n("hydratable"),h){let r=window.__svelte?.h;if(r?.has(e))return r.get(e);u?Fi(e):ts(e)}return t()}var Gr=Symbol("events"),Po=new Set,Un=new Set;function il(e){if(!h)return;e.removeAttribute("onload"),e.removeAttribute("onerror");let t=e.__e;t!==void 0&&(e.__e=void 0,queueMicrotask(()=>{e.isConnected&&e.dispatchEvent(t)}))}function Yo(e,t,r,n={}){function o(i){if(n.capture||qn.call(t,i),!i.cancelBubble)return je(()=>r?.call(this,i))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?W(()=>{t.addEventListener(e,o,n)}):t.addEventListener(e,o,n),o}function sl(e,t,r,n,o){var i={capture:n,passive:o},s=Yo(e,t,r,i);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&Y(()=>{t.removeEventListener(e,s,i)})}function Bo(e,t,r){(t[Gr]??={})[e]=r}function Ho(e){for(var t=0;t<e.length;t++)Po.add(e[t]);for(var r of Un)r(e)}var ra=null;function qn(e){var t=this,r=t.ownerDocument,n=e.type,o=e.composedPath?.()||[],i=o[0]||e.target;ra=e;var s=0,a=ra===e&&e[Gr];if(a){var f=o.indexOf(a);if(f!==-1&&(t===document||t===window)){e[Gr]=t;return}var l=o.indexOf(t);if(l===-1)return;f<=l&&(s=f)}if(i=o[s]||e.target,i!==t){ce(e,"currentTarget",{configurable:!0,get(){return i||r}});var d=b,p=x;le(null),K(null);try{for(var c,_=[];i!==null&&i!==t;){try{var m=i[Gr]?.[n];m!=null&&(!i.disabled||e.target===i)&&m.call(i,e)}catch(g){c?_.push(g):c=g}if(e.cancelBubble)break;s++,i=s<o.length?o[s]:null}if(c){for(let g of _)queueMicrotask(()=>{throw g});throw c}}finally{e[Gr]=t,delete e.currentTarget,le(d),K(p)}}}function al(e,t,r,n,o,i=!1,s=!1){let a,f;try{a=e()}catch(l){f=l}if(typeof a!="function"&&(i||a!=null||f)){let l=n?.[U],d=o?` at ${l}:${o[0]}:${o[1]}`:` in ${l}`,p=r[0]?.eventPhase<Event.BUBBLING_PHASE?"capture":"",_=`\\`${r[0]?.type+p}\\` handler${d}`;if(es(_,s?"remove the trailing `()`":"add a leading `() =>`"),f)throw f}a?.apply(t,r)}var fl=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:e=>e});function Vo(e){return fl?.createHTML(e)??e}function zr(e){var t=Le("template");return t.innerHTML=Vo(e.replaceAll("<!>","<!---->")),t.content}var ul=mt?"template":"TEMPLATE",pl=mt?"script":"SCRIPT";function X(e,t){var r=x;r.nodes===null&&(r.nodes={start:e,end:t,a:null,t:null})}function _l(e,t){var r=(t&1)!==0,n=(t&2)!==0,o,i=!e.startsWith("<!>");return()=>{if(h)return X(y,null),y;o===void 0&&(o=zr(i?e:"<!>"+e),r||(o=M(o)));var s=n||pr?document.importNode(o,!0):o.cloneNode(!0);if(r){var a=M(s),f=s.lastChild;X(a,f)}else X(s,s);return s}}function oa(e,t,r="svg"){var n=!e.startsWith("<!>"),o=(t&1)!==0,i=`<${r}>${n?e:"<!>"+e}</${r}>`,s;return()=>{if(h)return X(y,null),y;if(!s){var a=zr(i),f=M(a);if(o)for(s=document.createDocumentFragment();M(f);)s.appendChild(M(f));else s=M(f)}var l=s.cloneNode(!0);if(o){var d=M(l),p=l.lastChild;X(d,p)}else X(l,l);return l}}function dl(e,t){return oa(e,t,"svg")}function ml(e,t){return oa(e,t,"math")}function ia(e,t){var r=qs();for(var n of e){if(typeof n=="string"){r.append(J(n));continue}if(n===void 0||n[0][0]==="/"){r.append(Ln(n?n[0].slice(3):""));continue}let[a,f,...l]=n,d=a==="svg"?$t:a==="math"?Sr:t;var o=Le(a,d,f?.is);for(var i in f)js(o,i,f[i]);if(l.length>0){var s=o.nodeName===ul?o.content:o;s.append(ia(l,o.nodeName==="foreignObject"?void 0:d))}r.append(o)}return r}function hl(e,t){var r=(t&1)!==0,n=(t&2)!==0,o;return()=>{if(h)return X(y,null),y;if(o===void 0){let f=(t&4)!==0?$t:(t&8)!==0?Sr:void 0;o=ia(e,f),r||(o=M(o))}var i=n||pr?document.importNode(o,!0):o.cloneNode(!0);if(r){var s=M(i),a=i.lastChild;X(s,a)}else X(i,i);return i}}function vl(e){return()=>gl(e())}function gl(e){if(h)return e;let t=e.nodeType===pn,r=e.nodeName===pl?[e]:e.querySelectorAll("script"),n=x;for(let i of r){let s=Le("script");for(var o of i.attributes)s.setAttribute(o.name,o.value);s.textContent=i.textContent,(t?e.firstChild===i:e===i)&&(n.nodes.start=s),(t?e.lastChild===i:e===i)&&(n.nodes.end=s),i.replaceWith(s)}return e}function xl(e=""){if(!h){var t=J(e+"");return X(t,t),t}var r=y;return r.nodeType!==Ut?(r.before(r=J()),S(r)):Ur(r),X(r,r),r}function wl(){if(h)return X(y,null),y;var e=document.createDocumentFragment(),t=document.createComment(""),r=J();return e.append(t,r),X(t,r),e}function qo(e,t){if(h){var r=x;((r.f&32768)===0||r.nodes.end===null)&&(r.nodes.end=y),q();return}e!==null&&e.before(t)}function yl(){if(h&&y&&y.nodeType===$e&&y.textContent?.startsWith("$")){let e=y.textContent.substring(1);return q(),e}return(window.__svelte??={}).uid??=1,`c${window.__svelte.uid++}`}var bl=/\\r/g;function sa(e){e=e.replace(bl,"");let t=5381,r=e.length;for(;r--;)t=(t<<5)-t^e.charCodeAt(r);return(t>>>0).toString(36)}var El=["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"];function aa(e){return El.includes(e)||e.toLowerCase()==="!doctype"}function fa(e){return e.endsWith("capture")&&e!=="gotpointercapture"&&e!=="lostpointercapture"}var Tl=["beforeinput","click","change","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"];function la(e){return Tl.includes(e)}var Al=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var $l={formnovalidate:"formNoValidate",ismap:"isMap",nomodule:"noModule",playsinline:"playsInline",readonly:"readOnly",defaultvalue:"defaultValue",defaultchecked:"defaultChecked",srcobject:"srcObject",novalidate:"noValidate",allowfullscreen:"allowFullscreen",disablepictureinpicture:"disablePictureInPicture",disableremoteplayback:"disableRemotePlayback"};function ca(e){return e=e.toLowerCase(),$l[e]??e}var Eh=[...Al,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var Sl=["touchstart","touchmove"];function ua(e){return Sl.includes(e)}var Nl=["$state","$state.raw","$derived","$derived.by"],Th=[...Nl,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];var kl=["textarea","script","style","title"];function pa(e){return kl.includes(e)}function Er(e){return e?.replace(/\\//g,"/\\u200B")}var Wr=!0;function Yt(e){Wr=e}function Rl(e,t){var r=t==null?"":typeof t=="object"?`${t}`:t;r!==(e[Cr]??=e.nodeValue)&&(e[Cr]=r,e.nodeValue=`${r}`)}function Kr(e,t){return _a(e,t)}function Gn(e,t){In(),t.intro=t.intro??!1;let r=t.target,n=h,o=y;try{for(var i=M(r);i&&(i.nodeType!==$e||i.data!=="[");)i=fe(i);if(!i)throw it;O(!0),S(i);let s=_a(e,{...t,anchor:i});return O(!1),s}catch(s){if(s instanceof Error&&s.message.split(`\n`).some(a=>a.startsWith("https://svelte.dev/e/")))throw s;return s!==it&&console.warn("Failed to hydrate: ",s),t.recover===!1&&Pi(),In(),wr(r),O(!1),Kr(e,t)}finally{O(n),S(o)}}var jn=new Map;function _a(e,{target:t,anchor:r,props:n={},events:o,context:i,intro:s=!0,transformError:a}){In();var f=void 0,l=Ws(()=>{var d=r??t.appendChild(J());ho(d,{pending:()=>{}},_=>{lo({});var m=T;if(i&&(m.c=i),o&&(n.$$events=o),h&&X(_,null),Wr=s,f=e(_,n)||{},Wr=!0,h&&(x.nodes.end=y,y===null||y.nodeType!==$e||y.data!=="]"))throw Ct(),it;co()},a);var p=new Set,c=_=>{for(var m=0;m<_.length;m++){var g=_[m];if(!p.has(g)){p.add(g);var v=ua(g);for(let R of[t,document]){var w=jn.get(R);w===void 0&&(w=new Map,jn.set(R,w));var A=w.get(g);A===void 0?(R.addEventListener(g,qn,{passive:v}),w.set(g,1)):w.set(g,A+1)}}}};return c(ir(Po)),Un.add(c),()=>{for(var _ of p)for(let v of[t,document]){var m=jn.get(v),g=m.get(_);--g==0?(v.removeEventListener(_,qn),m.delete(_),m.size===0&&jn.delete(v)):m.set(_,g)}Un.delete(c),d!==r&&d.parentNode?.removeChild(d)}});return jo.set(f,l),f}var jo=new WeakMap;function zn(e,t){let r=jo.get(e);return r?(jo.delete(e),r(t)):(u&&(G in e?ls():is()),Promise.resolve())}function Cl(e){let t=e();t&&aa(t)&&_s(t)}function Ol(e){let t=e();t&&!(typeof t=="string")&&bi()}function Dl(e,t){e!=null&&typeof e.subscribe!="function"&&yi(t)}function Go(e){return e.toString=()=>(wi(),""),e}var Pe=class{anchor;#e=new Map;#t=new Map;#r=new Map;#a=new Set;#i=!0;constructor(t,r=!0){this.anchor=t,this.#i=r}#s=t=>{if(this.#e.has(t)){var r=this.#e.get(t),n=this.#t.get(r);if(n)br(n),this.#a.delete(r);else{var o=this.#r.get(r);o&&(br(o.effect),this.#t.set(r,o.effect),this.#r.delete(r),u&&(o.fragment.lastChild[un]=this.anchor),o.fragment.lastChild.remove(),this.anchor.before(o.fragment),n=o.effect)}for(let[i,s]of this.#e){if(this.#e.delete(i),i===t)break;let a=this.#r.get(s);a&&(z(a.effect),this.#r.delete(s))}for(let[i,s]of this.#t){if(i===r||this.#a.has(i))continue;let a=()=>{if(Array.from(this.#e.values()).includes(i)){var l=document.createDocumentFragment();dr(s,l),l.append(J()),this.#r.set(i,{effect:s,fragment:l})}else z(s);this.#a.delete(i),this.#t.delete(i)};this.#i||!n?(this.#a.add(i),ft(s,a,!1)):a()}}};#n=t=>{this.#e.delete(t);let r=Array.from(this.#e.values());for(let[n,o]of this.#r)r.includes(n)||(z(o.effect),this.#r.delete(n))};ensure(t,r){var n=E,o=Mn();if(r&&!this.#t.has(t)&&!this.#r.has(t))if(o){var i=document.createDocumentFragment(),s=J();i.append(s),this.#r.set(t,{effect:te(()=>r(s)),fragment:i})}else this.#t.set(t,te(()=>r(this.anchor)));if(this.#e.set(n,t),o){for(let[a,f]of this.#t)a===t?n.unskip_effect(f):n.skip_effect(f);for(let[a,f]of this.#r)a===t?n.unskip_effect(f.effect):n.skip_effect(f.effect);n.oncommit(this.#s),n.ondiscard(this.#n)}else h&&(this.anchor=y),this.#s(n)}};function Il(e,t,...r){var n=new Pe(e);pe(()=>{let o=t()??null;u&&o==null&&Yi(),n.ensure(o,o&&(i=>o(i,...r)))},65536)}function Ml(e,t){let r=(n,...o)=>{var i=Ce;ur(e);try{return t(n,...o)}finally{ur(i)}};return Go(r),r}function Ll(e){return(t,...r)=>{var n=e(...r),o;if(h)o=y,q();else{var i=n.render().trim(),s=zr(i);o=M(s),u&&(fe(o)!==null||o.nodeType!==ar)&&os(),t.before(o)}let a=n.setup?.(o);X(o,o),typeof a=="function"&&Y(a)}}if(u){let e=function(t){if(!(t in globalThis)){let r;Object.defineProperty(globalThis,t,{configurable:!0,get:()=>{if(r!==void 0)return r;Vi(t)},set:n=>{r=n}})}};e("$state"),e("$effect"),e("$derived"),e("$inspect"),e("$props"),e("$bindable")}function dv(){return b===null&&Li(),(b.ac??=new AbortController).signal}function Fl(e){T===null&&ht("onMount"),vt&&T.l!==null?zo(T).m.push(e):yr(()=>{let t=k(e);if(typeof t=="function")return t})}function mv(e){T===null&&ht("onDestroy"),Fl(()=>()=>k(e))}function Pl(e,t,{bubbles:r=!1,cancelable:n=!1}={}){return new CustomEvent(e,{detail:t,bubbles:r,cancelable:n})}function hv(){let e=T;return e===null&&ht("createEventDispatcher"),(t,r,n)=>{let o=e.s.$$events?.[t];if(o){let i=Ye(o)?o.slice():[o],s=Pl(t,r,n);for(let a of i)a.call(e.x,s);return!s.defaultPrevented}return!0}}function vv(e){T===null&&ht("beforeUpdate"),T.l===null&&io("beforeUpdate"),zo(T).b.push(e)}function gv(e){T===null&&ht("afterUpdate"),T.l===null&&io("afterUpdate"),zo(T).a.push(e)}function zo(e){var t=e.l;return t.u??={a:[],b:[],m:[]}}function Yl(){return Symbol(nn)}function da(e,t,r,n){return e!==t&&typeof t=="object"&&G in t&&Wi(r,Er(n)),e}function Bl(e,t,r,n,o){return da(r==="="?e[t]=n:r==="&&="?e[t]&&=n():r==="||="?e[t]||=n():r==="??="?e[t]??=n():null,k(()=>e[t]),t,o)}async function Hl(e,t,r,n,o){return da(r==="="?e[t]=await n:r==="&&="?e[t]&&=await n():r==="||="?e[t]||=await n():r==="??="?e[t]??=await n():null,k(()=>e[t]),t,o)}var Wn=new Map;function ma(e,t){var r=Wn.get(e);r||(r=new Set,Wn.set(e,r)),r.add(t)}function Vl(e){var t=Wn.get(e);if(t){for(let r of t)r.remove();Wn.delete(e)}}function Ul(e,t,r){return(...n)=>{let o=e(...n);var i=h?o:o.nodeType===pn?o.firstChild:o;return ha(i,t,r),o}}function ql(e,t,r){e.__svelte_meta={parent:Ne,loc:{file:t,line:r[0],column:r[1]}},r[2]&&ha(e.firstChild,t,r[2])}function ha(e,t,r){for(var n=0,o=0;e&&n<r.length;){if(h&&e.nodeType===$e){var i=e;i.data[0]==="["?o+=1:i.data[0]==="]"&&(o-=1)}o===0&&e.nodeType===ar&&ql(e,t,r[n++]),e=e.nextSibling}}function jl(e){let t=oe(e);function r(n,o){let i={},s={},a,f=!1,l=n;return pe(()=>{if(i!==(i=$(t))){if(a){for(var d in s)delete s[d];z(a)}a=te(()=>{l=l[un]??l,f&&Yt(!1);var p=new.target?new i(l,o):i(l,o);p&&Object.defineProperties(s,Object.getOwnPropertyDescriptors(p)),f&&Yt(!0)}),x.nodes=a.nodes}},65536),f=!0,h&&(l=y),s}return r[U]=e[U],r[Ht]={fn:e,current:t,update:n=>{ne(r[Ht].current,n[Ht].fn),n[Ht].current=r[Ht].current}},r}function Gl(e){let t=T?.function,r=T?.p?.function;return{mutation:(n,o,i,s,a)=>{let f=o[0];if(va(e,f)||!r)return i;let l=e;for(let p=0;p<o.length-1;p++)if(l=l[o[p]],!l?.[G])return i;let d=Er(`${t[U]}:${s}:${a}`);return as(f,d,n,r[U]),i},binding:(n,o,i)=>{!va(e,n)&&r&&i()?.[G]&&ss(t[U],n,o[U],r[U])}}}function va(e,t){let r=G in e||Vt in e;return!!_e(e,t)?.set||r&&t in e||!(t in e)}function zl(e){e&&$i(e[U]??"a component",e.name)}function Wl(){let e=T?.function;function t(r){Ai(r,e[U])}return{$destroy:()=>t("$destroy()"),$on:()=>t("$on(...)"),$set:()=>t("$set(...)")}}function Kl(e,t,r=!1){Pn("$inspect");let n=!0,o=D;On(()=>{o=D;try{var i=e()}catch(a){o=a;return}var s=Ot(i,!0,!0);k(()=>{if(r){if(t(...s),!n){let a=Ge("$inspect(...)");a&&(console.groupCollapsed("stack trace"),console.log(a),console.groupEnd())}}else t(n?"init":"update",...s)}),n=!1}),I(()=>{try{e()}catch{}o!==D&&(console.error(o),o=D)})}function Xl(e,t=[],r=[],n){var o=h,i=null;if(o&&(q(),i=Be(!1),X(e,i)),r.length===0&&t.every(a=>a.settled)){n(e),o&&S(i);return}if(o){var s=y;S(i)}Lt(t,[],r,a=>{o&&(O(!0),S(s));try{for(let f of a)$(f);n(e,...a)}finally{o&&O(!1)}})}function Zl(e,...t){(typeof e!="object"||!(e instanceof Node))&&ro();for(let r of t)typeof r!="function"&&ro()}var ga=0,xa=1,Jl=2;function Ql(e,t,r,n,o){h&&q();var i=ze(),s=D,a=i?oe(s):at(s,!1,!1),f=i?oe(s):at(s,!1,!1);u&&(a.label="{#await ...} value",f.label="{#await ...} error");var l=new Pe(e);pe(()=>{var d=E,p=t(),c=!1;let _=h&&to(p)===(e.data==="[!");if(_&&(S(Be()),O(!1)),to(p)){var m=Mr(),g=!1;let v=w=>{if(!c){g=!0,m(!1),E===d&&d.deactivate(),Re.ensure();try{w()}finally{lt(!1),Dt||rt()}}};p.then(w=>{v(()=>{De(a,w),l.ensure(xa,n&&(A=>n(A,a)))})},w=>{v(()=>{if(De(f,w),l.ensure(Jl,o&&(A=>o(A,f))),!o)throw f.v})}),h?l.ensure(ga,r):W(()=>{g||v(()=>{l.ensure(ga,r)})})}else De(a,p),l.ensure(xa,n&&(v=>n(v,a)));return _&&O(!0),()=>{c=!0}})}function ec(e,t,r=!1){var n;h&&(n=y,q());var o=new Pe(e),i=r?65536:0;function s(a,f){if(h){var l=lr(n);if(a!==parseInt(l.substring(1))){var d=Be();S(d),o.anchor=d,O(!1),o.ensure(a,f),O(!0);return}}o.ensure(a,f)}pe(()=>{var a=!1;t((f,l=0)=>{a=!0,s(l,f)}),a||s(-1,null)},i)}var tc=Symbol("NaN");function rc(e,t,r){h&&q();var n=new Pe(e),o=!ze();pe(()=>{var i=t();i!==i&&(i=tc),o&&i!==null&&typeof i=="object"&&(i={}),n.ensure(i,r)})}function nc(e,t){h&&S(M(e)),I(()=>{var r=t();for(var n in r){var o=r[n];o?e.style.setProperty(n,o):e.style.removeProperty(n)}})}function fc(e,t){return t}function lc(e,t,r){for(var n=[],o=t.length,i,s=t.length,a=0;a<o;a++){let p=t[a];ft(p,()=>{if(i){if(i.pending.delete(p),i.done.add(p),i.pending.size===0){var c=e.outrogroups;Wo(e,ir(i.done)),c.delete(i),c.size===0&&(e.outrogroups=null)}}else s-=1},!1)}if(s===0){var f=n.length===0&&r!==null;if(f){var l=r,d=l.parentNode;wr(d),d.append(l),e.items.clear()}Wo(e,t,!f)}else i={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(i)}function Wo(e,t,r=!0){var n;if(e.pending.size>0){n=new Set;for(let s of e.pending.values())for(let a of s)n.add(e.items.get(a).e)}for(var o=0;o<t.length;o++){var i=t[o];if(n?.has(i)){i.f|=33554432;let s=document.createDocumentFragment();dr(i,s)}else z(t[o],r)}}var wa;function cc(e,t,r,n,o,i=null){var s=e,a=new Map,f=(t&4)!==0;if(f){var l=e;s=h?S(M(l)):l.appendChild(J())}h&&q();var d=null,p=Xt(()=>{var R=r();return Ye(R)?R:R==null?[]:ir(R)});u&&Se(p,"{#each ...}");var c,_=new Map,m=!0;function g(R){(A.effect.f&16384)===0&&(A.pending.delete(R),A.fallback=d,uc(A,c,s,t,n),d!==null&&(c.length===0?(d.f&33554432)===0?br(d):(d.f^=33554432,Zr(d,null,s)):ft(d,()=>{d=null})))}function v(R){A.pending.delete(R)}var w=pe(()=>{c=$(p);var R=c.length;let C=!1;if(h){var F=lr(s)==="[!";F!==(R===0)&&(s=Be(),S(s),O(!1),C=!0)}for(var se=new Set,N=E,L=Mn(),V=0;V<R;V+=1){h&&y.nodeType===$e&&y.data==="]"&&(s=y,C=!0,O(!1));var Q=c[V],ae=n(Q,V);if(u){var tn=n(Q,V);ae!==tn&&Ni(String(V),String(ae),String(tn))}var Ze=m?null:a.get(ae);Ze?(Ze.v&&De(Ze.v,Q),Ze.i&&De(Ze.i,V),L&&N.unskip_effect(Ze.e)):(Ze=pc(a,m?s:wa??=J(),Q,ae,V,o,t,r),m||(Ze.e.f|=33554432),a.set(ae,Ze)),se.add(ae)}if(R===0&&i&&!d&&(m?d=te(()=>i(s)):(d=te(()=>i(wa??=J())),d.f|=33554432)),R>se.size&&(u?_c(c,n):oo("","","")),h&&R>0&&S(Be()),!m)if(_.set(N,se),L){for(let[ef,tf]of a)se.has(ef)||N.skip_effect(tf.e);N.oncommit(g),N.ondiscard(v)}else g(N);C&&O(!0),$(p)}),A={effect:w,flags:t,items:a,pending:_,outrogroups:null,fallback:d};m=!1,h&&(s=y)}function Xr(e){for(;e!==null&&(e.f&32)===0;)e=e.next;return e}function uc(e,t,r,n,o){var i=(n&8)!==0,s=t.length,a=e.items,f=Xr(e.effect.first),l,d=null,p,c=[],_=[],m,g,v,w;if(i)for(w=0;w<s;w+=1)m=t[w],g=o(m,w),v=a.get(g).e,(v.f&33554432)===0&&(v.nodes?.a?.measure(),(p??=new Set).add(v));for(w=0;w<s;w+=1){if(m=t[w],g=o(m,w),v=a.get(g).e,e.outrogroups!==null)for(let Q of e.outrogroups)Q.pending.delete(v),Q.done.delete(v);if((v.f&8192)!==0&&(br(v),i&&(v.nodes?.a?.unfix(),(p??=new Set).delete(v))),(v.f&33554432)!==0)if(v.f^=33554432,v===f)Zr(v,null,r);else{var A=d?d.next:f;v===e.effect.last&&(e.effect.last=v.prev),v.prev&&(v.prev.next=v.next),v.next&&(v.next.prev=v.prev),Bt(e,d,v),Bt(e,v,A),Zr(v,A,r),d=v,c=[],_=[],f=Xr(d.next);continue}if(v!==f){if(l!==void 0&&l.has(v)){if(c.length<_.length){var R=_[0],C;d=R.prev;var F=c[0],se=c[c.length-1];for(C=0;C<c.length;C+=1)Zr(c[C],R,r);for(C=0;C<_.length;C+=1)l.delete(_[C]);Bt(e,F.prev,se.next),Bt(e,d,F),Bt(e,se,R),f=R,d=se,w-=1,c=[],_=[]}else l.delete(v),Zr(v,f,r),Bt(e,v.prev,v.next),Bt(e,v,d===null?e.effect.first:d.next),Bt(e,d,v),d=v;continue}for(c=[],_=[];f!==null&&f!==v;)(l??=new Set).add(f),_.push(f),f=Xr(f.next);if(f===null)continue}(v.f&33554432)===0&&c.push(v),d=v,f=Xr(v.next)}if(e.outrogroups!==null){for(let Q of e.outrogroups)Q.pending.size===0&&(Wo(e,ir(Q.done)),e.outrogroups?.delete(Q));e.outrogroups.size===0&&(e.outrogroups=null)}if(f!==null||l!==void 0){var N=[];if(l!==void 0)for(v of l)(v.f&8192)===0&&N.push(v);for(;f!==null;)(f.f&8192)===0&&f!==e.fallback&&N.push(f),f=Xr(f.next);var L=N.length;if(L>0){var V=(n&4)!==0&&s===0?r:null;if(i){for(w=0;w<L;w+=1)N[w].nodes?.a?.measure();for(w=0;w<L;w+=1)N[w].nodes?.a?.fix()}lc(e,N,V)}}i&&W(()=>{if(p!==void 0)for(v of p)v.nodes?.a?.apply()})}function pc(e,t,r,n,o,i,s,a){var f=(s&1)!==0?(s&16)===0?at(r,!1,!1):oe(r):null,l=(s&2)!==0?oe(o):null;return u&&f&&(f.trace=()=>{a()[l?.v??o]}),{v:f,i:l,e:te(()=>(i(t,f??r,l??o,a),()=>{e.delete(n)}))}}function Zr(e,t,r){if(e.nodes)for(var n=e.nodes.start,o=e.nodes.end,i=t&&(t.f&33554432)===0?t.nodes.start:r;n!==null;){var s=fe(n);if(i.before(n),n===o)return;n=s}}function Bt(e,t,r){t===null?e.effect.first=r:t.next=r,r===null?e.effect.last=t:r.prev=t}function _c(e,t){let r=new Map,n=e.length;for(let o=0;o<n;o++){let i=t(e[o],o);if(r.has(i)){let s=String(r.get(i)),a=String(o),f=String(i);f.startsWith("[object ")&&(f=null),oo(s,a,f)}r.set(i,o)}}function dc(e,t,r){if(!t||t===sa(String(r??"")))return;let n,o=e.__svelte_meta?.loc;o?n=`near ${o.file}:${o.line}:${o.column}`:Ce?.[U]&&(n=`in ${Ce[U]}`),ns(Er(n))}function mc(e,t,r=!1,n=!1,o=!1,i=!1){var s=e,a="";if(r){var f=e;h&&(s=S(M(f)))}Mo(()=>{var l=x;if(a===(a=t()??"")){h&&q();return}if(r&&!h){l.nodes=null,f.innerHTML=a,a!==""&&X(M(f),f.lastChild);return}if(l.nodes!==null&&(Fo(l.nodes.start,l.nodes.end),l.nodes=null),a!==""){if(h){for(var d=y.data,p=q(),c=p;p!==null&&(p.nodeType!==$e||p.data!=="");)c=p,p=fe(p);if(p===null)throw Ct(),it;u&&!i&&dc(p.parentNode,d,a),X(y,c),s=S(p);return}var _=n?$t:o?Sr:void 0,m=Le(n?"svg":o?"math":"template",_);m.innerHTML=a;var g=n||o?m:m.content;if(X(M(g),g.lastChild),n||o)for(;M(g);)s.before(M(g));else s.before(g)}})}function hc(e,t,r,n,o){h&&q();var i=t.$$slots?.[r],s=!1;i===!0&&(i=t[r==="default"?"children":r],s=!0),i===void 0?o!==null&&o(e):i(e,s?()=>n:n)}function vc(e){let t={};e.children&&(t.default=!0);for(let r in e.$$slots)t[r]=!0;return t}function gc(e,t,r){var n;h&&(n=y,q());var o=new Pe(e);pe(()=>{var i=t()??null;if(h){var s=lr(n),a=s==="[",f=i!==null;if(a!==f){var l=Be();S(l),o.anchor=l,O(!1),o.ensure(i,i&&(d=>r(d,i))),O(!0);return}}o.ensure(i,i&&(d=>r(d,i)))},65536)}var xc=on?()=>performance.now():()=>Date.now(),ot={tick:e=>(on?requestAnimationFrame:ue)(e),now:()=>xc(),tasks:new Set};function ba(){let e=ot.now();ot.tasks.forEach(t=>{t.c(e)||(ot.tasks.delete(t),t.f())}),ot.tasks.size!==0&&ot.tick(ba)}function Ea(e){let t;return ot.tasks.size===0&&ot.tick(ba),{promise:new Promise(r=>{ot.tasks.add(t={c:e,f:r})}),abort(){ot.tasks.delete(t)}}}function Kn(e,t){je(()=>{e.dispatchEvent(new CustomEvent(t))})}function Ec(e){if(e==="float")return"cssFloat";if(e==="offset")return"cssOffset";if(e.startsWith("--"))return e;let t=e.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(r=>r[0].toUpperCase()+r.slice(1)).join("")}function Ta(e){let t={},r=e.split(";");for(let n of r){let[o,i]=n.split(":");if(!o||i===void 0)break;let s=Ec(o.trim());t[s]=i.trim()}return t}var Tc=e=>e,Aa=null;function Ko(e){Aa=e}function Ac(e,t,r){var n=Aa??x,o=n.nodes,i,s,a,f=null;o.a??={element:e,measure(){i=this.element.getBoundingClientRect()},apply(){if(a?.abort(),s=this.element.getBoundingClientRect(),i.left!==s.left||i.right!==s.right||i.top!==s.top||i.bottom!==s.bottom){let l=t()(this.element,{from:i,to:s},r?.());a=Xn(this.element,l,void 0,1,()=>{},()=>{a?.abort(),a=void 0})}},fix(){if(!e.getAnimations().length){var{position:l,width:d,height:p}=getComputedStyle(e);if(l!=="absolute"&&l!=="fixed"){var c=e.style;f={position:c.position,width:c.width,height:c.height,transform:c.transform},c.position="absolute",c.width=d,c.height=p;var _=e.getBoundingClientRect();if(i.left!==_.left||i.top!==_.top){var m=`translate(${i.left-_.left}px, ${i.top-_.top}px)`;c.transform=c.transform?`${c.transform} ${m}`:m}}}},unfix(){if(f){var l=e.style;l.position=f.position,l.width=f.width,l.height=f.height,l.transform=f.transform}}},o.a.element=e}function $c(e,t,r,n){var o=(e&1)!==0,i=(e&2)!==0,s=o&&i,a=(e&4)!==0,f=s?"both":o?"in":"out",l,d=t.inert,p=t.style.overflow,c,_;function m(){return je(()=>l??=r()(t,n?.()??{},{direction:f}))}var g={is_global:a,in(){if(t.inert=d,!o){_?.abort(),_?.reset?.();return}i||c?.abort(),c=Xn(t,m(),_,1,()=>{Kn(t,"introstart")},()=>{Kn(t,"introend"),c?.abort(),c=l=void 0,t.style.overflow=p})},out(R){if(!i){R?.(),l=void 0;return}t.inert=!0,_=Xn(t,m(),c,0,()=>{Kn(t,"outrostart")},()=>{Kn(t,"outroend"),R?.()})},stop:()=>{c?.abort(),_?.abort()}},v=x;if((v.nodes.t??=[]).push(g),o&&Wr){var w=a;if(!w){for(var A=v.parent;A&&(A.f&65536)!==0;)for(;(A=A.parent)&&(A.f&16)===0;);w=!A||(A.f&32768)!==0}w&&re(()=>{k(()=>g.in())})}}function Xn(e,t,r,n,o,i){var s=n===1;if(kt(t)){var a,f=!1;return W(()=>{if(!f){var w=t({direction:s?"in":"out"});a=Xn(e,w,r,n,o,i)}}),{abort:()=>{f=!0,a?.abort()},deactivate:()=>a.deactivate(),reset:()=>a.reset(),t:()=>a.t()}}if(r?.deactivate(),!t?.duration&&!t?.delay)return o(),i(),{abort:ue,deactivate:ue,reset:ue,t:()=>n};let{delay:l=0,css:d,tick:p,easing:c=Tc}=t;var _=[];if(s&&r===void 0&&(p&&p(0,1),d)){var m=Ta(d(0,1));_.push(m,m)}var g=()=>1-n,v=e.animate(_,{duration:l,fill:"forwards"});return v.onfinish=()=>{v.cancel(),o();var w=r?.t()??1-n;r?.abort();var A=n-w,R=t.duration*Math.abs(A),C=[];if(R>0){var F=!1;if(d)for(var se=Math.ceil(R/16.666666666666668),N=0;N<=se;N+=1){var L=w+A*c(N/se),V=Ta(d(L,1-L));C.push(V),F||=V.overflow==="hidden"}F&&(e.style.overflow="hidden"),g=()=>{var Q=v.currentTime;return w+A*c(Q/R)},p&&Ea(()=>{if(v.playState!=="running")return!1;var Q=g();return p(Q,1-Q),!0})}v=e.animate(C,{duration:R,fill:"forwards"}),v.onfinish=()=>{g=()=>n,p?.(n,1-n),i()}},{abort:()=>{v&&(v.cancel(),v.effect=null,v.onfinish=ue)},deactivate:()=>{i=ue},reset:()=>{n===0&&p?.(1,0)},t:()=>g()}}function Sc(e,t,r,n,o,i){let s=h;h&&q();var a=u&&i&&T?.function[U],f=null;h&&y.nodeType===ar&&(f=y,q());var l=h?y:e,d=x,p=new Pe(l,!1);pe(()=>{let c=t()||null;var _=o?o():r||c==="svg"?$t:void 0;if(c===null){p.ensure(null,null),Yt(!0);return}return p.ensure(c,m=>{if(c){if(f=h?f:Le(c,_),u&&i&&(f.__svelte_meta={parent:Ne,loc:{file:a,line:i[0],column:i[1]}}),X(f,f),n){var g=null;h&&pa(c)&&f.append(g=document.createComment(""));var v=h?M(f):f.appendChild(J());h&&(v===null?O(!1):S(v)),Ko(d),n(f,v),g?.remove(),Ko(null)}x.nodes.end=f,m.before(f)}h&&S(m)}),Yt(!0),()=>{c&&Yt(!1)}},65536),Y(()=>{Yt(!0)}),s&&(O(!0),S(l))}function Nc(e,t){let r=null,n=h;var o;if(h){r=y;for(var i=M(document.head);i!==null&&(i.nodeType!==$e||i.data!==e);)i=fe(i);if(i===null)O(!1);else{var s=fe(i);i.remove(),S(s)}}h||(o=document.head.appendChild(J()));try{pe(()=>{var a=te(()=>t(o));a.f|=262144})}finally{n&&(O(!0),S(r))}}function kc(e,t){re(()=>{var r=e.getRootNode(),n=r.host?r:r.head??r.ownerDocument.head;if(!n.querySelector("#"+t.hash)){let o=Le("style");o.id=t.hash,o.textContent=t.code,n.appendChild(o),u&&ma(t.hash,o)}})}function Rc(e,t,r){re(()=>{var n=k(()=>t(e,r?.())||{});if(r&&n?.update){var o=!1,i={};I(()=>{var s=r();jr(s),o&&mn(i,s)&&(i=s,n.update(s))}),o=!0}if(n?.destroy)return()=>n.destroy()})}function Jr(e,t){var r=void 0,n;Yn(()=>{r!==(r=t())&&(n&&(z(n),n=null),r&&(n=te(()=>{re(()=>r(e))})))})}var Cc=/[&"<]/g,Oc=/[&<]/g;function $a(e,t){let r=String(e??""),n=t?Cc:Oc;n.lastIndex=0;let o="",i=0;for(;n.test(r);){let s=n.lastIndex-1,a=r[s];o+=r.substring(i,s)+(a==="&"?"&amp;":a===\'"\'?"&quot;":"&lt;"),i=s+1}return o+r.substring(i)}function Sa(e){var t,r,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(r=Sa(e[t]))&&(n&&(n+=" "),n+=r)}else for(r in e)e[r]&&(n&&(n+=" "),n+=r);return n}function Na(){for(var e,t,r=0,n="",o=arguments.length;r<o;r++)(e=arguments[r])&&(t=Sa(e))&&(n&&(n+=" "),n+=t);return n}var ka={translate:new Map([[!0,"yes"],[!1,"no"]])};function Dc(e,t,r=!1){if(e==="hidden"&&t!=="until-found"&&(r=!0),t==null||!t&&r)return"";let n=di.call(ka,e)&&ka[e].get(t)||t,o=r?\'=""\':`="${$a(n,!0)}"`;return` ${e}${o}`}function Zo(e){return typeof e=="object"?Na(e):e??""}var Ra=[...` 	\n\\r\\f\\xA0\\v\\uFEFF`];function Oa(e,t,r){var n=e==null?"":""+e;if(t&&(n=n?n+" "+t:t),r){for(var o of Object.keys(r))if(r[o])n=n?n+" "+o:o;else if(n.length)for(var i=o.length,s=0;(s=n.indexOf(o,s))>=0;){var a=s+i;(s===0||Ra.includes(n[s-1]))&&(a===n.length||Ra.includes(n[a]))?n=(s===0?"":n.substring(0,s))+n.substring(a+1):s=a}}return n===""?null:n}function Ca(e,t=!1){var r=t?" !important;":";",n="";for(var o of Object.keys(e)){var i=e[o];i!=null&&i!==""&&(n+=" "+o+": "+i+r)}return n}function Xo(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function Da(e,t){if(t){var r="",n,o;if(Array.isArray(t)?(n=t[0],o=t[1]):n=t,e){e=String(e).replaceAll(/\\s*\\/\\*.*?\\*\\/\\s*/g,"").trim();var i=!1,s=0,a=!1,f=[];n&&f.push(...Object.keys(n).map(Xo)),o&&f.push(...Object.keys(o).map(Xo));var l=0,d=-1;let g=e.length;for(var p=0;p<g;p++){var c=e[p];if(a?c==="/"&&e[p-1]==="*"&&(a=!1):i?i===c&&(i=!1):c==="/"&&e[p+1]==="*"?a=!0:c===\'"\'||c==="\'"?i=c:c==="("?s++:c===")"&&s--,!a&&i===!1&&s===0){if(c===":"&&d===-1)d=p;else if(c===";"||p===g-1){if(d!==-1){var _=Xo(e.substring(l,d).trim());if(!f.includes(_)){c!==";"&&p++;var m=e.substring(l,p).trim();r+=" "+m+";"}}l=p+1,d=-1}}}}return n&&(r+=Ca(n)),o&&(r+=Ca(o,!0)),r=r.trim(),r===""?null:r}return e==null?null:String(e)}function Jo(e,t,r,n,o,i){var s=e[kr];if(h||s!==r||s===void 0){var a=Oa(r,n,i);(!h||a!==e.getAttribute("class"))&&(a==null?e.removeAttribute("class"):t?e.className=a:e.setAttribute("class",a)),e[kr]=r}else if(i&&o!==i)for(var f in i){var l=!!i[f];(o==null||l!==!!o[f])&&e.classList.toggle(f,l)}return i}function Qo(e,t={},r,n){for(var o in r){var i=r[o];t[o]!==i&&(r[o]==null?e.style.removeProperty(o):e.style.setProperty(o,i,n))}}function ei(e,t,r,n){var o=e[Rr];if(h||o!==t){var i=Da(t,n);(!h||i!==e.getAttribute("style"))&&(i==null?e.removeAttribute("style"):e.style.cssText=i),e[Rr]=t}else n&&(Array.isArray(n)?(Qo(e,r?.[0],n[0]),Qo(e,r?.[1],n[1],"important")):Qo(e,r,n));return n}function Tr(e,t,r=!1){if(e.multiple){if(t==null)return;if(!Ye(t))return fs();for(var n of e.options)n.selected=t.includes(Qr(n));return}for(n of e.options){var o=Qr(n);if(Dn(o,t)){n.selected=!0;return}}(!r||t!==void 0)&&(e.selectedIndex=-1)}function Zn(e){var t=new MutationObserver(()=>{Tr(e,e.__value)});t.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),Y(()=>{t.disconnect()})}function Ic(e,t,r=t){var n=new WeakSet,o=!0;tr(e,"change",i=>{var s=i?"[selected]":":checked",a;if(e.multiple)a=[].map.call(e.querySelectorAll(s),Qr);else{var f=e.querySelector(s)??e.querySelector("option:not([disabled])");a=f&&Qr(f)}r(a),e.__value=a,E!==null&&n.add(E)}),re(()=>{var i=t();if(e===document.activeElement){var s=Z?ct:E;if(n.has(s))return}if(Tr(e,i,o),o&&i===void 0){var a=e.querySelector(":checked");a!==null&&(i=Qr(a),r(i))}e.__value=i,o=!1}),Zn(e)}function Qr(e){return"__value"in e?e.__value:e.value}var Ar=Symbol("class"),$r=Symbol("style"),La=Symbol("is custom element"),Fa=Symbol("is html"),Mc=mt?"link":"LINK",Ia=mt?"input":"INPUT",Lc=mt?"option":"OPTION",Fc=mt?"select":"SELECT",Pc=mt?"progress":"PROGRESS";function Pa(e){if(h){var t=!1,r=()=>{if(!t){if(t=!0,e.hasAttribute("value")){var n=e.value;or(e,"value",null),e.value=n}if(e.hasAttribute("checked")){var o=e.checked;or(e,"checked",null),e.checked=o}}};e[Rt]=r,W(r),Fn()}}function Yc(e,t){var r=Jn(e);r.value===(r.value=t??void 0)||e.value===t&&(t!==0||e.nodeName!==Pc)||(e.value=t??"")}function Bc(e,t){var r=Jn(e);r.checked!==(r.checked=t??void 0)&&(e.checked=t)}function Ya(e,t){t?e.hasAttribute("selected")||e.setAttribute("selected",""):e.removeAttribute("selected")}function Hc(e,t){let r=e.checked;e.defaultChecked=t,e.checked=r}function Vc(e,t){let r=e.value;e.defaultValue=t,e.value=r}function or(e,t,r,n){var o=Jn(e);if(h&&(o[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName===Mc)){n||zc(e,t,r??"");return}o[t]!==(o[t]=r)&&(t==="loading"&&(e[hi]=r),r==null?e.removeAttribute(t):typeof r!="string"&&ni(e).includes(t)?e[t]=r:e.setAttribute(t,r))}function Uc(e,t,r){e.setAttributeNS("http://www.w3.org/1999/xlink",t,r)}function qc(e,t,r){var n=b,o=x;let i=h;h&&O(!1),le(null),K(null);try{t!=="style"&&(ti.has(e.getAttribute("is")||e.nodeName)||!customElements||customElements.get(e.getAttribute("is")||e.nodeName.toLowerCase())?ni(e).includes(t):r&&typeof r=="object")?e[t]=r:or(e,t,r==null?r:String(r))}finally{le(n),K(o),i&&O(!0)}}function jc(e,t,r,n,o=!1,i=!1){if(h&&o&&e.nodeName===Ia){var s=e,a=s.type==="checkbox"?"defaultChecked":"defaultValue";a in r||Pa(s)}var f=Jn(e),l=f[La],d=!f[Fa];let p=h&&l;p&&O(!1);var c=t||{},_=e.nodeName===Lc;for(var m in t)m in r||(r[m]=null);r.class?r.class=Zo(r.class):(n||r[Ar])&&(r.class=null),r[$r]&&(r.style??=null);var g=ni(e);if(e.nodeName===Ia&&"type"in r&&("value"in r||"__value"in r)){var v=r.type;(v!==c.type||v===void 0&&e.hasAttribute("type"))&&(c.type=v,or(e,"type",v,i))}for(let N in r){let L=r[N];if(_&&N==="value"&&L==null){e.value=e.__value="",c[N]=L;continue}if(N==="class"){var w=e.namespaceURI==="http://www.w3.org/1999/xhtml";Jo(e,w,L,n,t?.[Ar],r[Ar]),c[N]=L,c[Ar]=r[Ar];continue}if(N==="style"){ei(e,L,t?.[$r],r[$r]),c[N]=L,c[$r]=r[$r];continue}var A=c[N];if(!(L===A&&!(L===void 0&&e.hasAttribute(N)))){c[N]=L;var R=N[0]+N[1];if(R!=="$$")if(R==="on"){let V={},Q="$$"+N,ae=N.slice(2);var C=la(ae);if(fa(ae)&&(ae=ae.slice(0,-7),V.capture=!0),!C&&A){if(L!=null)continue;e.removeEventListener(ae,c[Q],V),c[Q]=null}if(C)Bo(ae,e,L),Ho([ae]);else if(L!=null){let tn=function(Ze){c[N].call(this,Ze)};c[Q]=Yo(ae,e,tn,V)}}else if(N==="style")or(e,N,L);else if(N==="autofocus")Co(e,!!L);else if(!l&&(N==="__value"||N==="value"&&L!=null))e.value=e.__value=L;else if(N==="selected"&&_)Ya(e,L);else{var F=N;d||(F=ca(F));var se=F==="defaultValue"||F==="defaultChecked";if(L==null&&!l&&!se)if(f[N]=null,F==="value"||F==="checked"){let V=e,Q=t===void 0;if(F==="value"){let ae=V.defaultValue;V.removeAttribute(F),V.defaultValue=ae,V.value=V.__value=Q?ae:null}else{let ae=V.defaultChecked;V.removeAttribute(F),V.defaultChecked=ae,V.checked=Q?ae:!1}}else e.removeAttribute(N);else se||g.includes(F)&&(l||typeof L!="string")?(e[F]=L,F in f&&(f[F]=D)):typeof L!="function"&&or(e,F,L,i)}}}return p&&O(!0),c}function Gc(e,t,r=[],n=[],o=[],i,s=!1,a=!1){Lt(o,r,n,f=>{var l=void 0,d={},p=e.nodeName===Fc,c=!1;if(Yn(()=>{var m=t(...f.map($)),g=jc(e,l,m,i,s,a);c&&p&&"value"in m&&Tr(e,m.value);for(let w of Object.getOwnPropertySymbols(d))m[w]||z(d[w]);for(let w of Object.getOwnPropertySymbols(m)){var v=m[w];w.description===nn&&(!l||v!==l[w])&&(d[w]&&z(d[w]),d[w]=te(()=>Jr(e,()=>v))),g[w]=v}l=g}),p){var _=e;re(()=>{Tr(_,l.value,!0),Zn(_)})}c=!0})}function Jn(e){return e[cn]??={[La]:e.nodeName.includes("-"),[Fa]:e.namespaceURI===rn}}var ti=new Map;function ni(e){var t=e.getAttribute("is")||e.nodeName,r=ti.get(t);if(r)return r;ti.set(t,r=[]);for(var n,o=e,i=Element.prototype;i!==o;){n=sn(o);for(var s in n)n[s].set&&s!=="innerHTML"&&s!=="textContent"&&s!=="innerText"&&r.push(s);o=Nt(o)}return r}function zc(e,t,r){u&&(t==="srcset"&&Wc(e,r)||ri(e.getAttribute(t)??"",r)||rs(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(r)))}function ri(e,t){return e===t?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function Ma(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function Wc(e,t){var r=Ma(e.srcset),n=Ma(t);return n.length===r.length&&n.every(([o,i],s)=>i===r[s][1]&&(ri(r[s][0],o)||ri(o,r[s][0])))}var oi=null;function Ba(){if(oi===null){var e=Le("select");e.innerHTML=Vo("<option><span>t</span></option>"),oi=e.firstChild?.firstChild?.nodeType===1}return oi}function Kc(e,t){Ba()&&Jr(e,()=>()=>{let r=e.closest("select");if(!r)return;let n=new MutationObserver(o=>{var i=!1;for(let s of o){if(s.target===e)return;i||=!!s.target.parentElement?.closest("option")?.selected}i&&(e.replaceWith(e=e.cloneNode(!0)),t(e))});return n.observe(r,{childList:!0,characterData:!0,subtree:!0}),()=>{n.disconnect()}})}function Xc(e,t){var r=h;Ba()||(O(!1),e.textContent="",e.append(Ln("")));try{t()}finally{r&&(h?so(e):(O(!0),S(e)))}}function Zc(e){ge(document,["focusin","focusout"],t=>{t&&t.type==="focusout"&&t.relatedTarget||e(document.activeElement)})}function Jc(e,t,r=t){var n=new WeakSet;tr(e,"input",async o=>{u&&e.type==="checkbox"&&no();var i=o?e.defaultValue:e.value;if(i=si(e)?ai(i):i,r(i),E!==null&&n.add(E),await Vn(),i!==(i=t())){var s=e.selectionStart,a=e.selectionEnd,f=e.value.length;if(e.value=i??"",a!==null){var l=e.value.length;s===a&&a===f&&l>f?(e.selectionStart=l,e.selectionEnd=l):(e.selectionStart=s,e.selectionEnd=Math.min(a,l))}}}),(h&&e.defaultValue!==e.value||k(t)==null&&e.value)&&(r(si(e)?ai(e.value):e.value),E!==null&&n.add(E)),I(()=>{u&&e.type==="checkbox"&&no();var o=t();if(e===document.activeElement){var i=Z?ct:E;if(n.has(i))return}si(e)&&o===ai(e.value)||e.type==="date"&&!o&&!e.value||o!==e.value&&(e.value=o??"")})}var ii=new Set;function Qc(e,t,r,n,o=n){var i=r.getAttribute("type")==="checkbox",s=e;let a=!1;if(t!==null)for(var f of t)s=s[f]??=[];s.push(r),tr(r,"change",()=>{var l=r.__value;i&&(l=Ha(s,l,r.checked)),o(l)},()=>o(i?[]:null)),I(()=>{var l=n();if(h&&r.defaultChecked!==r.checked){a=!0;return}i?(l=l||[],r.checked=l.includes(r.__value)):r.checked=Dn(r.__value,l)}),Y(()=>{var l=s.indexOf(r);l!==-1&&s.splice(l,1)}),ii.has(s)||(ii.add(s),W(()=>{s.sort((l,d)=>l.compareDocumentPosition(d)===4?-1:1),ii.delete(s)})),W(()=>{if(a){var l;if(i)l=Ha(s,l,r.checked);else{var d=s.find(p=>p.checked);l=d?.__value}o(l)}})}function eu(e,t,r=t){tr(e,"change",n=>{var o=n?e.defaultChecked:e.checked;r(o)}),(h&&e.defaultChecked!==e.checked||k(t)==null)&&r(e.checked),I(()=>{var n=t();e.checked=!!n})}function Ha(e,t,r){for(var n=new Set,o=0;o<e.length;o+=1)e[o].checked&&n.add(e[o].__value);return r||n.delete(t),Array.from(n)}function si(e){var t=e.type;return t==="number"||t==="range"}function ai(e){return e===""?null:+e}function tu(e,t,r=t){tr(e,"change",()=>{r(e.files)}),h&&e.files&&r(e.files),I(()=>{e.files=t()})}function fi(e){for(var t=[],r=0;r<e.length;r+=1)t.push({start:e.start(r),end:e.end(r)});return t}function ru(e,t,r=t){var n,o,i=()=>{cancelAnimationFrame(n),e.paused||(n=requestAnimationFrame(i));var s=e.currentTime;o!==s&&r(o=s)};n=requestAnimationFrame(i),e.addEventListener("timeupdate",i),I(()=>{var s=Number(t());o!==s&&!isNaN(s)&&(e.currentTime=o=s)}),Y(()=>{cancelAnimationFrame(n),e.removeEventListener("timeupdate",i)})}function nu(e,t){var r;ge(e,["loadedmetadata","progress","timeupdate","seeking"],()=>{var n=e.buffered;(!r||r.length!==n.length||r.some((o,i)=>n.start(i)!==o.start||n.end(i)!==o.end))&&(r=fi(n),t(r))})}function ou(e,t){ge(e,["loadedmetadata"],()=>t(fi(e.seekable)))}function iu(e,t){ge(e,["timeupdate"],()=>t(fi(e.played)))}function su(e,t){ge(e,["seeking","seeked"],()=>t(e.seeking))}function au(e,t){ge(e,["timeupdate","ended"],()=>t(e.ended))}function fu(e,t){ge(e,["loadedmetadata","loadeddata","canplay","canplaythrough","playing","waiting","emptied"],()=>t(e.readyState))}function lu(e,t,r=t){re(()=>{var n=Number(t());n!==e.playbackRate&&!isNaN(n)&&(e.playbackRate=n)}),re(()=>{ge(e,["ratechange"],()=>{r(e.playbackRate)})})}function cu(e,t,r=t){var n=t(),o=()=>{n!==e.paused&&r(n=e.paused)};ge(e,["play","pause","canplay"],o,n==null),re(()=>{(n=!!t())!==e.paused&&(n?e.pause():e.play().catch(i=>{throw r(n=!0),i}))})}function uu(e,t,r=t){var n=()=>{r(e.volume)};t()==null&&n(),ge(e,["volumechange"],n,!1),I(()=>{var o=Number(t());o!==e.volume&&!isNaN(o)&&(e.volume=o)})}function pu(e,t,r=t){var n=()=>{r(e.muted)};t()==null&&n(),ge(e,["volumechange"],n,!1),I(()=>{var o=!!t();e.muted!==o&&(e.muted=o)})}function _u(e){ge(window,["online","offline"],()=>{e(navigator.onLine)})}function du(e,t,r){var n=_e(e,t);n&&n.set&&(e[t]=r,Y(()=>{e[t]=null}))}var en=class e{#e=new WeakMap;#t;#r;static entries=new WeakMap;constructor(t){this.#r=t}observe(t,r){var n=this.#e.get(t)||new Set;return n.add(r),this.#e.set(t,n),this.#a().observe(t,this.#r),()=>{var o=this.#e.get(t);o.delete(r),o.size===0&&(this.#e.delete(t),this.#t.unobserve(t))}}#a(){return this.#t??(this.#t=new ResizeObserver(t=>{for(var r of t){e.entries.set(r.target,r);for(var n of this.#e.get(r.target)||[])n(r)}}))}},mu=new en({box:"content-box"}),Va=new en({box:"border-box"}),hu=new en({box:"device-pixel-content-box"});function vu(e,t,r){var n=t==="contentRect"||t==="contentBoxSize"?mu:t==="borderBoxSize"?Va:hu,o=n.observe(e,i=>r(i[t]));Y(o)}function gu(e,t,r){var n=Va.observe(e,()=>r(e[t]));re(()=>(k(()=>r(e[t])),n))}function li(e,t){return e===t||e?.[G]===t}function xu(e={},t,r,n){var o=T.r,i=x;return re(()=>{var s,a;return I(()=>{s=a,a=n?.()||[],k(()=>{li(r(...a),e)||(t(e,...a),s&&li(r(...s),e)&&t(null,...s))})}),()=>{let f=i;for(;f!==o&&f.parent!==null&&f.parent.f&33554432;)f=f.parent;let l=()=>{a&&li(r(...a),e)&&t(null,...a)},d=f.teardown;f.teardown=()=>{l(),d?.()}}}),e}function wu(e,t,r,n=r){t.addEventListener("input",()=>{n(t[e])}),I(()=>{var o=r();if(t[e]!==o)if(o==null){var i=t[e];n(i)}else t[e]=o+""})}function yu(e,t,r,n,o){var i=()=>{n(r[e])};r.addEventListener(t,i),o?I(()=>{r[e]=o()}):i(),(r===document.body||r===window||r===document)&&Y(()=>{r.removeEventListener(t,i)})}function bu(e,t){ge(e,["focus","blur"],()=>{t(e===document.activeElement)})}function Eu(e,t,r=t){var n=e==="x",o=()=>je(()=>{i=!0,clearTimeout(s),s=setTimeout(a,100),r(window[n?"scrollX":"scrollY"])});addEventListener("scroll",o,{passive:!0});var i=!1,s,a=()=>{i=!1},f=!0;I(()=>{var l=t();f?f=!1:!i&&l!=null&&(i=!0,clearTimeout(s),n?scrollTo(l,window.scrollY):scrollTo(window.scrollX,l),s=setTimeout(a,100))}),re(o),Y(()=>{removeEventListener("scroll",o)})}function Tu(e,t){ge(window,["resize"],()=>je(()=>t(window[e])))}function Ua(e){return function(...t){var r=t[0];r.isTrusted&&e?.apply(this,t)}}function qa(e){return function(...t){var r=t[0];r.target===this&&e?.apply(this,t)}}function ja(e){return function(...t){var r=t[0];return r.stopPropagation(),e?.apply(this,t)}}function Ga(e){var t=!1;return function(...r){if(!t)return t=!0,e?.apply(this,r)}}function za(e){return function(...t){var r=t[0];return r.stopImmediatePropagation(),e?.apply(this,t)}}function Wa(e){return function(...t){var r=t[0];return r.preventDefault(),e?.apply(this,t)}}function Au(e=!1){let t=T,r=t.l.u;if(!r)return;let n=()=>jr(t.s);if(e){let o=0,i={},s=yt(()=>{let a=!1,f=t.s;for(let l in f)f[l]!==i[l]&&(i[l]=f[l],a=!0);return a&&o++,o});n=()=>$(s)}r.b.length&&qr(()=>{Ka(t,n),sr(r.b)}),yr(()=>{let o=k(()=>r.m.map(mi));return()=>{for(let i of o)typeof i=="function"&&i()}}),r.a.length&&yr(()=>{Ka(t,n),sr(r.a)})}function Ka(e,t){if(e.l.s)for(let r of e.l.s)$(r);t()}function $u(e){var t=oe(0);return function(){return arguments.length===1?(ne(t,$(t)+1),arguments[0]):($(t),e())}}function Su(e,t){var r=e.$$events?.[t.type],n=Ye(r)?r.slice():r==null?[]:[r];for(var o of n)o.call(this,t)}function Nu(e,t,r){e.$$events||={},e.$$events[t]||=[],e.$$events[t].push(r)}function ku(e){for(var t in e)t in this&&(this[t]=e[t])}function Iu(e,t=1){let r=e();return e(r+t),r}function Mu(e,t=1){let r=e()+t;return e(r),r}var Lu={get(e,t){if(!e.exclude.has(t))return e.props[t]},set(e,t){return u&&Hi(`${e.name}.${String(t)}`),!1},getOwnPropertyDescriptor(e,t){if(!e.exclude.has(t)&&t in e.props)return{enumerable:!0,configurable:!0,value:e.props[t]}},has(e,t){return e.exclude.has(t)?!1:t in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(t=>!e.exclude.has(t))}};function Fu(e,t,r){return new Proxy(u?{props:e,exclude:t,name:r,other:{},to_proxy:[]}:{props:e,exclude:t},Lu)}var Pu={get(e,t){if(!e.exclude.includes(t))return $(e.version),t in e.special?e.special[t]():e.props[t]},set(e,t,r){if(!(t in e.special)){var n=x;try{K(e.parent_effect),e.special[t]=Za({get[t](){return e.props[t]}},t,4)}finally{K(n)}}return e.special[t](r),gr(e.version),!0},getOwnPropertyDescriptor(e,t){if(!e.exclude.includes(t)&&t in e.props)return{enumerable:!0,configurable:!0,value:e.props[t]}},deleteProperty(e,t){return e.exclude.includes(t)||(e.exclude.push(t),gr(e.version)),!0},has(e,t){return e.exclude.includes(t)?!1:t in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(t=>!e.exclude.includes(t))}};function Yu(e,t){return new Proxy({props:e,exclude:t,special:{},version:oe(0),parent_effect:x},Pu)}var Bu={get(e,t){let r=e.props.length;for(;r--;){let n=e.props[r];if(kt(n)&&(n=n()),typeof n=="object"&&n!==null&&t in n)return n[t]}},set(e,t,r){let n=e.props.length;for(;n--;){let o=e.props[n];kt(o)&&(o=o());let i=_e(o,t);if(i&&i.set)return i.set(r),!0}return!1},getOwnPropertyDescriptor(e,t){let r=e.props.length;for(;r--;){let n=e.props[r];if(kt(n)&&(n=n()),typeof n=="object"&&n!==null&&t in n){let o=_e(n,t);return o&&!o.configurable&&(o.configurable=!0),o}}},has(e,t){if(t===G||t===Vt)return!1;for(let r of e.props)if(kt(r)&&(r=r()),r!=null&&t in r)return!0;return!1},ownKeys(e){let t=[];for(let r of e.props)if(kt(r)&&(r=r()),!!r){for(let n in r)t.includes(n)||t.push(n);for(let n of Object.getOwnPropertySymbols(r))t.includes(n)||t.push(n)}return t}};function Hu(...e){return new Proxy({props:e},Bu)}function Za(e,t,r,n){var o=!vt||(r&2)!==0,i=(r&8)!==0,s=(r&16)!==0,a=n,f=!0,l=void 0,d=()=>s&&o?(l??=yt(n),$(l)):(f&&(f=!1,a=s?k(n):n),a);let p;if(i){var c=G in e||Vt in e;p=_e(e,t)?.set??(c&&t in e?C=>e[t]=C:void 0)}var _,m=!1;i?[_,m]=Tn(()=>e[t]):_=e[t],_===void 0&&n!==void 0&&(_=d(),p&&(o&&Bi(t),p(_)));var g;if(o?g=()=>{var C=e[t];return C===void 0?d():(f=!0,C)}:g=()=>{var C=e[t];return C!==void 0&&(a=void 0),C===void 0?a:C},o&&(r&4)===0)return g;if(p){var v=e.$$legacy;return(function(C,F){return arguments.length>0?((!o||!F||v||m)&&p(F?g():C),C):g()})}var w=!1,A=((r&1)!==0?yt:Xt)(()=>(w=!1,g()));u&&(A.label=t),i&&$(A);var R=x;return(function(C,F){if(arguments.length>0){let se=F?$(A):o&&i?At(C):C;return ne(A,se),w=!0,a!==void 0&&(a=se),C}return Ue&&w||(R.f&16384)!==0?A.v:$(A)})}function Vu(e,t,r,n,o,i){vo(t,()=>{var s=!1,a=Ce?.[U];I(()=>{if(!s){var[f,l]=Tn(r);if(!l){var d=n(),p=!1,c=I(()=>{p||f[d]});if(p=!0,c.deps===null){var _=`${a}:${o}:${i}`;Zi(e,_),s=!0}}}})})}function Ja(e){return new ci(e)}var ci=class{#e;#t;constructor(t){var r=new Map,n=(i,s)=>{var a=at(s,!1,!1);return r.set(i,a),a};let o=new Proxy({...t.props||{},$$events:{}},{get(i,s){return $(r.get(s)??n(s,Reflect.get(i,s)))},has(i,s){return s===Vt?!0:($(r.get(s)??n(s,Reflect.get(i,s))),Reflect.has(i,s))},set(i,s,a){return ne(r.get(s)??n(s,a),a),Reflect.set(i,s,a)}});this.#t=(t.hydrate?Gn:Kr)(t.component,{target:t.target,anchor:t.anchor,props:o,context:t.context,intro:t.intro??!1,recover:t.recover,transformError:t.transformError}),!Z&&(!t?.props?.$$host||t.sync===!1)&&rt(),this.#e=o.$$events;for(let i of Object.keys(this.#t))i==="$set"||i==="$destroy"||i==="$on"||ce(this,i,{get(){return this.#t[i]},set(s){this.#t[i]=s},enumerable:!0});this.#t.$set=i=>{Object.assign(o,i)},this.#t.$destroy=()=>{zn(this.#t)}}$set(t){this.#t.$set(t)}$on(t,r){this.#e[t]=this.#e[t]||[];let n=(...o)=>r.call(this,...o);return this.#e[t].push(n),()=>{this.#e[t]=this.#e[t].filter(o=>o!==n)}}$destroy(){this.#t.$destroy()}};var Qa;typeof HTMLElement=="function"&&(Qa=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(e,t,r){super(),this.$$ctor=e,this.$$s=t,r&&(this.$$shadowRoot=this.attachShadow(r))}addEventListener(e,t,r){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(t),this.$$c){let n=this.$$c.$on(e,t);this.$$l_u.set(t,n)}super.addEventListener(e,t,r)}removeEventListener(e,t,r){if(super.removeEventListener(e,t,r),this.$$c){let n=this.$$l_u.get(t);n&&(n(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(n){return o=>{let i=Le("slot");n!=="default"&&(i.name=n),qo(o,i)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let t={},r=Uu(this);for(let n of this.$$s)n in r&&(n==="default"&&!this.$$d.children?(this.$$d.children=e(n),t.default=!0):t[n]=e(n));for(let n of this.attributes){let o=this.$$g_p(n.name);o in this.$$d||(this.$$d[o]=Qn(o,n.value,this.$$p_d,"toProp"))}for(let n in this.$$p_d)!(n in this.$$d)&&this[n]!==void 0&&(this.$$d[n]=this[n],delete this[n]);this.$$c=Ja({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=Io(()=>{I(()=>{this.$$r=!0;for(let n of Nr(this.$$c)){if(!this.$$p_d[n]?.reflect)continue;this.$$d[n]=this.$$c[n];let o=Qn(n,this.$$d[n],this.$$p_d,"toAttribute");o==null?this.removeAttribute(this.$$p_d[n].attribute||n):this.setAttribute(this.$$p_d[n].attribute||n,o)}this.$$r=!1})});for(let n in this.$$l)for(let o of this.$$l[n]){let i=this.$$c.$on(n,o);this.$$l_u.set(o,i)}this.$$l={}}}attributeChangedCallback(e,t,r){this.$$r||(e=this.$$g_p(e),this.$$d[e]=Qn(e,r,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(e){return Nr(this.$$p_d).find(t=>this.$$p_d[t].attribute===e||!this.$$p_d[t].attribute&&t.toLowerCase()===e)||e}});function Qn(e,t,r,n){let o=r[e]?.type;if(t=o==="Boolean"&&typeof t!="boolean"?t!=null:t,!n||!r[e])return t;if(n==="toAttribute")switch(o){case"Object":case"Array":return t==null?null:JSON.stringify(t);case"Boolean":return t?"":null;case"Number":return t??null;default:return t}else switch(o){case"Object":case"Array":return t&&JSON.parse(t);case"Boolean":return t;case"Number":return t!=null?+t:t;default:return t}}function Uu(e){let t={};return e.childNodes.forEach(r=>{t[r.slot||"default"]=!0}),t}function qu(e,t,r,n,o,i){let s=class extends Qa{constructor(){super(e,r,o),this.$$p_d=t}static get observedAttributes(){return Nr(t).map(a=>(t[a].attribute||a).toLowerCase())}};return Nr(t).forEach(a=>{ce(s.prototype,a,{get(){return this.$$c&&a in this.$$c?this.$$c[a]:this.$$d[a]},set(f){f=Qn(a,f,t),this.$$d[a]=f;var l=this.$$c;if(l){var d=_e(l,a)?.get;d?l[a]=f:l.$set({[a]:f})}}})}),n.forEach(a=>{ce(s.prototype,a,{get(){return this.$$c?.[a]}})}),i&&(s=i(s)),e.element=s,s}function ju(e,...t){return k(()=>{try{let r=!1,n=[];for(let o of t)o&&typeof o=="object"&&G in o?(n.push(Ot(o,!0)),r=!0):n.push(o);r&&(Ji(e),console.log("%c[snapshot]","color: grey",...n))}catch{}}),t}export{Ar as CLASS,U as FILENAME,Ht as HMR,$t as NAMESPACE_SVG,$r as STYLE,$n as aborted,Rc as action,x as active_effect,Nu as add_legacy_event_listener,Ul as add_locations,pf as add_svelte_meta,gv as afterUpdate,Ac as animation,qo as append,kc as append_styles,al as apply,Bl as assign,Hl as assign_async,Xl as async,go as async_derived,Jr as attach,Yl as attachment,Dc as attr,Gc as attribute_effect,Co as autofocus,Ql as await,vv as beforeUpdate,Zc as bind_active_element,nu as bind_buffered,eu as bind_checked,wu as bind_content_editable,ru as bind_current_time,gu as bind_element_size,au as bind_ended,tu as bind_files,bu as bind_focused,Qc as bind_group,pu as bind_muted,_u as bind_online,cu as bind_paused,lu as bind_playback_rate,iu as bind_played,du as bind_prop,yu as bind_property,fu as bind_ready_state,vu as bind_resize_observer,ou as bind_seekable,su as bind_seeking,Ic as bind_select_value,xu as bind_this,Jc as bind_value,uu as bind_volume,Eu as bind_window_scroll,Tu as bind_window_size,ho as boundary,Su as bubble_event,zl as check_target,jf as child,Vl as cleanup_styles,Zo as clsx,wl as comment,gc as component,_f as createContext,hv as createEventDispatcher,Ll as createRawSnippet,qu as create_custom_element,Gl as create_ownership_validator,nc as css_props,Xc as customizable_select,Hn as deep_read,jr as deep_read_state,Jf as deferred_template_effect,Ho as delegate,Bo as delegated,Of as derived,Xt as derived_safe_equal,Hs as document,cc as each,Lf as eager,re as effect,Io as effect_root,gt as effect_tracking,Sc as element,qf as equals,sl as event,sf as exclude_from_object,nf as fallback,Gf as first_child,rt as flush,rt as flushSync,kf as for_await_track_reactivity_loss,Ff as fork,_l as from_html,ml as from_mathml,dl as from_svg,hl as from_tree,$ as get,dv as getAbortSignal,df as getAllContexts,vs as getContext,xs as hasContext,Nc as head,jl as hmr,mc as html,ol as hydratable,Gn as hydrate,af as hydrate_template,ec as if,fc as index,Au as init,Zn as init_select,Kl as inspect,vi as invalid_default_snippet,el as invalidate_inner_signals,wf as invalidate_store,rc as key,Wl as legacy_api,Xf as legacy_pre_effect,Zf as legacy_pre_effect_reset,Yu as legacy_rest_props,ju as log_if_contains_state,Af as mark_store_binding,Kr as mount,at as mutable_source,Pf as mutate,ao as next,ue as noop,mv as onDestroy,Fl as onMount,Ga as once,Sf as pending,co as pop,Wa as preventDefault,Go as prevent_snippet_stringification,Za as prop,yl as props_id,At as proxy,lo as push,ot as raf,$u as reactive_import,Pa as remove_input_defaults,Wf as remove_textarea_child,I as render_effect,il as replay_events,so as reset,Fu as rest_props,Rf as run,vo as run_after_blockers,nl as safe_get,vc as sanitize_slots,Nf as save,Tr as select_option,Kc as selectedcontent,qa as self,ne as set,gs as setContext,or as set_attribute,Bc as set_checked,Jo as set_class,qc as set_custom_element_data,Hc as set_default_checked,Vc as set_default_value,Ya as set_selected,ei as set_style,Rl as set_text,Yc as set_value,Uc as set_xlink_attribute,rl as settled,yf as setup_stores,zf as sibling,hc as slot,Ot as snapshot,Il as snippet,Hu as spread_props,ut as state,za as stopImmediatePropagation,ja as stopPropagation,gf as store_get,bf as store_mutate,As as store_set,xf as store_unsub,Uf as strict_equals,Se as tag,vn as tag_proxy,Mo as template_effect,xl as text,Vn as tick,of as to_array,cf as trace,An as track_reactivity_loss,$c as transition,Ua as trusted,zn as unmount,k as untrack,gr as update,ku as update_legacy_props,Yf as update_pre,Mu as update_pre_prop,Tf as update_pre_store,Iu as update_prop,Ef as update_store,yr as user_effect,qr as user_pre_effect,Vu as validate_binding,Ol as validate_dynamic_element_tag,Zl as validate_snippet_args,Dl as validate_store,Cl as validate_void_dynamic_element,Cf as wait,Ro as window,vl as with_script,Ml as wrap_snippet};\n', css: "", hash: "bbb11843" }, app: { js: `import"svelte/internal/disclose-version";import"svelte/internal/flags/legacy";import*as e from"svelte/internal/client";var W=e.from_html('<li class="svelte-1n46o8q"><code class="svelte-1n46o8q"> </code><span class="what svelte-1n46o8q"> </span></li>'),h=e.from_html(\`<div class="page svelte-1n46o8q"><div class="wrap svelte-1n46o8q"><header class="head svelte-1n46o8q"><div class="brand svelte-1n46o8q"><span class="mark svelte-1n46o8q" aria-hidden="true"></span> <span class="wordmark svelte-1n46o8q">loops<span class="ext svelte-1n46o8q">.yaml</span></span></div> <nav class="nav svelte-1n46o8q"><a class="navlink svelte-1n46o8q" href="/recipes">Recipes</a> <a class="ghlink svelte-1n46o8q" href="https://github.com/acoyfellow/loops-yaml">GitHub \\u2197</a></nav></header> <section class="hero svelte-1n46o8q"><div class="wash svelte-1n46o8q" aria-hidden="true"></div> <div class="hero-copy svelte-1n46o8q"><h1 class="svelte-1n46o8q">A loop is a schedule<br class="svelte-1n46o8q"/>plus a command.</h1> <p class="lede svelte-1n46o8q">Run commands on a cron schedule, or on demand. Nothing else to learn.</p> <div class="cta svelte-1n46o8q"><code class="svelte-1n46o8q"></code></div></div></section></div> <section class="canvas svelte-1n46o8q" style="background-image:url('/art/field-cream-blue.jpg')"><div class="wrap canvas-inner svelte-1n46o8q"><div class="on-cream svelte-1n46o8q"><p class="kicker dark svelte-1n46o8q">define</p> <pre class="code svelte-1n46o8q"></pre></div> <div class="on-slate svelte-1n46o8q"><p class="kicker slate svelte-1n46o8q">run</p> <ul class="cmds svelte-1n46o8q"></ul></div></div></section> <div class="wrap svelte-1n46o8q"><section class="scope svelte-1n46o8q"><p class="kicker svelte-1n46o8q">scope</p> <p class="prose svelte-1n46o8q">The runner schedules and runs. Read-only, receipts, models, tokens \\u2014 those live
        inside <em class="svelte-1n46o8q">your</em> command, never in the tool.</p></section> <a class="funnel svelte-1n46o8q" href="/recipes"><div class="funnel-copy svelte-1n46o8q"><p class="kicker accent svelte-1n46o8q">recipes</p> <p class="funnel-h svelte-1n46o8q">The command is where the leverage is.</p> <p class="funnel-sub svelte-1n46o8q">A VPS, a coding agent, and a Cloudflare token go a long way. Browse small,
          real loops \\u2014 backups, health checks, dynamic DNS, watchers \\u2014 and copy one in.</p></div> <span class="funnel-go svelte-1n46o8q">See the recipes \\u2192</span></a> <footer class="foot svelte-1n46o8q"><span class="svelte-1n46o8q">MIT</span> <a href="https://github.com/acoyfellow/loops-yaml" class="svelte-1n46o8q">acoyfellow/loops-yaml</a></footer></div></div>\`);function I(s){let U="bun add -g github:acoyfellow/loops-yaml",u=\`loops:
  review:
    schedule: "0 8 * * *"   # 8am daily; omit for on-demand
    run: ./scripts/review.sh\`,x=[["loops list","every loop and its last run"],["loops run review","run one now"],["loops watch","run scheduled loops forever"],["loops logs review","tail the last run"]];var F=h(),l=e.child(F),g=e.sibling(e.child(l),2),t=e.sibling(e.child(g),2),o=e.sibling(e.child(t),4),G=e.child(o);G.textContent="bun add -g github:acoyfellow/loops-yaml",e.reset(o),e.reset(t),e.reset(g),e.reset(l);var i=e.sibling(l,2),a=e.child(i),B=e.child(a),m=e.sibling(e.child(B),2);m.textContent=\`loops:
  review:
    schedule: "0 8 * * *"   # 8am daily; omit for on-demand
    run: ./scripts/review.sh\`,e.reset(B);var n=e.sibling(B,2),b=e.sibling(e.child(n),2);e.each(b,5,()=>x,e.index,(r,v)=>{var d=e.derived(()=>e.to_array(e.get(v),2));let Z=()=>e.get(d)[0],A=()=>e.get(d)[1];var c=W(),Q=e.child(c),p=e.child(Q,!0);e.reset(Q);var C=e.sibling(Q),L=e.child(C,!0);e.reset(C),e.reset(c),e.template_effect(()=>{e.set_text(p,Z()),e.set_text(L,A())}),e.append(r,c)}),e.reset(b),e.reset(n),e.reset(a),e.reset(i),e.next(2),e.reset(F),e.append(s,F)}import{hydrate as y}from"svelte";function N(s,U){return y(I,{target:U??document.getElementById("svelte-hono-root"),props:s})}export{N as hydrate};
`, css: `:root{--bg: #0b1626;--line: #1e2c40;--ink: #eef1f5;--ink-dim: #97a3b6;--ink-faint: #5d6b80;--accent: #f6821f}html,body{max-width:100%;overflow-x:hidden}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;-webkit-font-smoothing:antialiased}.svelte-1n46o8q,.svelte-1n46o8q:before,.svelte-1n46o8q:after{box-sizing:border-box}.page.svelte-1n46o8q{width:100%;overflow-x:clip}.wrap.svelte-1n46o8q{max-width:880px;margin:0 auto;padding:0 1.5rem}.head.svelte-1n46o8q{display:flex;align-items:center;justify-content:space-between;padding:1.8rem 0}.brand.svelte-1n46o8q{display:flex;align-items:center;gap:.6rem}.mark.svelte-1n46o8q{width:14px;height:14px;border-radius:50%;border:2px solid var(--accent);box-shadow:inset 0 0 0 2px var(--bg),0 0 10px -2px var(--accent)}.wordmark.svelte-1n46o8q{font-weight:600;letter-spacing:-.01em}.ext.svelte-1n46o8q{color:var(--ink-faint);font-weight:400}.nav.svelte-1n46o8q{display:flex;align-items:center;gap:1.4rem}.navlink.svelte-1n46o8q{color:var(--ink-dim);text-decoration:none;font-size:.9rem}.navlink.svelte-1n46o8q:hover{color:var(--ink)}.ghlink.svelte-1n46o8q{color:var(--ink-dim);text-decoration:none;font-size:.9rem}.ghlink.svelte-1n46o8q:hover{color:var(--ink)}.hero.svelte-1n46o8q{position:relative;padding:5rem 0 5.5rem}.wash.svelte-1n46o8q{position:absolute;top:0;right:0;bottom:0;width:min(52%,420px);background:radial-gradient(120% 90% at 75% 40%,#1d3a5c,#1d3a5c00 70%);filter:blur(8px);opacity:.8;pointer-events:none}.hero-copy.svelte-1n46o8q{position:relative}h1.svelte-1n46o8q{font-size:clamp(2.1rem,6vw,3.6rem);line-height:1.04;letter-spacing:-.04em;margin:0;font-weight:600}.lede.svelte-1n46o8q{color:var(--ink-dim);font-size:1.1rem;margin:1.2rem 0 2rem;max-width:32ch}.cta.svelte-1n46o8q code:where(.svelte-1n46o8q){display:inline-block;background:#0f1f33;border:1px solid var(--line);border-radius:10px;padding:.7rem 1rem;font:13px ui-monospace,Cascadia Code,monospace;color:var(--ink);max-width:100%;overflow-x:auto;white-space:nowrap}.cta.svelte-1n46o8q code:where(.svelte-1n46o8q):before{content:"$ ";color:var(--accent)}.canvas.svelte-1n46o8q{background-size:100% 100%;background-repeat:no-repeat}.canvas-inner.svelte-1n46o8q{display:grid}.on-cream.svelte-1n46o8q{padding:3.4rem 0 5.5rem;color:#1a2740}.on-slate.svelte-1n46o8q{padding:2.5rem 0 4rem;color:#11203a}.kicker.slate.svelte-1n46o8q{color:#3a4a63}.kicker.svelte-1n46o8q{margin:0 0 1rem;font:600 .72rem/1 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.22em;color:var(--ink-faint)}.kicker.dark.svelte-1n46o8q{color:#6a6256}.code.svelte-1n46o8q{margin:0;overflow-x:auto;font:13.5px/1.7 ui-monospace,Cascadia Code,monospace;color:#243049}.cmds.svelte-1n46o8q{list-style:none;margin:0;padding:0}.cmds.svelte-1n46o8q li:where(.svelte-1n46o8q){display:flex;gap:1.2rem;align-items:baseline;padding:.55rem 0;border-bottom:1px solid rgba(11,22,38,.16)}.cmds.svelte-1n46o8q li:where(.svelte-1n46o8q):last-child{border-bottom:0}.cmds.svelte-1n46o8q code:where(.svelte-1n46o8q){color:#0b1626;font:600 13px ui-monospace,monospace;min-width:11rem}.what.svelte-1n46o8q{color:#243049;opacity:.8}.scope.svelte-1n46o8q{padding:3.5rem 0 1rem}.prose.svelte-1n46o8q{margin:0;color:var(--ink-dim);max-width:58ch;font-size:1.05rem}.prose.svelte-1n46o8q em:where(.svelte-1n46o8q){color:var(--ink);font-style:normal}.kicker.accent.svelte-1n46o8q{color:var(--accent)}.funnel.svelte-1n46o8q{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;margin:3.5rem 0 1rem;padding:1.8rem 1.9rem;background:#0f1f33;border:1px solid var(--line);border-radius:16px;text-decoration:none;color:var(--ink);transition:border-color .15s,transform .15s}.funnel.svelte-1n46o8q:hover{border-color:var(--accent);transform:translateY(-1px)}.funnel-h.svelte-1n46o8q{margin:.5rem 0 0;font-size:1.3rem;font-weight:600;letter-spacing:-.02em}.funnel-sub.svelte-1n46o8q{margin:.5rem 0 0;color:var(--ink-dim);font-size:.95rem;max-width:52ch}.funnel-go.svelte-1n46o8q{color:var(--accent);font-weight:600;white-space:nowrap;font-size:.95rem}@media(max-width:600px){.funnel.svelte-1n46o8q{flex-direction:column;align-items:flex-start;gap:1rem}}.foot.svelte-1n46o8q{display:flex;justify-content:space-between;padding:2.5rem 0 4rem;color:var(--ink-faint);font-size:.85rem}.foot.svelte-1n46o8q a:where(.svelte-1n46o8q){color:var(--ink-faint);text-decoration:none}.foot.svelte-1n46o8q a:where(.svelte-1n46o8q):hover{color:var(--ink-dim)}@media(max-width:720px){.hero.svelte-1n46o8q{padding:3rem 0 3.5rem}.wash.svelte-1n46o8q{width:70%;opacity:.45}.cmds.svelte-1n46o8q code:where(.svelte-1n46o8q){min-width:9rem}}
`, hash: "12f82389" }, recipes: { js: 'import"svelte/internal/disclose-version";import"svelte/internal/flags/legacy";import*as e from"svelte/internal/client";var N=[{id:"backup",label:"Backup"},{id:"watch",label:"Watch"},{id:"cloudflare",label:"Cloudflare"},{id:"health",label:"Health"},{id:"notify",label:"Notify"},{id:"chores",label:"Chores"},{id:"data",label:"Data"}],b=[{id:"sqlite-backup-r2",title:"Nightly SQLite \\u2192 R2",blurb:"Snapshot a SQLite DB and push it to an R2 bucket. Offsite backup in two lines.",category:"backup",needs:["sqlite3","wrangler"],schedule:"0 3 * * *",run:`sqlite3 app.db ".backup /tmp/app-$(date +%F).db" && \\\\\n  wrangler r2 object put backups/app-$(date +%F).db --file /tmp/app-$(date +%F).db`},{id:"dir-to-r2",title:"Mirror a folder to R2",blurb:"Rsync-style upload of a working directory to R2 so a wiped VPS costs you nothing.",category:"backup",needs:["tar","wrangler"],schedule:"0 */6 * * *",run:`tar czf /tmp/site.tgz ./site && \\\\\n  wrangler r2 object put backups/site-$(date +%FT%H).tgz --file /tmp/site.tgz`},{id:"pg-dump-r2",title:"Postgres dump to R2",blurb:"Compressed pg_dump straight into object storage. Keep the last 7 by date in the key.",category:"backup",needs:["pg_dump","gzip","wrangler"],schedule:"30 2 * * *",run:`pg_dump "$DATABASE_URL" | gzip | \\\\\n  wrangler r2 object put db/pg-$(date +%F).sql.gz --pipe`},{id:"cert-expiry",title:"TLS cert expiry check",blurb:"Alert before a certificate expires. Catches the outage everyone forgets about.",category:"health",needs:["openssl","curl"],schedule:"0 9 * * *",run:`END=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null \\\\\n  | openssl x509 -noout -enddate | cut -d= -f2); \\\\\n  echo "cert for $DOMAIN expires $END"`},{id:"http-uptime",title:"Endpoint heartbeat",blurb:"Hit a URL, fail loud on non-200. The whole monitoring stack you need on day one.",category:"health",needs:["curl"],schedule:"*/5 * * * *",run:`curl -fsS -o /dev/null -w "%{http_code}" https://example.com/health \\\\\n  || echo "DOWN at $(date)"`},{id:"disk-watch",title:"Disk space guard",blurb:"Warn when the VPS disk crosses 85%. Cheap insurance against a full-disk 500.",category:"health",needs:["df","awk"],schedule:"*/30 * * * *",run:`df -P / | awk \'NR==2 && $5+0 > 85 {print "disk " $5 " on " $6}\'`},{id:"purge-cache",title:"Purge Cloudflare cache",blurb:"Bust the cache on deploy or schedule. One API call, no dashboard clicking.",category:"cloudflare",needs:["curl"],schedule:"",run:`curl -fsS -X POST \\\\\n  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \\\\\n  -H "Authorization: Bearer $CF_API_TOKEN" \\\\\n  -H "Content-Type: application/json" \\\\\n  --data \'{"purge_everything":true}\'`},{id:"dynamic-dns",title:"Dynamic DNS updater",blurb:"Point a Cloudflare DNS record at your current IP. Self-hosted from a dynamic address.",category:"cloudflare",needs:["curl","jq"],schedule:"*/15 * * * *",run:`IP=$(curl -fsS https://api.ipify.org); \\\\\n  curl -fsS -X PATCH \\\\\n  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \\\\\n  -H "Authorization: Bearer $CF_API_TOKEN" \\\\\n  --data "$(jq -n --arg ip "$IP" \'{type:"A",content:$ip}\')"`},{id:"deploy-worker",title:"Scheduled Worker deploy",blurb:"Pull latest, deploy a Worker. A one-box CD pipeline with no CI service.",category:"cloudflare",needs:["git","wrangler"],schedule:"",run:`git -C ./app pull --ff-only && \\\\\n  cd ./app && wrangler deploy`},{id:"workers-ai-summary",title:"Summarize a log with Workers AI",blurb:"Pipe the day\\u2019s log through a model and get a plain-English summary. Your agent in cron.",category:"cloudflare",needs:["curl","jq"],schedule:"0 18 * * *",run:`TAIL=$(tail -c 6000 app.log | jq -Rs .); \\\\\n  curl -fsS "https://api.cloudflare.com/client/v4/accounts/$ACCT/ai/run/@cf/meta/llama-3.1-8b-instruct" \\\\\n  -H "Authorization: Bearer $CF_API_TOKEN" \\\\\n  --data "{\\\\"prompt\\\\":\\\\"Summarize today\'s errors: \\\\"$TAIL}"`},{id:"rss-to-chat",title:"RSS \\u2192 webhook digest",blurb:"Fetch a feed, post new items to a chat webhook. Stay current without opening a tab.",category:"notify",needs:["curl","jq"],schedule:"0 8 * * 1-5",run:`curl -fsS https://example.com/feed.json \\\\\n  | jq -r \'.items[0:5][] | "\\u2022 \\\\(.title) \\u2014 \\\\(.url)"\' \\\\\n  | curl -fsS "$CHAT_WEBHOOK" --data-binary @-`},{id:"price-watch",title:"Watch a page for change",blurb:"Hash a page, ping you when it changes. Price drops, stock, job posts \\u2014 anything.",category:"watch",needs:["curl","sha1sum"],schedule:"0 */2 * * *",run:`NEW=$(curl -fsS https://example.com/item | sha1sum | cut -c1-12); \\\\\n  OLD=$(cat .item-hash 2>/dev/null); \\\\\n  [ "$NEW" != "$OLD" ] && echo "changed" && echo "$NEW" > .item-hash`},{id:"gh-releases",title:"Watch a repo for releases",blurb:"Poll a GitHub repo\\u2019s latest release; notify on a new tag. No webhooks to host.",category:"watch",needs:["curl","jq"],schedule:"0 * * * *",run:`TAG=$(curl -fsS https://api.github.com/repos/$REPO/releases/latest | jq -r .tag_name); \\\\\n  [ "$TAG" != "$(cat .last-tag 2>/dev/null)" ] && \\\\\n  echo "new release $TAG" && echo "$TAG" > .last-tag`},{id:"log-rotate",title:"Trim runaway logs",blurb:"Keep the last 5k lines of a log file. The unglamorous chore that prevents a 3am page.",category:"chores",needs:["tail","mv"],schedule:"0 4 * * *",run:"tail -n 5000 app.log > app.log.tmp && mv app.log.tmp app.log"},{id:"prune-tmp",title:"Sweep old temp files",blurb:"Delete files older than 7 days from a scratch dir. Boring, essential, two seconds.",category:"chores",needs:["find"],schedule:"0 5 * * *",run:"find /tmp/scratch -type f -mtime +7 -delete"},{id:"csv-to-d1",title:"Load a CSV into D1",blurb:"Pull a CSV and import it into a D1 table. A nightly ETL in one command.",category:"data",needs:["curl","wrangler"],schedule:"0 1 * * *",run:`curl -fsS https://example.com/export.csv -o /tmp/in.csv && \\\\\n  wrangler d1 execute mydb --command \\\\\n  ".import /tmp/in.csv records"`},{id:"json-snapshot",title:"Snapshot an API to JSON",blurb:"Save a daily copy of an API response. Cheap history you can diff later.",category:"data",needs:["curl","jq"],schedule:"0 0 * * *",run:`curl -fsS https://api.example.com/stats \\\\\n  | jq . > snapshots/stats-$(date +%F).json`},{id:"thumbnails",title:"Batch-make thumbnails",blurb:"Resize every new image in a folder. ffmpeg/ImageMagick + cron beats a SaaS.",category:"chores",needs:["ImageMagick"],schedule:"*/10 * * * *",run:`for f in inbox/*.jpg; do \\\\\n  [ -f "thumbs/$(basename "$f")" ] || convert "$f" -resize 400x "thumbs/$(basename "$f")"; \\\\\n  done`}];function y(n,I){let l=n.toLowerCase().trim(),c=I.toLowerCase();if(!l)return 0;if(c.includes(l))return 1e3-(c.indexOf(l)+(c.length-l.length));let a=0,r=0,B=0,o=-2;for(let i=0;i<c.length&&a<l.length;i++)c[i]===l[a]?(B+=1,r+=B*2,i===o+1&&(r+=4),(i===0||/[\\s\\-_./]/.test(c[i-1]))&&(r+=6),o=i,a+=1):B=0;return a===l.length?r:-1}var T=e.from_html("<button> </button>"),P=e.from_html(\'<p class="empty svelte-1485eum">Nothing matches. Try fewer letters.</p>\'),_=e.from_html(\'<li class="entry svelte-1485eum"><div class="entry-head svelte-1485eum"><span class="num svelte-1485eum"> </span> <h2 class="svelte-1485eum"> </h2> <span class="meta svelte-1485eum"><span class="cat svelte-1485eum"> </span> <span class="when svelte-1485eum"> </span></span></div> <p class="blurb svelte-1485eum"> </p> <pre class="cmd svelte-1485eum"> </pre> <p class="needs svelte-1485eum"> </p></li>\'),K=e.from_html(`<div class="page svelte-1485eum"><div class="wrap svelte-1485eum"><header class="head svelte-1485eum"><a class="brand svelte-1485eum" href="/"><span class="mark svelte-1485eum" aria-hidden="true"></span> <span class="wordmark svelte-1485eum">loops<span class="ext svelte-1485eum">.yaml</span></span></a> <a class="ghlink svelte-1485eum" href="https://github.com/acoyfellow/loops-yaml">GitHub \\u2197</a></header> <section class="intro svelte-1485eum"><p class="kicker svelte-1485eum">Recipes</p> <h1 class="svelte-1485eum">Small loops, real leverage.</h1> <p class="lede svelte-1485eum">A loop is a schedule plus a command \\u2014 so the question is just <em class="svelte-1485eum">what command?</em> A VPS, a coding agent, and a Cloudflare token go a long way. These are the kind of\n        useful, unglamorous jobs you can wire up in a minute. Copy one into <code class="svelte-1485eum">loops.yaml</code> and change the values.</p></section> <div class="controls svelte-1485eum"><label class="search-wrap svelte-1485eum"><span class="search-prompt svelte-1485eum">/</span> <input class="search svelte-1485eum" type="search" placeholder="filter \\u2014 r2, cert, dns, backup\\u2026" aria-label="Filter recipes"/></label> <div class="filters svelte-1485eum" role="tablist" aria-label="Filter by category"><button>all</button> <!></div></div> <p class="count svelte-1485eum"> </p> <!> <ol class="index svelte-1485eum"></ol> <footer class="foot svelte-1485eum"><a href="/" class="svelte-1485eum">\\u2190 loops.yaml</a> <span class="svelte-1485eum">MIT</span></footer></div></div>`);function A(n,I){e.push(I,!1);let l=e.mutable_source(),c=e.mutable_source(""),a=e.mutable_source("all"),r=t=>`${t.title} ${t.blurb} ${t.category} ${t.needs.join(" ")} ${t.run}`,B=t=>t||"on-demand";e.legacy_pre_effect(()=>(b,y,e.get(c),e.get(a)),()=>{e.set(l,b.map(t=>({r:t,s:y(e.get(c),r(t))})).filter(({r:t,s})=>(e.get(a)==="all"||t.category===e.get(a))&&s!==-1).sort((t,s)=>s.s-t.s).map(({r:t})=>t))}),e.legacy_pre_effect_reset(),e.init();var o=K(),i=e.child(o),U=e.sibling(e.child(i),4),u=e.child(U),Z=e.sibling(e.child(u),2);e.remove_input_defaults(Z),e.reset(u);var L=e.sibling(u,2),d=e.child(L);let v;var Y=e.sibling(d,2);e.each(Y,1,()=>N,e.index,(t,s)=>{var g=T();let F;var Q=e.child(g,!0);e.reset(g),e.template_effect(m=>{F=e.set_class(g,1,"filter svelte-1485eum",null,F,{on:e.get(a)===e.get(s).id}),e.set_text(Q,m)},[()=>(e.get(s),e.untrack(()=>e.get(s).label.toLowerCase()))]),e.event("click",g,()=>e.set(a,e.get(s).id)),e.append(t,g)}),e.reset(L),e.reset(U);var C=e.sibling(U,2),k=e.child(C);e.reset(C);var W=e.sibling(C,2);{var w=t=>{var s=P();e.append(t,s)};e.if(W,t=>{e.get(l),e.untrack(()=>e.get(l).length===0)&&t(w)})}var V=e.sibling(W,2);e.each(V,7,()=>e.get(l),t=>t.id,(t,s,g)=>{var F=_(),Q=e.child(F),m=e.child(Q),D=e.child(m,!0);e.reset(m);var p=e.sibling(m,2),f=e.child(p,!0);e.reset(p);var X=e.sibling(p,2),x=e.child(X),J=e.child(x,!0);e.reset(x);var R=e.sibling(x,2),j=e.child(R,!0);e.reset(R),e.reset(X),e.reset(Q);var h=e.sibling(Q,2),z=e.child(h,!0);e.reset(h);var G=e.sibling(h,2),O=e.child(G,!0);e.reset(G);var S=e.sibling(G,2),H=e.child(S);e.reset(S),e.reset(F),e.template_effect(($,E,M)=>{e.set_text(D,$),e.set_text(f,(e.get(s),e.untrack(()=>e.get(s).title))),e.set_text(J,(e.get(s),e.untrack(()=>e.get(s).category))),e.set_text(j,E),e.set_text(z,(e.get(s),e.untrack(()=>e.get(s).blurb))),e.set_text(O,(e.get(s),e.untrack(()=>e.get(s).run))),e.set_text(H,`needs: ${M??""}`)},[()=>(e.deep_read_state(e.get(g)),e.untrack(()=>String(e.get(g)+1).padStart(2,"0"))),()=>(e.get(s),e.untrack(()=>B(e.get(s).schedule))),()=>(e.get(s),e.untrack(()=>e.get(s).needs.join(" \\xB7 ")))]),e.append(t,F)}),e.reset(V),e.next(2),e.reset(i),e.reset(o),e.template_effect(()=>{v=e.set_class(d,1,"filter svelte-1485eum",null,v,{on:e.get(a)==="all"}),e.set_text(k,`${e.get(l),e.untrack(()=>e.get(l).length)??""} / ${e.deep_read_state(b),e.untrack(()=>b.length)??""} shown`)}),e.bind_value(Z,()=>e.get(c),t=>e.set(c,t)),e.event("click",d,()=>e.set(a,"all")),e.append(n,o),e.pop()}import{hydrate as q}from"svelte";function Ie(n,I){return q(A,{target:I??document.getElementById("svelte-hono-root"),props:n})}export{Ie as hydrate};\n', css: `:root{--bg: #0b1626;--line: #1e2c40;--ink: #eef1f5;--ink-dim: #97a3b6;--ink-faint: #5d6b80;--accent: #f6821f;--card: #0f1f33;--cream: #ece7df;--blue: #8ea6c4}html,body{max-width:100%;overflow-x:hidden}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;-webkit-font-smoothing:antialiased}.svelte-1485eum,.svelte-1485eum:before,.svelte-1485eum:after{box-sizing:border-box}.wrap.svelte-1485eum{max-width:980px;margin:0 auto;padding:0 1.5rem 4rem}.head.svelte-1485eum{display:flex;align-items:center;justify-content:space-between;padding:1.8rem 0}.brand.svelte-1485eum{display:flex;align-items:center;gap:.6rem;text-decoration:none;color:var(--ink)}.mark.svelte-1485eum{width:14px;height:14px;border-radius:50%;border:2px solid var(--accent);box-shadow:inset 0 0 0 2px var(--bg),0 0 10px -2px var(--accent)}.wordmark.svelte-1485eum{font-weight:600}.ext.svelte-1485eum{color:var(--ink-faint);font-weight:400}.ghlink.svelte-1485eum{color:var(--ink-dim);text-decoration:none;font-size:.9rem}.ghlink.svelte-1485eum:hover{color:var(--ink)}.intro.svelte-1485eum{padding:2rem 0 2.5rem}.kicker.svelte-1485eum{margin:0 0 .8rem;font:600 .72rem/1 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.22em;color:var(--ink-faint)}h1.svelte-1485eum{font-size:clamp(1.9rem,4.5vw,2.8rem);letter-spacing:-.035em;margin:0;font-weight:600}.lede.svelte-1485eum{color:var(--ink-dim);max-width:64ch;margin:1rem 0 0}.lede.svelte-1485eum em:where(.svelte-1485eum){color:var(--ink);font-style:normal}.lede.svelte-1485eum code:where(.svelte-1485eum){color:var(--blue);font:13px ui-monospace,monospace}.controls.svelte-1485eum{position:sticky;top:0;z-index:5;padding:.9rem 0;background:var(--bg);border-bottom:1px solid var(--line)}.search-wrap.svelte-1485eum{display:flex;align-items:baseline;gap:.6rem;border-bottom:1px solid var(--line);padding-bottom:.6rem}.search-prompt.svelte-1485eum{color:var(--accent);font:14px ui-monospace,monospace}.search.svelte-1485eum{flex:1;padding:.2rem 0;border:0;background:transparent;color:var(--ink);font:14px ui-monospace,Cascadia Code,monospace}.search.svelte-1485eum::placeholder{color:var(--ink-faint)}.search.svelte-1485eum:focus{outline:none}.filters.svelte-1485eum{display:flex;flex-wrap:wrap;gap:0 1.1rem;margin-top:.7rem}.filter.svelte-1485eum{border:0;background:transparent;color:var(--ink-faint);cursor:pointer;font:.78rem ui-monospace,monospace;padding:.15rem 0;border-bottom:1px solid transparent;transition:color .1s,border-color .1s}.filter.svelte-1485eum:hover{color:var(--ink-dim)}.filter.on.svelte-1485eum{color:var(--accent);border-bottom-color:var(--accent)}.count.svelte-1485eum{color:var(--ink-faint);font:.74rem ui-monospace,monospace;letter-spacing:.08em;margin:1.1rem 0 0}.empty.svelte-1485eum{color:var(--ink-dim);padding:2rem 0}.index.svelte-1485eum{list-style:none;margin:.6rem 0 0;padding:0}.entry.svelte-1485eum{padding:1.6rem 0;border-bottom:1px solid var(--line)}.entry-head.svelte-1485eum{display:grid;grid-template-columns:2.2rem 1fr auto;align-items:baseline;gap:.9rem}.num.svelte-1485eum{font:.78rem ui-monospace,monospace;color:var(--ink-faint)}h2.svelte-1485eum{font-size:1.05rem;margin:0;letter-spacing:-.01em;font-weight:600}.meta.svelte-1485eum{display:flex;gap:1rem;align-items:baseline;white-space:nowrap}.cat.svelte-1485eum{font:.66rem ui-monospace,monospace;text-transform:uppercase;letter-spacing:.14em;color:var(--blue)}.when.svelte-1485eum{font:.72rem ui-monospace,monospace;color:var(--accent)}.blurb.svelte-1485eum{color:var(--ink-dim);font-size:.92rem;margin:.6rem 0 0;padding-left:3.1rem;max-width:70ch}.cmd.svelte-1485eum{margin:.8rem 0 0 3.1rem;padding:.8rem 1rem;overflow-x:auto;background:#0a1525;border-left:2px solid var(--line);font:12px/1.7 ui-monospace,Cascadia Code,monospace;color:#cfd8e6;white-space:pre;max-width:calc(100% - 3.1rem)}.needs.svelte-1485eum{margin:.7rem 0 0 3.1rem;font:.72rem ui-monospace,monospace;color:var(--ink-faint)}@media(max-width:600px){.entry-head.svelte-1485eum{grid-template-columns:1.6rem 1fr}.meta.svelte-1485eum{grid-column:2;gap:.8rem;margin-top:.2rem}.blurb.svelte-1485eum,.needs.svelte-1485eum{padding-left:0;margin-left:0;max-width:100%}.cmd.svelte-1485eum{margin-left:0;max-width:100%}}.foot.svelte-1485eum{display:flex;justify-content:space-between;padding:2.5rem 0 0;color:var(--ink-faint);font:.8rem ui-monospace,monospace}.foot.svelte-1485eum a:where(.svelte-1485eum){color:var(--ink-faint);text-decoration:none}.foot.svelte-1485eum a:where(.svelte-1485eum):hover{color:var(--ink-dim)}
`, hash: "4754bff7" } };
function Rt(e2) {
  let t = "bun add -g github:acoyfellow/loops-yaml", r = `loops:
  review:
    schedule: "0 8 * * *"   # 8am daily; omit for on-demand
    run: ./scripts/review.sh`, n = [["loops list", "every loop and its last run"], ["loops run review", "run one now"], ["loops watch", "run scheduled loops forever"], ["loops logs review", "tail the last run"]];
  e2.push(`<div class="page svelte-1n46o8q"><div class="wrap svelte-1n46o8q"><header class="head svelte-1n46o8q"><div class="brand svelte-1n46o8q"><span class="mark svelte-1n46o8q" aria-hidden="true"></span> <span class="wordmark svelte-1n46o8q">loops<span class="ext svelte-1n46o8q">.yaml</span></span></div> <nav class="nav svelte-1n46o8q"><a class="navlink svelte-1n46o8q" href="/recipes">Recipes</a> <a class="ghlink svelte-1n46o8q" href="https://github.com/acoyfellow/loops-yaml">GitHub \u2197</a></nav></header> <section class="hero svelte-1n46o8q"><div class="wash svelte-1n46o8q" aria-hidden="true"></div> <div class="hero-copy svelte-1n46o8q"><h1 class="svelte-1n46o8q">A loop is a schedule<br class="svelte-1n46o8q"/>plus a command.</h1> <p class="lede svelte-1n46o8q">Run commands on a cron schedule, or on demand. Nothing else to learn.</p> <div class="cta svelte-1n46o8q"><code class="svelte-1n46o8q">bun add -g github:acoyfellow/loops-yaml</code></div></div></section></div> <section class="canvas svelte-1n46o8q" style="background-image:url('/art/field-cream-blue.jpg')"><div class="wrap canvas-inner svelte-1n46o8q"><div class="on-cream svelte-1n46o8q"><p class="kicker dark svelte-1n46o8q">define</p> <pre class="code svelte-1n46o8q">loops:
  review:
    schedule: "0 8 * * *"   # 8am daily; omit for on-demand
    run: ./scripts/review.sh</pre></div> <div class="on-slate svelte-1n46o8q"><p class="kicker slate svelte-1n46o8q">run</p> <ul class="cmds svelte-1n46o8q"><!--[-->`);
  let o = de(n);
  for (let s = 0, a = o.length; s < a; s++) {
    let [l, c] = o[s];
    e2.push(`<li class="svelte-1n46o8q"><code class="svelte-1n46o8q">${F(l)}</code><span class="what svelte-1n46o8q">${F(c)}</span></li>`);
  }
  e2.push(`<!--]--></ul></div></div></section> <div class="wrap svelte-1n46o8q"><section class="scope svelte-1n46o8q"><p class="kicker svelte-1n46o8q">scope</p> <p class="prose svelte-1n46o8q">The runner schedules and runs. Read-only, receipts, models, tokens \u2014 those live
        inside <em class="svelte-1n46o8q">your</em> command, never in the tool.</p></section> <a class="funnel svelte-1n46o8q" href="/recipes"><div class="funnel-copy svelte-1n46o8q"><p class="kicker accent svelte-1n46o8q">recipes</p> <p class="funnel-h svelte-1n46o8q">The command is where the leverage is.</p> <p class="funnel-sub svelte-1n46o8q">A VPS, a coding agent, and a Cloudflare token go a long way. Browse small,
          real loops \u2014 backups, health checks, dynamic DNS, watchers \u2014 and copy one in.</p></div> <span class="funnel-go svelte-1n46o8q">See the recipes \u2192</span></a> <footer class="foot svelte-1n46o8q"><span class="svelte-1n46o8q">MIT</span> <a href="https://github.com/acoyfellow/loops-yaml" class="svelte-1n46o8q">acoyfellow/loops-yaml</a></footer></div></div>`);
}
__name(Rt, "Rt");
var _n = [{ id: "backup", label: "Backup" }, { id: "watch", label: "Watch" }, { id: "cloudflare", label: "Cloudflare" }, { id: "health", label: "Health" }, { id: "notify", label: "Notify" }, { id: "chores", label: "Chores" }, { id: "data", label: "Data" }];
var $t = [{ id: "sqlite-backup-r2", title: "Nightly SQLite \u2192 R2", blurb: "Snapshot a SQLite DB and push it to an R2 bucket. Offsite backup in two lines.", category: "backup", needs: ["sqlite3", "wrangler"], schedule: "0 3 * * *", run: `sqlite3 app.db ".backup /tmp/app-$(date +%F).db" && \\
  wrangler r2 object put backups/app-$(date +%F).db --file /tmp/app-$(date +%F).db` }, { id: "dir-to-r2", title: "Mirror a folder to R2", blurb: "Rsync-style upload of a working directory to R2 so a wiped VPS costs you nothing.", category: "backup", needs: ["tar", "wrangler"], schedule: "0 */6 * * *", run: `tar czf /tmp/site.tgz ./site && \\
  wrangler r2 object put backups/site-$(date +%FT%H).tgz --file /tmp/site.tgz` }, { id: "pg-dump-r2", title: "Postgres dump to R2", blurb: "Compressed pg_dump straight into object storage. Keep the last 7 by date in the key.", category: "backup", needs: ["pg_dump", "gzip", "wrangler"], schedule: "30 2 * * *", run: `pg_dump "$DATABASE_URL" | gzip | \\
  wrangler r2 object put db/pg-$(date +%F).sql.gz --pipe` }, { id: "cert-expiry", title: "TLS cert expiry check", blurb: "Alert before a certificate expires. Catches the outage everyone forgets about.", category: "health", needs: ["openssl", "curl"], schedule: "0 9 * * *", run: `END=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null \\
  | openssl x509 -noout -enddate | cut -d= -f2); \\
  echo "cert for $DOMAIN expires $END"` }, { id: "http-uptime", title: "Endpoint heartbeat", blurb: "Hit a URL, fail loud on non-200. The whole monitoring stack you need on day one.", category: "health", needs: ["curl"], schedule: "*/5 * * * *", run: `curl -fsS -o /dev/null -w "%{http_code}" https://example.com/health \\
  || echo "DOWN at $(date)"` }, { id: "disk-watch", title: "Disk space guard", blurb: "Warn when the VPS disk crosses 85%. Cheap insurance against a full-disk 500.", category: "health", needs: ["df", "awk"], schedule: "*/30 * * * *", run: `df -P / | awk 'NR==2 && $5+0 > 85 {print "disk " $5 " on " $6}'` }, { id: "purge-cache", title: "Purge Cloudflare cache", blurb: "Bust the cache on deploy or schedule. One API call, no dashboard clicking.", category: "cloudflare", needs: ["curl"], schedule: "", run: `curl -fsS -X POST \\
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{"purge_everything":true}'` }, { id: "dynamic-dns", title: "Dynamic DNS updater", blurb: "Point a Cloudflare DNS record at your current IP. Self-hosted from a dynamic address.", category: "cloudflare", needs: ["curl", "jq"], schedule: "*/15 * * * *", run: `IP=$(curl -fsS https://api.ipify.org); \\
  curl -fsS -X PATCH \\
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  --data "$(jq -n --arg ip "$IP" '{type:"A",content:$ip}')"` }, { id: "deploy-worker", title: "Scheduled Worker deploy", blurb: "Pull latest, deploy a Worker. A one-box CD pipeline with no CI service.", category: "cloudflare", needs: ["git", "wrangler"], schedule: "", run: `git -C ./app pull --ff-only && \\
  cd ./app && wrangler deploy` }, { id: "workers-ai-summary", title: "Summarize a log with Workers AI", blurb: "Pipe the day\u2019s log through a model and get a plain-English summary. Your agent in cron.", category: "cloudflare", needs: ["curl", "jq"], schedule: "0 18 * * *", run: `TAIL=$(tail -c 6000 app.log | jq -Rs .); \\
  curl -fsS "https://api.cloudflare.com/client/v4/accounts/$ACCT/ai/run/@cf/meta/llama-3.1-8b-instruct" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  --data "{\\"prompt\\":\\"Summarize today's errors: \\"$TAIL}"` }, { id: "rss-to-chat", title: "RSS \u2192 webhook digest", blurb: "Fetch a feed, post new items to a chat webhook. Stay current without opening a tab.", category: "notify", needs: ["curl", "jq"], schedule: "0 8 * * 1-5", run: `curl -fsS https://example.com/feed.json \\
  | jq -r '.items[0:5][] | "\u2022 \\(.title) \u2014 \\(.url)"' \\
  | curl -fsS "$CHAT_WEBHOOK" --data-binary @-` }, { id: "price-watch", title: "Watch a page for change", blurb: "Hash a page, ping you when it changes. Price drops, stock, job posts \u2014 anything.", category: "watch", needs: ["curl", "sha1sum"], schedule: "0 */2 * * *", run: `NEW=$(curl -fsS https://example.com/item | sha1sum | cut -c1-12); \\
  OLD=$(cat .item-hash 2>/dev/null); \\
  [ "$NEW" != "$OLD" ] && echo "changed" && echo "$NEW" > .item-hash` }, { id: "gh-releases", title: "Watch a repo for releases", blurb: "Poll a GitHub repo\u2019s latest release; notify on a new tag. No webhooks to host.", category: "watch", needs: ["curl", "jq"], schedule: "0 * * * *", run: `TAG=$(curl -fsS https://api.github.com/repos/$REPO/releases/latest | jq -r .tag_name); \\
  [ "$TAG" != "$(cat .last-tag 2>/dev/null)" ] && \\
  echo "new release $TAG" && echo "$TAG" > .last-tag` }, { id: "log-rotate", title: "Trim runaway logs", blurb: "Keep the last 5k lines of a log file. The unglamorous chore that prevents a 3am page.", category: "chores", needs: ["tail", "mv"], schedule: "0 4 * * *", run: "tail -n 5000 app.log > app.log.tmp && mv app.log.tmp app.log" }, { id: "prune-tmp", title: "Sweep old temp files", blurb: "Delete files older than 7 days from a scratch dir. Boring, essential, two seconds.", category: "chores", needs: ["find"], schedule: "0 5 * * *", run: "find /tmp/scratch -type f -mtime +7 -delete" }, { id: "csv-to-d1", title: "Load a CSV into D1", blurb: "Pull a CSV and import it into a D1 table. A nightly ETL in one command.", category: "data", needs: ["curl", "wrangler"], schedule: "0 1 * * *", run: `curl -fsS https://example.com/export.csv -o /tmp/in.csv && \\
  wrangler d1 execute mydb --command \\
  ".import /tmp/in.csv records"` }, { id: "json-snapshot", title: "Snapshot an API to JSON", blurb: "Save a daily copy of an API response. Cheap history you can diff later.", category: "data", needs: ["curl", "jq"], schedule: "0 0 * * *", run: `curl -fsS https://api.example.com/stats \\
  | jq . > snapshots/stats-$(date +%F).json` }, { id: "thumbnails", title: "Batch-make thumbnails", blurb: "Resize every new image in a folder. ffmpeg/ImageMagick + cron beats a SaaS.", category: "chores", needs: ["ImageMagick"], schedule: "*/10 * * * *", run: `for f in inbox/*.jpg; do \\
  [ -f "thumbs/$(basename "$f")" ] || convert "$f" -resize 400x "thumbs/$(basename "$f")"; \\
  done` }];
function bn(e2, t) {
  let r = e2.toLowerCase().trim(), n = t.toLowerCase();
  if (!r) return 0;
  if (n.includes(r)) return 1e3 - (n.indexOf(r) + (n.length - r.length));
  let o = 0, s = 0, a = 0, l = -2;
  for (let c = 0; c < n.length && o < r.length; c++) n[c] === r[o] ? (a += 1, s += a * 2, c === l + 1 && (s += 4), (c === 0 || /[\s\-_./]/.test(n[c - 1])) && (s += 6), l = c, o += 1) : a = 0;
  return o === r.length ? s : -1;
}
__name(bn, "bn");
function Lt(e2, t) {
  e2.component((r) => {
    let n, o = "", s = "all", a = /* @__PURE__ */ __name((u) => `${u.title} ${u.blurb} ${u.category} ${u.needs.join(" ")} ${u.run}`, "a"), l = /* @__PURE__ */ __name((u) => u || "on-demand", "l");
    n = $t.map((u) => ({ r: u, s: bn(o, a(u)) })).filter(({ r: u, s: f }) => (s === "all" || u.category === s) && f !== -1).sort((u, f) => f.s - u.s).map(({ r: u }) => u), r.push(`<div class="page svelte-1485eum"><div class="wrap svelte-1485eum"><header class="head svelte-1485eum"><a class="brand svelte-1485eum" href="/"><span class="mark svelte-1485eum" aria-hidden="true"></span> <span class="wordmark svelte-1485eum">loops<span class="ext svelte-1485eum">.yaml</span></span></a> <a class="ghlink svelte-1485eum" href="https://github.com/acoyfellow/loops-yaml">GitHub \u2197</a></header> <section class="intro svelte-1485eum"><p class="kicker svelte-1485eum">Recipes</p> <h1 class="svelte-1485eum">Small loops, real leverage.</h1> <p class="lede svelte-1485eum">A loop is a schedule plus a command \u2014 so the question is just <em class="svelte-1485eum">what command?</em> A VPS, a coding agent, and a Cloudflare token go a long way. These are the kind of
        useful, unglamorous jobs you can wire up in a minute. Copy one into <code class="svelte-1485eum">loops.yaml</code> and change the values.</p></section> <div class="controls svelte-1485eum"><label class="search-wrap svelte-1485eum"><span class="search-prompt svelte-1485eum">/</span> <input class="search svelte-1485eum" type="search" placeholder="filter \u2014 r2, cert, dns, backup\u2026"${Ue("value", o)} aria-label="Filter recipes"/></label> <div class="filters svelte-1485eum" role="tablist" aria-label="Filter by category"><button${Qt("filter svelte-1485eum", void 0, { on: s === "all" })}>all</button> <!--[-->`);
    let c = de(_n);
    for (let u = 0, f = c.length; u < f; u++) {
      let p = c[u];
      r.push(`<button${Qt("filter svelte-1485eum", void 0, { on: s === p.id })}>${F(p.label.toLowerCase())}</button>`);
    }
    r.push(`<!--]--></div></div> <p class="count svelte-1485eum">${F(n.length)} / ${F($t.length)} shown</p> `), n.length === 0 ? (r.push("<!--[0-->"), r.push('<p class="empty svelte-1485eum">Nothing matches. Try fewer letters.</p>')) : r.push("<!--[-1-->"), r.push('<!--]--> <ol class="index svelte-1485eum"><!--[-->');
    let i = de(n);
    for (let u = 0, f = i.length; u < f; u++) {
      let p = i[u];
      r.push(`<li class="entry svelte-1485eum"><div class="entry-head svelte-1485eum"><span class="num svelte-1485eum">${F(String(u + 1).padStart(2, "0"))}</span> <h2 class="svelte-1485eum">${F(p.title)}</h2> <span class="meta svelte-1485eum"><span class="cat svelte-1485eum">${F(p.category)}</span> <span class="when svelte-1485eum">${F(l(p.schedule))}</span></span></div> <p class="blurb svelte-1485eum">${F(p.blurb)}</p> <pre class="cmd svelte-1485eum">${F(p.run)}</pre> <p class="needs svelte-1485eum">needs: ${F(p.needs.join(" \xB7 "))}</p></li>`);
    }
    r.push('<!--]--></ol> <footer class="foot svelte-1485eum"><a href="/" class="svelte-1485eum">\u2190 loops.yaml</a> <span class="svelte-1485eum">MIT</span></footer></div></div>');
  });
}
__name(Lt, "Lt");
var wn = "https://loops-yaml.coey.dev";
var yn = `${wn}/og.jpg`;
function Gt(e2) {
  let t = `${wn}${e2.path}`, r = /* @__PURE__ */ __name((s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), "r"), n = r(e2.description), o = r(e2.title);
  return [`<meta name="description" content="${n}">`, `<link rel="canonical" href="${t}">`, '<meta name="theme-color" content="#0b1626">', '<meta property="og:type" content="website">', '<meta property="og:site_name" content="loops.yaml">', `<meta property="og:title" content="${o}">`, `<meta property="og:description" content="${n}">`, `<meta property="og:url" content="${t}">`, `<meta property="og:image" content="${yn}">`, '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:image:alt" content="loops.yaml \u2014 a torn cream and blue color field">', '<meta name="twitter:card" content="summary_large_image">', `<meta name="twitter:title" content="${o}">`, `<meta name="twitter:description" content="${n}">`, `<meta name="twitter:image" content="${yn}">`, '<link rel="icon" href="/favicon.svg" type="image/svg+xml">', '<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">', '<link rel="apple-touch-icon" href="/apple-touch-icon.png">', '<link rel="manifest" href="/manifest.webmanifest">', `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "loops.yaml", applicationCategory: "DeveloperApplication", operatingSystem: "macOS, Linux", description: e2.description, url: t, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, author: { "@type": "Person", name: "Jordan Coeyman", url: "https://github.com/acoyfellow" } })}<\/script>`].join(`
`);
}
__name(Gt, "Gt");
var pe = new ot();
mn(pe, { bundles: gn });
pe.get("/", St(Rt, { hydrateAs: "app", title: "loops.yaml \u2014 schedule a command, or run it on demand", head: Gt({ path: "/", title: "loops.yaml \u2014 schedule a command, or run it on demand", description: "Run commands on a cron schedule, or on demand. A loop is a schedule plus a command \u2014 nothing else." }), props: {} }));
pe.get("/recipes", St(Lt, { hydrateAs: "recipes", title: "loops.yaml \u2014 recipes: small loops, real leverage", head: Gt({ path: "/recipes", title: "loops.yaml recipes \u2014 small loops, real leverage", description: "A grounded collection of small, useful loops: backups, health checks, Cloudflare automation, watchers. VPS + agent + Cloudflare = freedom through simplicity." }), props: {} }));
pe.get("*", (e2) => e2.env.ASSETS.fetch(e2.req.raw));
var Gh = pe;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-EViMO4/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = Gh;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-EViMO4/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.bundled.js.map
