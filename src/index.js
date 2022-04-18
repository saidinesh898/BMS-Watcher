const express = require('express')
require('./db/mongoose')
const request = require("postman-request")
const fetch = require('node-fetch');
const { range } = require('express/lib/request');
const  cron = require('node-cron');
const { base64encode, base64decode } = require('nodejs-base64');
const Watcher = require('./models/watcher');
const checkTheaterList = require('./batch/checkTheaterList.js');

require('dotenv').config()


const app = express()

const port = process.env.PORT || 80

app.use(express.json())


app.get('/vicky', (req,res)=> {
  res.send("Arun Why are you Gay???")
})


app.get("/theaterList/:id", async(req, res) => {
    const url = req.params.id
    let encodedURL = base64encode(url); 
    let watcher = new Watcher({
        EncodedURL : encodedURL,
        TicketURL : url
    })

    try {
      const watchers = await Watcher.findOne({ TicketURL:url })
  //    console.log(watchers)
      if (watchers!=null) {
          console.log("We are Already Tracking this Link", url)
      }

      else{
        console.log("Link Added to the Watcher")
        try {
          await watcher.save()
               //res.status(201).send(watcher)
        } 
        catch (e) {
              //  res.status(400).send(watcher)
        }
      }
      } catch (e) {
      res.status(500).send(e)
    }
  
    //let decoded = base64decode(encoded);

   // console.log(EncodedURL)
  


  if(url.includes("bookmyshow")){

    const response = await fetch(url);
    let body = await response.text();
    body = body.replace('\n','');
    body = body.replace('\t','');

    var words = body.split('=');
    let c = 0
    let indexs = []
    let movieNameIndex = ''
    let movieNameJunk = ''
    words.forEach(function (item, index) {

      if(item.includes("sticky-filtertitle")){
        movieNameIndex = index
      }
      
    if(item.includes("data-name"))
    {
        c++
        indexs.push(index+1)
    }
        
    });

    movieNameJunk = words[movieNameIndex]
    let movieNameJunk1  = movieNameJunk.split('>');
    movieNameJunk1[1]  = movieNameJunk1[1].split('<');
    let movieName = movieNameJunk1[1][0]
 



    let theatersList = []
  indexs.forEach(element => {
    theaters = words[element]
    theater = theaters.split('\t')
    theatersList.push(theater[0])
 });

 sanitizedTlist = theatersList.toString().replace(/'/g, "");
 sanitizedTlist = sanitizedTlist.replace(/"/g, "");
 sanitizedTlist = sanitizedTlist.replace(/,/g, " ");
 sanitizedTlist = sanitizedTlist.replace(/\n/g, ",");

 let filter = {TicketURL:url}
 let update = { NumberOfTheaters: c, TheaterList:sanitizedTlist, movieName:movieName}

 let changes = await Watcher.findOneAndUpdate(filter, update);

    await res.status(200).send(sanitizedTlist)
  



}

else if(url.includes("ticketnew")){

 const response = await fetch(url);
    let body = await response.text();
    body = body.replace('\n','');
    body = body.replace('\t','');

    var words = body.split('=');
    let c = 0
    let indexs = []
    let movieNameIndex = ''
    let movieNameJunk= ''
    words.forEach(function (item, index) {

      if(item.includes("<h2>")){
        movieNameIndex = index
      }
      


    if(item.includes("data-sfilter"))
    {
        c++
        indexs.push(index+1)
    }
  
        
    });
      
        movieNameJunk = words[movieNameIndex]
    let movieNameJunk1  = movieNameJunk.split('<h2>');
    movieNameJunk1[1]  = movieNameJunk1[1].split('</h2>');
    let movieName = movieNameJunk1[1][0]


 // console.log(c,indexs)
    let theatersList = []
  indexs.forEach(element => {
    theaters = words[element]
    theater = theaters.split('data-filter')
    theatersList.push(theater[0])
 });

 sanitizedTlist = theatersList.toString().replace(/'/g, "");


 let filter = {TicketURL:url}

 let update = { NumberOfTheaters: c, TheaterList: sanitizedTlist, movieName:movieName}


 let changes = await Watcher.findOneAndUpdate(filter, update);


    await res.status(200).send(sanitizedTlist)

}
else{
    res.status(200).send({
        "error": "invalid link We only Support BookMyShow and Ticketnew At the Moment"
       })
}


})

checkTheaterList()

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
  checkTheaterList()
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

