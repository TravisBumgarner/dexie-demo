import Dexie, { type Table } from 'dexie'

export enum ETaskStatus {
  NEW = 'NEW',
  COMPLETED = 'COMPLETED',
}

interface TTask {
  id: string
  status: ETaskStatus
  date: string
}

class MySubClassedDexie extends Dexie {
  tasks!: Table<TTask>

  constructor() {
    super('demo-db')
    this.version(5).stores({
      tasks: '[id], id, status, date',
    })
  }
}

const db = new MySubClassedDexie()

export default db
