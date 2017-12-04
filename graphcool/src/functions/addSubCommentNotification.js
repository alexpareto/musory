import { fromEvent } from 'graphcool-lib';

export default async event => {
  try {
    const subComment = event.data.SubComment.node;
    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');
    const url = '/muse?id=' + subComment.comment.post.id;

    if (subComment.author.id === subComment.comment.post.author.id) {
      // send notification to comment author
      const content = subComment.author.username + ' replied to your comment';
      const targetUserId = subComment.comment.author.id;
      await addNotification(api, content, url, targetUserId);
    } else if (subComment.author.id === subComment.comment.author.id) {
      // send notification to post author
      const content =
        subComment.author.username + ' replied to their comment your muse';
      const targetUserId = subComment.comment.post.author.id;
      await addNotification(api, content, url, targetUserId);
    }
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
