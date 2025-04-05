// // 示例数据
// const data = [
//   [0, -1, 0, 1, 2, 2, 0, 1, 0, 0, 1, -1, 0, 1, -1, -1, -2, 0, -2],
//   [-1, 0, -1, 0, 1, 1, -1, 1, 1, 2, 0, 2, -1, 0, 0, 0, -2, 0, -2],
//   [0, 0, -1, 0, 0, -2, 1, -1, -1, 0, 2, 0, -2, 1, -1, 0, 2, 1, 1],
//   [0, 0, 1, 2, 1, -1, -2, 1, -1, 0, 0, 0, 0, 2, -1, -1, 0, 1, -2],
//   [0, 0, 1, 2, 1, -2, 2, -1, 0, -2, -1, -1, 0, 1, 0, 0, 0, 1, -1],
//   [1, 2, 0, 0, 0, 1, 0, 0, 0, 2, -1, -1, 0, -1, -2, -2, -1, 1, 1],
//   [1, 1, -1, 1, -1, 1, 0, 0, 0, 2, -2, 0, -1, 0, -2, -1, 2, 0, 0],
//   [0, 0, 1, 2, 0, -2, -1, 0, 2, 1, 1, 0, -1, 1, -1, -2, -1, 0, 0],
//   [1, 1, -2, 1, -1, 0, 0, -1, -1, -2, 0, 0, 0, 2, 0, 1, 0, 2, -1],
//   [1, 2, -2, 0, -1, 0, -1, 1, 1, -1, 0, 0, -2, 0, 0, 0, 1, 2, -1],
//   [2, 1, -1, 0, 2, -1, 1, -2, 0, -1, 0, -1, 1, 0, 0, 0, 1, -2, 0],
//   [0, 2, 0, 2, 1, -1, 0, 0, 1, -1, -2, -2, 0, 0, 0, 1, -1, 1, -1],
//   [1, 1, -2, 0, -1, -1, 0, 2, 0, -1, -1, 2, 0, 1, 0, 0, 1, 0, -2],
//   [1, 0, 0, 2, -2, 1, -1, -1, 1, 0, 2, -1, 0, 0, 1, -1, 0, -2, 0],
//   [1, 2, -2, -1, -1, 1, -2, 1, 0, 1, -1, -1, 0, 0, 0, 0, 0, 2, 0],
//   [0, 0, -1, 1, 2, -1, 1, 1, 0, -1, -1, -2, 2, 1, 0, 0, 0, 0, -2],
//   [0, 0, -2, 0, 1, -2, 0, 0, -1, -1, 1, -1, 0, 2, -1, 0, 1, 2, 1],
//   [0, 0, 1, 1, 0, 2, -1, -2, 2, 0, 1, 0, -2, 0, -1, 0, -1, 1, -1],
//   [2, 0, -2, 1, 0, -2, 1, 2, -1, -1, 0, 0, -1, 0, -1, 0, 0, 1, 1],
//   [0, 2, -2, 1, 1, 2, -1, -1, 1, -1, 0, 0, 0, 0, 0, 0, -2, 1, -1],
//   [1, 1, -1, 2, 0, 1, 1, -1, 0, 0, -1, -2, 0, 2, -1, 0, 0, 0, -2]
// ];

import * as math from 'mathjs';
import numeric from 'numeric';

// 辅助函数：矩阵标准化
function standardizeMatrix(data) {
  return data.map(row => {
    const rowMean = math.mean(row);
    const rowStd = math.std(row, 'unbiased');
    // 处理零标准差情况
    if (rowStd === 0) return row.map(() => 0);
    return row.map(x => (x - rowMean) / rowStd);
  });
}

// 相关系数计算（带异常处理）
function safeCorrelation(arr1, arr2) {
  const n = arr1.length;
  const mean1 = math.mean(arr1);
  const mean2 = math.mean(arr2);
  const std1 = math.std(arr1, 'unbiased');
  const std2 = math.std(arr2, 'unbiased');

  // 处理无效标准差
  if (std1 === 0 || std2 === 0) return 0;

  let cov = 0;
  for (let i = 0; i < n; i++) {
    cov += (arr1[i] - mean1) * (arr2[i] - mean2);
  }
  cov /= (n - 1);
  
  return cov / (std1 * std2);
}

// 修正后的Varimax旋转
function varimaxRotation(loadings, maxIter = 50, tol = 1e-6) {
  let rotated = math.clone(loadings);
  const [nRows, nCols] = math.size(rotated);

  for (let iter = 0; iter < maxIter; iter++) {
    let maxDelta = 0;
    
    for (let i = 0; i < nCols; i++) {
      for (let j = i + 1; j < nCols; j++) {
        let x = rotated.map(row => row[i]);
        let y = rotated.map(row => row[j]);
        
        // 计算旋转角度
        let num = 0, den = 0;
        for (let k = 0; k < nRows; k++) {
          const u = x[k]**2 - y[k]**2;
          const v = 2 * x[k] * y[k];
          num += u * v;
          den += u**2 - v**2;
        }
        
        // 处理分母为零的情况
        if (Math.abs(den) < 1e-10) continue;
        
        const angle = 0.25 * Math.atan2(2 * num, den);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // 更新因子载荷
        for (let k = 0; k < nRows; k++) {
          const xi = rotated[k][i];
          const xj = rotated[k][j];
          rotated[k][i] = xi * cos + xj * sin;
          rotated[k][j] = -xi * sin + xj * cos;
        }
        maxDelta = Math.max(maxDelta, Math.abs(angle));
      }
    }
    
    if (maxDelta < tol) break;
  }
  
  return rotated;
}

