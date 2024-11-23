import React from 'react'

export const EmptyBanner = ({src, message}) => {
  return (
    <div className="noti-image">
        <img src={src} alt="Empty Banner" />
        <h3>{message}</h3>
    </div>
  )
}
