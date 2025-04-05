//
//  IFQ717 Web Development Capstone
//
//  index.js - expose most API endpoints
//
//

require("dotenv").config();
const express = require('express');
const router = express.Router();
const authorization = require("../middleware/authorization");
const projectManagementRouter = require('./projectManagement');

const llm = "o1-mini";
const llmUrl = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.LLM_API_KEY;

const gResponseCache = new Array();

// Generic get cache function
function getResponseFromCache(url) {
  return gResponseCache[url];
}

// Generic put cache function
function putResponseIntoCache(url, value) {
  gResponseCache[url] = value;
}

// Async function to call open AI LLM
async function queryLLM(url, llm, prompt) {
  const body = {
    model: llm,
    messages: [
      {
        role: "user",
        content: "you are a data scientist",
      },
      {
        role: "user",
        content: "Always in a response of less than 400 words - " + prompt,
      },
    ],
  };

  // Generic get cache function
  if (getResponseFromCache(prompt) === undefined) {

    // otherwise hit openAI's server
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((result) => {
        try {
          if (result.choices) {
          } else {
            if (result.error.code === "invalid_api_key") {
              throw Error(
                "Error: Please contact your system administrator to have your API key configured."
              );
            } else {
              throw Error(result.error.message);
            }
          }
        } catch (error) {
          return error.message;
        }

        // store and return response
        putResponseIntoCache(prompt, result.choices[0].message.content);
        return result.choices[0].message.content;
      })
      .catch((error) => {
        throw error;
      });
  } else {
    // Return the response from the cache
    return getResponseFromCache(prompt);
  }
}

// AI Analysis endpoint
router.post("/api/ai/query_llm", function (req, res, next) {
  const prompt = req.body.prompt + " " + req.body.data;

  // Query the LLM
  queryLLM(llmUrl, llm, prompt)
    .then((response) => {
      res.json({ Error: false, Message: "Success", response: response });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error - " + JSON.stringify(err) });
    });
});

// Main Localis data endpoint
router.get("/api/combined_data", function (req, res, next) {
  if (getResponseFromCache(req.url) === undefined) {
    req.db
      .from("combined_data")
      .select(
        "sample_date",
        "lga_name",
        "average_historical_occupancy",
        "average_daily_rate",
        "average_length_of_stay",
        "average_booking_window"
      )
      .modify((qb) => {
        if (req.query.LGAName !== undefined) {
          qb.where("lga_name", "=", req.query.LGAName);
        }
        if (req.query.start !== undefined) {
          qb.where("sample_date", ">=", req.query.start);
        }
        if (req.query.end !== undefined) {
          qb.where("sample_date", "<=", req.query.end);
        }
      })
      .orderBy("sample_date", "lga_name")
      .then((rows) => {
        putResponseIntoCache(req.url, rows);
        res.json({ Error: false, Message: "Success", data: rows });
      })
      .catch((err) => {
        res.json({ Error: true, Message: "Error - " + err.sqlMessage });
      });
  } else {
    res.json({
      Error: false,
      Message: "Success",
      data: getResponseFromCache(req.url),
    });
  }
});

// 先注册分布数据的路由
router.get("/api/respondent/:id/distribution", function (req, res, next) {
  const respondentId = req.params.id;
  
  // 通过 respondent -> study -> distribution 的关系获取数据
  req.db
    .from("respondent")
    .join("study", "respondent.studyID", "=", "study.studyID")
    .join("distribution", "study.distributionID", "=", "distribution.distributionID")
    .select("distribution.*")
    .where("respondent.respondentID", "=", respondentId)
    .first()
    .then((distribution) => {
      if (!distribution) {
        return res.json({ Error: true, Message: 'Distribution not found' });
      }
      
      res.json({ Error: false, Message: 'Success', data: distribution.distributionDetails});
    })
    .catch((err) => {
      res.json({ Error: true, Message: 'Error - ' + err.sqlMessage });
    });
});

// 然后注册其他路由
router.get("/api/statements/:respondentId", function (req, res, next) {
  const respondentId = req.params.respondentId;
  
  // 通过 respondent -> study -> studyStatement -> statement 的关系获取数据
  req.db
    .from("respondent")
    .join("study", "respondent.studyID", "=", "study.studyID")
    .join("studyStatement", "study.studyID", "=", "studyStatement.studyID")
    .join("statement", "studyStatement.statementID", "=", "statement.statementID")
    .select(
      "statement.statementID",
      "statement.short",
      "statement.statementText"
    )
    .where("respondent.respondentID", "=", respondentId)
    .then((rows) => {
      res.json({ Error: false, Message: "Success", data: rows });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error - " + err.sqlMessage });
    });
});

//qData
router.get("/api/participants", function (req, res, next) {
  req.db
    .from("participants")
    .select(
      "Participant",
      "S1",
      "S2",
      "S3",
      "S4",
      "S5",
      "S6",
      "S7",
      "S8",
      "S9",
      "S10",
      "S11",
      "S12",
      "S13",
      "S14",
      "S15",
      "S16",
      "S17",
      "S18",
      "S19"
    )
    .then((rows) => {
      res.json({ Error: false, Message: "Success", data: rows });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error - " + err.sqlMessage });
    });
});

// length of stay only endpoint
router.get("/api/length_of_stay", function (req, res, next) {
  req.db
    .from("length_of_stay")
    .select(
      "sample_date",
      "lga_name",
      "average_length_of_stay",
      "average_booking_window"
    )
    .then((rows) => {
      res.json({ Error: false, Message: "Success", length_of_stay: rows });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error - " + err.sqlMessage });
    });
});

