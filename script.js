document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('search-input');
    const cards = document.querySelectorAll('.card');
    const noResultsMsg = document.getElementById('no-results-message'); 

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            let visibleCount = 0; 

            cards.forEach(function(card) {
                const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : "";
                const desc = card.querySelector('.description') ? card.querySelector('.description').textContent.toLowerCase() : "";
                const location = card.getAttribute('data-location') ? card.getAttribute('data-location').toLowerCase() : "";
                
                const allText = title + " " + desc + " " + location;

                if (allText.includes(searchTerm)) {
                    card.style.display = ""; 
                    visibleCount++; 
                } else {
                    card.style.display = "none"; 
                }
            });

            if (noResultsMsg) {
                if (visibleCount === 0) {
                    noResultsMsg.style.display = "block"; 
                } else {
                    noResultsMsg.style.display = "none"; 
                }
            }
        });
    }

    const detailButtons = document.querySelectorAll('.detail-button');

    detailButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const card = this.closest('.card'); 
            
            if (card) {
                const cardData = {
                    title: card.querySelector('h3') ? card.querySelector('h3').innerText : 'Tidak Ada Judul',
                    location: card.querySelector('p') ? card.querySelector('p').innerText : 'Lokasi Tidak Diketahui',
                    // Perlu disesuaikan jika gambar tidak langsung ada di dalam .card
                    image: card.querySelector('img') ? card.querySelector('img').src : '', 
                    description: card.querySelector('.description') ? card.querySelector('.description').innerText : "",
                    url: this.getAttribute('href'), 
                    timestamp: new Date().getTime() 
                };

                saveToHistory(cardData);
            }
        });
    });

    function saveToHistory(item) {
        let history = JSON.parse(localStorage.getItem('viewHistory')) || [];

        history = history.filter(savedItem => savedItem.title !== item.title);

        history.unshift(item);

        if (history.length > 10) {
            history.pop(); 
        }

        localStorage.setItem('viewHistory', JSON.stringify(history));
    }
});

// Fungsi sederhana untuk membuka Google Maps Jakarta
function openJakartaMapSimple() {
    // Konfirmasi sebelum membuka peta
    if (confirm('Anda akan dibuka ke Google Maps. Lanjutkan?')) {
        // Koordinat Jakarta
        const lat = -6.2088;
        const lng = 106.8456;
        
        // URL Google Maps
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=13`;
        
        // Buka di tab baru
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
}

// Pasang event listener ke link "Jelajahi Peta"
document.addEventListener('DOMContentLoaded', function() {
    const mapLinks = document.querySelectorAll('a');
    mapLinks.forEach(link => {
        const icon = link.querySelector('i');
        if (icon && icon.classList.contains('fa-map-marker-alt') && 
            link.textContent.includes('Jelajahi Peta')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openJakartaMapSimple();
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("mobile-modal-container");
    const modalBody = document.getElementById("modal-body");
    const closeBtn = document.querySelector(".close-modal");
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", function(e) {
            // Jalankan hanya di tampilan HP
            if (window.innerWidth <= 768) {
                // Ambil konten dari popup asli di dalam kartu
                const popupContent = this.querySelector(".card-popup").innerHTML;
                
                // Masukkan ke dalam modal utama
                modalBody.innerHTML = popupContent;
                
                // Tampilkan modal
                modal.style.display = "block";
                
                // Mencegah scroll pada background
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Fungsi Tutup
    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    closeBtn.onclick = closeModal;
    window.onclick = (event) => { if (event.target == modal) closeModal(); };
});

// Force mobile layout detection
function checkMobileLayout() {
    const isMobile = window.innerWidth <= 768;
    const body = document.body;
    
    if (isMobile) {
        // Force mobile classes
        body.classList.add('mobile-view');
        
        // Force header layout
        const header = document.querySelector('header');
        if (header) {
            header.style.cssText = `
                display: flex !important;
                flex-direction: column !important;
                gap: 10px !important;
                padding: 10px 0 !important;
            `;
        }
        
        // Force city chips
        const cityContainer = document.querySelector('.city-chips-container');
        if (cityContainer) {
            cityContainer.style.cssText = `
                display: flex !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
                padding: 8px 5px !important;
                gap: 8px !important;
                scrollbar-width: none !important;
            `;
        }
        
        // Force cards layout
        const cardsContainer = document.querySelector('.cards-container');
        if (cardsContainer) {
            cardsContainer.style.cssText = `
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 15px !important;
                padding: 0 5px !important;
            `;
        }
        
        // Force cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.cssText = `
                width: 100% !important;
                margin: 0 !important;
                border-radius: 12px !important;
                overflow: hidden !important;
            `;
        });
        
        // Force images
        const images = document.querySelectorAll('.card img');
        images.forEach(img => {
            img.style.cssText = `
                height: 160px !important;
                width: 100% !important;
                object-fit: cover !important;
            `;
        });
    }
}

// Run on load and resize
window.addEventListener('load', checkMobileLayout);
window.addEventListener('resize', checkMobileLayout);

// Also add touch optimization
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        // Add touch feedback
        const touchElements = document.querySelectorAll('.city-chip, .card, .discussion-link');
        touchElements.forEach(el => {
            el.style.cursor = 'pointer';
            el.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            });
            el.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
    }
});
