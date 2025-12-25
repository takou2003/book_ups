// Fonction pour arrêter l'animation et rediriger
function stopLoaderAndRedirect() {
  const loader = document.getElementById('pageLoader');
  
  // Arrêter l'animation
  if (loader) {
    loader.classList.add('stop-animation');
  }
  
  // Rediriger vers la nouvelle page
  setTimeout(() => {
    window.location.href = "/Authentification"; // Remplacez par votre URL
  }, 500); // Petit délai pour voir l'animation arrêtée
}

// Démarrer le timer de 3 secondes
setTimeout(stopLoaderAndRedirect, 3000);
