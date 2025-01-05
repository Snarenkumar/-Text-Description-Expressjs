import express from "express"


const app = express();
const port =3010 ;


app.get("/",(req,res)=>{

    res.render("index.ejs")
})



app.listen(port ,()=>
{
    console.log(`server is hosted in this port : ${port}`)
})