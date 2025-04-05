// qmethod.js
import numeric from 'numeric';
import * as math from 'mathjs';
import PCA from 'pca-js'; // 导入 pca-js 库

function qmethod(dataset, nfactors, extraction = "PCA", rotation = "varimax", forced = true, distribution = null, corMethod = "pearson", silent = false, spc = 10 ** -5) {
  const nstat = dataset.length; // 语句的数量（行数）
  const nqsorts = dataset[0].length; // Q-sort 的数量（列数）

  // 计算显著性阈值
  const thold01 = 2.58 / Math.sqrt(nstat);
  const thold05 = 1.96 / Math.sqrt(nstat);

  // 数据验证
  if (nstat < 2) throw new Error("Q method input: 数据集少于两条语句");
  if (nqsorts < 2) throw new Error("Q method input: 数据集少于两条 Q-sort");
  if (!Array.isArray(dataset) || !dataset.every(row => Array.isArray(row) && row.every(el => typeof el === 'number'))) {
    throw new Error("Q method input: 数据集包含非数字值");
  }

  if (forced) {
    let qscores = dataset[0].slice().sort((a, b) => a - b);
    for (let i = 0; i < nqsorts; i++) {
      if (!dataset[i].every((val, idx) => qscores[idx] === val)) {
        throw new Error("Q method input: 'forced' 参数设置为 'TRUE'，但数据包含一个或多个 Q-sort 不符合相同的分布。");
      }
    }
  }

  if (!forced && !distribution) {
    throw new Error("Q method input: 'forced' 参数设置为 'FALSE'，但未提供 'distribution' 参数");
  }

  if (distribution && (distribution.length !== nstat || !distribution.every(val => typeof val === 'number'))) {
    throw new Error("Q method input: 提供的 'distribution' 包含非数字值或其长度与语句数不匹配");
  }

  function correlation(arr1, arr2) {
      const n = arr1.length;
      const mean1 = math.mean(arr1);
      const mean2 = math.mean(arr2);
      const std1 = math.std(arr1, 'unbiased'); // 无偏标准差 (n-1)
      const std2 = math.std(arr2, 'unbiased');
      
      let cov = 0;
      for (let i = 0; i < n; i++) {
        cov += (arr1[i] - mean1) * (arr2[i] - mean2);
      }
      cov /= (n - 1);
      
      return cov / (std1 * std2);
    }

    function calculateCorrelationMatrix(data) {
        const n = data.length;
        let matrix = [];
        for (let i = 0; i < n; i++) {
          matrix[i] = [];
          for (let j = 0; j < n; j++) {
            matrix[i][j] = correlation(data[i], data[j]);
          }
        }
        return matrix;
      }

  // 计算相关矩阵（使用 Pearson 方法）
  // console.log(dataset);
  let corData = calculateCorrelationMatrix(dataset);
  //console.log("相关矩阵:", corData);

  // 提取方法（PCA）
  let loa;
  if (extraction === "PCA") {
    // 使用 pca-js 进行 PCA 分析
    const pcaResult = PCA.getEigenVectors(corData);
    loa = pcaResult.map(vector => vector.vector).slice(0, nfactors);
  } else if (extraction === "centroid") {
    // Centroid 提取（尚未完全实现）
    throw new Error("Centroid 提取尚未实现");
  }

  console.log("因子载荷矩阵:", loa);

  // 旋转方法（Varimax）
  if (rotation === "varimax") {
    loa = varimaxRotation(loa);
  }

  // 标记方法 - 这里是占位符
  let flagged = flag(loa);

  // 计算 Q 分数 - 这里是占位符
  let qmethodResults = qScores(dataset, nfactors, flagged, loa);

  // 准备结果
  qmethodResults.brief = {
    extraction: extraction,
    rotation: rotation,
    flagging: "automatic",
    corMethod: corMethod,
    pkgVersion: "1.0.0", // 占位符版本
    info: [
      `Q-method 分析`,
      `完成时间: ${new Date()}`,
      `Q-method 包版本: 1.0.0`,
      `原始数据: ${nstat} 条语句, ${nqsorts} 个 Q-sort`,
      `因素数量: ${nfactors}`,
      `提取方法: ${extraction}`,
      `旋转方法: ${rotation}`,
      `标记方法: automatic`,
      `相关系数方法: ${corMethod}`
    ]
  };

  // 输出结果
  if (!silent) {
    console.log(qmethodResults.brief.info.join("\n"));
  }

  return qmethodResults;
}

// Helper functions (占位符或简化版实现)

function varimaxRotation(loa) {
  // Varimax 旋转（占位符）
  return loa;
}

function flag(loa) {
  // 标记方法（占位符）
  return [];
}

function qScores(dataset, nfactors, flagged, loa) {
  // Q 分数计算（占位符）
  return { zsc: [], f_char: {}, brief: {} };
}

const customDistribution = [-2,-1,0,1,2];  // 这是一个例子，根据实际情况调整

// 创建一个简单的测试数据集
const data = [
    [-2, -1, 0, 1, 2],
    [-1, 0, 1, 2, -2],
    [0, 1, 2, -2, -1],
    [1, 2, -2, -1, 0],
    [2, -2, -1, 0, 1]
  ];

// 调用 qmethod 时传入自定义分布
try {
  const results = qmethod(data, 2, "PCA", "varimax", false, customDistribution, "pearson", false);
  console.log("Q-method 分析结果:", results);
} catch (error) {
  console.error("分析出错:", error.message);
}