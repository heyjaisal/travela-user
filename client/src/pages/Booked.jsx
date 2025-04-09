import BookedEvent from '@/booked/booked-event';
import BookedProperty from '@/booked/Booked-property';
import React,{useState} from 'react'

function Booked() {
  const [activeTab, setActiveTab] = useState("property");
  return (
    <div>
      <div className='flex justify-between items-ceter mb-2'>
        <h1 className='text-xl pl-3.5 pt-5 font-bold font-sans'>All Property & event you booked</h1>

      </div>
      <div className='flex border-b border-gray-300 mb-4'>
        <button onClick={()=> setActiveTab("property")} className={`py-2 px-4 text-lg font-poppins border-b-4 ${activeTab === "property" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-600"}`}> Property</button>
        <button onClick={()=>setActiveTab("event")} className={`py-2 px-4 text-lg font-poppins border-b-4 ${activeTab === 'event' ? 'border-purple-600 text-purple-600':'border-transparent text-gray-600'}`}>Events</button>

      </div>

      {activeTab === 'property' ? <BookedProperty/> : <BookedEvent/>}

      
    </div>
  )
}

export default Booked