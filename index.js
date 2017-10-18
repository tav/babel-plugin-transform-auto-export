// Public Domain (-) 2017-present The Babel Auto Export Plugin Authors.
// See the Babel Auto Export Plugin UNLICENSE file for details.

const letterA = "A".charCodeAt(0)
const letterZ = "Z".charCodeAt(0)

// isExportable returns a boolean indicating whether the variable identifier is
// exportable, i.e. if it starts with a capital letter between A and Z.
function isExportable(ident) {
  let first = ident.charCodeAt(0)
  return first >= letterA && first <= letterZ
}

// AutoExport provides a Babel visitor that automatically exports all top-level
// declarations of variables that start with an upper case.
function AutoExport({types: t}) {
  return {
    visitor: {
      Program(path) {
        path.get("body").forEach(function(path) {
          if (!path.isDeclaration() || path.isExportDeclaration()) {
            return
          }
          let ident = ""
          let node = path.node
          switch (node.type) {
            case "ClassDeclaration":
              ident = node.id.name
              break
            case "FunctionDeclaration":
              ident = node.id.name
              break
            case "VariableDeclaration":
              // Skip declarations of multiple variables.
              if (node.declarations.length > 1) {
                return
              }
              ident = node.declarations[0].id.name
              break
          }
          if (!ident) {
            // Assuming we exhaust all potential cases above, We should ideally
            // never reach this. Exit as a precautionary measure for now.
            return
          }
          if (!isExportable(ident)) {
            return
          }
          path.replaceWith(t.exportNamedDeclaration(node, [], null))
        })
      },
    },
  }
}

module.exports = AutoExport
