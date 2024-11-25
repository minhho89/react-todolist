import PropTypes from 'prop-types'
import React from 'react'

export const EmptyBanner = ({src, message}) => {
  return (
    <div className="noti-image">
       { src && <img src={src} alt="Empty Banner" />}
       { message ?? <h3>{message}</h3>}
    </div>
  )
}

EmptyBanner.propTypes = {
  src: PropTypes.string,
  message: PropTypes.string,
}