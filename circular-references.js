const nodes = [
  {
    "address": "A1",
    "formulaAST": {
      "nodeType": "ref",
      "address": "A2"
    }
  },
  {
    "address": "A2",
    "formulaAST": {
      "nodeType": "ref",
      "address": "A3"
    }
  },
  {
    "address": "A3",
    "formulaAST": {
      "nodeType": "ref",
      "address": "A4"
    }
  },
  {
    "address": "A4",
    "formulaAST": {
      "nodeType": "number",
      "address": "A5"
    }
  }
]

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

console.log(checkCircularReference(nodes))
