#!/usr/bin/env node
const dirtree = require('directory-tree')
const fs = require('fs')

/**
 *
 * takes a directory of hardhat artifacts and builds a markdown table that shows the name of the contract in one column and its address in another column with a hyperlink to etherscan
 *
 */

const networks = {
    1: 'mainnet',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    42: 'kovan',
};

;(async () => {
  console.log(`Writing contract addresses`)

  const deployments = dirtree(`./deployments`)
    .children
    .filter((child) => {
      return child.type === 'directory'
    })
    .map(d => d.name)
    .reverse()

  let md = ''

  md += '# Optimism Regenesis Deployments\n'
  md += `## LAYER 2\n`

  md += `### Chain IDs:\n`
  md += `- Mainnet: 10\n`
  md += `- Kovan: 69\n\n`
  md += `*The contracts relevant for the majority of developers are \`OVM_ETH\` and the cross-domain messengers. The L2 addresses don't change.*\n\n`

  md += `### Predeploy contracts:\n`
  md += `|Contract|Address|\n`
  md += `|--|--|\n`
  md += `|OVM_ETH: | \`0x4200000000000000000000000000000000000006\`\n`
  md += `|OVM_L2CrossDomainMessenger: | \`0x4200000000000000000000000000000000000007\`\n`
  md += `|OVM_L2ToL1MessagePasser: | \`0x4200000000000000000000000000000000000000\`\n`
  md += `|OVM_L1MessageSender: | \`0x4200000000000000000000000000000000000001\`\n`
  md += `|OVM_DeployerWhitelist: | \`0x4200000000000000000000000000000000000002\`\n`
  md += `|OVM_ECDSAContractAccount: | \`0x4200000000000000000000000000000000000003\`\n`
  md += `|OVM_ProxySequencerEntrypoint: | \`0x4200000000000000000000000000000000000004\`\n`
  md += `|OVM_SequencerEntrypoint: | \`0x4200000000000000000000000000000000000005\`\n`
  md += `|Lib_AddressManager: | \`0x4200000000000000000000000000000000000008\`\n`
  md += `|ERC1820Registry: | \`0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24\`\n`
  
  md += `\n---\n`
  md += `\n---\n`
  md += `## LAYER 1\n\n`
  for(let deployment of deployments) {
    md += `## ${deployment.toUpperCase()}\n\n`

    const chainId = Number(fs.readFileSync(`./deployments/${deployment}/.chainId`))
    const network = networks[chainId]

    md += `Network : __${network} (chain id: ${chainId})__\n\n`

    md += `|Contract|Address|Etherscan|\n`
    md += `|--|--|--|\n`

    const contracts = dirtree(`./deployments/${deployment}`).children
      .filter((child) => {
        return child.extension === '.json'
      }).map((child) => {
        return child.name.replace('.json', '')
      })

    for (const contract of contracts) {

      const deploymentInfo = require(`../deployments/${deployment}/${contract}.json`)

      const escPrefix = chainId !== 1 ? `${network}.` : ''
      const etherscanUrl = `https://${escPrefix}etherscan.io/address/${deploymentInfo.address}`
      md += `|${contract}|${deploymentInfo.address}|[Open](${etherscanUrl})|\n`

    }
    md += `---\n`
  }

  fs.writeFileSync(`./addresses.md`, md)

})().catch(console.error)
