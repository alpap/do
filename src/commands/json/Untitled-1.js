
const keyw = "c.d"
let objw = {
  a: "a",
  b: "b",
  c: { d: { e: { f: 3 } } }
}


// let path_arr = []
// let new_depth = 0
// console.log("here");
// if (Array.isArray(path)) {
//   path_arr = path
//   new_depth = path.length - 1
// } else {
//   path_arr = path.split(".")
//   new_depth = path.split(".").length - 1
// }

function delete_key(json, path) {
  if (path.length === 0) return
  const path_arr = path
  const selected_key = path_arr.shift()

  for (const key of Object.keys(json)) {
    if (key === selected_key) {
      if (path.length !== 0) {
        delete_key(json[key], path_arr, path.length - 1)
        return
      }
      delete json[selected_key]
      return
    }
  }
}


delete_key(objw, keyw.split("."))
console.log(objw);