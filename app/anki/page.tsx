'use client'
import {tokenize, getTokenizer} from "kuromojin";

import { isAnkiConnectRunning, invoke } from "../utils/ankiConnect";
import { useState, useEffect } from 'react'

export default function Page() {

    const [isRunning, setRunning] = useState(false);
    const [deckNames, setDeckArray] = useState([]);
    const [currentDeck, setCurrentDeck] = useState('');
    const [noteTypes, setNoteTypes] = useState([]);
    const [currentNote, setCurrentNote] = useState('Basic');
    const [fields, setFields] = useState([]);
    const [currentField, setCurrentField] = useState('');
    const [cardArr, setCardArr] = useState([]);
    const [vocabSize, setVocabSize] = useState(0);
    const [knownWordCount, setKnownWordCount] = useState(0);
    const [totalWordCount, setTotalWordCount] = useState(0);
    const [vocabArr, setVocabArr] = useState<string[]>([]);
    const [text, setText] = useState('')
    
    const kuromoji = require('kuromoji');
    

    const s = new Set();

    const check = async () => {

        const s = await isAnkiConnectRunning();
        setRunning(s);
    }

    useEffect ( () => {setInterval(check, 3000)},[])
    
    useEffect(() => {

        if (isRunning) {

            const fetchDeckNames = async () => {
                const v = await invoke('deckNames', 6);
                setDeckArray(v);
        }

        const fetchNoteTypes = async () => {
            const v = await invoke('modelNames', 6);
            setNoteTypes(v);
            console.log(v);
    }


            fetchDeckNames();
            fetchNoteTypes();
    }


    }, [isRunning])

    useEffect(() => {


        const fetchFields= async () => {
            const v = await invoke('modelFieldNames', 6, {"modelName":currentNote});
            setFields(v);
            console.log(v);
    }

    fetchFields();


    }, [currentNote])

    const refresh = async () => {
        const s = new Set<string>()
        console.log(`note:${currentNote} AND deck:${currentDeck}`)
        const cardIDs = await invoke('findCards', 6, { query: `"note:${currentNote}" AND "deck:${currentDeck}"` });
        setCardArr(cardIDs);
        const data = await invoke('cardsInfo', 6, { cards: cardIDs });
        console.log(currentField)
        kuromoji.builder({ dicPath: "/dict" }).build(function (_err: any, tokenizer: any) {
            
            
            data.forEach((x:any) => {
                console.log(x)
                const sentence = x["fields"][currentField]["value"]
                var tokens = tokenizer.tokenize(sentence);
                tokens.forEach((token: any) => s.add(token['basic_form']))
            })
            console.log(s.size);
            setVocabSize(s.size);
            setVocabArr(Array.from(s))


            console.log(vocabArr)

        });
     

    }

    const compare = async () => {
        const s2= new Set<string>();
        kuromoji.builder({ dicPath: "/dict" }).build(function (_err: any, tokenizer: any) {
            var tokens = tokenizer.tokenize(text);
            tokens.forEach((token: any) => s2.add(token['basic_form']))
        console.log(s)
        console.log(tokenizer.tokenize("私"))
        console.log(s2)
        setTotalWordCount(s2.size)
        
        const s3 = new Set();
        for (let id of vocabArr) {

            if (s2.has(id)) {

                s3.add(id);
            }

        }
        console.log(s3)

        setKnownWordCount(s3.size)  
        
 
        }
        )
        }

        

    return ( 
        
        <div className="mx-20">
            {isRunning ? <i>Ankiconnect found! </i> : <i>Waiting for AnkiConnect...</i>}
              <div>
              <label>Select a deck: </label>

            <select className="block text-black" onChange={e => {setCurrentDeck(e.target.value); console.log(e.target.value)}}>
                {deckNames.map((deck, _index) => (<option className="text-black" value={deck}>
                    {deck}
                    </option>))}
            </select>
              </div>
              <div>
              <label>Select a note type: </label>

            <select className="block text-black" onChange={e => {setCurrentNote(e.target.value); console.log(e.target.value)}}>
                {noteTypes.map((noteType, _index) => (<option className="text-black" value={noteType}>
                    {noteType}
                    </option>))}
            </select>
              </div> 
              <div>
              <label>Sentence field: </label>

            <select className="block text-black" onChange={e => {setCurrentField(e.target.value); console.log(e.target.value)}}>
                {fields.map((field, _index) => (<option className="text-black" value={field}>
                    {field}
                    </option>))}
            </select>
              </div>
            
            <div>
            <button onClick={refresh}>REFRESH</button>
                <p>{cardArr.length} cards found!</p>
                <p>{vocabSize} words known!</p>
            </div>

            <div>
            <button onClick={compare}>COMPARE WITH  TEXT</button>
            <input className="block w-max h-max text-black" onChange={e => setText(e.target.value)}></input>
                <p>{knownWordCount} out of {totalWordCount} words known! ({Math.round(knownWordCount/totalWordCount * 100)}%)</p>
            </div>
        </div>
        
    );
}