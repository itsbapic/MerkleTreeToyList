const express = require('express');
const verifyProof = require('../utils/verifyProof');

const port = 1225;

const app = express();
app.use(express.json());

// Get the hardcoded merkle root here representing the whole nice list
require('dotenv').config()
const MERKLE_ROOT = process.env.MERKLE_ROOT

app.post('/gift', (req, res) => {
  // grab the parameters from the front-end
  const { proof, name } = req.body;

  // The prove that a name is in the list 
  const isInTheList = verifyProof(proof, name, MERKLE_ROOT);
  // If proof is valid...
  if (isInTheList) {
    // Log the proof
    console.log(`Proof:\n${JSON.stringify(proof, null, 4)} \n----PROOF VERIFIED----`);
    // Log the proof length (to compare to the log2 of the list length on the client side)
    console.log(`Proof Length: ${proof.length}`);
    // Send confirmation to client
    res.send("You got a toy robot!");
  }
  else {
    // Send failure response to client
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port} !`);
});
