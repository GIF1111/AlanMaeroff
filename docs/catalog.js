// Hamburger menu toggle
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const btn = document.getElementById('hamburger');
    nav.classList.toggle('open');
    btn.classList.toggle('open');
}

// Close menu if user clicks outside of it
document.addEventListener('click', function(e) {
    const nav = document.getElementById('mainNav');
    const btn = document.getElementById('hamburger');
    if (nav && btn && !nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('open');
        btn.classList.remove('open');
    }
});

// Parses MM/DD/YYYY into a comparable Date object
function parseDate(dateStr) {
    const [month, day, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

function filterCatalog() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const sort  = document.getElementById('sortSelect').value;
    const grid  = document.getElementById('catalogGrid');
    const items = Array.from(grid.querySelectorAll('.catalog-item'));

    // --- Filter: match against artist, venue, date, and title ---
    const visible = items.filter(item => {
        if (!query) return true;
        const fields = [
            item.getAttribute('data-artist'),
            item.getAttribute('data-venue'),
            item.getAttribute('data-date'),
            item.getAttribute('data-title')
        ].map(f => (f || '').toLowerCase());
        return fields.some(f => f.includes(query));
    });

    const hidden = items.filter(item => !visible.includes(item));

    // --- Sort visible items ---
    visible.sort((a, b) => {
        const artistA = a.getAttribute('data-artist') || '';
        const artistB = b.getAttribute('data-artist') || '';
        const venueA  = a.getAttribute('data-venue')  || '';
        const venueB  = b.getAttribute('data-venue')  || '';
        const dateA   = parseDate(a.getAttribute('data-date'));
        const dateB   = parseDate(b.getAttribute('data-date'));

        switch (sort) {
            case 'newest':    return dateB - dateA;
            case 'oldest':    return dateA - dateB;
            case 'artist-az': return artistA.localeCompare(artistB);
            case 'artist-za': return artistB.localeCompare(artistA);
            case 'venue-az':  return venueA.localeCompare(venueB);
            case 'venue-za':  return venueB.localeCompare(venueA);
            default:          return 0;
        }
    });

    // --- Re-order DOM ---
    visible.forEach((el, i) => {
        el.style.display = '';
        el.style.animationDelay = `${i * 0.05}s`;
        grid.appendChild(el);
    });
    hidden.forEach(el => el.style.display = 'none');

    // --- Results count ---
    const count = visible.length;
    document.getElementById('resultsCount').textContent =
        count === 1 ? '— 1 SHOW —' : `— ${count} SHOWS —`;

    document.getElementById('noResults').style.display =
        count === 0 ? 'block' : 'none';
}

// Run on load so default sort (Newest) is applied immediately
document.addEventListener('DOMContentLoaded', filterCatalog);
