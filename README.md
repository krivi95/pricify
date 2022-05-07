# Pricify - System for storing prices of consumer goods on the blockchain

## Introduction

This repository contains a system for `storing prices of consumer goods and services` 📈. Price history is stored on a `Ethereum` blockchain.
The Pricify system provides a solution to a `problem of fake sales and prices` that consumers are facing while making purchasing decisions.

This system aims to fix the problem of intransparent sales and prices, bring the transparency, and help the consumers make `better economic decisions` while shopping 🛍️🛒.

`Price history of items/services is stored and recorded on Ethereum blockchain via smart contracts` ([more about smart contracts](#smart-contracts)). By storing the price updates and changes
on a public blockchain, anyone can verify the validity of the current discount for the item/service. That will disenable the merchants from manipulating the prices.


More info:
- [Pricify slides](https://github.com/krivi95/pricify/files/8645068/Pricify.system.slides.pdf)
- [Pricify website](https://www.pricify.me/)

![Screenshot 2022-05-07 at 14 01 28](https://user-images.githubusercontent.com/30963594/167253443-11b56f16-9056-476b-8b9d-f976ed8f8a7a.png)

This implementation was done as part of master thesis for the [Master's degree in Software Engineering](https://www.etf.bg.ac.rs/en/studies/master-studies/electrical-and-computer-engineering-2019/software-engineering#gsc.tab=0).

## Demo

`Consumers` have a possibility to determine the real price of the item and to verify the validity of the advertised sales:
- In `physical stores` - by scanning the QR code on the item, which will redirect them to the web page for sales validation and price history
- In `online stores` - by clicking the link for validating the price of the item; redirects to the same web page for sales validation and price history


https://user-images.githubusercontent.com/30963594/167253807-56206b2d-4f4d-43b9-b4e9-99da9435eb23.mp4



## Architecture and technologies

### Technologies

For the MVP of this system [Ethereum](https://ethereum.org/en/) blockchain was used. `Smart contracts` were implemented in [Solidity](https://docs.soliditylang.org/en/v0.8.13/). Other tools that are used for implementation and testing of smart contracts are [Ganache](https://trufflesuite.com/ganache/), [Truffle](https://trufflesuite.com/truffle/), [MetaMask wallet](https://metamask.io/). 

`Frontend` web app that interacts with smart contracts is implemented in [ReactJS](https://reactjs.org/) using [Material UI](https://mui.com/) component library.

`Backend` is serverless, utilizing services from:
- `Firebase`: [Firebase Authentication](https://firebase.google.com/products/auth?gclid=Cj0KCQjwsdiTBhD5ARIsAIpW8CKLuiPUL4VLpYAYCMZJIW8tuymDIY3q0PLva-4ebC06kmlBfG6SoEwaAlWiEALw_wcB&gclsrc=aw.ds), [Firebase Realtime Database](https://firebase.google.com/products/realtime-database?gclid=Cj0KCQjwsdiTBhD5ARIsAIpW8CICYYfUKYzdLaeKW4tC6KhUWcOpib9Uv-eLdfm-a9VeGy45salhi8AaAjybEALw_wcB&gclsrc=aw.ds)
- `AWS`: [Amplify](https://aws.amazon.com/amplify/), [Route 53](https://aws.amazon.com/route53/)
- `Infura`: [Infura Ethereum API](https://infura.io/product/ethereum)

### Sustem architecture overview
![image](https://user-images.githubusercontent.com/30963594/167254897-2a57ec05-23f9-4f6d-8479-dfefcccf927d.png)


## Smart Contracts

Smart contracts are in the `/contracts` dir. They are implemented in [Solidity](https://docs.soliditylang.org/en/v0.8.13/). Some of the smart contracts are used from [OpenZeppelin](https://openzeppelin.com/):
- [Access Control](https://docs.openzeppelin.com/contracts/4.x/access-control)
- [Ownable](https://docs.openzeppelin.com/contracts/2.x/api/ownership#Ownable)

In the `/test` dir there are tests for the smart contracts. After testing locally, contracts are deployed to the [Ropsten testnet](https://ropsten.etherscan.io/).

![image](https://user-images.githubusercontent.com/30963594/167254919-611c265d-4472-4b80-b4c4-467b8083d455.png)


## How to run?

### Configuration

Config:
- In the `truffle-config.js` you may see and change the Ethereum networks.
- In the root dir rename the `.env.template` to `.env` and add your mnemonic.
- In the `/client` dir rename the `.env.template` to `.env` and set Firebase credentials and config.

Requirements: 
- NodeJS version: `v10.15.0`.  
- Solidity compiler version: `v0.6.6`.  
- Truffle: `v5.1.40`.

### Rinning

Setting up and running the application :
- Install truffle:  `npm install truffle -g`
- Install npm moduls: 
  1. `npm install` in the root directory (for truffle and unit tests)
  2. `cd client` & `npm install` (for ReactJS app)
- Start `Ganache` and update truffle-config file if necessary with the network parameters.
- Compile and migrate smart contracts to the local blockchain (from truffle console): `truffle migrate --network "development/ganache-local" --reset`.
- Start react app: `cd client` & `npm start`.

To test the smart contracts:
- In the root directory: `truffle test`.
