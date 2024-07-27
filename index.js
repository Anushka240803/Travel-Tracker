import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"World",
  password:"Anushka@2408",
  port:5432,
});

db.connect();
const app = express();
const port = 3000;
let count=[];
let count2=[];
var countries=[];
// var i= 6;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function visited(){
  db.query("SELECT country FROM vcountries",(err,res)=>{
    if(err){
      console.error("Error executing query ",err.stack);
      res.status(500).json(err);
    }else{
      count=res.rows;
    }
  });
};
visited();
app.get("/", async (req, res) => {
  //Write your code here.
  
  count.forEach((code)=>{
    if(!countries.includes(code.country)){
      countries.push(code.country);
      console.log(code);
    }
  });
  res.render("index.ejs",{total:countries.length,
    countries:countries,
  });
});
var c;
app.post("/add", async(req,res)=>{
  const result=await db.query("SELECT country_code FROM countries WHERE country_name = $1",[req.body["country"]]);
  console.log(result.rows);
  if(result.rows.length==1){
    db.query("INSERT INTO vcountries (country) VALUES ($1)",[result.rows[0].country_code]);
    
  }
  visited();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});