import { Combobox, Input } from "@rewind-ui/core";

interface DeckSelectorProps {
  deckArray: string[];
  currentDeck: string;
  isRunning: boolean;
  onDeckChange: (value: string) => void;
}

export default function DeckSelector({
  deckArray,
  currentDeck,
  isRunning,
  onDeckChange,
}: DeckSelectorProps) {
  console.log(`rendering with initialvalue = ${currentDeck}`);
  return (
    <div>
      <label>Select a deck: </label>
      <Combobox
        disabled={!isRunning}
        searchable={false}
        clearable={false}
        placeholder="Select a deck type..."
        radius="base"
        size="sm"
        withRing={false}
        initialValue={currentDeck}
        style={{ width: "320px" }}
        onChange={(value: string) =>
          value !== currentDeck && onDeckChange(value)
        }
      >
        {deckArray.map((deck) => (
          <Combobox.Option
            key={deck}
            value={deck}
            label={deck}
          ></Combobox.Option>
        ))}
      </Combobox>
    </div>
  );
}
