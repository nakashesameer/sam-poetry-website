// Index Loader - Dynamically loads poem list from index.json

(function() {
    'use strict';

    const poemListEl = document.getElementById('poemList');

    fetch('poems/index.json')
        .then(response => response.json())
        .then(poems => {
            if (poems.length === 0) {
                poemListEl.innerHTML = '<li class="poem-list-item"><span class="poem-link-title">No poems yet.</span></li>';
                return;
            }

            let html = '';
            for (const poem of poems) {
                const titleHtml = poem.titleEn
                    ? `<span class="title-mr">${escapeHtml(poem.title)}</span><span class="title-separator">  |  </span><span class="title-en">${escapeHtml(poem.titleEn)}</span>`
                    : `<span class="title-mr">${escapeHtml(poem.title)}</span>`;

                html += `
                    <li class="poem-list-item">
                        <a href="poem.html?id=${encodeURIComponent(poem.id)}" class="poem-link">
                            <div class="poem-link-title protected-text">${titleHtml}</div>
                            <div class="poem-link-date protected-text">${escapeHtml(poem.date || '')}</div>
                        </a>
                    </li>
                `;
            }
            poemListEl.innerHTML = html;
        })
        .catch(err => {
            console.error('Error loading poem index:', err);
            poemListEl.innerHTML = '<li class="poem-list-item"><span class="poem-link-title">Error loading poems.</span></li>';
        });

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
