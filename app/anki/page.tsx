"use client";
import { Button } from "@rewind-ui/core";
import { Combobox, Input } from "@rewind-ui/core";
import { Modal, Table } from "@rewind-ui/core";
import DeckSelector from "./components/DeckSelector";
import HelpTooltip from "./components/HelpTooltip";
import useAnkiPage from "./useAnkiPage";

export default function Page() {
  const {
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
  } = useAnkiPage();

  return (
    <div className="flex justify-between items-center h-screen">
      <div>
        <div className="flex gap-2">
        {isRunning ? (
          <i>Ankiconnect found! </i>
        ) : (
          <i>Waiting for AnkiConnect...</i>
          
        )}  <HelpTooltip/>      
        </div>


        {(
          <DeckSelector
            isRunning={isRunning}
            onDeckChange={setCurrentDeck}
            deckArray={deckArray}
            currentDeck={currentDeck}
          />
        )}
        <div>
          <label>Select a note type: </label>

          {(
            <Combobox
              searchable={false}
              clearable={false}
              disabled={!isRunning}
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
          )}
        </div>
        <div>
          <label>Sentence field: </label>

            <Combobox
              disabled={!isRunning}
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
            <span className="text-white font-bold">
              {cardCount} cards found!
            </span>
            <span className="text-white font-bold">
              {vocabSize} words known!
            </span>
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
                <Table.Tfoot></Table.Tfoot>
              </Table>
            </Modal>

            <Button
              color="black"
              shadow="base"
              radius="sm"
              size="sm"
              className="my-2 border-2 border-white mt-6"
              onClick={() => setOpen(true)}
            >
              Open text frequency list
            </Button>
          </>
        </div>

        <div></div>
      </div>
    </div>
  );
}
