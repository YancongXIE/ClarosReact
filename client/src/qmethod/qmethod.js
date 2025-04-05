// qmethod.js
import numeric from 'numeric';
import * as math from 'mathjs';
import principal from './principal';
import qflag from './qflag.js';
import qzscores from './qzscores.js';

export default function qmethod(dataset, nfactors,distribution, extraction = "PCA", rotation = "varimax", forced = true, corMethod = "pearson", silent = false, spc = 10 ** -5) {
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
    let qscores = dataset.map(row => row[0]).sort((a, b) => a - b); 
    for (let col = 0; col < dataset[0].length; col++) {
        // 取出 dataset 的第 col 列
        let qsortColumn = dataset.map(row => row[col]);
    
        // 检查排序后是否与 qscores 相同
        if (!qsortColumn.sort((a, b) => a - b).every((val, idx) => val === qscores[idx])) {
            throw new Error("Q method input: The argument 'forced' is set as 'TRUE', but your data contains one or more Q-sorts that do not follow the same distribution.");
        }
    }
  }



  if (!forced && !distribution) {
    throw new Error("Q method input: 'forced' 参数设置为 'FALSE'，但未提供 'distribution' 参数");
  }

  if (distribution && (distribution.length !== nstat || !distribution.every(val => typeof val === 'number'))) {
    throw new Error("Q method input: 提供的 'distribution' 包含非数字值或其长度与语句数不匹配");
  }

  // 计算两个数组的 Pearson 相关系数
function correlation(arr1, arr2) {
    const mean1 = math.mean(arr1);
    const mean2 = math.mean(arr2);
    const n = arr1.length;
    
    // 计算协方差和标准差
    let covariance = 0;
    let std1 = 0;
    let std2 = 0;
    for (let i = 0; i < n; i++) {
      const diff1 = arr1[i] - mean1;
      const diff2 = arr2[i] - mean2;
      covariance += diff1 * diff2;
      std1 += diff1 ** 2;
      std2 += diff2 ** 2;
    }
    
    // 无偏估计 (n-1)
    covariance /= (n - 1);
    const sd1 = Math.sqrt(std1 / (n - 1));
    const sd2 = Math.sqrt(std2 / (n - 1));
    
    return covariance / (sd1 * sd2);
  }
  
  // 计算相关矩阵（输入数据为观测值 × 变量，即每列是一个变量）
  function calculateCorrelationMatrix(data) {
    const nVariables = data[0].length; // 变量数（列数）
    const matrix = [];
    
    // 遍历每对变量（列）
    for (let i = 0; i < nVariables; i++) {
      matrix[i] = [];
      const var1 = data.map(row => row[i]); // 第 i 列数据
      
      for (let j = 0; j < nVariables; j++) {
        const var2 = data.map(row => row[j]); // 第 j 列数据
        matrix[i][j] = correlation(var1, var2);
      }
    }
    
    return matrix;
  }

  // 计算相关矩阵（使用 Pearson 方法）
  let corData = calculateCorrelationMatrix(dataset);

  // 提取方法（PCA）
  let loa;
  //console.log("corData:",corData);
  if (extraction === "PCA") {
    // PCA (主成分分析) - 这里提供了一个简单的 PCA 实现
    loa = principal(corData, nfactors);
  } else if (extraction === "centroid") {
    // Centroid 提取（尚未完全实现）
    throw new Error("Centroid 提取尚未实现");
  }
  
  // 标记方法 - 这里是占位符
  let flagged = qflag(loa, nstat);

//   // 计算 Q 分数 - 这里是占位符
  let qmethodResults = qzscores(dataset, nfactors, flagged=flagged, loa=loa, forced=forced, distribution=distribution);


//   // 准备结果
//   qmethodResults.brief = {
//     extraction: extraction,
//     rotation: rotation,
//     flagging: "automatic",
//     corMethod: corMethod,
//     pkgVersion: "1.0.0", // 占位符版本
//     info: [
//       `Q-method 分析`,
//       `完成时间: ${new Date()}`,
//       `Q-method 包版本: 1.0.0`,
//       `原始数据: ${nstat} 条语句, ${nqsorts} 个 Q-sort`,
//       `因素数量: ${nfactors}`,
//       `提取方法: ${extraction}`,
//       `旋转方法: ${rotation}`,
//       `标记方法: automatic`,
//       `相关系数方法: ${corMethod}`
//     ]
//   };

//   // 输出结果
//   if (!silent) {
//     console.log(qmethodResults.brief.info.join("\n"));
//   }

   return qmethodResults;
}


// const customDistribution = [-2,-1,0,1,2];  // 这是一个例子，根据实际情况调整

// // 创建一个简单的测试数据集
// const data = [
//     [-2, -1, 0, 1, 2],
//     [-1, 0, 1, 2, -2],
//     [0, 1, 2, -2, -1],
//     [1, 2, -2, -1, 0],
//     [2, -2, -1, 0, 1]
//   ];

// // 调用 qmethod 时传入自定义分布
// try {
//   const results = qmethod(data, 2, "PCA", "varimax", false, customDistribution, "pearson", false);
//   console.log("Q-method 分析结果:", results);
// } catch (error) {
//   console.error("分析出错:", error.message);
// }

