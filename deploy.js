require("dotenv").config();
const Web3 = require("web3");
const BN = require("bn.js");

const web3 = new Web3(process.env.HMY_NODE_URL);
let ethMasterAccount = web3.eth.accounts.privateKeyToAccount(
  process.env.PRIVATE_KEY
);
web3.eth.accounts.wallet.add(ethMasterAccount);
web3.eth.defaultAccount = ethMasterAccount.address;
ethMasterAccount = ethMasterAccount.address;

async function deployMultiSig() {
  const contractJson = require("./build/contracts/MultiSigWallet.json");
  const contract = new web3.eth.Contract(contractJson.abi);
  let owners = [
    process.env.OWNER1,
    process.env.OWNER2
  ];
  const response = await contract
    .deploy({
      data: contractJson.bytecode,
      arguments: [owners, process.env.THRESHOLD],
    })
    .send({
      from: ethMasterAccount,
      gas: process.env.GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  const addr = `${response.options.address}`;
  console.log("Deployed MultiSig contract to", addr);
  return addr;
}
// deployMultiSig().then(()=>{});

async function deployMaggot() {
  const contractJson = require("./build/contracts/MaggotToken.json");
  const contract = new web3.eth.Contract(contractJson.abi);
  const response = await contract
    .deploy({
      data: contractJson.bytecode,
      arguments: [process.env.OWNER1],
    })
    .send({
      from: ethMasterAccount,
      gas: process.env.GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  const addr = `${response.options.address}`;
  console.log("Deployed Maggot contract to", addr);
  return addr;
}
// deployMaggot().then(()=>{});

async function deployRotten() {
  const contractJson = require("./build/contracts/RottenToken.json");
  const contract = new web3.eth.Contract(contractJson.abi);
  const response = await contract
    .deploy({
      data: contractJson.bytecode,
      arguments: [process.env.MAGGOT, 40],
    })
    .send({
      from: ethMasterAccount,
      gas: process.env.GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  const addr = `${response.options.address}`;
  console.log("Deployed Maggot contract to", addr);
  return addr;
}
// deployRotten().then(()=>{});

async function changeMaggotOwnerToRotten() {
  const contractJson = require("./build/contracts/MaggotToken.json");
  const contract = new web3.eth.Contract(contractJson.abi, process.env.MAGGOT);
  const response = await contract.methods
    .transferOwnership(process.env.ROTTEN)
    .send({
      from: ethMasterAccount,
      gas: process.env.GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  console.log(response);
  return response;
}
// changeMaggotOwnerToRotten().then(()=>{});

async function addMultSigWalletAsMinterToRotten() {
  const contractJson = require("./build/contracts/RottenToken.json");
  const contract = new web3.eth.Contract(contractJson.abi, process.env.ROTTEN);
  const response = await contract.methods
    .addMinter(process.env.MULTISIG)
    .send({
      from: ethMasterAccount,
      gas: process.env.GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  console.log(response);
  return response;
}
// addMultSigWalletAsMinterToRotten().then(()=>{});

async function addHarmonyBridgeAsMinterToRotten() {
  const contractJson = require("./build/contracts/RottenToken.json");
  const contract = new web3.eth.Contract(contractJson.abi, process.env.ROTTEN);
  const response = await contract.methods
    .addMinter(process.env.BRIDGE)
    .send({
      from: ethMasterAccount,
      gas: process.env.GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  console.log(response);
  return response;
}
// addHarmonyBridgeAsMinterToRotten().then(()=>{});

async function renounceMinterForOwner() {
  const contractJson = require("./build/contracts/RottenToken.json");
  const contract = new web3.eth.Contract(contractJson.abi, process.env.ROTTEN);
  const response = await contract.methods
    .renounceMinter()
    .send({
      from: ethMasterAccount,
      gas: process.env.GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
  console.log(response);
  return response;
  // console.log(await contract.methods.isMinter(process.env.MULTISIG).call());
}
// renounceMinterForOwner().then(()=>{});

async function tryMinting() {
  const contractJson = require("./build/contracts/RottenToken.json");
  const contract = new web3.eth.Contract(contractJson.abi, process.env.ROTTEN);
  // const response = await contract.methods
  //   .mint(process.env.USER1, web3.utils.toWei("100", "ether"))
  //   .send({
  //     from: ethMasterAccount,
  //     gas: process.env.GAS_LIMIT,
  //     gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
  //   });
  // console.log(response);
  // return response;
  console.log(await contract.methods.isMinter(process.env.BRIDGE).call());
}
// tryMinting().then(()=>{});
