import { useState } from "react"
import moment from 'moment'
import db, { ETaskStatus } from './database'
import { useLiveQuery } from 'dexie-react-hooks'

const formatDateKeyLookup = (date: moment.Moment) => {
  return date.format('YYYY-MM-DD')
}

const App = () => {
  const [selectedDate, setSelectedDate] = useState(moment())
  const getPrevDate = () => setSelectedDate((moment(selectedDate).subtract(1, 'day')))
  const getNextDate = () => setSelectedDate((moment(selectedDate).add(1, 'day')))
  // const [toggleState, setToggleState] = useState(false)

  const selectedTasks = useLiveQuery(
    () => db.tasks.where('date').equals(formatDateKeyLookup(selectedDate)).toArray(),
     [
       selectedDate,
      //  toggleState
     ]
    )

  const addItem = () => {
    void db.tasks.add({
      id: `${Math.random()}`,
      date: formatDateKeyLookup(selectedDate),
      status: ETaskStatus.NEW
    })
  }

  const handleStatusChange = (id: string, status: ETaskStatus) => {
    db.tasks.where('id').equals(id).modify({ status })
    // setToggleState(prev => !prev)
  }

  return (
    <div>
      <div>
        <span>Change Date:</span>
        <button onClick={getPrevDate}>&lt;</button>
        <button onClick={getNextDate}>&gt;</button>
        <span>{selectedDate.toISOString()}</span>
      </div>
      <div>
        <button onClick={addItem}>Add Item</button>
      </div>
      <div>
        {selectedTasks?.map(({ id, status, date }) => (
          <div key={id} style={{ border: '1px solid black', margin: '1rem' }}>
            <ul>
              <li>Task Id: {id}</li>
              <li>{status}</li>
              <li>{date}</li>
            </ul>
            <span>Pick a button</span>
            <button disabled={status === ETaskStatus.NEW} onClick={() => handleStatusChange(id, ETaskStatus.NEW)}>New</button>
            <button disabled={status === ETaskStatus.COMPLETED} onClick={() => handleStatusChange(id, ETaskStatus.COMPLETED)}>Done</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
