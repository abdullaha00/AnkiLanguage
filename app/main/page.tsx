'use client'

import { isAnkiConnectRunning, invoke } from "../ankiConnect";
import { useState, useEffect } from 'react'

export default function Page() {

    const [isRunning, setRunning] = useState(false);
    const [deckNames, setDeckArray] = useState([]);

    const check = async () => {

        const s = await isAnkiConnectRunning();
        setRunning(s);
    }

    useEffect ( () => {setInterval(check, 3000)},[])
    
    useEffect(() => {

        if (isRunning) {

            const v = invoke('deckNames', 6);
            setDeckArray(v);
            console.log(v);
        }

    }, [isRunning])

    return ( 
        
        <div className="mx-48">
            {isRunning ? <i>Ankiconnect found! {deckNames} </i> : <i>f</i>}

        </div>
    );
}