(function() {
  'use strict';

  /* ── MOBILE MENU ── */
  window.openMenu  = function() { var m=document.getElementById('mm'); if(m) m.classList.add('open'); };
  window.closeMenu = function() { var m=document.getElementById('mm'); if(m) m.classList.remove('open'); };

  /* ── SCROLL REVEAL ── */
  var ro = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { ro.observe(el); });
  setTimeout(function() {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('vis'); });
  }, 1500);
  document.body.classList.add('js-loaded');

  /* ── CONTACT FORM ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn     = document.getElementById('cfSubmit');
      var btnText = document.getElementById('cfBtnText');
      var btnIcon = document.getElementById('cfBtnIcon');
      var success = document.getElementById('cfSuccess');
      var error   = document.getElementById('cfError');
      btn.disabled = true;
      btnText.textContent = 'Sending\u2026';
      btnIcon.textContent = '\u23f3';
      error.style.display = 'none';
      var data = new FormData(form);
      fetch('/', { method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      }).then(function(res) {
        if (res.ok) { form.style.display='none'; success.style.display='block'; }
        else { throw new Error(res.status); }
      }).catch(function() {
        btn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.textContent = '\u2192';
        var errMsg = document.getElementById('cfErrorMsg');
        if (errMsg) errMsg.textContent = 'Something went wrong. Please email hello@jskt.in directly.';
        error.style.display = 'block';
      });
    });
  }

  /* ── MARKET BAR ANIMATIONS ── */
  var bo = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.bf').forEach(function(b) { b.style.width = b.dataset.w; });
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('#market').forEach(function(el) { bo.observe(el); });

  /* ═══════════════════════════════════════════
     JSK ADMIN PANEL
  ═══════════════════════════════════════════ */
  var AP_KEY   = 'jsk_admin_pwd';
  var DATA_KEY = 'jsk_data';
  var apLoggedIn = false;

  var DEFAULT_DATA = {
    jobs: [
      { id: 1, title: 'Chief Technology Officer', dept: 'Engineering',
        loc: 'Gujarat / Bangalore', type: 'Co-founder',
        desc: 'Wafer slicing and surface preparation specialist with experience in wire saw operations and cleanroom metrology. Lead the technology roadmap from pilot to full-scale production.',
        apply: 'mailto:careers@jskt.in' }
    ],
    testimonials: [],
    contact: { email: 'hello@jskt.in', facility: 'Gujarat, India', hq: 'Bangalore, India',
                linkedin: 'https://www.linkedin.com/company/jskt/', phone: '' },
    settings: { banner: '' }
  };

  function getAdminPwd() { return localStorage.getItem(AP_KEY) || btoa('JSK@2025'); }
  function getData() {
    try { return JSON.parse(localStorage.getItem(DATA_KEY)) || DEFAULT_DATA; }
    catch(e) { return DEFAULT_DATA; }
  }
  function saveAllData(d) { localStorage.setItem(DATA_KEY, JSON.stringify(d)); renderPage(); }

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── RENDER PAGE FROM DATA ── */
  function renderPage() {
    var d = getData();
    renderJobs(d.jobs);
    renderTestimonials(d.testimonials);
    renderContactInfo(d.contact);
    renderBanner(d.settings);
  }

  function renderJobs(jobs) {
    var c = document.getElementById('jobs-container');
    if (!c) return;
    if (!jobs || !jobs.length) {
      c.innerHTML = '<div class="jobs-empty" style="grid-column:1/-1">No open positions right now. Check back soon.</div>';
      return;
    }
    c.innerHTML = jobs.map(function(j) {
      return '<div class="job-card">' +
        '<div class="job-meta">' +
          (j.dept ? '<span class="job-tag dept">'+esc(j.dept)+'</span>' : '') +
          (j.loc  ? '<span class="job-tag loc">'+esc(j.loc)+'</span>'   : '') +
          (j.type ? '<span class="job-tag type">'+esc(j.type)+'</span>' : '') +
        '</div>' +
        '<h4>'+esc(j.title)+'</h4>' +
        '<p>'+esc(j.desc)+'</p>' +
        '<a class="job-apply" href="'+esc(j.apply)+'" target="_blank" rel="noopener">Apply Now \u2192</a>' +
      '</div>';
    }).join('');
  }

  function renderTestimonials(ts) {
    var c = document.getElementById('testi-container');
    if (!c) return;
    if (!ts || !ts.length) {
      c.innerHTML = '<div class="testi-empty" style="grid-column:1/-1">Customer and partner testimonials will appear here.</div>';
      return;
    }
    c.innerHTML = ts.map(function(t) {
      var initials = (t.name||'A').split(' ').map(function(w){return w[0];}).slice(0,2).join('');
      return '<div class="testi-card">' +
        '<p class="testi-quote">'+esc(t.quote)+'</p>' +
        '<div class="testi-author">' +
          '<div class="testi-avatar">'+esc(initials)+'</div>' +
          '<div><div class="testi-name">'+esc(t.name)+'</div>' +
          '<div class="testi-role">'+esc(t.role)+(t.org?' \u00b7 '+esc(t.org):'')+'</div></div>' +
        '</div></div>';
    }).join('');
  }

  function renderContactInfo(c) {
    if (!c) return;
    ['ci-email','ci-facility','ci-hq'].forEach(function(id) {
      var el = document.getElementById(id);
      var map = {'ci-email':c.email,'ci-facility':c.facility,'ci-hq':c.hq};
      if (el && map[id]) el.textContent = map[id];
    });
    document.querySelectorAll('a[href^="mailto:hello@jskt"]').forEach(function(a){
      if (c.email) a.href = 'mailto:'+c.email;
    });
    if (c.linkedin) {
      document.querySelectorAll('a[href*="linkedin.com/company"]').forEach(function(a){ a.href=c.linkedin; });
    }
  }

  function renderBanner(s) {
    var existing = document.getElementById('jsk-banner');
    if (s && s.banner) {
      if (!existing) {
        var b = document.createElement('div');
        b.id = 'jsk-banner';
        b.style.cssText = 'background:var(--saffron);color:#050508;text-align:center;padding:.5rem 1rem;font-family:"DM Mono",monospace;font-size:.7rem;font-weight:600;letter-spacing:.08em;z-index:201;position:relative;';
        document.body.insertBefore(b, document.body.firstChild);
      }
      document.getElementById('jsk-banner').textContent = s.banner;
    } else if (existing) { existing.remove(); }
  }

  /* ── ADMIN OPEN / CLOSE ── */
  var adminBtn = document.getElementById('admin-btn');
  if (adminBtn) adminBtn.onclick = function() {
    document.getElementById('admin-panel').classList.add('open');
    document.getElementById('admin-overlay').classList.add('open');
    if (apLoggedIn) { showAdminMain(); } else {
      document.getElementById('ap-login-screen').style.display = 'flex';
      document.getElementById('ap-main').style.display = 'none';
    }
  };
  window.closeAdmin = function() {
    document.getElementById('admin-panel').classList.remove('open');
    document.getElementById('admin-overlay').classList.remove('open');
  };
  window.apLogin = function() {
    var pwd = document.getElementById('ap-pwd-input').value;
    if (btoa(pwd) === getAdminPwd()) {
      apLoggedIn = true;
      document.getElementById('ap-login-screen').style.display = 'none';
      showAdminMain();
    } else {
      document.getElementById('ap-login-err').textContent = 'Incorrect password. Try again.';
    }
  };
  function showAdminMain() {
    var m = document.getElementById('ap-main');
    m.style.display = 'flex';
    loadContactForm(); loadSettingsForm(); renderAdminJobs(); renderAdminTestis();
  }
  window.apTab = function(btn, tab) {
    document.querySelectorAll('.ap-tab').forEach(function(t){ t.classList.remove('active'); });
    document.querySelectorAll('.ap-section').forEach(function(s){ s.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('ap-'+tab).classList.add('active');
  };
  function showSaved() {
    var m = document.getElementById('ap-saved-msg');
    m.style.display = 'block';
    setTimeout(function(){ m.style.display = 'none'; }, 2200);
  }

  /* ── JOBS ── */
  window.apShowJobForm = function(id) {
    var f = document.getElementById('ap-job-form');
    f.style.display = 'block';
    document.getElementById('jf-edit-id').value = id || '';
    if (id) {
      var job = getData().jobs.find(function(j){ return j.id==id; });
      if (job) {
        document.getElementById('jf-title').value = job.title||'';
        document.getElementById('jf-dept').value  = job.dept||'';
        document.getElementById('jf-loc').value   = job.loc||'';
        document.getElementById('jf-type').value  = job.type||'Full-time';
        document.getElementById('jf-desc').value  = job.desc||'';
        document.getElementById('jf-apply').value = job.apply||'';
      }
    } else {
      ['jf-title','jf-dept','jf-loc','jf-desc','jf-apply'].forEach(function(id){ document.getElementById(id).value=''; });
      document.getElementById('jf-type').value = 'Full-time';
    }
    f.scrollIntoView({ behavior:'smooth', block:'nearest' });
  };
  window.apHideJobForm = function() { document.getElementById('ap-job-form').style.display='none'; };
  window.apSaveJob = function() {
    var title = document.getElementById('jf-title').value.trim();
    if (!title) { alert('Job title is required.'); return; }
    var d = getData();
    var editId = document.getElementById('jf-edit-id').value;
    var job = { id: editId ? parseInt(editId) : Date.now(), title:title,
      dept: document.getElementById('jf-dept').value.trim(),
      loc:  document.getElementById('jf-loc').value.trim(),
      type: document.getElementById('jf-type').value,
      desc: document.getElementById('jf-desc').value.trim(),
      apply: document.getElementById('jf-apply').value.trim() || 'mailto:careers@jskt.in'
    };
    if (editId) { d.jobs = d.jobs.map(function(j){ return j.id==editId ? job : j; }); }
    else { d.jobs.push(job); }
    saveAllData(d); apHideJobForm(); renderAdminJobs(); showSaved();
  };
  window.apDeleteJob = function(id) {
    if (!confirm('Delete this job posting?')) return;
    var d = getData();
    d.jobs = d.jobs.filter(function(j){ return j.id!=id; });
    saveAllData(d); renderAdminJobs(); showSaved();
  };
  function renderAdminJobs() {
    var jobs = getData().jobs;
    var html = !jobs||!jobs.length ? '<div class="ap-empty">No jobs yet. Click "+ Add New Job Opening" above.</div>' :
      jobs.map(function(j){
        return '<div class="ap-card"><h5>'+esc(j.title)+'</h5><p>'+
          [j.dept,j.loc,j.type].filter(Boolean).join(' \u00b7 ')+'</p>'+
          '<div class="ap-card-actions">'+
          '<button class="ap-btn edit" onclick="apShowJobForm('+j.id+')">\u270f Edit</button>'+
          '<button class="ap-btn del" onclick="apDeleteJob('+j.id+')">\uD83D\uDDD1 Delete</button>'+
          '</div></div>';
      }).join('');
    document.getElementById('ap-jobs-list').innerHTML = html;
  }

  /* ── TESTIMONIALS ── */
  window.apShowTestiForm = function(id) {
    var f = document.getElementById('ap-testi-form');
    f.style.display = 'block';
    document.getElementById('tf-edit-id').value = id || '';
    if (id) {
      var t = getData().testimonials.find(function(t){ return t.id==id; });
      if (t) {
        document.getElementById('tf-quote').value = t.quote||'';
        document.getElementById('tf-name').value  = t.name||'';
        document.getElementById('tf-role').value  = t.role||'';
        document.getElementById('tf-org').value   = t.org||'';
      }
    } else {
      ['tf-quote','tf-name','tf-role','tf-org'].forEach(function(id){ document.getElementById(id).value=''; });
    }
    f.scrollIntoView({ behavior:'smooth', block:'nearest' });
  };
  window.apHideTestiForm = function() { document.getElementById('ap-testi-form').style.display='none'; };
  window.apSaveTesti = function() {
    var quote = document.getElementById('tf-quote').value.trim();
    var name  = document.getElementById('tf-name').value.trim();
    if (!quote||!name) { alert('Quote and Name are required.'); return; }
    var d = getData();
    var editId = document.getElementById('tf-edit-id').value;
    var t = { id: editId ? parseInt(editId) : Date.now(), quote:quote, name:name,
      role: document.getElementById('tf-role').value.trim(),
      org:  document.getElementById('tf-org').value.trim() };
    if (editId) { d.testimonials = d.testimonials.map(function(x){ return x.id==editId ? t : x; }); }
    else { d.testimonials.push(t); }
    saveAllData(d); apHideTestiForm(); renderAdminTestis(); showSaved();
  };
  window.apDeleteTesti = function(id) {
    if (!confirm('Delete this testimonial?')) return;
    var d = getData();
    d.testimonials = d.testimonials.filter(function(t){ return t.id!=id; });
    saveAllData(d); renderAdminTestis(); showSaved();
  };
  function renderAdminTestis() {
    var ts = getData().testimonials;
    var html = !ts||!ts.length ? '<div class="ap-empty">No testimonials yet.</div>' :
      ts.map(function(t){
        return '<div class="ap-card"><h5>'+esc(t.name)+(t.org?' \u00b7 '+esc(t.org):'')+'</h5>'+
          '<p>&#8220;'+esc(t.quote.substring(0,80))+(t.quote.length>80?'\u2026':'')+'&#8221;</p>'+
          '<div class="ap-card-actions">'+
          '<button class="ap-btn edit" onclick="apShowTestiForm('+t.id+')">\u270f Edit</button>'+
          '<button class="ap-btn del" onclick="apDeleteTesti('+t.id+')">\uD83D\uDDD1 Delete</button>'+
          '</div></div>';
      }).join('');
    document.getElementById('ap-testi-list').innerHTML = html;
  }

  /* ── CONTACT ── */
  function loadContactForm() {
    var c = getData().contact;
    document.getElementById('cf-email-val').value = c.email||'';
    document.getElementById('cf-facility').value  = c.facility||'';
    document.getElementById('cf-hq').value        = c.hq||'';
    document.getElementById('cf-linkedin').value  = c.linkedin||'';
    document.getElementById('cf-phone').value     = c.phone||'';
  }
  window.apSaveContact = function() {
    var d = getData();
    d.contact = {
      email:    document.getElementById('cf-email-val').value.trim(),
      facility: document.getElementById('cf-facility').value.trim(),
      hq:       document.getElementById('cf-hq').value.trim(),
      linkedin: document.getElementById('cf-linkedin').value.trim(),
      phone:    document.getElementById('cf-phone').value.trim()
    };
    saveAllData(d); showSaved();
  };

  /* ── SETTINGS ── */
  function loadSettingsForm() {
    var s = getData().settings;
    document.getElementById('st-banner').value = s.banner||'';
  }
  window.apSaveSettings = function() {
    var d = getData();
    d.settings = { banner: document.getElementById('st-banner').value.trim() };
    saveAllData(d); showSaved();
  };
  window.apChangePwd = function() {
    var p1 = document.getElementById('st-pwd1').value;
    var p2 = document.getElementById('st-pwd2').value;
    if (!p1) { alert('Please enter a new password.'); return; }
    if (p1 !== p2) { alert('Passwords do not match.'); return; }
    localStorage.setItem(AP_KEY, btoa(p1));
    document.getElementById('st-pwd1').value = '';
    document.getElementById('st-pwd2').value = '';
    showSaved();
  };
  window.apResetAll = function() {
    if (!confirm('This will delete ALL jobs and testimonials. Are you sure?')) return;
    localStorage.removeItem(DATA_KEY);
    renderPage(); renderAdminJobs(); renderAdminTestis();
    loadContactForm(); loadSettingsForm(); showSaved();
  };

  /* ── BOOT ── */
  renderPage();

})();