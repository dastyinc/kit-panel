<script lang="ts">
    import {setContext} from 'svelte';
    import api from "$lib/utils/api";
    import throttle from "$lib/utils/throttle";
    import ws from "$lib/utils/ws";
    import {wsStore} from "$lib/utils/store";
    import Box from "$lib/Box";

    export let account;

    setContext('channel', 'test');
    setContext('account', account);
    setContext('utils', {
        api, throttle, ws, wsStore
    });
</script>

<main>
    <nav>
        <Box blur background="radial-gradient(circle at 0 0, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4) 128%)"
             style="margin-bottom: 10px; padding: 1.5rem 1.875rem 1.875rem 1.875rem;">
            <slot/>
        </Box>
    </nav>
</main>

<style lang="scss">
  main {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    nav {
      width: 21.8%;
      max-width: 26.25rem;
      min-width: 23.75rem;
      max-height: 88%;
      overflow-y: auto;
    }
  }
</style>
