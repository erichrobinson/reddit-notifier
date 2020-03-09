  import axios from 'axios'
  
  // Basic reddit implementation
  export async function getPosts(channel) {
    try {
      const response = await axios.get('https://reddit.com/r/channel/top.json?count=3');
      console.log(response.data.data.children);
    } catch (error) {
      console.error(error);
    }
  }