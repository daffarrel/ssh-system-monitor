/* @flow */

export const Stats = {
  cpuUsage:                'cpuUsage',
  swapUsedPercentage:      'swapUsedPercentage',
  memoryUsedPercentage:    'memoryUsedPercentage',
  averageLoad:             'averageLoad',
  percentageDiskSpaceUsed: 'percentageDiskSpaceUsed',
  processInfo:             'processInfo',
}

// A server that will be monitored
export type ServerDefinition = {
  name: string,
  ssh: {
    host: string,
    username: string,
    password?: string,
    privateKey?: string,
  },
  paths?: string[],
  processes?: ProcessDefinition[],
}

// A process that will be monitored
export type ProcessDefinition = {
  grep: string,
  id: string,
  name?: string,
  count?: number | number[],
}

// Defines the data type emitted by monitors
export type MonitorDatum = {
  server: ServerDefinition,
  type: Stat,
  value: any,
  extra: {
    path?: string, // when type is percentageDiskSpaceUsed
    process?: ProcessDefinition // when type is processInfo
  },
  timestamp: number,
}

// A collection of all the latest data from a host
export type HostStatsCollection = {
  cpuUsage: number | null,
  swapUsedPercentage: number | null,
  memoryUsedPercentage: number | null,
  averageLoad: SystemAverageLoad | null,
  percentageDiskSpaceUsed: {
    [path:string]: number | null
  },
  processInfo: {
    [processId:string]: ProcessInfo | null
  }
}

// Info about a process obtained from 'ps' command
export type ProcessInfo = {
  pid: number,
  pcpu: number,
  size: number,
  vsize: number,
  rss: number,
  etime: number,
  user: string,
  started: number,
}

export type SystemAverageLoad = {
  '1': number,
  '5': number,
  '15': number,
}

export type Stat =  $Keys<typeof Stats>;
