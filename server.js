import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/filteredimage", async (req, res) => {
    try {
      //  1. validate the image_url query
      const {image_url} = req.query;
      if(!image_url){
        return res.status(422).send("missing image")
      }

      if(Array.isArray(image_url)){
        return res.status(422).send("Only one image can be processed at a time")
      }

      //  2. call filterImageFromURL(image_url) to filter the image
      const result = await filterImageFromURL(image_url)

      //  3. send the resulting file in the response
      res.sendFile(result, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          return res.status(500).send("Error sending file");
        }
  
        // 4. deletes any files on the server on finish of the response
        deleteLocalFiles([result])
          .then(() => console.log("File deleted successfully"))
          .catch((error) => console.error("Error deleting file:", error));
      });
    } catch (error) {
      res.status(500).send(error.message)
    } 
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
