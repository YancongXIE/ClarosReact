const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    // 从 token 中提取用户信息
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 根据用户类型查询不同的表
    if (decoded.role === "respondent") {
      // respondent用户的处理逻辑
      req.db
        .from("respondent")
        .select("*")
        .where("username", "=", decoded.username)
        .then((users) => {
          if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
          }

          const user = users[0];
          // 将respondent用户信息添加到请求对象
          req.user = {
            id: user.respondentID,
            username: user.username,
            role: "respondent",
            studyId: user.studyID
          };
          next();
        })
        .catch((err) => {
          console.error("Database error:", err);
          res.status(500).json({ message: "Database error" });
        });
    } else {
      // admin用户（包括client和manager）的处理逻辑
      req.db
        .from("users")
        .select("*")
        .where("email", "=", decoded.email)
        .then((users) => {
          if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
          }

          const user = users[0];
          // 将admin用户信息添加到请求对象
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          };
          next();
        })
        .catch((err) => {
          console.error("Database error:", err);
          res.status(500).json({ message: "Database error" });
        });
    }
  } catch (err) {
    console.error("Authorization error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
