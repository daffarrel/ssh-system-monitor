/* @flow */

import chai from 'chai'
import Logger, {waitForLog} from './logger'
import {servers} from '../../examples/config'
import {describe, it} from 'mocha'
import type {LoggerDatum} from '../types/index'

const assert = chai.assert

describe('logger', function () {
  this.timeout(20000)

  it("docker", async () => {
    const cmd    = 'docker logs --tail 1 -f (docker ps | grep "services.push.1" | awk \'{print $1}\')'
    const logger = new Logger({
      cmd:              cmd,
      serverDefinition: servers[0],
      logDefinition:    {
        grep: cmd,
        type: 'command',
        name: 'services.push'
      }
    })

    await logger.start()
    const datum: LoggerDatum = await waitForLog(logger)
    console.log('datum', datum)
    assert.equal(datum.source, 'stdin')
    await logger.terminate()
  })
})