// 主函数修正
function qmethod(
  data,
  nfactors = 2,
  rotation = "varimax",
  corMethod = "pearson",
  forced = true,
  silent = false,
  distribution = [...Array(2).fill(-2), ...Array(4).fill(-1), ...Array(7).fill(0), ...Array(4).fill(1), ...Array(2).fill(2)]
) {
  // 数据预处理
  const standardizedData = standardizeMatrix(data);
  
  // 计算相关系数矩阵
  const corMatrix = standardizedData.map(row1 =>
    standardizedData.map(row2 => safeCorrelation(row1, row2))
  );
  
  // 执行SVD
  const svdResult = numeric.svd(corMatrix);
  const V = svdResult.V;
  const S = svdResult.S;

  // 验证奇异值
  if (S.some(s => isNaN(s) || s < 0)) {
    throw new Error('Invalid singular values detected');
  }

  // 提取前nfactors个因子
  const V_reduced = V.map(row => row.slice(0, nfactors));
  const S_reduced = S.slice(0, nfactors);

  // 计算正确载荷矩阵
  const sqrtS = S_reduced.map(Math.sqrt);
  const loadings = numeric.dotMMbig(
    V_reduced,
    numeric.diag(sqrtS)
  );

  // 因子旋转
  let rotated;
  if (rotation === "varimax") {
    rotated = varimaxRotation(loadings);
  } else {
    rotated = loadings;
  }

  // 强制分布处理
  const applyDistribution = (data) => {
    return data.map(row => {
      const indexed = row.map((v, i) => ({ v, i }));
      indexed.sort((a, b) => a.v - b.v);
      const newRow = new Array(row.length);
      indexed.forEach(({ i }, idx) => {
        newRow[i] = distribution[idx];
      });
      return newRow;
    });
  };

  return {
    correlationMatrix: corMatrix,
    factors: loadings,
    rotatedFactors: rotated,
    finalData: forced ? applyDistribution(data) : data
  };
}

// // 示例数据验证
// const data = [
//   [0, -1, 0, 1, 2, 2, 0, 1, 0, 0, 1, -1, 0, 1, -1, -1, -2, 0, -2],
//   [-1, 0, -1, 0, 1, 1, -1, 1, 1, 2, 0, 2, -1, 0, 0, 0, -2, 0, -2],
//   [0, 0, -1, 0, 0, -2, 1, -1, -1, 0, 2, 0, -2, 1, -1, 0, 2, 1, 1],
//   [0, 0, 1, 2, 1, -1, -2, 1, -1, 0, 0, 0, 0, 2, -1, -1, 0, 1, -2],
//   [0, 0, 1, 2, 1, -2, 2, -1, 0, -2, -1, -1, 0, 1, 0, 0, 0, 1, -1],
//   [1, 2, 0, 0, 0, 1, 0, 0, 0, 2, -1, -1, 0, -1, -2, -2, -1, 1, 1],
//   [1, 1, -1, 1, -1, 1, 0, 0, 0, 2, -2, 0, -1, 0, -2, -1, 2, 0, 0],
//   [0, 0, 1, 2, 0, -2, -1, 0, 2, 1, 1, 0, -1, 1, -1, -2, -1, 0, 0],
//   [1, 1, -2, 1, -1, 0, 0, -1, -1, -2, 0, 0, 0, 2, 0, 1, 0, 2, -1],
//   [1, 2, -2, 0, -1, 0, -1, 1, 1, -1, 0, 0, -2, 0, 0, 0, 1, 2, -1],
//   [2, 1, -1, 0, 2, -1, 1, -2, 0, -1, 0, -1, 1, 0, 0, 0, 1, -2, 0],
//   [0, 2, 0, 2, 1, -1, 0, 0, 1, -1, -2, -2, 0, 0, 0, 1, -1, 1, -1],
//   [1, 1, -2, 0, -1, -1, 0, 2, 0, -1, -1, 2, 0, 1, 0, 0, 1, 0, -2],
//   [1, 0, 0, 2, -2, 1, -1, -1, 1, 0, 2, -1, 0, 0, 1, -1, 0, -2, 0],
//   [1, 2, -2, -1, -1, 1, -2, 1, 0, 1, -1, -1, 0, 0, 0, 0, 0, 2, 0],
//   [0, 0, -1, 1, 2, -1, 1, 1, 0, -1, -1, -2, 2, 1, 0, 0, 0, 0, -2],
//   [0, 0, -2, 0, 1, -2, 0, 0, -1, -1, 1, -1, 0, 2, -1, 0, 1, 2, 1],
//   [0, 0, 1, 1, 0, 2, -1, -2, 2, 0, 1, 0, -2, 0, -1, 0, -1, 1, -1],
//   [2, 0, -2, 1, 0, -2, 1, 2, -1, -1, 0, 0, -1, 0, -1, 0, 0, 1, 1],
//   [0, 2, -2, 1, 1, 2, -1, -1, 1, -1, 0, 0, 0, 0, 0, 0, -2, 1, -1],
//   [1, 1, -1, 2, 0, 1, 1, -1, 0, 0, -1, -2, 0, 2, -1, 0, 0, 0, -2]
// ];

// try {
//   const results = qmethod(data, 2);
//   console.log('因子载荷:', results.factors);
//   console.log('旋转因子:', results.rotatedFactors);
// } catch (error) {
//   console.error('分析错误:', error.message);
// }
