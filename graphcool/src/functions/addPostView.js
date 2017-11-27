import { fromEvent } from 'graphcool-lib';

export default async event => {
  try {
    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');

    const { id } = event.data;

    // get post
    const post = await getPost(api, id);

    const newViews = post.views !== null ? post.views + 1 : 1;
    // add 1 to post views
    await addView(api, id, newViews);

    // get graphcool user by facebook id
    return { data: { id } };
  } catch (e) {
    console.log(e);
    return { error: 'An unexpected error occured during adding a view.' };
  }
};

async function getPost(api, id) {
  const query = `
    query getPost($id: ID!) {
      Post(id: $id) {
        id
        views
      }
    }
  `;

  const variables = {
    id,
  };

  return api.request(query, variables).then(r => r.Post);
}

async function addView(api, id, views) {
  const mutation = `
    mutation updatePost($id: ID!, $views: Int!) {
      updatePost(
        id: $id
        views: $views
      ) {
        id
      }
    }
  `;

  const variables = {
    id,
    views,
  };

  return api.request(mutation, variables).then(r => r.updatePost);
}
