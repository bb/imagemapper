function queryElements(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
}
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        var overlays = queryElements(".imagemaphighlightoverlay");
        if (overlays.length) {
            queryElements(".imagemaphighlightoverlay").map(function(el) {el.parentNode.removeChild(el);});
            console.log("IMAGEMAPPER highlighting removed");
        }
        else {
          var imagemaps = queryElements("img[usemap]:not(.transparent)").map(function (e) { return new ImageMap(e); });
          console.log("IMAGEMAPPER Found " + imagemaps.length + " imagemaps and highlighted them. Tap the bookmarklet again to remove highlights.");
          console.log("IMAGEMAPPER Please note: When resizing the page, you may need to reload imagemaps-debugger. Same for images maps which were hidden during initialization etc. ");
        }
    }
);

/* find imagemaps */
var imagemaps = queryElements('img[usemap]:not(.transparent)');
chrome.extension.sendRequest({ count: imagemaps.length });

var ImageMap = (function () {
    function ImageMap(imagemap) {
        var _this = this;
        this.image = imagemap;
        this.mapName = this.image.getAttribute("usemap").substring(1);
        this.areas = queryElements("map[name=" + this.mapName + "] > area");
        this.image.insertAdjacentHTML("afterend", "<div class=\"imagemaphighlightoverlay " + this.image.getAttribute("class") + "\" style=\"position: absolute;background-color:transparent;\"></div>");
        var e = this.image.nextElementSibling;
        var imgComputedStyle = getComputedStyle(this.image);
        e.style.top = imgComputedStyle.top;
        if("auto" === e.style.top) e.style.top = this.image.offsetTop + "px";
        e.style.left = imgComputedStyle.left;
        if("auto" === e.style.left) e.style.left = this.image.offsetLeft + "px";
        e.style.right = imgComputedStyle.right;
        e.style.bottom = imgComputedStyle.bottom;
        e.style.margin = imgComputedStyle.margin;
        e.style.zIndex = 2147483647;
        this.paint(new MiniSvg(e, this.image.offsetWidth, this.image.offsetHeight));
    }
    trimparseFloat = function (x) { return parseFloat(x.trim());};
    ImageMap.prototype.paint = function (p) {
        var w = p.width, h = p.height;
        p.rect(0, 0, w, h).attr({ fill: "#ffff00", "fill-opacity": 0.1, stroke: "none" });
        var circleStyle = { fill: "#ffff00", "fill-opacity": 0.8, stroke: "none" };
        p.circle(0, 0, 20).attr(circleStyle);
        p.circle(w, 0, 20).attr(circleStyle);
        p.circle(0, h, 20).attr(circleStyle);
        p.circle(w, h, 20).attr(circleStyle);
        for (var _i = 0, _a = [].slice.call(this.areas); _i < _a.length; _i++) {
            var area = _a[_i];
            switch (area.getAttribute("shape")) {
                case "rect":
                    var _b = area.getAttribute("coords").split(",").map(trimparseFloat), x1 = _b[0], y1 = _b[1], x2 = _b[2], y2 = _b[3];
                    var editorial_issue = [];
                    if (x2 == x1) {
                      x2 += 10;
                      editorial_issue.push("x1 = x2 = " + x1);
                    }
                    if (y2 == y1) {
                      y2 += 10;
                      editorial_issue.push("y1 = y2 = " + y1);
                    }
                    if (x2 < x1) {
                      var tmpx = x2;
                      x2 = x1;
                      x1 = tmpx;
                      editorial_issue.push("x2 < x1: " + x1 + "<" + x2);
                    }
                    if (y2 < y1) {
                      var tmpy = y2;
                      y2 = y1;
                      y1 = tmpy;
                      editorial_issue.push("y2 < y1: " + y1 + "<" + y2);
                    }
                    var elem = p.rect(x1, y1, x2 - x1, y2 - y1).attr({ fill: "#ff0000", "fill-opacity": 0.5, stroke: "none", style: editorial_issue.length === 0 ? "" : "stroke-width:3;stroke:rgb(255,0,0)"});
                    var title = "";
                    var href = area.getAttribute('href');
                    if (href && href.length > 0) {
                      title += ("href="+href);
                    }
                    var alt = area.getAttribute('alt');
                    if (alt && alt.length > 0) {
                      title += ("alt="+alt);
                    }
                    if (editorial_issue.length > 0) {
                      editorial_issue.unshift("IMAGEMAPPER found an issue in your rect, making the rect invisible: ");
                      console.log.apply(console, editorial_issue);
                      title = editorial_issue.join(" ") + " " + title;
                    }
                    elem.innerHTML = '<title>' + title + '</title>';
                    title = null;
                    elem = null;
                    break;
                case "circle":
                    var _c = area.getAttribute("coords").split(",").map(trimparseFloat), x = _c[0], y = _c[1], r = _c[2];
                    p.circle(x, y, r).attr({ fill: "#00ff00", "fill-opacity": 0.5, stroke: "none" });
                    break;
                case "poly":
                    var _d = area.getAttribute("coords").split(",").map(trimparseFloat), px1 = _d[0], py1 = _d[1], coords = _d.slice(2);
                    var poly = "M" + px1 + "," + py1;
                    for (var i = 0; i <= coords.length - 2; i++) {
                        poly += "L" + coords[i] + "," + coords[i + 1];
                        i++;
                    }
                    poly += "Z";
                    p.path(poly).attr({ fill: "#0000ff", "fill-opacity": 0.4, stroke: "none" });
                    break;
            }
        }
        console.log("IMAGEMAPPER finished drawing " + this.areas.length + " areas on image map " + this.mapName );
    };
    return ImageMap;
})();
var MiniSvg = (function () {
    function MiniSvg(container, width, height) {
        this.width = width;
        this.height = height;
        this.element = this.createSvgElement("svg", { height: height, width: width, version: "1.1", style: "overflow: hidden; position: relative;" });
        container.appendChild(this.element);
    }
    MiniSvg.prototype.rect = function (x, y, w, h, r) {
        if (r === void 0) { r = 0; }
        return this.element.appendChild(this.createSvgElement("rect", { x: x, y: y, width: w, height: h, rx: r, ry: r }));
    };
    MiniSvg.prototype.circle = function (x, y, r) {
        return this.element.appendChild(this.createSvgElement("circle", { cx: x, cy: y, r: r }));
    };
    MiniSvg.prototype.path = function (d) {
        if (d === void 0) { d = ""; }
        return this.element.appendChild(this.createSvgElement("path", { d: d }));
    };
    MiniSvg.prototype.createSvgElement = function (name, attributes) {
        if (name === void 0) { name = "svg"; }
        if (attributes === void 0) { attributes = {}; }
        var e = document.createElementNS("http://www.w3.org/2000/svg", name);
        e.attr = function (attributes) {
            for (var a in attributes) {
                this.setAttribute(a, attributes[a]);
            }
            return e;
        };
        e.attr(attributes);
        return e;
    };
    return MiniSvg;
})();
