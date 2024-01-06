const mongoose = require('mongoose')

const connectDb= mongoose.connect("mongodb+srv://Amritkum360:7004343011@cluster0.1bafcyc.mongodb.net/my-business") .then(()=>{
    console.log("db ready..")
}) .catch(()=>{
    console.log("data not working")
})


module.exports = connectDb