//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running at port 3000");
});
//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//Setting up MailChimp
mailchimp.setConfig({
  //****
  apiKey: "Your api key",
  //
  server: "us17",
});
//As soon as the sign in button is pressed execute this
app.post("/", function (req, res) {
  //*** INPUT html attributesL******************************
  const firstName = req.body.firstName;
  const secondName = req.body.secondName;
  const email = req.body.email;
  //list audience id from mailchimp
  const listId = "your audience list ID";

  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: secondName,
    email: email,
  };
  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html");
    console.log(`Success The contact's id is ${response.id}.`);
  }

  //if anything goes wrong send the error page
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});
