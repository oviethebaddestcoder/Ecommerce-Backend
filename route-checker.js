const fs = require("fs");
const path = require("path");

const ROUTES_DIR = path.join(__dirname, "routes"); // adjust if your routes folder is elsewhere

// Regex to roughly detect Express route patterns with parameters
// Matches things like:
// router.get("/:userId")
// router.post("/product/:id")
// router.put("/:param1/:param2")
// but flags ones with root param only or missing param names
const ROUTE_PARAM_REGEX = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;

// Helper: Check if route path contains ambiguous param patterns
function isAmbiguousRoute(routePath) {
  // Split by '/' and analyze segments
  const segments = routePath.split("/").filter(Boolean);
  
  // If the first segment is a param (like ':id') without a static prefix, that's suspicious
  if (segments.length && segments[0].startsWith(":")) return true;

  // If multiple param segments without static parts between, also suspicious
  // Example: /:userId/:productId
  if (segments.filter(seg => seg.startsWith(":")).length > 1) {
    // But allow if separated by static segment? Could refine further
    return true;
  }

  return false;
}

function scanRoutes(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanRoutes(filePath); // recurse
    } else if (file.endsWith(".js")) {
      const content = fs.readFileSync(filePath, "utf-8");
      let match;
      while ((match = ROUTE_PARAM_REGEX.exec(content)) !== null) {
        const [fullMatch, method, routePath] = match;
        if (isAmbiguousRoute(routePath)) {
          console.log(`⚠️ Ambiguous route detected in ${file} -> ${method.toUpperCase()} ${routePath}`);
        }
      }
    }
  }
}

console.log("🔍 Scanning routes for ambiguous patterns...");
scanRoutes(ROUTES_DIR);
console.log("Scan complete.");
