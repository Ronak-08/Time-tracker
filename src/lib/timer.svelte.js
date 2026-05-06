import { browser } from "$app/environment";
import { sessions, save, settings } from "$lib/state.svelte";

class SessionTimer {
  session = $state(null);
  now = $state(Date.now());
  intervalId = $state(null);

  constructor() {
    if (browser) {
      this.loadFromStorage();
    }
  }

  get isActive() {
    return this.session !== null;
  }

  get isRunning() {
    if(!browser) return;
    return this.intervalId !== null;
  }

  get displayTime() {
    if (!this.session) return 0;
    if (!this.isRunning) return this.session.elapsed;
    return this.session.elapsed + (this.now - this.session.startTime);
  }

  start(name, note) {
    this.session = {
      id: crypto.randomUUID(),
      name,
      note: note || null,
      startTime: Date.now(),
      elapsed: 0,
      endTime: null,
      duration: 0,
    };
    this.resume(); 
    this.persist();
  }

  resume() {
    if (this.intervalId || !this.session) return;

    this.now = Date.now();
    this.session.startTime = Date.now();

    this.intervalId = setInterval(() => {
      this.now = Date.now(); 
    }, 1000);

    this.persist();
  }

  pause() {
    if (!this.intervalId || !this.session) return;

    clearInterval(this.intervalId);
    this.intervalId = null;

    this.session.elapsed += Date.now() - this.session.startTime;
    this.persist();
  }

  finish() {
    if (!this.session) return;

    this.pause();

    const totalDuration = this.session.elapsed;

    const completedSession = {
      ...this.session,
      endTime: Date.now(),
      duration: totalDuration
    };

    sessions.push(completedSession);
    save(); 

    this.session = null;
    if (browser) localStorage.removeItem("currentSession");
  }

  persist() {
    if (browser && this.session) {
      localStorage.setItem("currentSession", JSON.stringify(this.session));
    }
  }

  loadFromStorage() {
    const raw = localStorage.getItem("currentSession");
    if (raw) {
      this.session = JSON.parse(raw);
      // Auto-resume logic: 
      if(settings.autoStart) {this.resume()}
    }
  }
}

export const timerStore = new SessionTimer();
