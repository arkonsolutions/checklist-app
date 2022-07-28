DELETE FROM [CheckList];
INSERT INTO [CheckList] (id, parentId, title) VALUES ("ea5273bb-38b7-430a-b9a1-ec109eb99474", null, "test parent");
INSERT INTO [CheckList] (id, parentId, title) VALUES ("dd3c5d89-2d96-4ce2-a37b-3a5b7caccde9", null, "test parent 2");
INSERT INTO [CheckList] (id, parentId, title) VALUES ("3878b9db-4bc1-4e18-8e6e-56bed225ea74", "dd3c5d89-2d96-4ce2-a37b-3a5b7caccde9", "test child");
INSERT INTO [CheckList] (id, parentId, title) VALUES ("349ba03f-e44b-4f35-8b13-564de95a935b", "dd3c5d89-2d96-4ce2-a37b-3a5b7caccde9", "test child");
INSERT INTO [CheckList] (id, parentId, title) VALUES ("cc38d2f9-5c73-426c-b660-cf03a4c10404", "3878b9db-4bc1-4e18-8e6e-56bed225ea74", "test subchild");