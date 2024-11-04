/* eslint-disable */
// @ts-nocheck
import * as StackBlur from 'stackblur-canvas/dist/stackblur-es'
// window.pipLyric = pipLyric()
export function PipLyric() {
  'use strict'
  function n(n, t) {
    return (
      (function (n) {
        if (Array.isArray(n)) return n
      })(n) ||
      (function (n, t) {
        var e = null == n ? null : ('undefined' != typeof Symbol && n[Symbol.iterator]) || n['@@iterator']
        if (null == e) return
        var r,
          a,
          i = [],
          o = !0,
          l = !1
        try {
          for (e = e.call(n); !(o = (r = e.next()).done) && (i.push(r.value), !t || i.length !== t); o = !0);
        } catch (n) {
          ;(l = !0), (a = n)
        } finally {
          try {
            o || null == e.return || e.return()
          } finally {
            if (l) throw a
          }
        }
        return i
      })(n, t) ||
      e(n, t) ||
      (function () {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        )
      })()
    )
  }
  function t(n) {
    return (
      (function (n) {
        if (Array.isArray(n)) return r(n)
      })(n) ||
      (function (n) {
        if (('undefined' != typeof Symbol && null != n[Symbol.iterator]) || null != n['@@iterator'])
          return Array.from(n)
      })(n) ||
      e(n) ||
      (function () {
        throw new TypeError(
          'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        )
      })()
    )
  }
  function e(n, t) {
    if (n) {
      if ('string' == typeof n) return r(n, t)
      var e = Object.prototype.toString.call(n).slice(8, -1)
      return (
        'Object' === e && n.constructor && (e = n.constructor.name),
        'Map' === e || 'Set' === e
          ? Array.from(n)
          : 'Arguments' === e || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)
          ? r(n, t)
          : void 0
      )
    }
  }
  function r(n, t) {
    ;(null == t || t > n.length) && (t = n.length)
    for (var e = 0, r = new Array(t); e < t; e++) r[e] = n[e]
    return r
  }
  function a(n, t, e) {
    var r = void 0 === t ? null : t,
      a = (function (n, t) {
        var e = atob(n)
        if (t) {
          for (var r = new Uint8Array(e.length), a = 0, i = e.length; a < i; ++a) r[a] = e.charCodeAt(a)
          return String.fromCharCode.apply(null, new Uint16Array(r.buffer))
        }
        return e
      })(n, void 0 !== e && e),
      i = a.indexOf('\n', 10) + 1,
      o = a.substring(i) + (r ? '//# sourceMappingURL=' + r : ''),
      l = new Blob([o], {
        type: 'application/javascript',
      })
    return URL.createObjectURL(l)
  }
  var i,
    o,
    l,
    c,
    u =
      ((i =
        'Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gdCh0LHIpe3JldHVybiBmdW5jdGlvbih0KXtpZihBcnJheS5pc0FycmF5KHQpKXJldHVybiB0fSh0KXx8ZnVuY3Rpb24odCxuKXt2YXIgcj1udWxsPT10P251bGw6InVuZGVmaW5lZCIhPXR5cGVvZiBTeW1ib2wmJnRbU3ltYm9sLml0ZXJhdG9yXXx8dFsiQEBpdGVyYXRvciJdO2lmKG51bGw9PXIpcmV0dXJuO3ZhciBlLGEsbz1bXSxpPSEwLHU9ITE7dHJ5e2ZvcihyPXIuY2FsbCh0KTshKGk9KGU9ci5uZXh0KCkpLmRvbmUpJiYoby5wdXNoKGUudmFsdWUpLCFufHxvLmxlbmd0aCE9PW4pO2k9ITApO31jYXRjaCh0KXt1PSEwLGE9dH1maW5hbGx5e3RyeXtpfHxudWxsPT1yLnJldHVybnx8ci5yZXR1cm4oKX1maW5hbGx5e2lmKHUpdGhyb3cgYX19cmV0dXJuIG99KHQscil8fGZ1bmN0aW9uKHQscil7aWYoIXQpcmV0dXJuO2lmKCJzdHJpbmciPT10eXBlb2YgdClyZXR1cm4gbih0LHIpO3ZhciBlPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KS5zbGljZSg4LC0xKTsiT2JqZWN0Ij09PWUmJnQuY29uc3RydWN0b3ImJihlPXQuY29uc3RydWN0b3IubmFtZSk7aWYoIk1hcCI9PT1lfHwiU2V0Ij09PWUpcmV0dXJuIEFycmF5LmZyb20odCk7aWYoIkFyZ3VtZW50cyI9PT1lfHwvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChlKSlyZXR1cm4gbih0LHIpfSh0LHIpfHxmdW5jdGlvbigpe3Rocm93IG5ldyBUeXBlRXJyb3IoIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuIil9KCl9ZnVuY3Rpb24gbih0LG4peyhudWxsPT1ufHxuPnQubGVuZ3RoKSYmKG49dC5sZW5ndGgpO2Zvcih2YXIgcj0wLGU9bmV3IEFycmF5KG4pO3I8bjtyKyspZVtyXT10W3JdO3JldHVybiBlfXZhciByPShzZWxmLm5hdmlnYXRvcnx8e30pLnVzZXJBZ2VudCxlPWZ1bmN0aW9uKHQpe3JldHVybiBwYXJzZUludCgobmV3IFJlZ0V4cCh0KyIvKFswLTldKykuIikuZXhlYyhyKXx8W10pWzFdLDEwKX0sYT0hKGUoIkNocm9tZSIpfHxlKCJDaHJvbWl1bSIpKSYmZSgiU2FmYXJpIikmJmUoIlZlcnNpb24iKSxvPWZ1bmN0aW9uKCl7aWYoInVuZGVmaW5lZCI9PXR5cGVvZiB3aW5kb3cpcmV0dXJuKChzZWxmLm5hbWV8fCIiKS5tYXRjaCgvWz8mXXJhdGlvPShbXiYkXSspLyl8fFtdKVsxXTt2YXIgdD0od2luZG93LnNjcmVlbnx8e30pLmhlaWdodHx8MTA4MCxuPSh3aW5kb3cuc2NyZWVufHx7fSkuYXZhaWxIZWlnaHR8fDEwNDAscj13aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb3x8MTtyZXR1cm4gTWF0aC5yb3VuZCgoYT90Om4pLzIpKyIvNDgwKiIrcn0oKSxpPTEsdT1ldmFsO3RyeXtpPXUobyl9Y2F0Y2godCl7fXZhciBmLGM9ZnVuY3Rpb24odCxuKXt2YXIgcj10KmksZT1NYXRoLnJvdW5kKHIpO2lmKCFuKXJldHVybiBlO3ZhciBhPU1hdGguZmxvb3Iociksbz1hPT09cj9yKzE6TWF0aC5jZWlsKHIpO3JldHVybiBhJTI/bzphfSxsPWMoMzc1LCEwKSxzPWMoMjYsITApLGg9cy8yLGQ9MTIqcytoLHY9KGwtbCkvMixnPTUqcyxtPWcvZCxwPS40LHc9ZnVuY3Rpb24odCl7dmFyIG47aWYodHx8InVuZGVmaW5lZCI9PXR5cGVvZiBkb2N1bWVudCl0cnl7bj1uZXcgT2Zmc2NyZWVuQ2FudmFzKDAsMCkuZ2V0Q29udGV4dCgiMmQiKX1jYXRjaCh0KXt9aWYobilyZXR1cm4gbjt0cnl7bj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCJjYW52YXMiKS5nZXRDb250ZXh0KCIyZCIpfWNhdGNoKHQpe31pZihuKXJldHVybiBuO3Rocm93IG5ldyBFcnJvcigiQ3JlYXRlQ29udGV4dEVycm9yIil9LHk9ZnVuY3Rpb24odCl7cmV0dXJuIEFycmF5LmlzQXJyYXkodCk/dDpbXX0sYj1NYXRoLnNpbixNPU1hdGguY29zLEE9TWF0aC5QSSx4PWZ1bmN0aW9uKHQpe3JldHVybiAxLU0odCpBLzIpfSxDPWZ1bmN0aW9uKHQpe3JldHVybiBiKHQqQS8yKX0sST1mdW5jdGlvbih0KXtyZXR1cm4tKE0oQSp0KS0xKS8yfSxTPWZ1bmN0aW9uKHQpe3ZhciBuPXR8fHt9LHI9bi5vZmZzZXQsZT1uLmZvY3VzO3JldHVybiBKU09OLnN0cmluZ2lmeSh7b2Zmc2V0OnIsZm9jdXM6ZX0pfSxFPWZ1bmN0aW9uKHQsbixyKXt2YXIgZT15KHQpW25dO2lmKCFlKXJldHVybiBOYU47dmFyIGE9ZXx8e30sbz1hLm9mZnNldFRvcCxpPWEub2Zmc2V0SGVpZ2h0O3JldHVybiByP28rMDpvK2l9LEY9ZnVuY3Rpb24obixyLGUpe3ZhciBhPW58fHt9LG89YS5pbWFnZSxpPWEuZHJhd2luZztpZihpKXt2YXIgdT15KCgob3x8e30pLmx5cmljfHx7fSkubGF5b3V0KTtpZihOdW1iZXIuaXNOYU4ocikpcmV0dXJuIGNvbnNvbGUud2FybigidGFyZ2V0IE5hTiIscik7KHI8LTF8fHI+dS5sZW5ndGgtMSkmJmNvbnNvbGUud2Fybigid3JvbmcgdGFyZ2V0IixyKTt2YXIgZj1NYXRoLm1heCgwLE1hdGgubWluKHUubGVuZ3RoLTEscikpLGM9LTE9PT1yP3A6LjgsbD11W2ZdfHx7fSx2PWwub2Zmc2V0VG9wLG09bC5vZmZzZXRIZWlnaHQsdz1bZixjXSxiPU1hdGguZmxvb3IodittLzIpLE09e2ZvY3VzOncsb2Zmc2V0OmJ9LEE9ZnVuY3Rpb24obixyLGUpe249eShuKTt2YXIgYT10KHkociksMiksbz1hWzBdLGk9YVsxXTtpPWl8fHA7dmFyIHU9KGU9ZXx8MCktZyxmPXUsYz11K2QsbD17fSx2PWZ1bmN0aW9uKHQpe3JldHVybiBmPHQmJnQ8Y30sbT1mdW5jdGlvbih0LG4pe3JldHVybiB2KG4pJiYobFt0XT1uKX07MD09PShvPW98fDApJiZtKCJ0b3AiLEUobixvLCEwKStoKSxvPT09bi5sZW5ndGgtMSYmbSgiYm90dG9tIixFKG4sbywhMSktaCksQXJyYXkoaT09PXA/MToyKS5maWxsKDApLmZvckVhY2goKGZ1bmN0aW9uKHQscixlKXt2YXIgYT1lLmxlbmd0aC1yO2lmKG51bGw9PWwudG9wKXt2YXIgaT1FKG4sby1hLCExKS1oO3YoaSkmJm0oInRvcCIsaSsyKmgpfWlmKG51bGw9PWwuYm90dG9tKXt2YXIgdT1FKG4sbythLCEwKStoO3YodSkmJm0oImJvdHRvbSIsdS0yKmgpfX0pKTt2YXIgdz1sLnRvcCxiPWwuYm90dG9tO3JldHVybltudWxsPT13PyhzK2gpL2Q6KHctdSkvZCxudWxsPT1iPzEtKHMraCkvZDooYi11KS9kXX0odSx3LGIpLEY9aXx8e30sTj1GLmZvY3VzLE89Ri5vZmZzZXQsUj1GLnNwcmVhZCxUPW51bGw9PU58fG51bGw9PU98fFMoaSk9PT1TKE0pfHwhZSxqPVtdLEg9W10saz1bXTtUPyhqLnB1c2godyksSC5wdXNoKGIpLGsucHVzaChBKSk6QXJyYXkoMjQpLmZpbGwobnVsbCkuZm9yRWFjaCgoZnVuY3Rpb24odCxuLHIpe3ZhciBlPShuKzEpL3IubGVuZ3RoO2oucHVzaChmdW5jdGlvbih0LG4scil7dmFyIGU9QyxhPXg7aWYodFswXT09PW5bMF0pe3ZhciBvPW5bMV0tdFsxXSxpPXRbMV0rbyplKHIpO3JldHVyblt0WzBdLGldfWlmKHI8PS41KXt2YXIgdT1wLXRbMV0sZj10WzFdK3UqYSgyKnIpO3JldHVyblt0WzBdLGZdfXZhciBjPW5bMV0tcCxsPXArYyplKDIqKHItLjUpKTtyZXR1cm5bblswXSxsXX0oTix3LGUpKSxILnB1c2goZnVuY3Rpb24odCxuLHIpe3JldHVybiB0KyhuLXQpKkkocil9KE8sYixlKSksay5wdXNoKGZ1bmN0aW9uKHQsbixyKXt2YXIgZT1bblswXS10WzBdLG5bMV0tdFsxXV0sYT1JKHIpO3JldHVyblt0WzBdK2VbMF0qYSx0WzFdK2VbMV0qYV19KFIsQSxlKSl9KSksaS5mb2N1c0ZyYW1lPWosaS5vZmZzZXRGcmFtZT1ILGkuc3ByZWFkRnJhbWU9ayxpLnN0ZXA9MH19LE49ZnVuY3Rpb24obixyLGUsYSxvKXt2YXIgaT1uLmNhbnZhcyx1PWkud2lkdGgsZj1pLmhlaWdodCxjPXIuY2FudmFzLGw9ci5sYXlvdXQscz10KHkoYSksMiksaD1zWzBdLGQ9c1sxXTtpZihlLT1nLG4uc2F2ZSgpLG4uY2xlYXJSZWN0KDAsMCx1LGYpLChsfHxbXSkubGVuZ3RoKXt2YXIgdj1sW2hdfHx7fSxtPXYub2Zmc2V0VG9wLHc9di5vZmZzZXRIZWlnaHQ7IWZ1bmN0aW9uKG4scixlLGEpe2lmKHIud2lkdGgmJnIuaGVpZ2h0KXt2YXIgbz1uLmNhbnZhcyxpPW8ud2lkdGgsdT1vLmhlaWdodCxmPTA7YS5mb3JFYWNoKChmdW5jdGlvbihhKXt2YXIgbz10KGEsMiksYz1vWzBdLGw9b1sxXTtjPW51bGw9PWM/dS1mOmMsbi5nbG9iYWxBbHBoYT1NYXRoLm1heCgwLE1hdGgubWluKGwsMSkpLG4uZHJhd0ltYWdlKHIsMCxlK2YsaSxjLDAsZixpLGMpLGYrPWN9KSksbi5nbG9iYWxBbHBoYT0xfX0obixjLGUsW1ttLWUscF0sW3csZF0sW251bGwscF1dKX1lbHNlIG4uZHJhd0ltYWdlKGMsMCwwKTtuLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj0iZGVzdGluYXRpb24taW4iLG4uZmlsbFN0eWxlPW8sbi5maWxsUmVjdCgwLDAsdSxmKSxuLnJlc3RvcmUoKX0sTz1mdW5jdGlvbih0LG4scixlKXt2YXIgYT10fHx7fSxvPWEuY29udGV4dCxpPWEuZHJhZnQsdT1hLmRyYXdpbmcsZj1hLmltYWdlO2lmKG8pe3ZhciBsLHMsaCxnLHA9Znx8e30sYj1wLmJhY2tncm91bmQsTT1wLmx5cmljLEE9cC5tZXRhLHg9cC5ob2xkZXIsQz1vLmNhbnZhcyxJPUMud2lkdGgsUz1DLmhlaWdodDtpZihvLmNsZWFyUmVjdCgwLDAsSSxTKSxiJiZvLmRyYXdJbWFnZShiLmNhbnZhcywwLDApLEEmJm8uZHJhd0ltYWdlKEEuY2FudmFzLDAsYygzMCkpLHgmJihsPW8scz14LGg9TWF0aC5yb3VuZCgobC5jYW52YXMuaGVpZ2h0LXMuY2FudmFzLmhlaWdodCkvMiksZz1NYXRoLnJvdW5kKChsLmNhbnZhcy53aWR0aC1zLmNhbnZhcy53aWR0aCkvMiksbC5kcmF3SW1hZ2Uocy5jYW52YXMsZyxoKSksaSYmTSl7dmFyIEU9ZnVuY3Rpb24odCxuKXt2YXIgcj0odD10fHx3KCEwKSkuY3JlYXRlTGluZWFyR3JhZGllbnQoMCwwLDAsZCk7cmV0dXJuIHIuYWRkQ29sb3JTdG9wKG0sIndoaXRlIikseShuKS5mb3JFYWNoKChmdW5jdGlvbih0LG4pe3ZhciBlPW4/MTowO3IuYWRkQ29sb3JTdG9wKHQsIndoaXRlIiksci5hZGRDb2xvclN0b3AoZSwidHJhbnNwYXJlbnQiKX0pKSxyfShpLGUpO04oaSxNLG4scixFKSxvLmRyYXdJbWFnZShpLmNhbnZhcyx2LGMoOTcpKSx1Lm9mZnNldD1uLHUuZm9jdXM9cix1LnNwcmVhZD1lfX19LFI9ZnVuY3Rpb24gdChuKXt2YXIgcj0obnx8e30pLmRyYXdpbmcsZT1yfHx7fSxvPWUuc3RlcCxpPWUub2Zmc2V0RnJhbWUsdT1lLmZvY3VzRnJhbWUsZj1lLnNwcmVhZEZyYW1lO2lmKGkmJnUmJiEobz49aS5sZW5ndGgpKXtpLmxlbmd0aCE9PXUubGVuZ3RoJiZjb25zb2xlLndhcm4oImxlbmd0aCBtaXNtYXRjaCIsaSx1KTt2YXIgYz1pW29dLGw9dVtvXSxzPWZbb107ci5oYW5kbGVyPWZ1bmN0aW9uKHQpe3JldHVybiBhJiYoc2VsZi5kb2N1bWVudHx8e30pLmhpZGRlbj9zZXRUaW1lb3V0KHQsMCk6c2VsZi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodCl9KChmdW5jdGlvbigpe08obixjLGwscyksci5zdGVwPW8rMSx0KG4pfSkpfX0sVD17ZHJhd2luZzp7b2Zmc2V0Om51bGwsZm9jdXM6bnVsbH0sZHJhZnQ6KGY9dyghMCksZi5jYW52YXMud2lkdGg9bCxmLmNhbnZhcy5oZWlnaHQ9ZCxmKSxjb250ZXh0Om51bGwsaW1hZ2U6e319LGo9ZnVuY3Rpb24odCxuLHIpe3ZhciBlPVQuZHJhd2luZztjYW5jZWxBbmltYXRpb25GcmFtZShlLmhhbmRsZXIpLCJhbmltYXRlIj09PXQmJkYoVCxuLHIpLCJwYXVzZSIhPT10P1IoVCk6cG9zdE1lc3NhZ2Uoe3R5cGU6InBhdXNlIn0pfSxIPXtjb250cm9sOmZ1bmN0aW9uKHQpe2lmKHQpe3ZhciBuPXQuZ2V0Q29udGV4dCgiMmQiKSxyPW4uY2FudmFzLGU9ci53aWR0aCxhPXIuaGVpZ2h0O24uY2xlYXJSZWN0KDAsMCxlLGEpLFQuY29udGV4dD1uLHBvc3RNZXNzYWdlKHt0eXBlOiJ0YWtlIn0pfX0sbG9hZDpmdW5jdGlvbih0KXt2YXIgbj0odHx8e30pLmtlZXA7T2JqZWN0LmFzc2lnbihULmltYWdlLHQpLG58fChULmRyYXdpbmc9e29mZnNldDpudWxsLGZvY3VzOm51bGx9KX0sYW5pbWF0ZTpmdW5jdGlvbihuKXt2YXIgcj10KG58fFtdLDIpLGU9clswXSxhPXJbMV07bnVsbCE9ZSYmaigiYW5pbWF0ZSIsZSxhKX0scGF1c2U6ZnVuY3Rpb24oKXtyZXR1cm4gaigicGF1c2UiKX0scGxheTpmdW5jdGlvbigpe3JldHVybiBqKCJwbGF5Iil9fTtzZWxmLm9ubWVzc2FnZT1mdW5jdGlvbih0KXt2YXIgbj10LmRhdGF8fHt9LHI9bi50eXBlLGU9bi5wYXlsb2FkO3IgaW4gSCYmSFtyXShlKX19KCk7Cgo='),
      (o = null),
      (l = !1),
      function (n) {
        return (c = c || a(i, o, l)), new Worker(c, n)
      }),
    d = (self.navigator || {}).userAgent,
    s = function (n) {
      return parseInt((new RegExp(n + '/([0-9]+).').exec(d) || [])[1], 10)
    },
    m = s('Chrome') || s('Chromium'),
    h = !m && s('Safari') && s('Version'),
    p = (function () {
      if ('undefined' == typeof window) return ((self.name || '').match(/[?&]ratio=([^&$]+)/) || [])[1]
      var n = (window.screen || {}).height || 1080,
        t = (window.screen || {}).availHeight || 1040,
        e = window.devicePixelRatio || 1
      return Math.round((h ? n : t) / 2) + '/480*' + e
    })(),
    f = 1,
    b = eval
  try {
    f = b(p)
  } catch (n) {}
  var v = function (n, t) {
      var e = n * f,
        r = Math.round(e)
      if (!t) return r
      var a = Math.floor(e),
        i = a === e ? e + 1 : Math.ceil(e)
      return a % 2 ? i : a
    },
    g = v(375, !0),
    y = v(480),
    Z = v(26, !0),
    x = Z / 2,
    X = g,
    W = 12 * Z + x,
    L = (g - X) / 2,
    w = 5 * Z,
    C = w / W,
    G = 0.4,
    K = '//s4.music.126.net/style/web2/img/default_album.jpg',
    Y = function (n, t) {
      var e = document.createElement(n)
      return t && (e.className = t), e
    },
    I = function (n) {
      var t
      if (n || 'undefined' == typeof document)
        try {
          t = new OffscreenCanvas(0, 0).getContext('2d')
        } catch (n) {}
      if (t) return t
      try {
        t = document.createElement('canvas').getContext('2d')
      } catch (n) {}
      if (t) return t
      throw new Error('CreateContextError')
    },
    S = function () {
      return new Promise(function (n) {
        return window.requestIdleCallback ? window.requestIdleCallback(n) : setTimeout(n, 1)
      })
    },
    V = function (n) {
      try {
        return n.transferToImageBitmap ? n.transferToImageBitmap() : n
      } catch (t) {
        return n
      }
    },
    F = function (n, t) {
      return new Promise(function (e, r) {
        var a = t || {},
          i = a.width,
          o = a.height,
          l = a.crossOrigin,
          c = new Image(i, o)
        ;(c.onload = function () {
          return e(c)
        }),
          (c.onerror = r),
          (c.crossOrigin = l),
          (c.src = n)
      })
    },
    H = function (n) {
      return Array.isArray(n) ? n : []
    },
    P = {
      IDEOGRAM:
        /(?:[\u3400-\u4DBF\u4E00-\u9FFF\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD884[\uDC00-\uDF4A])/,
      TAG: /^\s*\[[^\]]*\]\s*/,
    },
    T = function (n) {
      if (!n) return null
      if (3 === (n = String(n || '').split(':')).length) {
        var t = n.pop()
        n[1] += '.'.concat(t)
      }
      var e = n.reduce(function (n, t) {
        return 60 * n + parseFloat(t || 0)
      }, 0)
      return Number.isNaN(e) ? null : e.toFixed(2)
    },
    z = function (n) {
      if (!(n = String(n || '').trim())) return n
      n = n.replace(/：/g, ':').replace(/，/g, ',')
      var t = P.IDEOGRAM.test(n)
      return n.replace(/\s*:\s*/g, t ? '：' : ': ').replace(/\s*,\s*/g, t ? '，' : ', ')
    },
    J = function (n) {
      var t = [],
        e = String(n || '').trim(),
        r = e
      if (!n)
        return {
          tags: t,
          text: e,
        }
      for (
        var a = function (n) {
          return t.push(n.trim()), ''
        };
        (e = e.replace(P.TAG, a)) !== r;

      )
        r = e
      return {
        tags: t,
        text: z(e),
      }
    },
    R = function (n, t) {
      var e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'lrc'
      return (
        (n = n || {}),
        String(t || '')
          .trim()
          .split('\n')
          .forEach(function (t) {
            var r = J(t) || {},
              a = r.tags,
              i = r.text
            i &&
              a &&
              a.forEach(function (t) {
                var r = T((t || '').slice(1, -1))
                null != r && (n[r] || (n[r] = {}), n[r][e] || (n[r][e] = []), n[r][e].push(i))
              })
          }),
        n
      )
    },
    E = function (n) {
      return (Array.isArray(n) ? n : []).filter(Boolean).join(' ').trim()
    },
    k = function (n) {
      var t = n || {},
        e = t.lrc,
        r = t.tlrc
      return (
        (e = E(e)),
        (r = E(r)),
        e
          ? r
            ? {
                lrc: e,
                tlrc: r,
              }
            : {
                lrc: e,
              }
          : null
      )
    }
  var U,
    B,
    A,
    O,
    q = function (n) {
      return String(n || '').trim()
    },
    fontFamily =
      'SFDisplay, PingFang SC, Lantinghei SC, Helvetica Neue, Microsoft Yahei, Hiragino Sans GB, "Microsoft Sans Serif"',
    $svg = function (n) {
      return 'data:image/svg+xml,'.concat(encodeURIComponent(n))
    },
    nn = function (n) {
      var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
        e = I(t),
        r = e.canvas,
        a = n || {},
        i = a.naturalWidth,
        o = a.naturalHeight
      return (r.width = i || 1), (r.height = o || 1), e.drawImage(n, 0, 0), V(r)
    },
    tn = function (n, t) {
      var e = new XMLSerializer().serializeToString(n),
        r = document.createElement('div')
      r.appendChild(n),
        (r.style.width = ''.concat(t, 'px')),
        (r.style.position = 'absolute'),
        (r.style.visibility = 'hidden'),
        r.appendChild(n),
        document.body.appendChild(r)
      var a = r.scrollHeight
      return r.parentNode.removeChild(r), [t, a, e]
    },
    en = function (n, t, e) {
      return '\n    <svg width="'
        .concat(n, '" height="')
        .concat(t, '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ')
        .concat(n, ' ')
        .concat(
          t,
          '">\n      <style>\n        body {\n          margin: 0;\n          width: 100%;\n          height: 100%;\n        }\n      </style>\n      <foreignObject width="'
        )
        .concat(n, '" height="')
        .concat(t, '">\n        <body xmlns="http://www.w3.org/1999/xhtml">\n          ')
        .concat(e, '\n        </body>\n      </foreignObject>\n    </svg>\n  ')
    },
    renderLyric = function (n) {
      if (!(n || []).length) return null
      var t = X,
        e = (function (n) {
          var t = document.createDocumentFragment()
          t.appendChild(document.createElement('style')).innerHTML = '\n    .container {\n      font-family: '
            .concat(fontFamily, ';\n      font-weight: 400;\n      padding: 0 ')
            .concat(
              v(16),
              'px;\n      box-sizing: border-box;\n      color: white;\n      width: 100%;\n      height: 100%;\n      overflow: hidden;\n    }\n    .line {\n      text-align: center;\n      padding: '
            )
            .concat(x, 'px 0;\n      white-space: pre-wrap;\n      line-height: ')
            .concat(Z, 'px;\n    }\n    .origin {\n      font-size: ')
            .concat(v(20), 'px;\n    }\n    .compare {\n      font-size: ')
            .concat(v(20), 'px;\n    }\n    .compare:empty {\n      margin-top: 0;\n    }\n  ')
          var e = Y('div', 'container')
          return (
            t.appendChild(e),
            n.forEach(function (n) {
              var t = n || {},
                r = t.lrc,
                a = t.tlrc,
                i = Y('div', 'line'),
                o = Y('div', 'origin')
              o.textContent = r
              var l = Y('div', 'compare')
              ;(l.textContent = a), i.appendChild(o), i.appendChild(l), e.appendChild(i)
            }),
            t
          )
        })(
          n.map(function (n) {
            return n[1]
          })
        ),
        r = new XMLSerializer().serializeToString(e),
        a = document.createElement('div')
      ;(a.style.width = ''.concat(t, 'px')),
        (a.style.position = 'absolute'),
        (a.style.visibility = 'hidden'),
        a.appendChild(e),
        document.body.appendChild(a)
      var i = (a.getElementsByClassName('container')[0] || {}).scrollHeight || 1,
        o = Array.from(a.getElementsByClassName('line')).map(function (n) {
          var t = n || {}
          return {
            offsetTop: t.offsetTop,
            offsetHeight: t.offsetHeight,
          }
        })
      return (
        a.parentNode.removeChild(a),
        F($svg(en(t, i, r))).then(function (n) {
          return S().then(function () {
            return {
              canvas: nn(n),
              layout: o,
            }
          })
        })
      )
    },
    renderTitle = function (n) {
      var e = (function (n) {
        var t = q((n = n || {}).name),
          e = q(
            n.program
              ? (n.program.radio || {}).name
              : H(n.ar || n.artists)
                  .map(function (n) {
                    return (n || {}).name
                  })
                  .filter(Boolean)
                  .join(' / ')
          )
        if (!t && !e) return null
        var r = document.createDocumentFragment()
        r.appendChild(document.createElement('style')).innerHTML = '\n    .container {\n      font-family: '
          .concat(fontFamily, ';\n      font-weight: 500;\n      padding: 0 ')
          .concat(
            v(16),
            'px;\n      box-sizing: border-box;\n      color: white;\n      width: 100%;\n      display: flex;\n      flex-direction: column;\n    }\n    .title,\n    .subtitle {\n      text-align: center;\n      width: 100%;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n    .title {\n      font-size: '
          )
          .concat(v(17), 'px;\n      opacity: 0.8;\n    }\n    .subtitle {\n      margin-top: ')
          .concat(v(4), 'px;\n      font-size: ')
          .concat(v(13), 'px;\n      opacity: 0.4;\n    }\n  ')
        var a = Y('div', 'container')
        r.appendChild(a)
        var i = Y('div', 'title')
        i.textContent = t
        var o = Y('div', 'subtitle')
        return (o.textContent = e), a.appendChild(i), a.appendChild(o), r
      })(n)
      return e
        ? F($svg(en.apply(void 0, t(tn(e, g))))).then(function (n) {
            return S().then(function () {
              return {
                canvas: nn(n),
              }
            })
          })
        : null
    },
    on = function (n, e, r) {
      return Promise.resolve(
        (n || {}).program
          ? (function (n) {
              var t = (n || {}).program
              if (!t) return null
              var e = t.coverUrl || (t.radio || {}).picUrl || K,
                r = g - 2 * v(70),
                a = [, 'y', ,].join(100 * Math.ceil(r / 100)),
                i = document.createDocumentFragment()
              return (
                (i.appendChild(document.createElement('style')).innerHTML = '\n    .container {\n      font-family: '
                  .concat(
                    fontFamily,
                    ';\n      font-weight: 700;\n      box-sizing: border-box;\n      color: white;\n      width: 100%;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n    }\n    .image {\n      object-fit: cover;\n      width: '
                  )
                  .concat(r, 'px;\n      height: ')
                  .concat(r, 'px;\n      border-radius: ')
                  .concat(v(12), 'px\n    }\n    .tip {\n      margin-top: ')
                  .concat(v(16), 'px;\n      font-size: ')
                  .concat(v(16), 'px;\n      opacity: 0.4;\n    }\n  ')),
                F(''.concat(e, '?param=').concat(a), {
                  crossOrigin: 'anonymous',
                })
                  .then(function (n) {
                    return S().then(function () {
                      return nn(n, !1)
                    })
                  })
                  .then(function (n) {
                    var t = Y('div', 'container')
                    return (
                      (t.appendChild(Y('img', 'image')).src = n.toDataURL()),
                      (t.appendChild(Y('div', 'tip')).textContent = '正在播放播客节目'),
                      i.appendChild(t),
                      i
                    )
                  })
              )
            })(n)
          : (function (n, t, e) {
              n = n || {}
              var r = document.createDocumentFragment()
              r.appendChild(document.createElement('style')).innerHTML = '\n    .container {\n      font-family: '
                .concat(
                  fontFamily,
                  ';\n      font-weight: 400;\n      box-sizing: border-box;\n      color: white;\n      width: 100%;\n    }\n    .text {\n      text-align: center;\n      line-height: 2;\n      font-size: '
                )
                .concat(v(20), 'px;\n      opacity: 0.4;\n    }\n  ')
              var a = Y('div', 'text')
              if (n.id) {
                if (!t) return null
                if (t.no) a.textContent = '纯音乐，请欣赏'
                else if (t.lrc) {
                  if ((e || []).length) return null
                  ;(a.textContent = '* 当前歌词不支持滚动 *'), (a.style.fontSize = v(16)), (a.style.opacity = 0.6)
                } else a.textContent = '暂无歌词'
              } else a.textContent = '请添加播放列表'
              var i = Y('div', 'container')
              return r.appendChild(i), i.appendChild(a), r
            })(n, e, r)
      ).then(function (n) {
        return (
          n &&
          F($svg(en.apply(void 0, t(tn(n, g))))).then(function (n) {
            return S().then(function () {
              return {
                canvas: nn(n),
              }
            })
          })
        )
      })
    },
    renderLogo =
      ((U = function (t) {
        var e = I(!0),
          r = e.canvas,
          a = Math.max(g, y),
          i = [(g - a) / 2, (y - a) / 2, a, a]
        return Promise.all([
          F(
            $svg(
              '<svg width="84" height="16" viewBox="0 0 84 16" xmlns="http://www.w3.org/2000/svg"><path d="M8.25 0a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm22.88 2.751c.26 0 .475.187.52.433l.008.095v8.236a1.782 1.782 0 0 1-1.626 1.727l-.151.007h-1.276a.091.091 0 0 1-.09-.106l.017-.038.599-.824a.212.212 0 0 1 .121-.082l.05-.006h.58a.722.722 0 0 0 .714-.624l.007-.098V3.807h-8.498v9.32a.121.121 0 0 1-.082.115l-.039.007h-.813a.121.121 0 0 1-.115-.083l-.006-.038V3.279c0-.259.187-.474.433-.52l.095-.008h9.553zm51.185-.176a.1.1 0 0 1 .1.05l.013.037.046.325a.58.58 0 0 1-.5.655c-1.196.154-4.058.495-6.937.648l-.36.019-.353 2.655h3.516V5.262c0-.301.22-.55.507-.597l.098-.008h.33a.12.12 0 0 1 .114.082l.006.038v2.187h4.265c.045 0 .083.027.1.066l.008.042v.298c0 .302-.22.552-.51.6l-.098.007h-3.765v3.476c0 .932-.718 1.697-1.631 1.771l-.146.006h-.822a.125.125 0 0 1-.12-.154l.02-.043.55-.762a.232.232 0 0 1 .133-.09l.054-.006h.185a.722.722 0 0 0 .716-.624l.006-.098V7.977h-4.086a.507.507 0 0 1-.506-.48l.003-.086.47-3.649a.507.507 0 0 1 .483-.446l.64-.03.64-.036a94.356 94.356 0 0 0 4.396-.38l.476-.053a93.896 93.896 0 0 0 1.96-.242zm-38.29 5.402c.207 0 .38.15.415.347l.007.076v3.052c0 .932-.718 1.697-1.631 1.771l-.146.006h-1.52a.113.113 0 0 1-.109-.14l.019-.038.572-.788a.216.216 0 0 1 .124-.083l.05-.006h.864a.722.722 0 0 0 .715-.624l.007-.098V8.885l-.513-.001h-.568l-3.093 4.256a.215.215 0 0 1-.124.083l-.05.006h-.935a.106.106 0 0 1-.103-.132l.017-.036 3.036-4.177h-1.734l-3.089 4.247a.238.238 0 0 1-.136.092l-.056.006h-.916a.11.11 0 0 1-.107-.136l.018-.038 3.033-4.171h-1.698l-1.209 1.653a.231.231 0 0 1-.133.089l-.054.006h-.927a.107.107 0 0 1-.104-.133l.018-.037.837-1.146.841-1.175a.423.423 0 0 1 .257-.156l.077-.008h8.048zm24.91 0c.249 0 .456.18.499.416l.008.091v4.238c0 .25-.18.456-.416.499l-.09.008h-7.353a.507.507 0 0 1-.498-.416l-.008-.09V8.483c0-.249.179-.456.415-.498l.091-.009h7.352zM57.751 6.644c.051 0 .094.033.11.08l.005.035v.327c0 .284-.207.52-.479.564l-.092.008h-5.807l-2.405 4.558h6.904l-1.2-2.252a.148.148 0 0 1 .085-.2l.05-.008h.813c.044 0 .085.02.113.052l.023.036 1.385 2.669a.5.5 0 0 1-.387.696l-.088.007h-8.528a.501.501 0 0 1-.481-.365.505.505 0 0 1 .015-.312l.033-.073 2.537-4.808h-2.779a.622.622 0 0 1-.615-.53l-.007-.092V6.76c0-.05.034-.094.08-.11l.036-.006h10.68zM9.618 2.894c-.864.285-1.279 1.09-1.03 2.005l.088.337c-.185.04-.368.094-.549.163-.844.325-1.514 1.047-1.748 1.884a2.562 2.562 0 0 0-.085.918 2.3 2.3 0 0 0 .96 1.675c.51.355 1.121.46 1.72.294.424-.117.801-.37 1.062-.71.412-.538.535-1.245.346-1.992a28.863 28.863 0 0 0-.24-.864l-.09-.317c.359.092.69.267.958.518.933.871 1.113 2.372.418 3.492-.61.983-1.798 1.619-3.028 1.619a3.763 3.763 0 0 1-3.716-4.313 3.715 3.715 0 0 1 2.175-2.838l.117-.05a.528.528 0 1 0-.391-.98A4.75 4.75 0 0 0 4.49 5.371a4.757 4.757 0 0 0-.906 2.785A4.821 4.821 0 0 0 8.4 12.972c1.587 0 3.128-.831 3.926-2.118.972-1.565.721-3.593-.595-4.822a3.318 3.318 0 0 0-1.98-.864c-.039-.148-.098-.376-.144-.546a.743.743 0 0 1-.014-.397.53.53 0 0 1 .844-.257c.064.049.114.11.172.165a.529.529 0 0 0 .82-.646c0-.004-.004-.008-.006-.012-.059-.1-.144-.186-.233-.262a1.683 1.683 0 0 0-.889-.39 1.602 1.602 0 0 0-.683.071zm66.448 6.02c.083 0 .131.09.089.161-.425.717-1.17 2.097-1.963 3.363a.586.586 0 0 1-.402.263l-.1.009h-.673a.143.143 0 0 1-.12-.222c.704-1.118 1.417-2.52 1.926-3.301a.599.599 0 0 1 .403-.264l.1-.009h.74zm5.082 0a.6.6 0 0 1 .503.273c.509.78 1.223 2.183 1.926 3.301a.144.144 0 0 1-.074.214l-.046.008h-.672a.592.592 0 0 1-.502-.272c-.794-1.266-1.539-2.646-1.963-3.363a.106.106 0 0 1 .05-.154l.038-.007h.74zm-12.762 2.158h-6.25v1.22h6.25v-1.22zM26.46 5.053c.024 0 .048.01.066.025l.023.027 1.07 1.87 1.068-1.87a.104.104 0 0 1 .055-.045l.035-.007h.93c.064 0 .109.055.104.113l-.014.042L28.202 8l1.595 2.792a.104.104 0 0 1-.046.145l-.044.01h-.93a.104.104 0 0 1-.066-.025l-.024-.027-1.069-1.87-1.069 1.87a.103.103 0 0 1-.054.045l-.035.007h-.93a.104.104 0 0 1-.104-.113l.013-.042L27.035 8l-1.596-2.792a.104.104 0 0 1 .047-.145l.043-.01h.93zm-2.51 0c.026 0 .05.01.068.025l.023.027 1.62 2.832a.1.1 0 0 1 .011.073l-.013.033-.002.008-1.625 2.844a.103.103 0 0 1-.054.045l-.036.007h-.941a.104.104 0 0 1-.103-.113l.013-.042 1.6-2.802-1.591-2.782a.104.104 0 0 1 .046-.145l.044-.01h.94zm44.437 3.861h-6.25v1.22h6.25v-1.22zM8.947 6.26c.057.207.118.422.18.636.083.289.165.574.23.833.076.302.11.736-.16 1.09a.956.956 0 0 1-.504.333.975.975 0 0 1-.836-.143 1.232 1.232 0 0 1-.51-.899 1.51 1.51 0 0 1 .05-.54c.146-.523.571-.976 1.11-1.183.145-.056.292-.098.44-.127zM43.66 2.623c.207 0 .38.15.415.346l.007.076V6.73c0 .207-.15.38-.347.415l-.075.007h-7.777a.422.422 0 0 1-.415-.346l-.007-.076V3.045c0-.207.15-.38.346-.415l.076-.007h7.777zm21.53-.445c.066 0 .128.027.174.072l.04.052.474.827h3.907c.052 0 .097.034.113.081l.006.038v.286c0 .302-.221.553-.51.6l-.099.008h-.634l-1.137 1.996h3.057c.059 0 .11.038.127.092l.007.042v.29a.589.589 0 0 1-.493.581l-.096.008h-9.718a.603.603 0 0 1-.595-.505l-.008-.098v-.276c0-.06.039-.11.092-.128l.042-.006h3.057l-1.137-1.996h-.634a.609.609 0 0 1-.6-.51l-.008-.098v-.28c0-.055.036-.102.086-.119l.04-.006h3.967l-.452-.788a.11.11 0 0 1 .056-.156l.039-.007h.836zM43.024 5.309h-6.5v.998h6.5v-.998zm24.47-1.167h-4.471l1.137 1.996h2.196l1.137-1.996zm-24.47-.675h-6.5v.998h6.5v-.998zM56.83 3.13c.056 0 .104.036.12.086l.007.04v.299a.588.588 0 0 1-.493.58l-.095.008h-7.897a.606.606 0 0 1-.598-.507l-.008-.099v-.27c0-.061.04-.112.094-.13l.043-.007h8.827z" fill="#FFF"/></svg>'
            ),
            {
              crossOrigin: 'anonymous',
            }
          ),
          F(t, {
            crossOrigin: 'anonymous',
          }),
        ]).then(function (t) {
          var a = n(t, 2),
            o = a[0],
            l = a[1]
          return S().then(function () {
            var n = (function (n, t) {
              var e = nn(n, !1),
                r = e || {}
              return StackBlur.canvasRGB(e, 0, 0, r.width, r.height, t), e
            })(l, l.naturalWidth / 5)
            return (
              (r.width = g),
              (r.height = y),
              e.clearRect(0, 0, r.width, r.height),
              e.drawImage.apply(e, [n].concat(i)),
              (e.fillStyle = 'rgba(15, 22, 30, 0.6)'),
              e.fillRect(0, 0, g, y),
              (e.globalAlpha = 0.2),
              e.drawImage(
                o,
                (g - v(o.naturalWidth)) / 2,
                y - v(o.naturalHeight + 24),
                v(o.naturalWidth),
                v(o.naturalHeight)
              ),
              e.restore(),
              {
                canvas: V(r),
              }
            )
          })
        })
      }),
      (O = !0),
      function (n) {
        return (O || B !== n) && (A = U(n)), O && (O = !1), (B = n), A
      }),
    cn = function (t, e, r, a, i) {
      var o = t.canvas,
        l = o.width,
        c = o.height,
        u = e.canvas,
        d = e.layout,
        s = n(H(a), 2),
        m = s[0],
        h = s[1]
      if (((r -= w), t.save(), t.clearRect(0, 0, l, c), (d || []).length)) {
        var p = d[m] || {},
          f = p.offsetTop,
          b = p.offsetHeight
        !(function (t, e, r, a) {
          if (e.width && e.height) {
            var i = t.canvas,
              o = i.width,
              l = i.height,
              c = 0
            a.forEach(function (a) {
              var i = n(a, 2),
                u = i[0],
                d = i[1]
              ;(u = null == u ? l - c : u),
                (t.globalAlpha = Math.max(0, Math.min(d, 1))),
                t.drawImage(e, 0, r + c, o, u, 0, c, o, u),
                (c += u)
            }),
              (t.globalAlpha = 1)
          }
        })(t, u, r, [
          [f - r, G],
          [b, h],
          [null, G],
        ])
      } else t.drawImage(u, 0, 0)
      ;(t.globalCompositeOperation = 'destination-in'), (t.fillStyle = i), t.fillRect(0, 0, l, c), t.restore()
    },
    un = function (n, t, e, r) {
      var a = n || {},
        i = a.context,
        o = a.draft,
        l = a.drawing,
        c = a.image
      if (i) {
        var u,
          d,
          s,
          m,
          h = c || {},
          p = h.background,
          f = h.lyric,
          b = h.meta,
          g = h.holder,
          y = i.canvas,
          Z = y.width,
          x = y.height
        if (
          (i.clearRect(0, 0, Z, x),
          p && i.drawImage(p.canvas, 0, 0),
          b && i.drawImage(b.canvas, 0, v(30)),
          g &&
            ((u = i),
            (d = g),
            (s = Math.round((u.canvas.height - d.canvas.height) / 2)),
            (m = Math.round((u.canvas.width - d.canvas.width) / 2)),
            u.drawImage(d.canvas, m, s)),
          o && f)
        ) {
          var X = (function (n, t) {
            var e = (n = n || I(!0)).createLinearGradient(0, 0, 0, W)
            return (
              e.addColorStop(C, 'white'),
              H(t).forEach(function (n, t) {
                var r = t ? 1 : 0
                e.addColorStop(n, 'white'), e.addColorStop(r, 'transparent')
              }),
              e
            )
          })(o, r)
          cn(o, f, t, e, X), i.drawImage(o.canvas, L, v(97)), (l.offset = t), (l.focus = e), (l.spread = r)
        }
      }
    },
    dn = function n(t) {
      var e = (t || {}).drawing,
        r = e || {},
        a = r.step,
        i = r.offsetFrame,
        o = r.focusFrame,
        l = r.spreadFrame
      if (i && o && !(a >= i.length)) {
        i.length !== o.length && console.warn('length mismatch', i, o)
        var c,
          u = i[a],
          d = o[a],
          s = l[a]
        e.handler =
          ((c = function () {
            un(t, u, d, s), (e.step = a + 1), n(t)
          }),
          h && (self.document || {}).hidden ? setTimeout(c, 0) : self.requestAnimationFrame(c))
      }
    },
    sn = Math.sin,
    mn = Math.cos,
    hn = Math.PI,
    pn = function (n) {
      return 1 - mn((n * hn) / 2)
    },
    fn = function (n) {
      return sn((n * hn) / 2)
    },
    bn = function (n) {
      return -(mn(hn * n) - 1) / 2
    },
    vn = function (n) {
      var t = n || {},
        e = t.offset,
        r = t.focus
      return JSON.stringify({
        offset: e,
        focus: r,
      })
    },
    gn = function (n, t, e) {
      var r = H(n)[t]
      if (!r) return NaN
      var a = r || {},
        i = a.offsetTop,
        o = a.offsetHeight
      return e ? i + 0 : i + o
    },
    yn = function (t, e, r) {
      var a = t || {},
        i = a.image,
        o = a.drawing
      if (o) {
        var l = H(((i || {}).lyric || {}).layout)
        if (Number.isNaN(e)) return console.warn('target NaN', e)
        ;(e < -1 || e > l.length - 1) && console.warn('wrong target', e)
        var c = Math.max(0, Math.min(l.length - 1, e)),
          u = -1 === e ? G : 0.8,
          d = l[c] || {},
          s = d.offsetTop,
          m = d.offsetHeight,
          h = [c, u],
          p = Math.floor(s + m / 2),
          f = {
            focus: h,
            offset: p,
          },
          b = (function (t, e, r) {
            t = H(t)
            var a = n(H(e), 2),
              i = a[0],
              o = a[1]
            o = o || G
            var l = (r = r || 0) - w,
              c = l,
              u = l + W,
              d = {},
              s = function (n) {
                return c < n && n < u
              },
              m = function (n, t) {
                return s(t) && (d[n] = t)
              }
            0 === (i = i || 0) && m('top', gn(t, i, !0) + x),
              i === t.length - 1 && m('bottom', gn(t, i, !1) - x),
              Array(o === G ? 1 : 2)
                .fill(0)
                .forEach(function (n, e, r) {
                  var a = r.length - e
                  if (null == d.top) {
                    var o = gn(t, i - a, !1) - x
                    s(o) && m('top', o + 2 * x)
                  }
                  if (null == d.bottom) {
                    var l = gn(t, i + a, !0) + x
                    s(l) && m('bottom', l - 2 * x)
                  }
                })
            var h = d.top,
              p = d.bottom
            return [null == h ? (Z + x) / W : (h - l) / W, null == p ? 1 - (Z + x) / W : (p - l) / W]
          })(l, h, p),
          v = o || {},
          g = v.focus,
          y = v.offset,
          X = v.spread,
          L = null == g || null == y || vn(o) === vn(f) || !r,
          C = [],
          K = [],
          Y = []
        L
          ? (C.push(h), K.push(p), Y.push(b))
          : Array(24)
              .fill(null)
              .forEach(function (n, t, e) {
                var r = (t + 1) / e.length
                C.push(
                  (function (n, t, e) {
                    var r = fn,
                      a = pn
                    if (n[0] === t[0]) {
                      var i = t[1] - n[1],
                        o = n[1] + i * r(e)
                      return [n[0], o]
                    }
                    if (e <= 0.5) {
                      var l = G - n[1],
                        c = n[1] + l * a(2 * e)
                      return [n[0], c]
                    }
                    var u = t[1] - G,
                      d = G + u * r(2 * (e - 0.5))
                    return [t[0], d]
                  })(g, h, r)
                ),
                  K.push(
                    (function (n, t, e) {
                      return n + (t - n) * bn(e)
                    })(y, p, r)
                  ),
                  Y.push(
                    (function (n, t, e) {
                      var r = [t[0] - n[0], t[1] - n[1]],
                        a = bn(e)
                      return [n[0] + r[0] * a, n[1] + r[1] * a]
                    })(X, b, r)
                  )
              }),
          (o.focusFrame = C),
          (o.offsetFrame = K),
          (o.spreadFrame = Y),
          (o.step = 0)
      }
    },
    Zn = function () {
      var n = Y('canvas')
      return (n.width = g), (n.height = y), n
    },
    xn = function () {
      var t,
        e,
        r,
        a,
        i = (function () {
          var n = Y('video')
          return (n.width = g), (n.height = y), (n.controls = !1), (n.muted = !0), n
        })(),
        o = {
          drawing: {
            offset: null,
            focus: null,
          },
          draft: ((a = I(!0)), (a.canvas.width = g), (a.canvas.height = W), a),
          context: null,
          image: {},
        },
        l = function () {
          return (function (n) {
            var t = (n || {}).drawing || {},
              e = t.offset,
              r = t.focus,
              a = t.spread
            un(n, e, r, a)
          })(o)
        },
        c = function () {
          return i === document.pictureInPictureElement
        },
        d = {},
        s = {},
        m = function (n, t) {
          if (d[n]) return delete d[n]
          var e = s[n]
          'function' == typeof e && e(t)
        }
      i.addEventListener('play', m.bind(null, 'play')), i.addEventListener('pause', m.bind(null, 'pause'))
      var f,
        b = function (n) {
          if (!(i.paused ^ n)) {
            var t = n ? 'play' : 'pause'
            ;(d[t] = !0), i[t]()
          }
        },
        v = {
          play: b.bind(null, !0),
          pause: b.bind(null, !1),
        }
      i.addEventListener('enterpictureinpicture', function (n) {
        ;(f = (n || {}).pictureInPictureWindow),
          s.enter && s.enter(),
          h && l(),
          f && h && f.addEventListener('resize', l)
      }),
        i.addEventListener('leavepictureinpicture', function () {
          s.leave && s.leave(), f && h && f.removeEventListener('resize', l), (f = void 0)
        })
      var Z,
        x = function () {
          ;(e = Zn()),
            (o.context = e.getContext('2d')),
            o.context.clearRect(0, 0, e.width, e.height),
            (i.srcObject = e.captureStream()),
            (t = void 0),
            console.log('PiP', 'page render')
        }
      try {
        var X = 'pipWorker?ratio='.concat(p)
        ;(t = new u({
          name: X,
        })).onerror = function (n) {
          console.warn('WorkerInternalError', n), x()
        }
      } catch (n) {
        t = void 0
      }
      try {
        ;(Z = (e = Zn()).transferControlToOffscreen()),
          (t.onmessage = function (n) {
            var t = (n.data || {}).type
            'take' === t ? (i.srcObject = e.captureStream()) : 'pause' === t && v.pause()
          }),
          t.postMessage(
            {
              type: 'control',
              payload: Z,
            },
            [Z]
          ),
          (o.context = null),
          console.log('PiP', 'worker render')
      } catch (n) {
        console.warn('TransferControlError', n), x()
      }
      var L = function (n, e) {
          var r = o.drawing
          if ((cancelAnimationFrame(r.handler), 'animate' === n && yn(o, e, !document.hidden && !t && c()), t)) {
            t.postMessage({
              type: n,
              payload: [e, c()],
            })
            var a = r.offsetFrame,
              i = r.focusFrame
            if ('animate' !== n) return
            var l = {
              offset: (a || [])[0],
              focus: (i || [])[0],
              step: 1,
            }
            Object.assign(r, l)
          } else 'pause' !== n ? dn(o) : v.pause()
        },
        w = function () {
          var n = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]
          if (i.autoPause || i.paused) {
            if ((clearTimeout(i.autoPause), delete i.autoPause, i.paused && (v.play(), l()), !n)) return
            i.autoPause = setTimeout(function () {
              L('pause'), delete i.autoPause
            }, 500)
          }
        },
        C = {
          id: 0,
        },
        G = {
          setData: function (e, a) {
            e = e || {}
            var i,
              l,
              c,
              u,
              d,
              s = (C.id += 1),
              m =
                (e.program ? e.program.coverUrl || (e.program.radio || {}).picUrl : (e.al || e.album || {}).picUrl) || K
            ;(c = (l = (i = a) || {}).lrc),
              (u = l.tlyric),
              (d = l.nolyric),
              (c = c && c.lyric),
              (u = u && u.lyric),
              (d = !!d),
              (a = i
                ? {
                    lrc: c,
                    tlrc: u,
                    no: d,
                  }
                : i)
            var h = {
              lyric: JSON.stringify(a) === JSON.stringify(C.lyrics) && !!(r || {}).timeline && o.image.lyric,
              background: m === C.picUrl && o.image.background,
            }
            h.lyric || (r = null)
            var p = h.lyric
                ? r.timeline.slice()
                : (function (n) {
                    if ((n = n || {}).no) return []
                    var t = {}
                    for (var e in n)
                      if (n.hasOwnProperty(e)) {
                        var r = n[e]
                        r && R(t, r, e)
                      }
                    var a = []
                    for (var i in t)
                      if (t.hasOwnProperty(i)) {
                        var o = k(t[i])
                        o && a.push([parseFloat(i), o])
                      }
                    return a.sort(function (n, t) {
                      return n[0] - t[0]
                    })
                  })(a),
              f = ''.concat(m, '?param=').concat([, 'y', ,].join(128))
            return Promise.all([
              h.lyric || renderLyric(p),
              h.background || renderLogo(f),
              renderTitle(e),
              on(e, a, p),
            ]).then(function (e) {
              if (s === C.id) {
                var i = n(e, 4),
                  l = i[0],
                  c = i[1],
                  u = i[2],
                  d = i[3]
                Object.assign(o.image, {
                  lyric: l,
                  background: c,
                  meta: u,
                  holder: d,
                }),
                  h.lyric ||
                    ((o.drawing = {
                      offset: null,
                      focus: null,
                    }),
                    (r = (function (t) {
                      var e = -1,
                        r = 0
                      return {
                        timeline: (t = t || []),
                        empty: !t.length,
                        getLyric: function (a) {
                          var i = t.length
                          if (!i) return null
                          var o = t[e + 1]
                          if (a < r || (o && o[0] <= a)) {
                            var l = t.findIndex(function (n) {
                              return n[0] > a
                            })
                            ;-1 === l && (l = i), (e = l - 1)
                          }
                          if (((r = a), e > i - 1)) return null
                          var c = n(t[e] || [], 1)[0]
                          if ('number' == typeof c && a < c) return null
                          var u = e
                          return (e += 1), u
                        },
                      }
                    })(p)))
                var f = Object.assign(
                  {
                    keep: !!h.lyric,
                  },
                  o.image
                )
                t &&
                  t.postMessage({
                    type: 'load',
                    payload: f,
                  }),
                  w(),
                  L('animate', -1),
                  (C.lyrics = a),
                  (C.picUrl = m)
              }
            })
          },
          updateTime: function (n) {
            if (null != n && r && !r.empty && !i.paused && (o.image || {}).lyric) {
              var t = r.getLyric(n)
              null != t && L('animate', t)
            }
          },
          play: function () {
            w(!1), L('play')
          },
          pause: function () {
            L('pause')
          },
          set onPlay(n) {
            s.play = n
          },
          set onPause(n) {
            s.pause = n
          },
          get canvas() {
            return e
          },
          get reader() {
            return r
          },
          get video() {
            return i
          },
          set onEnter(n) {
            s.enter = n
          },
          set onLeave(n) {
            s.leave = n
          },
          get entered() {
            return c()
          },
          enter: function () {
            return Promise.resolve().then(function () {
              if (!c()) return w(), i.requestPictureInPicture()
            })
          },
          leave: function () {
            return Promise.resolve().then(function () {
              if (c()) return document.exitPictureInPicture()
            })
          },
        }
      return G.setData(), G
    }
  try {
    xn.support = document.pictureInPictureEnabled && m > 74
  } catch (n) {
    xn.support = !1
  }
  var Xn = function () {
    var t = xn(),
      e = (window.navigator || {}).userAgent,
      r = {},
      // a = function (t) {
      //   try {
      //     n('mobile_monitor', {
      //       'meta._ver': 2,
      //       'meta._dataName': 'pip_lyric_monitor',
      //       action: t,
      //       userAgent: e,
      //       chromeVersion: m,
      //       resourceId: r.id,
      //       resourceType: r.type,
      //     })
      //   } catch (n) {}
      // },
      i = document.createElement('a')
    ;(i.href = 'javascript:;'),
      i.setAttribute('hidefocus', 'true'),
      (i.className = 'icn icn-pip'),
      (i.title = '画中画歌词'),
      (i.textContent = '画中画歌词')
    var o = i.classList
    ;/Chrom(e|ium)/.test(e) || i.appendChild(t.video)
    // var l = (document.getElementsByClassName('oper f-fl') || [])[0]
    // if (l) {
    //   l.insertBefore(i, l.firstChild)
    //   var c = document.createElement('style')
    //   c.appendChild(
    //     document.createTextNode(
    //       '\n      #g_player .play {\n        width: 581px;\n      }\n      #g_player .play .m-pbar,\n      #g_player .play .m-pbar .barbg {\n        width: 466px;\n      }\n      #g_player .oper {\n        width: 87px;\n      }\n      .m-playbar .icn-pip {\n        position: relative;\n        background: url(//p1.music.126.net/DLVi_1eymwAX8gDunfd2bg==/109951165524394991.png) no-repeat 0 0;\n      }\n      .m-playbar .icn-pip:hover,\n      .m-playbar .icn-pip.active {\n        background-position-y: -25px;\n      }\n      .m-playbar .icn-pip video {\n        opacity: 0;\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n      }\n    '
    //     )
    //   ),
    //     document.head.appendChild(c),
    //     a('impress')
    // }
    var u = window.navigator.mediaSession,
      d = document.getElementById('g_player'),
      s = function (n) {
        if (d) {
          var t = (d.getElementsByClassName(n) || [])[0]
          t && t.click()
        }
      },
      h = function () {
        return s('ply')
      },
      p = function () {
        return s('pas')
      }
    u && d && (u.setActionHandler('play', h), u.setActionHandler('pause', p)),
      (i.onclick = function () {
        t[t.entered ? 'leave' : 'enter']()
      })
    var f = {}
    ;(t.onEnter = function () {
      o.contains('active') || o.add('active'), f.enter && f.enter()
      //  a('enter')
    }),
      (t.onLeave = function () {
        o.contains('active') && o.remove('active'), f.leave && f.leave()
        //  a('leave')
      }),
      (t.onPlay = function () {
        return h()
      }),
      (t.onPause = function () {
        return p()
      }),
      Object.defineProperty(t, 'onEnter', {
        set: function (n) {
          f.enter = n
        },
      }),
      Object.defineProperty(t, 'onLeave', {
        set: function (n) {
          f.leave = n
        },
      })
    var b = t.setData
    return (
      (t.setData = function (n, t) {
        var e = n || {},
          i = e.id,
          o = e.program
        ;(r.id = i), (r.type = o ? 'program' : 'song'), b(n, t), a('render')
      }),
      t
    )
  }
  return (
    Object.defineProperty(Xn, 'support', {
      get: function () {
        return xn.support
      },
    }),
    Xn
  )
}
