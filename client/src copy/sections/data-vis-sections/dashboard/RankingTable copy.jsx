import React, { useState, useEffect } from "react";

export default function RankingTable() {
  const data = [
    { id: 1, statements: "a" },
    { id: 2, statements: "b" },
    { id: 3, statements: "c" },
    { id: 4, statements: "d" },
    { id: 5, statements: "e" },
    { id: 6, statements: "f" },
    { id: 7, statements: "g" },
    { id: 8, statements: "h" },
    { id: 9, statements: "i" },
  ];

  const [selectedValues, setSelectedValues] = useState(
    data.reduce((acc, { id }) => {
      acc[id] = 0; // 默认值是 0
      return acc;
    }, {})
  );

  const [warnings, setWarnings] = useState({
    groupNeg2: "",
    groupNeg1: "",
    groupZero: "",
    groupPos1: "",
    groupPos2: "",
  });

  // 每次选项更新后重新计算并更新警告信息
  useEffect(() => {
    const groupNeg2 = data.filter(({ id }) => selectedValues[id] === -2);
    const groupNeg1 = data.filter(({ id }) => selectedValues[id] === -1);
    const groupZero = data.filter(({ id }) => selectedValues[id] === 0);
    const groupPos1 = data.filter(({ id }) => selectedValues[id] === 1);
    const groupPos2 = data.filter(({ id }) => selectedValues[id] === 2);

    const newWarnings = {};

    // 动态计算警告信息
    newWarnings.groupNeg2 = getGroupWarning(groupNeg2, 1);
    newWarnings.groupNeg1 = getGroupWarning(groupNeg1, 2);
    newWarnings.groupZero = getGroupWarning(groupZero, 3);
    newWarnings.groupPos1 = getGroupWarning(groupPos1, 2);
    newWarnings.groupPos2 = getGroupWarning(groupPos2, 1);

    setWarnings(newWarnings); // 更新警告状态
  }, [selectedValues]); // 依赖于 selectedValues，每次更新都会触发

  // 计算并返回当前组的警告信息
  const getGroupWarning = (group, targetCount) => {
    const groupLength = group.length;
    if (groupLength !== targetCount) {
      const difference = targetCount - groupLength;
      return difference > 0 ? `Increase ${difference} statements` : `Decrease ${Math.abs(difference)} statements`;
    }
    return ""; // 没有问题时返回空字符串
  };

  const handleRadioChange = (id, value) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [id]: value, // 更新选中值
    }));
  };

  const handleReset = () => {
    setSelectedValues(
      data.reduce((acc, { id }) => {
        acc[id] = 0; // 将所有值重置为 0
        return acc;
      }, {})
    );
  };

  // 检查是否所有组的数量都符合要求
  const isValid = Object.values(warnings).every((warning) => warning === "");

  // 获取警告颜色
  const getWarningColor = (groupName) => {
    return warnings[groupName] ? "#f8d7da" : "#e3f2fd"; // 如果有警告显示红色
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      {/* Reset 按钮 */}
      <div style={{ width: "80%", display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button
          onClick={handleReset}
          className="btn btn-danger"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "2px solid #dc3545",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            backgroundColor: "#dc3545",
            color: "white",
          }}
        >
          Reset
        </button>
      </div>

      {/* 表格容器 */}
      <div
        style={{
          width: "80%",
          border: "1px solid #bbb",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#f8f9fa",
        }}
      >
        <table className="table table-bordered" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
          <tbody>
            {[
              { label: "+2", groupName: "groupPos2" },
              { label: "+1", groupName: "groupPos1" },
              { label: "0", groupName: "groupZero" },
              { label: "-1", groupName: "groupNeg1" },
              { label: "-2", groupName: "groupNeg2" },
            ].map(({ label, groupName }) => {
              const group = data.filter(({ id }) => selectedValues[id] === (label === "+2" ? 2 : label === "+1" ? 1 : label === "0" ? 0 : label === "-1" ? -1 : -2));
              const warning = warnings[groupName];
              return (
                <React.Fragment key={label}>
                  <tr style={{ backgroundColor: getWarningColor(groupName) }}>
                    <td
                      align="center"
                      style={{
                        width: "10%",
                        color: "#2452b5",
                        fontSize: "120%",
                        fontWeight: "bold",
                      }}
                    >
                      {label}
                    </td>
                    <td
                      align="center"
                      colSpan={2}
                      style={{
                        width: "40%",
                        color: "#c70808",
                        fontStyle: "italic",
                      }}
                    >
                      {warning || ""}
                    </td>
                    {["-2", "-1", "0", "+1", "+2"].map((val) => (
                      <td key={val} align="center" style={{ width: "10%" }}>
                        {val}
                      </td>
                    ))}
                  </tr>

                  {group.map((statement) => (
                    <tr
                      key={statement.id}
                      style={{
                        backgroundColor:
                          statement.id % 2 === 0 ? "#f9f9f9" : "white",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td style={{ width: "10%" }}></td>
                      <td style={{ width: "10%", fontWeight: "bold" }}>
                        {statement.id}
                      </td>
                      <td style={{ width: "30%" }}>{statement.statements}</td>
                      {[-2, -1, 0, 1, 2].map((val) => (
                        <td key={val} align="center" style={{ width: "10%" }}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`option-${statement.id}`}
                            value={val}
                            checked={selectedValues[statement.id] === val}
                            onChange={() => handleRadioChange(statement.id, val)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 提交按钮 */}
      {isValid && (
        <div style={{ marginTop: "20px", width: "80%", display: "flex", justifyContent: "center" }}>
          <button
            className="btn btn-success"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              backgroundColor: "#28a745",
              color: "white",
              border: "2px solid #28a745",
            }}
          >
            Submit ranking
          </button>
        </div>
      )}
    </div>
  );
}
