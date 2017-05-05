window.App = function() {
    var r = function(a, b, c) {
        var d = function(a, b, c) {
            var e = new Date;
            b = escape(b);
            e.setDate(e.getDate() + c);
            b += null === c ? "" : "; expires\x3d" + e.toUTCString();
            document.cookie = a + "\x3d" + b
        };
        return {
            haveSupport: null,
            support: function() {
                if (null === this.haveSupport)
                    try {
                        a.setItem("test", 1),
                        this.haveSupport = 1 == a.getItem("test"),
                        a.removeItem("test")
                    } catch (e) {
                        this.haveSupport = !1
                    }
                return this.haveSupport
            },
            get: function(c) {
                if (this.support())
                    c = a.getItem(c);
                else
                    a: {
                        c = b + c;
                        var e, d, g, f = document.cookie.split(";");
                        for (e = 0; e < f.length; e++)
                            if (d = f[e].substr(0, f[e].indexOf("\x3d")),
                            g = f[e].substr(f[e].indexOf("\x3d") + 1),
                            d = d.replace(/^\s+|\s+$/g, ""),
                            d == c) {
                                c = unescape(g);
                                break a
                            }
                        c = void 0
                    }
                try {
                    return JSON.parse(c)
                } catch (C) {}
            },
            set: function(e, q) {
                q = JSON.stringify(q);
                this.support() ? a.setItem(e, q) : d(b + e, q, c)
            },
            remove: function(c) {
                this.support() ? a.removeItem(c) : d(b + c, "", -1)
            }
        }
    }
      , n = navigator.userAgent
      , v = function() {
        var a = function(a, c, d, e) {
            var b = document.createElement("div");
            return c && (b.style.imageRendering = a + "crisp-edges",
            b.style.imageRendering === a + "crisp-edges") || d && (b.style.imageRendering = a + "pixelated",
            b.style.imageRendering === a + "pixelated") || e && (b.style.imageRendering = a + "optimize-contrast",
            b.style.imageRendering === a + "optimize-contrast") ? !0 : !1
        };
        return a("", !0, !0, !1) || a("-o-", !0, !1, !1) || a("-moz-", !0, !1, !1) || a("-webkit-", !0, !1, !0)
    }()
      , A = n.match(/(iPod|iPhone|iPad)/i) && n.match(/AppleWebKit/i);
    -1 < n.indexOf("Edge") && (v = !1);
    var h = r(localStorage, "ls_", 99)
      , p = r(sessionStorage, "ss_", null)
      , l = function() {
        var a = {
            search: function(a, c) {
                c = c.split("\x26");
                for (var b = 0; b < c.length; b++) {
                    var e = c[b].split("\x3d");
                    if (decodeURIComponent(e[0]) === a)
                        return decodeURIComponent(e[1])
                }
            },
            get: function(b) {
                var c = a.search(b, window.location.hash.substring(1));
                return void 0 !== c ? c : a.search(b, window.location.search.substring(1))
            }
        };
        return {
            get: a.get
        }
    }()
      , t = function() {
        var a = {
            bad_src: [/^https?:\/\/[^\/]*raw[^\/]*git[^\/]*\/(metonator|Deklost)/gi, /^chrome\-extension:\/\/lmleofkkoohkbgjikogbpmnjmpdedfil/gi],
            checkSrc: function(b) {
                for (var c = 0; c < a.bad_src.length; c++)
                    b.match(a.bad_src[c]) && a.shadow()
            },
            init: function() {
                setInterval(a.update, 5E3);
                window.clearInterval = function() {}
                ;
                window.clearTimeout = function() {}
                ;
                var b = window.WebSocket;
                window.WebSocket = function(c, d) {
                    a.shadow();
                    return new b(c,d)
                }
                ;
                $(window).on("DOMNodeInserted", function(b) {
                    "SCRIPT" == b.target.nodeName && a.checkSrc(b.target.src)
                });
                $("script").map(function() {
                    a.checkSrc(this.src)
                })
            },
            shadow: function() {
                f.send('{"type":"shadowbanme"}')
            },
            me: function() {
                f.send('{"type":"banme"}');
                f.close();
                window.location.href = "https://www.youtube.com/watch?v\x3dQHvKSo4BFi0"
            },
            update: function() {
                var b = function() {
                    a.me()
                };
                window.App.attemptPlace = window.App.doPlace = b;
                document.autoPxlsScriptRevision && b();
                document.autoPxlsScriptRevision_ && b();
                document.autoPxlsRandomNumber && b();
                document.RN && b();
                window.AutoPXLS && b();
                window.AutoPXLS2 && b();
                document.defaultCaptchaFaviconSource && b();
                window.CFS && b();
                $("div.info").find("#autopxlsinfo").length && b();
                window.xD && b();
                window.vdk && b();
                $(".botpanel").length && b();
                window.Notabot && b();
                $("div:contains(Настройки)").length && b();
                window.Botnet && b();
                window.DrawIt && b();
                window.NomoXBot && b()
            }
        };
        return {
            init: a.init,
            me: a.me
        }
    }()
      , f = function() {
        var a = {
            ws: null,
            ws_constructor: WebSocket,
            hooks: [],
            wps: WebSocket.prototype.send,
            wpc: WebSocket.prototype.close,
            init: function() {
                if (null === a.ws) {
                    var b = window.location;
                    a.ws = new a.ws_constructor(("https:" === b.protocol ? "wss://" : "ws://") + b.host + b.pathname + "ws");
                    a.ws.onmessage = function(b) {
                        var c = JSON.parse(b.data);
                        $.map(a.hooks, function(a) {
                            a.type === c.type && a.fn(c)
                        })
                    }
                    ;
                    a.ws.onclose = function() {
                        setTimeout(function() {
                            window.location.reload()
                        }, 1E4 * Math.random() + 3E3);
                        m.show("Lost connection to server, reconnecting...")
                    }
                    ;
                    $(window).on("beforeunload", function() {
                        a.ws.onclose = function() {}
                        ;
                        a.close()
                    });
                    $(".board-container").show();
                    $(".ui").show();
                    $(".loading").fadeOut(500)
                }
            },
            on: function(b, c) {
                a.hooks.push({
                    type: b,
                    fn: c
                })
            },
            close: function() {
                a.ws.close = a.wpc;
                a.ws.close()
            },
            send: function(b) {
                a.ws.send = a.wps;
                "string" == typeof b ? a.ws.send(b) : a.ws.send(JSON.stringify(b))
            }
        };
        return {
            init: a.init,
            on: a.on,
            send: a.send,
            close: a.close
        }
    }()
      , g = function() {
        var a = {
            elements: {
                board: $("#board"),
                board_render: null,
                mover: $(".board-mover"),
                zoomer: $(".board-zoomer"),
                container: $(".board-container")
            },
            use_js_render: !v,
            use_zoom: v && A,
            width: 0,
            height: 0,
            scale: 4,
            pan: {
                x: 0,
                y: 0
            },
            centerOn: function(b, c) {
                a.pan.x = a.width / 2 - b - .5;
                a.pan.y = a.height / 2 - c - .5;
                a.update()
            },
            draw: function(b) {
                var c = a.elements.board[0].getContext("2d"), d;
                try {
                    d = new ImageData(a.width,a.height)
                } catch (B) {
                    d = document.createElement("canvas"),
                    d.width = a.width,
                    d.height = a.height,
                    d = d.getContext("2d").getImageData(0, 0, a.width, a.height)
                }
                for (var e = new Uint32Array(d.data.buffer), f = k.getPaletteRGB(), g = 0; g < a.width * a.height; g++)
                    e[g] = f[b.charCodeAt(g)];
                c.putImageData(d, 0, 0);
                a.update()
            },
            initInteraction: function() {
                var b = function(b) {
                    a.pan.x += b.dx / a.scale;
                    a.pan.y += b.dy / a.scale;
                    a.update()
                };
                interact(a.elements.container[0]).draggable({
                    inertia: !0,
                    onmove: b
                }).gesturable({
                    onmove: function(c) {
                        a.scale *= 1 + c.ds;
                        b(c)
                    }
                });
                $(document.body).on("keydown", function(b) {
                    87 === b.keyCode || 38 === b.keyCode ? a.pan.y += 100 / a.scale : 65 === b.keyCode || 37 === b.keyCode ? a.pan.x += 100 / a.scale : 83 === b.keyCode || 40 === b.keyCode ? a.pan.y -= 100 / a.scale : 68 === b.keyCode || 39 === b.keyCode ? a.pan.x -= 100 / a.scale : 187 === b.keyCode || 69 === b.keyCode ? a.setScale(1) : 189 === b.keyCode || 81 === b.keyCode ? a.setScale(-1) : 80 === b.keyCode && a.save();
                    a.update()
                });
                a.elements.container.on("wheel", function(b) {
                    var c = a.scale;
                    0 < b.originalEvent.deltaY ? a.setScale(-1) : a.setScale(1);
                    if (c !== a.scale) {
                        var d = b.clientX - a.elements.container.width() / 2;
                        b = b.clientY - a.elements.container.height() / 2;
                        a.pan.x -= d / c;
                        a.pan.x += d / a.scale;
                        a.pan.y -= b / c;
                        a.pan.y += b / a.scale;
                        a.update();
                        k.update()
                    }
                });
                var c, d;
                a.elements.board_render.on("pointerdown mousedown", function(a) {
                    c = a.clientX;
                    d = a.clientY
                }).on("touchstart", function(a) {
                    c = a.originalEvent.changedTouches[0].clientX;
                    d = a.originalEvent.changedTouches[0].clientY
                }).on("pointerup mouseup touchend", function(b) {
                    var e = !1
                      , g = b.clientX
                      , f = b.clientY;
                    "touchend" === b.type && (e = !0,
                    g = b.originalEvent.changedTouches[0].clientX,
                    f = b.originalEvent.changedTouches[0].clientY);
                    var h = Math.abs(d - f);
                    5 > Math.abs(c - g) && 5 > h && (0 === b.button || e) && (b = a.fromScreen(g, f),
                    k.place(b.x | 0, b.y | 0))
                }).contextmenu(function(a) {
                    a.preventDefault();
                    k.switch(-1)
                })
            },
            init: function() {
                $(".ui").hide();
                a.elements.container.hide();
                a.use_js_render ? (a.elements.board_render = $("\x3ccanvas\x3e").css({
                    width: "100vw",
                    height: "100vh",
                    margin: 0,
                    marginTop: 3
                }),
                a.elements.board.parent().append(a.elements.board_render),
                a.elements.board.detach()) : a.elements.board_render = a.elements.board;
                a.initInteraction()
            },
            start: function() {
                $.get("/info", function(b) {
                    a.width = b.width;
                    a.height = b.height;
                    k.setPalette(b.palette);
                    b.captchaKey && ($(".g-recaptcha").attr("data-sitekey", b.captchaKey),
                    $.getScript("https://www.google.com/recaptcha/api.js"));
                    a.elements.board.attr({
                        width: a.width,
                        height: a.height
                    });
                    b = l.get("x") || a.width / 2;
                    var c = l.get("y") || a.height / 2;
                    a.scale = l.get("scale") || a.scale;
                    a.centerOn(b, c);
                    f.init();
                    $.get("/boarddata", a.draw);
                    a.use_js_render ? $(window).resize(function() {
                        var b = a.elements.board_render[0].getContext("2d");
                        b.canvas.width = window.innerWidth;
                        b.canvas.height = window.innerHeight;
                        b.mozImageSmoothingEnabled = !1;
                        b.webkitImageSmoothingEnabled = !1;
                        b.msImageSmoothingEnabled = !1;
                        b.imageSmoothingEnabled = !1;
                        a.update()
                    }).resize() : $(window).resize(function() {
                        k.update();
                        u.update()
                    });
                    (b = l.get("template")) && w.update({
                        use: !0,
                        x: parseFloat(l.get("ox")),
                        y: parseFloat(l.get("oy")),
                        opacity: parseFloat(l.get("oo")),
                        width: parseFloat(l.get("tw")),
                        url: b
                    })
                })
            },
            update: function(b) {
                a.pan.x = Math.min(a.width / 2, Math.max(-a.width / 2, a.pan.x));
                a.pan.y = Math.min(a.height / 2, Math.max(-a.height / 2, a.pan.y));
                if (a.use_js_render) {
                    b = a.elements.board_render[0].getContext("2d");
                    var c = -a.pan.x + (a.width - window.innerWidth / a.scale) / 2
                      , d = -a.pan.y + (a.height - window.innerHeight / a.scale) / 2;
                    b.globalAlpha = 1;
                    b.fillStyle = "#CCCCCC";
                    b.fillRect(0, 0, b.canvas.width, b.canvas.height);
                    b.drawImage(a.elements.board[0], c, d, window.innerWidth / a.scale, window.innerHeight / a.scale, 0, 0, window.innerWidth, window.innerHeight);
                    w.draw(b, c, d);
                    k.update();
                    u.update();
                    return !0
                }
                if (b)
                    return !1;
                a.elements.mover.css({
                    width: a.width,
                    height: a.height,
                    transform: "translate(" + a.pan.x + "px, " + a.pan.y + "px)"
                });
                a.use_zoom ? a.elements.zoomer.css("zoom", (100 * a.scale).toString() + "%") : a.elements.zoomer.css("transform", "scale(" + a.scale + ")");
                k.update();
                u.update();
                return !0
            },
            getScale: function() {
                return a.scale
            },
            setScale: function(b) {
                var c = a.scale;
                a.scale = -1 === b ? 1 >= c ? .5 : 2 >= c ? 1 : Math.round(Math.max(2, a.scale / 1.25)) : .5 === c ? 1 : 1 === c ? 2 : Math.round(Math.min(50, 1.25 * a.scale));
                a.update()
            },
            setPixel: function(b, c, d) {
                var e = a.elements.board[0].getContext("2d");
                e.fillStyle = d;
                e.fillRect(b, c, 1, 1)
            },
            fromScreen: function(b, c) {
                if (a.use_js_render)
                    return {
                        x: -a.pan.x + (a.width - window.innerWidth / a.scale) / 2 + b / a.scale,
                        y: -a.pan.y + (a.height - window.innerHeight / a.scale) / 2 + c / a.scale
                    };
                var d = a.elements.board[0].getBoundingClientRect();
                return a.use_zoom ? {
                    x: b / a.scale - d.left,
                    y: c / a.scale - d.top
                } : {
                    x: (b - d.left) / a.scale,
                    y: (c - d.top) / a.scale
                }
            },
            toScreen: function(b, c) {
                if (a.use_js_render)
                    return {
                        x: (b + a.pan.x - (a.width - window.innerWidth / a.scale) / 2) * a.scale,
                        y: (c + a.pan.y - (a.height - window.innerHeight / a.scale) / 2) * a.scale
                    };
                var d = a.elements.board[0].getBoundingClientRect();
                return a.use_zoom ? {
                    x: (b + d.left) * a.scale,
                    y: (c + d.top) * a.scale
                } : {
                    x: b * a.scale + d.left,
                    y: c * a.scale + d.top
                }
            },
            save: function() {
                var b = document.createElement("a");
                b.href = a.elements.board[0].toDataURL("image/png");
                b.download = "canvas.png";
                b.click();
                "function" === typeof b.remove && b.remove()
            },
            getRenderBoard: function() {
                return a.elements.board_render
            }
        };
        return {
            init: a.init,
            start: a.start,
            update: a.update,
            getScale: a.getScale,
            setScale: a.setScale,
            setPixel: a.setPixel,
            fromScreen: a.fromScreen,
            toScreen: a.toScreen,
            save: a.save,
            getRenderBoard: a.getRenderBoard
        }
    }()
      , w = function() {
        var a = {
            elements: {
                template: null
            },
            t: {
                use: !1,
                url: "",
                x: 0,
                y: 0,
                width: -1,
                opacity: .5
            },
            lazy_init: function() {
                a.t.use || (a.t.use = !0,
                a.elements.template = $("\x3cimg\x3e").addClass("board-template pixelate").attr({
                    src: a.t.url,
                    alt: "template"
                }).css({
                    top: a.t.y,
                    left: a.t.x,
                    opacity: a.t.opacity,
                    width: -1 === a.t.width ? "auto" : a.t.width
                }),
                g.update(!0) || g.getRenderBoard().parent().prepend(a.elements.template))
            },
            update: function(b) {
                b.hasOwnProperty("use") && b.use !== a.t.use ? b.use ? (a.t.x = b.x || 0,
                a.t.y = b.y || 0,
                a.t.opacity = b.opacity || .5,
                a.t.width = b.width || -1,
                a.t.url = b.url || "",
                a.lazy_init()) : (a.t.use = !1,
                a.elements.template.remove(),
                a.elements.template = null,
                g.update(!0)) : (b.hasOwnProperty("url") && (a.t.url = b.url,
                a.elements.template.attr("src", b.url),
                b.hasOwnProperty("width") || (b.width = -1)),
                $.map([["x", "left"], ["y", "top"], ["opacity", "opacity"], ["width", "width"]], function(c) {
                    b.hasOwnProperty(c[0]) && (a.t[c[0]] = b[c[0]],
                    a.elements.template.css(c[1], b[c[0]]))
                }),
                -1 === b.width && a.elements.template.css("width", "auto"),
                g.update(!0))
            },
            draw: function(b, c, d) {
                if (a.t.use) {
                    var e = a.elements.template[0].width
                      , f = a.elements.template[0].height
                      , h = g.getScale();
                    -1 !== a.t.width && (f *= a.t.width / e,
                    e = a.t.width);
                    b.globalAlpha = a.t.opacity;
                    b.drawImage(a.elements.template[0], (a.t.x - c) * h, (a.t.y - d) * h, e * h, f * h)
                }
            }
        };
        return {
            update: a.update,
            draw: a.draw
        }
    }()
      , u = function() {
        var a = {
            elements: {
                grid: $(".grid")
            },
            init: function() {
                a.elements.grid.hide();
                $(document.body).on("keydown", function(b) {
                    71 === b.keyCode && a.elements.grid.fadeToggle({
                        duration: 100
                    })
                })
            },
            update: function() {
                var b = g.fromScreen(0, 0)
                  , c = g.getScale();
                a.elements.grid.css({
                    backgroundSize: c + "px " + c + "px",
                    transform: "translate(" + Math.floor(-b.x % 1 * c) + "px," + Math.floor(-b.y % 1 * c) + "px)",
                    opacity: (c - 2) / 6
                })
            }
        };
        return {
            init: a.init,
            update: a.update
        }
    }()
      , k = function() {
        var a = {
            elements: {
                palette: $(".palette"),
                cursor: $(".cursor"),
                reticule: $(".reticule")
            },
            palette: [],
            reticule: {
                x: 0,
                y: 0
            },
            audio: new Audio("place.wav"),
            color: -1,
            pendingPixel: {
                x: 0,
                y: 0,
                color: -1
            },
            autoreset: !0,
            setAutoReset: function(b) {
                a.autoreset = b ? !0 : !1
            },
            switch: function(b) {
                a.color = b;
                $(".palette-color").removeClass("active");
                -1 === b ? (a.elements.cursor.hide(),
                a.elements.reticule.hide()) : (15 >= a.scale && a.elements.cursor.show(),
                a.elements.cursor.css("background-color", a.palette[b]),
                a.elements.reticule.css("background-color", a.palette[b]),
                $($(".palette-color")[b]).addClass("active"))
            },
            place: function(b, c) {
                x.cooledDown() && -1 !== a.color && (h.get("audio_muted") || a.audio.play(),
                a._place(b, c))
            },
            _place: function(b, c) {
                a.pendingPixel.x = b;
                a.pendingPixel.y = c;
                a.pendingPixel.color = a.color;
                f.send({
                    type: "place",
                    x: b,
                    y: c,
                    color: a.color
                });
                a.autoreset && a.switch(-1)
            },
            update: function(b, c) {
                void 0 !== b && (b = g.fromScreen(b, c),
                a.reticule = {
                    x: b.x |= 0,
                    y: b.y |= 0
                });
                -1 === a.color ? (a.elements.reticule.hide(),
                a.elements.cursor.hide()) : (b = g.toScreen(a.reticule.x, a.reticule.y),
                c = g.getScale(),
                a.elements.reticule.css({
                    left: b.x - 1,
                    top: b.y - 1,
                    width: c - 1,
                    height: c - 1
                }).show(),
                a.elements.cursor.show())
            },
            setPalette: function(b) {
                a.palette = b;
                a.elements.palette.empty().append($.map(a.palette, function(b, d) {
                    return $("\x3cdiv\x3e").addClass("palette-color").addClass("ontouchstart"in window ? "touch" : "no-touch").css("background-color", a.palette[d]).click(function() {
                        x.cooledDown() && a.switch(d)
                    })
                }))
            },
            init: function() {
                a.elements.reticule.hide();
                a.elements.cursor.hide();
                g.getRenderBoard().on("pointermove mousemove", function(b) {
                    a.update(b.clientX, b.clientY)
                });
                $(window).on("pointermove mousemove", function(b) {
                    a.elements.cursor.css("transform", "translate(" + b.clientX + "px, " + b.clientY + "px)")
                });
                f.on("pixel", function(b) {
                    $.map(b.pixels, function(b) {
                        g.setPixel(b.x, b.y, a.palette[b.color])
                    });
                    g.update(!0)
                });
                f.on("captcha_required", function(a) {
                    grecaptcha.reset();
                    grecaptcha.execute()
                });
                f.on("captcha_status", function(b) {
                    b.success ? (b = a.pendingPixel,
                    a.switch(b.color),
                    a._place(b.x, b.y)) : m.show("Failed captcha verification")
                });
                window.recaptchaCallback = function(a) {
                    f.send({
                        type: "captcha",
                        token: a
                    })
                }
            },
            hexToRgb: function(a) {
                return (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a)) ? {
                    r: parseInt(a[1], 16),
                    g: parseInt(a[2], 16),
                    b: parseInt(a[3], 16)
                } : null
            },
            getPaletteRGB: function() {
                return $.map(a.palette, function(b) {
                    b = a.hexToRgb(b);
                    return 4278190080 | b.b << 16 | b.g << 8 | b.r
                })
            }
        };
        return {
            init: a.init,
            update: a.update,
            place: a.place,
            switch: a.switch,
            setPalette: a.setPalette,
            getPaletteRGB: a.getPaletteRGB,
            setAutoReset: a.setAutoReset
        }
    }()
      , r = function() {
        return {
            init: function() {
                $("div.open").click(function() {
                    $(".info").toggleClass("open");
                    h.set("info_closed", !$(".info").hasClass("open"))
                });
                h.get("info_closed") || $(".info").addClass("open");
                $(document.body).keydown(function(a) {
                    73 === a.keyCode && ($(".info").toggleClass("open"),
                    h.set("info_closed", !$(".info").hasClass("open")))
                });
                $("#audiotoggle")[0].checked = h.get("audio_muted");
                $("#audiotoggle").change(function() {
                    h.set("audio_muted", $(this).is(":checked"))
                })
            }
        }
    }()
      , m = function() {
        var a = {
            elements: {
                alert: $(".message")
            },
            show: function(b) {
                a.elements.alert.find(".text").empty().append(b);
                a.elements.alert.fadeIn(200)
            },
            init: function() {
                a.elements.alert.hide().find(".button").click(function() {
                    a.elements.alert.fadeOut(200)
                });
                f.on("alert", function(b) {
                    a.show(b.message)
                })
            }
        };
        return {
            init: a.init,
            show: a.show
        }
    }()
      , x = function() {
        var a = {
            elements: {
                timer: $(".cooldown-timer")
            },
            hasFiredNotification: !0,
            cooldown: 0,
            runningTimer: !1,
            focus: !0,
            audio: new Audio("notify.wav"),
            cooledDown: function() {
                return a.cooldown < (new Date).getTime()
            },
            update: function(b) {
                var c = (a.cooldown - (new Date).getTime() - 1) / 1E3;
                a.status && a.elements.timer.text(a.status);
                if (0 < c) {
                    a.elements.timer.show();
                    c++;
                    var d = Math.floor(c % 60)
                      , d = 10 > d ? "0" + d : d
                      , c = Math.floor(c / 60)
                      , c = 10 > c ? "0" + c : c;
                    a.elements.timer.text(c + ":" + d);
                    $(".palette-color").css("cursor", "not-allowed");
                    document.title = "[" + c + ":" + d + "] pxls.space";
                    if (!a.runningTimer || b)
                        a.runningTimer = !0,
                        setTimeout(function() {
                            a.update(!0)
                        }, 1E3)
                } else
                    a.runningTimer = !1,
                    a.hasFiredNotification || (h.get("audio_muted") || a.audio.play(),
                    a.focus || y.show("Your next pixel is available!"),
                    a.hasFiredNotification = !0),
                    document.title = "pxls.space",
                    a.elements.timer.hide(),
                    $(".palette-color").css("cursor", "")
            },
            init: function() {
                a.elements.timer.hide();
                $(window).focus(function() {
                    a.focus = !0
                }).blur(function() {
                    a.focus = !1
                });
                f.on("cooldown", function(b) {
                    a.cooldown = (new Date).getTime() + 1E3 * b.wait;
                    a.hasFiredNotification = 0 === b.wait;
                    a.update()
                })
            }
        };
        return {
            init: a.init,
            cooledDown: a.cooledDown
        }
    }()
      , n = function() {
        var a = {
            elements: {
                coords: $(".coords")
            },
            init: function() {
                a.elements.coords.hide();
                g.getRenderBoard().on("pointermove mousemove", function(b) {
                    b = g.fromScreen(b.clientX, b.clientY);
                    a.elements.coords.text("(" + (b.x | 0) + ", " + (b.y | 0) + ")").fadeIn(200)
                }).on("touchstart touchmove", function(b) {
                    b = g.fromScreen(b.originalEvent.changedTouches[0].clientX, b.originalEvent.changedTouches[0].clientY);
                    a.elements.coords.text("(" + (b.x | 0) + ", " + (b.y | 0) + ")").fadeIn(200)
                })
            }
        };
        return {
            init: a.init
        }
    }()
      , z = function() {
        var a = {
            elements: {
                users: $(".online"),
                userInfo: $(".userinfo"),
                loginOverlay: $(".login-overlay")
            },
            role: "USER",
            getRole: function() {
                return a.role
            },
            init: function() {
                a.elements.users.hide();
                a.elements.userInfo.hide();
                f.on("users", function(b) {
                    a.elements.users.text(b.count + " online").fadeIn(200)
                });
                f.on("session_limit", function(a) {
                    f.close();
                    m.show("Too many sessions open, try closing some tabs.")
                });
                f.on("userinfo", function(b) {
                    a.elements.userInfo.find("span.name").text(b.name);
                    a.elements.userInfo.fadeIn(200);
                    a.role = b.role;
                    b.banned ? a.elements.loginOverlay.text("You are banned from placing pixels. Your ban will expire on " + (new Date(b.banExpiry)).toLocaleString() + ".") : a.elements.loginOverlay.hide()
                })
            }
        };
        return {
            board: a.board,
            init: a.init,
            getRole: a.getRole
        }
    }()
      , y = function() {
        return {
            init: function() {
                try {
                    Notification.requestPermission()
                } catch (a) {
                    console.log("Notifications not available")
                }
            },
            show: function(a) {
                try {
                    (new Notification("pxls.space",{
                        body: a,
                        icon: "favicon.ico"
                    })).onclick = function() {
                        parent.focus();
                        window.focus();
                        this.close()
                    }
                } catch (b) {
                    console.log("No notifications available!")
                }
            }
        }
    }();
    p.get("url_params") && (window.location.hash = p.get("url_params"),
    p.remove("url_params"));
    $(".login-overlay a").click(function(a) {
        var b = window.location.hash.substring(1);
        a = window.location.search.substring(1);
        b ? a && (b += "\x26" + a) : b = a;
        p.set("url_params", b)
    });
    g.init();
    t.init();
    u.init();
    k.init();
    r.init();
    m.init();
    x.init();
    n.init();
    z.init();
    y.init();
    g.start();
    $.getScript("admin/admin.js").done(function() {
        initAdmin({
            board: g,
            socket: f,
            user: z,
            place: k,
            alert: m
        })
    });
    return {
        ls: h,
        ss: p,
        updateTemplate: function(a) {
            w.update(a)
        },
        alert: function(a) {
            m.show(a)
        },
        doPlace: function() {
            t.me()
        },
        attemptPlace: function() {
            t.me()
        },
        banme: function() {
            t.me()
        }
    }
}();
