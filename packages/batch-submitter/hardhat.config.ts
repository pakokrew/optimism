import '@nomiclabs/hardhat-waffle'
import { HardhatUserConfig } from 'hardhat/config'

import "@nomiclabs/hardhat-ethers"

import {
  DEFAULT_ACCOUNTS_HARDHAT,
  RUN_OVM_TEST_GAS,
} from './test/helpers/constants'

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      accounts: DEFAULT_ACCOUNTS_HARDHAT,
      blockGasLimit: RUN_OVM_TEST_GAS * 2,
    },
  },
  mocha: {
    timeout: 50000,
  },
  solidity: {
    version: '0.7.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        '*': {
          '*': ['storageLayout'],
        },
      },
    },
  },
}

export default config
