  import axios from 'axios'
  
  function _buildPosts(posts) {
    return posts.map(post => {
      const { thumbnail, title, ups, url } = post.data
      return {
        thumbnail,
        title,
        ups,
        url
      }
    })
  }

  export async function getPosts(channel) {
    let result
    
    try {
      const response = await axios.get(`https://reddit.com/r/${channel.name}/top.json?limit=3`);
      result = _buildPosts(response.data.data.children)
    } catch (error) {
      console.error(error);
    }

    return result
  }