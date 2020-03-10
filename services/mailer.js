import sgMail from '@sendgrid/mail'
import { getPosts } from './reddit'

async function _generateEmailBody(db, user) {
  const channels = await db.collection('channels').find({ userId: user._id, active: true }).toArray()
  let greeting = `<div>Hello ${user.name || 'friend'},</div>`
  let preamble = '<div>See yesterday\'s top posts from your favorite channels<div>'
  let body = ''

  for(let i = 0; i < channels.length; i++) {
    const posts = await getPosts(channels[i])

    body += posts.map((post, i) => {

      let header
      if(i === 0) {
        const channelName = channels[i].name
        const url = `https://www.reddit.com/r/${channelName}/top`
        header = `<div style="border: 2px solid black; font-size: 20px; text-align: center; padding: 10px 0; margin: 10px 0;">
            <span>${channelName}:</span><a href=${url}>${url}</a>
          </div>`
      } else {
        header = ''
      }

      return `${header}<a href=${post.url} style="display: block; margin: 15x 0;">
          <div style="margin-bottom: 15px; height: 250px; width: 100%; background: url(${post.thumbnail}) no-repeat center center; background-size: cover;"></div>
          <div style="text-decoration: none; display: inline-block; border-radius: 100px; padding: 10px 20px; background-color: orange; color: white; text-align: center;">${post.ups} ups</div>
          <div style="margin-left: 20px; text-decoration: none; display: inline-block; font-size: 16px;">${post.title}</div>
        </a>`
    })
  }

  return `${greeting}${preamble}${body}`
}

export default async function sendMail(db, user) {
  // Obviously wouldn't expose this secret usually
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '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');

  const msg = {
    to: user.email,
    from: 'dailydigest@notreddit.io',
    subject: 'Daily Reddit Digest',
    html: `${await _generateEmailBody(db, user)}`
  };

  sgMail.send(msg);
}