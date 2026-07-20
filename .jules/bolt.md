## 2026-07-07 - N+1 query issue on IndexedDB with Dexie
**Learning:** Found an N+1 query issue on a local IndexedDB using `db.factStates.where('userId').equals(currentUser).toArray()`. The original code queried the DB inside a loop, once per skill, even though the overall query logic was simple.
**Action:** When calculating grouped statistics (e.g. mastery for multiple skills), query the DB once outside the loop to retrieve all records and then perform the aggregation via array filters.

## 2024-07-07 - IndexedDB Write Path Optimization
**Learning:** Performing a bulk deletion/pruning query (e.g. `db.where().below().delete()`) on the critical path of every user interaction (answering a question) creates unnecessary async I/O overhead and can cause micro-stutters during high-speed gameplay like the Boss Fight mode.
**Action:** Debounce, throttle, or use a probabilistic approach (e.g., `Math.random() < 0.01`) for maintenance tasks like log pruning in IndexedDB, rather than running them synchronously alongside critical updates.
