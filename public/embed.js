/*
 * Unlock My Data embed loader. Partners paste one tag:
 *
 *   <script src="https://unlock-my-data.com/embed.js" async
 *           data-groups="Sécurité:app-elles,umay|Quotidien:nipto"
 *           data-card="detailed" data-lang="fr"></script>
 *
 * Optional: data-view="map", data-height (px, fixed height for the map).
 * The script inserts the iframe and a text link right after itself, so several
 * widgets can live on one page. Plain ES5 on purpose: it runs on partners' sites
 * with no build step and must not break older browsers.
 */
(function () {
    var script = document.currentScript;
    if (!script) return;
    var origin = new URL(script.src).origin;
    var d = script.dataset;
    var lang = d.lang === "en" ? "en" : "fr";
    var isMap = d.view === "map";
    // Hostname only: the page path or query string could reveal what the visitor is reading.
    var host = location.hostname;

    var params = (d.groups || "").split("|").filter(Boolean).map(function (g) {
        return "s=" + encodeURIComponent(g.trim());
    });
    params.push(isMap ? "view=map" : "card=" + encodeURIComponent(d.card || "standard"));
    params.push("lang=" + lang, "host=" + encodeURIComponent(host));

    var iframe = document.createElement("iframe");
    iframe.src = origin + "/embed/?" + params.join("&");
    iframe.title = lang === "fr" ? "Analyses d'applications par Unlock My Data" : "App analyses by Unlock My Data";
    iframe.loading = "lazy";
    iframe.style.cssText = "display:block;width:100%;border:0;height:" + (parseInt(d.height, 10) || (isMap ? 800 : 600)) + "px";

    var link = document.createElement("a");
    link.href = origin + (lang === "fr" ? "/" : "/en/") + "?utm_source=widget&utm_medium=embed&utm_campaign=" + encodeURIComponent(host);
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = lang === "fr"
        ? "Analyses Unlock My Data : découvrez ce que vos applis font de vos données"
        : "Unlock My Data analyses: find out what your apps do with your data";
    link.style.cssText = "display:block;margin-top:6px;font:13px/1.4 system-ui,sans-serif";

    script.parentNode.insertBefore(link, script.nextSibling);
    script.parentNode.insertBefore(iframe, link);

    // The map sizes itself on the frame, so only the card view reports its height.
    if (isMap) return;
    window.addEventListener("message", function (e) {
        if (e.origin !== origin || e.source !== iframe.contentWindow) return;
        if (e.data && e.data.type === "umd-embed-height" && e.data.height > 0) {
            iframe.style.height = Math.ceil(e.data.height) + "px";
        }
    });
})();
