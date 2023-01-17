<script lang="ts">
    import APIBaseProvider from "./APIBaseProvider.svelte";

    export let me = false, id = me ? 'me' : undefined, load = true;
</script>

<APIBaseProvider type="account" endpoint="/user/{me ? 'me' : `find/${id}`}" {id} let:account let:store ignore {load}>
    <slot {account} {store}/>
</APIBaseProvider>
