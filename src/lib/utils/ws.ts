import ReconnectingWebSocket from 'reconnecting-websocket';
import {writable, readable} from "svelte/store";
import type {Writable, Readable} from "svelte/store";
import {wsUrl} from "./api";
import {makeStoreNotNull, wsStore} from "./store";
import {ws as wsModule} from "@dastyinc/typed";

interface wsWrapper {
    ws: ReconnectingWebSocket;
    uid: string;
    message: Readable<any>;
    error: Readable<any>;
    send: (data: any) => any;
    close: () => any;
    unsubscribe: () => any;
}

interface wsConn extends Promise<wsWrapper> {
    conn: any;
}

const pending = new Map<string, wsConn>();
const stores = new Map<string, wsWrapper>();
const count = new Map<string, number>();
const pingTimeouts = new Map<string, number>();


function setPingTimeout(id: string, closeWs: any) {
    clearTimeout(pingTimeouts.get(id));
    pingTimeouts.set(id, <any>setTimeout(() => {
        closeWs();
    }, 4000));
}

export default function (channel: string, type?: string) {
    const id = type ? channel + ':' + type : channel;
    count.set(id, (count.get(id) || 0) + 1);

    if (pending.has(id)) return pending.get(id);
    const pr = new Promise<wsWrapper>((resolve, reject) => {
        if (stores.has(id)) {
            resolve(<wsWrapper>stores.get(id));
            return;
        }

        const ws = new ReconnectingWebSocket(wsUrl(channel) + (type ? '?virtual=1&type=' + type : ''));
        ws.binaryType = "arraybuffer";

        const disconnected = writable(false);

        ws.addEventListener('open', () => {
            disconnected.set(false);
        });
        ws.addEventListener('close', () => {
            disconnected.set(true);
        });

        const message = makeStoreNotNull(readable(<any>null, (set) => {
            const handler = async (e) => {
                const res = await wsModule.decode(new Uint8Array(e.data));
                if (import.meta.env.DEV && res.type !== 'PING') console.log(`WS Message (${res.type}) : `, res.data)
                set(res);
            };

            ws.addEventListener('message', handler);

            return () => {
                unsubscribe();
                ws.removeEventListener('message', handler);
            }
        }));

        const error = readable(<any>null, (set) => {
            ws.addEventListener('error', (e) => {
                set(e);
            });
        });

        const send = (type: string, data?: any) => {
            if (import.meta.env.DEV && type !== 'PING') console.log(`WS Send (${type}) : `, data)
            ws.send(wsModule.encode(type, data));
        }
        const reconnect = async () => {
            disconnected.set(true);
            ws.addEventListener('message', uidReader);
            ws.reconnect();
        }
        const unsubscribe = () => {
            count.set(id, (count.get(id) || 0) - 1);
            if (count.get(id) === 0) {
                ws.close();
                stores.delete(id);
                pending.delete(id);
            }
        }

        const uidReader = async (e: MessageEvent) => {
            const {data, type} = await wsModule.decode(new Uint8Array(e.data));
            if (type === "CONNECT") {
                const uid = data.id;
                ws.removeEventListener('message', uidReader);
                const res = {ws, message, error, send, close, uid, unsubscribe, disconnected};
                stores.set(id, res);
                setPingTimeout(id, () => {
                    reconnect();
                });
                resolve(res);
            }
            if (type === "ERROR") {
                reject(data);
            }
        }

        wsStore(message, 'PING').subscribe(() => {
            send("PING");
            setPingTimeout(id, () => {
                reconnect();
            });
        });

        ws.addEventListener('message', uidReader);
    });

    const res = {
        ...pr,
        conn: (handler: any, errorHandler?: any) => {
            let unsub: () => any;
            pr.then((res) => {
                unsub = res.unsubscribe;
                handler(res)?.then()
            }).catch(errorHandler);
            return () => unsub && unsub();
        },
    }

    pending.set(id, res);
    return res;
}
