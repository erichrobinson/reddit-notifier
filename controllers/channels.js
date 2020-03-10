function _buildChannels(userId, channels) {
  return channels.map(channel => {
    return {
      userId,
      name: channel,
      active: true
    }
  })
}

export async function addChannels(db, user, channels) {
  const result = {}
  
  try {
    const u = await db.collection('users').findOne({ user })
    // need to handle not finding a user
    if(u) {
      await db.collection('channels').insertMany(_buildChannels(u._id, channels), { ordered: false })
      result.status = 200
      result.message = `Sucessfully added channels for user ${user}`
      result.data = channels
    }
  }
  catch(err) {
    // sometimes errors are thrown even if other channels are inserted correctly because of duplicate key issues
    if(err.nInserted) {
      result.message(`Succesfully added channels for user ${user.user}`)
      result.status = 200
    } else {
      console.error(`Error adding channels for user: ${user}.${err}`)
      result.status = 500
      result.message = err
    }
  }

  return result
}

export async function updateChannel(db, update) {
  const result = {}
  const active = update.active.toLowerCase() === 'true' ? true : false

  try {
    const u = await db.collection('users').findOne({ user: update.user })

    // need to handle not finding a user
    if(u) {
      const channel = await db.collection('channels').updateOne({ userId: u._id, name: update.channel }, { $set: { active }})
      result.status = 200
      result.message = `Channel ${update.channel} set active to ${active} for user ${update.user}`
    }
  }
  catch(err) {
    console.error(err)
    result.status = 500
    result.message = err
  }

  return result
}

export async function getChannels(db, user) {
  const result = {}
  
  try {
    // need to handle not finding a user
    const u = await db.collection('users').findOne({ user })

    if(u) {
      const channels = await db.collection('channels').find({ userId: user._id }).toArray()
      result.status = 200
      result.message = `Found ${channels.length} channels for ${u.user}`
      result.data = channels.map(channel => {
        return {
          channel: channel.name,
          active: channel.active
        }
      })
    }
  }
  catch(err) {
    console.error(err)
    result.status = 500
    result.message = err
  }

  return result
}
