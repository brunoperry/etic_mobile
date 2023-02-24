export default class AudioPlayer {
  #player;
  #playlist = [];
  #currentTrack = 0;

  static Events = {
    PLAY: "audioplayerplay",
    PLAYING: "audioplayerplaying",
    PAUSE: "audioplayerpause",
    ENDED: "audioplayerended",
  };

  callback;
  constructor(callback) {
    this.callback = callback;

    this.#player = new Audio();

    this.#setupEvents();
  }

  #setupEvents() {
    this.#player.onended = () => {
      this.callback(AudioPlayer.Events.ENDED);
      this.next();
    };
    this.#player.onpause = () => {
      this.callback(AudioPlayer.Events.PAUSE);
    };
    this.#player.onplay = () => {
      this.callback(AudioPlayer.Events.PLAY);
    };
    this.#player.onplaying = () => {
      this.callback(AudioPlayer.Events.PLAYING);
    };
  }

  async play(track, playlist = null) {
    this.#playlist = playlist || this.#playlist;
    for (let i = 0; i < this.#playlist.length; i++) {
      if (this.#playlist[i].id === track.id) {
        this.#currentTrack = i;
        break;
      }
    }

    if (!this.#player.paused) this.#player.pause();
    this.#player.src = this.#playlist[this.#currentTrack].url;
    return this.#player.play();
  }
  pause() {
    this.#player.pause();
  }

  next() {
    this.#currentTrack++;
    if (this.#currentTrack >= this.#playlist.length) this.#currentTrack = 0;
    this.play(this.#playlist[this.#currentTrack], this.#playlist);
  }

  previous() {
    this.#currentTrack--;
    if (this.#currentTrack < 0) this.#currentTrack = this.#playlist.length - 1;
    this.play(this.#playlist[this.#currentTrack], this.#playlist);
  }

  get track() {
    // console.log(this.#currentTrack);
    return this.#playlist[this.#currentTrack];
  }

  get volume() {
    return this.#player.volume;
  }
  set volume(val) {
    this.#player.volume = val / 100;
  }
}
