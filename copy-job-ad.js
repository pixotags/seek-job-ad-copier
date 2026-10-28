// Seek job ad → clipboard.
// Runs when you click the extension icon (or press Alt+Shift+J).
// Can also be pasted straight into the DevTools console on a Seek job page.
(() => {
  const clean = (s) => (s || '').replace(/ /g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const textOf = (sel) => clean(document.querySelector(sel)?.innerText);

  const title = textOf('[data-automation="job-detail-title"]');
  const company = textOf('[data-automation="advertiser-name"]');
  const workType = textOf('[data-automation="job-detail-work-type"]');
  const detailsEl = document.querySelector('[data-automation="jobAdDetails"]');
  const details = clean(detailsEl?.innerText);

  // "Employer questions": classes are generated, so find the <h2> by its text —
  // first in the sections next to the job description, then anywhere on the page.
  const isQuestionsH2 = (h) => /^\s*employer questions\s*$/i.test(h.textContent || '');
  const findQuestionsH2 = () => {
    const jobSection = detailsEl?.closest('section');
    for (const sib of jobSection?.parentElement?.children || []) {
      if (sib === jobSection) continue;
      const h = [...sib.querySelectorAll('h2')].find(isQuestionsH2);
      if (h) return h;
    }
    return [...document.querySelectorAll('h2')].find(isQuestionsH2) || null;
  };
  const qH2 = findQuestionsH2();
  const qContainer = qH2 ? qH2.closest('section') || qH2.parentElement : null;
  const questions = qContainer ? [...qContainer.querySelectorAll('li')].map((li) => clean(li.innerText)).filter(Boolean) : [];

  const lines = [
    `Job Title: ${title || '(not found)'}`,
    `Company: ${company || '(not found)'}`,
    `Work Type: ${workType || '(not found)'}`,
    `URL: ${location.href}`,
    '',
    'Job Description:',
    details || '(not found)',
  ];
  if (questions.length) lines.push('', 'Employer Questions:', ...questions.map((q, i) => `${i + 1}. ${q}`));
  const output = lines.join('\n');

  const toast = (msg, ok = true) => {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 2147483647, maxWidth: '360px',
      padding: '10px 14px', borderRadius: '8px', font: '14px system-ui, sans-serif',
      color: '#fff', background: ok ? '#1e7d32' : '#b3261e', boxShadow: '0 4px 12px rgba(0,0,0,.25)',
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  };

  // Fallback for when the async clipboard API is blocked.
  const execCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    ta.remove();
    return ok;
  };

  const ok = !!title;
  const summary = ok ? `Copied: ${title}${questions.length ? ` (+${questions.length} questions)` : ''}` : 'Copied, but no job title found — is this a Seek job page?';

  // In the DevTools console, the built-in copy() helper works even though the page isn't focused.
  if (typeof copy === 'function') {
    try { copy(output); toast(summary, ok); console.log(output); return output; } catch (_) {}
  }

  (async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast(summary, ok);
    } catch (_) {
      if (execCopy(output)) toast(summary, ok);
      else { toast('Copy failed — text logged to console', false); console.log(output); }
    }
  })();

  return output;
})();
