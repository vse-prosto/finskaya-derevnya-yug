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

    form?.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const phone = String(data.get('phone') || '').trim();
        const comment = String(data.get('comment') || '').trim();

        const body = [
            'Заявка с демо-лендинга «Финская деревня Юг»',
            `Имя: ${name}`,
            `Телефон: ${phone}`,
            comment ? `Комментарий: ${comment}` : null,
        ].filter(Boolean).join('\n');

        const mailto = `mailto:finvillage@inbox.ru?subject=${encodeURIComponent('Заявка на просмотр — Финская деревня Юг')}&body=${encodeURIComponent(body)}`;

        if (status) {
            status.hidden = false;
            status.classList.add('is-ok');
            status.textContent = 'Открываю почтовый клиент… Можно также позвонить или написать в Telegram.';
        }

        window.location.href = mailto;
        form.reset();
    });
})();
