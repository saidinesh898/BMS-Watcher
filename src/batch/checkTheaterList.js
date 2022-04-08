require('../db/mongoose')
const { base64encode, base64decode } = require('nodejs-base64')
const fetch = require('node-fetch');
const Watcher = require('../models/watcher');
const  urlencode = require('urlencode');
const sendEmail = require('../smtp/sendEmail');


let server = ''

if(process.env.NODE_ENV === "development" ){
     server = 'http://localhost'
}
else{
     server = ''
}


const checkTheaterList = async() => {
    console.log("Check Theater List Batch Started")
    dataDump = await Watcher.find()


    //console.log(dataDump)

     dataDump.forEach(async element => {
        //console.log(urlencode(element.TicketURL))
        let fetchURL = server + '/theaterList/'+ urlencode(element.TicketURL)
        
       const response =  await fetch(fetchURL);
       let body =  await response.text();
       if(element.TheaterList === body){
           console.log('No New Cinema Added for',element.TicketURL)

       }
       else{
        console.log('ALERT NEW CINEMA ADDED for', element.TicketURL)
        let oldTheaterArray = element.TheaterList.split(",")
        let newTheaterArray = body.split(",")

     //   let newTheater = []

        let newTheater = newTheaterArray.filter((theaterName)=>
            oldTheaterArray.indexOf(theaterName) == -1
            )

        
     /*   newTheaterArray.forEach(theater => {
            let counter = 0
         oldTheaterArray.forEach(oldTheater => {
             if(theater===oldTheater){
                counter++
                
             }
         })
         if(counter===0){
            newTheater.push(theater)
         }
        });*/

      let  newTheaterObj = {
           newTheater,
           movie : element.movieName,
           TicketURL : element.TicketURL

       }

     
       sendEmail(newTheaterObj)
       console.log("Batch Ended")
       }
    });
}


module.exports = checkTheaterList