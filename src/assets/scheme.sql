CREATE TABLE IF NOT EXISTS [CheckList] (
    id VARCHAR PRIMARY KEY,
    parentId VARCHAR,
    isTemplate BOOLEAN DEFAULT 0,
    title TEXT NOT NULL,
    description TEXT,
    dueDate DATETIME,
    isDone BOOLEAN NOT NULL DEFAULT 0,
    isDoneDate DATETIME,
    CONSTRAINT fk_parent_checklist
      FOREIGN KEY ([parentId]) 
      REFERENCES [CheckList] (id)
      ON DELETE CASCADE
) WITHOUT ROWID;

CREATE VIEW IF NOT EXISTS [CheckList_Aggregated] 
AS
SELECT 
    root.id,
    root.parentId,
    root.isTemplate,
    root.title,
    root.description,
    root.dueDate,
    root.isDoneDate,
    cnts.childrenCount, 
    cnts.childrenDone, 
    root.isDone
FROM [CheckList] root
LEFT JOIN (
    SELECT
        parent.id, 
        COUNT(child.id) AS childrenCount,
        (SELECT COUNT(*) from [CheckList] where parentId = parent.id AND isDone = 1) as childrenDone
    FROM
                 [CheckList] parent
      LEFT JOIN [CheckList] child
        ON child.parentId = parent.id
    GROUP BY parent.id
) as cnts
WHERE root.id == cnts.id;