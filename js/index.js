const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songTitle = $(".track-info h2");
const artistName = $(".track-info p");
const albumArt = $(".album-art img");
const audio = $("#audio");
const playBtn = $("#playPauseBtn");
const playerBtn = $("#playPauseBtn i");
const progressBar = $("#progress-slider");

const app = {
  currentIndex: 0,
  songs: [
    {
      name: "Despacito ft. Justin Bieber",
      artist: "Luis Fonsi, Daddy Yankee",
      path: "../assets/music/1.mp3",
      image: "../assets/images/1.jpg",
    },
    {
      name: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      path: "../assets/music/2.mp3",
      image: "../assets/images/2.jpg",
    },
    {
      name: "Intentions",
      artist: "Justin Bieber ft. Quavo",
      path: "../assets/music/3.mp3",
      image: "../assets/images/3.jpg",
    },
    {
      name: "Like I'm Gonna Lose You",
      artist: "Meghan Trainor ft. John Legend",
      path: "../assets/music/4.mp3",
      image: "../assets/images/4.jpg",
    },
    {
      name: "Too Sweet",
      artist: "Hozier",
      path: "../assets/music/5.mp3",
      image: "../assets/images/5.jpg",
    },
    {
      name: "Espresso",
      artist: "Sabrina Carpenter",
      path: "../assets/music/6.mp3",
      image: "../assets/images/6.jpg",
    },
    {
      name: "Die With A Smile",
      artist: "Lady Gaga & Bruno Mars",
      path: "../assets/music/7.mp3",
      image: "../assets/images/7.jpg",
    },
    {
      name: "Échame La Culpa",
      artist: "Luis Fonsi & Demi Lovato",
      path: "../assets/music/8.mp3",
      image: "../assets/images/8.jpg",
    },
    {
      name: "10:35",
      artist: "Tiësto& Tate McRae",
      path: "../assets/music/9.mp3",
      image: "../assets/images/9.jpg",
    },
    {
      name: "Way Back Home",
      artist: "Shaun ft. Conor Maynard",
      path: "../assets/music/10.mp3",
      image: "../assets/images/10.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song) => {
      return `                
      <li class="song-item">
        <img src="${song.image}" alt="${song.name}">
        <div class="song-info">
            <span class="song-name">${song.name}</span>
            <span class="song-artist">${song.artist}</span>
        </div>
    </li>`;
    });
    $(".song-list").innerHTML = htmls.join("\n");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    playBtn.onclick = () => {
      if (audio.paused) {
        audio.play();
        playerBtn.classList.remove("fa-play");
        playerBtn.classList.add("fa-pause");
      } else {
        audio.pause();
        playerBtn.classList.remove("fa-pause");
        playerBtn.classList.add("fa-play");
      }
    };
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
      }
    };
    progressBar.onchange = (e) => {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
        }
  },

  loadCurrentSong: function () {
    songTitle.textContent = this.currentSong.name;
    artistName.textContent = this.currentSong.artist;
    albumArt.src = this.currentSong.image;
    audio.src = this.currentSong.path;
  },

  start: function () {
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
