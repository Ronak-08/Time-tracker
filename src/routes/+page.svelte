<script>
  // Imports

  import { timerStore } from "$lib/timer.svelte";
  import { browser } from "$app/environment";
  import { Button, Icon } from "m3-svelte";
  import play from "@ktibow/iconset-material-symbols/play-arrow";
  import pause from "@ktibow/iconset-material-symbols/pause";
  import stop from "@ktibow/iconset-material-symbols/stop";
	import { settings } from "$lib/state.svelte";

  // State

  let inputRef;
  let sessionInput = $state({ name: "", note: "" });
 
 //auto save

 $effect(() => {
   if(timerStore.session) {
     sessionInput.name = timerStore.session.name;
     sessionInput.note = timerStore.session.note ?? "";
   }
 })

function handleMainAction() {
  if(!browser) return;
    if (!timerStore.isActive) {
      if (!sessionInput.name && settings.nameReq) {
        inputRef?.focus();
        return;
      }
      timerStore.start(sessionInput.name, sessionInput.note);
    } else if (timerStore.isRunning) {
      timerStore.pause();
    } else {
      timerStore.resume();
    }
  }

 function handleEnd() {
  timerStore.finish();
  sessionInput = {name: "", note: ""};
 }

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => n.toString().padStart(2, "0");

  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}
</script>

<main>
<!-- main timer -->

<h1>{formatTime(timerStore.displayTime)}</h1>

<div class="session-input">
<input type="text" disabled={timerStore.isActive} bind:this={inputRef} placeholder="Session Name" bind:value={sessionInput.name} />
</div>

<!-- Button controls -->

<div class="btnGroup">
    <div class="btn-1">
      <Button
        iconType="full"
        variant={timerStore.isRunning ? 'outlined' : 'filled'}
        size="l"
        square={true}
        style="width: 100%;"
        onclick={handleMainAction}
      >
      {#if timerStore.isRunning}
        <Icon icon={pause} />
        {:else}
        <Icon icon={play} />
        {/if}
      </Button>
    </div>

<Button 
      iconType="full" 
      disabled={!timerStore.isActive} 
      size="m" 
      variant="tonal" 
      onclick={handleEnd}
    >
      <Icon icon={stop} />
    </Button>
  </div>
  {#if settings.notes}
<textarea placeholder="Enter note..." class="note" name="note" id="note" bind:value={sessionInput.note}></textarea>
{/if}
</main>

<style>
main {
 display: flex;
 flex-direction: column;
 width: 100%;
 height: 100%;
 min-height: 80vh;
 align-items: center;
 justify-content: center;
}

h1 {
  user-select: none;
  -webkit-user-select: none;
  font-size: clamp(5rem, 16vw, 2rem);            
  font-weight: 700;       
  line-height: 1.1;
  text-align: center;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  transition: all 0.25s ease, transform 0.15s ease;
  font-variant-numeric: tabular-nums;
}
h1:active {
  font-weight: 500;
  transform: scale(0.99);
  opacity: 0.9;
}

.session-input {
  margin: 0 0 2rem;
  background-color: var(--m3c-surface-container);
  border-radius: 28px;
}
input {
  background-color:inherit;
  outline: none;
  max-width: 50vw;
  width: fit-content;
  padding: 1rem;
  border-radius: inherit;
  font-weight: 400;
  font-size: 1.2rem;
  text-align: center;
  color: var(--m3c-on-surface);
  border: none;
}

.btnGroup {
  width: 70%;
  max-width: 200px;
  gap: 1rem;
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-1 {
  flex:1;
}

.note {
  background-color: var(--m3c-surface-container);
  border: none;
  resize: none;
  height: 100px;
  width: 70vw;
  margin-top: 16px;
  border-radius: 18px;
  padding: 1rem;
}
@media (min-width: 1024px) {
.note {
  max-width: 50vw;
}
}
</style>
