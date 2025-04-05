import React from 'react';
import * as numeric from 'numeric';

export default function principal(r, nfactors) {
    // 使用 numeric.js 对相关矩阵进行特征值分解
  var eig = numeric.eig(r);
    
    // 构造特征值和特征向量的配对数组
    var eigenPairs = [];
    for (var i = 0; i < eig.lambda.x.length; i++) {
      eigenPairs.push({
        eigenvalue: eig.lambda.x[i],
        // 提取第 i 列构成的特征向量
        eigenvector: eig.E.x.map(function(row) { return row[i]; })
      });
    }
    
    // 按 eigenvalue 降序排序
    eigenPairs.sort(function(a, b) {
      return b.eigenvalue - a.eigenvalue;
    });
    
    // 根据公式：载荷 = eigenvector * sqrt(eigenvalue)
    // 构造初始因子载荷矩阵，仅取前 nfactors 列
    var n = r.length; // 变量个数
    var loadings = [];
    for (var i = 0; i < n; i++) {
      loadings[i] = [];
      for (var j = 0; j < nfactors; j++) {
        loadings[i][j] = eigenPairs[j].eigenvector[i] * Math.sqrt(eigenPairs[j].eigenvalue);
      }
    }
    
    // 如果提取的因子数大于 1，则使用 varimax 旋转
    if (nfactors > 1) {
      loadings = varimax(loadings);
    }

    // 确保旋转后的载荷矩阵符号一致
    loadings = enforceSignConsistency(loadings);
    
    return loadings;
}

// Varimax 旋转算法：对载荷矩阵进行正交旋转
function varimax(loadings, gamma = 1, maxIter = 20, tol = 1e-6) {
    var p = loadings.length;    // 变量数量
    var k = loadings[0].length; // 因子数量
    
    // 初始化旋转矩阵 R 为 k x k 单位矩阵
    var R = numeric.identity(k);
    
    for (var iter = 0; iter < maxIter; iter++) {
        // 计算旋转后的载荷矩阵 L_rot = loadings * R
        var L_rot = numeric.dot(loadings, R);
        
        // 计算每列的均值 m_j = (1/p) * sum(L_rot[i][j]^2)
        var colMeans = [];
        for (var j = 0; j < k; j++) {
            var sumSq = 0;
            for (var i = 0; i < p; i++) {
                sumSq += Math.pow(L_rot[i][j], 2);
            }
            colMeans[j] = sumSq / p;
        }
        
        // 计算 diff = L_rot^3 - gamma * L_rot .* colMeans
        var diff = [];
        for (var i = 0; i < p; i++) {
            diff[i] = [];
            for (var j = 0; j < k; j++) {
                diff[i][j] = Math.pow(L_rot[i][j], 3) - gamma * L_rot[i][j] * colMeans[j];
            }
        }
        
        // 计算 B = loadings^T * diff
        var B = numeric.dot(numeric.transpose(loadings), diff);
        
        // 对 B 进行 SVD 分解，更新旋转矩阵 R_new = U * V^T
        var svdB = numeric.svd(B);
        var U = svdB.U;
        var V = svdB.V;
        var R_new = numeric.dot(U, numeric.transpose(V));
        
        // 判断旋转矩阵变化是否小于容忍值 tol
        var diffR = numeric.sub(R_new, R);
        var normDiff = numeric.norm2(diffR);
        R = R_new;
        if (normDiff < tol) break;
    }
    
    // 返回旋转后的因子载荷矩阵：loadings_rot = loadings * R
    return numeric.dot(loadings, R);
}

// 确保旋转后的因子载荷符号一致
function enforceSignConsistency(loadings) {
    var p = loadings.length; // 变量数量
    var k = loadings[0].length; // 因子数量
    
    for (var j = 0; j < k; j++) {
        var sum = 0;
        for (var i = 0; i < p; i++) {
            sum += loadings[i][j];
        }
        if (sum < 0) {
            // 如果该因子的载荷和为负，则反转该因子的符号
            for (var i = 0; i < p; i++) {
                loadings[i][j] = -loadings[i][j];
            }
        }
    }
    
    return loadings;
}

// ===========================
// 使用示例：
// ===========================

// 根据 R 的输出，这里给出相关矩阵数据
// const r = [
//     [1.00, -0.105, -0.32, -0.331, 0.38, 1.00, -0.105, -0.32, -0.331, 0.38],
//     [-0.105, 1.00, 0.68, -0.089, -0.16, -0.105, 1.00, 0.68, -0.089, -0.16],
//     [-0.32, 0.677, 1.00, 0.112, -0.29, -0.32, 0.677, 1.00, 0.112, -0.29],
//     [-0.331, -0.089, 0.112, 1.00, -0.07, -0.331, -0.089, 0.112, 1.00, -0.07],
//     [0.38, -0.155, -0.29, -0.07, 1.00, 0.38, -0.155, -0.29, -0.07, 1.00],
//     [1.00, -0.105, -0.32, -0.331, 0.38, 1.00, -0.105, -0.32, -0.331, 0.38],
//     [-0.105, 1.00, 0.68, -0.089, -0.16, -0.105, 1.00, 0.68, -0.089, -0.16],
//     [-0.32, 0.677, 1.00, 0.112, -0.29, -0.32, 0.677, 1.00, 0.112, -0.29],
//     [-0.331, -0.089, 0.112, 1.00, -0.07, -0.331, -0.089, 0.112, 1.00, -0.07],
//     [0.38, -0.155, -0.29, -0.07, 1.00, 0.38, -0.155, -0.29, -0.07, 1.00]
//   ];
  

// // 设置提取因子数量，例如提取 2 个因子
// var nfactors = 2;

// // 调用 principal 函数，得到旋转后的因子载荷矩阵
// var rotatedLoadings = principal(r, nfactors);

// // 输出结果
// console.log("旋转后的因子载荷矩阵：");
// console.table(rotatedLoadings);
