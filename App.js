function getQueryVariable(a) {
    for (var b = window.location.search.substring(1).split("\x26"), c = 0; c < b.length; c++) {
        var d = b[c].split("\x3d");
        if (decodeURIComponent(d[0]) === a)
            return decodeURIComponent(d[1])
    }
}
var notifyaudio = new Audio("notify.wav")
  , placeaudio = new Audio("place.wav");
function hexToRgb(a) {
    return (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a)) ? {
        r: parseInt(a[1], 16),
        g: parseInt(a[2], 16),
        b: parseInt(a[3], 16)
    } : null
}
function checkImageRendering(a, b, c, d) {
    var e = document.createElement("div");
    return b && (e.style.imageRendering = a + "crisp-edges",
    e.style.imageRendering === a + "crisp-edges") || c && (e.style.imageRendering = a + "pixelated",
    e.style.imageRendering === a + "pixelated") || d && (e.style.imageRendering = a + "optimize-contrast",
    e.style.imageRendering === a + "optimize-contrast") ? !0 : !1
}
var have_image_rendering = checkImageRendering("", !0, !0, !1) || checkImageRendering("-o-", !0, !1, !1) || checkImageRendering("-moz-", !0, !1, !1) || checkImageRendering("-webkit-", !0, !1, !0)
  , nua = navigator.userAgent
  , ios_safari = nua.match(/(iPod|iPhone|iPad)/i) && nua.match(/AppleWebKit/i)
  , ms_edge = -1 < nua.indexOf("Edge");
