<script lang="ts">
  import { onDestroy } from 'svelte';
  import Input from './lib/Input.svelte';
  import {state} from './lib/stores.js'

  let stateVal: Number;
  $: stateVal;
  const unsub1 = state.subscribe((value)=>{
    stateVal = value;
  })

  onDestroy(()=>{
    unsub1
  })
</script>

<main>

  <h1>P2P Pong</h1>

  <div class="card">
    {#if $state == 0}
      <Input/>
    
    {:else if $state==1}
      <div>Boop</div>
    {/if}


  </div>


</main>

<style>

</style>
