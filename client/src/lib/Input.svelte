<script>
    import { onMount } from 'svelte';
    import {uName, roomID, state} from './stores.js';
    import {createEventDispatcher} from 'svelte';
    
    let name = "";
    let id = "";
    const dispatch = createEventDispatcher();
    function clickHandler(){
        uName.set(name);
        roomID.set(id);
        state.set(1);

        dispatch('player_ready');
        
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
