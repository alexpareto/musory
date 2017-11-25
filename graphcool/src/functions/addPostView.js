import { fromEvent } from 'graphcool-lib';

export default async event => {
  try {
    const graphcool = fromEvent(event);
    const api = graphcool.api('simple/v1');

    const { id } = event.data;

    // get post
    const post = await getPost(api, id);
    // add 1 to post views
    await addView(api, id, post.views + 1);

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

  return api.request(query, variables);
}

async function addView(api, id, views) {
  const mutation = `
    mutation addView($id: ID!, $views: Int!) {
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

  return api.request(mutation, variables);
}
