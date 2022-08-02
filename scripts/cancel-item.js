const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const TOKEN_ID = 2;
async function cancel() {
    const nftMarketplace = await ethers.getContract("NftMarketPlace");
    const basicNft = await ethers.getContract("BasicNft");
    const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
    await tx.wait(1);
    console.log("item cancelled");
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
