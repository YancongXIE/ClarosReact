
export default function qzscores(dataset, nfactors, flagged, loa,  forced = true, distribution = null) {
    // Validation checks
    const nstat = dataset.length; // number of statements
    const nqsorts = dataset[0].length; // number of Q-sorts

    // console.log(loa)
    // A. select FLAGGED Q sorts
    const floa = flagged.map((row, i) => row.map((flag, j) => flag ? loa[i][j] : 0));
  
    // B. calculate FACTOR WEIGHTS for each Q sort
    const fwe = floa.map((col, j) => col.map(val => val / (1 - val ** 2)));
  
    // C. calculate Z-SCORES for each sentence and factor
    const wraw_all = [];
    for (let f = 0; f < nfactors; f++) {
        const weights = fwe.map(row => row[f]); // 当前因子的权重
        wraw_all[f] = dataset.map(statement => 
            statement.map((val, q) => val * weights[q]) // 加权
        );
    }

// -- sums, average, and stdev for each statement
// -- sums, average, and stdev for each statement
const zsc_sum = new Array(nstat).fill().map(() => new Array(nfactors).fill(0));
const zsc_mea = new Array(nstat).fill().map(() => new Array(nfactors).fill(0));
const zsc_std = new Array(nstat).fill().map(() => new Array(nfactors).fill(0));

for (let f = 0; f < nfactors; f++) {
    // 计算所有 rowSums
    const allRowSums = wraw_all[f].map(row => row.reduce((a, b) => a + b, 0));

    // 计算所有 rowSums 的均值（和 R 的 mean(rowSums(...)) 计算方式一致）
    const overallMean = allRowSums.reduce((a, b) => a + b, 0) / allRowSums.length;

    // 计算所有 rowSums 的标准差（和 R 的 sd(rowSums(...)) 计算方式一致）
    const varianceAll = allRowSums.map(val => (val - overallMean) ** 2)
                                  .reduce((a, b) => a + b, 0) / (allRowSums.length - 1);
    const overallStd = Math.sqrt(varianceAll);

    for (let s = 0; s < nstat; s++) {
        // 获取当前语句 S[s] 在因子 f 中的所有 Q-sort 加权得分
        const rowValues = wraw_all[f][s];  

        // 计算 sum（所有 Q-sort 的加权求和）
        zsc_sum[s][f] = rowValues.reduce((a, b) => a + b, 0);

        // 统一赋值 mean 和 std（和 R 代码的逻辑一致）
        zsc_mea[s][f] = overallMean;
        zsc_std[s][f] = overallStd;
    }
}

    // -- z-scores for each statement
    const zsc = new Array(nstat).fill().map(() => new Array(nfactors).fill(NaN));
  for (let f = 0; f < nfactors; f++) {
      for (let s = 0; s < nstat; s++) {
          const numFlagged = flagged.map(q => q[f]).filter(Boolean).length;
          if (numFlagged === 0) continue;

          if (zsc_std[s][f] === 0) {
              zsc[s][f] = 0; // 避免除以0
          } else {
              // 计算z-score: (X - mean) / stddev
              zsc[s][f] = (zsc_sum[s][f] - zsc_mea[s][f]) / zsc_std[s][f];
          }
      }
  }
  
    // D. FACTOR SCORES: rounded z-scores
    let qscores = [];
    if (forced) {
      // Check if forced is true, ensure all Q-sorts follow the same distribution
      qscores = dataset.map(row => row[0]).sort((a, b) => a - b);  
      for (let col = 0; col < dataset[0].length; col++) {
          // 取出 dataset 的第 col 列
          let qsortColumn = dataset.map(row => row[col]);
      
          // 检查排序后是否与 qscores 相同
          if (!qsortColumn.sort((a, b) => a - b).every((val, idx) => val === qscores[idx])) {
              throw new Error("Q method input: The argument 'forced' is set as 'TRUE', but your data contains one or more Q-sorts that do not follow the same distribution.");
          }
      }
      

    } else {
      if (distribution === null) throw new Error("Q method input: The argument 'forced' is set as 'FALSE', but no distribution has been provided.");
      if (distribution.length !== nstat) throw new Error("Q method input: The length of the distribution provided does not match the number of statements.");
      if (!distribution.every(val => typeof val === 'number')) throw new Error("Q method input: The distribution provided contains non-numerical values.");
      qscores = [...distribution].sort((a, b) => a - b);
    }
    

    // E. FACTOR CHARACTERISTICS
    // const f_char = qfcharact(loa, flagged, zsc, nfactors);
  
    // F. FINAL OUTPUTS
    const brief = {
      date: new Date().toLocaleString(),
      pkg_version: "1.0.0",  // Placeholder version, adjust as needed
      nstat,
      nqsorts,
      distro: forced,
      nfactors,
      extraction: "Unknown: loadings were provided separately.",
      rotation: "Unknown: loadings were provided separately.",
      cor_method: "Unknown: loadings were provided separately.",
      info: [
        "Q-method z-scores.",
        `Finished on: ${new Date().toLocaleString()}`,
        "'qmethod' package version: 1.0.0",
        `Original data: ${nstat} statements, ${nqsorts} Q-sorts`,
        `Forced distribution: ${forced}`,
        `Number of factors: ${nfactors}`,
        "Extraction: Unknown: loadings were provided separately.",
        "Rotation: Unknown: loadings were provided separately.",
        "Flagging: Unknown: flagged Q-sorts were provided separately.",
        `Correlation coefficient: Unknown: loadings were provided separately.`
      ]
    };
  
    // Final results
    const qmethodresults = {
      brief,
      dataset,
      loa,
      flagged,
      zsc,
    };
  
    return qmethodresults;
  }
  
  // Example usage
