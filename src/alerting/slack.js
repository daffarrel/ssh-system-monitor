import Slack from 'slack-node'
import {isString} from 'lodash'

import {
  CpuUsage,
  SwapUsed,
  MemoryUsed,
  AverageLoad,
  DiskSpaceUsed
} from '../platforms/linux/constants'


function getCPUUsageAlert (data) {
  const host  = data.server.ssh.host
  const value = data.value
  const perc  = (value * 100).toFixed(0)

  return `${host} has an issue: CPU usage is at ${perc}%`
}

function getSwapUsageAlert (data) {
  const host  = data.server.ssh.host
  const value = data.value
  const perc  = (value * 100).toFixed(0)

  return `${host} has an issue: Swap usage is at ${perc}%`
}

function getMemoryUsageAlert (data) {
  const host  = data.server.ssh.host
  const value = data.value
  const perc  = (value * 100).toFixed(0)

  return `${host} has an issue: Memory usage is at ${perc}%`
}

function getAverageLoadAlert (data) {
  const host  = data.server.ssh.host
  const value = data.value

  return `${host} has an issue: Average load is at 1m=${value["1"]} 5m=${value["5"]} 15m=${value["15"]}`
}

function getDiskSpaceUsedAlert (data) {
  const host  = data.server.ssh.host
  const value = data.value
  const perc  = (value * 100).toFixed(0)
  const path  = data.path

  return `${host} has an issue: Disk space at ${path} is at ${perc}%`
}

function getAlertText (data) {
  const dataType = data.type

  switch (dataType) {
    case CpuUsage:
      return getCPUUsageAlert(data)
    case SwapUsed:
      return getSwapUsageAlert(data)
    case MemoryUsed:
      return getMemoryUsageAlert(data)
    case AverageLoad:
      return getAverageLoadAlert(data)
    case DiskSpaceUsed:
      return getDiskSpaceUsedAlert(data)
    default:
      throw new Error(`No idea what to do with ${dataType}`)
  }
}

/**
 *
 * @param monitor
 * @param {object} opts
 * @param {function} opts.callback - a function returning true or false or string if an alert should be sent
 * @param {number} [opts.limit] - max times an alert can be sent in ms. defaults to 20000ms
 * @param {object} opts.slack
 * @param {string} opts.slack.webhook - webhook url
 * @param {string} opts.slack.channel - channel name
 * @param {string} [opts.slack.username] - bot user name
 */
export default function (monitor, opts = {}) {
  const slackClient = new Slack()

  const {callback, slack = {}, limit = 20000} = opts

  const {webhook, channel, username = 'Monitoring'} = slack

  if (!webhook) throw new Error(`Must pass webhook`)
  if (!channel) throw new Error(`Must pass channel`)
  if (!callback) throw new Error(`Must pass callback`)

  slackClient.setWebhook(webhook)

  const lastSent = {}

  monitor.on('data', data => {
    const dataType = data.type
    const host     = data.server.ssh.host

    const alertLastSent     = lastSent[host] ? lastSent[host][dataType] || 0 : 0
    const timeSinceLastSent = Date.now() - alertLastSent

    if (timeSinceLastSent >= limit) {
      const res = callback(data)
      if (res) {
        let text

        if (isString(res)) {
          text = res
        }
        else {
          text = getAlertText(data)
        }

        slackClient.webhook({
          channel,
          username,
          text
        }, (err, resp) => {
          if (err) {
            console.log('error using slack webhook', err)
          }
          else {
            console.log(`successfully sent message via ${webhook}`)
          }
        })

        if (!lastSent[host]) lastSent[host] = {}
        lastSent[host][dataType] = Date.now()
      }
    }
    else {
      console.log(
        `alert for ${host}.${dataType} was last sent ${timeSinceLastSent / 1000}s ago which is less than ${limit / 1000}s so ignoring`
      )
    }
  })
}