function getQueryVariable(a) {
    for (var c = window.location.search.substring(1)
            .split("&"), b = 0; b < c.length; b++) {
        var d = c[b].split("=");
        if (decodeURIComponent(d[0]) === a) return decodeURIComponent(d[1])
    }
}

function hexToRgb(a) {
    return (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a)) ? {
        r: parseInt(a[1], 16),
        g: parseInt(a[2], 16),
        b: parseInt(a[3], 16)
    } : null
}
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
    panX: 0,
    panY: 0,
    scale: 4,
    use_zoom: navigator.userAgent.match(/(iPod|iPhone|iPad)/i) && navigator.userAgent.match(/AppleWebKit/i),
    hasFiredNotification: !0,
    init: function() {
        this.color = -1;
        $(".board-container")
            .hide();
        $(".reticule")
            .hide();
        $(".ui")
            .hide();
        $(".message")
            .hide();
        $(".cursor")
            .hide();
        $(".cooldown-timer")
            .hide();
        $(".online")
            .hide();
        $(".grid")
            .hide();
        $(".userinfo")
            .hide();
        $.get("/info", this.initBoard.bind(this));
        this.initBoardPlacement();
        this.initBoardMovement();
        this.initCursor();
        this.initReticule();
        this.initAlert();
        this.initCoords();
        this.initGrid();
        this.initInfo();
        setInterval(function() {
            document.autoPxlsScriptRevision && this.banMe();
            window.Botnet &&
                this.banMe();
            window.AutoPXLS && this.banMe()
        }.bind(this), 5E3);
        Notification.requestPermission()
    },
    initBoard: function(a) {
        this.width = a.width;
        this.height = a.height;
        this.palette = a.palette;
        a.captchaKey && ($(".g-recaptcha")
            .attr("data-sitekey", a.captchaKey), a = document.createElement("script"), a.src = "https://www.google.com/recaptcha/api.js", document.head.appendChild(a));
        this.initPalette();
        this.elements.board.attr("width", this.width)
            .attr("height", this.height);
        this.updateTransform();
        a = getQueryVariable("x") || this.width /
            2;
        var c = getQueryVariable("y") || this.height / 2;
        this.centerOn(a, c);
        this.scale = getQueryVariable("scale") || this.scale;
        this.updateTransform();
        this.initSocket();
        setInterval(this.updateTime.bind(this), 1E3);
        jQuery.get("/boarddata", this.drawBoard.bind(this))
    },
    drawBoard: function(a) {
        for (var c = this.elements.board[0].getContext("2d"), b = new ImageData(this.width, this.height), d = new Uint32Array(b.data.buffer), e = this.palette.map(function(a) {
                a = hexToRgb(a);
                return 4278190080 | a.b << 16 | a.g << 8 | a.r
            }), f = 0; f < this.width * this.height; f++) d[f] =
            e[a.charCodeAt(f)];
        c.putImageData(b, 0, 0)
    },
    initPalette: function() {
        this.palette.forEach(function(a, c) {
            $("<div>")
                .addClass("palette-color")
                .addClass("ontouchstart" in window ? "touch" : "no-touch")
                .css("background-color", a)
                .click(function() {
                    this.cooldown < (new Date)
                        .getTime() ? this.switchColor(c) : this.switchColor(-1)
                }.bind(this))
                .appendTo(this.elements.palette)
        }.bind(this))
    },
    initBoardMovement: function() {
        var a = function(a) {
            this.panX += a.dx / this.scale;
            this.panY += a.dy / this.scale;
            this.updateTransform()
        }.bind(this);
        interact(this.elements.boardContainer[0])
            .draggable({
                inertia: !0,
                onmove: a
            })
            .gesturable({
                onmove: function(c) {
                    this.scale *= 1 + c.ds;
                    this.updateTransform();
                    a(c)
                }.bind(this)
            });
        $(document.body)
            .on("keydown", function(a) {
                if (87 === a.keyCode || 38 === a.keyCode) this.panY += 100 / this.scale;
                else if (65 === a.keyCode || 37 === a.keyCode) this.panX += 100 / this.scale;
                else if (83 === a.keyCode || 40 === a.keyCode) this.panY -= 100 / this.scale;
                else if (68 === a.keyCode || 39 === a.keyCode) this.panX -= 100 / this.scale;
                this.updateTransform()
            }.bind(this));
        this.elements.boardContainer.on("wheel", function(a) {
            var b = this.scale;
            this.scale = 0 < a.originalEvent.deltaY ? 1 >= b ? .5 : 2 >= b ? 1 : Math.round(Math.max(2, this.scale / 1.25)) : .5 == b ? 1 : 1 == b ? 2 : Math.round(Math.min(50, 1.25 * this.scale));
            if (b !== this.scale) {
                15 < this.scale || -1 == this.color ? this.elements.cursor.hide() : "rgba(0, 0, 0, 0)" !== this.elements.reticule.css("background-color") && this.elements.cursor.show();
                var c = a.clientX - this.elements.boardContainer.width() / 2;
                a = a.clientY - this.elements.boardContainer.height() / 2;
                this.panX -= c / b;
                this.panX += c / this.scale;
                this.panY -=
                    a / b;
                this.panY += a / this.scale;
                this.updateTransform()
            }
        }.bind(this))
    },
    initBoardPlacement: function() {
        var a, c;
        this.elements.board.on("pointerdown mousedown", function(b) {
                a = b.clientX;
                c = b.clientY
            })
            .on("touchstart", function(b) {
                a = b.originalEvent.changedTouches[0].clientX;
                c = b.originalEvent.changedTouches[0].clientY
            })
            .on("pointerup mouseup touchend", function(b) {
                var d = !1,
                    e = b.clientX,
                    f = b.clientY;
                "touchend" === b.type && (d = !0, e = b.originalEvent.changedTouches[0].clientX, f = b.originalEvent.changedTouches[0].clientY);
                var g =
                    Math.abs(c - f);
                5 > Math.abs(a - e) && 5 > g && -1 !== this.color && this.cooldown < (new Date)
                    .getTime() && (0 === b.button || d) && (b = this.screenToBoardSpace(e, f), this.attemptPlace(b.x | 0, b.y | 0))
            }.bind(this))
            .contextmenu(function(a) {
                a.preventDefault();
                this.switchColor(-1)
            }.bind(this))
    },
    initCursor: function() {
        var a = function(a) {
            this.elements.cursor.css("transform", "translate(" + a.clientX + "px, " + a.clientY + "px)")
        }.bind(this);
        this.elements.boardContainer.on("pointermove", a)
            .on("mousemove", a)
    },
    initReticule: function() {
        var a = function(a) {
            a =
                this.screenToBoardSpace(a.clientX, a.clientY);
            a.x |= 0;
            a.y |= 0;
            a = this.boardToScreenSpace(a.x, a.y);
            this.elements.reticule.css("left", a.x - 1 + "px");
            this.elements.reticule.css("top", a.y - 1 + "px");
            this.elements.reticule.css("width", this.scale - 1 + "px")
                .css("height", this.scale - 1 + "px"); - 1 === this.color ? this.elements.reticule.hide() : this.elements.reticule.show()
        }.bind(this);
        this.elements.board.on("pointermove", a)
            .on("mousemove", a)
    },
    initCoords: function() {
        var a = function(a) {
            a = this.screenToBoardSpace(a.clientX, a.clientY);
            this.elements.coords.text("(" + (a.x | 0) + ", " + (a.y | 0) + ")")
        }.bind(this);
        this.elements.board.on("pointermove", a)
            .on("mousemove", a)
    },
    initAlert: function() {
        this.elements.alert.find(".close")
            .click(function() {
                this.elements.alert.fadeOut(200)
            }.bind(this))
    },
    initSocket: function() {
        var a = window.location,
            c = new WebSocket(("https:" === a.protocol ? "wss://" : "ws://") + a.host + a.pathname + "ws");
        c.onmessage = function(a) {
            a = JSON.parse(a.data);
            "pixel" === a.type ? a.pixels.forEach(function(a) {
                var b = this.elements.board[0].getContext("2d");
                b.fillStyle = this.palette[a.color];
                b.fillRect(a.x, a.y, 1, 1)
            }.bind(this)) : "alert" === a.type ? this.alert(a.message) : "cooldown" === a.type ? (this.cooldown = (new Date)
                .getTime() + 1E3 * a.wait, this.updateTime(0), this.hasFiredNotification = 0 === a.wait) : "captcha_required" === a.type ? (grecaptcha.reset(), grecaptcha.execute()) : "captcha_status" === a.type ? a.success ? (a = this.pendingPixel, this.switchColor(a.color), this.attemptPlace(a.x, a.y)) : alert("Failed captcha verification") : "users" === a.type ? (this.elements.users.fadeIn(200), this.elements.users.text(a.count + " online")) : "session_limit" === a.type ? (c.onclose = function() {}, this.alert("Too many sessions open, try closing some tabs.")) : "userinfo" === a.type && (this.elements.userInfo.fadeIn(200), this.elements.userInfo.find("span.name")
                .text(a.name), a.banned ? this.elements.loginOverlay.text("You are banned from placing pixels. Your ban will expire on " + (new Date(a.banExpiry))
                    .toLocaleString() + ".") : this.elements.loginOverlay.hide())
        }.bind(this);
        c.onclose = function() {
            setTimeout(function() {
                window.location.reload()
            }, 1E4 * Math.random() + 3E3);
            this.alert("Lost connection to server, reconnecting...")
        };
        $(".board-container")
            .show();
        $(".ui")
            .show();
        $(".loading")
            .fadeOut(500);
        this.socket = c
    },
    initGrid: function() {
        $(document.body)
            .keydown(function(a) {
                71 === a.keyCode && this.elements.grid.fadeToggle({
                    duration: 100
                })
            }.bind(this))
    },
    initInfo: function() {
        $("div.open")
            .click(function() {
                $(".info")
                    .toggleClass("open")
            });
        $(document.body)
            .keydown(function(a) {
                73 === a.keyCode && $(".info")
                    .toggleClass("open");
                80 === a.keyCode && App.saveImage()
            })
    },
    updateTransform: function() {
        this.panX = Math.min(this.width / 2, Math.max(-this.width / 2, this.panX));
        this.panY = Math.min(this.height / 2, Math.max(-this.height / 2, this.panY));
        this.elements.boardMover.css("width", this.width + "px")
            .css("height", this.height + "px")
            .css("transform", "translate(" + this.panX + "px, " + this.panY + "px)");
        this.use_zoom ? this.elements.boardZoomer.css("zoom", (100 * this.scale)
            .toString() + "%") : this.elements.boardZoomer.css("transform", "scale(" + this.scale + ")");
        this.elements.reticule.css("width", this.scale +
                1 + "px")
            .css("height", this.scale + 1 + "px");
        var a = this.screenToBoardSpace(0, 0);
        this.elements.grid.css("background-size", this.scale + "px " + this.scale + "px")
            .css("transform", "translate(" + Math.floor(-a.x % 1 * this.scale) + "px," + Math.floor(-a.y % 1 * this.scale) + "px)");
        this.elements.grid.css("opacity", (this.scale - 2) / 6)
    },
    screenToBoardSpace: function(a, c) {
        var b = this.elements.board[0].getBoundingClientRect(),
            d = (a - b.left) / this.scale,
            e = (c - b.top) / this.scale;
        this.use_zoom && (d = a / this.scale - b.left, e = c / this.scale - b.top);
        return {
            x: d,
            y: e
        }
    },
    boardToScreenSpace: function(a, c) {
        var b = this.elements.board[0].getBoundingClientRect();
        return {
            x: a * this.scale + b.left,
            y: c * this.scale + b.top
        }
    },
    centerOn: function(a, c) {
        this.panX = this.width / 2 - a - .5;
        this.panY = this.height / 2 - c - .5;
        this.updateTransform()
    },
    switchColor: function(a) {
        this.color = a;
        $(".palette-color")
            .removeClass("active"); - 1 === a ? (this.elements.cursor.hide(), this.elements.reticule.css("background-color", "none")) : (15 >= this.scale && this.elements.cursor.show(), this.elements.cursor.css("background-color", this.palette[a]), this.elements.reticule.css("background-color", this.palette[a]), $($(".palette-color")[a])
            .addClass("active"))
    },
    attemptPlace: function(a, c) {
        var b = this.color;
        this.pendingPixel = {
            x: a,
            y: c,
            color: b
        };
        this.socket.send(JSON.stringify({
            type: "place",
            x: a,
            y: c,
            color: b
        }));
        this.switchColor(-1)
    },
    alert: function(a) {
        var c = this.elements.alert;
        c.find(".text")
            .text(a);
        c.fadeIn(200)
    },
    updateTime: function() {
        var a = (this.cooldown - (new Date)
            .getTime()) / 1E3;
        if (0 < a) {
            this.elements.timer.show();
            var c = Math.floor(a %
                    60),
                c = 10 > c ? "0" + c : c,
                a = Math.floor(a / 60),
                a = 10 > a ? "0" + a : a;
            this.elements.timer.text(a + ":" + c);
            $(".palette-color")
                .css("cursor", "not-allowed");
            document.title = "pxls.space [" + a + ":" + c + "]"
        } else {
            if (!this.hasFiredNotification) {
                try {
                    new Notification("pxls.space", {
                        body: "Your next pixel is available!"
                    })
                } catch (b) {
                    console.log("No notificatons available!")
                }
                this.hasFiredNotification = !0
            }
            document.title = "pxls.space";
            this.elements.timer.hide();
            $(".palette-color")
                .css("cursor", "")
        }
        this.status && this.elements.timer.text(this.status)
    },
    saveImage: function() {
        this.elements.board[0].toBlob(function(a) {
            var c = window.URL.createObjectURL(a),
                b = document.createElement("a");
            b.href = c;
            b.download = "canvas.png";
            b.click();
            window.URL.revokeObjectURL(a)
        })
    },
    banMe: function() {
        /*this.socket.send(JSON.stringify({
            type: "banme"
        }))*/
    }
};

function recaptchaCallback(a) {
    App.socket.send(JSON.stringify({
        type: "captcha",
        token: a
    }))
}
App.init();