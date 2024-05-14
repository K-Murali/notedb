const mongoose=require('mongoose');
const {Schema}=mongoose;
const Article=new Schema(
    {
       
        
    }
)
const Articles=mongoose.model("articles",Article);
module.exports=Articles;