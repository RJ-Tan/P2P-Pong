<script lang="ts">
  import { onDestroy } from 'svelte';
  import Input from './lib/Input.svelte';
  import {state, uName, roomID} from './lib/stores.js';
  import {Router, Link, Route, navigate} from 'svelte-routing';
  import Game from './routes/Game.svelte';
  import Home from './routes/Home.svelte';
  
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

  export let url ="";


  function bonk(){
    let arg1 = $uName;
    let arg2 = $roomID;
    navigate(`/about/${arg1}/${arg2}`);
  
  }
</script>



<main>

  <h1 id="title">P2P Pong</h1>

  <Router {url}>
    <div>
      <Route path="/about/:arg1/:arg2" let:params><Game p_name={params.arg1} rm_id={params.arg2}/></Route>
      <Route path="/"><Home on:player_ready={bonk}/></Route>
    </div>
  </Router>

</main>

<style>

</style>
