function non_empty(data,whether=0,list_name=[]){
	//非空效验
	//var data = form.val('example_if');
	console.log(data,'------------------------------ccccccccccccccccccccccc------------------------------');
	for (var val in data){
		if(data[val]=='' || data[val]==null){	
			//layer.msg("草率啦?可不得检查下表单?");
			if (list_name.indexOf(val) == -1){
			    if (whether==0){
					return val
				}else if(whether==1){
					continue
				}
			}else{
			    if (whether==0){
					continue
				}else if(whether==1){
					return val
				}
			}
			return val
		}
	}
	return 2
}