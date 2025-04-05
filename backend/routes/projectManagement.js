const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// 中间件：从 token 中获取用户 ID 和角色
const getUserInfoFromToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ Error: true, Message: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role; // 获取用户角色
    next();
  } catch (err) {
    console.error('Error getting user info from token:', err);
    res.status(401).json({ Error: true, Message: 'Invalid token' });
  }
};

// 在所有路由中使用中间件
router.use(getUserInfoFromToken);

// 根据用户角色过滤数据的函数
const filterDataByRole = (data, userId, userRole) => {
  if (userRole === 'manager') {
    return data; // 管理员可以看到所有数据
  }
  return data.filter(item => item.adminID === userId); // 普通管理员只能看到自己的数据
};

// Distribution routes
router.get('/distribution', (req, res) => {
  req.db
    .from('distribution')
    .select('*')
    .then((rows) => {
      const filteredData = filterDataByRole(rows, req.userId, req.userRole);
      res.json({ Error: false, Message: 'Success', data: filteredData });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.post('/distribution', (req, res) => {
  const { distributionDetails } = req.body;
  req.db
    .from('distribution')
    .insert({ distributionDetails, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Successfully added' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/distribution/:id', (req, res) => {
  const { distributionDetails } = req.body;
  req.db
    .from('distribution')
    .where('distributionID', req.params.id)
    .update({ distributionDetails, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/distribution/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('Attempting to delete distribution:', id);
  
  req.db
    .from('distribution')
    .where('distributionID', id)
    .del()
    .then(() => {
      console.log('Distribution deleted successfully');
      res.json({ Error: false, Message: 'Distribution deleted successfully' });
    })
    .catch((err) => {
      console.log('Error deleting distribution:', err);
      console.log('SQL Error details:', err.sqlMessage);
      res.status(400).json({ 
        Error: true, 
        Message: 'Error deleting distribution: ' + (err.sqlMessage || err.message)
      });
    });
});

// Study routes
router.get('/study', (req, res) => {
  req.db
    .from('study')
    .select('*')
    .then((rows) => {
      const filteredData = filterDataByRole(rows, req.userId, req.userRole);
      res.json({ Error: false, Message: 'Success', data: filteredData });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.post('/study', (req, res) => {
  const { studyName, studyDate, distributionID } = req.body;
  
  console.log('Received study data:', { studyName, studyDate, distributionID });
  
  if (!studyName || !studyDate) {
    console.log('Missing required fields:', { studyName, studyDate, distributionID });
    return res.json({ Error: true, Message: 'Missing required fields' });
  }

  console.log('Attempting to insert study data...');
  
  req.db
    .from('study')
    .insert([{ studyName, studyDate, distributionID, adminID: req.userId }])
    .then(() => {
      console.log('Study data inserted successfully');
      res.json({ Error: false, Message: 'Study added successfully' });
    })
    .catch((err) => {
      console.log('Error adding study:', err);
      console.log('SQL Error details:', err.sqlMessage);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/study/:id', (req, res) => {
  const { studyDate, studyName, distributionID } = req.body;
  req.db
    .from('study')
    .where('studyID', req.params.id)
    .update({ studyDate, studyName, distributionID, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/study/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('Attempting to delete study:', id);
  
  req.db
    .from('study')
    .where('studyID', id)
    .del()
    .then(() => {
      console.log('Study deleted successfully');
      res.json({ Error: false, Message: 'Study deleted successfully' });
    })
    .catch((err) => {
      console.log('Error deleting study:', err);
      console.log('SQL Error details:', err.sqlMessage);
      res.status(400).json({ 
        Error: true, 
        Message: 'Error deleting study: ' + (err.sqlMessage || err.message)
      });
    });
});

// Respondent routes
router.get('/respondent', (req, res) => {
  req.db
    .from('respondent')
    .select('*')
    .then((rows) => {
      const filteredData = filterDataByRole(rows, req.userId, req.userRole);
      res.json({ Error: false, Message: 'Success', data: filteredData });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.post('/respondent', (req, res) => {
  const { username, rawPassword, studyID } = req.body;
  req.db
    .from('respondent')
    .insert({ username, rawPassword, studyID, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Successfully added' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.post('/respondent/bulk', (req, res) => {
  const { respondents } = req.body;
  
  if (!Array.isArray(respondents) || respondents.length === 0) {
    return res.json({ Error: true, Message: 'Invalid respondents data' });
  }

  // 验证所有受访者数据
  for (const respondent of respondents) {
    if (!respondent.username || !respondent.rawPassword || !respondent.studyID) {
      return res.json({ Error: true, Message: 'Missing required fields for respondent' });
    }
  }

  // 为每个受访者添加 adminID
  const respondentsWithAdminID = respondents.map(respondent => ({
    ...respondent,
    adminID: req.userId
  }));

  // 批量插入数据
  req.db
    .from('respondent')
    .insert(respondentsWithAdminID)
    .then(() => {
      res.json({ Error: false, Message: `Successfully added ${respondents.length} respondents` });
    })
    .catch((err) => {
      console.log('Error adding respondents:', err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/respondent/:id', (req, res) => {
  const { username, rawPassword, studyID } = req.body;
  const updateData = {};
  
  // 只更新提供的字段
  if (username !== undefined) {
    updateData.username = username;
  }
  if (rawPassword !== undefined) {
    updateData.rawPassword = rawPassword;
  }
  if (studyID !== undefined) {
    updateData.studyID = studyID;
  }
  updateData.adminID = req.userId; // 总是更新 adminID

  // 如果没有要更新的字段，返回错误
  if (Object.keys(updateData).length === 0) {
    return res.json({ Error: true, Message: 'No fields to update' });
  }

  console.log('Updating respondent:', {
    id: req.params.id,
    updateData
  });

  req.db
    .from('respondent')
    .where('respondentID', req.params.id)
    .update(updateData)
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log('Error updating respondent:', err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/respondent/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('Attempting to delete respondent:', id);
  
  req.db
    .from('respondent')
    .where('respondentID', id)
    .del()
    .then(() => {
      console.log('Respondent deleted successfully');
      res.json({ Error: false, Message: 'Respondent deleted successfully' });
    })
    .catch((err) => {
      console.log('Error deleting respondent:', err);
      console.log('SQL Error details:', err.sqlMessage);
      res.status(400).json({ 
        Error: true, 
        Message: 'Error deleting respondent: ' + (err.sqlMessage || err.message)
      });
    });
});

// StudyRound routes
router.get('/studyRound', (req, res) => {
  req.db
    .from('studyRound')
    .select('*')
    .then((rows) => {
      const filteredData = filterDataByRole(rows, req.userId, req.userRole);
      res.json({ Error: false, Message: 'Success', data: filteredData });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.post('/studyRound', (req, res) => {
  const { studyID, studyRound, roundDate } = req.body;
  req.db
    .from('studyRound')
    .insert({ studyID, studyRound, roundDate, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Successfully added' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/studyRound/:id', (req, res) => {
  const { studyID, studyRound, roundDate } = req.body;
  req.db
    .from('studyRound')
    .where('roundID', req.params.id)
    .update({ studyID, studyRound, roundDate, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/studyRound/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('Attempting to delete study round:', id);
  
  req.db
    .from('studyRound')
    .where('roundID', id)
    .del()
    .then(() => {
      console.log('Study round deleted successfully');
      res.json({ Error: false, Message: 'Study round deleted successfully' });
    })
    .catch((err) => {
      console.log('Error deleting study round:', err);
      console.log('SQL Error details:', err.sqlMessage);
      res.status(400).json({ 
        Error: true, 
        Message: 'Error deleting study round: ' + (err.sqlMessage || err.message)
      });
    });
});

// Statement routes
router.get('/statement', (req, res) => {
  req.db
    .from('statement')
    .select('*')
    .then((rows) => {
      const filteredData = filterDataByRole(rows, req.userId, req.userRole);
      res.json({ Error: false, Message: 'Success', data: filteredData });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.post('/statement', (req, res) => {
  const { short, statementText } = req.body;
  req.db
    .from('statement')
    .insert({ short, statementText, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Successfully added' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/statement/:id', (req, res) => {
  const { short, statementText } = req.body;
  req.db
    .from('statement')
    .where('statementID', req.params.id)
    .update({ short, statementText, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/statement/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('Attempting to delete statement:', id);
  
  req.db
    .from('statement')
    .where('statementID', id)
    .del()
    .then(() => {
      console.log('Statement deleted successfully');
      res.json({ Error: false, Message: 'Statement deleted successfully' });
    })
    .catch((err) => {
      console.log('Error deleting statement:', err);
      console.log('SQL Error details:', err.sqlMessage);
      res.status(400).json({ 
        Error: true, 
        Message: 'Error deleting statement: ' + (err.sqlMessage || err.message)
      });
    });
});

// StudyStatement routes
router.get('/studyStatement', (req, res) => {
  req.db
    .from('studyStatement')
    .select('*')
    .then((rows) => {
      const filteredData = filterDataByRole(rows, req.userId, req.userRole);
      res.json({ Error: false, Message: 'Success', data: filteredData });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.post('/studyStatement', (req, res) => {
  const { studyID, statementID } = req.body;
  req.db
    .from('studyStatement')
    .insert({ studyID, statementID, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Successfully added' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/studyStatement/:id', (req, res) => {
  const { studyID, statementID } = req.body;
  req.db
    .from('studyStatement')
    .where('studyStatementID', req.params.id)
    .update({ studyID, statementID, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/studyStatement/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('Attempting to delete study statement:', id);
  
  req.db
    .from('studyStatement')
    .where('studyStatementID', id)
    .del()
    .then(() => {
      console.log('Study statement deleted successfully');
      res.json({ Error: false, Message: 'Study statement deleted successfully' });
    })
    .catch((err) => {
      console.log('Error deleting study statement:', err);
      console.log('SQL Error details:', err.sqlMessage);
      res.status(400).json({ 
        Error: true, 
        Message: 'Error deleting study statement: ' + (err.sqlMessage || err.message)
      });
    });
});

// 检查用户权限的中间件
const checkUserPermission = (req, res, next) => {
  // 如果是管理员，允许所有操作
  if (req.userRole === 'manager') {
    return next();
  }

  // 对于普通管理员，检查是否在操作自己的数据
  const itemId = req.params.id;
  const table = req.path.split('/')[1]; // 获取表名

  req.db
    .from(table)
    .where(`${table}ID`, itemId)
    .select('adminID')
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(404).json({ Error: true, Message: 'Item not found' });
      }
      if (rows[0].adminID !== req.userId) {
        return res.status(403).json({ Error: true, Message: 'Permission denied' });
      }
      next();
    })
    .catch((err) => {
      console.error('Error checking permission:', err);
      res.status(500).json({ Error: true, Message: 'Internal server error' });
    });
};

// 在所有修改操作的路由中使用权限检查中间件
router.put('/distribution/:id', checkUserPermission, (req, res) => {
  const { distributionDetails } = req.body;
  req.db
    .from('distribution')
    .where('distributionID', req.params.id)
    .update({ distributionDetails, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/study/:id', checkUserPermission, (req, res) => {
  const { studyDate, studyName, distributionID } = req.body;
  req.db
    .from('study')
    .where('studyID', req.params.id)
    .update({ studyDate, studyName, distributionID, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/respondent/:id', checkUserPermission, (req, res) => {
  const { username, rawPassword, studyID } = req.body;
  req.db
    .from('respondent')
    .where('respondentID', req.params.id)
    .update({ username, rawPassword, studyID, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/studyRound/:id', checkUserPermission, (req, res) => {
  const { studyID, studyRound, roundDate } = req.body;
  req.db
    .from('studyRound')
    .where('roundID', req.params.id)
    .update({ studyID, studyRound, roundDate, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/statement/:id', checkUserPermission, (req, res) => {
  const { short, statementText } = req.body;
  req.db
    .from('statement')
    .where('statementID', req.params.id)
    .update({ short, statementText, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/studyStatement/:id', checkUserPermission, (req, res) => {
  const { studyID, statementID } = req.body;
  req.db
    .from('studyStatement')
    .where('studyStatementID', req.params.id)
    .update({ studyID, statementID, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

// 删除操作的路由也使用权限检查中间件
router.delete('/distribution/:id', checkUserPermission, (req, res) => {
  req.db
    .from('distribution')
    .where('distributionID', req.params.id)
    .del()
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/study/:id', checkUserPermission, (req, res) => {
  req.db
    .from('study')
    .where('studyID', req.params.id)
    .del()
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/respondent/:id', checkUserPermission, (req, res) => {
  req.db
    .from('respondent')
    .where('respondentID', req.params.id)
    .del()
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/studyRound/:id', checkUserPermission, (req, res) => {
  req.db
    .from('studyRound')
    .where('roundID', req.params.id)
    .del()
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/statement/:id', checkUserPermission, (req, res) => {
  req.db
    .from('statement')
    .where('statementID', req.params.id)
    .del()
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/studyStatement/:id', checkUserPermission, (req, res) => {
  req.db
    .from('studyStatement')
    .where('studyStatementID', req.params.id)
    .del()
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

// Get distribution for a specific respondent
router.get('/respondent/:id/distribution', function (req, res, next) {
  const respondentId = req.params.id;
  
  console.log('Fetching distribution for respondent:', respondentId);
  
  // 通过 respondent -> study -> distribution 的关系获取数据
  req.db
    .from("respondent")
    .join("study", "respondent.studyID", "=", "study.studyID")
    .join("distribution", "study.distributionID", "=", "distribution.distributionID")
    .select("distribution.*")
    .where("respondent.respondentID", "=", respondentId)
    .first()
    .then((distribution) => {
      console.log('Found distribution:', distribution);
      
      if (!distribution) {
        console.log('Distribution not found');
        return res.json({ Error: true, Message: 'Distribution not found' });
      }
      
      console.log('Successfully retrieved distribution data');
      res.json({ Error: false, Message: 'Success', data: distribution });
    })
    .catch((err) => {
      console.error('Error in distribution retrieval process:', err);
      console.error('SQL Error details:', err.sqlMessage);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

// Q-sort routes
router.get('/qsort', (req, res) => {
  req.db
    .from('qSort')
    .select('*')
    .then((rows) => {
      const filteredData = filterDataByRole(rows, req.userId, req.userRole);
      res.json({ Error: false, Message: 'Success', data: filteredData });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.post('/qsort', (req, res) => {
  const { respondentID, studyStatementID, qSortValue } = req.body;
  req.db
    .from('qSort')
    .insert({ respondentID, studyStatementID, qSortValue, adminID: req.userId })
    .then(() => {
      res.json({ Error: false, Message: 'Successfully added' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.put('/qsort/:id', (req, res) => {
  const { respondentID, studyStatementID, qSortValue } = req.body;
  req.db
    .from('qSort')
    .where('qSortID', req.params.id)
    .update({ respondentID, studyStatementID, qSortValue })
    .then(() => {
      res.json({ Error: false, Message: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

router.delete('/qsort/:id', (req, res) => {
  const { respondentID, roundID, studyStatementID } = req.body;
  
  console.log('Attempting to delete qSort data:', {
    respondentID,
    roundID,
    studyStatementID
  });
  
  req.db
    .from('qSort')
    .where({
      respondentID: respondentID,
      roundID: roundID,
      studyStatementID: studyStatementID
    })
    .del()
    .then(() => {
      console.log('Q-Sort data deleted successfully');
      res.json({ Error: false, Message: 'Q-Sort data deleted successfully' });
    })
    .catch((err) => {
      console.log('Error deleting Q-Sort data:', err);
      console.log('SQL Error details:', err.sqlMessage);
      res.status(400).json({ 
        Error: true, 
        Message: 'Error deleting Q-Sort data: ' + (err.sqlMessage || err.message)
      });
    });
});

module.exports = router; 