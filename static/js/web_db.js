function initialization_db(obj){
    // 数据库数据结果
    var db = openDatabase('Workflow_db', '1.0', 'Test DB', 2 * 1024 * 1024);
    obj(db)

}