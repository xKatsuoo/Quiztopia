window.addEventListener('load', function() {
    var loader = document.getElementById('loader');
    var content = document.getElementById('content');
  
    // Timeout zum Simulieren der Loader-Animation
    setTimeout(function() {
      // Loader ausblenden
      loader.style.display = 'none';
  
      // Inhalte anzeigen
      content.classList.remove('hidden');
    }, 3000); // Ändere die Dauer entsprechend der tatsächlichen Loader-Animation
  });
  

window.setTimeout('location.href="/Quiztopia/Pages/start.html"', 3000); 