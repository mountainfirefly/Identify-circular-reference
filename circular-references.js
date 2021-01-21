class Cell {
  constructor (address, formulaAST) {
    this.address = address;
    this.formulaAST = formulaAST;
  }
}

class NumberNode {
  constructor(value) {
    this.nodeType = "number"

    this.value = value
  }
}

class FuncNode {
  constructor(funcName, funcArgs) {
    this.nodeType = "func"

    this.funcName = funcName

    this.funcArgs = funcArgs
  }
}

class CellRefNode {
  constructor(address) {
    this.nodeType = "ref";
    this.address = address;
  }
}

// It has circular reference in it.
const input1 = [
  { address: 'A1', formulaAST: new NumberNode(2) },
  { address: 'A2', formulaAST: new FuncNode('add', [new CellRefNode('A1'), new NumberNode(12)]) },
  { address: 'A3', formulaAST: new CellRefNode('B1')  },
  { address: 'A4', formulaAST: new FuncNode('add', [new CellRefNode('A2'), new CellRefNode('A3')]) },
  { address: 'A5', formulaAST: new FuncNode('add', [new CellRefNode('A3'), new CellRefNode('A4')]) },
  { address: 'B1', formulaAST: new CellRefNode('A5') },
]

// It has circular reference in it.
const input2 = [
  { address: 'A1', formulaAST: new NumberNode(2) },
  { address: 'A2', formulaAST: new NumberNode(5) },
  { address: 'A3', formulaAST: new CellRefNode('A4') },
  {
      address: 'A4',
      formulaAST: new FuncNode('add', [new CellRefNode('A1'), new CellRefNode('A2'), new CellRefNode('A3')]),
  },
];

// It does't have circular reference in it.
const input3 = [
  { address: 'A1', formulaAST: new NumberNode(2) },
  { address: 'A2', formulaAST: new NumberNode(5) },
  { address: 'A3', formulaAST: new CellRefNode('A4') },
  {
      address: 'A4',
      formulaAST: new FuncNode('add', [new CellRefNode('A1'), new CellRefNode('A2')]),
  },
];

const isCyclic = (node, allNodes) => {
  const seenAddresses = [node.address];

  const findReference = (node) => {
    if (node.formulaAST && node.formulaAST.nodeType === 'ref') {
      const referencedNodeAddress = node.formulaAST.address;

      if (seenAddresses.includes(referencedNodeAddress)) {
        return true;
      }

      seenAddresses.push(referencedNodeAddress);

      const referencedNode = allNodes.find((nodeVal) => {
        return nodeVal.address === referencedNodeAddress
      })

      return findReference(referencedNode);
    }

    if (node.formulaAST && node.formulaAST.nodeType === 'func') {
      for(var i = 0; i < node.formulaAST.funcArgs.length; i++) {
        const circularReference = findReference(node.formulaAST.funcArgs[i])

        if (circularReference) {
          return findReference(node.formulaAST.funcArgs[i])
        }
      }
    }

    if (node.nodeType === 'ref') {
      const nodeAddress = node.address;

      if (seenAddresses.includes(nodeAddress)) {
        return true;
      }

      seenAddresses.push(nodeAddress);

      const referencedNode = allNodes.find((nodeVal) => {
        return nodeVal.address === nodeAddress
      })

      return findReference(referencedNode);
    }

    return false
  }
  
  return findReference(node)
}

const checkCircularReference = (nodes) => {
  let hasCircularReference = false;
  nodes.forEach((node) => {
    const circularReference = isCyclic(node, nodes)

    if (circularReference) {
      hasCircularReference = true
    }
  })

  return hasCircularReference 
}

const hasCircularReference = checkCircularReference(input1)

console.log(hasCircularReference ? 'It has circular reference inside it.' : 'No circular references found.');
