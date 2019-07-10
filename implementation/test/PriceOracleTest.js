import increaseTime from './helpers/increaseTime'
import BN from 'bn.js'

const PriceOracleV1 = artifacts.require('PriceOracleV1')

contract('PriceOracleV1', function(accounts) {
  const DEFAULT_OPERATOR = accounts[0]

  // 1 satoshi = 1 wei
  const DEFAULT_PRICE = new BN('323200000000')

  const PRICE_EXPIRY_SECONDS = 21600 // 6 hours = 21600 seconds

  describe('#constructor', () => {
    it('deploys', async () => {
      const instance = await PriceOracleV1.deployed()

      const price = await instance.getPrice()
      assert(price.eq(DEFAULT_PRICE))

      const operator = await instance.operator()
      assert.equal(operator, accounts[0])
    })

    it('sets price expiry correctly', async () => {
      const instance = await PriceOracleV1.new(DEFAULT_OPERATOR, DEFAULT_PRICE)

      const deployBlockNumber = (await web3.eth.getTransaction(instance.transactionHash)).blockNumber
      const deployTimestamp = (await web3.eth.getBlock(deployBlockNumber)).timestamp
      const expectedExpiry = new BN(deployTimestamp).add(new BN(PRICE_EXPIRY_SECONDS))

      const expiry = await instance.expiry()
      assert(expiry.eq(expectedExpiry))
    })
  })

  describe('Methods', () => {
    describe('#getPrice', () => {
      it('returns a default price', async () => {
        const instance = await PriceOracleV1.new(
          DEFAULT_OPERATOR,
          DEFAULT_PRICE
        )

        const res = await instance.getPrice.call()
        assert(res.eq(DEFAULT_PRICE))
      })

      it('fails when the price is expired', async () => {
        const instance = await PriceOracleV1.new(
          DEFAULT_OPERATOR,
          DEFAULT_PRICE
        )

        await increaseTime(PRICE_EXPIRY_SECONDS + 1)

        try {
          await instance.getPrice.call()

          assert(false, 'Test call did not error as expected')
        } catch (e) {
          assert.include(e.message, 'Price expired')
        }
      })
    })

    describe('#updatePrice', () => {
      it('sets new price', async () => {
        const newPrice = DEFAULT_PRICE.mul(new BN('0.02'))

        const instance = await PriceOracleV1.new(
          DEFAULT_OPERATOR,
          DEFAULT_PRICE
        )

        const tx = await instance.updatePrice(newPrice)
        const block = await web3.eth.getBlock(tx.receipt.blockNumber)

        const expiry = await instance.expiry.call()

        assert.equal(
          expiry.toNumber(), block.timestamp + PRICE_EXPIRY_SECONDS
        )

        const res = await instance.getPrice.call()
        assert(res.eq(newPrice))
      })

      describe('fails when price delta < 1%', async () => {
        let instance
        const price = new BN('323200000000')

        // DO NOT try to use BN.js, it is a sinkhole of time
        // These test cases were created using `bc`
        // An example:
        // $ bc
        // scale=100
        // 323200000000*1.009
        // etc.

        beforeEach(async () => {
          instance = await PriceOracleV1.new(
            DEFAULT_OPERATOR,
            price
          )
        })

        it('fails upper bound 0.9%', async () => {
          const price2 = new BN('326108800000')
          try {
            await instance.updatePrice(price2)
            assert(false, 'Test call did not error as expected')
          } catch (e) {
            assert.include(e.message, 'Price change is negligible (<1%)')
          }
        })

        it('fails lower bound 0.9%', async () => {
          const price2 = new BN('320317145688')

          try {
            await instance.updatePrice(price2)
            assert(false, 'Test call did not error as expected')
          } catch (e) {
            assert.include(e.message, 'Price change is negligible (<1%)')
          }
        })

        it('passes upper bound 1.1%', async () => {
          const price2 = new BN('326755200000')
          await instance.updatePrice(price2)
        })

        it('passes lower bound 1.1%', async () => {
          const price2 = new BN('319683481701')
          await instance.updatePrice(price2)
        })
      })

      it('fails when msg.sender != operator', async () => {
        const instance = await PriceOracleV1.new(
          DEFAULT_OPERATOR,
          DEFAULT_PRICE
        )

        try {
          await instance.updatePrice(
            new BN('323200000001'),
            { from: accounts[1] }
          )

          assert(false, 'Test call did not error as expected')
        } catch (e) {
          assert.include(e.message, 'Unauthorised')
        }
      })

      it('ignores 1% threshold for update, when the price is close to expiry', async () => {
        const instance = await PriceOracleV1.new(
          DEFAULT_OPERATOR,
          new BN('1')
        )
        const price1 = new BN('323200000001')
        const price2 = new BN('323200000010')

        await instance.updatePrice(price1)

        try {
          await instance.updatePrice(price2)
          assert(false, 'Test call did not error as expected')
        } catch (e) {
          assert.include(e.message, 'Price change is negligible (<1%)')
        }

        const ONE_HOUR = 3600
        await increaseTime(PRICE_EXPIRY_SECONDS - ONE_HOUR)

        await instance.updatePrice(price2)
        const res = await instance.getPrice.call()
        assert(res.eq(price2))
      })
    })
  })
})
