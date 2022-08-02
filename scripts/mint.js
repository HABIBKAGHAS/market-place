const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");
async function mint() {
    const nftMarketplace = await ethers.getContract("NftMarketPlace");
    const basicNft = await ethers.getContract("BasicNft");
    console.log("Minting NFTs...");
    const mintTx = await basicNft.mintNft();
    const mintTxRecipt = await mintTx.wait(1);
    const tokenId = mintTxRecipt.events[0].args.tokenId;
    console.log("token Id ", tokenId.toString());
    console.log("nftAddress ", basicNft.address);
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000));
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
