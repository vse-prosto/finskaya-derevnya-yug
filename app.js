(() => {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu = document.querySelector('[data-site-menu]');
    const year = document.querySelector('[data-year]');
    const form = document.querySelector('[data-lead-form]');
    const status = document.querySelector('[data-form-status]');

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    if (menu?.open) {
        menu.close();
    }

    const onScroll = () => {
        if (!header) {
            return;
        }
        header.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    toggle?.addEventListener('click', () => {
        if (!menu) {
            return;
        }
        if (menu.open) {
            menu.close();
            return;
        }
        menu.showModal();
    });

    menu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menu.close();
        });
    });

    document.querySelectorAll('[data-tabs]').forEach((tabs) => {
        const buttons = tabs.querySelectorAll('[role="tab"]');
        const panels = tabs.querySelectorAll('[data-panel]');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-tab');

                buttons.forEach((item) => {
                    item.setAttribute('aria-selected', item === button ? 'true' : 'false');
                });

                panels.forEach((panel) => {
                    const active = panel.getAttribute('data-panel') === id;
                    panel.hidden = !active;
                    panel.classList.toggle('is-active', active);
                });
            });
        });
    });

    document.querySelectorAll('[data-lazy-embed]').forEach((box) => {
        const button = box.querySelector('[data-lazy-load]');
        button?.addEventListener('click', () => {
            const src = box.getAttribute('data-src');
            if (!src) {
                return;
            }
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.title = button.textContent || 'Панорама';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            box.replaceChildren(iframe);
            box.classList.remove('embed-lazy');
        });
    });

    const genplan = document.querySelector('[data-genplan]');
    if (genplan) {
        const viewport = genplan.querySelector('[data-genplan-viewport]');
        const img = genplan.querySelector('[data-genplan-img]');
        const zoomIn = genplan.querySelector('[data-zoom-in]');
        const zoomOut = genplan.querySelector('[data-zoom-out]');
        const zoomReset = genplan.querySelector('[data-zoom-reset]');
        let scale = 1;
        let dragging = false;
        let startX = 0;
        let startY = 0;
        let scrollLeft = 0;
        let scrollTop = 0;

        const applyZoom = () => {
            if (!img || !zoomReset) {
                return;
            }
            img.style.transform = `scale(${scale})`;
            zoomReset.textContent = `${Math.round(scale * 100)}%`;
        };

        zoomIn?.addEventListener('click', () => {
            scale = Math.min(2.5, Math.round((scale + 0.25) * 100) / 100);
            applyZoom();
        });

        zoomOut?.addEventListener('click', () => {
            scale = Math.max(1, Math.round((scale - 0.25) * 100) / 100);
            applyZoom();
        });

        zoomReset?.addEventListener('click', () => {
            scale = 1;
            applyZoom();
            if (viewport) {
                viewport.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
            }
        });

        viewport?.addEventListener('pointerdown', (event) => {
            if (event.button !== 0) {
                return;
            }
            dragging = true;
            viewport.classList.add('is-dragging');
            startX = event.clientX;
            startY = event.clientY;
            scrollLeft = viewport.scrollLeft;
            scrollTop = viewport.scrollTop;
            viewport.setPointerCapture(event.pointerId);
        });

        viewport?.addEventListener('pointermove', (event) => {
            if (!dragging) {
                return;
            }
            viewport.scrollLeft = scrollLeft - (event.clientX - startX);
            viewport.scrollTop = scrollTop - (event.clientY - startY);
        });

        const stopDrag = () => {
            dragging = false;
            viewport?.classList.remove('is-dragging');
        };

        viewport?.addEventListener('pointerup', stopDrag);
        viewport?.addEventListener('pointercancel', stopDrag);
        applyZoom();
    }

    form?.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const phone = String(data.get('phone') || '').trim();

        if (!data.get('consent')) {
            if (status) {
                status.hidden = false;
                status.classList.remove('is-ok');
                status.textContent = 'Нужно согласие на обработку данных.';
            }
            return;
        }

        const body = [
            'Заявка с демо-лендинга «Финская деревня Юг»',
            `Имя: ${name}`,
            `Телефон: ${phone}`,
            'Источник: https://finvillage.vse-prosto.su',
        ].join('\n');

        const mailto = `mailto:finvillage@inbox.ru?subject=${encodeURIComponent('Заявка на просмотр — Финская деревня Юг')}&body=${encodeURIComponent(body)}`;

        if (status) {
            status.hidden = false;
            status.classList.add('is-ok');
            status.textContent = 'Открываю письмо менеджерам… Или напишите в Telegram — так быстрее.';
        }

        window.location.href = mailto;
        form.reset();
    });
})();
