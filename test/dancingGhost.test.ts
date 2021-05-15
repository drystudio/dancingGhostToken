const { ethers } = require('hardhat')
import { Signer } from 'ethers'

describe('DancingGhostToken', () => {
  let owner: Signer
  let user: Signer
  let token: any

  beforeAll(async () => {
    ;[owner, user] = await ethers.getSigners()

    const DancingGhostToken = await ethers.getContractFactory(
      'DancingGhostToken',
      owner
    )
    token = await DancingGhostToken.deploy()
    await token.deployed()
  })

  describe('mint', () => {
    it('should work', async () => {
      const userAddress = await user.getAddress()
      await expect(token.mint(userAddress)).resolves.toBeTruthy()
      await expect(token.balanceOf(userAddress)).resolves.toEqual(
        ethers.BigNumber.from(1)
      )
      await expect(token.ownerOf(ethers.BigNumber.from(0))).resolves.toBe(
        userAddress
      )
    })

    it('should only allow owner mint token', async () => {
      const userAddress = await user.getAddress()
      const tokenForUser = token.connect(user)
      await expect(tokenForUser.mint(userAddress)).rejects.toThrow(
        'VM Exception while processing transaction: revert Ownable: caller is not the owner'
      )
    })
  })

  describe('set token uri', () => {
    it('should work', async () => {
      const ownerAddress = await owner.getAddress()
      await token.mint(ownerAddress)

      await token.setTokenURI(
        ethers.BigNumber.from(0),
        'https://test.ghost-token.com/token/0'
      )

      await expect(token.tokenURI(ethers.BigNumber.from(0))).resolves.toBe(
        'https://test.ghost-token.com/token/0'
      )
    })

    it('should only allow owner to set tokenURI', async () => {
      const tokenForUser = token.connect(user)
      await expect(
        tokenForUser.setTokenURI(
          ethers.BigNumber.from(0),
          'https://test.ghost-token.com/token/0'
        )
      ).rejects.toThrow(
        'VM Exception while processing transaction: revert Ownable: caller is not the owner'
      )
    })
  })
})
