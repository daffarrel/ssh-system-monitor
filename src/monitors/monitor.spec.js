import chai from 'chai'
import {monitor} from './monitor'
import _ from 'lodash'
import {servers} from '../../examples/config'
import {DiskSpaceUsed} from '../commands/constants'

const assert = chai.assert

describe('monitor', function () {
  this.timeout(10000)

  it("emits data", done => {
    const m = monitor(servers, {rate: 250})

    m.on('data', data => {
      console.log('data', data)
      console.log('m.latest', m.latest)

      if (!_.every(_.map(servers, s => m.latest[s.ssh.host]))) {
        done(new Error(`latest values were not configured for every host`))
      }

      const host     = data.server.ssh.host
      const dataType = data.type

      if (m.latest[host][dataType] === undefined) {
        done(new Error(`Latest data wasn't stored for data type ${host}.${dataType}`))
      }

      m.terminate().then(() => done()).catch(done)
    })
  })

  it("emits percentage disk space used", done => {
    const m = monitor(servers, {rate: 250})

    m.on('data', data => {
      console.log('received data', data)
      const dataType = DiskSpaceUsed
      const path     = '/'

      if (data.type === dataType) {
        const latest = m.latest

        console.log('latest', latest)
        const host = data.server.ssh.host

        if (!_.every(_.map(servers, s => latest[s.ssh.host]))) {
          done(new Error(`latest values were not configured for every host`))
        }

        else if (latest[host][dataType][path] === undefined) {
          done(new Error(`Latest data wasn't stored for data type ${host}.${dataType}`))
        }

        else if (data.path !== path) {
          done(new Error(`path variable on the datum doesnt match path`))
        }

        else if (latest[host][dataType][path] !== data.value) {
          done(new Error(`value for disk space used emitted doesnt match the latest!`))
        }

        else {
          m.terminate().then(() => done()).catch(done)
        }

      }
    })
  })

})