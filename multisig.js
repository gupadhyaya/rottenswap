require("dotenv").config();
const BN = require("bn.js");
const Web3 = require("web3");

const web3 = new Web3(process.env.HMY_NODE_URL);
let ethMasterAccount = web3.eth.accounts.privateKeyToAccount(
  process.env.PRIVATE_KEY
);
web3.eth.accounts.wallet.add(ethMasterAccount);
web3.eth.defaultAccount = ethMasterAccount.address;
ethMasterAccount = ethMasterAccount.address;

async function submitTx(destination, value, data) {
  const contractJson = require("./build/contracts/MultiSigWallet.json");
  const contract = new web3.eth.Contract(
    contractJson.abi,
    process.env.MULTISIG
  );
  return await contract.methods
    .submitTransaction(destination, value, data)
    .send({
      from: ethMasterAccount,
      gas: process.env.GAS_LIMIT,
      gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
    });
}

async function confirmTx(transactionId) {
  const contractJson = require("./build/contracts/MultiSigWallet.json");
  const contract = new web3.eth.Contract(
    contractJson.abi,
    process.env.MULTISIG
  );
  return await contract.methods.confirmTransaction(transactionId).send({
    from: ethMasterAccount,
    gas: process.env.GAS_LIMIT,
    gasPrice: new BN(await web3.eth.getGasPrice()).mul(new BN(1)),
  });
}

async function display(txId) {
  const contractJson = require("./build/contracts/MultiSigWallet.json");
  const contract = new web3.eth.Contract(
    contractJson.abi,
    process.env.MULTISIG
  );
  console.log(await contract.methods.transactions(txId).call());
}

(async function () {
//   const tx = await submitTx(
//     process.env.MAGGOT, //process.env.ROTTEN,
//     0,
//     web3.eth.abi.encodeFunctionCall(
//       {
//         constant: false,
//         inputs: [],
//         name: "renounceMinter",
//         outputs: [],
//         payable: false,
//         stateMutability: "nonpayable",
//         type: "function",
//       },
//       []
//     )
//   );
//   console.log(tx.events.Submission.returnValues);

    // check the multisig tx for txId
    // await display(1);

    let txId = 0;//res.events.Submission.returnValues.transactionId;
    let res = confirmTx(process.env.PRIVATE_KEY, txId);
    console.log(res);

    txId = 1;
    let res = confirmTx(process.env.PRIVATE_KEY, txId);
    console.log(res);

    
})();
