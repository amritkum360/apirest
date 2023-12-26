const mongoose = require('mongoose')

const connectDb= mongoose.connect("mongodb+srv://amritkum360:7004343011@cluster0.3ssdupo.mongodb.net/my-business",{
    useNewUrlParser: true,
      useUnifiedTopology: true,
}) .then(()=>{
    console.log("db ready..")
}) .catch(()=>{
    console.log("data not working")
})


module.exports = connectDb