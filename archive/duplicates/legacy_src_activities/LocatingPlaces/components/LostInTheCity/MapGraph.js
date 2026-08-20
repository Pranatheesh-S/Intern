export const MAP_NODES = {
  Corner_NW: { id: 'Corner_NW', x: 10.0, y: 39.4, name: 'West Crossroad' },
  Start: { id: 'Start', x: 20.5, y: 39.4, name: 'Railway Station' },
  J1: { id: 'J1', x: 31.0, y: 39.4, name: 'Junction 1' },
  J3: { id: 'J3', x: 68.0, y: 39.4, name: 'Junction 3' },
  J4: { id: 'J4', x: 83.5, y: 39.4, name: 'School Dead-End' },
  Corner_SW: { id: 'Corner_SW', x: 10.0, y: 68.0, name: 'South-West Corner' },
  J5: { id: 'J5', x: 31.0, y: 68.0, name: 'Junction 4' },
  J7: { id: 'J7', x: 68.0, y: 68.0, name: 'Junction 6' },
  Bank: { id: 'Bank', x: 80.5, y: 68.0, name: 'Bank' },
};

export const MAP_EDGES = {
  Corner_NW: { East: 'Start', South: 'Corner_SW' },
  Start: { West: 'Corner_NW', East: 'J1' },
  J1: { East: 'J3', South: 'J5', West: 'Start' },
  J3: { West: 'J1', East: 'J4', South: 'J7' },
  J4: { West: 'J3' },
  Corner_SW: { North: 'Corner_NW', East: 'J5' },
  J5: { West: 'Corner_SW', North: 'J1', East: 'J7' },
  J7: { West: 'J5', North: 'J3', East: 'Bank' },
  Bank: { West: 'J7' },
};

// Returns whether the Bank is reachable from 'nextNodeId'
// without revisiting any nodes currently in 'visitedHistory'.
export const isBankReachable = (nextNodeId, visitedHistory) => {
  if (nextNodeId === 'Bank') return true;
  
  const visited = new Set(visitedHistory);
  const queue = [nextNodeId];
  const seen = new Set([nextNodeId]);
  
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === 'Bank') return true;
    
    const neighbors = Object.values(MAP_EDGES[current] || {});
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !seen.has(neighbor)) {
        seen.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return false;
};
