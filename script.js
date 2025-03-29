fetch('albums.json')
  .then(response => response.json())
  .then(data => {
    const stored = JSON.parse(localStorage.getItem('customAlbums') || '[]');
    const combined = [...data, ...stored];
    renderAlbums(combined);
    setupSearch(combined);
  });

function renderAlbums(albums) {
  const albumList = document.getElementById('album-list');
  if (!albumList) return;
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

function setupSearch(albums) {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = albums.filter(album =>
      album.title.toLowerCase().includes(query) ||
      album.artist.toLowerCase().includes(query) ||
      album.genre.toLowerCase().includes(query) ||
      album.tracks.some(track => track.toLowerCase().includes(query))
    );
    renderAlbums(filtered);
  });
}
