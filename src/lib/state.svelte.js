	import { browser } from "$app/environment";
const initialData  = browser ? JSON.parse(localStorage.getItem("sessions") ?? "[]") : [];
const defaultSettings = {
  autoStart: false,
  notes: false,
  nameReq: true,
}

const intialSettings = browser && localStorage.getItem("settings") ? JSON.parse(localStorage.getItem("settings")) : defaultSettings;

export let settings = $state(intialSettings);

export const sessions  = $state(initialData);

export function save() {
  if(!browser) return;
  localStorage.setItem("sessions", JSON.stringify(sessions)); 
}

export function load() {
  if(!browser) return;
  const data = JSON.parse(localStorage.getItem("sessions") ?? "[]");
  sessions.length = 0;
  sessions.push(...data); 
}






