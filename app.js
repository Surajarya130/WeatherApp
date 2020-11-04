const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res){
    res.render("index");
})

app.post("/", function(req, res){
    const cityName = req.body.cityName;  

    https.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=c837ef75c5f6e0b4195a45b4c5e2e2c8`, function(succ){
    succ.on("data", (info) => {
        const weatherData = JSON.parse(info);


        if(weatherData.cod == 404){
            res.render("home", {
                cityName: cityName, 
                tempBody: "NA"
            })
        }else{  
            const icon = weatherData.weather[0].icon;
            const imgUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            const country = weatherData.sys.country;
            const temp = weatherData.main.temp;
            const date = new Date().toLocaleString().replace(',','');
            const desc = weatherData.weather[0].description.toUpperCase();
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            // console.log(temp);
            res.render("home", {
                cityName: cityName, 
                tempBody: temp, 
                country: country, 
                imgUrl: imgUrl,
                description: desc,
                date: date,
                windSpeed: windSpeed,
                humidity: humidity
            });
        }
    })
    });
})

app.listen(process.env.port || 3000, function(){
    console.log("running on port 3000");                            
})