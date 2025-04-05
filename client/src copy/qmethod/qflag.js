export default function qflag(loa, nstat) {
    // Calculate number of Q sorts and number of statements
    const nqsorts = loa.length; // Number of rows (Q sorts)
    const ncols = loa[0].length; // Number of columns (factors)
  
    // FLAGGING CRITERIA:
    // 1) Q sorts with factor loading higher than the threshold for pval > 0.95
    // 2) Q sorts with square loading higher than the sum of square loadings of the same Q-sort in all other factors
    const thold_05 = 1.96 / Math.sqrt(nstat);
  
    // Calculate loa squared matrix (loa^2)
    const loa_sq = loa.map(row => row.map(val => val * val));
  
    // Initialize flagged matrix with false values
    const flagged = Array(nqsorts).fill().map(() => Array(ncols).fill(false));
  
    // Flagging process
    for (let f = 0; f < ncols; f++) {
      for (let n = 0; n < nqsorts; n++) {
        // Check if the square of the loading is higher than the sum of other squared loadings in the same row
        flagged[n][f] = loa_sq[n][f] > loa_sq[n].reduce((acc, val, idx) => (idx !== f ? acc + val : acc), 0) && Math.abs(loa[n][f]) > thold_05;
      }
    }
  
    // Check conditions for manual inspection
    // 1) Negative loading and flagged
    for (let i = 0; i < nqsorts; i++) {
      for (let j = 0; j < ncols; j++) {
        if (flagged[i][j] && loa[i][j] < 0) {
          console.warn("One or more Q-sorts with negative loadings are flagged through the automatic pre-flagging. This is not necessarily an issue, but double check the flags manually.");
          break;
        }
      }
    }
  
    // 2) A Q-sort flagged in more than one factor
    for (let i = 0; i < nqsorts; i++) {
      const flaggedSum = flagged[i].reduce((sum, flag) => sum + (flag ? 1 : 0), 0);
      if (flaggedSum > 1) {
        console.warn("One or more Q-sorts is flagged for two or more factors through the automatic pre-flagging. This is not necessarily an issue, but double check the flags manually.");
        break;
      }
    }
  
    // Create column names for flagged matrix
    const flaggedColumnNames = Array.from({ length: ncols }, (_, i) => `flag_f${i + 1}`);
  
    // Return flagged matrix with column names
    return flagged;
  }
  
//   // Example usage
//   const loa = [
//     [-0.1251,  0.563],
//     [-0.4541,  0.514],
//     [ 0.5140, -0.301],
//     [ 0.2913,  0.452],
//     [ 0.6598,  0.046],
//     [-0.1791,  0.439],
//     [ 0.0532,  0.353],
//     [-0.0485,  0.301],
//     [ 0.6767,  0.369],
//     [ 0.3634,  0.503],
//     [ 0.4342, -0.139],
//     [ 0.4438,  0.534],
//     [ 0.4621,  0.202],
//     [-0.2648,  0.159],
//     [ 0.0743,  0.519],
//     [ 0.5948,  0.233],
//     [ 0.7834, -0.059],
//     [-0.3826,  0.572],
//     [ 0.6870, -0.024],
//     [-0.0013,  0.786],
//     [ 0.4319,  0.637]
// ];

//   const nstat = 100;
  
//   const result = qflag(loa, nstat);
//   console.table(result.flagged);
//   console.log(result.columnNames);
  