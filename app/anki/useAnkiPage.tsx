"use client";
import { isAnkiConnectRunning, invoke } from "../utils/ankiConnect";
import { useState, useEffect } from "react";

export default function useAnkiPage() {
  const [isRunning, setRunning] = useState(false);
  const [deckArray, setDeckArray] = useState([]);
  const [currentDeck, setCurrentDeck] = useState("");
  const [noteArray, setNoteArray] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [fieldArray, setFieldArray] = useState([]);
  const [currentField, setCurrentField] = useState("");
  const [cardArr, setCardArr] = useState([]);
  const [cardCount, setCardCount] = useState(0);
  const [vocabSize, setVocabSize] = useState(0);

  const [vocabArr, setVocabArr] = useState<string[]>([]);
  const [refb, SetRefB] = useState(true);
  const [text, setText] = useState("");

  const [unknownWordCounts, setUnknownWordCounts] = useState<[string, number][]  >([]);

  const [knownWordsFilesU, setKnownWordsFilesU] = useState(0);
  const [totalWordsFilesU, setTotalWordsFilesU] = useState(0);

  const [knownWordsFiles, setKnownWordsFiles] = useState(0);
  const [totalWordsFiles, setTotalWordsFiles] = useState(0);

  const [knownWordsTextU, setKnownWordsTextU] = useState(0);
  const [totalWordsTextU, setTotalWordsTextU] = useState(0);

  const [knownWordsText, setKnownWordsText] = useState(0);
  const [totalWordsText, setTotalWordsText] = useState(0);

  const [open, setOpen] = useState(false);

  const kuromoji = require("kuromoji");

  // debugging
  useEffect(() => {
    console.log("current deck set to:" + currentDeck);
  }, [currentDeck]);

 
  const s = new Set();

  const check = async () => {
    const s = await isAnkiConnectRunning();
    setRunning(s);
  };

  useEffect(() => {
    setInterval(check, 3000);
  }, []);


  // execute when AnkiConnect found
  useEffect(() => {
    if (isRunning) {

      // pull deck, note, field
      const deckstorage = localStorage.getItem("deck");
      if (deckstorage) 
        { setCurrentDeck(deckstorage);
          console.log(`pulled value ${deckstorage} from localstorage, updating deck!`);
          } 

      const notestorage = localStorage.getItem("note") ?? "";
      setCurrentNote(notestorage);
      console.log(`current note set to [${notestorage}] after localstorage pull`);

      const fieldstorage = localStorage.getItem("field") ?? "";
      setCurrentField(fieldstorage);
      console.log(`current field set to [${notestorage}] after localstorage pull`);
      
      // auto-refresh if all 3 included
      if (deckstorage && notestorage && fieldstorage) {
        //refresh(); 
      }

      // get list of deck name
      const fetchDeckNames = async () => {
        const v = await invoke("deckNames", 6);
        setDeckArray(v);
      };

      // get list of note types
      const fetchNoteTypes = async () => {
        const v = await invoke("modelNames", 6);
        setNoteArray(v);
      };

      fetchDeckNames();
      fetchNoteTypes();
    }
  }, [isRunning]);


  // currentNote changes -> refresh the sentence fields
  useEffect(() => {
    const fetchFields = async () => {
      const v = await invoke("modelFieldNames", 6, { modelName: currentNote });
      if (v) setFieldArray(v);
    };

    fetchFields();
  }, [currentNote]);

  // 
  const refresh = async () => {
    SetRefB(false);
    const s = new Set<string>();
    //console.log(`note:${currentNote} AND deck:${currentDeck}`);
    const cardIDs = await invoke("findCards", 6, {
      query: `"note:${currentNote}" AND "deck:${currentDeck}"`,
    });
    setCardArr(cardIDs);
    setCardCount(cardIDs.length);
    const data = await invoke("cardsInfo", 6, { cards: cardIDs });
   // console.log(currentField);
    kuromoji
      .builder({ dicPath: "/dict" })
      .build(function (_err: any, tokenizer: any) {
        data.forEach((x: any) => {
          //console.log(x);
          const sentence = x["fields"][currentField]["value"];
          var tokens = tokenizer.tokenize(sentence);
          tokens.forEach((token: any) => s.add(token["basic_form"]));
        });
       // console.log(s.size);
        setVocabSize(s.size);
        setVocabArr(Array.from(s));

       // console.log(vocabArr);
        SetRefB(true);

        localStorage.setItem("deck", currentDeck);
        console.log(`Updating localstorage deck to: ${currentDeck}`)
        localStorage.setItem("note", currentNote);
        localStorage.setItem("field", currentField);

      });
  };


  
  const compare = async () => {
    const s2 = new Set();
    const textArray = new Array<string>();

    kuromoji
      .builder({ dicPath: "/dict" })
      .build(function (_err: any, tokenizer: any) {
        var tokens = tokenizer.tokenize(text);
        tokens.forEach((token: any) => {
          if (
            token["word_type"] == "KNOWN" &&
            token["pos_detail_2"] != "人名" &&
            token["pos"] != "記号" &&
            token["pos"] != "一般"
          ) {
            s2.add(token["basic_form"]);
            textArray.push(token["basic_form"]);

            if (token["basic_form"] == "後藤") console.log(token);
          }
        });

        const s3 = new Set();
        const intersectionArray = new Array();

        const countU: { [key: string]: number } = {};

        for (let w of vocabArr) {
          if (s2.has(w)) {
            s3.add(w);
          }
        }
        let x = 0;

        for (let w of textArray) {
          if (vocabArr.includes(w)) {
            x++;
          } else {
            if (countU[w]) {
              countU[w]++;
            } else {
              countU[w] = 1;
            }
          }
        }

        const countUA = Object.entries(countU);
        countUA.sort((a, b) => a[1] - b[1]).reverse();
        setUnknownWordCounts(countUA);

        console.log(s2);
        console.log(s2);
        console.log(countU);
        setTotalWordsTextU(s2.size);
        setKnownWordsTextU(s3.size);
        setTotalWordsText(textArray.length);
        setKnownWordsText(x);
        console.log(textArray);
        console.log(countUA);
      });
  };

  const processFiles = async (f: React.ChangeEvent<HTMLInputElement>) => {
    const s2 = new Set<string>();
    const textArray = new Array();
    kuromoji
      .builder({ dicPath: "/dict" })
      .build(async (_err: any, tokenizer: any) => {
        const processFile = (file: Blob) => {
          return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = (e) => {
              var tokens = tokenizer.tokenize(e.target ? e.target.result : "");
              console.log(tokens);
              tokens.forEach((token: any) => {
                if (
                  token["word_type"] == "KNOWN" &&
                  token["pos_detail_2"] != "人名" &&
                  token["pos"] != "記号" &&
                  token["pos"] != "一般"
                ) {
                  s2.add(token["basic_form"]);
                  textArray.push(token["basic_form"]);

                  if (token["basic_form"] == "後藤") console.log(token);
                }
              });

              console.log(s2);
              resolve("done");
            };
            reader.readAsText(file);
          });
        };

        const a = Array.from((f.target as HTMLInputElement).files ?? []);

        for (let i = 0; i < a.length; i++) {
          console.log(a[i]);
          await processFile(a[i]);
        }

        console.log("s");
        console.log(s2);

        const s3 = new Set();
        const intersectionArray = new Array();

        const countU: { [key: string]: number } = {};

        for (let w of vocabArr) {
          if (s2.has(w)) {
            s3.add(w);
          }
        }

        let x = 0;

        for (let w of textArray) {
          if (vocabArr.includes(w)) {
            x++;
          } else {
            if (countU[w]) {
              countU[w]++;
            } else {
              countU[w] = 1;
            }
          }
        }

        const countUA = Object.entries(countU);
        countUA.sort((a, b) => a[1] - b[1]).reverse();
        setUnknownWordCounts(countUA);

        console.log(s2);
        console.log(s2);
        console.log(countU);
        setTotalWordsFilesU(s2.size);
        setKnownWordsFilesU(s3.size);
        setTotalWordsFiles(textArray.length);
        setKnownWordsFiles(x);
        console.log(textArray);
        console.log(countUA);
      });
  };

  return {
    isRunning,
    deckArray,
    currentDeck,
    setCurrentDeck,
    noteArray,
    currentNote,
    setCurrentNote,
    fieldArray,
    currentField,
    setCurrentField,
    cardCount,
    vocabSize,
    refb,
    text,
    setText,
    unknownWordCounts,
    knownWordsFilesU,
    totalWordsFilesU,
    knownWordsFiles,
    totalWordsFiles,
    knownWordsTextU,
    totalWordsTextU,
    knownWordsText,
    totalWordsText,
    open,
    setOpen,
    refresh,
    compare,
    processFiles,
  };
}
