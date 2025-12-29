document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.setting');
    const search = document.getElementById('other');
    
    hamburger.addEventListener('click', function() {
        search.classList.toggle('active');
    });
    
    // Fermer la search bar en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (!search.contains(event.target) && !hamburger.contains(event.target)) {
            search.classList.remove('active');
        }
    });
});

