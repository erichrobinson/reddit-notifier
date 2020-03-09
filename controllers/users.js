export async function addUser(db, user) {
  const result = {}
  user.active = true
    
  try {
    await db.collection('users').insertOne(user)
    result.status = 200
    result.message = `Created user ${user.user}`
  }
  catch(err) {
    console.error(`Error creating user: ${err}`)
    result.status = 500
    result.message = err.message
  }

  return result
}

export async function updateUser(db, data) {
  let { user, email, active, name } = data
  const update = {}
  const result = {}
  
  if(email) update.email = email
  if(name) update.name = name
  if(active !== undefined) {
    active = active.toLowerCase() === 'true' ? true : false
  }

  try {
    await db.collection('users').updateOne({ user: data.user }, { $set: update })
    result.status = 200
    result.message = `User ${data.user} succesfully updated`
  }
  catch(err) {
    console.error(`Error updating user: ${user}. ${err}`)
    result.status = 500
    result.message = err
  }

  return result
}

export async function getUser(db, user) {

}