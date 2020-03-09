import sgMail from '@sendgrid/mail'
import { getPosts } from './reddit'

function _generateEmailBody(name = 'friend', channels = []) {
  let greeting = `Hello ${name},`
  let body = '';

  channels.forEach(async channel => {
    const posts = await getPosts(channel)

    posts.forEach(post => {
      // thumbnail
      // headline
      // text
      // link

      body += postHtml
    })
  })

  return `${greeting}${body}`
}

export default function sendMail() {
  // Basic SG implementation
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // const msg = {
  //   to: 'robinson.erich@gmail.com',
  //   from: 'robinson.erich@gmail.com',
  //   subject: 'Sending with SendGrid is Fun',
  //   html: _generateEmailBody(),
  // };

  // sgMail.send(msg);
}