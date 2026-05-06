<script>
	import './layout.css';
  import { Button, NavCMLX, NavCMLXItem } from "m3-svelte";
  import { page } from '$app/stores';
  import home from "@ktibow/iconset-material-symbols/home";
  import stats from "@ktibow/iconset-material-symbols/bar-chart";
  import settings from "@ktibow/iconset-material-symbols/settings"
	let { children } = $props();
</script>

<main>
<div class="container">
{@render children()}
</div>

<div class="wrapper">
<NavCMLX variant="auto">
  <NavCMLXItem
    variant="auto"
    text="home"
     icon={home}
    selected={$page.url.pathname == "/"}
    href="/"
  />
  <NavCMLXItem
    variant="auto"
    text="stats"
    icon={stats}
    selected={$page.url.pathname == "/stats"}
    href="/stats"
  />
  <NavCMLXItem
    variant="auto"
    text="settings"
    icon={settings}
    selected={$page.url.pathname == "/settings"}
    href="/settings"
  />
</NavCMLX>
</div>
</main>

<style>
main {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow-y: hidden;
}

@media screen and (min-width: 861px) {
  main {
    flex-direction: row-reverse;
  }
.wrapper {
  background-color: var(--m3c-surface-container);
  padding-top: 1rem;
}
}

.container {
  flex: 1;
  height: 100%;
  padding: 1rem;
}
@media (min-width: 1024px) {
  .container {
    padding: 1.5rem;
  }
}
</style>
