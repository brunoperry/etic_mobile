export default class AudioPlayer {
  #audio;
  #playlist = [];
  #trackIndex = 0;

  currentState = "pause";
  callback;
  constructor(callback) {
    this.#audio = new Audio();
    this.callback = callback;

    this.#setupEvents();
  }
  #setupEvents() {
    this.#audio.onended = () => {
      this.currentState = "ended";
      this.callback(this.currentState);
      this.next();
    };
    this.#audio.onpause = () => {
      this.currentState = "pause";
      this.callback(this.currentState);
    };
    this.#audio.onerror = () => {
      this.currentState = "error";
      this.callback(this.currentState);
    };
    this.#audio.onloadstart = () => {
      this.currentState = "loading";
      this.callback(this.currentState);
    };
    this.#audio.onplaying = () => {
      this.currentState = "play";
      this.callback(this.currentState);
    };
  }

  next() {}

  async play(track, playlist = null) {
    this.#playlist = playlist || this.#playlist;
    this.currentTrack = track;

    if (!this.#audio.paused) this.#audio.pause();

    try {
      this.#audio.src = this.#playlist[this.#trackIndex].url;
      await this.#audio.play();
      return true;
    } catch (error) {
      this.currentState = "error";
      return false;
    }
  }

  pause() {}

  previous() {}

  get currentTrack() {
    return this.#playlist[this.#trackIndex];
  }
  set currentTrack(track) {
    for (let i = 0; i < this.#playlist.length; i++) {
      if (this.#playlist[i].id === track.id) {
        this.#trackIndex = i;
        break;
      }
    }
  }

  get volume() {
    return this.#audio.volume;
  }

  set volume(val) {
    this.#audio.volume = val / 100;
  }
}
