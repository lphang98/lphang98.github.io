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
    const keywords = query.split(' ').filter(Boolean);
    const filtered = albums.filter(album =>
      keywords.every(kw =>
        album.title.toLowerCase().includes(kw) ||
        album.artist.toLowerCase().includes(kw) ||
        album.genre.toLowerCase().includes(kw) ||
        album.tracks.some(track => track.toLowerCase().includes(kw))
      )
    );
    renderAlbums(filtered);
  });
}
