import React from 'react'
import EmptyImage from '../assets/img/empty.png';

export const EmptyBanner = () => {
  return (
    <div className="noti-image">
        <img src={EmptyImage} alt="Empty Banner" />
        <h3>No tasks found</h3>
    </div>
  )
}
