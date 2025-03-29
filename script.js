
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
    div.setAttribute('data-genre', album.genre);

    div.innerHTML = `
      <img src="${album.cover}" alt="${album.title}">
      <h3>${album.title}</h3>
      <p>${album.genre}</p>
      <button class="delete-btn">🗑</button>
    `;

    // 카드 전체 클릭 시 상세페이지 이동
    div.onclick = (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      localStorage.setItem('selectedAlbum', JSON.stringify(album));
      window.location.href = 'detail.html';
    };

    // 삭제 버튼
    div.querySelector('.delete-btn').onclick = (e) => {
      e.stopPropagation();
      if (confirm(`'${album.title}' 앨범을 삭제할까요?`)) {
        const stored = JSON.parse(localStorage.getItem('customAlbums') || '[]');
        const updated = stored.filter(a => a.id !== album.id);
        localStorage.setItem('customAlbums', JSON.stringify(updated));
        location.reload();
      }
    };

    // 장르 스타일링
    const genreColors = {
      "Jazz": "#2b7a78",
      "City Pop": "#d7263d",
      "Pop": "#673ab7",
      "R&B": "#ff5722",
      "Alternative": "#ff5722",
      "Bossa Nova": "#009688"
    };
    const genres = (album.genre || "").split(",").map(g => g.trim());
    const primaryColor = genreColors[genres[0]] || "#aaa";
    div.style.borderColor = primaryColor;

    // 상단 라벨
    const label = document.createElement("div");
    label.className = "genre-label";
    label.style.background = primaryColor;
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
        album.genre.toLowerCase().includes(kw) ||
        album.tracks.some(track => track.toLowerCase().includes(kw))
      )
    );
    renderAlbums(filtered);
  });
}

function setupGenreFilter(albums) {
  const genresAvailable = ["All", ...new Set(albums.flatMap(a => a.genre?.split(",").map(g => g.trim()) || []))];
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
        : albums.filter(album => album.genre.includes(genre));
      renderAlbums(filtered);
    };
    filterBar.appendChild(btn);
  });

  albumList.parentNode.insertBefore(filterBar, albumList);
}
