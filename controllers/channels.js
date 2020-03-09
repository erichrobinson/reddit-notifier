import { response } from "express"

function _buildChannels(userId, channels) {
  // what if the channel exists?
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
    // handle not finding a user
    if(u) {
      await db.collection('channels').insertMany(_buildChannels(u._id, channels), { ordered: false })
      result.status = 200
      result.message = `Sucessfully added channels for user ${user.user}`
      result.data = channels
    }
  }
  catch(err) {
    // sometimes errors are thrown even if other channels are inserted correctly
    if(err.nInserted) {
      result.message(`Succesfully added channel for user ${user.user}`)
    }
    console.error(`Error adding channels for user: ${user}.${err}`)
    result.status = 500
    result.message = err
  }

  return result
}

export async function updateChannel(db, update) {
  const result = {}
  const active = update.active.toLowerCase() === 'true' ? true : false

  console.log('active', update.active, active)

  try {
    const u = await db.collection('users').findOne({ user: update.user })

    if(u) {
      const channel = await db.collection('channels').updateOne({ userId: u._id, name: update.channel }, { $set: { active }})
      console.log('channel', channel)
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
    const u = await db.collection('users').findOne({ user })
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
  catch(err) {
    console.error(err)
    result.status = 500
    result.message = err
  }

  return result
}