const express = require("express");
const bodyParser = require("body-parser");
const https = require('node:https');
const audienceID = "bbf690e7326677";

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(request,response) {
    response.sendFile(__dirname+"/signup.html");
});

app.post("/failure", function(request,response) {
    response.redirect("/");
});

app.post("/", function(request,response) {

    var data = {
        members :  [
            {
                email_address :  request.body.emailAddress,
                status : "subscribed",
                merge_fields : {
                    FNAME : request.body.firstName,
                    LNAME : request.body.lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/"+audienceID; 
    const options = {
        method : "POST",
        auth: "jm:f1c45777afa3790a641426d3f732a7cef333-us21"
    } ;

  const req =  https.request(url,options,function(res){

    res.on("data", function(data) {
        var parsedData = JSON.parse(data);
        console.log(response.statusCode);
    });

        if (res.statusCode === 200) {
                response.sendFile(__dirname+"/success.html");
        } else {
                response.sendFile(__dirname+"/failure.html");
        }

    });

    req.write(jsonData);
    req.end();
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});