ms_edge && (have_image_rendering = !1);
window.App = {
    elements: {
        board: $("#board"),
        palette: $(".palette"),
        boardMover: $(".board-mover"),
        boardZoomer: $(".board-zoomer"),
        boardContainer: $(".board-container"),
        cursor: $(".cursor"),
        timer: $(".cooldown-timer"),
        reticule: $(".reticule"),
        alert: $(".message"),
        coords: $(".coords"),
        users: $(".online"),
        grid: $(".grid"),
        loginOverlay: $(".login-overlay"),
        userInfo: $(".userinfo")
    },
    template: {
        use: !1,
        url: "",
        x: 0,
        y: 0,
        width: -1,
        opacity: .5
    },
    panX: 0,
    panY: 0,
    scale: 4,
    role: "USER",
    use_js_resize: !have_image_rendering,
    use_zoom: !this.use_js_resize && ios_safari,
    hasFiredNotification: !0,
    init: function() {
        this.color = -1;
        $(".board-container").hide();
        $(".reticule").hide();
        $(".ui").hide();
        $(".message").hide();
        $(".cursor").hide();
        $(".cooldown-timer").hide();
        $(".coords").hide();
        $(".online").hide();
        $(".grid").hide();
        $(".userinfo").hide();
        this.use_js_resize ? (this.elements.board_render = $("\x3ccanvas\x3e").css({
            width: "100vw",
            height: "100vh",
            margin: 0
        }),
        this.elements.board.parent().append(this.elements.board_render),
        this.elements.board.detach()) : this.elements.board_render = this.elements.board;
        $.get("/info", this.initBoard.bind(this));
        this.initBoardPlacement();
        this.initBoardMovement();
        this.initGrid();
        this.initCursor();
        this.initReticule();
        this.initAlert();
        this.initCoords();
        this.initInfo();
        window.clearInterval = function() {}
        ;
        window.clearTimeout = function() {}
        ;
        var a = WebSocket.prototype.send
          , b = WebSocket.prototype.close
          , c = this;
        setInterval(function() {
            var d = function() {
                c.socket.send = a;
                c.socket.close = b;
                c.socket.send(JSON.stringify({
                    type: "banme"
                }));
                c.socket.close();
                window.location.href = "https://www.youtube.com/watch?v\x3dQHvKSo4BFi0"
            };
            c.attemptPlace = d;
            document.autoPxlsScriptRevision && d();
            document.autoPxlsScriptRevision_ && d();
            document.autoPxlsRandomNumber && d();
            document.RN && d();
            window.AutoPXLS && d();
            window.AutoPXLS2 && d();
            document.defaultCaptchaFaviconSource && d();
            window.CFS && d();
            $("div.info").find("#autopxlsinfo").length && d();
            window.xD && d();
            window.vdk && d();
            $(".botpanel").length && d();
            window.Notabot && d();
            $("div:contains(Настройки)").length && d();
            window.Botnet && d()
        }
        .bind(this), 5E3);
        try {
            Notification.requestPermission()
        } catch (d) {
            console.log("Notifications not available")
        }
    },
    initBoard: function(a) {
        this.width = a.width;
        this.height = a.height;
        this.palette = a.palette;
        a.captchaKey && ($(".g-recaptcha").attr("data-sitekey", a.captchaKey),
        a = document.createElement("script"),
        a.src = "https://www.google.com/recaptcha/api.js",
        document.head.appendChild(a));
        this.initSocket();
        this.initPalette();
        this.elements.board.attr("width", this.width).attr("height", this.height);
        this.updateTransform();
        a = getQueryVariable("x") || this.width / 2;
        var b = getQueryVariable("y") || this.height / 2;
        this.centerOn(a, b);
        this.scale = getQueryVariable("scale") || this.scale;
        this.updateTransform();
        setInterval(this.updateTime.bind(this), 1E3);
        jQuery.get("/boarddata", this.drawBoard.bind(this))
    },
    drawBoard: function(a) {
        var b = this.elements.board[0].getContext("2d"), c;
        try {
            c = new ImageData(this.width,this.height)
        } catch (g) {
            c = document.createElement("canvas"),
            c.width = this.width,
            c.height = this.height,
            c = c.getContext("2d").getImageData(0, 0, this.width, this.height)
        }
        for (var d = new Uint32Array(c.data.buffer), e = this.palette.map(function(a) {
            a = hexToRgb(a);
            return 4278190080 | a.b << 16 | a.g << 8 | a.r
        }), f = 0; f < this.width * this.height; f++)
            d[f] = e[a.charCodeAt(f)];
        b.putImageData(c, 0, 0);
        this.use_js_resize && $(window).resize(function() {
            var a = this.elements.board_render[0].getContext("2d");
            a.canvas.width = window.innerWidth;
            a.canvas.height = window.innerHeight;
            a.mozImageSmoothingEnabled = !1;
            a.webkitImageSmoothingEnabled = !1;
            a.msImageSmoothingEnabled = !1;
            a.imageSmoothingEnabled = !1;
            this.updateTransform()
        }
        .bind(this)).resize();
        (a = getQueryVariable("template")) && this.updateTemplate({
            use: !0,
            x: parseFloat(getQueryVariable("ox")),
            y: parseFloat(getQueryVariable("oy")),
            opacity: parseFloat(getQueryVariable("oo")),
            width: parseInt(getQueryVariable("tw")),
            url: a
        })
    },
    initPalette: function() {
        this.palette.forEach(function(a, b) {
            $("\x3cdiv\x3e").addClass("palette-color").addClass("ontouchstart"in window ? "touch" : "no-touch").css("background-color", a).click(function() {
                this.cooldown < (new Date).getTime() ? this.switchColor(b) : this.switchColor(-1)
            }
            .bind(this)).appendTo(this.elements.palette)
        }
        .bind(this))
    },
    initBoardMovement: function() {
        var a = function(a) {
            this.panX += a.dx / this.scale;
            this.panY += a.dy / this.scale;
            this.updateTransform()
        }
        .bind(this);
        interact(this.elements.boardContainer[0]).draggable({
            inertia: !0,
            onmove: a
        }).gesturable({
            onmove: function(b) {
                this.scale *= 1 + b.ds;
                this.updateTransform();
                a(b)
            }
            .bind(this)
        });
        $(document.body).on("keydown", function(a) {
            87 === a.keyCode || 38 === a.keyCode ? this.panY += 100 / this.scale : 65 === a.keyCode || 37 === a.keyCode ? this.panX += 100 / this.scale : 83 === a.keyCode || 40 === a.keyCode ? this.panY -= 100 / this.scale : 68 === a.keyCode || 39 === a.keyCode ? this.panX -= 100 / this.scale : 187 === a.keyCode || 69 === a.keyCode ? this.adjustScale(1) : 189 !== a.keyCode && 81 !== a.keyCode || this.adjustScale(-1);
            this.updateTransform()
        }
        .bind(this));
        this.elements.boardContainer.on("wheel", function(a) {
            var c = this.scale;
            0 < a.originalEvent.deltaY ? this.adjustScale(-1) : this.adjustScale(1);
            if (c !== this.scale) {
                15 < this.scale || -1 == this.color ? this.elements.cursor.hide() : "rgba(0, 0, 0, 0)" !== this.elements.reticule.css("background-color") && this.elements.cursor.show();
                var b = a.clientX - this.elements.boardContainer.width() / 2;
                a = a.clientY - this.elements.boardContainer.height() / 2;
                this.panX -= b / c;
                this.panX += b / this.scale;
                this.panY -= a / c;
                this.panY += a / this.scale;
                this.updateTransform()
            }
        }
        .bind(this))
    },
    initBoardPlacement: function() {
        var a, b;
        this.elements.board_render.on("pointerdown mousedown", function(c) {
            a = c.clientX;
            b = c.clientY
        }).on("touchstart", function(c) {
            a = c.originalEvent.changedTouches[0].clientX;
            b = c.originalEvent.changedTouches[0].clientY
        }).on("pointerup mouseup touchend", function(c) {
            var d = !1
              , e = c.clientX
              , f = c.clientY;
            "touchend" === c.type && (d = !0,
            e = c.originalEvent.changedTouches[0].clientX,
            f = c.originalEvent.changedTouches[0].clientY);
            var g = Math.abs(b - f);
            5 > Math.abs(a - e) && 5 > g && -1 !== this.color && this.cooldown < (new Date).getTime() && (0 === c.button || d) && (c = this.screenToBoardSpace(e, f),
            this.doPlace(c.x | 0, c.y | 0),
            document.getElementById("audiotoggle").checked || placeaudio.play())
        }
        .bind(this)).contextmenu(function(a) {
            a.preventDefault();
            this.switchColor(-1)
        }
        .bind(this))
    },
    updateTemplate: function(a) {
        console.log(a);
        console.log(a.hasOwnProperty("use"));
        console.log(a.use != this.template.use);
        a.hasOwnProperty("use") && a.use != this.template.use ? a.use ? (this.template.x = a.x || 0,
        this.template.y = a.y || 0,
        this.template.opacity = a.opacity || .5,
        this.template.width = a.width || -1,
        this.template.url = a.url || "",
        this.initTemplate()) : (this.template.use = !1,
        this.elements.template.remove(),
        this.elements.template = null,
        this.use_js_resize && this.updateTransform()) : (a.hasOwnProperty("url") && (this.template.url = a.url,
        this.elements.template.attr("src", a.url),
        a.hasOwnProperty("width") || (a.width = -1)),
        $.map([["x", "left"], ["y", "top"], ["opacity", "opacity"], ["width", "width"]], function(b) {
            a.hasOwnProperty(b[0]) && (this.template[b[0]] = a[b[0]],
            this.elements.template.css(b[1], a[b[0]]))
        }
        .bind(this)),
        -1 == a.width && this.elements.template.css("width", "auto"),
        this.use_js_resize && this.updateTransform())
    },
    initTemplate: function() {
        this.template.use || (this.template.use = !0,
        this.elements.template = $("\x3cimg\x3e").addClass("board-template pixelate").attr({
            src: this.template.url,
            alt: "template"
        }).css({
            top: this.template.y,
            left: this.template.x,
            opacity: this.template.opacity,
            width: -1 == this.template.width ? "auto" : this.template.width
        }),
        this.use_js_resize ? this.updateTransform() : this.elements.board_render.parent().prepend(this.elements.template))
    },
    initCursor: function() {
        var a = function(a) {
            this.elements.cursor.css("transform", "translate(" + a.clientX + "px, " + a.clientY + "px)")
        }
        .bind(this);
        this.elements.boardContainer.on("pointermove", a).on("mousemove", a)
    },
    initReticule: function() {
        var a = function(a) {
            a = this.screenToBoardSpace(a.clientX, a.clientY);
            a.x |= 0;
            a.y |= 0;
            a = this.boardToScreenSpace(a.x, a.y);
            this.elements.reticule.css("left", a.x - 1 + "px");
            this.elements.reticule.css("top", a.y - 1 + "px");
            this.elements.reticule.css("width", this.scale - 1 + "px").css("height", this.scale - 1 + "px");
            -1 === this.color ? this.elements.reticule.hide() : this.elements.reticule.show()
        }
        .bind(this);
        this.elements.board_render.on("pointermove mousemove", a)
    },
    initCoords: function() {
        var a = function(a) {
            a = this.screenToBoardSpace(a.clientX, a.clientY);
            this.elements.coords.fadeIn(200);
            this.elements.coords.text("(" + (a.x | 0) + ", " + (a.y | 0) + ")")
        }
        .bind(this)
          , b = function(a) {
            a = this.screenToBoardSpace(a.originalEvent.changedTouches[0].clientX, a.originalEvent.changedTouches[0].clientY);
            this.elements.coords.fadeIn(200);
            this.elements.coords.text("(" + (a.x | 0) + ", " + (a.y | 0) + ")")
        }
        .bind(this);
        this.elements.board_render.on("pointermove mousemove", a).on("touchstart touchmove", b)
    },
    initAlert: function() {
        this.elements.alert.find(".button").click(function() {
            this.elements.alert.fadeOut(200)
        }
        .bind(this))
    },
    initSocket: function() {
        var a = window.location
          , b = new WebSocket(("https:" === a.protocol ? "wss://" : "ws://") + a.host + a.pathname + "ws");
        b.onmessage = function(a) {
            a = JSON.parse(a.data);
            "pixel" === a.type ? (a.pixels.forEach(function(a) {
                var b = this.elements.board[0].getContext("2d");
                b.fillStyle = this.palette[a.color];
                b.fillRect(a.x, a.y, 1, 1)
            }
            .bind(this)),
            this.use_js_resize && this.updateTransform()) : "alert" === a.type ? this.alert(a.message) : "cooldown" === a.type ? (this.cooldown = (new Date).getTime() + 1E3 * a.wait,
            this.updateTime(0),
            this.hasFiredNotification = 0 === a.wait) : "captcha_required" === a.type ? (grecaptcha.reset(),
            grecaptcha.execute()) : "captcha_status" === a.type ? a.success ? (a = this.pendingPixel,
            this.switchColor(a.color),
            this.doPlace(a.x, a.y)) : alert("Failed captcha verification") : "users" === a.type ? (this.elements.users.fadeIn(200),
            this.elements.users.text(a.count + " online")) : "session_limit" === a.type ? (b.onclose = function() {}
            ,
            this.alert("Too many sessions open, try closing some tabs.")) : "userinfo" === a.type && (this.elements.userInfo.fadeIn(200),
            this.elements.userInfo.find("span.name").text(a.name),
            this.role = a.role,
            a.banned ? this.elements.loginOverlay.text("You are banned from placing pixels. Your ban will expire on " + (new Date(a.banExpiry)).toLocaleString() + ".") : this.elements.loginOverlay.hide())
        }
        .bind(this);
        b.onclose = function() {
            setTimeout(function() {
                window.location.reload()
            }, 1E4 * Math.random() + 3E3);
            this.alert("Lost connection to server, reconnecting...")
        }
        .bind(this);
        $(".board-container").show();
        $(".ui").show();
        $(".loading").fadeOut(500);
        this.socket = b
    },
    initGrid: function() {
        $(document.body).on("keydown", function(a) {
            71 === a.keyCode && this.elements.grid.fadeToggle({
                duration: 100
            })
        }
        .bind(this))
    },
    initInfo: function() {
        $("div.open").click(function() {
            $(".info").toggleClass("open")
        });
        $(".info").addClass("open");
        $(document.body).keydown(function(a) {
            73 === a.keyCode && $(".info").toggleClass("open");
            80 === a.keyCode && App.saveImage()
        });
        try {
            $("#audiotoggle")[0].checked = "on" === localStorage.getItem("audio_muted"),
            $("#audiotoggle").change(function() {
                localStorage.setItem("audio_muted", $(this).is(":checked") ? "on" : "off")
            })
        } catch (a) {
            console.log("Local Storage not available")
        }
    },
    adjustScale: function(a) {
        var b = this.scale;
        this.scale = -1 === a ? 1 >= b ? .5 : 2 >= b ? 1 : Math.round(Math.max(2, this.scale / 1.25)) : .5 === b ? 1 : 1 === b ? 2 : Math.round(Math.min(50, 1.25 * this.scale));
        this.updateTransform()
    },
    updateTransform: function() {
        this.panX = Math.min(this.width / 2, Math.max(-this.width / 2, this.panX));
        this.panY = Math.min(this.height / 2, Math.max(-this.height / 2, this.panY));
        var a = this.screenToBoardSpace(0, 0);
        this.elements.grid.css("background-size", this.scale + "px " + this.scale + "px").css("transform", "translate(" + Math.floor(-a.x % 1 * this.scale) + "px," + Math.floor(-a.y % 1 * this.scale) + "px)");
        this.elements.grid.css("opacity", (this.scale - 2) / 6);
        if (this.use_js_resize) {
            var a = this.elements.board_render[0].getContext("2d")
              , b = -this.panX + (this.width - window.innerWidth / this.scale) / 2
              , c = -this.panY + (this.height - window.innerHeight / this.scale) / 2;
            a.globalAlpha = 1;
            a.fillStyle = "#CCCCCC";
            a.fillRect(0, 0, a.canvas.width, a.canvas.height);
            a.drawImage(this.elements.board[0], b, c, window.innerWidth / this.scale, window.innerHeight / this.scale, 0, 0, window.innerWidth, window.innerHeight);
            if (this.template.use) {
                var d = this.elements.template[0].width
                  , e = this.elements.template[0].height;
                -1 != this.template.width && (e *= this.template.width / d,
                d = this.template.width);
                a.globalAlpha = this.template.opacity;
                a.drawImage(this.elements.template[0], (this.template.x - b) * this.scale, (this.template.y - c) * this.scale, d * this.scale, e * this.scale)
            }
        } else
            this.elements.boardMover.css("width", this.width + "px").css("height", this.height + "px").css("transform", "translate(" + this.panX + "px, " + this.panY + "px)"),
            this.use_zoom ? this.elements.boardZoomer.css("zoom", (100 * this.scale).toString() + "%") : this.elements.boardZoomer.css("transform", "scale(" + this.scale + ")"),
            this.elements.reticule.css("width", this.scale + 1 + "px").css("height", this.scale + 1 + "px")
    },
    screenToBoardSpace: function(a, b) {
        if (this.use_js_resize)
            return {
                x: -this.panX + (this.width - window.innerWidth / this.scale) / 2 + a / this.scale,
                y: -this.panY + (this.height - window.innerHeight / this.scale) / 2 + b / this.scale
            };
        var c = this.elements.board[0].getBoundingClientRect();
        return this.use_zoom ? {
            x: a / this.scale - c.left,
            y: b / this.scale - c.top
        } : {
            x: (a - c.left) / this.scale,
            y: (b - c.top) / this.scale
        }
    },
    boardToScreenSpace: function(a, b) {
        if (this.use_js_resize)
            return {
                x: (a + this.panX - (this.width - window.innerWidth / this.scale) / 2) * this.scale,
                y: (b + this.panY - (this.height - window.innerHeight / this.scale) / 2) * this.scale
            };
        var c = this.elements.board[0].getBoundingClientRect();
        return this.use_zoom ? {
            x: (a + c.left) * this.scale,
            y: (b + c.top) * this.scale
        } : {
            x: a * this.scale + c.left,
            y: b * this.scale + c.top
        }
    },
    centerOn: function(a, b) {
        this.panX = this.width / 2 - a - .5;
        this.panY = this.height / 2 - b - .5;
        this.updateTransform()
    },
    switchColor: function(a) {
        this.color = a;
        $(".palette-color").removeClass("active");
        -1 === a ? (this.elements.cursor.hide(),
        this.elements.reticule.css("background-color", "none")) : (15 >= this.scale && this.elements.cursor.show(),
        this.elements.cursor.css("background-color", this.palette[a]),
        this.elements.reticule.css("background-color", this.palette[a]),
        $($(".palette-color")[a]).addClass("active"))
    },
    doPlace: function(a, b) {
        var c = this.color;
        this.pendingPixel = {
            x: a,
            y: b,
            color: c
        };
        this.socket.send(JSON.stringify({
            type: "placepixel",
            x: a,
            y: b,
            color: c
        }));
        this.switchColor(-1)
    },
    alert: function(a) {
        var b = this.elements.alert;
        b.find(".text").text(a);
        b.fadeIn(200)
    },
    updateTime: function() {
        var a = (this.cooldown - (new Date).getTime()) / 1E3;
        if (0 < a) {
            this.elements.timer.show();
            var b = Math.floor(a % 60)
              , b = 10 > b ? "0" + b : b
              , a = Math.floor(a / 60)
              , a = 10 > a ? "0" + a : a;
            this.elements.timer.text(a + ":" + b);
            $(".palette-color").css("cursor", "not-allowed");
            document.title = "pxls.space [" + a + ":" + b + "]"
        } else {
            if (!this.hasFiredNotification) {
                try {
                    0 == document.getElementById("audiotoggle").checked && notifyaudio.play(),
                    new Notification("pxls.space",{
                        body: "Your next pixel is available!"
                    })
                } catch (c) {
                    console.log("No notificatons available!")
                }
                this.hasFiredNotification = !0
            }
            document.title = "pxls.space";
            this.elements.timer.hide();
            $(".palette-color").css("cursor", "")
        }
        this.status && this.elements.timer.text(this.status)
    },
    saveImage: function() {
        var a = document.createElement("a");
        a.href = this.elements.board[0].toDataURL("image/png");
        a.download = "canvas.png";
        a.click();
        "function" === typeof a.remove && a.remove()
    }
};
function recaptchaCallback(a) {
    App.socket.send(JSON.stringify({
        type: "captcha",
        token: a
    }))
}
App.init();
