/*! jssocials - v1.2.1 - 2016-04-10
 * http://js-socials.com
 * Copyright (c) 2016 Artem Tabalin; Licensed MIT */
! function(a, b, c) {
    function d(a, c) {
        var d = b(a);
        d.data(f, this), this._$element = d, this.shares = [], this._init(c), this._render()
    }
    var e = "JSSocials",
        f = e,
        g = function(a, c) {
            return b.isFunction(a) ? a.apply(c, b.makeArray(arguments).slice(2)) : a
        },
        h = /(\.(jpeg|png|gif|bmp)$|^data:image\/(jpeg|png|gif|bmp);base64)/i,
        i = /(&?[a-zA-Z0-9]+=)?\{([a-zA-Z0-9]+)\}/g,
        j = { G: 1e9, M: 1e6, K: 1e3 },
        k = {};
    d.prototype = {
        url: "",
        text: "",
        shareIn: "blank",
        showLabel: function(a) {
            return this.showCount === !1 ? a > this.smallScreenWidth : a >= this.largeScreenWidth
        },
        showCount: function(a) {
            return a <= this.smallScreenWidth ? "inside" : !0
        },
        smallScreenWidth: 640,
        largeScreenWidth: 1024,
        resizeTimeout: 200,
        elementClass: "jssocials",
        sharesClass: "jssocials-shares",
        shareClass: "jssocials-share",
        shareButtonClass: "jssocials-share-button",
        shareLinkClass: "jssocials-share-link",
        shareLogoClass: "jssocials-share-logo",
        shareLabelClass: "jssocials-share-label",
        shareLinkCountClass: "jssocials-share-link-count",
        shareCountBoxClass: "jssocials-share-count-box",
        shareCountClass: "jssocials-share-count",
        shareZeroCountClass: "jssocials-share-no-count",
        _init: function(a) { this._initDefaults(), b.extend(this, a), this._initShares(), this._attachWindowResizeCallback() },
        _initDefaults: function() { this.url = a.location.href, this.text = b.trim(b("meta[name=description]").attr("content") || b("title").text()) },
        _initShares: function() {
            this.shares = b.map(this.shares, b.proxy(function(a) {
                "string" == typeof a && (a = { share: a });
                var c = a.share && k[a.share];
                if (!c && !a.renderer) throw Error("Share '" + a.share + "' is not found");
                return b.extend({ url: this.url, text: this.text }, c, a)
            }, this))
        },
        _attachWindowResizeCallback: function() { b(a).on("resize", b.proxy(this._windowResizeHandler, this)) },
        _detachWindowResizeCallback: function() { b(a).off("resize", this._windowResizeHandler) },
        _windowResizeHandler: function() {
            (b.isFunction(this.showLabel) || b.isFunction(this.showCount)) && (a.clearTimeout(this._resizeTimer), this._resizeTimer = setTimeout(b.proxy(this.refresh, this), this.resizeTimeout))
        },
        _render: function() { this._clear(), this._defineOptionsByScreen(), this._$element.addClass(this.elementClass), this._$shares = b("<div>").addClass(this.sharesClass).appendTo(this._$element), this._renderShares() },
        _defineOptionsByScreen: function() { this._screenWidth = b(a).width(), this._showLabel = g(this.showLabel, this, this._screenWidth), this._showCount = g(this.showCount, this, this._screenWidth) },
        _renderShares: function() { b.each(this.shares, b.proxy(function(a, b) { this._renderShare(b) }, this)) },
        _renderShare: function(a) {
            var c;
            c = b.isFunction(a.renderer) ? b(a.renderer()) : this._createShare(a), c.addClass(this.shareClass).addClass(a.share ? "jssocials-share-" + a.share : "").addClass(a.css).appendTo(this._$shares)
        },
        _createShare: function(a) {
            var c = b("<div>"),
                d = this._createShareLink(a).appendTo(c);
            if (this._showCount) {
                var e = "inside" === this._showCount,
                    f = e ? d : b("<div>").addClass(this.shareCountBoxClass).appendTo(c);
                f.addClass(e ? this.shareLinkCountClass : this.shareCountBoxClass), this._renderShareCount(a, f)
            }
            return c
        },
        _createShareLink: function(a) {
            var c = this._getShareStrategy(a),
                d = c.call(a, { shareUrl: this._getShareUrl(a) });
            return d.addClass(this.shareLinkClass).append(this._createShareLogo(a)), this._showLabel && d.append(this._createShareLabel(a)), b.each(this.on || {}, function(c, e) { b.isFunction(e) && d.on(c, b.proxy(e, a)) }), d
        },
        _getShareStrategy: function(a) {
            var b = m[a.shareIn || this.shareIn];
            if (!b) throw Error("Share strategy '" + this.shareIn + "' not found");
            return b
        },
        _getShareUrl: function(a) {
            var b = g(a.shareUrl, a);
            return this._formatShareUrl(b, a)
        },
        _createShareLogo: function(a) {
            var c = a.logo,
                d = h.test(c) ? b("<img>").attr("src", a.logo) : b("<i>").addClass(c);
            return d.addClass(this.shareLogoClass), d
        },
        _createShareLabel: function(a) {
            return b("<span>").addClass(this.shareLabelClass).text(a.label)
        },
        _renderShareCount: function(a, c) {
            var d = b("<span>").addClass(this.shareCountClass);
            c.addClass(this.shareZeroCountClass).append(d), this._loadCount(a).done(b.proxy(function(a) { a && (c.removeClass(this.shareZeroCountClass), d.text(a)) }, this))
        },
        _loadCount: function(a) {
            var c = b.Deferred(),
                d = this._getCountUrl(a);
            if (!d) return c.resolve(0).promise();
            var e = b.proxy(function(b) { c.resolve(this._getCountValue(b, a)) }, this);
            return b.getJSON(d).done(e).fail(function() { b.get(d).done(e).fail(function() { c.resolve(0) }) }), c.promise()
        },
        _getCountUrl: function(a) {
            var b = g(a.countUrl, a);
            return this._formatShareUrl(b, a)
        },
        _getCountValue: function(a, c) {
            var d = (b.isFunction(c.getCount) ? c.getCount(a) : a) || 0;
            return "string" == typeof d ? d : this._formatNumber(d)
        },
        _formatNumber: function(a) {
            return b.each(j, function(b, c) {
                return a >= c ? (a = parseFloat((a / c).toFixed(2)) + b, !1) : void 0
            }), a
        },
        _formatShareUrl: function(b, c) {
            return b.replace(i, function(b, d, e) {
                var f = c[e] || "";
                return f ? (d || "") + a.encodeURIComponent(f) : ""
            })
        },
        _clear: function() { a.clearTimeout(this._resizeTimer), this._$element.empty() },
        _passOptionToShares: function(a, c) {
            var d = this.shares;
            b.each(["url", "text"], function(e, f) { f === a && b.each(d, function(b, d) { d[a] = c }) })
        },
        _normalizeShare: function(a) {
            return b.isNumeric(a) ? this.shares[a] : "string" == typeof a ? b.grep(this.shares, function(b) {
                return b.share === a
            })[0] : a
        },
        refresh: function() { this._render() },
        destroy: function() { this._clear(), this._detachWindowResizeCallback(), this._$element.removeClass(this.elementClass).removeData(f) },
        option: function(a, b) {
            return 1 === arguments.length ? this[a] : (this[a] = b, this._passOptionToShares(a, b), void this.refresh())
        },
        shareOption: function(a, b, c) {
            return a = this._normalizeShare(a), 2 === arguments.length ? a[b] : (a[b] = c, void this.refresh())
        }
    }, b.fn.jsSocials = function(a) {
        var e = b.makeArray(arguments),
            g = e.slice(1),
            h = this;
        return this.each(function() {
            var e, i = b(this),
                j = i.data(f);
            if (j)
                if ("string" == typeof a) {
                    if (e = j[a].apply(j, g), e !== c && e !== j) return h = e, !1
                } else j._detachWindowResizeCallback(), j._init(a), j._render();
            else new d(i, a)
        }), h
    };
    var l = function(a) {
            var c;
            b.isPlainObject(a) ? c = d.prototype : (c = k[a], a = arguments[1] || {}), b.extend(c, a)
        },
        m = {
            popup: function(c) {
                return b("<a>").attr("href", "#").on("click", function() {
                    return a.open(c.shareUrl, null, "width=600, height=400, location=0, menubar=0, resizeable=0, scrollbars=0, status=0, titlebar=0, toolbar=0"), !1
                })
            },
            blank: function(a) {
                return b("<a>").attr({ target: "_blank", href: a.shareUrl })
            },
            self: function(a) {
                return b("<a>").attr({ target: "_self", href: a.shareUrl })
            }
        };
    a.jsSocials = { Socials: d, shares: k, shareStrategies: m, setDefaults: l }
}(window, jQuery),
function(a, b, c) {
    b.extend(c.shares, {
        email: { label: "Contact Red Hat",/* logo: "fa fa-at",*/ to: "open-innovation-labs-sales@redhat.com", text: "I'm ready to begin application development with Red Hat Open Innovation Labs", copy:"I've just completed my own community-powered technology stack, and would like to learn more about jump-starting application development with Red Hat Open Innovation Labs.  ", shareUrl: "mailto:{to}?subject={text}&body={copy}{url}", countUrl: "", shareIn: "self" },
        twitter: { label: "Share On", logo: "fa fa-twitter", text: "Check out my customized stack for application development with Red Hat Open Innovation Labs.", hashtags: "OpenShift", shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}", countUrl: "" },
        print: {
            label: "Print / PDF",
            logo: "",
            shareUrl: ""
        },
        facebook: {
            label: "Share On",
            logo: "fa fa-facebook",
            shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
            countUrl: function() {
                return "https://graph.facebook.com/fql?q=SELECT total_count FROM link_stat WHERE url='" + a.encodeURIComponent(this.url) + "'"
            },
            getCount: function(a) {
                return a.data.length && a.data[0].total_count || 0
            }
        },
        googleplus: {
            label: "+1",
            logo: "fa fa-google",
            shareUrl: "https://plus.google.com/share?url={url}",
            countUrl: function() {
                return "https://cors-anywhere.herokuapp.com/https://plusone.google.com/_/+1/fastbutton?url=" + a.encodeURIComponent(this.url)
            },
            getCount: function(a) {
                return parseFloat((a.match(/\{c: ([.0-9E]+)/) || [])[1])
            }
        },
        linkedin: {
            label: "Share",
            logo: "fa fa-linkedin",
            shareUrl: "https://www.linkedin.com/shareArticle?mini=true&url={url}",
            countUrl: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
            getCount: function(a) {
                return a.count
            }
        },
        pinterest: {
            label: "Pin it",
            logo: "fa fa-pinterest",
            shareUrl: "https://pinterest.com/pin/create/bookmarklet/?media={media}&url={url}&description={text}",
            countUrl: "https://api.pinterest.com/v1/urls/count.json?&url={url}&callback=?",
            getCount: function(a) {
                return a.count
            }
        },
        stumbleupon: {
            label: "Share",
            logo: "fa fa-stumbleupon",
            shareUrl: "http://www.stumbleupon.com/submit?url={url}&title={title}",
            countUrl: "https://cors-anywhere.herokuapp.com/https://www.stumbleupon.com/services/1.01/badge.getinfo?url={url}",
            getCount: function(a) {
                return a.result.views
            }
        },
        whatsapp: { label: "WhatsApp", logo: "fa fa-whatsapp", shareUrl: "whatsapp://send?text={url} {text}", countUrl: "", shareIn: "self" },
        line: { label: "LINE", logo: "fa fa-comment", shareUrl: "http://line.me/R/msg/text/?{text} {url}", countUrl: "" }
    })
}(window, jQuery, window.jsSocials);
