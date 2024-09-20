"use client";
import { tokenize, getTokenizer } from "kuromojin";
import { Button } from "@rewind-ui/core";
import { isAnkiConnectRunning, invoke } from "../utils/ankiConnect";
import { useState, useEffect } from "react";
import { Combobox, Input } from "@rewind-ui/core";
import { Carrois_Gothic_SC } from "next/font/google";
import { Modal, Table } from '@rewind-ui/core';


export default function Page() {
 

  const [isRunning, setRunning] = useState(false);
  const [deckArray, setDeckArray] = useState([]);
  const [currentDeck, setCurrentDeck] = useState('');
  const [noteArray, setNoteArray] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [fieldArray, setFieldArray] = useState([]);
  const [currentField, setCurrentField] = useState('');
  const [cardArr, setCardArr] = useState([]);
  const [cardCount, setCardCount] = useState(0);
  const [vocabSize, setVocabSize] = useState(0);
  
  const [vocabArr, setVocabArr] = useState<string[]>([]);
  const [refb, SetRefB] = useState(true);
  const [text, setText] = useState("");

  const [unknownWordCounts, setUnknownWordCounts] = useState<[string,number][]>([]);

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


  useEffect(() => { 
    
    if (typeof window !== "undefined") {
    const wordstorage = 0; //localStorage.getItem('wordCount')
    setVocabSize(wordstorage);
    const deckstorage = localStorage.getItem("deck") ?? '';
    setCurrentDeck(deckstorage);
    const notestorage = localStorage.getItem("note") ?? '';
    setCurrentNote(notestorage);
    const fieldstorage = localStorage.getItem("field") ?? '';
    setCurrentField(fieldstorage);
    const cardcount = 0; //localStorage.getItem('cardCount')});
    setCardCount(cardcount)
    }
  })


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

  useEffect(() => {
    if (isRunning) {
      const fetchDeckNames = async () => {
        const v = await invoke("deckNames", 6);
        setDeckArray(v);

        if (deckstorage && notestorage && fieldstorage) {
          refresh();
        }
      };

      const fetchNoteTypes = async () => {
        const v = await invoke("modelNames", 6);
        setNoteArray(v);
      };

      fetchDeckNames();
      fetchNoteTypes();
    }

    
    const deckstorage = localStorage.getItem("deck") || "";
    const notestorage = localStorage.getItem("note") || "";
    const fieldstorage = localStorage.getItem("field") || "";
  }, [isRunning]);

  useEffect(() => {
    const fetchFields = async () => {
      const v = await invoke("modelFieldNames", 6, { modelName: currentNote });
      setFieldArray(v);
      console.log(v);
    };

    fetchFields();
  }, [currentNote]);

  const refresh = async () => {
    SetRefB(false);
    const s = new Set<string>();
    console.log(`note:${currentNote} AND deck:${currentDeck}`);
    const cardIDs = await invoke("findCards", 6, {
      query: `"note:${currentNote}" AND "deck:${currentDeck}"`,
    });
    setCardArr(cardIDs);
    setCardCount(cardIDs.length);
    const data = await invoke("cardsInfo", 6, { cards: cardIDs });
    console.log(currentField);
    kuromoji
      .builder({ dicPath: "/dict" })
      .build(function (_err: any, tokenizer: any) {
        data.forEach((x: any) => {
          console.log(x);
          const sentence = x["fields"][currentField]["value"];
          var tokens = tokenizer.tokenize(sentence);
          tokens.forEach((token: any) => s.add(token["basic_form"]));
        });
        console.log(s.size);
        setVocabSize(s.size);
        setVocabArr(Array.from(s));

        console.log(vocabArr);
        SetRefB(true);

       //  localStorage.setItem("wordCount", vocabSize);
        localStorage.setItem("deck", currentDeck);
        localStorage.setItem("note", currentNote);
        localStorage.setItem("field", currentField);
        // localStorage.setItem("cardCount", cardCount);

        console.log(tokenizer.tokenize("だ"));
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
        let x=0;
        
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
              var tokens = tokenizer.tokenize(e.target ? e.target.result : '');
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

  return (
    <div className="flex justify-between items-center h-screen">
      <div>



        {isRunning ? (
          <i>Ankiconnect found! </i>
        ) : (
          <i>Waiting for AnkiConnect...</i>
        )}

        <div>
          <label>Select a deck: </label>
          {isRunning ? (
            <Combobox
              searchable={false}
              clearable={false}
              placeholder="Select a deck type..."
              radius="base"
              size="sm"
              withRing={false}
              initialValue={currentDeck}
              style={{ width: "320px" }}
              onChange={(value: string) => {
                if (value) setCurrentDeck(value);
              }}
            >
              {deckArray.map((deck) => (
                <Combobox.Option
                  key={deck}
                  value={deck}
                  label={deck}
                ></Combobox.Option>
              ))}
            </Combobox>
          ) : (
            <Combobox
              key="d"
              disabled={true}
              searchable={false}
              clearable={false}
              placeholder="Select a deck type..."
              radius="base"
              size="sm"
              withRing={false}
              style={{ width: "320px" }}
            />
          )}
        </div>
        <div>
          <label>Select a note type: </label>

          {isRunning ? (
            <Combobox
              searchable={false}
              clearable={false}
              placeholder="Select a note type..."
              radius="base"
              size="sm"
              withRing={false}
              initialValue={currentNote}
              style={{ width: "320px" }}
              onChange={(value: string) => {
                if (value) setCurrentNote(value);
              }}
            >
              {noteArray.map((note) => (
                <Combobox.Option
                  key={note}
                  value={note}
                  label={note}
                ></Combobox.Option>
              ))}
            </Combobox>
          ) : (
            <Combobox
              key="n"
              disabled={true}
              placeholder="Select a note type..."
              radius="base"
              size="sm"
              style={{ width: "320px" }}
            />
          )}
        </div>
        <div>
          <label>Sentence field: </label>

          {isRunning ? (
            <Combobox
              searchable={false}
              clearable={false}
              placeholder="Select a field type..."
              radius="base"
              size="sm"
              withRing={false}
              initialValue={currentField}
              style={{ width: "320px" }}
              onChange={(value: string) => {
                if (value) setCurrentField(value);
              }}
            >
              {fieldArray.map((note) => (
                <Combobox.Option
                  key={note}
                  value={note}
                  label={note}
                ></Combobox.Option>
              ))}
            </Combobox>
          ) : (
            <Combobox
              key="f"
              disabled={true}
              searchable={false}
              clearable={false}
              placeholder="Select a field type..."
              radius="base"
              size="sm"
              withRing={false}
              initialValue={currentDeck}
              style={{ width: "320px" }}
            />
          )}
        </div>

        <div>
          <Button
            color="black"
            shadow="base"
            radius="sm"
            size="sm"
            className="my-2 border-2 border-white"
            onClick={refresh}
            loading={!refb}
            disabled={!isRunning}
          >
            REFRESH
          </Button>
        </div>

        <div>
          <Button
            color="black"
            shadow="base"
            radius="sm"
            size="sm"
            className="my-2 border-2 border-white"
            onClick={compare}
          >
            COMPARE WITH TEXT
          </Button>
          <input
            className="block w-max h-max text-black"
            onChange={(e) => setText(e.target.value)}
          ></input>
       <p>
            {knownWordsTextU} out of {totalWordsTextU} unique words known! (
            {Math.round((knownWordsTextU / totalWordsTextU) * 100)}%)
          </p>
          <p>
            {knownWordsText} out of {totalWordsText} words known! (
            {Math.round((knownWordsText / totalWordsText) * 100)}%)
          </p>
          <Input
            size="sm"
            type="file"
            placeholder="file"
            multiple
            onChange={processFiles}
          />
          <p>
            {knownWordsFilesU} out of {totalWordsFilesU} unique words known! (
            {Math.round((knownWordsFilesU / totalWordsFilesU) * 100)}%)
          </p>
          <p>
            {knownWordsFiles} out of {totalWordsFiles} words known! (
            {Math.round((knownWordsFiles / totalWordsFiles) * 100)}%)
          </p>
          
        </div>
      </div>
      <div className="flex justify-center items-center flex-col">
      <div className="flex justify-center items-center flex-col">
        <div className="w-64 h-64 bg-transparent border-4 border-white rounded-full flex flex-col justify-center items-center space-y-2">
          <span className="text-white font-bold">{cardCount} cards found!</span>
          <span className="text-white font-bold">{vocabSize} words known!</span>
        </div>
        <>
      <Modal size="md" open={open} onClose={() => setOpen(false)}>
      <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Word</Table.Th>
          <Table.Th>Count</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>

        {unknownWordCounts.map((p, index) => (
            <Table.Tr key={index}>
                        <Table.Td>{p[0]}</Table.Td>
                        <Table.Td align="center">{p[1]}</Table.Td>
            </Table.Tr>
          ))}
      </Table.Tbody>
      <Table.Tfoot>

        
      </Table.Tfoot>
    </Table>
      </Modal>

      <Button         color="black"
            shadow="base"
            radius="sm"
            size="sm"
            className="my-2 border-2 border-white mt-6" onClick={() => setOpen(true)}>Open text frequency list</Button>
    </>
    </div>

        <div>
        </div>
         </div>
    </div>
  );
}
