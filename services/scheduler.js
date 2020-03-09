import cron from 'cron'
import mailer from './mailer'

export default function scheduleEmails() {
  // Basic cron functionality. Need to hook up to SendGrid API
  // get all active users
  // for each user => get channels
  // for each channel => get top posts
  // send data through sendgrids
  // var job = new CronJob('* * * * * *', function() {
  //   console.log('You will see this message every second');
  // }, null, true, 'America/Los_Angeles');
  // job.start();
}