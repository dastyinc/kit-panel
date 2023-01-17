import type {Readable, Subscriber} from "svelte/store";
import {get, writable} from "svelte/store";
import {browser} from "$app/environment";

export function filterStore(store: Readable<any>, filter: (value: any) => boolean) {
    return {
        ...store,
        subscribe: (run: Subscriber<any>, invalidate?: (arg0: any) => void) => {
            return store.subscribe((value, ...params) => {
                if (filter(value)) run(value, ...params);
            }, invalidate);
        }
    };
}

export function makeStoreNotNull(store: Readable<any>) {
    return filterStore(store, (value) => value !== null && value !== undefined);
}

export function filterStoreType(store: Readable<any>, type: string) {
    return filterStore(store, (value) => value && value.type === type);
}

export function wsStore(store: Readable<any>, type: string, ignoreUid = null) {
    return filterStore(store, (value) => value && value.type === type && value.id !== ignoreUid);
}

export function savable(name: string, defaultValue: any = null) {
    const store = writable(browser ? JSON.parse(localStorage[name] || JSON.stringify(defaultValue)) : defaultValue);
    store.subscribe(val => browser && (localStorage[name] = JSON.stringify(val)))
    return store;
}

