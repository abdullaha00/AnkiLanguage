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
  } = useAnkiPage();

  const deferStateUpdate = (update: () => void) => {
    setTimeout(update, 0);
  };

  const formatPercent = (known: number, total: number) =>
    total ? `${Math.round((known / total) * 100)}%` : "0%";

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl gap-6 py-8 lg:grid-cols-[1.4fr_0.9fr]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Anki vocabulary analysis
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Select an Anki deck and sentence field, and extract known vocabulary.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span
              className={
                isRunning
                  ? "rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
                  : "rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
              }
            >
              {isRunning ? "AnkiConnect found" : "Waiting for AnkiConnect"}
            </span>
            <HelpTooltip />
          </div>

          <div className="grid gap-4">
            <DeckSelector
              isRunning={isRunning}
              onDeckChange={setCurrentDeck}
              deckArray={deckArray}
              currentDeck={currentDeck}
            />

            <div>
              <label className="mb-1 block text-sm font-medium">
                Select a note type
              </label>
              <Combobox
                searchable={true}
                clearable={false}
                disabled={!isRunning}
                placeholder="Select a note type..."
                radius="base"
                size="sm"
                withRing={false}
                initialValue={currentNote}
                style={{ width: "320px" }}
                onChange={(value: string | string[] | null | undefined) => {
                  if (typeof value === "string" && value !== currentNote) {
                    deferStateUpdate(() => setCurrentNote(value));
                  }
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
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Sentence field
              </label>
              <Combobox
                disabled={!isRunning}
                searchable={true}
                clearable={false}
                placeholder="Select a field type..."
                radius="base"
                size="sm"
                withRing={false}
                initialValue={currentField}
                style={{ width: "320px" }}
                onChange={(value: string | string[] | null | undefined) => {
                  if (typeof value === "string" && value !== currentField) {
                    deferStateUpdate(() => setCurrentField(value));
                  }
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

            <Button
              color="black"
              shadow="base"
              radius="sm"
              size="sm"
              className="w-fit border-2 border-white"
              onClick={refresh}
              loading={!refb}
              disabled={!isRunning || !currentDeck || !currentNote || !currentField}
            >
              Refresh vocabulary profile
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Compare new text</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste sample text to display readability estimates.
          </p>

          <div className="mt-4 grid gap-4">
            <input
              className="block w-full rounded-md border bg-background px-3 py-2 text-foreground"
              placeholder="Paste Japanese text here"
              onChange={(e) => setText(e.target.value)}
            ></input>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                color="black"
                shadow="base"
                radius="sm"
                size="sm"
                className="border-2 border-white"
                onClick={compare}
                disabled={!text.trim()}
              >
                Compare with pasted text
              </Button>
              <Input
                size="sm"
                type="file"
                placeholder="file"
                multiple
                onChange={processFiles}
              />
            </div>

            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-xl border p-4">
                <p className="font-medium">Pasted text</p>
                <p className="mt-2 text-muted-foreground">
                  {knownWordsTextU} / {totalWordsTextU} unique words known ({formatPercent(knownWordsTextU, totalWordsTextU)})
                </p>
                <p className="text-muted-foreground">
                  {knownWordsText} / {totalWordsText} total words known ({formatPercent(knownWordsText, totalWordsText)})
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="font-medium">Uploaded files</p>
                <p className="mt-2 text-muted-foreground">
                  {knownWordsFilesU} / {totalWordsFilesU} unique words known ({formatPercent(knownWordsFilesU, totalWordsFilesU)})
                </p>
                <p className="text-muted-foreground">
                  {knownWordsFiles} / {totalWordsFiles} total words known ({formatPercent(knownWordsFiles, totalWordsFiles)})
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="flex flex-col items-center justify-center rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex h-64 w-64 flex-col items-center justify-center rounded-full border-4 border-primary/20 bg-primary/5 text-center">
          <span className="text-4xl font-semibold">{cardCount}</span>
          <span className="text-sm text-muted-foreground">cards found</span>
          <span className="mt-4 text-4xl font-semibold">{vocabSize}</span>
          <span className="text-sm text-muted-foreground">known words</span>
        </div>

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
          className="mt-6 border-2 border-white"
          onClick={() => setOpen(true)}
        >
          Open text frequency list
        </Button>
      </aside>
    </div>
  );
}
