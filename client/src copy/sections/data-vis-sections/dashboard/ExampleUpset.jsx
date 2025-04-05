import React, { useMemo, useState } from 'react';
import { extractCombinations, UpSetJS } from '@upsetjs/react';

export default function ExampleGettingStarted() {
  const [selection, setSelection] = React.useState(null);
  const sets = useMemo(
      () => [
        { name: 'A', sets: ['S1', 'S2'] },
        { name: 'B', sets: ['S1'] },
        { name: 'C', sets: ['S2'] },
        { name: 'D', sets: ['S1', 'S3'] },
      ],
      []
    );
  const combinations = useMemo(
    () => ({
      limit: 10,
    }),
    []
  );
  return (
    <UpSetJS
      sets={sets}
      width={780}
      height={400}
      selection={selection}
      onHover={setSelection}
      combinations={combinations}
    />
  );
}