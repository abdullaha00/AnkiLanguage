import { Combobox } from "@rewind-ui/core";

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
  const handleChange = (value: string | string[] | null | undefined) => {
    if (typeof value !== "string" || value === currentDeck) return;

    setTimeout(() => onDeckChange(value), 0);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Select a deck</label>
      <Combobox
        disabled={!isRunning}
        searchable={true}
        clearable={false}
        placeholder="Select a deck type..."
        radius="base"
        size="sm"
        withRing={false}
        initialValue={currentDeck}
        style={{ width: "320px" }}
        onChange={handleChange}
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
