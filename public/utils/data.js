// 用于组件通信
// data.js

// 新增: 管理所有组的工具函数
let groups = {}; // 用于存储所有创建的组
export function manageDateGroups(groupId, action, key, value) {
  if (action === "create") {
    if (!groups[groupId]) {
      groups[groupId] = { begindate: "", enddate: "" };
    }
  } else if (action === "update") {
    if (groups[groupId]) {
      groups[groupId][key] = value;
    }
  } else if (action === "check") {
    // 新增 check 动作，直接返回指定 groupId 的组信息或表示不存在的信息
    return groups.hasOwnProperty(groupId)
      ? groups[groupId]
      : `Group with ID ${groupId} does not exist.`;
  }

  // 对于 "create" 和 "update" 动作，依然返回整个 groups 对象
  // 而对于 "check" 动作，上述已直接返回检查结果，此处逻辑不变主要是为了保持原有返回行为一致性
  return groups;
}
