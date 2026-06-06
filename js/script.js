/* ============================================================
   BNI GRANDIR | 特別招待状 — JavaScript
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    /* ==========================================
       1. 封筒クリックで開封 → 便箋出現
    ========================================== */
    const envelope  = $('#envelope');
    const envHint   = $('#envHint');
    const letter    = $('#letter');
    const sparkles  = $('#sparkles');
    const scrollCue = $('#scrollCue');
    let opened = false;

    function openEnvelope() {
        if (opened) return;
        opened = true;

        // シェイク → 開封
        envelope.style.animation = 'envShake .45s ease';
        setTimeout(() => {
            envelope.style.animation = '';
            envelope.classList.add('opened');
        }, 450);

        // 便箋スライドダウン表示
        setTimeout(() => {
            if (letter) letter.classList.add('active');
        }, 650);

        // キラキラ（envelope基準）
        setTimeout(() => {
            burstSparkles(sparkles, 32);
        }, 750);

        // ヒント非表示
        if (envHint) {
            envHint.style.opacity = '0';
            envHint.style.pointerEvents = 'none';
        }

        // 便箋が見えるようにスクロール（フタが開ききる頃にゆっくり）
        setTimeout(() => {
            if (letter) {
                letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 1800);

        // 開封後にスクロール誘導インジケーターを表示
        setTimeout(() => {
            if (scrollCue) scrollCue.classList.add('show');
        }, 2600);
    }

    // ページをある程度スクロールしたら誘導を消す
    window.addEventListener('scroll', () => {
        if (scrollCue && scrollCue.classList.contains('show') && window.scrollY > 400) {
            scrollCue.classList.remove('show');
        }
    }, { passive: true });

    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
        envelope.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
        });
    }

    // シェイクCSS
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes envShake {
            0%   { transform: rotate(0deg); }
            20%  { transform: rotate(-3deg); }
            40%  { transform: rotate(3deg); }
            60%  { transform: rotate(-2deg); }
            80%  { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
        }`;
    document.head.appendChild(shakeStyle);

    /* ==========================================
       2. キラキラバースト
    ========================================== */
    function burstSparkles(container, count = 28) {
        if (!container) return;
        const COLORS = ['#FFE878','#F0D080','#C9A84C','#ffffff','#FFD700','#fff8aa'];

        for (let i = 0; i < count; i++) {
            const size  = 4 + Math.random() * 10;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist  = 60 + Math.random() * 160;
            const sx    = Math.cos(angle) * dist;
            const sy    = Math.sin(angle) * dist;
            const sr    = (Math.random() - .5) * 720;
            const star  = Math.random() > .55;
            const dur   = .6 + Math.random() * .7;

            const el = document.createElement('div');
            const startX = 30 + Math.random() * (container.offsetWidth  - 60 || 260);
            const startY = 30 + Math.random() * (container.offsetHeight - 60 || 140);

            Object.assign(el.style, {
                position:    'absolute',
                width:       `${size}px`,
                height:      `${size}px`,
                background:  color,
                borderRadius: star ? '0' : '50%',
                clipPath:    star
                    ? 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'
                    : 'none',
                left:        `${startX}px`,
                top:         `${startY}px`,
                pointerEvents: 'none',
                boxShadow:   `0 0 ${size}px ${color}`,
                '--sx':      `${sx}px`,
                '--sy':      `${sy}px`,
                '--sr':      `${sr}deg`,
                animation:   `sparkleAnim ${dur}s ease-out forwards`,
                animationDelay: `${i * 0.025}s`
            });
            container.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
    }

    /* ==========================================
       2.5 カウントダウンタイマー（2026年7月3日 9:15 JST）
    ========================================== */
    const BOD_DATE = new Date('2026-07-03T09:15:00+09:00');

    const cdDays  = $('#cd-days');
    const cdHours = $('#cd-hours');
    const cdMins  = $('#cd-mins');
    const cdSecs  = $('#cd-secs');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const diff = BOD_DATE - new Date();
        if (diff <= 0) {
            [cdDays, cdHours, cdMins, cdSecs].forEach(el => { if (el) el.textContent = '00'; });
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000)  / 60000);
        const s = Math.floor((diff % 60000)    / 1000);
        if (cdDays)  cdDays.textContent  = pad(d);
        if (cdHours) cdHours.textContent = pad(h);
        if (cdMins)  cdMins.textContent  = pad(m);
        if (cdSecs)  cdSecs.textContent  = pad(s);
    }

    if (cdSecs) { tick(); setInterval(tick, 1000); }

    /* ==========================================
       3. スクロールフェードイン
    ========================================== */
    const fadeEls = $$('.about-point, .about-section__title, .about-section__body, .desc-section, .info-section, .copy-section, .bottom-cta__title, .bottom-cta__body, .bottom-cta__info');
    fadeEls.forEach(el => el.classList.add('fade-up'));

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                io.unobserve(e.target);
            }
        });
    }, { threshold: .12, rootMargin: '0px 0px -30px 0px' });

    fadeEls.forEach(el => io.observe(el));

    /* ==========================================
       4. スムーズスクロール
    ========================================== */
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    /* ==========================================
       5. 背景に舞うゴールドパーティクル
    ========================================== */
    const bgParticles = $('#bgParticles');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (bgParticles && !prefersReduced) {
        // 画面幅に応じて粒の数を調整（軽量化）
        const count = window.innerWidth < 600 ? 18 : 32;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'gp';

            const size  = 2 + Math.random() * 5;          // 2〜7px
            const left  = Math.random() * 100;            // 横位置 %
            const drift = (Math.random() - 0.5) * 120;    // 左右の揺らぎ px
            const dur   = 14 + Math.random() * 16;        // 14〜30秒
            const delay = -Math.random() * dur;           // バラけて開始
            const op    = 0.35 + Math.random() * 0.45;    // 透明度

            Object.assign(p.style, {
                width:  `${size}px`,
                height: `${size}px`,
                left:   `${left}%`,
                animationDuration: `${dur}s`,
                animationDelay:    `${delay}s`,
                '--gp-x':  `${drift}px`,
                '--gp-op': `${op}`
            });
            bgParticles.appendChild(p);
        }
    }

});
