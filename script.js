fetch('albums.json')
  .then(response => response.json())
  .then(data => {
    const albumList = document.getElementById('album-list');
    const searchInput = document.getElementById('search');
    function displayAlbums(albums) {
      albumList.innerHTML = '';
      albums.forEach(album => {
        const div = document.createElement('div');
        div.className = 'album';
        div.innerHTML = `
          <img src="${album.cover}" alt="${album.title}">
          <h3>${album.title}</h3>
          <p>${album.artist}</p>
        `;
        div.onclick = () => {
          localStorage.setItem('selectedAlbum', JSON.stringify(album));
          window.location.href = 'detail.html';
        };
        albumList.appendChild(div);
      });
    }
    displayAlbums(data);
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = data.filter(album =>
        album.title.toLowerCase().includes(query) ||
        album.artist.toLowerCase().includes(query) ||
        album.genre.toLowerCase().includes(query) ||
        album.tracks.some(track => track.toLowerCase().includes(query))
      );
      displayAlbums(filtered);
    });
  });