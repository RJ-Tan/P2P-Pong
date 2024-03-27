<script lang="ts">
  import { onDestroy } from 'svelte';
  import Input from './lib/Input.svelte';
  import Game from './lib/Game.svelte';
  import {state, uName, roomID} from './lib/stores.js';

  let stateVal: Number;
  let p1_name: String;
  $: stateVal;
  $: p1_name;

  const unsub1 = state.subscribe((value)=>{
    stateVal = value;
  })

  /*
  const unsub2 = uName.subscribe((value)=>{
    p1_name = value;
  })*/

  onDestroy(()=>{
    unsub1
    //unsub2
  })
</script>

<main>

  <h1>P2P Pong</h1>

  <div class="card">
    {#if $state == 0}
      <Input/>
    
    {:else if $state==1}
      <Game p1_name={$uName} room_id={$roomID}/>
    {/if}


  </div>


</main>

<style>

</style>
