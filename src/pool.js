import genericPool from 'generic-pool'
import Client from 'ssh2'

export function constructPool (server) {
  const factory = {
    create:  () => {
      return new Promise((resolve, reject) => {
        const client = new Client()
        client.once('ready', () => resolve(client))
        const ssh = server.ssh
        client.connect(ssh)
      })
    },
    destroy: client => {
      return new Promise((resolve, reject) => {
        client.once('end', () => resolve())
        client.end()
      })
    },
  }

  const opts = {
    max: 10,
    min: 2,
  }

  const pool = genericPool.createPool(factory, opts)

  return pool
}
