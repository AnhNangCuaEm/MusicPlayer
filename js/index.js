const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const time = $(".time");
const songTitle = $(".track-info h2");
const artistName = $(".track-info p");
const albumArt = $(".album-art img");
const artCover = $(".album-art");
const audio = $("#audio");
const playBtn = $("#playPauseBtn");
const playerBtn = $("#playPauseBtn i");
const progressBar = $("#progress-slider");
const totalDuration = $(".total-time");
const currentTime = $(".current-time");
const nextBtn = $("#nextBtn");
const prevBtn = $("#prevBtn");
const shuffleBtn = $("#shuffleBtn");
const loopBtn = $("#loopBtn");
const phoneContainer = $(".phone-container");
const volumeSlider = $("#volumeSlider");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  randomOrder: [],
  songs: [
    {
      name: "Despacito ft. Justin Bieber",
      artist: "Luis Fonsi, Daddy Yankee",
      path: "./assets/music/1.mp3",
      image: "./assets/images/1.jpg",
    },
    {
      name: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      path: "./assets/music/2.mp3",
      image: "./assets/images/2.jpg",
    },
    {
      name: "Intentions",
      artist: "Justin Bieber ft. Quavo",
      path: "./assets/music/3.mp3",
      image: "./assets/images/3.jpg",
    },
    {
      name: "Like I'm Gonna Lose You",
      artist: "Meghan Trainor ft. John Legend",
      path: "./assets/music/4.mp3",
      image: "./assets/images/4.jpg",
    },
    {
      name: "Too Sweet",
      artist: "Hozier",
      path: "./assets/music/5.mp3",
      image: "./assets/images/5.jpg",
    },
    {
      name: "Espresso",
      artist: "Sabrina Carpenter",
      path: "./assets/music/6.mp3",
      image: "./assets/images/6.jpg",
    },
    {
      name: "Die With A Smile",
      artist: "Lady Gaga & Bruno Mars",
      path: "./assets/music/7.mp3",
      image: "./assets/images/7.jpg",
    },
    {
      name: "Échame La Culpa",
      artist: "Luis Fonsi & Demi Lovato",
      path: "./assets/music/8.mp3",
      image: "./assets/images/8.jpg",
    },
    {
      name: "10:35",
      artist: "Tiësto& Tate McRae",
      path: "./assets/music/9.mp3",
      image: "./assets/images/9.jpg",
    },
    {
      name: "Way Back Home",
      artist: "Shaun ft. Conor Maynard",
      path: "./assets/music/10.mp3",
      image: "./assets/images/10.jpg",
    },
  ],
  shuffleSongs: function () {
    // Lưu lại index thật của bài hát đang phát trong mảng songs gốc
    const currentSongRealIndex = this.isRandom
      ? this.randomOrder[this.currentIndex]
      : this.currentIndex;

    // Tạo mảng chỉ số cho tất cả bài hát
    this.randomOrder = Array.from({ length: this.songs.length }, (_, i) => i);

    // Thuật toán Fisher-Yates để trộn mảng
    for (let i = this.randomOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.randomOrder[i], this.randomOrder[j]] = [
        this.randomOrder[j],
        this.randomOrder[i],
      ];
    }

    // Tìm vị trí mới của bài hát đang phát trong mảng ngẫu nhiên
    this.currentIndex = this.randomOrder.findIndex(
      (index) => index === currentSongRealIndex
    );

    // Render lại danh sách bài hát theo thứ tự ngẫu nhiên
    this.render();
    this.highlightActiveSong();
  },

  render: function () {
    // Get the real index of the current song
    const currentSongRealIndex = this.isRandom
      ? this.randomOrder[this.currentIndex]
      : this.currentIndex;

    let songsToRender = [];
    if (this.isRandom) {
      // In random mode, we render songs in the order specified by randomOrder
      songsToRender = this.randomOrder.map((index) => ({
        ...this.songs[index],
        originalIndex: index,
      }));
    } else {
      // In normal mode, we render songs in their original order
      songsToRender = this.songs.map((song, index) => ({
        ...song,
        originalIndex: index,
      }));
    }

    const htmls = songsToRender.map((song, index) => {
      // Get the original index of this song in the songs array
      const originalIndex = song.originalIndex;

      // A song is active if its original index matches the real index of the current song
      const isActive = originalIndex === currentSongRealIndex;

      return `                
      <li class="song-item ${
        isActive ? "active" : ""
      }" data-index="${originalIndex}">
        <img src="${song.image}" alt="${song.name}">
        <div class="song-info">
            <span class="song-name">${song.name}</span>
            <span class="song-artist">${song.artist}</span>
        </div>
      </li>`;
    });

    $(".song-list").innerHTML = htmls.join("\n");

    // Add click handlers to song items
    const songItems = $$(".song-item");
    songItems.forEach((item) => {
      item.onclick = () => {
        const songIndex = Number(item.dataset.index);
        if (this.isRandom) {
          this.currentIndex = this.randomOrder.findIndex(
            (index) => index === songIndex
          );
        } else {
          this.currentIndex = songIndex;
        }
        this.loadCurrentSong();
        audio.play();
        playerBtn.classList.remove("fa-play");
        playerBtn.classList.add("fa-pause");
        this.highlightActiveSong();
      };
    });
  },

  updatePlayBtnIcon: function () {
    if (audio.paused) {
      playerBtn.classList.remove("fa-pause");
      playerBtn.classList.add("fa-play");
    } else {
      playerBtn.classList.remove("fa-play");
      playerBtn.classList.add("fa-pause");
    }
  },

  highlightActiveSong: function () {
    const songItems = $$(".song-item");
    songItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Lấy index thật của bài hát đang phát trong mảng songs gốc
    const currentSongRealIndex = this.isRandom
      ? this.randomOrder[this.currentIndex]
      : this.currentIndex;

    // Tìm và add active class cho bài hát đang phát trong danh sách hiển thị
    const activeSong = $(`.song-item[data-index="${currentSongRealIndex}"]`);
    if (activeSong) {
      activeSong.classList.add("active");
    }
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    audio.addEventListener("play", function () {
      artCover.classList.remove("small");
      playBtn.classList.remove("play");
      playBtn.classList.add("pause");
    });

    audio.addEventListener("pause", function () {
      artCover.classList.add("small");

      playBtn.classList.remove("pause");
      playBtn.classList.add("play");
    });

    audio.addEventListener("play", function () {
      playerBtn.classList.remove("fa-play");
      playerBtn.classList.add("fa-pause");
    });
    audio.addEventListener("pause", function () {
      playerBtn.classList.remove("fa-pause");
      playerBtn.classList.add("fa-play");
    });

    //Spacebar key event listener for the whole document to play pause the song
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
          return;
        }
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      }
    });

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
        const currentSeconds = audio.currentTime;
        const progressPercent = (currentSeconds / audio.duration) * 100;
        progressBar.value = progressPercent;
        const currentMinutes = Math.floor(currentSeconds / 60);
        const formattedSeconds = Math.floor(currentSeconds % 60);
        currentTime.textContent = `${currentMinutes}:${
          formattedSeconds < 10 ? "0" : ""
        }${formattedSeconds}`;
      }
    };
    progressBar.onchange = (e) => {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    nextBtn.onclick = () => {
      this.nextSong();
      audio.play();
      playerBtn.classList.remove("fa-play");
      playerBtn.classList.add("fa-pause");
    };
    prevBtn.onclick = () => {
      this.prevSong();
      audio.play();
      playerBtn.classList.remove("fa-play");
      playerBtn.classList.add("fa-pause");
    };
    shuffleBtn.onclick = () => {
      // Store the real index of the currently playing song before changing modes
      const currentSongRealIndex = this.isRandom
        ? this.randomOrder[this.currentIndex]
        : this.currentIndex;

      // Toggle shuffle state
      this.isRandom = !this.isRandom;
      shuffleBtn.classList.toggle("active");

      if (this.isRandom) {
        // Create randomOrder array first
        this.randomOrder = Array.from(
          { length: this.songs.length },
          (_, i) => i
        );

        // Fisher-Yates shuffle
        for (let i = this.randomOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.randomOrder[i], this.randomOrder[j]] = [
            this.randomOrder[j],
            this.randomOrder[i],
          ];
        }
        // Make sure the current song is properly tracked in shuffle mode
        this.currentIndex = this.randomOrder.findIndex(
          (index) => index === currentSongRealIndex
        );

        // Safeguard if findIndex returns -1 (shouldn't happen, but just in case)
        if (this.currentIndex === -1) {
          this.currentIndex = 0;
        }
      } else {
        // When disabling shuffle, set current index to the real song index
        this.currentIndex = currentSongRealIndex;
      }

      // Render the playlist with the updated order
      this.render();

      // Make sure to highlight the active song after rendering
      this.highlightActiveSong();
    };
    loopBtn.onclick = () => {
      loopBtn.classList.toggle("active");
      this.isRepeat = !this.isRepeat;
    };
    audio.onended = () => {
      if (this.isRepeat) {
        audio.play();
      } else {
        this.nextSong();
        audio.play();
      }
      playerBtn.classList.remove("fa-play");
      playerBtn.classList.add("fa-pause");
    };
    volumeSlider.onchange = (e) => {
      audio.volume = e.target.value / 100;
      this.updateVolumeIcon(e.target.value);
    };
    volumeSlider.oninput = (e) => {
      audio.volume = e.target.value / 100;
      this.updateVolumeIcon(e.target.value);
    };

    audio.addEventListener("loadedmetadata", () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      totalDuration.textContent = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    });

    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60);
        currentTime.textContent = `${currentMinutes}:${
          currentSeconds < 10 ? "0" : ""
        }${currentSeconds}`;
      }
    };
  },

  updateVolumeIcon: function (volumeLevel) {
    const volumeLowIcon = $(".volume-bar i:first-child");
    const volumeHighIcon = $(".volume-bar .fa-volume-high");

    if (volumeLevel == 0) {
      volumeLowIcon.className = "fas fa-volume-off";
      volumeHighIcon.style.opacity = "0.5";
      volumeLowIcon.style.animation = "iconScale 0.5s forwards";
      setTimeout(() => {
        volumeLowIcon.style.animation = "";
      }, 500);
    } else if (volumeLevel <= 50) {
      volumeLowIcon.className = "fas fa-volume-low";
      volumeHighIcon.style.opacity = "0.5";
      volumeLowIcon.style.animation = "";
      volumeHighIcon.style.animation = "";
    } else {
      volumeLowIcon.className = "fas fa-volume-low";
      volumeHighIcon.style.opacity = "1";
      volumeLowIcon.style.animation = "";
    }

    if (volumeLevel == 100) {
      volumeHighIcon.style.animation = "iconScale 0.5s forwards";
      setTimeout(() => {
        volumeHighIcon.style.animation = "";
      }, 500);
    }
  },

  applyColorPalette: function () {
    // Make sure the image is loaded before trying to get colors
    if (!albumArt.complete) {
      albumArt.onload = () => this.extractAndApplyColors();
      return;
    }

    this.extractAndApplyColors();
  },

  extractAndApplyColors: function () {
    const colorThief = new ColorThief();
    try {
      // Get color palette (returns an array of [r,g,b] colors)
      const palette = colorThief.getPalette(albumArt, 3);

      if (palette && palette.length >= 2) {
        // Convert RGB arrays to CSS format
        const color1 = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
        const color2 = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`;
        const darkColor = `rgba(128, 128, 128, 0.9)`;

        // Apply the gradient to phone-container instead of player-container
        phoneContainer.style.background = `linear-gradient(120deg, ${color1}, ${darkColor})`;

        // Add a transition effect
        phoneContainer.style.transition = "background 0.8s ease";
      }
    } catch (error) {
      console.error("Error extracting colors:", error);
      // Fallback to default background
      phoneContainer.style.background = "#000";
    }
  },
  updateTime: function () {
    var d = new Date();
    var m = d.getMinutes();
    var h = d.getHours();
    time.textContent =
      ("0" + h).substr(-2) +
      ":" +
      ("0" + m).substr(-2);
    setInterval(this.updateTime, 1000);
  },
  loadCurrentSong: function () {
    const songIndex = this.isRandom
      ? this.randomOrder[this.currentIndex]
      : this.currentIndex;
    const song = this.songs[songIndex];
    songTitle.textContent = song.name;
    artistName.textContent = song.artist;
    albumArt.src = song.image;
    audio.src = song.path;
    this.applyColorPalette();

    // Reset the duration display until metadata is loaded
    totalDuration.textContent = "0:00";

    // Add Media Session API support for OS media controls
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.artist,
        album: "Music Player",
        artwork: [{ src: song.image, sizes: "512x512", type: "image/jpeg" }],
      });

      // Add media session action handlers
      navigator.mediaSession.setActionHandler("play", () => {
        audio.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        audio.pause();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        this.prevSong();
        audio.play();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        this.nextSong();
        audio.play();
      });
    }
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.isRandom) {
      // Nếu ở chế độ ngẫu nhiên, reset về đầu danh sách random
      if (this.currentIndex >= this.randomOrder.length) {
        this.currentIndex = 0;
      }
    } else {
      // Chế độ bình thường
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
    }
    this.loadCurrentSong();
    this.highlightActiveSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.isRandom) {
      // Nếu ở chế độ ngẫu nhiên, quay lại cuối danh sách random
      if (this.currentIndex < 0) {
        this.currentIndex = this.randomOrder.length - 1;
      }
    } else {
      // Chế độ bình thường
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
    }
    this.loadCurrentSong();
    this.highlightActiveSong();
  },
  start: function () {
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.updateTime();
    this.render();
    this.highlightActiveSong();
    audio.volume = volumeSlider.value / 100;
    this.updateVolumeIcon(volumeSlider.value);
  },
};

app.start();
