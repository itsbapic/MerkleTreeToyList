const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const prompt = require("prompt-sync")({ sigint: true });

const serverUrl = 'http://localhost:1225';

require('dotenv').config()
const serverID = process.env.SERVER_TOKEN
const token = process.env.USER_TOKEN


async function main() {

  /*
  // DISCORD STUFF
  // Require the necessary discord.js classes
  const { Client, Events, GatewayIntentBits } = require('discord.js');

  // Create a new client instance
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  // Log in to Discord with your client's token
  client.login(token);


  // // When the client is ready, run this code (only once)
  // // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    const guild = client.guilds.cache.get(INSERT TOKEN HERE);
    const members = guild.members.fetch();
    return members;
  })

  console.log(serverID);
  const guild = await client.guilds.fetch(INSERT TOKEN HERE)
  const members = await guild.members.fetch() // returns Collection
  const members = await fetchmembs()
  console.log(members);
  */

  // TODO: how do we prove to the server we're on the nice list? 
  // We prove it by creating a merkle tree from our list:
  const merkleTreeList = new MerkleTree(niceList);
  // Then get the root of our Merkle Tree
  const root = merkleTreeList.getRoot();
  console.log(root);
  // Name to verify
  const name = prompt("What is your name? ");

  const index = niceList.findIndex(n => n === name);
  const proof = merkleTreeList.getProof(index);
  console.log(proof);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    proof: proof,
    name: name
  });

  console.log({ gift });
}

async function fetchmembs() {
  const guild = client.guilds.cache.get(911045401006719006);
  const members = await guild.members.fetch();
  return members;
}

main();