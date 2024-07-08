'use client';

export async function isAnkiConnectRunning() {

    try {
        const r = await fetch('http://localhost:8765');
        return r.ok }

    catch (e) {
        return false
    }



}


export function invoke(action: string, version: number, params = {}) {
    return fetch('http://127.0.0.1:8765', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, version, params })
    })
    .then(response => response.json())
    .then(response => {
        if (Object.getOwnPropertyNames(response).length !== 2) {
            throw new Error('response has an unexpected number of fields');
        }
        if (!response.hasOwnProperty('error')) {
            throw new Error('response is missing required error field');
        }
        if (!response.hasOwnProperty('result')) {
            throw new Error('response is missing required result field');
        }
        if (response.error) {
            throw new Error(response.error);
        }
        return response.result;
    })
    .catch(error => {
        throw new Error(error.message || 'failed to issue request');
    });
}
