<script>
import { timerStore } from "$lib/timer.svelte";
import { sessions } from "$lib/state.svelte";

// --- 1. Total & Average Stats ---

  const totalDuration = $derived(
      sessions.reduce((total, item) => total + (item.duration || 0), 0)
      );

  const averageTime = $derived(
      sessions.length > 0 ? totalDuration / sessions.length : 0
      );

  // --- 2. Today's Stats ---

  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const todayTotalDuration = $derived.by(() => {

      return sessions
      .filter(item => item.startTime >= startOfToday)
      .reduce((total, item) => total + (item.duration || 0), 0);
      });

  const todaySessions = $derived.by(() => {
    return sessions.filter(item => item.startTime >= startOfToday).length;
    })

    const averageToday = $derived(
      sessions.length > 0 ? todayTotalDuration / sessions.length : 0
      );


// --- 3. Recent 7-Day Stats ---

    const recentSessions = $derived.by(() => {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const filtered = sessions.filter(s => s.startTime > sevenDaysAgo).reverse();
        return filtered.reduce((groups, session) => {
            const date = new Date(session.startTime).toISOString().split('T')[0];
            if(!groups[date]) {groups[date] = [];}
            groups[date].push(session);
            return groups;

            }, {})
        });

const maxDuration = $derived(
    sessions.length > 0 
    ? Math.max(...sessions.map(s => s.duration || 0)) 
    : 1
    );


const history = $derived([...sessions].reverse());

function formatTime(ms) {
  if (!ms) return "0m 0s"; 

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
}
</script>

<main>
<h1>Stats</h1>

<div class="stats-grid">
<div class="today-time card m3-layer">
<p class="label">Today</p>
 <p class="text total-text">{formatTime(todayTotalDuration)}</p>
</div>
 
 <div class="card m3-layer">
 <p class="label">Total Sessions</p>
 <p style="font-size: 2rem;" class="text">{todaySessions}</p>
 </div>

 <div class="card average m3-layer">
 <p class="label">Average Session</p>
 <p class="text">{formatTime(averageToday)}</p>
 </div>

</div>

<hr>

<div class="progress">
 <h2>Last 7 Days</h2>
 {#if recentSessions.length === 0}
    <div class="empty-state">No activity this week.</div>
    {:else}
  {#each Object.entries(recentSessions)
   as [date, sessionsForDay] }
   <div class="date"><h3>{date}</h3></div>
   {#each sessionsForDay as item}
    
    <div class="list-item">
    <div class="visual-bar" style="width: {(item.duration / maxDuration) * 100}%;"></div>
    <div class="content">
    <span style="font-weight: 500;">{item.name}</span>
    <span style="opacity: 0.8; font-weight: 400; font-size: 0.9rem;">{formatTime(item.duration)}</span>
    </div>
    </div>
   {/each}
  {/each} 
 {/if}
</div>

<hr>

<h2 class="heading">Total</h2>
<section class="history">
  <div class="total m3-layer">
  <p class="label-total">Total</p>
    <p style="font-size: 1.4rem; font-weight: 600;">{formatTime(totalDuration)}</p>
  </div>
  <div class="sessions m3-layer">
  <p class="label-total">Sessions</p>
    <p style="font-size: 1.4rem;">{sessions.length}</p>
  </div>
</section>

</main>

<style>
main {
  max-height: 80vh;
  overflow-y: auto;
}

hr {
  opacity: 0.2;
  border-radius: 14px;
  color: var(--m3c-on-surface-variant);
  margin: 1rem 0.5rem;
}
h1 {
  padding: 0 0.3rem;
  margin: 1rem auto;
  text-align: center;
}
.stats-grid {
  display: grid;
  padding: 1rem;
  grid-template-columns: repeat(2,1fr);
  margin-top: 1rem;
  gap: 0.5rem;
}
.card {
  background-color: var(--m3c-surface-container-high);
  border-radius: 16px;
  padding: 0.5rem;
}
.card .text {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}
.label {
  padding: 0 0.2rem;
  font-size: 0.85rem;
  opacity: 0.8;
  font-weight: 500;
}
.average {
  grid-column: 1 / span 2;
}
.today-time {
  background-color: var(--m3c-secondary-container);
  color: var(--m3c-on-secondary-container);
}
.card .total-text {
  font-weight: 700;
  font-size: 2rem;
}

.empty-state {
  margin: 1rem auto;
  font-size: 0.9rem;
  font-weight: 300;
  color: var(--m3c-on-surface-variant);
  text-align: center;
  opacity: 0.9;
}

/* progress */

.progress {
  padding:1rem; 
  margin: 0.5rem 0.5rem 0.9rem;
  display: flex;
  overflow-y: auto;
  background-color: var(--m3c-surface-container);
  max-height: 300px;
  border-radius: 16px;
  flex-direction: column;
  gap: 0.6rem;
}

.list-item {
  position: relative;
  display: block;
  flex-shrink: 0;
  padding: 0.7rem 0.8rem;
  background-color: var(--m3c-surface-container-highest);
  border-radius: 16px;
  overflow: hidden;
  isolation: isolate;
}

.visual-bar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
  transition: width 0.2s ease;
  background-color: var(--m3c-primary);
  opacity: 0.25;
  border-radius: 8px;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

h2 {
  opacity: 0.85;
  font-size: 1.3rem;
}

h3 {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.7;
  margin-top: 1rem;
}

.history {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem;
  border-radius: 16px;
  background-color: var(--m3c-surface-container);
  margin: 1rem;
  gap: 0.4rem;
}
.heading {
  padding: 1rem;
}
.history div {
  text-align: center;
  flex: 1;
  border-radius: 16px;
}
.label-total {
  color: var(--m3c-on-surface-variant);
  font-size: 0.9rem;
}
.total {
  background-color: var(--m3c-surface-container-highest);
}
.sessions {
  background-color: var(--m3c-surface-container-high);
}

@media (min-width: 1024px) {
 main {
   max-height: 100dvh;
    max-width: 50%;
    margin: auto;
 }
}
</style>

