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
  currentLyrics: [],
  activeLyricIndex: -1,
  songs: [
    {
      name: "Jumping Machine (跳楼机)",
      artist: "LBI",
      path: "./assets/music/1.mp3",
      image: "./assets/images/1.jpg",
    },
    {
      name: "Despacito ft. Justin Bieber",
      artist: "Luis Fonsi, Daddy Yankee",
      path: "./assets/music/2.mp3",
      image: "./assets/images/2.jpg",
    },
    {
      name: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      path: "./assets/music/3.mp3",
      image: "./assets/images/3.jpg",
    },
    {
      name: "Intentions",
      artist: "Justin Bieber ft. Quavo",
      path: "./assets/music/4.mp3",
      image: "./assets/images/4.jpg",
    },
    {
      name: "Like I'm Gonna Lose You",
      artist: "Meghan Trainor ft. John Legend",
      path: "./assets/music/5.mp3",
      image: "./assets/images/5.jpg",
    },
    {
      name: "Too Sweet",
      artist: "Hozier",
      path: "./assets/music/6.mp3",
      image: "./assets/images/6.jpg",
    },
    {
      name: "Espresso",
      artist: "Sabrina Carpenter",
      path: "./assets/music/7.mp3",
      image: "./assets/images/7.jpg",
    },
    {
      name: "Die With A Smile",
      artist: "Lady Gaga & Bruno Mars",
      path: "./assets/music/8.mp3",
      image: "./assets/images/8.jpg",
    },
    {
      name: "abcdefu",
      artist: "GAYLE",
      path: "./assets/music/9.mp3",
      image: "./assets/images/9.jpg",
    },
    {
      name: "10:35",
      artist: "Tiësto& Tate McRae",
      path: "./assets/music/10.mp3",
      image: "./assets/images/10.jpg",
    },
    {
      name: "Way Back Home",
      artist: "Shaun ft. Conor Maynard",
      path: "./assets/music/11.mp3",
      image: "./assets/images/11.jpg",
    },
  ],
  shuffleSongs: function () {
    //Save the current song index before shuffling
    const currentSongRealIndex = this.isRandom
      ? this.randomOrder[this.currentIndex]
      : this.currentIndex;

    //Create an array of indexes from 0 to songs.length
    this.randomOrder = Array.from({ length: this.songs.length }, (_, i) => i);

    //Fisher-Yates shuffle
    for (let i = this.randomOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.randomOrder[i], this.randomOrder[j]] = [
        this.randomOrder[j],
        this.randomOrder[i],
      ];
    }

    this.currentIndex = this.randomOrder.findIndex(
      (index) => index === currentSongRealIndex
    );

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

    const currentSongRealIndex = this.isRandom
      ? this.randomOrder[this.currentIndex]
      : this.currentIndex;

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
        this.updateActiveLyric(audio.currentTime);
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
      const currentSongRealIndex = this.isRandom
        ? this.randomOrder[this.currentIndex]
        : this.currentIndex;

      // Toggle shuffle state
      this.isRandom = !this.isRandom;
      shuffleBtn.classList.toggle("active");

      if (this.isRandom) {
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

      this.render();
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
        this.updateActiveLyric(audio.currentTime);
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

        // Apply the gradient to phone-container
        phoneContainer.style.background = `linear-gradient(120deg, ${color1}, ${darkColor})`;
        
        // Create darker versions for panels
        const darkerColor1 = `rgba(${Math.floor(palette[0][0] * 0.7)}, ${Math.floor(palette[0][1] * 0.7)}, ${Math.floor(palette[0][2] * 0.7)}, 0.97)`;
        const darkerColor2 = `rgba(${Math.floor(palette[1][0] * 0.7)}, ${Math.floor(palette[1][1] * 0.7)}, ${Math.floor(palette[1][2] * 0.7)}, 0.97)`;
        
        // Apply to playlist and lyric panels
        const playlistPanel = document.querySelector(".playlist-panel");
        const lyricPanel = document.querySelector(".lyric-panel");
        
        if (playlistPanel) {
          playlistPanel.style.background = `linear-gradient(120deg, ${darkerColor1}, rgba(0, 0, 0, 0.97))`;
          playlistPanel.style.transition = "background 0.8s ease, transform 0.3s ease-in-out";
        }
        
        if (lyricPanel) {
          lyricPanel.style.background = `linear-gradient(120deg, ${darkerColor1}, rgba(0, 0, 0, 0.97))`;
          lyricPanel.style.transition = "background 0.8s ease, transform 0.3s ease-in-out";
        }

        phoneContainer.style.transition = "background 0.8s ease";
      }
    } catch (error) {
      console.error("Error extracting colors:", error);
      // Fallback to default background
      phoneContainer.style.background = "#000";
      
      // Reset panel backgrounds as well in case of error
      const playlistPanel = document.querySelector(".playlist-panel");
      const lyricPanel = document.querySelector(".lyric-panel");
      
      if (playlistPanel) playlistPanel.style.background = "#000000ee";
      if (lyricPanel) lyricPanel.style.background = "#000000ee";
    }
  },

  updateTime: function () {
    var d = new Date();
    var m = d.getMinutes();
    var h = d.getHours();
    time.textContent = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
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

    // Load lyrics for the current song
    this.loadLyrics(song.path.split("/").pop());
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.isRandom) {
      if (this.currentIndex >= this.randomOrder.length) {
        this.currentIndex = 0;
      }
    } else {
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
      if (this.currentIndex < 0) {
        this.currentIndex = this.randomOrder.length - 1;
      }
    } else {
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
    }
    this.loadCurrentSong();
    this.highlightActiveSong();
  },
  loadLyrics: async function (songFilename) {
    try {
      const response = await fetch("./assets/lyrics.json");
      const data = await response.json();

      // Find lyrics for current song
      const songLyrics = data.Lyrics.find(
        (item) => Object.keys(item)[0] === songFilename
      );

      if (songLyrics) {
        this.currentLyrics.length = 0; // Clear the array properly
        this.currentLyrics.push(...songLyrics[songFilename]); // Use spread operator to add all elements
        this.renderLyrics();
      } else {
        document.querySelector(".lyric-text").innerHTML =
          '<p class="no-lyrics">No lyrics available for this song.</p>';
        this.currentLyrics.length = 0; // Clear the array if no lyrics found
      }
    } catch (error) {
      console.error("Error loading lyrics:", error);
      document.querySelector(".lyric-text").innerHTML =
        '<p class="no-lyrics">Error loading lyrics.</p>';
    }
  },

  renderLyrics: function () {
    const lyricsContainer = document.querySelector(".lyric-text");
    lyricsContainer.innerHTML = "";

    if (this.currentLyrics.length === 0) {
      lyricsContainer.innerHTML =
        '<p class="no-lyrics">No lyrics available for this song.</p>';
      return;
    }

    this.currentLyrics.forEach((line, index) => {
      const lyricLine = document.createElement("p");
      lyricLine.className = "lyric-line";
      lyricLine.setAttribute("data-time", line.time);
      lyricLine.setAttribute("data-index", index);
      lyricLine.textContent = line.text;
      lyricsContainer.appendChild(lyricLine);
    });
  },

  updateActiveLyric: function (currentTime) {
    if (this.currentLyrics.length === 0) return;

    const timeMs = currentTime * 1000;

    let newActiveIndex = -1;

    for (let i = this.currentLyrics.length - 1; i >= 0; i--) {
      if (timeMs >= this.currentLyrics[i].time) {
        newActiveIndex = i;
        break;
      }
    }

    // Only update if changed
    if (newActiveIndex !== this.activeLyricIndex) {
      // Remove active class from previous lyric
      const prevActive = document.querySelector(".lyric-line.active");
      if (prevActive) {
        prevActive.classList.remove("active");
      }

      this.activeLyricIndex = newActiveIndex;

      // Add active class to current lyric
      if (this.activeLyricIndex >= 0) {
        const currentLine = document.querySelector(
          `.lyric-line[data-index="${this.activeLyricIndex}"]`
        );
        if (currentLine) {
          currentLine.classList.add("active");
          
          // Only scroll if the lyric panel is actually visible
          const lyricPanel = document.querySelector(".lyric-panel");
          if (lyricPanel && lyricPanel.classList.contains("active")) {
            const lyricContent = document.querySelector(".lyric-content");
            if (lyricContent) {
              // Improved smooth scrolling with better positioning
              const linePosition = currentLine.offsetTop;
              const contentHeight = lyricContent.clientHeight;
              
              // Scroll the line to center of view with smooth animation
              lyricContent.scrollTo({
                top: linePosition - (contentHeight / 2) + (currentLine.offsetHeight / 2),
                behavior: 'smooth'
              });
            }
          }
        }
      }
    }
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