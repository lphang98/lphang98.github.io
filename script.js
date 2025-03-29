fetch('albums.json')
  .then(response => response.json())
  .then(data => {
    const stored = JSON.parse(localStorage.getItem('customAlbums') || '[]');
    const combined = [...data, ...stored];
    renderAlbums(combined, stored);
    setupSearch(combined, stored);
  });

function renderAlbums(albums, storedAlbums) {
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
      <button class="delete-btn" style="margin-top:10px;">🗑 삭제</button>
    `;
    div.querySelector('img').onclick = () => {
      localStorage.setItem('selectedAlbum', JSON.stringify(album));
      window.location.href = 'detail.html';
    };
    div.querySelector('.delete-btn').onclick = () => {
      if (confirm(`'${album.title}' 앨범을 삭제할까요?`)) {
        const updated = storedAlbums.filter(a => a.id !== album.id);
        localStorage.setItem('customAlbums', JSON.stringify(updated));
        location.reload();
      }
    };
    albumList.appendChild(div);
  });
}

function setupSearch(albums, storedAlbums) {
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
    renderAlbums(filtered, storedAlbums);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const genreColors = {
    "Jazz": "#2b7a78",
    "City Pop": "#d7263d",
    "Pop": "#673ab7",
    "R&B": "#ff5722",
    "Alternative": "#ff5722",
    "Bossa Nova": "#009688"
  };

  const cards = document.querySelectorAll(".album");
  cards.forEach(card => {
    const genreText = card.querySelector("p")?.textContent;
    if (!genreText) return;

    const genres = genreText.split(",").map(g => g.trim());
    const colors = genres.map(g => genreColors[g] || "#ccc");
    if (colors.length === 1) {
      card.style.borderColor = colors[0];
    } else {
      // 여러 색을 혼합한 그라디언트 테두리
      card.style.borderImage = `linear-gradient(to right, ${colors.join(",")}) 1`;
      card.style.borderStyle = "solid";
    }
  });
});