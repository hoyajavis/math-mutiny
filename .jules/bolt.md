## 2026-07-07 - N+1 query issue on IndexedDB with Dexie
**Learning:** Found an N+1 query issue on a local IndexedDB using `db.factStates.where('userId').equals(currentUser).toArray()`. The original code queried the DB inside a loop, once per skill, even though the overall query logic was simple.
**Action:** When calculating grouped statistics (e.g. mastery for multiple skills), query the DB once outside the loop to retrieve all records and then perform the aggregation via array filters.
