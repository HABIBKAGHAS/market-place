const { assert } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Markeplace", () => {
          let nftMarketPlace, basicNft, player;
          const PRICE = ethers.utils.parseEther("0.1");
          const TOKEN_ID = 0;

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              player = (await getNamedAccounts()).player;
              const accounts = await ethers.getSigners();
              player = accounts[1];
              await deployments.fixture();
              nftMarketPlace = await ethers.getContract("NftMarketPlace");
              basicNft = await ethers.getContract("BasicNft");
              await basicNft.mintNft();
              await basicNft.approve(nftMarketPlace.address, TOKEN_ID);
          });

          it("lists and can be bought", async () => {
              await nftMarketPlace.listItem(basicNft.address, TOKEN_ID, PRICE);
              const playerConnectedNftMarketPlace = await nftMarketPlace.connect(player);
              await playerConnectedNftMarketPlace.buyItem(basicNft.address, TOKEN_ID, {
                  value: PRICE,
              });

              const newOwner = await basicNft.ownerOf(TOKEN_ID);
              const deployerProceeds = await nftMarketPlace.getProceeds(deployer);
              assert(newOwner.toString() == player.address);
              assert(deployerProceeds.toString() == PRICE.toString());
          });
      });
