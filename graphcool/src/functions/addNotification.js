import { fromEvent } from 'graphcool-lib';

export default async event => {
  try {
    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');

    // don't create a notification for commenting on their own post
    if (
      event.data.Comment.node.author.id ===
      event.data.Comment.node.post.author.id
    ) {
      return;
    }

    const content =
      event.data.Comment.node.author.username + ' replied to your post';
    const url = '/muse?id=' + event.data.Comment.node.post.id;
    const targetUserId = event.data.Comment.node.post.author.id;
    await addNotification(api, content, url, targetUserId);
    return;
  } catch (e) {
    console.log(e);
    return { error: 'An unexpected error occured during adding a view.' };
  }
};

async function addNotification(api, content, url, targetUserId) {
  const mutation = `
    mutation addNotification($content: String!, $url: String!, $targetUserId: ID!) {
      createNotification(
        content: $content
        url: $url
        targetUserId: $targetUserId
      ) {
        id
      }
    }
  `;

  const variables = {
    content,
    url,
    targetUserId,
  };

  return api.request(mutation, variables).then(r => r.addNotification);
}
