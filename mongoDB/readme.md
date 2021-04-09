// db 数据库操作
db 				// 查询当前数据库
show dbs 	// 查询所有数据库
use ***						// 创建数据库
db.stats()				// 查询当前数据库状态
db.getMongo() 		// 查看当前DB的连接机器地址
db.dropDatabase() //删除数据库

//Collection 集合操作
创建集合 db.createCollection('collection name')
获取指定名称 db.getCollection('collection name')
获取所有名称 db.getCollectionNames()
获取当前db下所有集合的状态 db.printCollectionStats()

//文档操作
插入操作 db.conllctionName.insert([obj])  db.conllction name.insert(obj)  db.conllction name.save(obj)
查询当前集合 db.conllctionName.find()