// occupancy and daily rate endpoint
router.get("/api/occupancy_daily_rate", function (req, res, next) {
  req.db
    .from("occupancy_daily_rate")
    .select(
      "sample_date",
      "lga_name",
      "average_historical_occupancy",
      "average_daily_rate"
    )
    .then((rows) => {
      res.json({
        Error: false,
        Message: "Success",
        occupancy_daily_rate: rows,
      });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error - " + err.sqlMessage });
    });
});

// Combined data for a specific LGA
router.get("/api/combined_data/:LGAName", function (req, res, next) {
  req.db
    .from("combined_data")
    .select(
      "sample_date",
      "lga_name",
      "average_historical_occupancy",
      "average_daily_rate",
      "average_length_of_stay",
      "average_booking_window"
    )
    .where("lga_name", "=", req.params.LGAName)
    .modify((qb) => {
      if (req.query.start !== undefined) {
        qb.where("sample_date", ">=", req.query.start);
      }
      if (req.query.end !== undefined) {
        qb.where("sample_date", "<=", req.query.end);
      }
    })
    .then((rows) => {
      res.json({ Error: false, Message: "Success", data: rows });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error - " + err.sqlMessage });
    });
});

/*
// Get a unique list of spending categories
router.get("/api/spend_categories", function (req, res, next) {
  
  if (getResponseFromCache(req.url) === undefined) {
    //console.log("not hitting cache");
    req.db
      .from("spend_data")
      .distinct("category")
      .orderBy("category")
      .then((rows) => {
        //console.log(rows);
        let data = rows.map((cat) => cat.category);
        putResponseIntoCache(req.url, data);
        res.json({ Error: false, Message: "Success", data: data });
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error - " + err.sqlMessage });
      });
  } else {
    res.json({ Error: false, Message: "Success", data: getResponseFromCache(req.url) });
  }
});

// Get the spending data
router.get("/api/spend_data", function (req, res, next) {

  if (getResponseFromCache(req.url) === undefined) {
    //console.log("not hitting cache");
    req.db
      .from("spend_data")
      .select(
        "week_commencing",
        "lga_name",
        "category",
        "spend",
        "cards_seen",
        "no_txns"
      )
      .modify((qb) => {
        if (req.query.LGAName !== undefined) {
          qb.where("lga_name", "=", req.query.LGAName);
        }
        if (req.query.start !== undefined) {
          qb.where("week_commencing", ">=", req.query.start);
        }
        if (req.query.end !== undefined) {
          qb.where("week_commencing", "<=", req.query.end);
        }
      })
      .orderBy("week_commencing", "lga_name")
      .then((rows) => {
        //console.log(rows);
        putResponseIntoCache(req.url, rows);
        res.json({ Error: false, Message: "Success", data: rows });
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error - " + err.sqlMessage });
      });
  } else {
    res.json({ Error: false, Message: "Success", data: getResponseFromCache(req.url) });
  }
});*/

// 添加 Q-sort 提交路由
router.post("/api/qsort", function (req, res, next) {
  const qSortData = req.body;
  
  if (!Array.isArray(qSortData) || qSortData.length === 0) {
    return res.json({ Error: true, Message: "Invalid data format" });
  }

  // 获取第一个记录的 respondentID
  const respondentId = qSortData[0].respondentID;

  // 获取 studyID 和最新的 roundID
  req.db
    .from("respondent")
    .join("study", "respondent.studyID", "=", "study.studyID")
    .join("studyRound", "study.studyID", "=", "studyRound.studyID")
    .select("study.studyID", req.db.raw("MAX(studyRound.roundID) as latestRoundID"))
    .where("respondent.respondentID", "=", respondentId)
    .groupBy("study.studyID")
    .first()
    .then((result) => {
      if (!result) {
        throw new Error("找不到对应的研究轮次");
      }

      const studyId = result.studyID;
      const roundId = result.latestRoundID;

      // 获取 studyStatementID 映射
      return req.db
        .from("studyStatement")
        .select("studyStatementID", "statementID")
        .where("studyID", "=", studyId)
        .then((statements) => {
          
          if (!statements || statements.length === 0) {
            throw new Error("找不到对应的研究陈述");
          }

          // 创建 statementID 到 studyStatementID 的映射
          const statementMap = statements.reduce((acc, stmt) => {
            acc[stmt.statementID] = stmt.studyStatementID;
            return acc;
          }, {});

          // 准备批量插入的数据
          const insertData = qSortData.map(item => {
            const studyStatementID = statementMap[item.statementID];
            if (!studyStatementID) {
              throw new Error(`找不到对应的 studyStatementID: ${item.statementID}`);
            }
            return {
              respondentID: item.respondentID,
              roundID: roundId,
              studyStatementID: studyStatementID,
              qSortValue: item.qSortValue,
              adminID: item.adminID
            };
          });

          // 批量插入数据
          return req.db
            .from("qSort")
            .insert(insertData)
            .then(() => {
              res.json({ Error: false, Message: "Q-sort 数据提交成功" });
            });
        });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error - " + err.sqlMessage });
    });
});

// 添加 statement1 表的路由
router.get("/api/statement1", function (req, res, next) {
  req.db
    .from("statement1")
    .select("*")
    .then((rows) => {
      res.json({ Error: false, Message: "Success", data: rows });
    })
    .catch((err) => {
      res.json({ Error: true, Message: "Error - " + err.sqlMessage });
    });
});

// 最后注册 projectManagementRouter


module.exports = router;
