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
let total;
let country_codes=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function visited(){
  try{
    const response = await db.query("SELECT country FROM vcountries");
    total = response.rows.length;
    response.rows.forEach((data) => {
      country_codes.push(data.country)
    });
  }catch (error){
    console.error("Error executing query ",err.stack);
    res.status(500).json(err);
  }
};



app.get("/", async (req, res) => {
  await visited();
  res.render("index.ejs",{total:total, countries:country_codes});
});


app.post("/add", async(req,res)=>{
  let newCountry = req.body.country.toLowerCase();
  console.log(newCountry);

  const result=await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) = $1",[newCountry]);
  console.log(result.rows);
  if(result.rows.length==1){
    let newCountryCode = result.rows[0].country_code;
    await db.query("INSERT INTO vcountries (country) VALUES ($1)",[newCountryCode]);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
