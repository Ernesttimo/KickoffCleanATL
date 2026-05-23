/* Email action enhancer.
 *
 * Intercepts every <a href="mailto:..."> click and, instead of relying on the
 * visitor having a default email client configured, shows a small popover with:
 *   1. Open in Gmail       — works in any browser, even without a mail client
 *   2. Open in default app — fires the standard mailto: (useful on phones)
 *   3. Copy address        — drops the email into the clipboard with a toast
 *
 * No external dependencies. Vanilla JS only. Loaded on every page via:
 *   <script src="email-actions.js" defer></script>
 */
(function () {
  'use strict';

  function parseMailto(href) {
    var raw = href.replace(/^mailto:/i, '');
    var qIdx = raw.indexOf('?');
    var to = qIdx === -1 ? raw : raw.slice(0, qIdx);
    var query = qIdx === -1 ? '' : raw.slice(qIdx + 1);
    var params = {};
    if (query) {
      query.split('&').forEach(function (kv) {
        var eq = kv.indexOf('=');
        if (eq === -1) return;
        var k = decodeURIComponent(kv.slice(0, eq).toLowerCase());
        var v = decodeURIComponent(kv.slice(eq + 1).replace(/\+/g, ' '));
        params[k] = v;
      });
    }
    return { to: to, subject: params.subject || '', body: params.body || '' };
  }

  function gmailUrl(parsed) {
    var u = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(parsed.to);
    if (parsed.subject) u += '&su=' + encodeURIComponent(parsed.subject);
    if (parsed.body)    u += '&body=' + encodeURIComponent(parsed.body);
    return u;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var t = document.createElement('textarea');
        t.value = text;
        t.style.position = 'fixed';
        t.style.left = '-9999px';
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  // ----------------------- toast -----------------------
  function toast(message) {
    var el = document.createElement('div');
    el.className = 'ea-toast';
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('ea-toast--show'); });
    setTimeout(function () {
      el.classList.remove('ea-toast--show');
      setTimeout(function () { el.remove(); }, 250);
    }, 2400);
  }

  // ----------------------- popover -----------------------
  var openPopover = null;

  function closePopover() {
    if (!openPopover) return;
    openPopover.remove();
    openPopover = null;
    document.removeEventListener('click', onDocClick, true);
    document.removeEventListener('keydown', onDocKey, true);
  }
  function onDocClick(e) {
    if (openPopover && !openPopover.contains(e.target)) closePopover();
  }
  function onDocKey(e) { if (e.key === 'Escape') closePopover(); }

  function showPopover(anchor, parsed) {
    closePopover();

    var pop = document.createElement('div');
    pop.className = 'ea-pop';
    pop.setAttribute('role', 'menu');
    pop.innerHTML = '\
      <a class="ea-pop__item" role="menuitem" data-action="gmail" target="_blank" rel="noopener noreferrer" href="' + gmailUrl(parsed) + '">\
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M22 5.5v13a1.5 1.5 0 0 1-1.5 1.5H19V8.4l-7 5.2-7-5.2V20H3.5A1.5 1.5 0 0 1 2 18.5v-13C2 4.7 2.7 4 3.5 4h.5l8 6 8-6h.5c.8 0 1.5.7 1.5 1.5Z"/></svg>\
        <span>Open in Gmail</span>\
      </a>\
      <a class="ea-pop__item" role="menuitem" data-action="mail" href="mailto:' + parsed.to +
        (parsed.subject || parsed.body ?
          '?' + (parsed.subject ? 'subject=' + encodeURIComponent(parsed.subject) : '') +
          (parsed.subject && parsed.body ? '&' : '') +
          (parsed.body ? 'body=' + encodeURIComponent(parsed.body) : '') : '') + '">\
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2v.4l8 5.1 8-5.1V8H4Z"/></svg>\
        <span>Open in your default email</span>\
      </a>\
      <button class="ea-pop__item" role="menuitem" data-action="copy" type="button">\
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"/></svg>\
        <span>Copy ' + parsed.to + '</span>\
      </button>';

    document.body.appendChild(pop);

    // Position
    var r = anchor.getBoundingClientRect();
    var top = r.bottom + window.scrollY + 8;
    var left = r.left + window.scrollX;
    // Keep within viewport
    var maxLeft = window.scrollX + window.innerWidth - pop.offsetWidth - 12;
    if (left > maxLeft) left = maxLeft;
    if (left < window.scrollX + 12) left = window.scrollX + 12;
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';

    openPopover = pop;

    // Wire actions
    pop.addEventListener('click', function (e) {
      var item = e.target.closest('[data-action]');
      if (!item) return;
      var action = item.dataset.action;
      if (action === 'copy') {
        e.preventDefault();
        copyToClipboard(parsed.to).then(function () {
          toast('Copied ' + parsed.to);
        }).catch(function () {
          toast('Copy failed — please select and copy manually');
        });
        closePopover();
        return;
      }
      // Let Gmail / mailto navigate naturally (target=_blank for Gmail)
      setTimeout(closePopover, 50);
    });

    // Close on outside click / Esc
    setTimeout(function () {
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('keydown', onDocKey, true);
    }, 0);
  }

  // ----------------------- bind to all mailto links -----------------------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="mailto:"], a[href^="MAILTO:"]');
    if (!a) return;
    e.preventDefault();
    showPopover(a, parseMailto(a.getAttribute('href')));
  });
})();
