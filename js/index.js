const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songTitle = $(".track-info h2");
const artistName = $(".track-info p");
const albumArt = $(".album-art img");
const audio = $("#audio");
const playBtn = $("#playPauseBtn");
const playerBtn = $("#playPauseBtn i");
const progressBar = $("#progress-slider");
const nextBtn = $("#nextBtn");
const prevBtn = $("#prevBtn");
const shuffleBtn = $("#shuffleBtn");
const loopBtn = $("#loopBtn");
const phoneContainer = $(".phone-container"); // Changed to phone-container
const volumeSlider = $("#volumeSlider"); // Add volume slider reference

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
  shuffleSongs: function() {
    // Lưu lại index thật của bài hát đang phát trong mảng songs gốc
    const currentSongRealIndex = this.isRandom ? this.randomOrder[this.currentIndex] : this.currentIndex;
    
    // Tạo mảng chỉ số cho tất cả bài hát
    this.randomOrder = Array.from({ length: this.songs.length }, (_, i) => i);
    
    // Thuật toán Fisher-Yates để trộn mảng
    for (let i = this.randomOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.randomOrder[i], this.randomOrder[j]] = [this.randomOrder[j], this.randomOrder[i]];
    }
    
    // Tìm vị trí mới của bài hát đang phát trong mảng ngẫu nhiên
    this.currentIndex = this.randomOrder.findIndex(index => index === currentSongRealIndex);
    
    // Render lại danh sách bài hát theo thứ tự ngẫu nhiên
    this.render();
    this.highlightActiveSong();
  },

  render: function () {
    // Lấy danh sách bài hát cần hiển thị dựa vào chế độ
    let songsToRender = this.isRandom 
      ? this.randomOrder.map(index => ({...this.songs[index], originalIndex: index}))
      : this.songs.map((song, index) => ({...song, originalIndex: index}));
    
    // Lấy index thật của bài hát đang phát trong mảng songs gốc
    
    const htmls = songsToRender.map((song, index) => {
      // Trong chế độ random, chúng ta cần xác định index thật của bài hát
      const originalIndex = this.isRandom ? this.randomOrder[index] : index;
      
      // Kiểm tra xem đây có phải là bài hát đang phát hay không
      let isActive = false;
      if (this.isRandom) {
        isActive = this.randomOrder[this.currentIndex] === originalIndex;
      } else {
        isActive = index === this.currentIndex;
      }
        
      return `                
      <li class="song-item ${isActive ? "active" : ""}" data-index="${originalIndex}">
        <img src="${song.image}" alt="${song.name}">
        <div class="song-info">
            <span class="song-name">${song.name}</span>
            <span class="song-artist">${song.artist}</span>
        </div>
      </li>`;
    });
    $(".song-list").innerHTML = htmls.join("\n");

    const songItems = $$(".song-item");
    songItems.forEach((item) => {
      item.onclick = () => {
        const songIndex = Number(item.dataset.index);
        if (this.isRandom) {
          this.currentIndex = this.randomOrder.findIndex(index => index === songIndex);
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


  //update playpause icon
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
    const currentSongRealIndex = this.isRandom ? this.randomOrder[this.currentIndex] : this.currentIndex;
    
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
      playBtn.classList.remove("play");
      playBtn.classList.add("pause");
    });
    audio.addEventListener("pause", function () {
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
      this.isRandom = !this.isRandom;
      shuffleBtn.classList.toggle("active");
      
      if (this.isRandom) {
        // When enabling shuffle, preserve the current playing song
        this.shuffleSongs();
      } else {
        // When disabling shuffle, get the real index of the currently playing song
        const currentPlayingSongIndex = this.randomOrder[this.currentIndex];
        // Reset to normal mode, setting the current index to match the song that was playing
        this.currentIndex = currentPlayingSongIndex;
        this.render();
        this.highlightActiveSong();
      }
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
  },
  
  updateVolumeIcon: function(volumeLevel) {
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
      // Clear any animation unless at 100%
      volumeLowIcon.style.animation = "";
    }

    if (volumeLevel == 100) {
      volumeHighIcon.style.animation = "iconScale 0.5s forwards";
      setTimeout(() => {
        volumeHighIcon.style.animation = "";
      }, 500);
    }
  },

  applyColorPalette: function() {
    // Make sure the image is loaded before trying to get colors
    if (!albumArt.complete) {
      albumArt.onload = () => this.extractAndApplyColors();
      return;
    }
    
    this.extractAndApplyColors();
  },
  
  extractAndApplyColors: function() {
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

  loadCurrentSong: function () {
    const songIndex = this.isRandom ? this.randomOrder[this.currentIndex] : this.currentIndex;
    const song = this.songs[songIndex];
    songTitle.textContent = song.name;
    artistName.textContent = song.artist;
    albumArt.src = song.image;
    audio.src = song.path;
    this.applyColorPalette();
    
    // Add Media Session API support for OS media controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.artist,
        album: 'Music Player',
        artwork: [
          { src: song.image, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
      
      // Add media session action handlers
      navigator.mediaSession.setActionHandler('play', () => {
        audio.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.prevSong();
        audio.play();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
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
    this.render();
    this.highlightActiveSong();
    audio.volume = volumeSlider.value / 100;
    this.updateVolumeIcon(volumeSlider.value);
  },
};

app.start();
