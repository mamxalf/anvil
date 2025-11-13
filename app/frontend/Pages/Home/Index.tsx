// import React from 'react'
import { PageProps } from '@/types'

interface HomeProps extends PageProps {
  message: string
}

export default function Index({ message, auth, flash }: HomeProps) {
  return (
    <div className="container">
      <h1>Welcome to FPL Clone!</h1>
      <p>{message}</p>
      
      {flash.success && (
        <div className="alert alert-success">{flash.success}</div>
      )}
      
      {auth.user ? (
        <p>Logged in as: {auth.user.name}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  )
}