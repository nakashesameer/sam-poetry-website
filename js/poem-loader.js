// Poem Loader - Dynamically loads poems from text files

(function() {
    'use strict';

    // Get poem ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const poemId = urlParams.get('id');

    if (!poemId) {
        document.getElementById('poemTitle').textContent = 'कविता सापडली नाही';
        document.getElementById('poemContent').innerHTML = '<p>No poem specified. Please go back to the <a href="index.html">home page</a>.</p>';
        return;
    }

    // Load poem index to get metadata
    fetch('poems/index.json')
        .then(response => response.json())
        .then(index => {
            const poemMeta = index.find(p => p.id === poemId);
            if (poemMeta) {
                document.getElementById('poemTitle').textContent = poemMeta.title;
                document.getElementById('poemTitleEn').textContent = poemMeta.titleEn || '';
                document.getElementById('poemDate').textContent = poemMeta.date || '';
                document.title = poemMeta.title + ' | कविता संग्रह';
            }
        })
        .catch(err => console.error('Error loading poem index:', err));

    // Load poem content from text file
    fetch('poems/' + poemId + '.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Poem not found');
            }
            return response.text();
        })
        .then(text => {
            const parsed = parsePoemText(text);
            renderPoem(parsed);
        })
        .catch(err => {
            console.error('Error loading poem:', err);
            document.getElementById('poemContent').innerHTML = '<p>कविता लोड करण्यात त्रुटी. Poem could not be loaded.</p>';
        });

    // Parse the poem text file format
    function parsePoemText(text) {
        const result = {
            stanzas: [],
            notesMr: null,
            notesEn: null,
            translation: null
        };

        // Find the first section marker to get poem content
        const sectionMarkers = ['---notes-mr---', '---notes-en---', '---translation---'];
        let poemEndIndex = text.length;
        for (const marker of sectionMarkers) {
            const idx = text.indexOf(marker);
            if (idx !== -1 && idx < poemEndIndex) {
                poemEndIndex = idx;
            }
        }

        // First part is the poem content
        const poemText = text.substring(0, poemEndIndex).trim();

        // Extract Marathi notes
        if (text.includes('---notes-mr---')) {
            const start = text.indexOf('---notes-mr---') + 14;
            let end = text.length;
            for (const marker of ['---notes-en---', '---translation---']) {
                const idx = text.indexOf(marker);
                if (idx > start && idx < end) {
                    end = idx;
                }
            }
            result.notesMr = text.substring(start, end).trim();
        }

        // Extract English notes
        if (text.includes('---notes-en---')) {
            const start = text.indexOf('---notes-en---') + 14;
            let end = text.length;
            const transIdx = text.indexOf('---translation---');
            if (transIdx > start) {
                end = transIdx;
            }
            result.notesEn = text.substring(start, end).trim();
        }

        // Extract translation
        if (text.includes('---translation---')) {
            const start = text.indexOf('---translation---') + 17;
            result.translation = text.substring(start).trim();
        }

        // Parse stanzas (separated by blank lines)
        const stanzaTexts = poemText.split(/\n\s*\n/);
        for (const stanzaText of stanzaTexts) {
            const lines = stanzaText.trim().split('\n').filter(line => line.trim());
            if (lines.length > 0) {
                result.stanzas.push(lines);
            }
        }

        return result;
    }

    // Render the parsed poem to HTML
    function renderPoem(parsed) {
        const contentEl = document.getElementById('poemContent');

        // Render stanzas
        let html = '';
        for (const stanza of parsed.stanzas) {
            html += '<div class="stanza">';
            for (const line of stanza) {
                html += '<div class="poem-line">' + escapeHtml(line) + '</div>';
            }
            html += '</div>';
        }
        contentEl.innerHTML = html;

        // Render Marathi notes if present
        if (parsed.notesMr) {
            const section = document.getElementById('notesMrSection');
            const content = document.getElementById('notesMrContent');
            content.textContent = parsed.notesMr;
            section.style.display = 'block';
        }

        // Render English notes if present
        if (parsed.notesEn) {
            const section = document.getElementById('notesEnSection');
            const content = document.getElementById('notesEnContent');
            content.textContent = parsed.notesEn;
            section.style.display = 'block';
        }

        // Render translation if present
        if (parsed.translation) {
            const transSection = document.getElementById('translationSection');
            const transContent = document.getElementById('translationContent');

            // Parse translation stanzas
            const transStanzas = parsed.translation.split(/\n\s*\n/);
            let transHtml = '';
            for (const stanzaText of transStanzas) {
                const lines = stanzaText.trim().split('\n').filter(line => line.trim());
                if (lines.length > 0) {
                    transHtml += '<div class="stanza">';
                    for (const line of lines) {
                        transHtml += '<div class="poem-line">' + escapeHtml(line) + '</div>';
                    }
                    transHtml += '</div>';
                }
            }
            transContent.innerHTML = transHtml;
            transSection.style.display = 'block';
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
