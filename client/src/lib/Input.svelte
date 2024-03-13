<script>
    import { onMount } from 'svelte';
    import {uName, roomID, state} from './stores.js'

    
    let name = "";
    let id = "";
    function clickHandler(){
        uName.set(name);
        roomID.set(id);
        state.set(1);
    }
</script>

<div>
    <div>Enter Name</div>
    <input bind:value={name}>
    
    <div>Insert RoomID</div>
    <input bind:value={id}>
    
    <div>
      <button on:click={clickHandler}>Submit</button>
    </div>


</div>
