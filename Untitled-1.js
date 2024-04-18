function getDepth(o) {
  return Object(o) === o ? 1 + Math.max(-1, ...Object.values(o).map(getDepth)) : 0
}

const s = {q: 'eqwee', w: 'weqe'}

const sss = getDepth(s)
console.log(sss)
