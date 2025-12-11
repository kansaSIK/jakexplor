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