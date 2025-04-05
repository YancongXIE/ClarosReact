const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authorization = require("../middleware/authorization");

// 受访者登录
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证请求体
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "请求不完整 - 需要用户名和密码",
      });
    }

    // 从数据库获取受访者信息
    const respondents = await req.db
      .from("respondent")
      .select("respondentID", "username", "rawPassword", "studyID", "adminID")
      .where("username", username.trim());

    if (respondents.length === 0) {
      return res.status(401).json({
        success: false,
        message: "用户不存在",
      });
    }

    const respondent = respondents[0];


    // 处理密码比较
    const trimmedPassword = password.trim();
    if (trimmedPassword !== respondent.rawPassword) {
      return res.status(401).json({
        success: false,
        message: "密码错误",
      });
    }

    // 创建 JWT token
    const expires_in = 60 * 60 * 48; // 48小时
    const token = jwt.sign(
      { 
        username,
        role: "respondent",
        respondentId: respondent.respondentID,
        studyId: respondent.studyID,
        adminID: respondent.adminID
      }, 
      process.env.JWT_SECRET,
      { expiresIn: expires_in }
    );

    // 返回token和用户数据
    res.status(200).json({
      success: true,
      token,
      token_type: "Bearer",
      expires_in,
      user: {
        id: respondent.respondentID,
        username: respondent.username,
        studyId: respondent.studyID,
        adminID: respondent.adminID,
        userType: "respondent"
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "服务器错误，无法完成登录",
    });
  }
});

module.exports = router; 