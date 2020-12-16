const path = require("path");
const express = require("express");
const gitexRequestHandler = require('./gitexRequestHandler')
const server = express();

const PORT = 3000;

server.use(express.static(path.join(__dirname, "client")));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


/*****************************************
 *               ROUTES                  *
 *****************************************/
// Post request with `gitUrl` field in body returns tokei analysis as json object
server.post("/analyze", async (req, res) => {
  console.log(req.body)

  const { user, repo } = req.body;
  const reponame = user.replace('/','').replace('.','') + '/' + repo.replace('/','').replace('.','');
  
  try {
    var start = new Date()
    const repoinfo = await gitexRequestHandler(reponame);
    var end = new Date() - start;
  
    console.log('it took %ds', end/1000);
    res.send(JSON.stringify({ result: '==== request took '+end/1000+'s ====\n' + repoinfo }));
  
  }
  catch (err) {
    res.send(JSON.stringify({ result: "An error occured. Maybe the entered repo is invalid?\n(Keep in mind that only github is supported for now.)" }));
  }

})

server.listen(PORT, () => console.log(`Server is running at ${PORT}...`));