// const dataset = [
//     [0, -1, 0, 0, 0, 1, 1],  // S1
//   [-1, 0, 0, 0, 0, 2, 1],  // S2
//   [0, -1, -1, 1, 1, 0, -1], // S3
//   [1, 0, 0, 2, 2, 0, 1],  // S4
//   [2, 1, 0, 1, 1, 0, -1], // S5
//   [2, 1, -2, -1, -2, 1, 1], // S6
//   [0, -1, 1, -2, 2, 0, 0],  // S7
//   [1, 1, -1, 1, -1, 0, 0],  // S8
//   [0, 1, -1, -1, 0, 0, 0],  // S9
//   [0, 2, 0, 0, -2, 2, 2],  // S10
//   [1, 0, 2, 0, -1, -1, -2], // S11
//   [-1, 2, 0, 0, -1, -1, 0],  // S12
//   [0, -1, -2, 0, 0, 0, -1], // S13
//   [1, 0, 1, 2, 1, -1, 0],  // S14
//   [-1, 0, -1, -1, 0, -2, -2], // S15
//   [-1, 0, 0, -1, 0, -2, -1],  // S16
//   [-2, -2, 2, 0, 0, -1, 2],  // S17
//   [0, 0, 1, 1, 1, 1, 0],   // S18
//   [-2, -2, 1, -2, -1, 1, 0]   // S19
//   ];
  
  
  
//   const nfactors = 2;
//   const loa = [
//     [0.856, -0.13],  // Row 1: f1 = 0.856, f2 = -0.13
//     [0.746, 0.28],   // Row 2: f1 = 0.746, f2 = 0.28
//     [-0.533, -0.21], // Row 3: f1 = -0.533, f2 = -0.21
//     [0.570, -0.32],  // Row 4: f1 = 0.570, f2 = -0.32
//     [-0.071, -0.69], // Row 5: f1 = -0.071, f2 = -0.69
//     [0.126, 0.75],   // Row 6: f1 = 0.126, f2 = 0.75
//     [-0.092, 0.70]   // Row 7: f1 = -0.092, f2 = 0.70
//   ];
  
//   const flagged = [
//     [true, false], // Row 1
//     [true, false], // Row 2
//     [true, false], // Row 3
//     [true, false], // Row 4
//     [false, true], // Row 5
//     [false, true], // Row 6
//     [false, true]  // Row 7
//   ];
  
//   const distribution = [
//     ...Array(2).fill(-2), // Two -2s
//     ...Array(4).fill(-1), // Four -1s
//     ...Array(7).fill(0),  // Seven 0s
//     ...Array(4).fill(1),  // Four 1s
//     ...Array(2).fill(2)   // Two 2s
//   ];
  
//   const result = qzscores(dataset, nfactors, loa, flagged, true, distribution);
//   console.log(result);
  
