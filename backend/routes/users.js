//
//  IFQ717 Web Development Capstone
//
//  users.js - expose user related API endpoints
//
//


var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authorization = require("../middleware/authorization");
// const authRateLimiter = require("../middleware/authRateLimiter");
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});

// router.use(authRateLimiter);

/* GET users listing. */
router.get("/profile", authorization, async (req, res) => {
  try {
    let user;
    
    if (req.user.role === "respondent") {
      // 如果是respondent用户，从respondent表查询
      user = await req.db("respondent")
        .where({ username: req.user.username })
        .first();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        user: {
          id: user.respondentID,
          username: user.username,
          role: "respondent",
          studyId: user.studyID,
          adminID: user.adminID
        },
      });
    } else {
      // 如果是admin用户（包括client和manager），从users表查询
      user = await req.db("users")
        .where({ email: req.user.email })
        .first();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          adminID: user.id
        },
      });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { email, password } = req.body;

    // 验证请求体
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "请求不完整 - 需要邮箱和密码",
      });
    }

    // 首先尝试从 respondent 表查询
    const respondents = await req.db.from("respondent").select("*").where("username", email);

    if (respondents.length > 0) {
      // 如果是 respondent 用户
      const respondent = respondents[0];
      
      // 比较密码
      const match = await bcrypt.compare(password, respondent.rawPassword);
      if (!match) {
        return res.status(401).json({
          success: false,
          message: "密码错误",
        });
      }

      // 创建 JWT token
      const expires_in = 60 * 60 * 48; // 48小时
      const token = jwt.sign(
        { 
          username: respondent.username,
          userId: respondent.respondentID,
          role: "respondent"
        }, 
        process.env.JWT_SECRET,
        { expiresIn: expires_in }
      );

      // 返回token和用户数据
      return res.status(200).json({
        success: true,
        token,
        token_type: "Bearer",
        expires_in,
        user: {
          id: respondent.respondentID,
          username: respondent.username,
          role: "respondent",
          studyId: respondent.studyID
        },
      });
    }

    // 如果不是 respondent，尝试从 users 表查询
    const users = await req.db.from("users").select("*").where("email", email);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "用户不存在",
      });
    }

    const user = users[0];

    // 比较密码
    const match = await bcrypt.compare(password, user.hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "密码错误",
      });
    }

    // 创建 JWT token
    const expires_in = 60 * 60 * 48; // 48小时
    const token = jwt.sign(
      { 
        email,
        userId: user.id,
        role: user.role
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
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        adminID: user.id
      },
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "服务器错误，无法完成登录",
      });
    }
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // 验证输入
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 检查邮箱是否已存在
    const existingUser = await req.db("users").where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 创建新用户
    const [userId] = await req.db("users").insert({
      email,
      hash,
      firstName,
      lastName,
      role: role || 'admin' // 设置用户角色，默认为 admin
    });

    // 生成 JWT token
    const token = jwt.sign(
      { email, userId, role: role || 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role: role || 'admin'
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

router.put("/profile", authorization, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await req.db("users")
      .where({ email: req.user.email })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await req.db("users")
      .where({ email: req.user.email })
      .update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
      });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.delete("/delete", authorization, async function (req, res, next) {
  try {
    const userEmail = req.user.email;

    // Fetch user from DB
    const users = await req.db
      .from("users")
      .select("*")
      .where("email", userEmail);

    if (users.length === 0) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Delete user from DB
    await req.db.from("users").where("email", userEmail).del();

    res.status(200).json({ success: true, message: "User account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Database error" });
  }
});

// 获取所有用户（仅限manager）
router.get('/all', authorization, async function (req, res, next) {
  try {
    
    // 从数据库获取完整的用户信息
    const user = await req.db
      .from('users')
      .select('*')
      .where('email', '=', req.user.email)
      .first();
    
    
    if (!user || user.role !== 'manager') {
      return res.status(403).json({
        message: 'Insufficient permissions'
      });
    }

    // 查询所有用户
    const users = await req.db
      .from('users')
      .select('id', 'email', 'role', 'firstName', 'lastName')
      .orderBy('email');


    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 删除用户（仅限manager）
router.delete('/:id', authorization, async (req, res) => {
  try {
    console.log('Delete user request received');
    console.log('Request user:', req.user);
    console.log('Target user ID:', req.params.id);

    // 检查用户角色
    if (!req.user || !req.user.role) {
      console.error('User role not found in request');
      return res.status(403).json({ message: 'User role not found' });
    }

    if (req.user.role !== 'manager') {
      console.error('User is not a manager:', req.user.role);
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // 检查要删除的用户是否存在
    const targetUser = await req.db('users').where('id', req.params.id).first();
    if (!targetUser) {
      console.error('Target user not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // 不允许删除自己
    if (targetUser.id === req.user.id) {
      console.error('Attempt to delete own account');
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // 执行删除操作
    await req.db('users').where('id', req.params.id).del();
    console.log('User deleted successfully');

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// 修改用户密码（仅限manager）
router.put('/:id/password', authorization, async (req, res) => {
  try {
    console.log('=== Change Password Request ===');
    console.log('Request user:', req.user);
    console.log('Target user ID:', req.params.id);
    console.log('New password provided:', !!req.body.password);

    // 检查用户角色
    if (!req.user || !req.user.role) {
      console.error('User role not found in request');
      return res.status(403).json({ message: 'User role not found' });
    }

    if (req.user.role !== 'manager') {
      console.error('User is not a manager:', req.user.role);
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // 检查要修改密码的用户是否存在
    const targetUser = await req.db('users').where('id', req.params.id).first();
    if (!targetUser) {
      console.error('Target user not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // 不允许修改自己的密码
    if (targetUser.id === req.user.id) {
      console.error('Attempt to change own password');
      return res.status(400).json({ message: 'Cannot change your own password' });
    }

    // 验证新密码
    if (!req.body.password || req.body.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    // 更新密码
    await req.db('users')
      .where('id', req.params.id)
      .update({ hash });

    console.log('Password changed successfully');
    res.json({ 
      success: true,
      message: 'Password changed successfully',
      user: {
        id: targetUser.id,
        email: targetUser.email,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName
      }
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// 获取所有 admin 用户
router.get('/clients', authorization, async (req, res) => {
  try {
    // 检查用户权限
    if (!req.user || (req.user.role !== 'manager' && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // 查询所有 admin 角色的用户
    const clients = await req.db
      .from('users')
      .select('id', 'email', 'firstName', 'lastName', 'role')
      .where('role', '=', 'admin')
      .orderBy('email');

    res.json(clients);
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
