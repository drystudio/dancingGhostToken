import { task } from 'hardhat/config'
import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-jest-plugin'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
task('accounts', 'Prints signer accounts').setAction(async (args, hre) => {
  const accounts = await hre.ethers.getSigners()
  console.log(accounts.map((account) => account.address))
})

task('mint', 'Mint a new ERC721 token')
  .addParam('address', 'ERC721 contract address')
  .setAction(async (args, hre) => {
    const account = (await hre.ethers.getSigners())[0]

    const Token = await hre.ethers.getContractFactory('DancingGhostToken')
    const token = Token.attach(args.address)

    const result = await token.mint(account.address)
    console.log(result)
  })

task('setTokenUri', 'Set token uri')
  .addParam('tokenId', 'token ID')
  .addParam('uri', 'uri')
  .setAction(async (args, hre) => {
    const Token = await hre.ethers.getContractFactory('DancingGhostToken')
    const token = Token.attach(args.address)

    const result = await token.setTokenUri(
      hre.ethers.BigNumber.from(args.token).toHexString(),
      args.uri
    )
    console.log(result)
  })

task('getTokenUri', 'Prints token uri')
  .addParam('address', 'ERC721 contract address')
  .addParam('tokenId', 'token ID')
  .setAction(async (args, hre) => {
    const Token = await hre.ethers.getContractFactory('DancingGhostToken')
    const token = Token.attach(args.address)

    const result = await token.tokenURI(
      hre.ethers.BigNumber.from(args.token).toHexString()
    )
    console.log(result)
  })

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    rinkeby: {
      url: 'https://rinkeby.infura.io',
      accounts: [],
    },
  },
  solidity: '0.8.0',
}

export default config
