import qmethod from './qmethod.js';

const dataset = [
    [0, -1, 0, 0, 0, 1, 1],  // S1
    [-1, 0, 0, 0, 0, 2, 1],  // S2
    [0, -1, -1, 1, 1, 0, -1], // S3
    [1, 0, 0, 2, 2, 0, 1],  // S4
    [2, 1, 0, 1, 1, 0, -1], // S5
    [2, 1, -2, -1, -2, 1, 1], // S6
    [0, -1, 1, -2, 2, 0, 0],  // S7
    [1, 1, -1, 1, -1, 0, 0],  // S8
    [0, 1, -1, -1, 0, 0, 0], // S9
    [0, 2, 0, 0, -2, 2, 2], // S10
    [1, 0, 2, 0, -1, -1, -2], // S11
    [-1, 2, 0, 0, -1, -1, 0], // S12
    [0, -1, -2, 0, 0, 0, -1],  // S13
    [1, 0, 1, 2, 1, -1, 0],  // S14
    [-1, 0, -1, -1, 0, -2, -2], // S15
    [-1, 0, 0, -1, 0, -2, -1], // S16
    [-2, -2, 2, 0, 0, -1, 2],  // S17
    [0, 0, 1, 1, 1, 1, 0],   // S18
    [-2, -2, 1, -2, -1, 1, 0]  // S19
];

const nfactors = 2

  const distribution = [
    ...Array(2).fill(-2), // Two -2s
    ...Array(4).fill(-1), // Four -1s
    ...Array(7).fill(0),  // Seven 0s
    ...Array(4).fill(1),  // Four 1s
    ...Array(2).fill(2)   // Two 2s
  ];

const qmethodResults = qmethod(dataset, nfactors, distribution);
// console.log(qmethodResults.brief.info.join("\n"));