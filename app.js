const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const _=require("lodash")
const app = express();
 
main().catch(err => console.log(err))
 
async function main(){
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
 
const itemSchema = ({
  name: String
})
 
const listSchema=({
  name:String,
  items:[itemSchema]
})
const List=mongoose.model("List",listSchema)
const Item = mongoose.model('Item',itemSchema)
 
const item1 = new Item({
  name: "Welcome to your todolist!"
})
 
const item2 = new Item({
  name: "Hit the + button to add a new item"
})
 
const item3 = new Item({
  name: "<--Hit this to delete an item."
})
 
const defaultItems = [item1,item2,item3]
 
 
app.get("/", async function(req, res) {
 
  var foundItems = await Item.find()
  
  if(foundItems.length === 0){
  Item.insertMany(defaultItems)
  .then(function () {
    console.log("Successfully saved default items to DB")
  })
  .catch(err=>console.log(err));
  res.redirect("/")
  }else{
    res.render("index", {listTitle: "Today", newListItems: foundItems});
  }
});

app.post('/delete',async function(req,res){
  const checkboxitem=req.body.checkbox;
  const listname=req.body.listname;
  if(listname==="Today"){
    Item.findByIdAndRemove(checkboxitem).then(function(){
      console.log("successfully deleteditem");
    }).catch(function(err){
      console.log(err);
    })
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkboxitem}}}).then(function(){
      console.log("successfully deleteditem");
    }).catch(function(err){
      console.log(err);
    })
    res.redirect("/"+listname);
    // const foundlist=await List.findOne({name:listname});
    // foundlist.items.findByIdAndRemove(checkboxitem).then(function(){
    //   console.log("successfully deleteditem");
    // }).catch(function(err){
    //   console.log(err);
    // })
    // res.redirect("/");
   
  }
  
})
 


app.get("/:customelistname",async function(req,res){
  const customelist=_.capitalize(req.params.customelistname);
  const found=await List.findOne({name:customelist})
  if(!found){
    const list=new List({
      name:customelist,
      items:defaultItems
    })
    list.save().then(function(){
      console.log("successfully added items")
    }).catch(err=>console.log(err));
    res.redirect("/"+customelist)
  }
  else{
    res.render("index",{
      listTitle:found.name,
      newListItems:found.items
    })
  }
  
})



app.post("/",async function(req, res){
 
  const itemName = req.body.newitem;
  const listName= req.body.list;
  const item = new Item({
    name: itemName
  });
 if(listName==="Today"){
  item.save().then(function(){
    res.redirect("/");
  })
  .catch(function (err) {
    console.log(err)
  })
 }else{
  const foundlist=await List.findOne({name:listName})
  foundlist.items.push(item)
  foundlist.save().then(function(){
    res.redirect("/"+listName);
  })
  .catch(function (err) {
    console.log(err)
  })
  
 }
  
 
});
 

 
app.get("/about", function(req, res){
  res.render("about");
});
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
 
}