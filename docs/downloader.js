// --- Lightbox ---
let currentIndex = 0;

const galleryImgs = () =>
    Array.from(document.querySelectorAll('.gallery-img'))
        .filter(img => img.complete && img.naturalWidth > 0);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            const imgs = galleryImgs();
            currentIndex = imgs.indexOf(img);
            openLightbox(imgs[currentIndex].src);
        });
    });
});

function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function shiftLightbox(dir) {
    const imgs = galleryImgs();
    currentIndex = (currentIndex + dir + imgs.length) % imgs.length;
    document.getElementById('lightboxImg').src = imgs[currentIndex].src;
}

document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'ArrowRight') shiftLightbox(1);
    if (e.key === 'ArrowLeft')  shiftLightbox(-1);
    if (e.key === 'Escape')     closeLightbox();
});

// --- Convert an img element to a Blob via canvas ---
function imgToBlob(img) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        try {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(blob => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas toBlob failed'));
            }, 'image/jpeg', 0.95);
        } catch (e) {
            reject(e);
        }
    });
}

// --- Download All as ZIP ---
async function downloadAll() {
    const btn = document.querySelector('.gallery-download');
    const imgs = galleryImgs();

    if (imgs.length === 0) {
        alert('No images found to download.');
        return;
    }

    btn.textContent = 'Zipping...';
    btn.disabled = true;

    const zip = new JSZip();
    let added = 0;

    await Promise.all(imgs.map(async (img, i) => {
        try {
            const blob = await imgToBlob(img);
            const filename = `${String(i + 1).padStart(2, '0')}.jpg`;
            zip.file(filename, blob);
            added++;
        } catch (e) {
            console.warn(`Skipped image ${i + 1}:`, e);
        }
    }));

    if (added === 0) {
        alert('Could not package any images. This may be a browser security restriction when viewing files locally. Try uploading to your server first.');
        btn.innerHTML = svgDownload() + ' Download All';
        btn.disabled = false;
        return;
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);

    const artist  = document.querySelector('.gallery-artist')?.textContent.trim().replace(/\s+/g, '-') || 'photos';
    const details = document.querySelector('.gallery-details')?.textContent || '';
    const date    = details.split('·').pop().trim().replace(/\//g, '-');
    a.download = `${artist}_${date}.zip`;
    a.click();

    btn.innerHTML = svgDownload() + ' Download All';
    btn.disabled = false;
}

function svgDownload() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
}
