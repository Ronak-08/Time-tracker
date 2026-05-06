<script>
import { settings } from "$lib/state.svelte";
	import { Switch } from "m3-svelte";
	import { onMount } from "svelte";

  $effect(() => {
    if(settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
    }
    })
</script>

<main>
 <h1 style="padding: 0.6rem;">Settings</h1>

 <div class="container">  
   <div class="card m3-layer">
     <p>Resume timer on reload</p>
      <label><Switch icons="both" bind:checked={settings.autoStart} /></label>
   </div>
   <div class="card m3-layer">
     <p>Show Notes</p>
      <label><Switch icons="both" bind:checked={settings.notes} /></label>
   </div>
   <div class="card m3-layer">
     <p>Session Name Required</p>
      <label><Switch icons="both" bind:checked={settings.nameReq} /></label>
   </div>
 </div>
</main>

<style>
 main {
   height: 100%;
 }
 h1 {
   text-align: center;
 }
 .container {
   padding: 1rem;
   display: flex;
   flex-direction: column;
   gap: 0.6rem;
 }
 .card {
   display: flex;
   justify-content: space-between;
   background-color: var(--m3c-surface-container);
   border-radius: 20px;
   align-items: center;
   padding: 0.6rem 1rem;
   font-weight: 400;
 }
 @media (min-width: 1024px) {
.container {
  max-width: 50vw;
  margin: auto;
}
}

</style>
