import type {Readable, Subscriber} from "svelte/store";
import {get, writable} from "svelte/store";

export function filterStore(store: Readable<any>, filter: (value: any) => boolean, map = (i: any) => i) {
    return {
        ...store,
        subscribe: (run: Subscriber<any>, invalidate?: (arg0: any) => void) => {
            return store.subscribe((value, ...params) => {
                if (filter(value)) run(map(value), ...params);
            }, invalidate);
        }
    };
}

export function makeStoreNotNull(store: Readable<any>) {
    return filterStore(store, (value) => value !== null && value !== undefined);
}

export function filterStoreType(store: Readable<any>, type: string, map?: any) {
    return filterStore(store, (value) => value && value.type === type, map);
}

export function wsStore(store: Readable<any>, type: string, ignoreUid = null) {
    return filterStore(store, (value) => value && value.type === type && value.id !== ignoreUid, i => i.data);
}

export function savable(name: string, defaultValue: any = null) {
    const store = writable(JSON.parse(localStorage[name] || JSON.stringify(defaultValue)));
    store.subscribe(val => (localStorage[name] = JSON.stringify(val)))
    return store;
}