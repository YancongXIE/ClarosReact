import React, { useMemo, useState } from 'react';
import { extractCombinations, UpSetJS } from '@upsetjs/react';

export default function GettingStarted() {
  // 假数据
  const elems = useMemo(
    () => [
      { name: 'A', sets: ['S1', 'S2'] },
      { name: 'B', sets: ['S1'] },
      { name: 'C', sets: ['S2'] },
      { name: 'D', sets: ['S1', 'S3'] },
    ],
    []
  );

  // 提取组合
  const { sets, combinations } = useMemo(() => extractCombinations(elems), [elems]);

  // 状态：用户选择
  const [selection, setSelection] = useState(null);
  const [ordering, setOrdering] = useState('name'); // 排序方式 (name, cardinality, degree)
  const [minSetMembers, setMinSetMembers] = useState(1); // 最小成员数量
  const [maxSetMembers, setMaxSetMembers] = useState(3); // 最大成员数量
  const [maxCombinations, setMaxCombinations] = useState(10); // 最大组合数量
  const [selectedSets, setSelectedSets] = useState(['S1', 'S2']); // 用户选择的集合



  const selectedSetObjects = sets.filter(set => selectedSets.includes(set.name));

  const combinations1 = useMemo(
    () => ({
      min:minSetMembers,
      max:maxSetMembers,
      limit:maxCombinations,
    }),
    [minSetMembers, maxSetMembers, maxCombinations]
  );

  return (
    <div style={{ width: '100%', height: '600px', margin: '20px auto' }}>
      <h2>UpSet.js Chart</h2>

      {/* 用户交互控制部分 */}
      <div>
        <label>
          Ordering:
          <select onChange={e => setOrdering(e.target.value)} value={ordering}>
            <option value="name">Name</option>
            <option value="cardinality">Cardinality</option>
            <option value="degree">Degree</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Min Set Members:
          <input
            type="number"
            value={minSetMembers}
            onChange={e => setMinSetMembers(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Max Set Members:
          <input
            type="number"
            value={maxSetMembers}
            onChange={e => setMaxSetMembers(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Max # of Combinations:
          <input
            type="number"
            value={maxCombinations}
            onChange={e => setMaxCombinations(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>Select Sets:</label>
        <div>
          {sets.map((set, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  value={set.name} // 使用 set.name 作为 value
                  checked={selectedSets.includes(set.name)} // 如果集合已选中，则勾选
                  onChange={e => {
                    const { checked, value } = e.target;
                    setSelectedSets(prevSelectedSets => {
                      if (checked) {
                        // 如果勾选了，加入 selectedSets
                        return [...prevSelectedSets, value];
                      } else {
                        // 如果取消勾选，从 selectedSets 中移除
                        return prevSelectedSets.filter(item => item !== value);
                      }
                    });
                  }}
                />
                {set.name} {/* 显示集合名称 */}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* UpSetJS 图表展示 */}
      <UpSetJS
        sets={sets}
        combinations={combinations1} 
        width={780}
        height={400}
        selection={selection}
        onHover={setSelection}
        selectionColor="orange"
        hoverColor="lightblue"
        hasSelectionOpacity={0.3}
        exportButtons={true}
      />
    </div>
  );
}
