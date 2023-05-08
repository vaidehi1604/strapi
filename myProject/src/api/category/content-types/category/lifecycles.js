module.exports = {
    afterCreate(event) {  
        // Connected to "Save" button in admin panel
        const { result } = event;
      
        try{
           
            strapi.plugins['email'].services.email.send({

              to: 'khushal@gmail.com',
              from: 'vaidehip@zignuts.com', // e.g. single sender verification in SendGrid
              cc: 'valid email address',
              bcc: 'valid email address',
              replyTo: 'valid email address',
              subject: 'The Strapi Email plugin worked successfully',
              text: `Name : ${result.name}`, // Replace with a valid field ID
              html: 'Hello world!', 
                
            })
        } catch(err) {
            console.log(err);
        }
    }
}