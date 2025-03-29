
fetch('albums.json')
  .then(response => response.json())
  .then(data => {
    const stored = JSON.parse(localStorage.getItem('customAlbums') || '[]');
    const combined = [...data, ...stored];
    renderAlbums(combined);
    setupSearch(combined);
    setupGenreFilter(combined);
  });

function renderAlbums(albums) {
  const albumList = document.getElementById('album-list');
  if (!albumList) return;
  albumList.innerHTML = '';

  albums.forEach(album => {
    const div = document.createElement('div');
    div.className = 'album';
    div.setAttribute('data-genre', (album.genre || []).join(', '));

    div.innerHTML = `
      <img src="${album.cover}" alt="${album.title}">
      <h3>${album.title}</h3>
      <p>${album.artist}</p>
    `;

    // 카드 클릭 시 상세페이지 이동
    div.onclick = () => {
      localStorage.setItem('selectedAlbum', JSON.stringify(album));
      window.location.href = 'detail.html';
    };

    const genreColors = {
      "Jazz": "#2b7a78",
      "City Pop": "#d7263d",
      "Pop": "#673ab7",
      "R&B": "#ff5722",
      "Alternative": "#ff5722",
      "Bossa Nova": "#009688",
      "Indie": "#607d8b",
      "Folk": "#6d4c41",
      "Live": "#3f51b5",
      "K-pop": "#e91e63",
      "Cover": "#9e9e9e"
    };
    const genres = album.genre || [];
    const colors = genres.map(g => genreColors[g] || "#aaa");
    if (colors.length > 1) {
      div.style.borderImage = `linear-gradient(to right, ${colors.join(", ")}) 1`;
      div.style.borderStyle = "solid";
    } else {
      div.style.borderColor = colors[0] || "#ccc";
    }

    const label = document.createElement("div");
    label.className = "genre-label";
    label.style.background = colors[0] || "#aaa";
    label.textContent = genres.join(" / ");
    div.appendChild(label);

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
        (album.genre || []).some(g => g.toLowerCase().includes(kw)) ||
        album.tracks.some(track => track.toLowerCase().includes(kw))
      )
    );
    renderAlbums(filtered);
  });
}

function setupGenreFilter(albums) {
  const allGenres = new Set();
  albums.forEach(a => (a.genre || []).forEach(g => allGenres.add(g)));
  const genresAvailable = ["All", ...allGenres];

  const albumList = document.getElementById("album-list");
  const filterBar = document.createElement("div");
  filterBar.className = "filter-bar";

  genresAvailable.forEach(genre => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = genre;
    btn.onclick = () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filtered = genre === "All"
        ? albums
        : albums.filter(album => (album.genre || []).includes(genre));
      renderAlbums(filtered);
    };
    filterBar.appendChild(btn);
  });

  albumList.parentNode.insertBefore(filterBar, albumList);
}
